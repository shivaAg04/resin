import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/Eyebrow";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { Product } from "@/types";

/** "New at Spilled Colours" products, next to the "It's the idea behind it" story teaser. */
export function NewArrivals({ products, storyImage }: { products: Product[]; storyImage?: string }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[2fr_1fr] lg:py-16">
      {products.length > 0 && (
        <div className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <Eyebrow>
                <span className="rounded-full bg-lilac px-2 py-0.5 text-amber-dark">Just created</span>
              </Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">New at Spilled Colours</h2>
              <p className="mt-1 text-sm text-ink-soft">Fresh designs, new colours and recent creations.</p>
            </div>
            <Link href="/products" className="flex shrink-0 items-center gap-1 text-sm text-ink hover:text-amber-dark">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
            {products.map((product) => (
              <div key={product.id} className="w-[44%] shrink-0 snap-start sm:w-auto">
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex min-h-[320px] overflow-hidden rounded-lg bg-lilac">
        {storyImage && (
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-60 [mask-image:linear-gradient(to_left,black_40%,transparent)]">
            <ProductImage src={storyImage} alt="" sizes="240px" className="h-full w-full" />
          </div>
        )}
        <div className="relative flex max-w-[16rem] flex-col justify-center p-6 sm:p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">More than resin.</p>
          <h2 className="mt-2 font-display text-3xl font-medium uppercase leading-none text-ink">
            It&apos;s the idea behind it.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Spilled Colours started with resin and a lot of experimenting. What began as a small creative hobby
            slowly turned into a business built around creating pieces that don&apos;t have to look like
            everything else.
          </p>
          <ButtonLink href="/about" size="sm" className="mt-6 self-start text-[11px] uppercase tracking-[0.12em]">
            Meet Spilled Colours <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
