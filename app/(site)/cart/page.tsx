"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatPrice } from "@/lib/utils/format";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/validation";
import { useCart } from "@/lib/cart/context";

export default function CartPage() {
  const { items, isHydrated, updateQuantity, removeItem, totalPrice } = useCart();

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
        <h1 className="font-display text-2xl font-semibold text-ink">Your cart is empty</h1>
        <ButtonLink href="/products">Browse products</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-ink">Your Cart</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productSlug}
            className="flex flex-col gap-3 rounded-2xl border border-border-soft/70 bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-4">
              <ProductImage src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.productSlug}`} className="block truncate font-medium text-ink hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-ink-soft">{formatPrice(item.price)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <QuantitySelector
                quantity={item.quantity}
                onChange={(next) => updateQuantity(item.productSlug, Math.min(MAX_ORDER_QUANTITY, next))}
                max={MAX_ORDER_QUANTITY}
              />
              <p className="w-20 text-right text-sm font-medium tabular-nums text-ink">
                {formatPrice(item.price * item.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productSlug)}
                aria-label={`Remove ${item.name} from cart`}
                className="text-ink-soft transition-colors hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border-soft/70 pt-6">
        <span className="font-display text-lg font-semibold text-ink">Total</span>
        <span className="font-display text-xl font-semibold text-amber-dark">{formatPrice(totalPrice)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/checkout" size="lg" className="w-full sm:w-auto">
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href="/products" variant="outline" size="lg" className="w-full sm:w-auto">
          Continue Shopping
        </ButtonLink>
      </div>
    </div>
  );
}
