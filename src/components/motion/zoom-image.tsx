"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Photo tile used across services, portfolio, and testimonials: zooms in
 * slightly as it scrolls into view, then offers a subtle hover zoom on top.
 * No glow/shadow effects, just motion.
 */
export function ZoomImage({
  src,
  alt,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      className={cn("group relative overflow-hidden", className)}
      initial={{ opacity: 0, scale: 1.12 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
          imgClassName
        )}
      />
    </motion.div>
  );
}
