import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const primaryCategory = product.categories[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <Link href={`/products/${product.slug}`} className="relative block">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
        />
        {primaryCategory && (
          <Badge className="absolute left-3 top-3 border-white/40 bg-white/85 backdrop-blur-sm">
            {primaryCategory.name}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-display text-lg leading-tight text-ink transition-colors group-hover:text-amber-dark">
            {product.name}
          </h3>
        </Link>

        <span className="font-display text-xl font-medium text-amber-dark">
          {formatPrice(product.price)}
        </span>

        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">{product.description}</p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="-my-2 inline-block py-2 text-sm font-medium text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            View Details
          </Link>
          <ButtonLink
            href={`/checkout?product=${product.slug}&quantity=1`}
            variant="primary"
            size="sm"
            className="ml-auto"
          >
            Buy Now <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
