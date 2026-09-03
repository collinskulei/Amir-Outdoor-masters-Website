import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategoriesWithServices } from "@/lib/data/services";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return settings.favicon_url ? { icons: { icon: settings.favicon_url } } : {};
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategoriesWithServices(),
  ]);

  return (
    <>
      <Header siteName={settings.site_name} logoUrl={settings.logo_url} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
    </>
  );
}
