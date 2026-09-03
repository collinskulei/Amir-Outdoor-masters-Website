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

export type CategoryInput = {
  name: string;
  sort_order: number;
};

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("service_categories")
    .insert({ name: input.name, slug: slugify(input.name), sort_order: input.sort_order });

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/services");
  return {};
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("service_categories")
    .update({ name: input.name, slug: slugify(input.name), sort_order: input.sort_order })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/services");
  return {};
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("service_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/services");
  return {};
}
