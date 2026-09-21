"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/validation";

export function BuyNowPanel({ slug, price }: { slug: string; price: number }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  function handleBuyNow() {
    router.push(`/checkout?product=${slug}&quantity=${quantity}`);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
        <Button onClick={handleBuyNow} size="lg" className="w-full sm:w-auto">
          Buy Now <ArrowRight className="h-4 w-4" />
        </Button>
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
