"use server";

import { createClient } from "@/lib/supabase/server";

export type UploadResult = { url?: string; error?: string };

/** Uploads a file to the public "media" storage bucket and returns its public URL. */
export async function uploadMedia(formData: FormData, folder: string): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Please upload an image file." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "14400",
    upsert: false,
  });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { url: data.publicUrl };
}
