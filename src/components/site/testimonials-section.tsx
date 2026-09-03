import { Star } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import type { TestimonialRow } from "@/lib/types/database";

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialRow[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-pine-950 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Client Stories"
          title="Trusted by homeowners & property managers"
          dark
        />
        <StaggerGrid className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <StaggerItem
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl bg-pine-900 p-7"
            >
              <div className="flex gap-1 text-clay-400">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-pine-100">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="text-sm font-bold text-white">{testimonial.name}</p>
                {testimonial.role_location && (
                  <p className="text-xs text-pine-300">{testimonial.role_location}</p>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Container>
    </section>
  );
}
