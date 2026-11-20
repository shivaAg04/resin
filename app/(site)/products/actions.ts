"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { r2FolderUrlPrefix } from "@/lib/r2/server";

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

  // Only accept photos the form uploaded to our own image storage.
  const allowedImagePrefix = r2FolderUrlPrefix("review-uploads");
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
