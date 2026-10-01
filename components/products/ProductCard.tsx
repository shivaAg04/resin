import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <div className="relative">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
        />
        <AddToCartButton
          productSlug={product.slug}
          name={product.name}
          price={Number(product.price)}
          image={product.images?.[0]}
          iconOnly
          className="absolute right-2 top-2"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-5">
        <h3 className="line-clamp-2 font-display text-sm leading-snug text-ink transition-colors group-hover:text-amber-dark sm:text-lg sm:leading-tight">
          {product.name}
        </h3>

        <span className="font-display text-base font-medium text-amber-dark sm:text-xl">
          {formatPrice(product.price)}
        </span>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>
        )}

        <div className="mt-4">
          <ButtonLink
            href={`/checkout?product=${product.slug}&quantity=1`}
            variant="primary"
            size="xs"
            className="relative z-10 w-full sm:h-9 sm:px-4 sm:text-sm"
          >
            Buy Now <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          </ButtonLink>
        </div>
      </div>

      {/* Stretched link — makes the whole card clickable to the product page,
          while Buy Now (relative z-10 above) stays independently clickable. */}
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>
    </div>
  );
}
