"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PortfolioInput = {
  title: string;
  category_id: string | null;
  service_id: string | null;
  image_url: string;
  description: string;
  sort_order: number;
};

export async function createPortfolioItem(input: PortfolioInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };
  if (!input.image_url) return { error: "Please upload a photo first." };

  const { error } = await supabase.from("portfolio_items").insert(input);
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return {};
}

export async function updatePortfolioItem(id: string, input: PortfolioInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("portfolio_items").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return {};
}

export async function deletePortfolioItem(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return {};
}
