import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Server-side Supabase client, for use in Server Components, Server Actions,
 * and Route Handlers. Returns null when Supabase hasn't been configured yet
 * so callers can fall back to placeholder content instead of crashing.
 *
 * Untyped on purpose: our hand-written row types in lib/types/database.ts
 * describe the shapes we read/write, but wiring them through supabase-js's
 * generic Database param has proven brittle across versions. Call sites
 * annotate their own return types instead.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render — the proxy will refresh
          // the session on the next request instead.
        }
      },
    },
  });
}
