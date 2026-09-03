import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { ContactForm } from "@/components/site/contact-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Amir Outdoor Masters for questions or a project quote.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const hours = settings.business_hours ?? [];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your property"
        description="Questions, quote requests, or just want to say hi — reach out and a real person will get back to you."
      />
      <section className="py-20 sm:py-24">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-5">
          <AnimatedSection className="lg:col-span-3">
            <div className="rounded-2xl border border-border p-7 sm:p-9">
              <ContactForm />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-green-50 p-7">
              <h3 className="text-sm font-semibold tracking-wide text-green-900 uppercase">Contact Info</h3>
              <ul className="mt-5 space-y-4 text-sm">
                {settings.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-pine-900 hover:text-green-700">
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    <a href={`mailto:${settings.email}`} className="text-pine-900 hover:text-green-700">
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                    <span className="text-pine-900">{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>

            {hours.length > 0 && (
              <div className="rounded-2xl border border-border p-7">
                <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-pine-900 uppercase">
                  <Clock className="h-4 w-4 text-green-700" />
                  Business Hours
                </h3>
                <ul className="mt-5 space-y-2 text-sm">
                  {hours.map((h) => (
                    <li key={h.day} className="flex justify-between text-pine-900/80">
                      <span className="font-medium text-pine-900">{h.day}</span>
                      <span>{h.open && h.close ? `${h.open} – ${h.close}` : "Closed"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {settings.map_embed_url && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={settings.map_embed_url}
                  className="h-64 w-full"
                  loading="lazy"
                  title="Service area map"
                />
              </div>
            )}
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
