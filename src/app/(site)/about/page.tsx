import type { Metadata } from "next";
import { Award, HeartHandshake, Leaf, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CtaBanner } from "@/components/site/cta-banner";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the crew behind Amir Outdoor Masters and our approach to outdoor work.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Reliability", description: "We show up on schedule and communicate clearly if anything changes." },
  { icon: Award, title: "Craftsmanship", description: "Every detail, from grading to plant spacing, is done to hold up for years." },
  { icon: HeartHandshake, title: "Honesty", description: "Straightforward pricing and recommendations, no upselling you don't need." },
  { icon: Leaf, title: "Care for the Land", description: "Practices that keep soil, plants, and water use healthy long-term." },
];

const STATS = [
  { value: "10+", label: "Years in business" },
  { value: "500+", label: "Properties served" },
  { value: "4.9★", label: "Average client rating" },
  { value: "100%", label: "Licensed & insured crews" },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`The story behind ${settings.site_name}`}
        description="A local outdoor services company built on reliability, craftsmanship, and long-term relationships."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <AnimatedSection>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold tracking-wide text-green-800 uppercase">
              Our Story
            </span>
            <h2 className="clay-line mt-4 text-3xl font-bold text-pine-950">
              Built by people who love outdoor work
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {settings.about_blurb}
            </p>
          </AnimatedSection>
          <StaggerGrid className="grid grid-cols-2 gap-5">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="rounded-2xl bg-green-50 p-7 text-center">
                <p className="font-heading text-3xl font-extrabold text-green-700">{stat.value}</p>
                <p className="mt-1.5 text-sm text-pine-900/80">{stat.label}</p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <section className="bg-pine-950 py-20 sm:py-24">
        <Container>
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-green-200 uppercase">
              What We Stand For
            </span>
            <h2 className="clay-line mt-4 text-3xl font-bold text-white">Our values on every job</h2>
          </AnimatedSection>
          <StaggerGrid className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <StaggerItem key={value.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pine-800 text-green-300">
                  <value.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-base font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pine-200/80">{value.description}</p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
