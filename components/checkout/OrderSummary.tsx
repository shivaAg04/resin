import { ProductImage } from "@/components/products/ProductImage";
import { formatPrice } from "@/lib/utils/format";

export function OrderSummary({
  productName,
  productImage,
  price,
  quantity,
}: {
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
}) {
  const subtotal = price * quantity;

  return (
    <div className="rounded-2xl border border-border-soft/70 bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Order Summary</h2>

      <div className="mt-4 flex items-center gap-4">
        <ProductImage src={productImage} alt={productName} className="h-16 w-16 shrink-0 rounded-xl" />
        <div className="flex-1">
          <p className="font-medium text-ink">{productName}</p>
          <p className="text-sm text-ink-soft">
            {formatPrice(price)} × {quantity}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t border-border-soft/70 pt-4 text-sm">
        <div className="flex justify-between text-ink-soft">
          <dt>Subtotal</dt>
          <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between font-display text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
    </div>
  );
}
