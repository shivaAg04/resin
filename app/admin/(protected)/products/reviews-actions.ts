"use server";

import { revalidatePath } from "next/cache";
import { createReview, deleteReview, setReviewActive } from "@/lib/data/reviews";

export async function createReviewAction(formData: FormData): Promise<{ error?: string }> {
  const productId = String(formData.get("productId"));
  const customerName = String(formData.get("customerName") ?? "");
  const rating = Number(formData.get("rating") ?? 5);
  const reviewText = String(formData.get("reviewText") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");

  const result = await createReview({ productId, customerName, rating, reviewText, imageUrl });
  revalidatePath(`/admin/products/${productId}/edit`);
  return { error: result.error };
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));
  await deleteReview(id);
  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function toggleReviewActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));
  const nextActive = formData.get("nextActive") === "true";
  await setReviewActive(id, nextActive);
  revalidatePath(`/admin/products/${productId}/edit`);
}
