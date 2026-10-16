"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { MAX_REFERENCE_IMAGE_BYTES, REFERENCE_IMAGE_TYPES } from "@/lib/custom-requests/options";

const CUSTOMER_PHOTO_FOLDERS = ["review-uploads", "customer-uploads"] as const;
type CustomerPhotoFolder = (typeof CUSTOMER_PHOTO_FOLDERS)[number];

/**
 * Customers aren't signed in, so they can't write to the product-images
 * bucket directly — this hands the browser a one-time upload URL into one
 * of the customer folders instead.
 */
export async function prepareCustomerPhotoUpload(
  folder: CustomerPhotoFolder,
  file: { type: string; size: number },
): Promise<{ path?: string; token?: string; publicUrl?: string; error?: string }> {
  if (!CUSTOMER_PHOTO_FOLDERS.includes(folder)) return { error: "Invalid upload." };
  const ext = REFERENCE_IMAGE_TYPES[file?.type];
  if (!ext) return { error: "Please upload a JPG, PNG, WEBP or HEIC photo." };
  if (typeof file.size !== "number" || file.size > MAX_REFERENCE_IMAGE_BYTES) {
    return { error: "Photo must be under 10 MB." };
  }

  const supabase = createAdminClient();
  const storage = supabase.storage.from("product-images");
  const { data, error } = await storage.createSignedUploadUrl(`${folder}/${crypto.randomUUID()}.${ext}`);
  if (error || !data) {
    console.error("prepareCustomerPhotoUpload error", error);
    return { error: "Couldn't prepare the photo upload. Please try again." };
  }
  return { path: data.path, token: data.token, publicUrl: storage.getPublicUrl(data.path).data.publicUrl };
}

export async function submitProductReviewAction(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const productId = String(formData.get("productId") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const ratingRaw = Number(formData.get("rating") ?? 5);
  const reviewText = String(formData.get("reviewText") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!productId) return { error: "Product is missing." };
  if (!customerName) return { error: "Please enter your name." };
  if (customerName.length < 2) return { error: "Name must be at least 2 characters." };

  // Only accept photos the form uploaded to our own storage bucket.
  const allowedImagePrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/review-uploads/`;
  if (imageUrl && !imageUrl.startsWith(allowedImagePrefix)) return { error: "Invalid photo. Please upload it again." };

  const rating = Math.min(5, Math.max(1, Math.round(ratingRaw) || 5));

  try {
    const supabase = createAdminClient();

    // Get max sort_order for this product
    const { data: existing } = await supabase
      .from("product_reviews")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sortOrder = (existing?.sort_order ?? -1) + 1;

    const { error: insertError } = await supabase.from("product_reviews").insert({
      product_id: productId,
      customer_name: customerName,
      rating,
      review_text: reviewText || null,
      image_url: imageUrl || null,
      is_active: true,
      sort_order: sortOrder,
    });

    if (insertError) {
      console.error("submitProductReviewAction error", insertError);
      return { error: "Could not save your review. Please try again." };
    }

    if (slug) revalidatePath(`/products/${slug}`);
    revalidatePath("/reviews");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("submitProductReviewAction exception", err);
    return { error: "Something went wrong. Please try again." };
  }
}
