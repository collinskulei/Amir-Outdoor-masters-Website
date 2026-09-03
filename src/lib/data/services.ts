import { createClient } from "@/lib/supabase/server";
import { placeholderCategories, placeholderServices } from "@/lib/placeholder-content";
import type { ServiceCategoryRow, ServiceRow } from "@/lib/types/database";

export type CategoryWithServices = ServiceCategoryRow & { services: ServiceRow[] };

export async function getCategoriesWithServices(): Promise<CategoryWithServices[]> {
  const supabase = await createClient();
  if (!supabase) return placeholderCategories;

  const [{ data: categories }, { data: services }] = await Promise.all([
    supabase.from("service_categories").select("*").order("sort_order"),
    supabase.from("services").select("*").order("sort_order"),
  ]);

  if (!categories || categories.length === 0) return placeholderCategories;

  return categories.map((category) => ({
    ...category,
    services: (services ?? []).filter((s) => s.category_id === category.id),
  }));
}

export async function getAllServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  if (!supabase) return placeholderServices;

  const { data } = await supabase.from("services").select("*").order("sort_order");
  return data && data.length > 0 ? data : placeholderServices;
}

export async function getFeaturedServices(limit = 6): Promise<ServiceRow[]> {
  const all = await getAllServices();
  const featured = all.filter((s) => s.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const supabase = await createClient();
  if (!supabase) return placeholderServices.find((s) => s.slug === slug) ?? null;

  const { data } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  return data ?? placeholderServices.find((s) => s.slug === slug) ?? null;
}

export async function getRelatedServices(service: ServiceRow, limit = 3): Promise<ServiceRow[]> {
  const all = await getAllServices();
  return all
    .filter((s) => s.id !== service.id && s.category_id === service.category_id)
    .slice(0, limit);
}
