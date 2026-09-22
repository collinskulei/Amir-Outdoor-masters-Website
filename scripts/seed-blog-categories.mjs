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

const CATEGORIES = [
  { name: "Landscaping Tips", slug: "landscaping-tips", sort_order: 1 },
  { name: "Hardscaping & Paving", slug: "hardscaping-paving", sort_order: 2 },
  { name: "Project Stories", slug: "project-stories", sort_order: 3 },
  { name: "Pricing Guides", slug: "pricing-guides", sort_order: 4 },
];

const { data, error } = await supabase.from("blog_categories").insert(CATEGORIES).select();
if (error) throw new Error(error.message);
console.log(`Inserted ${data.length} blog categories.`);
