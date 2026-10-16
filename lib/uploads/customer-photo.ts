"use client";

import { prepareCustomerPhotoUpload } from "@/app/(site)/products/actions";
import { createClient } from "@/lib/supabase/client";

/** Uploads a customer's photo via a one-time signed URL and returns its public URL. */
export async function uploadCustomerPhoto(
  folder: "review-uploads" | "customer-uploads",
  file: File,
): Promise<{ url?: string; error?: string }> {
  const prepared = await prepareCustomerPhotoUpload(folder, { type: file.type, size: file.size });
  if (prepared.error || !prepared.path || !prepared.token || !prepared.publicUrl) {
    return { error: prepared.error ?? "Could not upload photo. Please try again." };
  }

  const { error } = await createClient()
    .storage.from("product-images")
    .uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: file.type });
  if (error) {
    console.error("uploadCustomerPhoto error", error);
    return { error: "Could not upload photo. Please try again." };
  }
  return { url: prepared.publicUrl };
}
