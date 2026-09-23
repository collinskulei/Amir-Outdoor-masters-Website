import { z } from "zod";

// Supabase's client builds parameterized queries under the hood (never raw
// string concatenation), so form fields can never reach the database as
// executable SQL regardless of what's typed here. This validation is about
// data quality, not SQL injection, but it's applied strictly for both:
// reject the field entirely rather than trying to "clean" a bad value.

/**
 * Kenyan mobile numbers: accepts +254712345678, 254712345678, 0712345678, or
 * 0112345678 (Safaricom/Airtel/Telkom ranges), normalizes to +254XXXXXXXXX.
 */
export const kenyanPhoneSchema = z
  .string()
  .trim()
  .refine((v) => /^(?:\+254|254|0)([17]\d{8})$/.test(v), {
    message: "Enter a valid Kenyan phone number, e.g. 0712 345 678 or +254712345678.",
  })
  .transform((v) => {
    const match = v.match(/^(?:\+254|254|0)([17]\d{8})$/);
    return `+254${match![1]}`;
  });

export const strictEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .refine((v) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(v), {
    message: "Please enter a valid email address.",
  });
