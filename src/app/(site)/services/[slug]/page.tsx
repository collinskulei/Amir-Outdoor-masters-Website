import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { PageHero } from "@/components/site/page-hero";
import { MediaTile } from "@/components/site/media-tile";
import { AnimatedSection } from "@/components/motion/animated-section";
import { ServiceCard } from "@/components/site/service-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CtaBanner } from "@/components/site/cta-banner";
import { getServiceBySlug, getRelatedServices } from "@/lib/data/services";

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.summary ?? undefined,
  };
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const related = await getRelatedServices(service);

  return (
    <>
      <PageHero eyebrow="Service" title={service.name} description={service.summary ?? undefined} />

      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
          <AnimatedSection className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <MediaTile
              imageUrl={service.image_url}
              alt={service.name}
              icon={service.icon}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-2xl font-bold text-pine-950 sm:text-3xl">What this includes</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {service.description ?? service.summary}
            </p>
            <ul className="mt-7 space-y-3">
              {["Free on-site estimate", "Licensed & insured crew", "Clear, upfront pricing", "Satisfaction follow-up"].map(
                (point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-pine-900">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    {point}
                  </li>
                )
              )}
            </ul>
            <Button
              render={<Link href={`/quote?service=${service.id}`} />}
              nativeButton={false}
              size="lg"
              className="btn-clay mt-9 h-12 px-7 text-base"
            >
              Request This Service
            </Button>
          </AnimatedSection>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-green-50 py-20 sm:py-24">
          <Container>
            <AnimatedSection>
              <h2 className="clay-line text-2xl font-bold text-pine-950 sm:text-3xl">
                Related services
              </h2>
            </AnimatedSection>
            <StaggerGrid className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <StaggerItem key={s.id}>
                  <ServiceCard service={s} />
                </StaggerItem>
              ))}
            </StaggerGrid>
            <div className="mt-10 flex justify-center">
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-clay-600">
                View all services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
