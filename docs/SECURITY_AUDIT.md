# Security, Reliability & Quality Audit Report

This security audit was performed via source code analysis and static inspection. Every finding documented below includes direct code evidence, severity rating, real-world impact, and concrete remediation steps.

---

## 1. Summary of Findings

| ID | Finding | Severity | Affected Component | Impact |
|---|---|---|---|---|
| **SEC-01** | Client-controlled order prices & totals | **CRITICAL** | `lib/orderService.ts`, `app/checkout/page.tsx` | Order price tampering, financial loss |
| **SEC-02** | Unauthenticated transactional email endpoints | **CRITICAL** | `app/api/send-order-email`, `app/api/send-status-email` | Email spoofing, reputation damage, Resend quota exhaustion |
| **SEC-03** | HTML Injection / Template Injection in emails | **HIGH** | `app/api/send-order-email/route.ts` | Phishing, defacement via order receipt emails |
| **SEC-04** | Inventory race condition & non-atomic stock reduction | **HIGH** | `lib/orderService.ts` | Overselling items when multiple customers buy simultaneously |
| **SEC-05** | Purely client-side admin route protection | **HIGH** | `app/admin/layout.tsx` | Vulnerable to unauthorized access if Supabase RLS is loose |
| **SEC-06** | Lack of rate limiting on API & auth actions | **MEDIUM** | `app/api/*`, `lib/authService.ts` | Brute force, denial of service |
| **SEC-07** | Hardcoded admin recipient email & production domains | **MEDIUM** | `app/api/send-order-email`, `lib/authService.ts` | Misdirected admin alerts, broken reset redirects |
| **SEC-08** | Inconsistent user role naming | **LOW** | `lib/authService.ts`, `lib/profileService.ts` | Customer confusion, permission mismatches |

---

## 2. In-Depth Findings & Vulnerability Analysis

### SEC-01: Client-Controlled Order Prices & Totals
- **Severity**: **CRITICAL**
- **Affected File**: [`lib/orderService.ts:101-125`](file:///Users/dev/Documents/jja/lib/orderService.ts#L101-L125)
- **Evidence**:
  ```ts
  // In lib/orderService.ts:
  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: order.user_id,
        customer: order.customer,
        email: order.email,
        phone: order.phone,
        address: order.address,
        subtotal: order.subtotal,   // <-- From client!
        shipping: order.shipping,   // <-- From client!
        total: order.total,         // <-- From client!
        payment: order.payment,
        status: order.status,
      },
    ]);
  ```
- **Impact**: A customer or attacker can modify `subtotal`, `shipping`, and `total` in browser memory or via network requests to pay NPR 1 for NPR 10,000 worth of clothing. The database accepts whatever number the browser submits.
- **Remediation**:
  Move order creation into a **Next.js Server Action or API Route** (or Supabase Database Function / RPC). Look up product prices in the database server-side, re-calculate coupons and shipping server-side, and calculate the total securely.

---

### SEC-02: Unauthenticated Transactional Email Endpoints
- **Severity**: **CRITICAL**
- **Affected Files**:
  - [`app/api/send-order-email/route.ts:6-16`](file:///Users/dev/Documents/jja/app/api/send-order-email/route.ts#L6-L16)
  - [`app/api/send-status-email/route.ts:6-16`](file:///Users/dev/Documents/jja/app/api/send-status-email/route.ts#L6-L16)
- **Evidence**:
  Both routes accept `POST` requests and parse JSON bodies with **no authentication, no authorization, and no rate limiting**.
  ```ts
  // In app/api/send-order-email/route.ts:
  export async function POST(req: Request) {
    try {
      const { customer, email, orderId, total, payment, address, items } = await req.json();
      await resend.emails.send({
        from: "EXRONIX <orders@exronix.store>",
        to: email, // <-- Arbitrary recipient!
        subject: `Your Order #${orderId} is Confirmed 🎉`,
        html,
      });
  ```
- **Impact**: Anyone on the internet can send arbitrary emails to any email address pretending to be `orders@exronix.store`, causing domain blacklisting, phishing, and rapid exhaustion of your Resend email quotas.
- **Remediation**:
  Verify the caller's Supabase session token in the API route before sending emails. For `send-order-email`, only send after confirming the order actually exists in the `orders` table. For `send-status-email`, verify that the caller is an authenticated user with `role === 'admin'`.

---

### SEC-03: HTML Injection / Template Injection in Email Dispatch
- **Severity**: **HIGH**
- **Affected Files**: [`app/api/send-order-email/route.ts:60-125`](file:///Users/dev/Documents/jja/app/api/send-order-email/route.ts#L60-L125)
- **Evidence**:
  ```ts
  const html = `
    <h1>EXRONIX</h1>
    <h2>Hi ${customer},</h2>
    <p>Shipping Address: ${address}</p>
    ...
  `;
  ```
- **Impact**: If a user enters HTML/JavaScript tags in their name or address (e.g. `<a href="...">click here</a>`), it is injected into the raw email markup.
- **Remediation**:
  Use an HTML escape helper (or React Email / standard email template compiler) to sanitize all user-supplied strings before interpolating them into HTML templates.

---

### SEC-04: Non-Atomic Stock Deduction (Race Condition)
- **Severity**: **HIGH**
- **Affected File**: [`lib/orderService.ts:180-210`](file:///Users/dev/Documents/jja/lib/orderService.ts#L180-L210)
- **Evidence**:
  ```ts
  for (const item of order.items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.id)
      .single();

    await supabase
      .from("products")
      .update({ stock: Math.max(0, product.stock - item.quantity) })
      .eq("id", item.id);
  }
  ```
- **Impact**: In a multi-user rush (e.g. sale event), two customers reading stock `1` will both compute `1 - 1 = 0`. Both orders will be created, overselling limited inventory.
- **Remediation**:
  Use a PostgreSQL atomic update via a Supabase RPC:
  ```sql
  UPDATE products
  SET stock = stock - requested_qty
  WHERE id = target_id AND stock >= requested_qty;
  ```

---

### SEC-05: Purely Client-Side Admin Route Guard
- **Severity**: **HIGH**
- **Affected File**: [`app/admin/layout.tsx:36-76`](file:///Users/dev/Documents/jja/app/admin/layout.tsx#L36-L76)
- **Evidence**:
  The admin verification is done solely via `useEffect` in the browser:
  ```ts
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    router.replace("/");
  }
  ```
- **Impact**: If Supabase Row-Level Security (RLS) is disabled or improperly configured on tables (`products`, `orders`, `coupons`, `shipping_rates`, `store_settings`), an authenticated customer can execute direct PostgREST calls (e.g. using `fetch` in the browser console) to delete products, edit order statuses, or alter store settings.
- **Remediation**:
  Enable PostgreSQL Row Level Security (RLS) on all tables with policies:
  ```sql
  CREATE POLICY "Admins full access" ON products
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
      )
    );
  ```
  Additionally, add a Next.js `middleware.ts` to inspect session cookies on the server before rendering `/admin/*`.

---

### SEC-06: Hardcoded Admin Recipient Email
- **Severity**: **MEDIUM**
- **Affected File**: [`app/api/send-order-email/route.ts:165`](file:///Users/dev/Documents/jja/app/api/send-order-email/route.ts#L165)
- **Evidence**:
  ```ts
  to: "support@exronix.store", // Configured via ADMIN_EMAIL
  ```
- **Impact**: Notifications of new orders are hardcoded to the previous developer/owner's personal email address instead of the active store owner's address.
- **Remediation**:
  Replace with an environment variable (`ADMIN_NOTIFICATION_EMAIL`) or query `store_settings.support_email`.

---

### SEC-07: Inconsistent Role Naming
- **Severity**: **LOW**
- **Affected Files**:
  - `lib/authService.ts:36`: assigns `role: "customer"` on signup.
  - `lib/profileService.ts:44`: assigns `role: "user"` on profile creation.
- **Remediation**:
  Standardize on a single role enum: `'admin' | 'customer'`.
