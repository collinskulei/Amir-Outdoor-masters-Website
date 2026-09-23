"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { kenyanPhoneSchema, strictEmailSchema } from "@/lib/validation";
import { notifyAdmins } from "@/lib/push/send";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: strictEmailSchema,
  phone: kenyanPhoneSchema,
  message: z.string().trim().min(10, "Tell us a bit more about what you need.").max(2000),
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      status: "error",
      message: "This site isn't connected to Supabase yet, so messages can't be saved. Please call or email us directly.",
    };
  }

  // Values passed to Supabase go through a parameterized query, not raw SQL,
  // so there's no injection vector here — the strict schema above is about
  // data quality (a real phone number, a real email), not query safety.
  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }

  notifyAdmins({
    title: "New lead from your website",
    body: `${parsed.data.name} · ${parsed.data.phone}`,
    url: "/admin/leads",
  }).catch(() => {});

  return {
    status: "success",
    message: "Thanks! Our team will reach out to you by phone or email shortly.",
  };
}
