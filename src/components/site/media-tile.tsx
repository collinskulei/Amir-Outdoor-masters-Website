import { cn } from "@/lib/utils";
import { ZoomImage } from "@/components/motion/zoom-image";
import { IconPlaceholder } from "@/components/site/icon-placeholder";

/** Renders the real photo when one is set, otherwise a branded icon tile. */
export function MediaTile({
  imageUrl,
  alt,
  icon,
  placeholderLabel,
  className,
  sizes,
  priority,
}: {
  imageUrl?: string | null;
  alt: string;
  icon?: string | null;
  placeholderLabel?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (imageUrl) {
    return (
      <ZoomImage
        src={imageUrl}
        alt={alt}
        className={cn("h-full w-full", className)}
        sizes={sizes}
        priority={priority}
      />
    );
  }
  return <IconPlaceholder icon={icon} label={placeholderLabel} className={className} />;
}
