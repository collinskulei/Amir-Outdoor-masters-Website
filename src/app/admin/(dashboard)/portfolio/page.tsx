import { AdminPageHeader } from "@/components/admin/page-header";
import { PortfolioDialog } from "@/components/admin/portfolio-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deletePortfolioItem } from "@/lib/actions/portfolio";
import { getAdminCategories, getAdminPortfolio, getAdminServices } from "@/lib/data/admin";

export default async function AdminPortfolioPage() {
  const [items, categories, services] = await Promise.all([
    getAdminPortfolio(),
    getAdminCategories(),
    getAdminServices(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Portfolio"
        description="Photos shown in the public portfolio gallery."
        action={<PortfolioDialog categories={categories} services={services} />}
      />

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
          No projects yet. Add your first one above.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-square">
                {/* Plain img (not next/image): admin-only preview, and routing
                    dozens of these through the optimizer at once was enough
                    concurrent load to occasionally time out in dev. */}
                <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-start justify-end gap-1 bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
                  <PortfolioDialog categories={categories} services={services} item={item} />
                  <ConfirmDeleteButton itemLabel={item.title} onDelete={() => deletePortfolioItem(item.id)} />
                </div>
              </div>
              <p className="truncate p-3 text-sm font-medium text-pine-950">{item.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
