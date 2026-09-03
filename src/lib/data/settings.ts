import { createClient } from "@/lib/supabase/server";
import { defaultSiteSettings } from "@/lib/placeholder-content";
import type { SiteSettingsRow } from "@/lib/types/database";

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  const supabase = await createClient();
  if (!supabase) return defaultSiteSettings;

  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? defaultSiteSettings;
}
