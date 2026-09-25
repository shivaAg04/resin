"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createTestimonialAction } from "@/app/admin/(protected)/testimonials/actions";

export function AddTestimonialForm() {
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
    const result = await createTestimonialAction(formData);

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
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-dashed border-border-soft p-4">
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

      <FieldWrapper label="Customer's Photo" htmlFor="testimonialImage" optional>
        <ImageUploader images={imageUrl ? [imageUrl] : []} onChange={(imgs) => setImageUrl(imgs[imgs.length - 1] ?? "")} />
      </FieldWrapper>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" size="sm" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add Testimonial
      </Button>
    </form>
  );
}
