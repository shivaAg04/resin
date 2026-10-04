"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/order-limits";

interface BuyNowPanelProps {
  slug: string;
  name: string;
  price: number;
  image?: string;
}

export function BuyNowPanel({ slug, name, price, image }: BuyNowPanelProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  function handleBuyNow() {
    router.push(`/checkout?product=${slug}&quantity=${quantity}`);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
        <div className="flex gap-3">
          <AddToCartButton productSlug={slug} name={name} price={price} image={image} quantity={quantity} className="flex-1 sm:flex-none" />
          <Button onClick={handleBuyNow} size="lg" className="flex-1 sm:flex-none">
            Buy Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border-soft/70 bg-cream/95 p-3 backdrop-blur sm:hidden">
        <div className="flex flex-col">
          <span className="text-xs text-ink-soft">Total</span>
          <span className="font-display text-lg font-semibold">{formatPrice(price * quantity)}</span>
        </div>
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
        <Button onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
      <div className="h-16 sm:hidden" aria-hidden />
    </>
  );
}
