import { HeroSection } from "@/components/site/hero-section";
import { ServicesGridSection } from "@/components/site/services-grid-section";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { PortfolioPreviewSection } from "@/components/site/portfolio-preview-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { CtaBanner } from "@/components/site/cta-banner";
import { getSiteSettings } from "@/lib/data/settings";
import { getFeaturedServices } from "@/lib/data/services";
import { getPortfolioItems } from "@/lib/data/portfolio";
import { getPublishedTestimonials } from "@/lib/data/testimonials";

export default async function HomePage() {
  const [settings, featuredServices, portfolioItems, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(6),
    getPortfolioItems(8),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <HeroSection
        tagline={settings.tagline}
        heroDesktopUrl={settings.hero_desktop_url}
        heroMobileUrl={settings.hero_mobile_url}
      />
      <ServicesGridSection services={featuredServices} />
      <WhyChooseUs />
      <PortfolioPreviewSection items={portfolioItems} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner />
    </>
  );
}
