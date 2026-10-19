# Codebase File Map & Directory Inventory

## 1. Feature-to-File Matrix

| Feature | Entry Point | Main Logic / Service | Data Source | Related Files / Dependencies |
|---|---|---|---|---|
| **Product Listing & Filtering** | `app/collections/page.tsx` | `lib/productService.ts` (`getProducts`) | Supabase `products` table | `components/collections/FilterSidebar.tsx`, `components/collections/ProductGrid.tsx`, `components/ProductCard.tsx` |
| **Product Details** | `app/products/[id]/page.tsx` | `lib/productService.ts` (`getProductById`) | Supabase `products` table | `components/product/ProductImageGallery.tsx`, `components/ProductActions.tsx`, `components/product/ProductReviews.tsx`, `components/product/RelatedProducts.tsx` |
| **Shopping Cart** | `app/cart/page.tsx` | `context/CartContext.tsx`, `lib/cartService.ts` | Supabase `cart` table & `products` | `components/QuantitySelector.tsx`, `components/navbar/NavIcons.tsx` |
| **Checkout & Order Creation** | `app/checkout/page.tsx` | `lib/orderService.ts` (`createOrder`), `lib/shippingService.ts` | Supabase `orders`, `order_items`, `shipping_rates`, `coupons` | `app/api/send-order-email/route.ts`, `app/checkout/success/page.tsx`, `utils/generateInvoice.ts` |
| **Authentication & Profiles** | `app/login/page.tsx`, `app/signup/page.tsx` | `context/AuthContext.tsx`, `lib/authService.ts`, `lib/profileService.ts` | Supabase Auth (`auth.users`) & `profiles` table | `components/ProtectedRoute.tsx`, `components/navbar/ProfileDropdown.tsx`, `app/profile/page.tsx` |
| **Admin Dashboard** | `app/admin/page.tsx`, `app/admin/layout.tsx` | `lib/dashboard.ts` (`getDashboardStats`), `app/admin/layout.tsx` | Supabase `products`, `orders` | `components/admin/AdminHeader.tsx`, `components/admin/RevenueChart.tsx` |
| **Admin Product Management** | `app/admin/products/page.tsx`, `app/admin/products/add/page.tsx` | `lib/products.ts` & `lib/productService.ts` | Supabase `products` & `products` storage bucket | `app/admin/products/edit/[id]/page.tsx`, `app/admin/products/view/[id]/page.tsx`, `lib/storageService.ts` |
| **Admin Order Management** | `app/admin/orders/page.tsx`, `app/admin/orders/[id]/page.tsx` | `lib/orderService.ts` (`getOrders`, `updateOrderDetails`) | Supabase `orders`, `order_items` | `components/orders/OrderTimeline.tsx`, `app/api/send-status-email/route.ts` |
| **Coupon Management** | `app/admin/coupons/page.tsx` | `lib/couponService.ts` | Supabase `coupons` table | `components/admin/CreateCouponModal.tsx`, `components/admin/EditCouponModal.tsx` |
| **Shipping Configuration** | `app/admin/shipping/page.tsx` | `lib/shippingService.ts` | Supabase `shipping_rates` table | `app/checkout/page.tsx` (consumes rates) |
| **Customer Reviews** | `components/product/ProductReviews.tsx` | `lib/reviewService.ts` | Supabase `reviews` & `orders` | `components/product/ProductRating.tsx` |
| **Wishlist** | `app/wishlist/page.tsx` | `lib/wishlistService.ts` | Supabase `wishlist` table | `components/ProductCard.tsx`, `lib/events.ts` |

---

## 2. Directory Structure & Key Responsibilities

```
/Users/dev/Documents/jja/
├── app/                               # Next.js App Router root
│   ├── layout.tsx                     # Global Root Layout (Theme, Auth, Cart, Navbar, Footer, Fonts)
│   ├── page.tsx                       # Homepage (Hero, Featured Categories, Best Selling, Why Choose)
│   ├── globals.css                    # Tailwind CSS v4 definitions, animations, OKLCH theme variables
│   ├── sitemap.ts                     # Dynamic sitemap generator
│   ├── robots.ts                      # Dynamic robots.txt generator
│   ├── admin/                         # Admin panel routes
│   │   ├── layout.tsx                 # Protected admin layout with sidebar and role check
│   │   ├── page.tsx                   # Admin metrics dashboard
│   │   ├── analytics/page.tsx         # Revenue and sales analytics
│   │   ├── categories/page.tsx        # Categories list (uses localStorage)
│   │   ├── categories/add/page.tsx    # Add Category page (mocked)
│   │   ├── coupons/page.tsx           # Discount coupons manager
│   │   ├── customers/page.tsx         # Customer purchase aggregations
│   │   ├── customers/[email]/page.tsx # Individual customer order history
│   │   ├── inventory/page.tsx         # Product stock and low-stock monitor
│   │   ├── login/page.tsx             # Admin login screen
│   │   ├── orders/page.tsx            # Order management table
│   │   ├── orders/[id]/page.tsx       # Order detail, fulfillment & status email triggers
│   │   ├── products/page.tsx          # Product catalog management
│   │   ├── products/add/page.tsx      # Add product form with image upload
│   │   ├── products/edit/[id]/page.tsx# Edit product form
│   │   ├── products/view/[id]/page.tsx# Product preview
│   │   ├── settings/page.tsx          # Store settings (open/closed, free shipping)
│   │   └── shipping/page.tsx          # Provincial shipping rates
│   ├── api/                           # Next.js Server Route Handlers
│   │   ├── account/delete/route.ts    # Service-role admin account deletion
│   │   ├── send-order-email/route.ts  # Resend order confirmation email
│   │   └── send-status-email/route.ts # Resend order status update email
│   ├── cart/page.tsx                  # Shopping cart overview
│   ├── checkout/                      # Checkout flow
│   │   ├── page.tsx                   # Address selection, coupon entry, COD order placement
│   │   └── success/page.tsx           # Order placement celebration & PDF invoice
│   ├── collections/page.tsx           # Main product catalog with multi-filter & search
│   ├── contact/page.tsx               # Contact form saving to `contact_messages`
│   ├── products/[id]/page.tsx         # Product details, variant selector, reviews, gallery
│   ├── profile/page.tsx               # Customer profile, addresses, and order history
│   ├── wishlist/page.tsx              # Saved items grid
│   ├── login/, register/, signup/     # Authentication pages
│   ├── forgot-password/, reset-password/# Password recovery pages
│   ├── privacy-policy/, terms-and-conditions/, shipping-policy/, return-refund-policy/ # Legal pages
│   └── test/, test-storage/           # Test & scratch development routes (Candidate for removal)
├── components/                        # UI Components
│   ├── Navbar.tsx, DesktopMenu.tsx, MobileMenu.tsx, NavIcons.tsx, ProfileDropdown.tsx, SearchModal.tsx
│   ├── Hero.tsx, FeaturedCategories.tsx, FeaturedProducts.tsx, BestSellingProducts.tsx, WhyChoose.tsx, Footer.tsx
│   ├── ProductCard.tsx, AddToCartButton.tsx, ProductActions.tsx, ProductOptions.tsx, QuantitySelector.tsx
│   ├── admin/ (AdminHeader, CreateCouponModal, EditCouponModal, DeleteDialog, RevenueChart)
│   ├── analytics/ (7 unused legacy chart components)
│   ├── collections/ (CollectionsHeader, FilterSidebar, ProductGrid, SortDropdown)
│   ├── modals/QuickViewModal.tsx
│   ├── orders/OrderDetails.tsx, OrderTimeline.tsx
│   ├── product/ (ProductImageGallery, ProductRating, ProductReviews, RecentlyViewed, RelatedProducts)
│   ├── profile/ & settings/ (AddressManager, AddressModal, EditProfileModal)
│   └── ui/ (alert-dialog.tsx, button.tsx)
├── context/                           # React Context Providers
│   ├── AuthContext.tsx                # Supabase session, user state, profile updates
│   ├── CartContext.tsx                # Cart state synchronized with Supabase DB
│   └── ThemeContext.tsx               # Dark/Light mode theme state
├── lib/                               # Services & Data Access
│   ├── supabase.ts                    # Supabase client singleton
│   ├── authService.ts                 # Auth helper functions (signIn, signUp, signOut, passwords)
│   ├── productService.ts              # Primary Product CRUD service (941 lines)
│   ├── products.ts                    # Duplicate Product CRUD service (1,087 lines - used by admin)
│   ├── cartService.ts                 # Cart operations with Supabase `cart` table
│   ├── orderService.ts                # Order creation, order items, status changes, analytics
│   ├── couponService.ts               # Coupon validation and usage tracking
│   ├── shippingService.ts             # Provincial shipping rate operations
│   ├── profileService.ts              # Profile CRUD with `profiles` table
│   ├── reviewService.ts               # Product reviews and verified purchase checks
│   ├── wishlistService.ts             # Wishlist CRUD with `wishlist` table
│   ├── storeSettingsService.ts        # Store settings CRUD (`store_settings` table)
│   ├── userSettingsService.ts         # User preferences (`user_settings` table)
│   ├── contactService.ts              # Contact message submission (`contact_messages` table)
│   ├── storageService.ts              # Product image uploads to Supabase Storage
│   ├── avatarService.ts               # User avatar uploads to Supabase Storage
│   ├── recentlyViewed.ts              # LocalStorage recently-viewed helper
│   ├── events.ts                      # Window event bus for cross-component triggers
│   ├── utils.ts                       # Tailwind `cn()` helper
│   ├── dashboard.ts                   # Admin dashboard summary stats
│   ├── analyticsService.ts            # Unused analytics service
│   └── categories.ts                  # Empty 0-byte file
├── public/                            # Static assets (images, logos, svg icons, og-image)
├── types/user.ts                      # User type definition
└── utils/generateInvoice.ts           # Client-side jsPDF invoice generator
```

---

## 3. Duplicate Implementations to Be Aware Of

1. **`lib/productService.ts` vs `lib/products.ts`**:
   - Both implement `getProducts`, `getProductById`, `addProduct`, `updateProduct`, `deleteProduct`, and `decreaseProductStock`.
   - `app/admin/products/page.tsx` and `app/admin/products/add/page.tsx` import from `lib/products.ts`.
   - All other storefront and admin pages import from `lib/productService.ts`.
   - **Risk**: Bug fixes or modifications applied to one file will not reflect in the other.
2. **`components/profile/AddressModal.tsx` vs `components/settings/AddressModal.tsx`**:
   - Two almost identical modals for creating/editing addresses.
3. **`components/RelatedProducts.tsx` vs `components/product/RelatedProducts.tsx`**:
   - `components/RelatedProducts.tsx` is an unused duplicate. Only `components/product/RelatedProducts.tsx` is actually used.

---

## 4. Dead Code & Unused Assets

| Path | Nature | Reason |
|---|---|---|
| `components/data/products.ts` | Hardcoded mock products | Not imported anywhere; superseded by Supabase. |
| `lib/categories.ts` | Empty file | 0 bytes; not imported. |
| `lib/analyticsService.ts` | Dead service | Redundant with `lib/orderService.ts` `getAnalytics`. |
| `components/analytics/*` (7 files) | Unused chart components | Not imported; `app/admin/analytics/` writes inline UI. |
| `components/ProductDetails.tsx` | Unused component | `app/products/[id]/page.tsx` renders its own subcomponents. |
| `app/test/page.tsx` | Scratch test page | Used during development to test Supabase connection. |
| `app/test-storage/page.tsx` | Scratch test page | Used during development to test image upload. |
| 20 images in `public/images/` | Unused image files | Over 20 JPEG images in `public/images/` have 0 references in the codebase. |

---

## 5. End-to-End User Journey Traces

### Journey A: Product Browse to Order Placement
1. **Catalog Load**: User opens `/collections`. `app/collections/page.tsx` calls `getProducts()` in `lib/productService.ts`, fetching from the Supabase `products` table.
2. **Detail View**: User clicks a product card. Browser navigates to `/products/[id]`. `app/products/[id]/page.tsx` fetches product details, reviews, and related products. It also calls `saveRecentlyViewed()` in `lib/recentlyViewed.ts` to update `localStorage`.
3. **Add to Cart**: User selects size/color and clicks "Add to Cart". `ProductActions.tsx` calls `addToCart()` from `context/CartContext.tsx`.
   - *Requirement*: If not logged in, user gets a toast prompting login.
   - *Database*: If logged in, `lib/cartService.ts` upserts into Supabase `cart` table.
   - *Event*: `window.dispatchEvent(new Event("cartUpdated"))` updates the navbar count.
4. **Checkout**: User proceeds to `/checkout`. `app/checkout/page.tsx` loads cart items and provincial shipping rates from `shippingService.ts`. User selects address and clicks "Place Order".
5. **Order Creation**:
   - Calls `createOrder()` in `lib/orderService.ts`.
   - Verifies stock and inserts record into `orders` table.
   - Inserts items into `order_items` table.
   - Decreases product stock in `products` table.
   - Clears cart from `cart` table.
   - Invokes `POST /api/send-order-email` to dispatch confirmation email.
   - Redirects to `/checkout/success?orderId=...`.
6. **Invoice Download**: Customer clicks "Download Invoice" on `/checkout/success`. `utils/generateInvoice.ts` executes `jsPDF` client-side to generate and trigger PDF download.
