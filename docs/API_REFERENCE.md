# API Reference & Route Contracts

## 1. Next.js Server Route Handlers

The application exposes 3 server-side HTTP endpoints under `/api`.

---

### 1.1 `DELETE /api/account/delete`

Deletes the currently authenticated user's account from Supabase Auth (`auth.users`) permanently using the Supabase Service Role key.

- **File Path**: `app/api/account/delete/route.ts`
- **HTTP Method**: `DELETE`
- **Authentication**: **Required**. Valid user access token in `Authorization` header.
- **Environment Dependencies**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

#### Request Headers
```http
Authorization: Bearer <SUPABASE_USER_ACCESS_TOKEN>
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "message": "Account deleted successfully."
}
```

#### Error Responses
- `401 Unauthorized`: Missing header, invalid Bearer format, empty token, or token verification failed:
  ```json
  { "error": "No Authorization header received." }
  ```
- `500 Internal Server Error`: Missing environment variables or Supabase deletion failure:
  ```json
  { "error": "Server configuration is incomplete." }
  ```

---

### 1.2 `POST /api/send-order-email`

Dispatches two transactional emails via **Resend**:
1. An order confirmation email to the purchasing customer with order line items and PDF invoice details.
2. A new order notification email to the store owner (`zaynaofficial07@gmail.com`).

- **File Path**: `app/api/send-order-email/route.ts`
- **HTTP Method**: `POST`
- **Authentication**: **None** *(Vulnerability: Publicly callable without authentication)*
- **Environment Dependencies**: `RESEND_API_KEY`

#### Request Body (`application/json`)
```json
{
  "customer": "Aarav Sharma",
  "email": "customer@example.com",
  "orderId": 1042,
  "total": 2750,
  "payment": "Cash on Delivery",
  "address": "Lazimpat, Kathmandu, Bagmati Province",
  "items": [
    {
      "product_name": "Signature Black Oversized Tee",
      "quantity": 2,
      "price": 1250
    }
  ]
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true
}
```

#### Error Response (`500 Internal Server Error`)
```json
{
  "success": false
}
```

---

### 1.3 `POST /api/send-status-email`

Dispatches an order status change notification (e.g. Confirmed, Processing, Shipped, Delivered) to the customer, including courier name and tracking links.

- **File Path**: `app/api/send-status-email/route.ts`
- **HTTP Method**: `POST`
- **Authentication**: **None** *(Vulnerability: Publicly callable without authentication)*
- **Environment Dependencies**: `RESEND_API_KEY`

#### Request Body (`application/json`)
```json
{
  "customer": "Aarav Sharma",
  "email": "customer@example.com",
  "orderId": 1042,
  "status": "Shipped",
  "courier": "Nepal Can Move",
  "trackingNumber": "NCM-982144",
  "trackingUrl": "https://nepalcanmove.com/track/NCM-982144"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true
}
```

#### Error Response (`500 Internal Server Error`)
```json
{
  "success": false
}
```

---

## 2. Client-Side PostgREST Direct Endpoints

Because the application uses Supabase as a Backend-as-a-Service, the frontend client queries the Supabase PostgREST HTTP gateway directly:

| Operation | Table | Service Function | Client File |
|---|---|---|---|
| `GET /rest/v1/products` | `products` | `getProducts()` | `lib/productService.ts` |
| `GET /rest/v1/products?id=eq.{id}` | `products` | `getProductById(id)` | `lib/productService.ts` |
| `POST /rest/v1/products` | `products` | `addProduct(data)` | `lib/products.ts` |
| `PATCH /rest/v1/products?id=eq.{id}` | `products` | `updateProduct(id, data)` | `lib/products.ts` |
| `DELETE /rest/v1/products?id=eq.{id}` | `products` | `deleteProduct(id)` | `lib/products.ts` |
| `GET /rest/v1/cart?user_id=eq.{userId}` | `cart` | `getCart(userId)` | `lib/cartService.ts` |
| `POST /rest/v1/cart` | `cart` | `addToCart(...)` | `lib/cartService.ts` |
| `POST /rest/v1/orders` | `orders` | `createOrder(...)` | `lib/orderService.ts` |
| `POST /rest/v1/order_items` | `order_items` | `createOrder(...)` | `lib/orderService.ts` |
| `GET /rest/v1/coupons?code=ilike.{code}` | `coupons` | `getCouponByCode(code)` | `lib/couponService.ts` |
| `GET /rest/v1/shipping_rates` | `shipping_rates` | `getShippingRates()` | `lib/shippingService.ts` |
