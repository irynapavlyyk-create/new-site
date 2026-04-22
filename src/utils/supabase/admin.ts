import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client with the secret (service) key. Bypasses RLS.
// NEVER import this from a "use client" component or any browser-reachable code.
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase admin client misconfigured: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY missing"
    );
  }
  return createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
