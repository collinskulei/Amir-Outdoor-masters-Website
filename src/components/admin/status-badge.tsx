import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingStatus, LeadStatus } from "@/lib/types/database";

const LEAD_STYLES: Record<LeadStatus, string> = {
  new: "bg-clay-100 text-clay-800",
  contacted: "bg-green-100 text-green-800",
  closed: "bg-muted text-muted-foreground",
};

const BOOKING_STYLES: Record<BookingStatus, string> = {
  requested: "bg-clay-100 text-clay-800",
  confirmed: "bg-green-100 text-green-800",
  declined: "bg-destructive/10 text-destructive",
  completed: "bg-muted text-muted-foreground",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge className={cn("capitalize", LEAD_STYLES[status])}>{status}</Badge>;
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge className={cn("capitalize", BOOKING_STYLES[status])}>{status}</Badge>;
}
