"use client";

import { uploadImage } from "@/lib/uploads/compress";

/** Compresses a customer's photo, uploads it to public image storage (R2) and returns its URL. */
export async function uploadCustomerPhoto(
  folder: "review-uploads" | "customer-uploads",
  file: File,
): Promise<{ url?: string; error?: string }> {
  return uploadImage(folder, file);
}
