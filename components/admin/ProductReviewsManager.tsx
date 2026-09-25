"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AlertCircle, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createReviewAction,
  deleteReviewAction,
  toggleReviewActiveAction,
} from "@/app/admin/(protected)/products/reviews-actions";
import type { ProductReview } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="h-3.5 w-3.5" fill={n <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

export function ProductReviewsManager({ productId, reviews }: { productId: string; reviews: ProductReview[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState("5");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("imageUrl", imageUrl);
    const result = await createReviewAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
      setRating("5");
      setImageUrl("");
    }
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.length > 0 && (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3 rounded-xl border border-border-soft/70 bg-white p-3">
              {review.image_url && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image src={review.image_url} alt="" fill sizes="56px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{review.customer_name}</span>
                  <Stars rating={review.rating} />
                </div>
                {review.review_text && <p className="mt-1 text-sm text-ink-soft">{review.review_text}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <form action={toggleReviewActiveAction}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="productId" value={productId} />
                  <input type="hidden" name="nextActive" value={String(!review.is_active)} />
                  <button
                    type="submit"
                    className={
                      review.is_active
                        ? "rounded-full border border-ink bg-ink px-2.5 py-1 text-xs font-medium text-cream"
                        : "rounded-full border border-border-soft px-2.5 py-1 text-xs font-medium text-ink-soft"
                    }
                  >
                    {review.is_active ? "Shown" : "Hidden"}
                  </button>
                </form>
                <form
                  action={deleteReviewAction}
                  onSubmit={(e) => {
                    if (!confirm(`Delete ${review.customer_name}'s review?`)) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="productId" value={productId} />
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${review.customer_name}'s review`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-dashed border-border-soft p-4">
        <input type="hidden" name="productId" value={productId} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FieldWrapper label="Customer Name" htmlFor="customerName">
            <Input id="customerName" name="customerName" required />
          </FieldWrapper>
          <FieldWrapper label="Rating" htmlFor="rating">
            <Select id="rating" name="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </div>

        <FieldWrapper label="Review" htmlFor="reviewText" optional>
          <Textarea id="reviewText" name="reviewText" rows={2} placeholder="What did they say?" />
        </FieldWrapper>

        <FieldWrapper label="Customer's Photo" htmlFor="reviewImage" optional>
          <ImageUploader
            images={imageUrl ? [imageUrl] : []}
            onChange={(imgs) => setImageUrl(imgs[imgs.length - 1] ?? "")}
          />
        </FieldWrapper>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" size="sm" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add Review
        </Button>
      </form>
    </div>
  );
}
