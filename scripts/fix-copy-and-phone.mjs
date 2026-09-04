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

const RENAMES = [
  { from: "Swimming Pool — Under Construction", to: "Swimming Pool, Under Construction" },
  { from: "Gate Automation — Sliding & Swing Gates", to: "Gate Automation: Sliding & Swing Gates" },
];

for (const { from, to } of RENAMES) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .update({ title: to })
    .eq("title", from)
    .select();
  if (error) throw new Error(error.message);
  console.log(`Renamed ${data.length} row(s): "${from}" -> "${to}"`);
}

const { error: settingsError } = await supabase
  .from("site_settings")
  .update({ phone: "+254 707 980 356", updated_at: new Date().toISOString() })
  .eq("id", 1);
if (settingsError) throw new Error(settingsError.message);
console.log("Phone number set to +254 707 980 356");
