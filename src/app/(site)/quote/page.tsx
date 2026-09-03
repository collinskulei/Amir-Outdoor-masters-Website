import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { QuoteForm } from "@/components/site/quote-form";
import { getAllServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Request a free quote or schedule a site visit with Amir Outdoor Masters.",
};

export default async function QuotePage(props: PageProps<"/quote">) {
  const searchParams = await props.searchParams;
  const services = await getAllServices();
  const preselected = typeof searchParams.service === "string" ? searchParams.service : undefined;

  return (
    <>
      <PageHero
        eyebrow="Get a Quote"
        title="Tell us about your project"
        description="Share a few details and we'll follow up to schedule a free, no-pressure site visit."
      />
      <section className="py-20 sm:py-24">
        <Container className="mx-auto max-w-2xl">
          <AnimatedSection className="rounded-2xl border border-border p-7 sm:p-10">
            <QuoteForm services={services} defaultServiceId={preselected} />
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
