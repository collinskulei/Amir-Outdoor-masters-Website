import Link from "next/link";
import { Camera, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/site/container";
import { Logo } from "@/components/site/logo";
import type { CategoryWithServices } from "@/lib/data/services";
import type { SiteSettingsRow } from "@/lib/types/database";

export function Footer({
  settings,
  categories,
}: {
  settings: SiteSettingsRow;
  categories: CategoryWithServices[];
}) {
  const year = new Date().getFullYear();
  const topServices = categories.flatMap((c) => c.services).slice(0, 6);

  return (
    <footer className="bg-pine-950 text-pine-100">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo siteName={settings.site_name} logoUrl={settings.logo_url} dark />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-pine-200/90">
            {settings.tagline}
          </p>
          <div className="mt-6 flex gap-3">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-800 text-pine-100 transition-colors hover:bg-green-700"
                aria-label="Facebook"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-800 text-pine-100 transition-colors hover:bg-green-700"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Services</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {topServices.map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`} className="text-pine-200/90 transition-colors hover:text-white">
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="font-medium text-green-400 transition-colors hover:text-green-300">
                View all services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/about" className="text-pine-200/90 transition-colors hover:text-white">About Us</Link>
            </li>
            <li>
              <Link href="/portfolio" className="text-pine-200/90 transition-colors hover:text-white">Portfolio</Link>
            </li>
            <li>
              <Link href="/quote" className="text-pine-200/90 transition-colors hover:text-white">Get a Quote</Link>
            </li>
            <li>
              <Link href="/contact" className="text-pine-200/90 transition-colors hover:text-white">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Get In Touch</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {settings.phone && (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-pine-200/90 transition-colors hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <a href={`mailto:${settings.email}`} className="text-pine-200/90 transition-colors hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                <span className="text-pine-200/90">{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-pine-800">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-pine-300 sm:flex-row">
          <p>© {year} {settings.site_name}. All rights reserved.</p>
          <p>Built with care for outdoor spaces that last.</p>
        </Container>
      </div>
    </footer>
  );
}
