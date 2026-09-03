"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

/**
 * Scroll-triggered fade + rise, used for section headings, cards, and blocks
 * of copy throughout the site. Animates once, so re-scrolling past a section
 * doesn't replay it.
 */
export function AnimatedSection({
  children,
  delay = 0,
  y = 24,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
