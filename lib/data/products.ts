import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import type { Category, Product, ProductInput } from "@/types";

const PRODUCT_WITH_CATEGORIES_SELECT = "*, product_categories(categories(*))";

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Flattens the `product_categories(categories(*))` embed into `categories: Category[]`. */
function mapProductRow(row: Record<string, unknown>): Product {
  const { product_categories, ...rest } = row as {
    product_categories?: { categories: Category | null }[];
  } & Record<string, unknown>;

  return {
    ...(rest as Omit<Product, "categories">),
    categories: (product_categories ?? []).map((pc) => pc.categories).filter((c): c is Category => Boolean(c)),
  };
}

/**
 * Demo fallback: Supabase isn't reachable/configured yet (no project set up,
 * or migrations not run). Rather than showing an empty storefront, fall back
 * to the same sample products from supabase/seed.sql so the site is
 * browsable out of the box. Once Supabase is connected, queries succeed and
 * this path is never used.
 */
function warnMockDataFallback(error: unknown): boolean {
  if (error) console.error("Supabase product query failed, using demo data instead:", error);
  return true;
}

/** Public: active products only (RLS enforces this for anon, this is belt-and-braces). */
export async function getActiveProducts(options?: { categorySlug?: string; search?: string }): Promise<Product[]> {
  const search = options?.search?.trim();

  if (search) {
    return searchActiveProducts(search, options?.categorySlug);
  }

  try {
    const supabase = await createClient();

    const { data, error } = await (options?.categorySlug
      ? supabase
          .from("products")
          .select("*, product_categories!inner(categories!inner(*))")
          .eq("is_active", true)
          .eq("product_categories.categories.slug", options.categorySlug)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
      : supabase
          .from("products")
          .select(PRODUCT_WITH_CATEGORIES_SELECT)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }));

    if (error) throw error;
    return (data as Record<string, unknown>[]).map(mapProductRow);
  } catch (error) {
    warnMockDataFallback(error);
    return MOCK_PRODUCTS.filter(
      (p) => !options?.categorySlug || p.categories.some((c) => c.slug === options.categorySlug),
    );
  }
}

/**
 * Searches active products by category name and title. Results are ordered
 * category-match first, then title-match, per each group's normal display
 * order — so searching "Diwali" surfaces the whole Diwali category ahead of
 * a single product that merely has "Diwali" in its name.
 */
async function searchActiveProducts(query: string, categorySlug?: string): Promise<Product[]> {
  const term = `%${query}%`;

  try {
    const supabase = await createClient();

    if (categorySlug) {
      // Already scoped to one category — no category-vs-title priority to resolve.
      const { data, error } = await supabase
        .from("products")
        .select("*, product_categories!inner(categories!inner(*))")
        .eq("is_active", true)
        .eq("product_categories.categories.slug", categorySlug)
        .ilike("name", term)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data as Record<string, unknown>[]).map(mapProductRow);
    }

    const [byCategory, byTitle] = await Promise.all([
      supabase
        .from("products")
        .select("*, product_categories!inner(categories!inner(*))")
        .eq("is_active", true)
        .ilike("product_categories.categories.name", term)
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(PRODUCT_WITH_CATEGORIES_SELECT)
        .eq("is_active", true)
        .ilike("name", term)
        .order("sort_order", { ascending: true }),
    ]);

    if (byCategory.error) throw byCategory.error;
    if (byTitle.error) throw byTitle.error;

    const seen = new Set<string>();
    const results: Product[] = [];
    for (const row of [...(byCategory.data ?? []), ...(byTitle.data ?? [])]) {
      const product = mapProductRow(row as Record<string, unknown>);
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      results.push(product);
    }
    return results;
  } catch (error) {
    warnMockDataFallback(error);
    const lower = query.toLowerCase();
    const inCategory = (p: Product) => p.categories.some((c) => c.name.toLowerCase().includes(lower));
    const inTitle = (p: Product) => p.name.toLowerCase().includes(lower);
    const pool = MOCK_PRODUCTS.filter(
      (p) => !categorySlug || p.categories.some((c) => c.slug === categorySlug),
    );
    const byCategory = pool.filter(inCategory);
    const byTitle = pool.filter((p) => inTitle(p) && !inCategory(p));
    return [...byCategory, ...byTitle];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_CATEGORIES_SELECT)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as Record<string, unknown>[]).map(mapProductRow);
  } catch (error) {
    warnMockDataFallback(error);
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

/** Active products tagged with a category, for a homepage horizontal row. */
export async function getProductsByCategoryForHome(categorySlug: string, limit = 8): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories!inner(categories!inner(*))")
      .eq("is_active", true)
      .eq("product_categories.categories.slug", categorySlug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as Record<string, unknown>[]).map(mapProductRow);
  } catch (error) {
    warnMockDataFallback(error);
    return MOCK_PRODUCTS.filter((p) => p.categories.some((c) => c.slug === categorySlug)).slice(0, limit);
  }
}

/** Categories currently tagged on at least one active product — for the public filter bar. */
export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*, product_categories!inner(products!inner(is_active))")
      .eq("product_categories.products.is_active", true)
      .order("name");

    if (error) throw error;
    const seen = new Set<string>();
    const categories: Category[] = [];
    for (const row of data as (Category & Record<string, unknown>)[]) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      const { product_categories, ...category } = row as typeof row & { product_categories?: unknown };
      void product_categories;
      categories.push(category as Category);
    }
    return categories;
  } catch (error) {
    warnMockDataFallback(error);
    const seen = new Map<string, Category>();
    for (const product of MOCK_PRODUCTS) {
      for (const category of product.categories) seen.set(category.id, category);
    }
    return Array.from(seen.values());
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_CATEGORIES_SELECT)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return mapProductRow(data as Record<string, unknown>);
    // A real, connected Supabase project simply has no such product — don't
    // mask that with demo data.
    return null;
  } catch (error) {
    warnMockDataFallback(error);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

// ------------------------------------------------------------
// Admin (requires an authenticated session; pages are protected by
// proxy.ts + RLS policies restrict these to the `authenticated` role).
// ------------------------------------------------------------

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_CATEGORIES_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProductsAdmin error", error);
    return [];
  }
  return (data as Record<string, unknown>[]).map(mapProductRow);
}

/** Swaps a product's display order with the one immediately before/after it in the admin list. */
export async function moveProductSortOrder(id: string, direction: "up" | "down"): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: ordered, error } = await supabase
    .from("products")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !ordered) {
    console.error("moveProductSortOrder error", error);
    return { error: "Could not reorder products." };
  }

  const index = ordered.findIndex((p) => p.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= ordered.length) return {};

  // Normalize every row to a distinct, sequential sort_order matching its
  // current position (freshly created products all default to 0, so a
  // plain two-row swap would otherwise be a no-op), then swap the pair.
  const updates = ordered.map((p, i) => ({
    id: p.id,
    sort_order: i === index ? swapIndex : i === swapIndex ? index : i,
  }));

  await Promise.all(updates.map((u) => supabase.from("products").update({ sort_order: u.sort_order }).eq("id", u.id)));

  return {};
}

/** Sets a product's exact display order weight (lower shows first). */
export async function setProductSortOrder(id: string, sortOrder: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ sort_order: Math.round(sortOrder) })
    .eq("id", id);
  if (error) {
    console.error("setProductSortOrder error", error);
    return { error: "Could not update sort order." };
  }
  return {};
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_CATEGORIES_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getProductByIdAdmin error", error);
    return null;
  }
  return data ? mapProductRow(data as Record<string, unknown>) : null;
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string, excludeId?: string) {
  let slug = toSlug(base);
  if (!slug) slug = "product";
  let suffix = 1;
  while (true) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    suffix += 1;
    slug = `${toSlug(base)}-${suffix}`;
  }
}

/** Replaces a product's category tags with exactly the given set. */
async function syncProductCategories(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  categoryIds: string[],
) {
  const { error: deleteError } = await supabase.from("product_categories").delete().eq("product_id", productId);
  if (deleteError) {
    console.error("syncProductCategories delete error", deleteError);
    return;
  }
  if (categoryIds.length === 0) return;

  const { error: insertError } = await supabase
    .from("product_categories")
    .insert(categoryIds.map((categoryId) => ({ product_id: productId, category_id: categoryId })));
  if (insertError) {
    console.error("syncProductCategories insert error", insertError);
  }
}

export async function createProduct(input: ProductInput): Promise<{ product?: Product; error?: string }> {
  const supabase = await createClient();
  const slug = await uniqueSlug(supabase, input.slug || input.name);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug,
      description: input.description.trim() || null,
      price: input.price,
      is_active: input.is_active,
      images: input.images,
    })
    .select("*")
    .single();

  if (error) {
    console.error("createProduct error", error);
    return { error: "Could not create product. Please try again." };
  }

  await syncProductCategories(supabase, data.id, input.categoryIds);
  const product = await getProductByIdAdmin(data.id);
  return { product: product ?? undefined };
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<{ product?: Product; error?: string }> {
  const supabase = await createClient();
  const slug = await uniqueSlug(supabase, input.slug || input.name, id);

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      slug,
      description: input.description.trim() || null,
      price: input.price,
      is_active: input.is_active,
      images: input.images,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateProduct error", error);
    return { error: "Could not update product. Please try again." };
  }

  await syncProductCategories(supabase, id, input.categoryIds);
  const product = await getProductByIdAdmin(data.id);
  return { product: product ?? undefined };
}

export async function setProductActive(id: string, isActive: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) {
    console.error("setProductActive error", error);
    return { error: "Could not update product." };
  }
  return {};
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("deleteProduct error", error);
    return { error: "Could not delete this product — it may already be referenced by an order." };
  }
  return {};
}

/**
 * Fetches a product for order creation using the service-role client, since
 * this runs from the checkout API route on behalf of an anonymous customer
 * and must see the authoritative price regardless of RLS.
 */
export async function getProductForOrder(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getProductForOrder error", error);
    return null;
  }
  return data as Omit<Product, "categories"> | null;
}
