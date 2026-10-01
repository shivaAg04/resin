"use client";

import { AlertCircle } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCart } from "@/lib/cart/context";

/** Checks out whatever's currently in the cart — cart lives in localStorage, so this has to be a client component. */
export function CartCheckout() {
  const { items, isHydrated } = useCart();

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
        <h2 className="font-display text-2xl font-semibold text-ink">Your cart is empty</h2>
        <ButtonLink href="/products">Browse products</ButtonLink>
      </div>
    );
  }

  return <CheckoutForm />;
}
