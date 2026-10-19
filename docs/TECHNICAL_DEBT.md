# Technical Debt, Incomplete Features & Roadmap

This document catalogues existing architectural weaknesses, incomplete features, dead code, and technical debt ranked by priority.

---

## 1. Prioritized Technical Debt Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│ CRITICAL (P0) - Security & Financial Integrity                         │
│ • Client-side order price calculation (SEC-01)                         │
│ • Unauthenticated email API routes (SEC-02)                            │
│ • Stock deduction race condition (SEC-04)                              │
├────────────────────────────────────────────────────────────────────────┤
│ HIGH (P1) - Architectural Duplication & Broken Assets                  │
│ • Duplicate product services (`lib/products.ts` vs `productService.ts`) │
│ • 404 Missing category banner images (`FeaturedCategories.tsx`)        │
│ • 404 Broken refund policy URL in `sitemap.ts`                         │
│ • Mocked Admin Category Creation (no DB or localStorage saving)        │
├────────────────────────────────────────────────────────────────────────┤
│ MEDIUM (P2) - Incomplete Features & Dead Code                          │
│ • Online payment gateways (eSewa & Khalti marked "Coming Soon")        │
│ • Guest checkout / Guest cart (customers forced to login to add items) │
│ • 7 Unused analytics components in `components/analytics/`             │
│ • 20 Unused images in `public/images/` (~10MB repo bloat)              │
├────────────────────────────────────────────────────────────────────────┤
│ LOW (P3) - Code Quality & Linting                                      │
│ • 118 ESLint problems (101 errors, mostly `@typescript-eslint/no-any`) │
│ • Missing automated testing suite (Vitest / Playwright)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Depth Analysis of Incomplete Features

### 2.1 Category Management is Completely Mocked
- **Location**: [`app/admin/categories/add/page.tsx:23-34`](file:///Users/dev/Documents/jja/app/admin/categories/add/page.tsx#L23-L34)
- **Problem**: When an administrator fills in the "Add Category" form and clicks save, the code displays a success toast and redirects without saving to either Supabase or `localStorage`.
- **Admin Listing**: [`app/admin/categories/page.tsx`](file:///Users/dev/Documents/jja/app/admin/categories/page.tsx) reads from the browser's `localStorage.getItem("zayna-categories")`. It is not connected to a database table.
- **Empty Service**: [`lib/categories.ts`](file:///Users/dev/Documents/jja/lib/categories.ts) is an empty 0-byte file.
- **Remediation**: Create a `categories` table in Supabase and wire up standard CRUD methods in `lib/categories.ts`.

---

### 2.2 Duplicate Product Services
- **Location**: [`lib/products.ts`](file:///Users/dev/Documents/jja/lib/products.ts) (1,087 lines) and [`lib/productService.ts`](file:///Users/dev/Documents/jja/lib/productService.ts) (941 lines).
- **Problem**: Both files implement nearly identical functions (`getProducts`, `getProductById`, `addProduct`, `updateProduct`, `decreaseProductStock`).
- **Downstream impact**:
  - `app/admin/products/page.tsx` imports from `lib/products.ts`.
  - `app/collections/page.tsx` imports from `lib/productService.ts`.
  - If a developer fixes a bug or adds a field in `productService.ts`, the admin panel will continue using the older version from `products.ts`.
- **Remediation**: Consolidate all product functions into `lib/productService.ts` and delete `lib/products.ts`.

---

### 2.3 Guest Shopping Restriction
- **Location**: [`context/CartContext.tsx:141-146`](file:///Users/dev/Documents/jja/context/CartContext.tsx#L141-L146)
- **Problem**: When a guest visitor clicks "Add to Cart", the application rejects them with a toast: *"Please login to add items to your cart."*
- **E-Commerce impact**: Forcing users to register before adding items introduces severe funnel friction and high cart abandonment.
- **Remediation**: Support anonymous local-storage carts that sync to Supabase upon user sign-in.

---

### 2.4 Online Payment Gateways Missing
- **Location**: [`app/checkout/page.tsx:838-875`](file:///Users/dev/Documents/jja/app/checkout/page.tsx#L838-L875)
- **Problem**: eSewa and Khalti payment options are disabled buttons with "Coming Soon" badges. The only functional payment option is Cash on Delivery.
- **Remediation**: Integrate payment verification via webhooks before confirming orders.

---

### 2.5 Dead Code and Abandoned Components

| Component / File | Size / Location | Reason for Removal |
|---|---|---|
| `components/data/products.ts` | 34 lines | Unused hardcoded products array from early prototyping. |
| `components/ProductDetails.tsx` | 189 lines | Unused legacy details component. `app/products/[id]/page.tsx` uses custom composition. |
| `components/RelatedProducts.tsx` | 69 lines | Unused duplicate of `components/product/RelatedProducts.tsx`. |
| `components/analytics/*` (7 files) | ~600 lines | Legacy charts. `app/admin/analytics/page.tsx` writes its own UI directly. |
| `lib/analyticsService.ts` | 177 lines | Redundant with `lib/orderService.ts:getAnalytics()`. |
| `app/test/page.tsx` | 45 lines | Scratch route for testing Supabase connection. |
| `app/test-storage/page.tsx` | 39 lines | Scratch route for testing Supabase image upload. |
| 20 JPEGs in `public/images/` | ~10 MB | Seed images with zero references in application code. |

---

## 3. Recommended Remediation Roadmap

### Phase 1: Security & Financial Stability (Weeks 1–2)
1. Convert `createOrder` to a Next.js Server Action with database-side price calculation.
2. Protect `/api/send-order-email` and `/api/send-status-email` with session token verification and input sanitization.
3. Replace sequential stock reduction with atomic database RPCs.

### Phase 2: Architecture Consolidation (Weeks 3–4)
1. Delete duplicate `lib/products.ts` and route all product queries through `lib/productService.ts`.
2. Delete unused test routes (`/test`, `/test-storage`) and dead components (`components/analytics/*`, `components/ProductDetails.tsx`).
3. Connect Category management to a real Supabase `categories` table.

### Phase 3: Conversion & Commerce Expansion (Weeks 5–6)
1. Implement guest cart persistence via `localStorage`.
2. Connect real payment gateways (eSewa / Khalti / Stripe).
3. Create centralized `siteConfig` to make branding and currency single-line configuration changes.
