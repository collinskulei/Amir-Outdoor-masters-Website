"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types/database";

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return {};
}
