import Image from "next/image";
import { TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders the uploaded logo (Admin → Settings) when available. Until then,
 * falls back to a text lockup that echoes the brand mark: green wordmark,
 * dark pine trees, on a green name-bar — swap the moment a logo is uploaded.
 */
export function Logo({
  logoUrl,
  siteName,
  dark = false,
  className,
}: {
  logoUrl?: string | null;
  siteName: string;
  dark?: boolean;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <span className={cn("relative block h-10 w-40", className)}>
        <Image src={logoUrl} alt={siteName} fill sizes="160px" className="object-contain object-left" priority />
      </span>
    );
  }

  const [first, ...rest] = siteName.split(" ");
  const restName = rest.join(" ");

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex items-end gap-0.5 text-pine-900">
        <TreePine className="h-6 w-6 -mr-1" strokeWidth={2} />
        <TreePine className="h-8 w-8" strokeWidth={2} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-extrabold tracking-tight text-green-700",
            dark && "text-green-400"
          )}
        >
          {first}
        </span>
        {restName && (
          <span
            className={cn(
              "font-heading text-[10px] font-bold tracking-widest text-pine-800 uppercase",
              dark && "text-pine-100"
            )}
          >
            {restName}
          </span>
        )}
      </span>
    </span>
  );
}
