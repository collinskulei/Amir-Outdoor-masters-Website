"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import type { LeadRow } from "@/lib/types/database";

export function LeadDetailDialog({ lead }: { lead: LeadRow }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Eye className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>
            {lead.email} {lead.phone && `· ${lead.phone}`}
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed text-pine-900">{lead.message}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(lead.created_at).toLocaleString()}
          </span>
          <LeadStatusSelect id={lead.id} status={lead.status} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
