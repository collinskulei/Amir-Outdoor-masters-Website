"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "error";
  message?: string;
};

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await createClient();
  if (!supabase) {
    return { status: "error", message: "Supabase isn't configured yet. Add your project credentials to .env.local." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
