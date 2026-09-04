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

for (const table of ["site_settings", "service_categories", "services", "portfolio_items", "testimonials", "leads", "bookings"]) {
  const { error, count } = await supabase.from(table).select("*", { count: "exact", head: true });
  console.log(table, error ? `ERROR: ${error.message}` : `OK (${count} rows)`);
}

const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
console.log("buckets:", bucketErr ? bucketErr.message : buckets.map((b) => b.name));
