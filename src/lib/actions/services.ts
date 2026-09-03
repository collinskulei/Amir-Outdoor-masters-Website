"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type ServiceInput = {
  name: string;
  category_id: string | null;
  summary: string;
  description: string;
  icon: string;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
};

export async function createService(input: ServiceInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("services").insert({
    name: input.name,
    slug: slugify(input.name),
    category_id: input.category_id,
    summary: input.summary,
    description: input.description,
    icon: input.icon,
    image_url: input.image_url,
    featured: input.featured,
    sort_order: input.sort_order,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}

export async function updateService(id: string, input: ServiceInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("services")
    .update({
      name: input.name,
      slug: slugify(input.name),
      category_id: input.category_id,
      summary: input.summary,
      description: input.description,
      icon: input.icon,
      image_url: input.image_url,
      featured: input.featured,
      sort_order: input.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return {};
}
