import { ProductImage } from "@/components/products/ProductImage";
import { formatPrice } from "@/lib/utils/format";

export interface OrderSummaryItem {
  productSlug: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export function OrderSummary({ items }: { items: OrderSummaryItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="rounded-2xl border border-border-soft/70 bg-white p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Order Summary</h2>

      <div className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.productSlug} className="flex items-center gap-4">
            <ProductImage src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-ink-soft">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
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
