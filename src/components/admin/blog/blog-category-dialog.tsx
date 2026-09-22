"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createBlogCategory, updateBlogCategory } from "@/lib/actions/blog-categories";
import type { BlogCategoryRow } from "@/lib/types/database";

export function BlogCategoryDialog({ category }: { category?: BlogCategoryRow }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    startTransition(async () => {
      const result = category
        ? await updateBlogCategory(category.id, { name, sort_order: sortOrder })
        : await createBlogCategory({ name, sort_order: sortOrder });

      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(category ? "Category updated." : "Category created.");
      setOpen(false);
      if (!category) setName("");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={category ? <Button variant="ghost" size="icon-sm" /> : <Button className="btn-clay gap-1.5" />}
      >
        {category ? <Pencil className="h-4 w-4" /> : (
          <>
            <Plus className="h-4 w-4" />
            Add Category
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
          <DialogDescription>Categories group related blog posts together.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="blog-cat-name">Name</Label>
            <Input id="blog-cat-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="blog-cat-sort">Sort order</Label>
            <Input
              id="blog-cat-sort"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="mt-2 h-11"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={pending} className="btn-clay">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
