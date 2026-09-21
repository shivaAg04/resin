import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { getActiveCategories, getActiveProducts } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our full collection of handmade resin rodcuts and custom pieces.",
};

export default async function ProductsPage(props: PageProps<"/products">) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;

  const [products, categories] = await Promise.all([
    getActiveProducts({ categorySlug }),
    getActiveCategories(),
  ]);

  const activeCategoryName = categories.find((c) => c.slug === categorySlug)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Shop All</h1>
        <p className="mt-1 text-sm text-ink-soft">Handmade resin pieces, ready to ship.</p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} activeSlug={categorySlug} />
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-soft py-16 text-center text-sm text-ink-soft">
          No products found{activeCategoryName ? ` in "${activeCategoryName}"` : ""}. Check back soon!
        </p>
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
