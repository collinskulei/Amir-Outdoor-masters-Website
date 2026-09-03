import { createClient } from "@/lib/supabase/server";
import { placeholderTestimonials } from "@/lib/placeholder-content";
import type { TestimonialRow } from "@/lib/types/database";

export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();
  if (!supabase) return placeholderTestimonials;

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return data && data.length > 0 ? data : placeholderTestimonials;
}
