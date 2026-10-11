import { Eyebrow } from "@/components/home/Eyebrow";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

/** Products starred as "Bestseller" in admin. Hidden until at least one is marked. */
export function Bestsellers({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:pb-16">
      <Eyebrow>Loved by our customers</Eyebrow>
      <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Best Sellers</h2>
      <p className="mt-1 text-sm text-ink-soft">The pieces people keep coming back for.</p>

      <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:gap-4">
        {products.map((product) => (
          <div key={product.id} className="w-[44%] shrink-0 snap-start sm:w-[calc(25%-9px)] lg:w-[calc(20%-13px)]">
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
