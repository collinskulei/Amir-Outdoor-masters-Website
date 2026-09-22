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
const { error, count } = await supabase
  .from("blog_posts")
  .delete({ count: "exact" })
  .ilike("slug", "how-much-does-cabro-paving-cost-in-kenya%");
if (error) throw new Error(error.message);
console.log(`Deleted ${count ?? 0} test post(s).`);
