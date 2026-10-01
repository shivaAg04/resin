import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
