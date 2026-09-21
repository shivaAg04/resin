# Spilled Colours — Handmade Resin Product Store

A simple, production-ready MVP storefront for a small resin product business, built to replace
Instagram/WhatsApp-only ordering. Customers browse products and place orders with no account —
orders land in an admin panel where the seller manages fulfillment and follows up on WhatsApp.

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** lucide-react
- **Deployment:** Vercel

## 1. Install

```bash
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL**, **anon public key**, and
   **service_role key**.

## 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for the browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **server-only, never commit or expose this** |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Your business WhatsApp number, digits only with country code, e.g. `919876543210` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Your Instagram profile URL |
| `NEXT_PUBLIC_SITE_URL` | The public URL of your deployed site (used for SEO metadata/sitemap) |

## 4. Run database migrations

In the Supabase dashboard, open the **SQL Editor** and run the contents of
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). This creates the
`products`, `orders`, and `order_items` tables, sets up Row Level Security policies, and creates
the public `product-images` Storage bucket.

Optionally, also run [`supabase/seed.sql`](supabase/seed.sql) to add 5 sample products.

> If you use the [Supabase CLI](https://supabase.com/docs/guides/cli) instead, run
> `supabase db push` from the project root with these files linked to your project.

## 5. Create an admin user

There is no public admin sign-up — this is intentional. Create the admin account manually:

1. In the Supabase dashboard, go to **Authentication → Users → Add user**.
2. Enter an email and password for the store owner/admin.
3. Sign in at `/admin/login` with those credentials.

## 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin/login` for the
admin panel.

## 7. Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.example` in the Vercel project settings.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` to your production domain once you have it.

## npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |

## How the ordering flow works

1. A customer browses `/products`, opens a product, and clicks **Buy Now**.
2. They fill in name, WhatsApp number, and address on `/checkout` — no account required.
3. The order is created server-side: the price is always re-read from the database (never trusted
   from the browser), an order number (`ORD-1001`, `ORD-1002`, ...) is generated, and the order is
   saved to Supabase using the service-role key (which bypasses Row Level Security safely, entirely
   server-side).
4. The customer lands on `/order-success/[orderNumber]` and can tap **Chat on WhatsApp** to confirm
   the order with the seller via a pre-filled WhatsApp message.
5. The seller manages the order from `/admin/orders`, updates its status, and can message the
   customer directly on WhatsApp from the order detail page.

## Project structure

```
app/
  (site)/            Public storefront pages (home, products, checkout, order-success)
  admin/             Admin login + protected dashboard/products/orders
  api/orders/        Order creation endpoint (server-side price calculation)
components/
  ui/                Reusable primitives (Button, Field, Badge, ...)
  products/          Product cards, gallery, quantity selector
  checkout/          Checkout form + order summary
  admin/             Admin-only components (sidebar, product form, image uploader, ...)
lib/
  supabase/          Browser / server / admin (service-role) Supabase clients
  whatsapp/          wa.me deep-link builders
  data/              Data-access functions (all Supabase queries live here)
  utils/             Validation, formatting, small helpers
types/               Shared TypeScript types
supabase/
  migrations/        SQL schema + RLS policies
  seed.sql           Sample products
proxy.ts             Route protection for /admin/* (Next.js 16's renamed middleware) + session refresh
```
