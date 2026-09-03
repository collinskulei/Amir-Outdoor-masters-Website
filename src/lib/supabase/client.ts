import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/** Browser-side Supabase client, for use in Client Components. */
export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
