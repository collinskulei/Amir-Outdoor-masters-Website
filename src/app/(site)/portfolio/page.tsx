import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { ZoomImage } from "@/components/motion/zoom-image";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { CtaBanner } from "@/components/site/cta-banner";
import { getPortfolioItems } from "@/lib/data/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse completed landscaping, hardscaping, and outdoor living projects.",
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects our crews are proud of"
        description="A running gallery of completed work — new projects are added as they wrap up."
      />
      <section className="py-20 sm:py-24">
        <Container>
          {items.length > 0 ? (
            <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <StaggerItem key={item.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <ZoomImage src={item.image_url} alt={item.title} className="h-full w-full" />
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-pine-900">{item.title}</p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-24 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/60" strokeWidth={1.5} />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Our project gallery is being updated — check back soon to see recent work.
              </p>
            </div>
          )}
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
