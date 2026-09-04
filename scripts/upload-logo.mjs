import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const LOGO_PATH = "C:/Users/user/Downloads/amir logo-transparent.png";
// Unique filename per run so the Next.js image optimizer (and browsers)
// never serve a stale cached copy from a previous upload at the same URL.
const storagePath = `branding/logo-${Date.now()}.png`;

const bytes = readFileSync(LOGO_PATH);
const { error: uploadError } = await supabase.storage
  .from("media")
  .upload(storagePath, bytes, { contentType: "image/png", upsert: true });
if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
console.log("Logo URL:", data.publicUrl);

const { error: updateError } = await supabase
  .from("site_settings")
  .update({ logo_url: data.publicUrl, updated_at: new Date().toISOString() })
  .eq("id", 1);
if (updateError) throw new Error(`Settings update failed: ${updateError.message}`);

console.log("site_settings.logo_url updated.");
