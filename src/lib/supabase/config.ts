export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase is optional until the admin plugs in real project credentials.
 * Every call site should check this first and fall back to placeholder
 * content instead of throwing, so the marketing site still renders.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
