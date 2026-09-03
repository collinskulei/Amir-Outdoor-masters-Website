import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import type { ServiceRow } from "@/lib/types/database";

export function ServicesGridSection({ services }: { services: ServiceRow[] }) {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Full-service outdoor care, under one crew"
          description="From weekly maintenance to full design-build projects, every service is handled by our own trained teams — no subcontractors passing the job around."
        />
        <StaggerGrid className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGrid>
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-clay-600"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
