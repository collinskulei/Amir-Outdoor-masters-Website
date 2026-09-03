import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/motion/animated-section";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <AnimatedSection
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase",
            dark ? "bg-white/10 text-green-200" : "bg-green-50 text-green-800"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "clay-line mt-4 text-3xl font-bold sm:text-4xl",
          dark ? "text-white" : "text-pine-950"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-lg",
            dark ? "text-pine-200/90" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
