import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-field-pattern bg-pine-950 py-20 sm:py-24">
      <Container>
        <AnimatedSection className="max-w-2xl">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-green-200 uppercase">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base leading-relaxed text-pine-200/90 sm:text-lg">
              {description}
            </p>
          )}
        </AnimatedSection>
      </Container>
    </section>
  );
}
