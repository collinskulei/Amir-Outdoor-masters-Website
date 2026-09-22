import { AdminPageHeader } from "@/components/admin/page-header";
import { BlogCategoryDialog } from "@/components/admin/blog/blog-category-dialog";
import { BlogCategoryRowActions } from "@/components/admin/blog/blog-category-row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminBlogCategories } from "@/lib/data/admin";

export default async function AdminBlogCategoriesPage() {
  const categories = await getAdminBlogCategories();

  return (
    <div>
      <AdminPageHeader
        title="Blog Categories"
        description="Group blog posts for the public site's navigation and listings."
        action={<BlogCategoryDialog />}
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
                  <BlogCategoryRowActions category={category} />
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                  No blog categories yet. Add your first one above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
