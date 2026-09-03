import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { getAdminCategories, getAdminServiceById } from "@/lib/data/admin";

export default async function EditServicePage(props: PageProps<"/admin/services/[id]">) {
  const { id } = await props.params;
  const [service, categories] = await Promise.all([getAdminServiceById(id), getAdminCategories()]);

  if (!service) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Service" description={service.name} />
      <ServiceForm categories={categories} service={service} />
    </div>
  );
}
