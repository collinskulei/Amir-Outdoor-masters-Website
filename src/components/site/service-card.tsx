import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaTile } from "@/components/site/media-tile";
import type { ServiceRow } from "@/lib/types/database";

export function ServiceCard({ service }: { service: ServiceRow }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full">
        <MediaTile
          imageUrl={service.image_url}
          alt={service.name}
          icon={service.icon}
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-pine-950">{service.name}</h3>
        {service.summary && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {service.summary}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 transition-colors group-hover:text-clay-600">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
