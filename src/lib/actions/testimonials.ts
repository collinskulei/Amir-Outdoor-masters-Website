"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TestimonialInput = {
  name: string;
  role_location: string;
  quote: string;
  rating: number;
  avatar_url: string | null;
  published: boolean;
};

export async function createTestimonial(input: TestimonialInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("testimonials").insert(input);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}

export async function setTestimonialPublished(id: string, published: boolean) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return {};
}
