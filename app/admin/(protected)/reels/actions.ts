"use server";

import { revalidatePath } from "next/cache";
import {
  createReel,
  deleteReel,
  moveReelSortOrder,
  setReelActive,
  setReelSortOrder,
} from "@/lib/data/reels";

function revalidateReelPages() {
  revalidatePath("/admin/reels");
  revalidatePath("/");
}

export async function createReelAction(formData: FormData): Promise<{ error?: string }> {
  const url = String(formData.get("url") ?? "");
  const caption = String(formData.get("caption") ?? "");
  const result = await createReel(url, caption);
  revalidateReelPages();
  return { error: result.error };
}

export async function deleteReelAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteReel(id);
  revalidateReelPages();
}

export async function toggleReelActiveAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const nextActive = formData.get("nextActive") === "true";
  await setReelActive(id, nextActive);
  revalidateReelPages();
}

export async function moveReelSortOrderAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  await moveReelSortOrder(id, direction);
  revalidateReelPages();
}

export async function setReelSortOrderAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  const value = Number(formData.get("value"));
  if (!Number.isFinite(value)) return;
  await setReelSortOrder(id, value);
  revalidateReelPages();
}
