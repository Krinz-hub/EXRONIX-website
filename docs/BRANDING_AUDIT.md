# Branding, Naming & Visual Asset Audit

This audit documents every brand identity element, string, and visual asset across the codebase so you can customize or re-brand the website completely.

---

## 1. Brand Names & Text Occurrences

### 1.1 Store Names, Titles & Slogans Inventory

| Brand String | Occurrences | Key File Locations | Recommended Source |
|---|---|---|---|
| **"Zayna Studio"** | 38 | `app/layout.tsx:30,35,50,54,71`, `components/Footer.tsx:14,149`, `app/about/page.tsx:10`, `app/api/send-order-email/route.ts:49,65`, `app/api/send-status-email/route.ts:79,113` | Centralized site config (`siteConfig.name`) |
| **"ZAYNA"** | 46 | `components/navbar/Navbar.tsx:126`, `components/Hero.tsx:112`, `app/admin/layout.tsx:175,232`, `utils/generateInvoice.ts:37`, `app/login/page.tsx:84`, `app/register/page.tsx:85` | Centralized site config (`siteConfig.shortName`) |
| **"Wear the Grace"** | 8 | `app/layout.tsx:30,35,45,64,91`, `app/api/send-order-email/route.ts:53`, `components/navbar/MobileMenu.tsx:186`, `components/Footer.tsx:18` | Centralized site config (`siteConfig.tagline`) |
| **"MINIMAL • BOLD • TIMELESS"** | 1 | `components/Hero.tsx:32` | Homepage Hero content (`siteConfig.subtagline`) |
| **"support@zaynastudio.store"** | 4 | `components/Footer.tsx:123`, `app/contact/page.tsx:68`, `app/privacy-policy/page.tsx:144`, `lib/storeSettingsService.ts:8` | Centralized config / database `store_settings` |
| **"orders@zaynastudio.store"** | 2 | `app/api/send-order-email/route.ts:158`, `app/api/send-status-email/route.ts:72` | Environment variable `EMAIL_FROM` |
| **"https://www.zaynastudio.store"** | 8 | `app/layout.tsx:26,69`, `app/sitemap.ts:5`, `app/robots.ts:19`, `lib/authService.ts:96`, `app/api/send-order-email/route.ts:127` | Environment variable `NEXT_PUBLIC_SITE_URL` |
| **"https://instagram.com/zaynastudio_"** | 1 | `components/Footer.tsx:133` | Centralized site config (`siteConfig.socials.instagram`) |
| **"NPR" / Currency** | 61 | `app/checkout/page.tsx:288`, `components/ProductCard.tsx:125`, `utils/generateInvoice.ts:88`, `app/api/send-order-email/route.ts:29,104` | Centralized currency formatter (`formatPrice`) |

---

## 2. Visual Assets Inventory

All local visual assets are located in `public/` and `app/`.

### 2.1 Logo & Core Identity Assets

| Asset Path | Format & Dimensions | Size | Where Used | Role & Status |
|---|---|---|---|---|
| `public/images/logo.png` | PNG (1024 × 1024, RGBA) | 1.4 MB | `components/navbar/Navbar.tsx:125` | **Primary Brand Logo** (Navbar). High resolution, should be compressed to WebP/SVG. |
| `app/favicon.ico` | ICO (16x16, 32x32, 4 icons) | ~15 KB | Browser tab icon, referenced in `app/layout.tsx:100` | **Active Favicon**. |
| `public/og-image.png` | PNG (1728 × 910, RGB) | 680 KB | `app/layout.tsx:79,96` | **Open Graph Social Share Preview Image**. |
| `public/images/ZAYNA logo.jpeg` | JPEG (740 × 1600) | 46 KB | None (0 references in code) | Alternate logo asset (Unused). |
| `public/images/zayna_web_optimized.svg` | SVG (Vector) | 53 KB | None (0 references in code) | Vector brand graphic (Unused). |

---

### 2.2 Homepage & Category Banners

| Asset Path | Format & Dimensions | Size | Where Used | Role & Status |
|---|---|---|---|---|
| `public/images/hero.png` | PNG (1086 × 1448) | 2.2 MB | `components/Hero.tsx:10` | **Active Homepage Hero Banner**. |
| `public/images/categories/tshirts.png` | PNG (1536 × 1024) | 2.4 MB | `components/FeaturedCategories.tsx:9` | **Active Category Thumbnail** ("T-Shirts"). |
| `/images/categories/oversized.jpg` | Missing | 0 B | `components/FeaturedCategories.tsx:15` | ⚠️ **BROKEN LINK (404)**: Referenced in code but file does not exist in filesystem. |
| `/images/categories/hoodies.jpg` | Missing | 0 B | `components/FeaturedCategories.tsx:21` | ⚠️ **BROKEN LINK (404)**: Referenced in code but file does not exist in filesystem. |
| `/images/categories/accessories.jpg` | Missing | 0 B | `components/FeaturedCategories.tsx:27` | ⚠️ **BROKEN LINK (404)**: Referenced in code but file does not exist in filesystem. |

---

### 2.3 Product Photography in `public/images/`

The repository holds 20 JPEG images originally used for initial seeding. None are imported directly in active page components because the storefront fetches product images dynamically from Supabase:

- `public/images/blackrose.jpeg` (1254 × 1254, 136 KB) — referenced only in unused `components/data/products.ts`
- `public/images/whiterose.jpeg` (1254 × 1254, 172 KB) — referenced only in unused `components/data/products.ts`
- `public/images/jurassic.jpeg` (1254 × 1254, 98 KB) — referenced only in unused `components/data/products.ts`
- `public/images/ehude.jpeg` (1254 × 1254, 135 KB) — referenced only in unused `components/data/products.ts`
- `public/images/blackforest.jpeg`, `gothic.jpeg`, `gothicmodel.jpeg`, `lily.jpeg`, `nasty.jpeg`, `signature.jpeg`, `sunflower.jpeg`, `tokyoblack.jpeg`, `tokyocream.jpeg`, `wagarablack.jpeg`, `whiteforest.jpeg`: **Unused standalone photography**.

---

## 3. Brand Asset Replacement Map

| Brand Element | Current File / Location | Recommended Replacement Target | Recommended Dimensions / Specs |
|---|---|---|---|
| **Primary Navbar Logo** | `public/images/logo.png` | Replace file or change path in `Navbar.tsx` | 200 × 200 to 512 × 512 PNG (transparent background) or SVG |
| **Browser Favicon** | `app/favicon.ico` | Replace `app/favicon.ico` | Multi-resolution 16x16, 32x32, 48x48 `.ico` file |
| **Social Share Image** | `public/og-image.png` | Replace `public/og-image.png` | 1200 × 630 PNG or JPG (standard OpenGraph ratio) |
| **Homepage Hero Banner** | `public/images/hero.png` | Replace file or change path in `Hero.tsx` | 1920 × 1080 (landscape) or 1080 × 1440 (portrait/mobile), compressed WebP |
| **T-Shirts Category Banner**| `public/images/categories/tshirts.png` | Replace file or change path in `FeaturedCategories.tsx` | 800 × 800 or 1000 × 1000 square/portrait image |
| **Missing Category Banners** | `oversized.jpg`, `hoodies.jpg`, `accessories.jpg` | Add files to `public/images/categories/` | 800 × 800 square/portrait images to fix 404s |

---

## 4. Centralized Branding Architecture Recommendation

Currently, changing the store name requires editing over **40 individual source files**. 

### Recommended Pattern: `lib/config/site.ts`
Create a centralized configuration file:
```ts
export const siteConfig = {
  name: "Your Brand",
  shortName: "BRAND",
  tagline: "Your Brand Slogan",
  description: "Your store description for SEO and link previews.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: {
    support: "support@yourdomain.com",
    orders: "orders@yourdomain.com",
    adminNotification: "admin@yourdomain.com",
  },
  currency: {
    code: "NPR",
    symbol: "Rs.",
    locale: "en-NP",
  },
  socials: {
    instagram: "https://instagram.com/yourhandle",
    facebook: "https://facebook.com/yourhandle",
  },
  links: {
    terms: "/terms-and-conditions",
    privacy: "/privacy-policy",
    shipping: "/shipping-policy",
    returns: "/return-refund-policy",
  },
};
```
Replacing hardcoded strings with `siteConfig.name` will allow single-line re-branding of the entire application.

---

## 5. Visual Consistency Audit & Corrections

1. **Category Image 404s**:
   - `components/FeaturedCategories.tsx` points to three non-existent images (`oversized.jpg`, `hoodies.jpg`, `accessories.jpg`).
   - *Fix*: Either add valid image files or update `FeaturedCategories.tsx` to use placeholder gradients.
2. **Sitemap 404 Route**:
   - `app/sitemap.ts:62` includes `/refund-policy`. The actual route is `/return-refund-policy`.
   - *Fix*: Update `app/sitemap.ts` line 62 to `${baseUrl}/return-refund-policy`.
3. **Huge Image File Sizes**:
   - `public/images/logo.png` is 1.4 MB.
   - `public/images/hero.png` is 2.2 MB.
   - `public/images/categories/tshirts.png` is 2.4 MB.
   - *Fix*: Compress these 3 images to WebP format (< 150 KB each) to drastically improve page speed and Core Web Vitals.
