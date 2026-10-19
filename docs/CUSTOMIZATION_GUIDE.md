# Feature Customization & Development Guide

This guide details how to modify the application according to your own business and design vision. For visual assets, store names, and logo replacements, see [BRANDING_AUDIT.md](./BRANDING_AUDIT.md).

---

## 1. Customizing Design, Theme & Typography

### 1.1 Colors & Design Tokens
The design system is defined in [`app/globals.css`](file:///Users/dev/Documents/jja/app/globals.css) using **Tailwind CSS v4** `@theme inline` and **OKLCH** color spaces.

- **Light Mode Tokens** (`:root`, lines 7–57):
  - `--background`: Background color (`oklch(1 0 0)` = pure white).
  - `--foreground`: Text color (`oklch(0.145 0 0)` = deep black).
  - `--primary`: Primary brand button/accent color.
  - `--radius`: Global border-radius (`0.625rem` = 10px).
- **Dark Mode Tokens** (`.dark`, lines 59–101):
  - `--background`: Dark surface (`oklch(0.145 0 0)` = rich dark gray).
  - `--foreground`: Text in dark mode (`oklch(0.985 0 0)` = off-white).

### 1.2 Typography
Defined in [`app/layout.tsx:14-22`](file:///Users/dev/Documents/jja/app/layout.tsx#L14-L22):
- Default fonts are **Geist Sans** (`--font-geist-sans`) and **Geist Mono** (`--font-geist-mono`) imported from `next/font/google`.
- **To change fonts**:
  Replace `Geist` in `app/layout.tsx` with any Google font (e.g. `Inter`, `Outfit`, `Playfair_Display`):
  ```tsx
  import { Outfit } from "next/font/google";
  const fontSans = Outfit({ subsets: ["latin"], variable: "--font-sans" });
  ```

---

## 2. Customizing Homepage & Navigation

### 2.1 Homepage Structure
Located in [`app/page.tsx`](file:///Users/dev/Documents/jja/app/page.tsx):
- `Hero`: The large banner section with background image and CTA buttons ([`components/Hero.tsx`](file:///Users/dev/Documents/jja/components/Hero.tsx)).
- `FeaturedCategories`: 4 category cards with hover animation ([`components/FeaturedCategories.tsx`](file:///Users/dev/Documents/jja/components/FeaturedCategories.tsx)).
- `BestSellingProducts`: Grid of top products fetched dynamically ([`components/BestSellingProducts.tsx`](file:///Users/dev/Documents/jja/components/BestSellingProducts.tsx)).
- `WhyChoose`: Value propositions (e.g., Premium Quality, Free Shipping) ([`components/WhyChoose.tsx`](file:///Users/dev/Documents/jja/components/WhyChoose.tsx)).
- `FeaturedProducts`: Secondary product showcase ([`components/FeaturedProducts.tsx`](file:///Users/dev/Documents/jja/components/FeaturedProducts.tsx)).

### 2.2 Navigation Menu
- Desktop links: [`components/navbar/DesktopMenu.tsx`](file:///Users/dev/Documents/jja/components/navbar/DesktopMenu.tsx).
- Mobile links: [`components/navbar/MobileMenu.tsx`](file:///Users/dev/Documents/jja/components/navbar/MobileMenu.tsx).
- Icons & badges (Cart, Wishlist, Search): [`components/navbar/NavIcons.tsx`](file:///Users/dev/Documents/jja/components/navbar/NavIcons.tsx).
- Footer columns & copyright: [`components/Footer.tsx`](file:///Users/dev/Documents/jja/components/Footer.tsx).

---

## 3. Product Catalog, Filtering & Details

### 3.1 Collections & Filters
- **Page Entry**: [`app/collections/page.tsx`](file:///Users/dev/Documents/jja/app/collections/page.tsx).
- **Filter Sidebar**: [`components/collections/FilterSidebar.tsx`](file:///Users/dev/Documents/jja/components/collections/FilterSidebar.tsx).
  - Handles category selection, price range sliders, size toggles (S, M, L, XL), and color swatches.
- **Product Card**: [`components/ProductCard.tsx`](file:///Users/dev/Documents/jja/components/ProductCard.tsx).
  - Handles image display, price formatting, wishlist toggle, and quick view modal trigger.

### 3.2 Product Details Page
- **Page Entry**: [`app/products/[id]/page.tsx`](file:///Users/dev/Documents/jja/app/products/[id]/page.tsx).
- **Image Gallery**: [`components/product/ProductImageGallery.tsx`](file:///Users/dev/Documents/jja/components/product/ProductImageGallery.tsx).
- **Variant Selector & Buy Now**: [`components/ProductActions.tsx`](file:///Users/dev/Documents/jja/components/ProductActions.tsx).
- **Reviews**: [`components/product/ProductReviews.tsx`](file:///Users/dev/Documents/jja/components/product/ProductReviews.tsx).

---

## 4. Cart & Checkout Customization

### 4.1 Enabling Guest Cart
Currently, [`context/CartContext.tsx:141-146`](file:///Users/dev/Documents/jja/context/CartContext.tsx#L141-L146) rejects unauthenticated users:
```ts
if (!user) {
  toast.error("Please login to add items to your cart.");
  return;
}
```
**To allow Guest Cart**:
Store cart items in `localStorage` when `!user`. When the user logs in, merge local storage items into the Supabase `cart` table in `context/CartContext.tsx:loadCart()`.

### 4.2 Adding Payment Gateways (eSewa / Khalti / Stripe / Razorpay)
Located in [`app/checkout/page.tsx:838-875`](file:///Users/dev/Documents/jja/app/checkout/page.tsx#L838-L875):
- Currently, eSewa and Khalti radio buttons are disabled with "Coming Soon" badges.
- **To integrate an online gateway**:
  1. Add an SDK or server API route for payment intent creation (e.g. `/api/checkout/esewa` or `/api/checkout/stripe`).
  2. In `app/checkout/page.tsx`, when `form.payment !== 'Cash on Delivery'`, call the payment initiation endpoint instead of directly calling `createOrder()`.
  3. Verify payment response with a server webhook before marking the order as `status: 'Confirmed'`.

---

## 5. Admin Panel Customization

### 5.1 Admin Menu & Role Guard
- Menu items and icons: [`app/admin/layout.tsx:99-140`](file:///Users/dev/Documents/jja/app/admin/layout.tsx#L99-L140).
- Admin role check: [`app/admin/layout.tsx:36-76`](file:///Users/dev/Documents/jja/app/admin/layout.tsx#L36-L76).
- **To grant admin access to a user**:
  In Supabase SQL Editor or Table Editor:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

### 5.2 Product Management
- Adding products: [`app/admin/products/add/page.tsx`](file:///Users/dev/Documents/jja/app/admin/products/add/page.tsx).
- Editing products: [`app/admin/products/edit/[id]/page.tsx`](file:///Users/dev/Documents/jja/app/admin/products/edit/[id]/page.tsx).
- *Important*: `app/admin/products` currently imports from [`lib/products.ts`](file:///Users/dev/Documents/jja/lib/products.ts). Ensure any schema changes to products are reflected in both `lib/products.ts` and `lib/productService.ts`.

---

## 6. Currency & Localization

Currently, the currency symbol `"NPR"` is hardcoded in 61 places.

**To change currency**:
Create a utility function in [`lib/utils.ts`](file:///Users/dev/Documents/jja/lib/utils.ts):
```ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Or 'EUR', 'INR', 'NPR', etc.
  }).format(amount);
}
```
Replace raw `"NPR " + total.toLocaleString()` calls across components with `formatCurrency(total)`.
