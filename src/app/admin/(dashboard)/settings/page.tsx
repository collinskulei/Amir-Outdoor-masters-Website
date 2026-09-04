import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data/settings";
import { getHeroImages } from "@/lib/data/hero-images";

export default async function AdminSettingsPage() {
  const [settings, heroImages] = await Promise.all([getSiteSettings(), getHeroImages()]);

  return (
    <div>
      <AdminPageHeader title="Settings" description="Branding, contact info, and hero images for the public site." />
      <SettingsForm settings={settings} heroImages={heroImages} />
    </div>
  );
}
