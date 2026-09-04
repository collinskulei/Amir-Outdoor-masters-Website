import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { ServiceCard } from "@/components/site/service-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CtaBanner } from "@/components/site/cta-banner";
import { getCategoriesWithServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Lawn care, landscape design, hardscaping, irrigation, seasonal cleanup, and tree care, all from one crew.",
};

export default async function ServicesPage() {
  const categories = await getCategoriesWithServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your property needs, in one place"
        description="Browse by category below, or reach out and we'll help you scope the right plan for your yard."
      />
      <section className="py-20 sm:py-24">
        <Container className="space-y-20">
          {categories
            .filter((category) => category.services.length > 0)
            .map((category) => (
              <div key={category.id}>
                <AnimatedSection>
                  <h2 className="clay-line text-2xl font-bold text-pine-950 sm:text-3xl">
                    {category.name}
                  </h2>
                </AnimatedSection>
                <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service) => (
                    <StaggerItem key={service.id}>
                      <ServiceCard service={service} />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            ))}
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
