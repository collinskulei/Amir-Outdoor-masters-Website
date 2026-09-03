"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/types/database";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return {};
}
