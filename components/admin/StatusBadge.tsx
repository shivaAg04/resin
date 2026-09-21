import { cn } from "@/lib/utils/format";
import type { OrderStatus } from "@/types";

const styles: Record<OrderStatus, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed: "bg-purple-50 text-purple-700 border-purple-200",
  processing: "bg-amber-50 text-amber-800 border-amber-200",
  shipped: "bg-cyan-50 text-cyan-700 border-cyan-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
