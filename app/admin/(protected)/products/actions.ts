"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  moveProductSortOrder,
  setProductActive,
  setProductSortOrder,
  updateProduct,
} from "@/lib/data/products";
import type { ProductInput } from "@/types";

export async function createProductAction(input: ProductInput): Promise<{ error?: string }> {
  const { product, error } = await createProduct(input);
  if (error || !product) return { error };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProductAction(id: string, input: ProductInput): Promise<{ error?: string }> {
  const { product, error } = await updateProduct(id, input);
  if (error || !product) return { error };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";
  await setProductActive(id, nextActive);
  revalidatePath("/admin/products");
  revalidatePath("/products");
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
