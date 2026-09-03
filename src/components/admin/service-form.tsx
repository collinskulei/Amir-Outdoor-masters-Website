"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { createService, updateService, type ServiceInput } from "@/lib/actions/services";
import type { ServiceCategoryRow, ServiceRow } from "@/lib/types/database";

const ICON_OPTIONS = [
  "Sprout", "Scissors", "Trees", "TreeDeciduous", "Leaf", "Layers", "Square", "BrickWall",
  "Flame", "Droplets", "CloudRain", "Snowflake", "Wind", "Axe", "ShieldCheck",
];

export function ServiceForm({
  categories,
  service,
}: {
  categories: ServiceCategoryRow[];
  service?: ServiceRow;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<ServiceInput>({
    name: service?.name ?? "",
    category_id: service?.category_id ?? null,
    summary: service?.summary ?? "",
    description: service?.description ?? "",
    icon: service?.icon ?? "Sprout",
    image_url: service?.image_url ?? null,
    featured: service?.featured ?? false,
    sort_order: service?.sort_order ?? 0,
  });

  function update<K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.name.trim()) {
      toast.error("Service name is required.");
      return;
    }
    startTransition(async () => {
      const result = service ? await updateService(service.id, form) : await createService(form);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(service ? "Service updated." : "Service created.");
      router.push("/admin/services");
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div>
          <Label htmlFor="name">Service name</Label>
          <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 h-11" />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.category_id ?? undefined}
            onValueChange={(v) => update("category_id", v)}
          >
            <SelectTrigger id="category" className="mt-2 h-11 w-full">
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
          <Label htmlFor="summary">Short summary</Label>
          <Textarea
            id="summary"
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            rows={2}
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Shown on service cards across the site.</p>
        </div>

        <div>
          <Label htmlFor="description">Full description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="icon">Placeholder icon</Label>
            <Select value={form.icon} onValueChange={(v) => update("icon", v ?? "Sprout")}>
              <SelectTrigger id="icon" className="mt-2 h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-1.5 text-xs text-muted-foreground">Used when no photo is uploaded.</p>
          </div>
          <div>
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(e) => update("sort_order", Number(e.target.value))}
              className="mt-2 h-11"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border p-4">
          <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
          <div>
            <p className="text-sm font-medium text-pine-950">Feature on homepage</p>
            <p className="text-xs text-muted-foreground">Featured services appear in the homepage grid.</p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={pending} size="lg" className="btn-clay h-12 px-8">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          {service ? "Save Changes" : "Create Service"}
        </Button>
      </div>

      <div>
        <ImageUploadField
          label="Service photo"
          folder="services"
          value={form.image_url}
          onChange={(url) => update("image_url", url)}
          aspect="aspect-[4/3]"
        />
      </div>
    </div>
  );
}
