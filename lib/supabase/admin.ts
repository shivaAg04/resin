import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * NEVER import this from a Client Component or expose the underlying key
 * to the browser. Only use it inside Route Handlers / Server Actions for
 * operations that must run with elevated privileges, such as creating an
 * order on behalf of an anonymous customer.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is missing required environment variables.");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
