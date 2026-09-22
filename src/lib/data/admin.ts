import { createClient } from "@/lib/supabase/server";
import type {
  BlogCategoryRow,
  BlogPostRow,
  BookingRow,
  LeadRow,
  PortfolioItemRow,
  ServiceCategoryRow,
  ServiceRow,
  TestimonialRow,
} from "@/lib/types/database";

// Admin views must reflect exactly what's in the database. Never fall back
// to placeholder content, unlike the public-facing lib/data/* helpers.

export async function getAdminCategories(): Promise<ServiceCategoryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("service_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getAdminServices(): Promise<(ServiceRow & { category: ServiceCategoryRow | null })[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const [{ data: services }, { data: categories }] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("service_categories").select("*"),
  ]);
  return (services ?? []).map((s) => ({
    ...s,
    category: categories?.find((c) => c.id === s.category_id) ?? null,
  }));
}

export async function getAdminServiceById(id: string): Promise<ServiceRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAdminPortfolio(): Promise<PortfolioItemRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("portfolio_items").select("*").order("sort_order");
  return data ?? [];
}

export async function getAdminTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminLeads(): Promise<LeadRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminBookings(): Promise<BookingRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminBlogCategories(): Promise<BlogCategoryRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.from("blog_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getAdminPosts(): Promise<(BlogPostRow & { category: BlogCategoryRow | null })[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("blog_categories").select("*"),
  ]);
  return (posts ?? []).map((p) => ({
    ...p,
    category: categories?.find((c) => c.id === p.category_id) ?? null,
  }));
}

export async function getAdminPostById(id: string): Promise<BlogPostRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getOtherFocusKeywords(excludePostId?: string): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("blog_posts").select("focus_keyword").not("focus_keyword", "is", null);
  if (excludePostId) query = query.neq("id", excludePostId);
  const { data } = await query;
  return (data ?? []).map((r) => r.focus_keyword).filter((k): k is string => Boolean(k));
}
