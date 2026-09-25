"use server";

import { revalidatePath } from "next/cache";
import { createTestimonial, deleteTestimonial, setTestimonialActive } from "@/lib/data/testimonials";

export async function createTestimonialAction(formData: FormData): Promise<{ error?: string }> {
  const customerName = String(formData.get("customerName") ?? "");
  const rating = Number(formData.get("rating") ?? 5);
  const reviewText = String(formData.get("reviewText") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");

  const result = await createTestimonial({ customerName, rating, reviewText, imageUrl });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: result.error };
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteTestimonial(id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";
  await setTestimonialActive(id, nextActive);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
