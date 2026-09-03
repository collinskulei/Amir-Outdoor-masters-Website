"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { createTestimonial, updateTestimonial, type TestimonialInput } from "@/lib/actions/testimonials";
import type { TestimonialRow } from "@/lib/types/database";

export function TestimonialDialog({ testimonial }: { testimonial?: TestimonialRow }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const [form, setForm] = useState<TestimonialInput>({
    name: testimonial?.name ?? "",
    role_location: testimonial?.role_location ?? "",
    quote: testimonial?.quote ?? "",
    rating: testimonial?.rating ?? 5,
    avatar_url: testimonial?.avatar_url ?? null,
    published: testimonial?.published ?? true,
  });

  function update<K extends keyof TestimonialInput>(key: K, value: TestimonialInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.quote.trim()) {
      toast.error("Name and quote are required.");
      return;
    }
    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, form)
        : await createTestimonial(form);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(testimonial ? "Testimonial updated." : "Testimonial added.");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={testimonial ? <Button variant="ghost" size="icon-sm" /> : <Button className="btn-clay gap-1.5" />}
      >
        {testimonial ? (
          <Pencil className="h-4 w-4" />
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add Testimonial
          </>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
          <DialogDescription>Shown in the client stories section on the homepage.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <ImageUploadField
            label="Avatar (optional)"
            folder="testimonials"
            value={form.avatar_url}
            onChange={(url) => update("avatar_url", url)}
            aspect="aspect-square"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="t-name">Name</Label>
              <Input id="t-name" value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-2 h-11" />
            </div>
            <div>
              <Label htmlFor="t-role">Role / location</Label>
              <Input
                id="t-role"
                value={form.role_location}
                onChange={(e) => update("role_location", e.target.value)}
                className="mt-2 h-11"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="t-quote">Quote</Label>
            <Textarea id="t-quote" value={form.quote} onChange={(e) => update("quote", e.target.value)} rows={4} className="mt-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="t-rating">Rating</Label>
              <Select value={String(form.rating)} onValueChange={(v) => update("rating", Number(v))}>
                <SelectTrigger id="t-rating" className="mt-2 h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} star{n > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.published} onCheckedChange={(v) => update("published", v)} />
              <span className="text-sm font-medium text-pine-950">Published</span>
            </div>
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
