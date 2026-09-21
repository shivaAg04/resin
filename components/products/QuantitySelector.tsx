"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  quantity,
  onChange,
  max,
}: {
  quantity: number;
  onChange: (next: number) => void;
  max: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
