import type { Metadata } from "next";
import { AddTestimonialForm } from "@/components/admin/AddTestimonialForm";
import { TestimonialRow } from "@/components/admin/TestimonialRow";
import { getAllTestimonialsAdmin } from "@/lib/data/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Testimonials</h1>
      <p className="mt-1 text-sm text-ink-soft">
        General customer reviews shown in a carousel on the homepage (not tied to one product —
        for that, add reviews from a product&apos;s edit page instead).
      </p>

      <div className="mt-6">
        <AddTestimonialForm />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {testimonials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-soft py-10 text-center text-sm text-ink-soft">
            No testimonials yet. Add your first one above.
          </p>
        ) : (
          testimonials.map((testimonial) => <TestimonialRow key={testimonial.id} testimonial={testimonial} />)
        )}
      </div>
    </div>
  );
}
