import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

/**
 * Returns a configured Supabase client instance.
 * Checks NEXT_PUBLIC_SUPABASE_URL (and fallback SUPABASE_URL)
 * and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (and fallbacks NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY).
 *
 * Throws a descriptive error at call time (not at module import time)
 * if configuration is missing.
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase client initialization failed: Missing required environment variables. " +
        "Ensure NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY) are set in your environment."
    );
  }

  clientInstance = createClient(supabaseUrl, supabaseKey);
  return clientInstance;
}

/**
 * Lazy proxy to Supabase client so that importing this module during build-time
 * static analysis or route evaluation does not throw when environment variables
 * are not yet available or when evaluating static routes.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, client);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});