"use client";

import { CategoryDialog } from "@/components/admin/category-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteCategory } from "@/lib/actions/categories";
import type { ServiceCategoryRow } from "@/lib/types/database";

export function CategoryRowActions({ category }: { category: ServiceCategoryRow }) {
  return (
    <div className="flex justify-end gap-1">
      <CategoryDialog category={category} />
      <ConfirmDeleteButton itemLabel={category.name} onDelete={() => deleteCategory(category.id)} />
    </div>
  );
}
