"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { PortfolioDialog } from "@/components/admin/portfolio-dialog";
import { deletePortfolioItem } from "@/lib/actions/portfolio";
import type { PortfolioItemRow, ServiceCategoryRow, ServiceRow } from "@/lib/types/database";

export function PortfolioItemActions({
  item,
  categories,
  services,
}: {
  item: PortfolioItemRow;
  categories: ServiceCategoryRow[];
  services: ServiceRow[];
}) {
  return (
    <>
      <PortfolioDialog categories={categories} services={services} item={item} />
      <ConfirmDeleteButton itemLabel={item.title} onDelete={() => deletePortfolioItem(item.id)} />
    </>
  );
}
