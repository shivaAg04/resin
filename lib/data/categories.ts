import { createClient } from "@/lib/supabase/server";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import type { Category } from "@/types";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error) {
    console.error("getAllCategories error", error);
    return [];
  }
  return data as Category[];
}

/** Categories enabled for the homepage, in admin-configured display order. */
export async function getHomeCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("show_on_home", true)
      .order("home_position", { ascending: true });

    if (error) throw error;
    return data as Category[];
  } catch (error) {
    console.error("Supabase category query failed, using demo data instead:", error);
    const seen = new Map<string, Category>();
    for (const product of MOCK_PRODUCTS) {
      for (const c of product.categories) if (c.show_on_home) seen.set(c.id, c);
    }
    return Array.from(seen.values()).sort((a, b) => a.home_position - b.home_position);
  }
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  let slug = toSlug(base) || "category";
  let suffix = 1;
  while (true) {
    let query = supabase.from("categories").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    suffix += 1;
    slug = `${toSlug(base) || "category"}-${suffix}`;
  }
}

export async function createCategory(name: string): Promise<{ category?: Category; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required." };

  const supabase = await createClient();
  const slug = await uniqueSlug(supabase, trimmed);

  const { data, error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "A category with this name already exists." };
    console.error("createCategory error", error);
    return { error: "Could not create category. Please try again." };
  }
  return { category: data as Category };
}

export async function renameCategory(id: string, name: string): Promise<{ category?: Category; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required." };

  const supabase = await createClient();
  const slug = await uniqueSlug(supabase, trimmed, id);

  const { data, error } = await supabase
    .from("categories")
    .update({ name: trimmed, slug })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "A category with this name already exists." };
    console.error("renameCategory error", error);
    return { error: "Could not rename category. Please try again." };
  }
  return { category: data as Category };
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("deleteCategory error", error);
    return { error: "Could not delete category." };
  }
  return {};
}

export async function setCategoryShowOnHome(id: string, showOnHome: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();

  if (showOnHome) {
    // New homepage sections go to the end of the current order.
    const { data: current } = await supabase
      .from("categories")
      .select("home_position")
      .eq("show_on_home", true)
      .order("home_position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (current?.home_position ?? -1) + 1;
    const { error } = await supabase
      .from("categories")
      .update({ show_on_home: true, home_position: nextPosition })
      .eq("id", id);
    if (error) {
      console.error("setCategoryShowOnHome error", error);
      return { error: "Could not update category." };
    }
    return {};
  }

  const { error } = await supabase.from("categories").update({ show_on_home: false }).eq("id", id);
  if (error) {
    console.error("setCategoryShowOnHome error", error);
    return { error: "Could not update category." };
  }
  return {};
}

/** Swaps a homepage category's position with the one immediately before/after it. */
export async function moveCategoryHomePosition(id: string, direction: "up" | "down"): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: homeCategories, error } = await supabase
    .from("categories")
    .select("id, home_position")
    .eq("show_on_home", true)
    .order("home_position", { ascending: true });

  if (error || !homeCategories) {
    console.error("moveCategoryHomePosition error", error);
    return { error: "Could not reorder categories." };
  }

  const index = homeCategories.findIndex((c) => c.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= homeCategories.length) return {};

  // Normalize every row to a distinct, sequential position matching its
  // current order, then swap the pair — guards against rows that share a
  // default position value.
  const updates = homeCategories.map((c, i) => ({
    id: c.id,
    home_position: i === index ? swapIndex : i === swapIndex ? index : i,
  }));

  await Promise.all(
    updates.map((u) => supabase.from("categories").update({ home_position: u.home_position }).eq("id", u.id)),
  );

  return {};
}

/** Sets a category's exact homepage row position weight (lower shows first). */
export async function setCategoryHomePosition(id: string, position: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ home_position: Math.round(position) })
    .eq("id", id);
  if (error) {
    console.error("setCategoryHomePosition error", error);
    return { error: "Could not update category order." };
  }
  return {};
}
