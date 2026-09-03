import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { getAdminCategories } from "@/lib/data/admin";

export default async function NewServicePage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <AdminPageHeader title="Add Service" description="Create a new service for the public site." />
      <ServiceForm categories={categories} />
    </div>
  );
}
