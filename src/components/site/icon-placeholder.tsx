import * as LucideIcons from "lucide-react";
import { Leaf, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return Leaf;
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Leaf;
}

/**
 * Brand-colored placeholder tile shown wherever a photo hasn't been uploaded
 * yet (services, portfolio). Deliberately looks like a designed empty
 * state, not a broken image.
 */
export function IconPlaceholder({
  icon,
  label,
  className,
}: {
  icon?: string | null;
  label?: string;
  className?: string;
}) {
  const Icon = resolveIcon(icon);
  return (
    <div
      className={cn(
        "bg-field-pattern relative flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-700 to-pine-900 text-green-50",
        className
      )}
    >
      <Icon className="h-10 w-10 opacity-90" strokeWidth={1.5} />
      {label && <span className="text-xs font-medium tracking-wide text-green-100/80 uppercase">{label}</span>}
    </div>
  );
}
