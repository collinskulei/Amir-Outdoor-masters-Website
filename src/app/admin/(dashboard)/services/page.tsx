import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceRowActions } from "@/components/admin/service-row-actions";
import { getAdminServices } from "@/lib/data/admin";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Everything shown on the public Services pages."
        action={
          <Button render={<Link href="/admin/services/new" />} nativeButton={false} className="btn-clay gap-1.5">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium text-pine-950">{service.name}</TableCell>
                <TableCell className="text-muted-foreground">{service.category?.name ?? "—"}</TableCell>
                <TableCell>
                  {service.featured && <Star className="h-4 w-4 fill-clay-500 text-clay-500" />}
                </TableCell>
                <TableCell className="text-right">
                  <ServiceRowActions service={service} />
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No services yet — add your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
