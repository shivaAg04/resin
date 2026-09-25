"use client";

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import {
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/app/admin/(protected)/testimonials/actions";
import type { Testimonial } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="h-3.5 w-3.5" fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

export function TestimonialRow({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border-soft/70 bg-white p-3">
      {testimonial.image_url && (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
          <Image src={testimonial.image_url} alt="" fill sizes="56px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink">{testimonial.customer_name}</span>
          <Stars rating={testimonial.rating} />
        </div>
        {testimonial.review_text && <p className="mt-1 text-sm text-ink-soft">{testimonial.review_text}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <form action={toggleTestimonialActiveAction}>
          <input type="hidden" name="id" value={testimonial.id} />
          <input type="hidden" name="nextActive" value={String(!testimonial.is_active)} />
          <button
            type="submit"
            className={
              testimonial.is_active
                ? "rounded-full border border-ink bg-ink px-2.5 py-1 text-xs font-medium text-cream"
                : "rounded-full border border-border-soft px-2.5 py-1 text-xs font-medium text-ink-soft"
            }
          >
            {testimonial.is_active ? "Shown" : "Hidden"}
          </button>
        </form>
        <form
          action={deleteTestimonialAction}
          onSubmit={(e) => {
            if (!confirm(`Delete ${testimonial.customer_name}'s testimonial?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={testimonial.id} />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
            aria-label={`Delete ${testimonial.customer_name}'s testimonial`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
