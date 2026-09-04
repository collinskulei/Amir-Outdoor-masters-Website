"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BusinessHours } from "@/lib/types/database";

export type SettingsInput = {
  site_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  business_hours: BusinessHours[];
  facebook_url: string;
  instagram_url: string;
  logo_url: string | null;
  favicon_url: string | null;
  about_blurb: string;
  map_embed_url: string;
};

export async function updateSiteSettings(input: SettingsInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return {};
}
