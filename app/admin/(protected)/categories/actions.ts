"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  moveCategoryHomePosition,
  renameCategory,
  setCategoryHomePosition,
  setCategoryShowOnHome,
} from "@/lib/data/categories";

function revalidateCategoryPages() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "");
  await createCategory(name);
  revalidateCategoryPages();
}

export async function renameCategoryAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "");
  await renameCategory(id, name);
  revalidateCategoryPages();
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteCategory(id);
  revalidateCategoryPages();
}

export async function toggleCategoryShowOnHomeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const nextShowOnHome = formData.get("nextShowOnHome") === "true";
  await setCategoryShowOnHome(id, nextShowOnHome);
  revalidateCategoryPages();
}

export async function moveCategoryHomeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  await moveCategoryHomePosition(id, direction);
  revalidateCategoryPages();
}

export async function setCategoryHomePositionAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const value = Number(formData.get("value"));
  if (!Number.isFinite(value)) return;
  await setCategoryHomePosition(id, value);
  revalidateCategoryPages();
}
