import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { formatPrice } from "@/lib/utils/format";
import { getProductBadgeLabels } from "@/lib/products/badges";
import type { Product } from "@/types";

export function ProductPrice({ product, className }: { product: Product; className?: string }) {
  return (
    <p className={className}>
      {formatPrice(product.price)}
      {product.is_customisable && <span className="text-[0.85em] font-normal text-ink-soft"> onwards</span>}
    </p>
  );
}

/**
 * Product card for the shop grid and homepage rows. `compact` drops the
 * description and quick-add button for the narrow "New at Spilled
 * Colours" cards.
 */
export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const labels = getProductBadgeLabels(product);
  const [ribbon, ...chips] = labels;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-ink/[0.06] transition-shadow duration-300 hover:shadow-lg hover:shadow-ink/10">
      <div className="relative overflow-hidden">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          sizes={compact ? "(min-width: 1024px) 170px, 45vw" : undefined}
          className={`${compact ? "aspect-[4/5]" : "aspect-square"} w-full transition-transform duration-500 group-hover:scale-105`}
        />
        {ribbon && !compact && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-dark shadow-sm">
            {ribbon}
          </span>
        )}
        {!compact && !product.design_options?.length && (
          <AddToCartButton
            productSlug={product.slug}
            name={product.name}
            price={Number(product.price)}
            image={product.images?.[0]}
            iconOnly
            className="absolute right-2 top-2"
          />
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-1 ${compact ? "p-3" : "p-3 sm:p-4"}`}>
        <h3
          className={
            compact
              ? "line-clamp-2 text-[13px] leading-snug text-ink"
              : "line-clamp-2 font-display text-base font-medium leading-snug text-ink sm:text-lg"
          }
        >
          {product.name}
        </h3>
        <ProductPrice
          product={product}
          className={compact ? "text-[13px] text-ink-soft" : "font-display text-base font-semibold text-amber-dark sm:text-lg"}
        />

        {!compact && product.description && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-soft sm:text-[13px]">{product.description}</p>
        )}

        {(compact ? labels : chips).length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {(compact ? labels.slice(0, 1) : chips).map((label) => (
              <span key={label} className="rounded-full bg-lilac px-2 py-0.5 text-[10px] font-medium text-amber-dark">
                {label}
              </span>
            ))}
          </div>
        )}

        <span className="mt-auto flex items-center gap-1 pt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink group-hover:text-amber-dark">
          View Details <ArrowRight className="h-3 w-3" />
        </span>
      </div>

      {/* Stretched link — the whole card opens the product page, while the
          quick-add button (z-10 above) stays independently clickable. */}
      <Link href={`/products/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>
    </div>
  );
}
