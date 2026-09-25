import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { SearchBar } from "@/components/products/SearchBar";
import { getActiveCategories, getActiveProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full collection of handmade resin rodcuts and custom pieces.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [products, categories] = await Promise.all([
    getActiveProducts({ categorySlug, search }),
    getActiveCategories(),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === categorySlug)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Shop All</h1>
          <p className="mt-1 text-sm text-ink-soft">Handmade resin pieces, ready to ship.</p>
        </div>
        <SearchBar defaultValue={search} category={categorySlug} />
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} activeSlug={categorySlug} />
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-soft py-16 text-center text-sm text-ink-soft">
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
