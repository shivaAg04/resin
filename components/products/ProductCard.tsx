import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border-soft/70 bg-white transition-shadow hover:shadow-lg hover:shadow-black/5">
      <Link href={`/products/${product.slug}`} className="block">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
        </Link>

        {product.description && (
          <p className="line-clamp-2 text-sm text-ink-soft">{product.description}</p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="font-display text-lg font-medium text-amber-dark">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <ButtonLink href={`/products/${product.slug}`} variant="outline" size="sm" className="flex-1">
            View Details
          </ButtonLink>
          <ButtonLink
            href={`/checkout?product=${product.slug}&quantity=1`}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Buy Now <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
