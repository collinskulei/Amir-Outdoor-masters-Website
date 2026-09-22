"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type BlogCategoryInput = {
  name: string;
  sort_order: number;
};

export async function createBlogCategory(input: BlogCategoryInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("blog_categories")
    .insert({ name: input.name, slug: slugify(input.name), sort_order: input.sort_order });

  if (error) return { error: error.message };
  revalidatePath("/admin/blog-categories");
  revalidatePath("/blog");
  return {};
}

export async function updateBlogCategory(id: string, input: BlogCategoryInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("blog_categories")
    .update({ name: input.name, slug: slugify(input.name), sort_order: input.sort_order })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/blog-categories");
  revalidatePath("/blog");
  return {};
}

export async function deleteBlogCategory(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/blog-categories");
  revalidatePath("/blog");
  return {};
}
