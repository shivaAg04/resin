import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReviewsCarousel } from "@/components/products/ReviewsCarousel";
import type { Testimonial } from "@/types";

/** Homepage testimonials carousel, with a link through to the full /reviews page. */
export function HomeTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <ReviewsCarousel title="Real People. Real Creations." reviews={testimonials} />
      <Link
        href="/reviews"
        className="mt-3 flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-[0.12em] text-ink hover:text-amber-dark"
      >
        Read all reviews <ArrowRight className="h-3 w-3" />
      </Link>
    </section>
  );
}
