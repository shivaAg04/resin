import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

const tabs: Array<{ label: string; value: OrderStatus | "all" }> = [
  { label: "All", value: "all" },
  ...ORDER_STATUSES.map((status) => ({ label: status[0].toUpperCase() + status.slice(1), value: status })),
];

export function OrderStatusFilter({ active }: { active: OrderStatus | "all" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value === "all" ? "/admin/orders" : `/admin/orders?status=${tab.value}`}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === tab.value
              ? "border-ink bg-ink text-cream"
              : "border-border-soft text-ink-soft hover:border-ink/30",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
