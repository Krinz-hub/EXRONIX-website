# Development Setup & Workflow Guide

## 1. Prerequisites

- **Node.js**: `v20.18.0+` (Node.js `v22.x LTS` is **strongly recommended** due to upcoming deprecations in `@supabase/supabase-js`).
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`.
- **Accounts & Services**:
  - A [Supabase](https://supabase.com) project with PostgreSQL and Storage enabled.
  - A [Resend](https://resend.com) API account for transactional emails.

---

## 2. Installation & Environment Configuration

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the template to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the keys in `.env.local`:
```env
# Supabase Public Keys (Client & Server)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Supabase Admin Secret (Server-only for account deletion)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend Email Secret (Server-only for transactional emails)
RESEND_API_KEY=re_your_resend_api_key

# Optional / Default Fallbacks
NEXT_PUBLIC_SITE_URL=https://www.exronix.store
EMAIL_FROM=EXRONIX <orders@exronix.store>
ADMIN_EMAIL=support@exronix.store
```

> [!NOTE]
> `.env.local` is already excluded in `.gitignore` to prevent secret leakage. For complete Vercel production deployment setup, see [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 3. Verified Development Commands

| Command | Action | Notes |
|---|---|---|
| `npm run dev` | Start development server | Runs Next.js with Turbopack on [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build production bundle | Compiles Next.js pages and compiles TypeScript types |
| `npm run start` | Run production server | Starts the compiled build on [http://localhost:3000](http://localhost:3000) |
| `npm run lint` | Run ESLint check | Runs ESLint 9 using `eslint.config.mjs` |
| `npx tsc --noEmit` | Strict TypeScript type check | Validates types without building |

---

## 4. Testing Status & Test Coverage Gaps

Currently, **no automated testing framework** (Jest, Vitest, Cypress, or Playwright) is configured in `package.json`.

### Recommended Regression Testing Strategy
Before making significant alterations to checkout, pricing, or auth:
1. **Unit Testing**: Install `vitest` to unit-test `lib/couponService.ts` and `lib/orderService.ts` pricing logic:
   ```bash
   npm install -D vitest
   ```
2. **End-to-End Testing**: Install Playwright to test critical user paths:
   ```bash
   npm install -D @playwright/test
   ```
   Critical tests to automate:
   - Add variant to cart -> Login -> Checkout -> Confirm order created.
   - Admin login -> Add product -> Verify product renders on `/collections`.

---

## 5. Troubleshooting Common Issues

### Issue 1: `Error: supabaseUrl is required.`
- **Cause**: `NEXT_PUBLIC_SUPABASE_URL` is undefined when `lib/supabase.ts` is imported.
- **Solution**: Ensure `.env.local` exists and contains a valid URL string (even a placeholder like `https://placeholder.supabase.co` during offline development).

### Issue 2: `Failed to collect page data for /sitemap.xml` during `npm run build`
- **Cause**: Next.js attempts to execute `app/sitemap.ts` at build time, which calls `getProducts()` against Supabase.
- **Solution**: Ensure `.env.local` has live Supabase credentials, or wrap the query in a try-catch returning fallback routes if the database is unreachable at build time.

### Issue 3: `EBADENGINE Unsupported engine` warnings during `npm install`
- **Cause**: `@supabase/supabase-js` v2.111.0 specifies `node: ">=22.0.0"`.
- **Solution**: Upgrade your local Node runtime to Node.js 22 LTS (`nvm use 22`).

### Issue 4: `Error: Missing API key. Pass it to the constructor new Resend("re_123")`
- **Cause**: Previously caused by top-level Resend instantiation at module evaluation during `next build`.
- **Solution**: Resend is now initialized inside request handlers (`POST`), returning safe HTTP 500 error responses (`{ "success": false, "error": "Email service is not configured." }`) if `RESEND_API_KEY` is not set at runtime. Ensure `RESEND_API_KEY` is configured in Vercel environment variables for transactional emails to dispatch.

