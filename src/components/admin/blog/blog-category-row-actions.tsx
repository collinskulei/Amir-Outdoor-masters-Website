"use client";

import { BlogCategoryDialog } from "@/components/admin/blog/blog-category-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteBlogCategory } from "@/lib/actions/blog-categories";
import type { BlogCategoryRow } from "@/lib/types/database";

export function BlogCategoryRowActions({ category }: { category: BlogCategoryRow }) {
  return (
    <div className="flex justify-end gap-1">
      <BlogCategoryDialog category={category} />
      <ConfirmDeleteButton itemLabel={category.name} onDelete={() => deleteBlogCategory(category.id)} />
    </div>
  );
}
