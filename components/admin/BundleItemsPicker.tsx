import { cn } from "@/lib/utils/format";
import { formatPrice } from "@/lib/utils/format";

export interface PickableProduct {
  id: string;
  name: string;
  price: number;
}

export function BundleItemsPicker({
  products,
  selectedIds,
  onChange,
}: {
  products: PickableProduct[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  if (products.length === 0) {
    return <p className="text-sm text-ink-soft">Add at least one other product first to bundle it in here.</p>;
  }

  return (
    <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto rounded-xl border border-border-soft/70 p-2">
      {products.map((product) => {
        const selected = selectedIds.includes(product.id);
        return (
          <button
            key={product.id}
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={selected}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              selected ? "bg-ink text-cream" : "text-ink hover:bg-ink/5",
            )}
          >
            <span className="truncate">{product.name}</span>
            <span className={cn("shrink-0 text-xs", selected ? "text-cream/80" : "text-ink-soft")}>
              {formatPrice(product.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
