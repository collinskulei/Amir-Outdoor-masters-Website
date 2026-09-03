"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { TestimonialDialog } from "@/components/admin/testimonial-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteTestimonial, setTestimonialPublished } from "@/lib/actions/testimonials";
import type { TestimonialRow } from "@/lib/types/database";

export function TestimonialPublishedToggle({ testimonial }: { testimonial: TestimonialRow }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Switch
      checked={testimonial.published}
      disabled={pending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          const result = await setTestimonialPublished(testimonial.id, checked);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          router.refresh();
        });
      }}
    />
  );
}

export function TestimonialRowActions({ testimonial }: { testimonial: TestimonialRow }) {
  return (
    <div className="flex justify-end gap-1">
      <TestimonialDialog testimonial={testimonial} />
      <ConfirmDeleteButton itemLabel={testimonial.name} onDelete={() => deleteTestimonial(testimonial.id)} />
    </div>
  );
}
