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
import { getHeroImages } from "@/lib/data/hero-images";

export default async function HomePage() {
  const [settings, featuredServices, portfolioItems, testimonials, heroImages] = await Promise.all([
    getSiteSettings(),
    getFeaturedServices(6),
    getPortfolioItems(8),
    getPublishedTestimonials(),
    getHeroImages(),
  ]);

  return (
    <>
      <HeroSection
        tagline={settings.tagline}
        desktopImages={heroImages.desktop}
        mobileImages={heroImages.mobile}
      />
      <ServicesGridSection services={featuredServices} />
      <WhyChooseUs />
      <PortfolioPreviewSection items={portfolioItems} />
      <TestimonialsSection testimonials={testimonials} />
      <CtaBanner />
    </>
  );
}
