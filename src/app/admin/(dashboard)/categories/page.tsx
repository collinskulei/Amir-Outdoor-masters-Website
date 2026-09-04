import { AdminPageHeader } from "@/components/admin/page-header";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { CategoryRowActions } from "@/components/admin/category-row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCategories } from "@/lib/data/admin";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Group services for the public site's navigation and listings."
        action={<CategoryDialog />}
      />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-pine-950">{category.name}</TableCell>
                <TableCell>{category.sort_order}</TableCell>
                <TableCell className="text-right">
                  <CategoryRowActions category={category} />
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  No categories yet. Add your first one above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
