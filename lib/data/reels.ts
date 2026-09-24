import { createClient } from "@/lib/supabase/server";
import type { Reel } from "@/types";

/** Accepts any instagram.com/reel|reels|p/... URL and strips tracking query params. */
export function normalizeReelUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!/(^|\.)instagram\.com$/.test(url.hostname)) return null;
    if (!/^\/(reel|reels|p)\//.test(url.pathname)) return null;
    return `https://www.instagram.com${url.pathname}`;
  } catch {
    return null;
  }
}

export async function getActiveReels(): Promise<Reel[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data as Reel[];
  } catch (error) {
    console.error("getActiveReels error", error);
    return [];
  }
}

export async function getAllReelsAdmin(): Promise<Reel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reels")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllReelsAdmin error", error);
    return [];
  }
  return data as Reel[];
}

export async function createReel(url: string, caption: string): Promise<{ reel?: Reel; error?: string }> {
  const normalized = normalizeReelUrl(url);
  if (!normalized) return { error: "That doesn't look like an Instagram Reel/post link." };

  const supabase = await createClient();
  const { data: existing } = await supabase.from("reels").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();

  const { data, error } = await supabase
    .from("reels")
    .insert({ url: normalized, caption: caption.trim() || null, sort_order: (existing?.sort_order ?? -1) + 1 })
    .select("*")
    .single();

  if (error) {
    console.error("createReel error", error);
    return { error: "Could not add this reel. Please try again." };
  }
  return { reel: data as Reel };
}

export async function deleteReel(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("reels").delete().eq("id", id);
  if (error) {
    console.error("deleteReel error", error);
    return { error: "Could not delete this reel." };
  }
  return {};
}

export async function setReelActive(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("reels").update({ is_active: isActive }).eq("id", id);
  if (error) {
    console.error("setReelActive error", error);
    return { error: "Could not update reel." };
  }
  return {};
}

/** Swaps a reel's display order with the one immediately before/after it. */
export async function moveReelSortOrder(id: string, direction: "up" | "down"): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: ordered, error } = await supabase
    .from("reels")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !ordered) {
    console.error("moveReelSortOrder error", error);
    return { error: "Could not reorder reels." };
  }

  const index = ordered.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= ordered.length) return {};

  const updates = ordered.map((r, i) => ({
    id: r.id,
    sort_order: i === index ? swapIndex : i === swapIndex ? index : i,
  }));

  await Promise.all(updates.map((u) => supabase.from("reels").update({ sort_order: u.sort_order }).eq("id", u.id)));
  return {};
}

export async function setReelSortOrder(id: string, sortOrder: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("reels").update({ sort_order: Math.round(sortOrder) }).eq("id", id);
  if (error) {
    console.error("setReelSortOrder error", error);
    return { error: "Could not update sort order." };
  }
  return {};
}
