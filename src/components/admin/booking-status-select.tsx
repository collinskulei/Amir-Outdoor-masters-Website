"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBookingStatus } from "@/lib/actions/bookings-admin";
import { bookingStatusLabels } from "@/lib/placeholder-content";
import type { BookingStatus } from "@/lib/types/database";

export function BookingStatusSelect({ id, status }: { id: string; status: BookingStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          const result = await updateBookingStatus(id, value as BookingStatus);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          router.refresh();
        });
      }}
    >
      <SelectTrigger size="sm" className="h-9 w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(bookingStatusLabels) as BookingStatus[]).map((key) => (
          <SelectItem key={key} value={key}>
            {bookingStatusLabels[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
