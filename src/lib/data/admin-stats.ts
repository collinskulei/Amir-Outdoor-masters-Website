import { createClient } from "@/lib/supabase/server";
import type { BookingRow, LeadRow } from "@/lib/types/database";

export interface AdminOverview {
  totalServices: number;
  totalPortfolioItems: number;
  newLeadsCount: number;
  pendingBookingsCount: number;
  recentLeads: LeadRow[];
  recentBookings: BookingRow[];
}

const empty: AdminOverview = {
  totalServices: 0,
  totalPortfolioItems: 0,
  newLeadsCount: 0,
  pendingBookingsCount: 0,
  recentLeads: [],
  recentBookings: [],
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = await createClient();
  if (!supabase) return empty;

  const [services, portfolio, newLeads, pendingBookings, recentLeads, recentBookings] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("portfolio_items").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "requested"),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalServices: services.count ?? 0,
    totalPortfolioItems: portfolio.count ?? 0,
    newLeadsCount: newLeads.count ?? 0,
    pendingBookingsCount: pendingBookings.count ?? 0,
    recentLeads: recentLeads.data ?? [],
    recentBookings: recentBookings.data ?? [],
  };
}
