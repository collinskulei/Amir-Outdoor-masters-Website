"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createPortfolioItem, updatePortfolioItem, type PortfolioInput } from "@/lib/actions/portfolio";
import type { PortfolioItemRow, ServiceCategoryRow, ServiceRow } from "@/lib/types/database";

export function PortfolioDialog({
  categories,
  services,
  item,
}: {
  categories: ServiceCategoryRow[];
  services: ServiceRow[];
  item?: PortfolioItemRow;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [form, setForm] = useState<PortfolioInput>({
    title: item?.title ?? "",
    category_id: item?.category_id ?? null,
    service_id: item?.service_id ?? null,
    image_url: item?.image_url ?? "",
    description: item?.description ?? "",
    sort_order: item?.sort_order ?? 0,
  });

  function update<K extends keyof PortfolioInput>(key: K, value: PortfolioInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.image_url) {
      toast.error("Please upload a photo.");
      return;
    }
    startTransition(async () => {
      const result = item ? await updatePortfolioItem(item.id, form) : await createPortfolioItem(form);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(item ? "Project updated." : "Project added.");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={item ? <Button variant="ghost" size="icon-sm" /> : <Button className="btn-clay gap-1.5" />}
      >
        {item ? (
          <Pencil className="h-4 w-4" />
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Project
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>Add a completed project to the public portfolio.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUploadField
            label="Photo"
            folder="portfolio"
            value={form.image_url || null}
            onChange={(url) => update("image_url", url ?? "")}
            aspect="aspect-square"
          />
          <div>
            <Label htmlFor="pf-title">Title</Label>
            <Input id="pf-title" value={form.title} onChange={(e) => update("title", e.target.value)} className="mt-2 h-11" />
          </div>
          <div>
            <Label htmlFor="pf-category">Category</Label>
            <Select value={form.category_id ?? undefined} onValueChange={(v) => update("category_id", v)}>
              <SelectTrigger id="pf-category" className="mt-2 h-11 w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pf-service">Service (optional)</Label>
            <Select value={form.service_id ?? undefined} onValueChange={(v) => update("service_id", v)}>
              <SelectTrigger id="pf-service" className="mt-2 h-11 w-full">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pf-description">Description (optional)</Label>
            <Textarea
              id="pf-description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="mt-2"
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
