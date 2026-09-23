"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { kenyanPhoneSchema, strictEmailSchema } from "@/lib/validation";
import { notifyAdmins } from "@/lib/push/send";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: strictEmailSchema,
  phone: kenyanPhoneSchema,
  service_id: z.string().trim().optional(),
  address: z.string().trim().min(3, "Please enter the property address.").max(300),
  preferred_date: z.string().trim().optional(),
  property_notes: z.string().trim().max(2000).optional(),
});

export type BookingFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitBooking(
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service_id: formData.get("service_id"),
    address: formData.get("address"),
    preferred_date: formData.get("preferred_date"),
    property_notes: formData.get("property_notes"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      status: "error",
      message: "This site isn't connected to Supabase yet, so requests can't be saved. Please call or email us directly.",
    };
  }

  const isPlaceholderService =
    !parsed.data.service_id || !/^[0-9a-f-]{36}$/i.test(parsed.data.service_id);

  // Values passed to Supabase go through a parameterized query, not raw SQL,
  // so there's no injection vector here — the strict schema above is about
  // data quality (a real phone number, a real email), not query safety.
  const { error } = await supabase.from("bookings").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    service_id: isPlaceholderService ? null : parsed.data.service_id,
    address: parsed.data.address,
    preferred_date: parsed.data.preferred_date || null,
    property_notes: parsed.data.property_notes || null,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your request. Please try again." };
  }

  notifyAdmins({
    title: "New booking request",
    body: `${parsed.data.name} · ${parsed.data.address}`,
    url: "/admin/bookings",
  }).catch(() => {});

  return {
    status: "success",
    message: "Request received! Our team will reach out to you by phone or email shortly.",
  };
}
