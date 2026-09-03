"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitBooking, type BookingFormState } from "@/lib/actions/bookings";
import type { ServiceRow } from "@/lib/types/database";

const initialState: BookingFormState = { status: "idle" };

export function QuoteForm({
  services,
  defaultServiceId,
}: {
  services: ServiceRow[];
  defaultServiceId?: string;
}) {
  const [state, formAction, pending] = useActionState(submitBooking, initialState);
  const [serviceId, setServiceId] = useState(defaultServiceId ?? "");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setServiceId("");
    }
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
        <Label htmlFor="service_id">Service needed</Label>
        <Select value={serviceId} onValueChange={(v) => setServiceId(v ?? "")} name="service_id">
          <SelectTrigger id="service_id" className="mt-2 h-11 w-full">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address">Property address</Label>
        <Input id="address" name="address" required className="mt-2 h-11" />
      </div>
      <div>
        <Label htmlFor="preferred_date">Preferred date (optional)</Label>
        <Input id="preferred_date" name="preferred_date" type="date" className="mt-2 h-11" />
      </div>
      <div>
        <Label htmlFor="property_notes">Anything else we should know?</Label>
        <Textarea id="property_notes" name="property_notes" rows={4} className="mt-2" />
      </div>
      {state.status === "error" && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="btn-clay h-12 w-full text-base">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Request My Free Quote
      </Button>
    </form>
  );
}
