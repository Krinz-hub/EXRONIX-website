# Database Schema, Tables & Supabase Model

## 1. Overview & Data Architecture

The project relies on a **Supabase PostgreSQL** database. The client connects using `@supabase/supabase-js` via two credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: The project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: The public anon key (used in client-side queries).
- `SUPABASE_SERVICE_ROLE_KEY`: The private admin key (used exclusively in `app/api/account/delete/route.ts`).

> [!WARNING]
> No `.sql` migration files exist in the repository. All schema definitions below have been meticulously reverse-engineered from queries, types, and mutations across `lib/*.ts` and `app/**/*.tsx`.

---

## 2. Table Specifications

### 2.1 `products`
Stores store apparel items and inventory levels.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key, Generated Identity | Unique product identifier |
| `name` | `text` | NOT NULL | Product name (e.g. "Signature Black") |
| `price` | `numeric` | NOT NULL | Price in NPR |
| `description`| `text` | Nullable | Detailed product description |
| `category` | `text` | NOT NULL | Category name (e.g. "Oversized Tee") |
| `image` | `text` | NOT NULL | Primary image URL (Supabase storage or public path) |
| `image2` | `text` | Nullable | Secondary image URL |
| `image3` | `text` | Nullable | Third image URL |
| `image4` | `text` | Nullable | Fourth image URL |
| `images` | `jsonb` / `text[]`| Nullable | Array of image URLs |
| `stock` | `integer` | Default `0` | Available quantity in stock |
| `status` | `text` | "In Stock" \| "Low Stock" \| "Out of Stock" | Stock availability indicator |
| `sizes` | `jsonb` / `text[]`| Array of sizes | e.g. `["S", "M", "L", "XL"]` |
| `colors` | `jsonb` / `text[]`| Array of colors | e.g. `["Black", "White", "Navy"]` |
| `created_at`| `timestamp with time zone` | `now()` | Timestamp of creation |

---

### 2.2 `orders`
Stores customer purchase orders.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key, Generated Identity | Numeric order number |
| `user_id` | `uuid` | References `auth.users(id)` | ID of purchasing customer |
| `customer` | `text` | NOT NULL | Customer full name |
| `email` | `text` | NOT NULL | Customer email |
| `phone` | `text` | NOT NULL | Customer phone number |
| `address` | `text` | NOT NULL | Delivery street address |
| `province` | `text` | Nullable | Destination province (e.g. "Bagmati") |
| `estimated_delivery` | `text` | Nullable | Estimated shipping timeframe (e.g. "2-3 Days") |
| `subtotal` | `numeric` | NOT NULL | Cart subtotal amount |
| `shipping` | `numeric` | NOT NULL | Applied shipping fee |
| `total` | `numeric` | NOT NULL | Final payable amount |
| `payment` | `text` | Default `'Cash on Delivery'` | Payment mode |
| `status` | `text` | Default `'Pending'` | Status: `Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| `courier` | `text` | Nullable | Name of shipping courier |
| `tracking_number` | `text` | Nullable | Courier tracking code |
| `tracking_url` | `text` | Nullable | Link to courier tracking page |
| `admin_note`| `text` | Nullable | Internal administrator notes |
| `stock_restored` | `boolean` | Default `false` | Tracks whether stock was restored on cancellation |
| `created_at`| `timestamp with time zone` | `now()` | Order creation timestamp |

---

### 2.3 `order_items`
Individual line items belonging to an order.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Item record ID |
| `order_id` | `bigint` / `integer` | References `orders(id)` ON DELETE CASCADE | Parent order |
| `product_id`| `bigint` / `integer` | References `products(id)` | Original product ID |
| `product_name` | `text` | NOT NULL | Product name snapshot |
| `product_image`| `text` | Nullable | Product thumbnail image snapshot |
| `quantity` | `integer` | NOT NULL, Check (> 0) | Quantity purchased |
| `price` | `numeric` | NOT NULL | Unit price at time of purchase |
| `size` | `text` | Nullable | Selected size variant |
| `color` | `text` | Nullable | Selected color variant |

---

### 2.4 `profiles`
Extended profile information for authenticated Supabase users.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Record identifier |
| `user_id` | `uuid` | UNIQUE, References `auth.users(id)` | Supabase Auth UUID |
| `name` | `text` | Nullable | Full name |
| `email` | `text` | Nullable | User email address |
| `phone` | `text` | Nullable | Contact phone number |
| `avatar` | `text` | Nullable | Profile avatar image URL |
| `role` | `text` | Default `'customer'` | `'admin'` or `'customer'` / `'user'` |
| `created_at` | `timestamp with time zone` | `now()` | Account registration date |

---

### 2.5 `cart`
Persistent cart items for logged-in users.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Cart item identifier |
| `user_id` | `uuid` | References `auth.users(id)` | Owner user UUID |
| `product_id`| `bigint` / `integer` | References `products(id)` | Target product |
| `quantity` | `integer` | NOT NULL, Check (> 0) | Quantity in cart |
| `size` | `text` | Nullable | Selected size variant |
| `color` | `text` | Nullable | Selected color variant |

---

### 2.6 `wishlist`
Saved customer wishlist items.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Record identifier |
| `user_id` | `uuid` | References `auth.users(id)` | Owner user UUID |
| `product_id`| `bigint` / `integer` | References `products(id)` | Wishlisted product |
| `created_at`| `timestamp with time zone` | `now()` | Date added |

---

### 2.7 `coupons`
Promotional discount codes.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Coupon identifier |
| `code` | `text` | UNIQUE, Case-insensitive | Coupon code (e.g. "WELCOME10") |
| `type` | `text` | `'percentage'` \| `'fixed'` | Discount calculation type |
| `value` | `numeric` | NOT NULL | Percentage off or fixed deduction amount |
| `min_order` | `numeric` | Default `0` | Minimum order subtotal required to apply |
| `usage_limit` | `integer` | Nullable | Max times coupon can be redeemed |
| `used_count` | `integer` | Default `0` | Number of times redeemed so far |
| `expires_at` | `timestamp with time zone` | Nullable | Expiry date |
| `active` | `boolean` | Default `true` | Active status toggle |

---

### 2.8 `shipping_rates`
Provincial shipping configurations.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Rate identifier |
| `province` | `text` | NOT NULL | Province name (e.g. "Bagmati", "Gandaki") |
| `price` | `numeric` | NOT NULL | Flat shipping fee in NPR |
| `free_shipping_over` | `numeric` | Default `0` | Subtotal threshold qualifying for free delivery |
| `estimated_days` | `text` | Nullable | Delivery window (e.g. "2-3 business days") |
| `active` | `boolean` | Default `true` | Rate availability toggle |

---

### 2.9 `addresses`
Saved customer delivery addresses.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Address record identifier |
| `user_id` | `uuid` | References `auth.users(id)` | Owner user UUID |
| `full_name`| `text` | NOT NULL | Recipient name |
| `phone` | `text` | NOT NULL | Contact telephone |
| `address_line1` | `text` | NOT NULL | Street / locality |
| `city` | `text` | NOT NULL | Town or city |
| `province` | `text` | NOT NULL | Province |
| `postal_code` | `text` | Nullable | Postal code |
| `is_default` | `boolean` | Default `false` | Flag for primary checkout address |

---

### 2.10 `reviews`
Product reviews submitted by customers.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Review record ID |
| `user_id` | `uuid` | References `auth.users(id)` | Reviewer user UUID |
| `product_id`| `bigint` / `integer` | References `products(id)` | Reviewed product |
| `rating` | `integer` | Check (rating BETWEEN 1 AND 5) | Star rating |
| `review` | `text` | NOT NULL | Feedback comment text |
| `created_at`| `timestamp with time zone` | `now()` | Submission timestamp |

---

### 2.11 `store_settings`
Global configuration settings for the storefront.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Record identifier (single-row table) |
| `store_name` | `text` | Default `'EXRONIX'` | Name of store |
| `tagline` | `text` | Default `'ENGINEERED BEYOND LIMITS'` | Store slogan |
| `support_email` | `text` | Default `'support@exronix.store'` | Customer care email |
| `phone` | `text` | Default `'+9876543210'` | Customer support phone |
| `free_shipping_limit` | `numeric` | Default `2500` | Global free shipping threshold |
| `shipping_cost` | `numeric` | Default `100` | Default fallback shipping fee |
| `exchange_days` | `integer` | Default `7` | Return / exchange window in days |
| `cod_enabled` | `boolean` | Default `true` | Toggle Cash on Delivery |
| `store_open` | `boolean` | Default `true` | Toggle accepting orders |
| `maintenance_mode` | `boolean` | Default `false` | Maintenance banner toggle |
| `updated_at` | `timestamp with time zone` | `now()` | Last modification date |

---

### 2.12 `user_settings`
Individual customer preference flags.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Identifier |
| `user_id` | `uuid` | UNIQUE, References `auth.users(id)` | Customer UUID |
| `email_notifications` | `boolean` | Default `true` | Marketing / notification preference |
| `sms_notifications` | `boolean` | Default `false` | SMS preference |
| `theme` | `text` | Default `'light'` | UI theme preference |

---

### 2.13 `contact_messages`
Inquiries submitted via `/contact`.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `bigint` / `integer` | Primary Key | Identifier |
| `name` | `text` | NOT NULL | Sender name |
| `email` | `text` | NOT NULL | Sender email |
| `subject` | `text` | NOT NULL | Message subject |
| `message` | `text` | NOT NULL | Message content |
| `created_at` | `timestamp with time zone` | `now()` | Submission timestamp |

---

## 3. Storage Buckets

1. **`products`**:
   - Public read access.
   - Used for product catalog photography.
   - Upload handler: `lib/storageService.ts`.
2. **`avatars`**:
   - Public read access.
   - Used for customer profile avatars.
   - Upload handler: `lib/avatarService.ts`.
