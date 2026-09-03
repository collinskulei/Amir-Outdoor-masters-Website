import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader title="Settings" description="Branding, contact info, and hero images for the public site." />
      <SettingsForm settings={settings} />
    </div>
  );
}
