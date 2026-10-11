import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { SearchBar } from "@/components/products/SearchBar";
import { Eyebrow } from "@/components/home/Eyebrow";
import { getActiveCategories, getActiveProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full collection of handmade resin products and custom pieces.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [products, categories] = await Promise.all([
    getActiveProducts({ categorySlug, search }),
    getActiveCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const activeCategoryName = activeCategory?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>{activeCategory ? "Shop by category" : "Handcrafted resin"}</Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
            {activeCategoryName ?? "Shop the Collection"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {activeCategory?.description ?? "Find your kind of creation — or send us your idea and we'll make it."}
          </p>
        </div>
        <SearchBar defaultValue={search} category={categorySlug} />
      </div>

      <div className="mb-8 border-b border-border-soft pb-6">
        <CategoryFilter categories={categories} activeSlug={categorySlug} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-soft py-16 text-center text-sm text-ink-soft">
          <p>
            {search ? (
              <>
                No results for &quot;{search}&quot;
                {activeCategoryName ? ` in "${activeCategoryName}"` : ""}.
              </>
            ) : (
              <>No products found{activeCategoryName ? ` in "${activeCategoryName}"` : ""}. Check back soon!</>
            )}
          </p>
          {search && (
            <Link
              href={categorySlug ? `/products?category=${categorySlug}` : "/products"}
              className="mt-3 inline-block font-medium text-amber-dark hover:underline"
            >
              Clear search
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
