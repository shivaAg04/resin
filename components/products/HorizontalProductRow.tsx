import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Category, Product } from "@/types";

export function HorizontalProductRow({ category, products }: { category: Category; products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{category.name}</h2>
        <ButtonLink href={`/products?category=${category.slug}`} variant="ghost" size="sm">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </ButtonLink>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {products.map((product) => (
          <div key={product.id} className="w-[46%] shrink-0 snap-start sm:w-[calc(25%-12px)]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
