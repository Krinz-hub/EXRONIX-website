# Vercel Deployment & Environment Configuration Guide

This guide documents the configuration, environment variables, and build behaviors for deploying the **EXRONIX** storefront on [Vercel](https://vercel.com).

---

## 1. Environment Variables Matrix

| Variable | Scope | Required At | Fallback / Default | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (Client & Server) | **Build & Runtime** | None | Supabase project endpoint. Required during `next build` for static route collection and `/sitemap.xml` generation. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (Client & Server) | **Build & Runtime** | None | Supabase anon/public API key for client-side queries and authentication. |
| `RESEND_API_KEY` | Secret (Server Only) | **Runtime** | `undefined` | Resend API secret (`re_...`) for transactional order and status emails. Evaluated inside request handlers. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (Server Only) | **Runtime** | `undefined` | Elevated administrative service role key for privileged operations (e.g. `POST /api/account/delete`). |
| `NEXT_PUBLIC_SITE_URL` | Public (Client & Server) | Optional | `https://www.exronix.store` | Canonical domain used for sitemap URLs, metadata canonical tags, password reset redirects, and transactional email links. |
| `EMAIL_FROM` | Secret (Server Only) | Optional | `EXRONIX <orders@exronix.store>` | Sender name and verified email domain configured in Resend. |
| `ADMIN_EMAIL` | Secret (Server Only) | Optional | `support@exronix.store` | Store manager email address to receive new order alert emails. |

---

## 2. Critical Build vs Runtime Requirements

### A. Why Build Time Fails If Supabase Variables Are Missing
During `next build`, Next.js pre-renders static pages and generates route manifests. `app/sitemap.ts` executes `getProducts()` which initializes `lib/supabase.ts`:
- If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is undefined, `@supabase/supabase-js` throws `supabaseUrl is required` at module evaluation, aborting the build.
- **Rule**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` must be set in Vercel under **Production**, **Preview**, and **Development** environments.

### B. Why Email Routes Do Not Throw At Build Time
Previously, `new Resend(process.env.RESEND_API_KEY)` was called at top-level module scope in `app/api/send-order-email/route.ts` and `app/api/send-status-email/route.ts`. When Next.js evaluated the route modules during route data collection, Resend threw:
```
Error: Missing API key. Pass it to the constructor new Resend("re_123")
```
**Fix Implemented**:
- Resend client initialization has been deferred into the `POST` request handler.
- If `RESEND_API_KEY` is not configured at runtime, the API logs the missing variable on the server and returns a safe HTTP 500 error response:
  ```json
  { "success": false, "error": "Email service is not configured." }
  ```
- No internal stack traces, API keys, or infrastructure details are exposed in the client response.
- During build, Next.js evaluates and registers both route handlers as `ƒ (Dynamic)` routes without throwing.

---

## 3. Step-by-Step Vercel Configuration

1. **Link Project**: Connect the GitHub repository `Krinz-hub/EXRONIX-website` to Vercel.
2. **Framework Preset**: Select **Next.js** (detected automatically).
3. **Node.js Version**: In Vercel **Project Settings > General > Node.js Version**, ensure **Node.js 20.x** or **22.x** is selected (Node.js 22 is recommended to align with `@supabase/supabase-js`).
4. **Environment Variables**:
   Navigate to **Project Settings > Environment Variables** and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
   RESEND_API_KEY=re_<your-resend-api-key>
   NEXT_PUBLIC_SITE_URL=https://www.exronix.store
   EMAIL_FROM=EXRONIX <orders@exronix.store>
   ADMIN_EMAIL=support@exronix.store
   ```
5. **Deploy**: Trigger a deployment from branch `main` or via `vercel --prod`.

---

## 4. Verification Commands

Before pushing or triggering a deployment, verify locally:
```bash
# 1. Type verification
npx tsc --noEmit

# 2. Production build verification (with or without RESEND_API_KEY)
npm run build

# 3. Targeted linter verification on email routes
npx eslint app/api/send-order-email/route.ts app/api/send-status-email/route.ts
```

All 3 commands must complete with exit code `0`.
