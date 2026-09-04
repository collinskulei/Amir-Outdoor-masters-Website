import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import path from "path";

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

const SETS = [
  { dir: "C:/Users/user/Downloads/Hero images/Landscape heroes", folder: "hero/desktop" },
  { dir: "C:/Users/user/Downloads/Hero images/Portrait hearoes", folder: "hero/mobile" },
];

for (const set of SETS) {
  const files = readdirSync(set.dir).sort();
  console.log(`\n${set.folder}: ${files.length} files`);
  for (const file of files) {
    const bytes = readFileSync(path.join(set.dir, file));
    const ext = path.extname(file) || ".jpg";
    const storagePath = `${set.folder}/${path.basename(file, ext)}${ext}`;
    const { error } = await supabase.storage
      .from("media")
      .upload(storagePath, bytes, { contentType: "image/png", upsert: true });
    if (error) {
      console.error(`  Failed ${file}:`, error.message);
      continue;
    }
    console.log(`  Uploaded ${file} -> ${storagePath}`);
  }
}

console.log("\nDone.");
