import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when real Supabase credentials are configured. */
export const supabaseConfigured = Boolean(url && anon);

/**
 * Anonymous client for public reads/inserts (RLS-protected).
 * Returns null when env is not configured so callers can fall back to seed data.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(url!, anon!, { auth: { persistSession: false } });
}

/** Browser client that persists the owner's admin session. */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  return createClient(url!, anon!, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}
