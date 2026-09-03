import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { ZoomImage } from "@/components/motion/zoom-image";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import type { PortfolioItemRow } from "@/lib/types/database";

export function PortfolioPreviewSection({ items }: { items: PortfolioItemRow[] }) {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Recent Work"
          title="See the transformation"
          description="A look at projects our crews have completed recently — browse the full portfolio for more."
        />

        {items.length > 0 ? (
          <StaggerGrid className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <StaggerItem key={item.id} className="relative aspect-square overflow-hidden rounded-xl">
                <ZoomImage src={item.image_url} alt={item.title} className="h-full w-full" />
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <div className="mt-14 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-20 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Project photos are on their way — check back soon, or browse our services in the
              meantime.
            </p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-clay-600"
          >
            View full portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
