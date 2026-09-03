"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead, type LeadFormState } from "@/lib/actions/leads";

const initialState: LeadFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <p className="text-base font-medium text-pine-950">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required className="mt-2 h-11" />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" className="mt-2 h-11" />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-2 h-11" />
      </div>
      <div>
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" name="message" required rows={5} className="mt-2" />
      </div>
      {state.status === "error" && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="btn-clay h-12 w-full text-base sm:w-auto sm:px-8">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send Message
      </Button>
    </form>
  );
}
