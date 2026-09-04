import { createClient } from "@/lib/supabase/server";

export interface HeroImages {
  desktop: string[];
  mobile: string[];
}

async function listFolder(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  folder: string
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("media").list(folder, {
    sortBy: { column: "name", order: "asc" },
  });
  if (error || !data) return [];

  return data
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => supabase.storage.from("media").getPublicUrl(`${folder}/${f.name}`).data.publicUrl);
}

/**
 * Hero backgrounds are managed as plain files in Storage (media/hero/desktop,
 * media/hero/mobile) rather than a DB column, so the admin can add, remove,
 * or reorder (by filename) any number of slides without a schema change.
 */
export async function getHeroImages(): Promise<HeroImages> {
  const supabase = await createClient();
  if (!supabase) return { desktop: [], mobile: [] };

  const [desktop, mobile] = await Promise.all([
    listFolder(supabase, "hero/desktop"),
    listFolder(supabase, "hero/mobile"),
  ]);

  return { desktop, mobile };
}
