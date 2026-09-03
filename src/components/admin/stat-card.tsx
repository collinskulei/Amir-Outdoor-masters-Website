import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-pine-950">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
