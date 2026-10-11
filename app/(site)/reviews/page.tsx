import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Eyebrow } from "@/components/home/Eyebrow";
import { ReadyCta } from "@/components/home/ReadyCta";
import { getActiveTestimonials } from "@/lib/data/testimonials";
import { getAllActiveProductReviews } from "@/lib/data/reviews";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Real people, real orders, real stories — what customers say about their Spilled Colours pieces.",
};

interface ReviewCardData {
  id: string;
  customerName: string;
  rating: number;
  text: string | null;
  imageUrl: string | null;
  product: { name: string; slug: string } | null;
}

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-amber" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={className} fill={n <= rating ? "currentColor" : "none"} aria-hidden="true" />
      ))}
    </span>
  );
}

export default async function ReviewsPage() {
  const [testimonials, productReviews] = await Promise.all([getActiveTestimonials(), getAllActiveProductReviews()]);

  const reviews: ReviewCardData[] = [
    ...testimonials.map((t) => ({
      id: t.id,
      customerName: t.customer_name,
      rating: t.rating,
      text: t.review_text,
      imageUrl: t.image_url,
      product: null,
    })),
    ...productReviews.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      rating: r.rating,
      text: r.review_text,
      imageUrl: r.image_url,
      product: r.product,
    })),
  ];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Eyebrow>Reviews</Eyebrow>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">Loved by our customers</h1>
        {reviews.length > 0 && (
          <div className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
            <Stars rating={Math.round(average)} className="h-5 w-5" />
            <span>
              {average.toFixed(1)} from {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
        <p className="mt-2 text-sm text-ink-soft">Real people. Real orders. Real stories.</p>

        {reviews.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border-soft py-16 text-center text-sm text-ink-soft">
            Reviews are on their way — check back soon.
          </p>
        ) : (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="mb-4 break-inside-avoid overflow-hidden rounded-lg bg-white ring-1 ring-ink/[0.06]"
              >
                {review.imageUrl && (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={review.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{review.customerName}</span>
                    <Stars rating={review.rating} />
                  </div>
                  {review.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">“{review.text}”</p>}
                  {review.product && (
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="mt-3 inline-block rounded-full bg-lilac px-2.5 py-1 text-[11px] font-medium text-amber-dark hover:underline"
                    >
                      {review.product.name}
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ReadyCta />
    </div>
  );
}
