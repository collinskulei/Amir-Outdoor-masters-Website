import { createClient } from "@/lib/supabase/server";
import { placeholderPortfolio } from "@/lib/placeholder-content";
import type { PortfolioItemRow } from "@/lib/types/database";

export async function getPortfolioItems(limit?: number): Promise<PortfolioItemRow[]> {
  const supabase = await createClient();
  if (!supabase) return placeholderPortfolio.slice(0, limit);

  let query = supabase.from("portfolio_items").select("*").order("sort_order");
  if (limit) query = query.limit(limit);

  const { data } = await query;
  return data ?? placeholderPortfolio;
}
