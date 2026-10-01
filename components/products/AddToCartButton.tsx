"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { cn } from "@/lib/utils/format";

interface AddToCartButtonProps {
  productSlug: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
  className?: string;
  /** Compact icon-only style, used on the product card overlay; the PDP uses the full labeled version. */
  iconOnly?: boolean;
}

export function AddToCartButton({
  productSlug,
  name,
  price,
  image,
  quantity = 1,
  className,
  iconOnly = false,
}: AddToCartButtonProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.productSlug === productSlug);
  const inCart = Boolean(cartItem);

  function stop(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleAdd(event: React.MouseEvent) {
    stop(event);
    addItem({ productSlug, name, price, image }, quantity);
  }

  function handleIncrement(event: React.MouseEvent) {
    stop(event);
    if (cartItem) updateQuantity(productSlug, cartItem.quantity + 1);
  }

  function handleDecrement(event: React.MouseEvent) {
    stop(event);
    if (cartItem) updateQuantity(productSlug, cartItem.quantity - 1);
  }

  if (iconOnly) {
    if (inCart && cartItem) {
      return (
        <div
          className={cn(
            "z-10 flex h-8 items-center gap-0.5 rounded-full border border-amber-dark bg-white px-1 shadow-sm sm:h-9",
            className,
          )}
        >
          <button
            type="button"
            onClick={handleDecrement}
            aria-label={`Decrease ${name} quantity`}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:h-7 sm:w-7"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-4 text-center text-xs font-semibold tabular-nums text-ink">{cartItem.quantity}</span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label={`Increase ${name} quantity`}
            className="flex h-6 w-6 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 sm:h-7 sm:w-7"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${name} to cart`}
        className={cn(
          "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition-colors hover:bg-ink/5 sm:h-9 sm:w-9",
          className,
        )}
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors",
        inCart
          ? "border-amber-dark bg-amber-light/50 text-ink"
          : "border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5",
        className,
      )}
    >
      {inCart ? <Check className="h-4 w-4 text-amber-dark" /> : <ShoppingBag className="h-4 w-4" />}
      {inCart ? `In Cart${cartItem && cartItem.quantity > 1 ? ` (${cartItem.quantity})` : ""}` : "Add to Cart"}
    </button>
  );
}
