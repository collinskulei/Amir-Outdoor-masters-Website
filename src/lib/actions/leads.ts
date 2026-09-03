"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a bit more about what you need."),
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

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please try again." };
  }

  return { status: "success", message: "Thanks — we'll get back to you within one business day." };
}
