"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  getBundleSlugsContainingProduct,
  getProductByIdAdmin,
  moveProductSortOrder,
  setProductActive,
  setProductSortOrder,
  updateProduct,
} from "@/lib/data/products";
import type { ProductInput } from "@/types";

/** Revalidates any bundle PDP that includes this product as a component. */
async function revalidateContainingBundles(productId: string) {
  const slugs = await getBundleSlugsContainingProduct(productId);
  for (const slug of slugs) revalidatePath(`/products/${slug}`);
}

export async function createProductAction(input: ProductInput): Promise<{ error?: string }> {
  const { product, error } = await createProduct(input);
  if (error || !product) return { error };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, input: ProductInput): Promise<{ error?: string }> {
  const { product, error } = await updateProduct(id, input);
  if (error || !product) return { error };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/");
  await revalidateContainingBundles(id);
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  // Grab the slug before deleting so the now-orphaned PDP cache entry can
  // be cleared too (it's prerendered/cached — without this it would keep
  // serving the stale page instead of 404ing).
  const product = await getProductByIdAdmin(id);
  await revalidateContainingBundles(id);
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  if (product) revalidatePath(`/products/${product.slug}`);
}

export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";
  await setProductActive(id, nextActive);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  const product = await getProductByIdAdmin(id);
  if (product) revalidatePath(`/products/${product.slug}`);
  await revalidateContainingBundles(id);
}

export async function moveProductSortOrderAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  await moveProductSortOrder(id, direction);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function setProductSortOrderAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const value = Number(formData.get("value"));
  if (!Number.isFinite(value)) return;
  await setProductSortOrder(id, value);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}
