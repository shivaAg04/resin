import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/Eyebrow";
import { ProductImage } from "@/components/products/ProductImage";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Find your kind of creation</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Shop by Category</h2>
        </div>
        <Link href="/products" className="flex shrink-0 items-center gap-1 text-sm text-ink hover:text-amber-dark">
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group overflow-hidden rounded-lg bg-white ring-1 ring-ink/[0.06] transition-shadow hover:shadow-lg hover:shadow-ink/10"
          >
            <ProductImage
              src={category.image_url ?? undefined}
              alt={category.name}
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
              className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="px-2 py-3 text-center">
              <h3 className="font-display text-base font-medium text-ink sm:text-lg">{category.name}</h3>
              {category.description && (
                <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-soft">{category.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
