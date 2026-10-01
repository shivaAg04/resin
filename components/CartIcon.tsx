"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" aria-label="Cart" className="relative flex items-center text-ink-soft transition-colors hover:text-ink">
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-dark px-1 text-[10px] font-semibold text-cream">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
