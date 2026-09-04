"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type HeroSlot = "desktop" | "mobile";

function folderFor(slot: HeroSlot) {
  return `hero/${slot}`;
}

export async function uploadHeroImage(slot: HeroSlot, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected." };
  if (!file.type.startsWith("image/")) return { error: "Please upload an image file." };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const ext = file.name.split(".").pop() ?? "jpg";
  // Zero-padded timestamp keeps uploads sorted in the order they were added,
  // since getHeroImages() lists this folder alphabetically.
  const path = `${folderFor(slot)}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return {};
}

export async function deleteHeroImage(slot: HeroSlot, fileName: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.storage.from("media").remove([`${folderFor(slot)}/${fileName}`]);
  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return {};
}
