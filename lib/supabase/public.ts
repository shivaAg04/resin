import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { CATALOG_REVALIDATE_SECONDS, CATALOG_TAG } from "@/lib/cache/catalog";

/**
 * Anonymous, cookie-free Supabase client for public reads (products,
 * categories, reels, testimonials, reviews). The cookie-bound server
 * client (lib/supabase/server.ts) calls `cookies()`, which forces every
 * route that touches it into full per-request dynamic rendering — this
 * client avoids that so public pages can be cached and served instantly,
 * invalidated on demand by the `revalidatePath()` calls already wired
 * into every admin mutation. RLS still applies via the anon key.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

/**
 * Same as createPublicClient, but its reads go through Next's data cache
 * tagged CATALOG_TAG. Used only for the shop listing queries: /products
 * reads searchParams so the page itself can't be prerendered, but its data
 * can be cached, saving the database round trip on every visit. Admin
 * product/category mutations call revalidateCatalog() to expire it.
 */
export function createCachedPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "force-cache",
            next: { tags: [CATALOG_TAG], revalidate: CATALOG_REVALIDATE_SECONDS },
          }),
      },
    },
  );
}
