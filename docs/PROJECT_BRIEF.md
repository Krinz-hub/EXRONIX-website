# Zayna Apparel — Project Brief & Overview

## 1. Executive Summary

**Zayna Apparel** (branded in the codebase as **ZAYNA** / **Zayna Studio**, with the tagline *"Wear the Grace"*) is a single-brand direct-to-consumer (D2C) e-commerce web application focused on oversized streetwear apparel.

The application targets the **Nepal market**, featuring local pricing in **Nepalese Rupees (NPR)**, nationwide provincial shipping options, and **Cash on Delivery (COD)** as the primary fulfillment mechanism.

---

## 2. Target Users & Personas

| User Role | Description | Core Capabilities |
|---|---|---|
| **Guest Shopper** | Unauthenticated visitor browsing the catalog | Browse products, filter by category/price/size/color, search products, view product details, read customer reviews, view legal & policy pages. *(Note: Adding to cart or wishlist currently requires logging in).* |
| **Registered Customer** | Authenticated shopper with Supabase account | Manage profile & shipping addresses, view past orders with live status timelines, add items to cart, use coupons, place Cash on Delivery orders, submit product reviews (verified purchase check), download PDF invoices. |
| **Store Administrator** | Authenticated user with `role: "admin"` in `profiles` | Access `/admin` dashboard: create/edit/delete products, manage inventory & stock levels, view/update customer orders, update tracking numbers & dispatch status emails via Resend, manage discount coupons, configure provincial shipping rates, adjust store settings (store open/closed, COD toggles). |

---

## 3. Technology Stack Summary

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.2.12 (App Router) | React Server & Client Components, Turbopack dev server |
| **UI Library** | React 19.2.4 | Client-side state hooks, context providers |
| **Language** | TypeScript 5 | Strict typing enabled with Next.js TS configurations |
| **Styling** | Tailwind CSS v4 & PostCSS | Using `@tailwindcss/postcss` v4, `tw-animate-css`, OKLCH CSS tokens |
| **Component Kit** | shadcn / Base UI (`@base-ui/react`) | Custom alert dialogs, buttons, modals |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) | `@supabase/supabase-js` v2.111.0. Direct client-side queries |
| **Icons** | Lucide React (`lucide-react`) & React Icons | Comprehensive feather-style vector icon set |
| **Notifications** | Sonner (`sonner`) | Rich toast notifications |
| **Document Generation** | jsPDF (`jspdf` + `jspdf-autotable`) | Client-side invoice PDF generation |
| **Transactional Email** | Resend (`resend`) | Server-side transactional email delivery via API routes |
| **Analytics Charts** | Chart.js & React-ChartJS-2 | Revenue and order volume trend charts |

---

## 4. Current Implementation Status

```
[Storefront UI]           ████████████████████  100% Implemented & Styled
[Supabase Client Auth]    ██████████████████░░   90% Implemented (Email/Password, Profile sync)
[Catalog & Filters]       ██████████████████░░   90% Implemented (Category, Size, Color, Price)
[Cart & Wishlist]         ████████████████░░░░   80% Implemented (Requires Login, syncs with DB)
[Checkout Flow]           ██████████████░░░░░░   70% Implemented (COD works; client-side price calculation)
[Admin Dashboard]         ████████████████░░░░   80% Implemented (Products, Orders, Coupons, Shipping)
[Invoice Generation]      ████████████████████  100% Implemented (jsPDF download)
[Email Dispatch]          ██████████████░░░░░░   70% Implemented (Order & status notifications via Resend)
[Online Payment Gateways] ░░░░░░░░░░░░░░░░░░░░    0% Missing (eSewa & Khalti marked "Coming Soon")
[Backend RLS & Security]  ████░░░░░░░░░░░░░░░░   20% Critical Gaps (Admin logic runs on client, no API validation)
```

---

## 5. Key Business Flows

1. **Browsing to Purchase**: Customer browses `/collections` -> selects a product (`/products/[id]`) -> selects size & color -> adds to cart (`/cart`) or clicks "Buy Now" -> proceeds to `/checkout` -> enters address or selects saved address -> applies coupon (optional) -> places Cash on Delivery order -> redirected to `/checkout/success` -> receives confirmation email and can download PDF invoice.
2. **Order Fulfillment**: Admin logs in (`/admin/login`) -> visits `/admin/orders` -> views order details (`/admin/orders/[id]`) -> updates status (Pending -> Confirmed -> Processing -> Shipped -> Delivered) -> enters courier name, tracking number, tracking link -> system triggers `/api/send-status-email` to inform customer via Resend.
