import { createClient } from "@/lib/supabase/server";
import type { Product, ProductReview } from "@/types";

/**
 * Reviews to show on a product's page. For a bundle, this pools in reviews
 * left on any of its component products too — but the bundle's own
 * reviews (if it has any) are always first/prioritized, and duplicates
 * are dropped.
 */
export async function getReviewsForProductPage(product: Product): Promise<ProductReview[]> {
  const ownReviews = await getActiveReviewsForProduct(product.id);
  if (product.bundle_items.length === 0) return ownReviews;

  try {
    const supabase = await createClient();
    const componentIds = product.bundle_items.map((item) => item.product_id);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .in("product_id", componentIds)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const seen = new Set<string>();
    const combined: ProductReview[] = [];
    for (const review of [...ownReviews, ...(data as ProductReview[])]) {
      if (seen.has(review.id)) continue;
      seen.add(review.id);
      combined.push(review);
    }
    return combined;
  } catch (error) {
    console.error("getReviewsForProductPage error", error);
    return ownReviews;
  }
}

export async function getActiveReviewsForProduct(productId: string): Promise<ProductReview[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as ProductReview[];
  } catch (error) {
    console.error("getActiveReviewsForProduct error", error);
    return [];
  }
}

export async function getAllReviewsForProductAdmin(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllReviewsForProductAdmin error", error);
    return [];
  }
  return data as ProductReview[];
}

export interface CreateReviewInput {
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  imageUrl?: string;
}

export async function createReview(input: CreateReviewInput): Promise<{ review?: ProductReview; error?: string }> {
  const customerName = input.customerName.trim();
  if (!customerName) return { error: "Customer name is required." };

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("product_reviews")
    .select("sort_order")
    .eq("product_id", input.productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: input.productId,
      customer_name: customerName,
      rating,
      review_text: input.reviewText.trim() || null,
      image_url: input.imageUrl || null,
      sort_order: (existing?.sort_order ?? -1) + 1,
    })
    .select("*")
    .single();

  if (error) {
    console.error("createReview error", error);
    return { error: "Could not add this review. Please try again." };
  }
  return { review: data as ProductReview };
}

export async function deleteReview(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").delete().eq("id", id);
  if (error) {
    console.error("deleteReview error", error);
    return { error: "Could not delete this review." };
  }
  return {};
}

export async function setReviewActive(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("product_reviews").update({ is_active: isActive }).eq("id", id);
  if (error) {
    console.error("setReviewActive error", error);
    return { error: "Could not update review." };
  }
  return {};
}
