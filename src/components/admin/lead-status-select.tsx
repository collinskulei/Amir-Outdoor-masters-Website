"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatus } from "@/lib/actions/leads-admin";
import { leadStatusLabels } from "@/lib/placeholder-content";
import type { LeadStatus } from "@/lib/types/database";

export function LeadStatusSelect({ id, status }: { id: string; status: LeadStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) => {
        startTransition(async () => {
          const result = await updateLeadStatus(id, value as LeadStatus);
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
        {(Object.keys(leadStatusLabels) as LeadStatus[]).map((key) => (
          <SelectItem key={key} value={key}>
            {leadStatusLabels[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
