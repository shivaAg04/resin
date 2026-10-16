"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { CheckCircle2, ImagePlus, Loader2, MessageSquarePlus, Star, X } from "lucide-react";
import { submitProductReviewAction } from "@/app/(site)/products/actions";
import { uploadCustomerPhoto } from "@/lib/uploads/customer-photo";
import type { ReviewLike } from "@/components/products/ReviewsCarousel";

export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  reviews,
}: {
  productId: string;
  productSlug: string;
  productName: string;
  reviews: ReviewLike[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    const result = await uploadCustomerPhoto("review-uploads", file);
    if (result.url) setImageUrl(result.url);
    else setError(result.error ?? "Could not upload photo. Please try again.");
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("slug", productSlug);
    formData.append("customerName", customerName);
    formData.append("rating", String(rating));
    formData.append("reviewText", reviewText);
    formData.append("imageUrl", imageUrl);

    startTransition(async () => {
      const res = await submitProductReviewAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSubmitted(true);
        setShowForm(false);
        setCustomerName("");
        setReviewText("");
        setImageUrl("");
        setRating(5);
      }
    });
  }

  return (
    <section className="mt-14 border-t border-border-soft/70 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Customer Reviews</h2>
          {averageRating ? (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex text-amber">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4"
                    fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-ink">{averageRating} out of 5</span>
              <span className="text-xs text-ink-soft">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">No reviews yet. Be the first to share your thoughts!</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setSubmitted(false);
          }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-ink/20 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-ink shadow-sm transition-colors hover:border-ink hover:bg-cream"
        >
          <MessageSquarePlus className="h-4 w-4 text-amber-dark" />
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {submitted && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <span>Thank you! Your review has been submitted successfully.</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border-soft bg-white p-5 shadow-sm sm:p-6">
          <h3 className="font-display text-lg font-medium text-ink">Review for {productName}</h3>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">Rating</label>
              <div className="mt-1.5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} stars`}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className="h-6 w-6 text-amber"
                      fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-ink">
                  {hoverRating || rating} Star{(hoverRating || rating) > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reviewerName" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reviewerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Pooja S."
                className="mt-1 w-full rounded-xl border border-border-soft bg-cream/30 p-2.5 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="reviewerText" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Your Review
              </label>
              <textarea
                id="reviewerText"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was the product quality, finish, packaging, or customer service?"
                className="mt-1 w-full rounded-xl border border-border-soft bg-cream/30 p-2.5 text-sm text-ink focus:border-ink focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Add a Photo <span className="font-normal normal-case tracking-normal">(optional)</span>
              </label>
              {imageUrl ? (
                <div className="relative mt-1.5 h-24 w-24 overflow-hidden rounded-xl border border-border-soft">
                  <Image src={imageUrl} alt="Your review photo" fill sizes="96px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="mt-1.5 inline-flex items-center gap-2 rounded-xl border border-dashed border-ink/30 bg-cream/30 px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-white disabled:opacity-60"
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin text-ink-soft" /> : <ImagePlus className="h-4 w-4 text-ink-soft" />}
                  {uploadingImage ? "Uploading photo..." : "Upload Photo"}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isPending || uploadingImage}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-cream transition-colors hover:bg-plum disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews Display */}
      {reviews.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col rounded-2xl border border-border-soft/70 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{review.customer_name}</span>
                <div className="flex gap-0.5 text-amber">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-3.5 w-3.5" fill={n <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              {review.review_text && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{review.review_text}</p>
              )}
              {review.image_url && (
                <a
                  href={review.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-3 block h-28 w-28 overflow-hidden rounded-xl border border-border-soft transition-opacity hover:opacity-90"
                >
                  <Image src={review.image_url} alt={`Photo from ${review.customer_name}`} fill sizes="112px" className="object-cover" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
