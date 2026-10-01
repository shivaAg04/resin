"use server";

import { revalidatePath } from "next/cache";
import { createReview, deleteReview, setReviewActive } from "@/lib/data/reviews";
import { getProductByIdAdmin } from "@/lib/data/products";

/** The PDP is now prerendered/cached — revalidate it too, not just the admin edit page. */
async function revalidateProductPages(productId: string) {
  revalidatePath(`/admin/products/${productId}/edit`);
  const product = await getProductByIdAdmin(productId);
  if (product) revalidatePath(`/products/${product.slug}`);
}

export async function createReviewAction(formData: FormData): Promise<{ error?: string }> {
  const productId = String(formData.get("productId"));
  const customerName = String(formData.get("customerName") ?? "");
  const rating = Number(formData.get("rating") ?? 5);
  const reviewText = String(formData.get("reviewText") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");

  const result = await createReview({ productId, customerName, rating, reviewText, imageUrl });
  await revalidateProductPages(productId);
  return { error: result.error };
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));
  await deleteReview(id);
  await revalidateProductPages(productId);
}

export async function toggleReviewActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const productId = String(formData.get("productId"));
  const nextActive = formData.get("nextActive") === "true";
  await setReviewActive(id, nextActive);
  await revalidateProductPages(productId);
}
