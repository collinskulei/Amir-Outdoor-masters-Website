import { Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { TestimonialDialog } from "@/components/admin/testimonial-dialog";
import { TestimonialPublishedToggle, TestimonialRowActions } from "@/components/admin/testimonial-row-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminTestimonials } from "@/lib/data/admin";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes shown on the homepage."
        action={<TestimonialDialog />}
      />

      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quote</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium text-pine-950">{testimonial.name}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{testimonial.quote}</TableCell>
                <TableCell>
                  <div className="flex gap-0.5 text-clay-500">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <TestimonialPublishedToggle testimonial={testimonial} />
                </TableCell>
                <TableCell className="text-right">
                  <TestimonialRowActions testimonial={testimonial} />
                </TableCell>
              </TableRow>
            ))}
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No testimonials yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
