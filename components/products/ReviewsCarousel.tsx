"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils/format";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const AUTO_ADVANCE_MS = 5000;

function subscribeMotion(callback: () => void) {
  const mql = window.matchMedia(MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getMotionSnapshot() {
  return window.matchMedia(MOTION_QUERY).matches;
}
function getMotionServerSnapshot() {
  return false;
}

export interface ReviewLike {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  image_url: string | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="h-4 w-4" fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewLike }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border-soft/70 bg-white p-4">
      {review.image_url && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={review.image_url} alt="" fill sizes="64px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ink">{review.customer_name}</span>
          <Stars rating={review.rating} />
          <span className="sr-only">{review.rating} out of 5 stars</span>
        </div>
        {review.review_text && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{review.review_text}</p>}
      </div>
    </div>
  );
}

export function ReviewsCarousel({ title, reviews }: { title: string; reviews: ReviewLike[] }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getMotionServerSnapshot);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const multiple = reviews.length > 1;
  const autoPlaying = multiple && !reducedMotion && !paused;

  useEffect(() => {
    if (!autoPlaying) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlaying, reviews.length]);

  if (reviews.length === 0) return null;

  function goTo(next: number) {
    setIndex((next + reviews.length) % reviews.length);
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
        {multiple && !reducedMotion && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume auto-scrolling reviews" : "Pause auto-scrolling reviews"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="mt-5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {multiple ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous review"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <ReviewCard review={reviews[index]} />
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next review"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <ReviewCard review={reviews[0]} />
        )}
      </div>

      {multiple && (
        <div className="mt-4 flex justify-center gap-1.5">
          {reviews.map((review, i) => (
            <button
              key={review.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show review from ${review.customer_name}`}
              aria-current={i === index}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-amber-dark" : "w-1.5 bg-ink/15")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
