"use client";

import { useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/format";
import {
  buildOrderQuery,
  ORDER_FILTER_DEFAULTS as DEFAULTS,
  type OrderFilterValues,
} from "@/lib/admin/order-filters";
import { ORDER_STATUSES } from "@/types";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: status[0].toUpperCase() + status.slice(1) })),
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "cod", label: "COD" },
  { value: "paid", label: "Paid online" },
  { value: "unpaid", label: "Online · unpaid" },
  { value: "failed", label: "Payment failed" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount_desc", label: "Amount: high to low" },
  { value: "amount_asc", label: "Amount: low to high" },
];

export function OrderFilters({ values }: { values: OrderFilterValues }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(values.search);

  function apply(changes: Partial<OrderFilterValues>) {
    const next = { ...values, search, ...changes };
    startTransition(() => router.push(`${pathname}${buildOrderQuery(next)}`, { scroll: false }));
  }

  function onSearch(event: FormEvent) {
    event.preventDefault();
    apply({ search });
  }

  const hasFilters = buildOrderQuery({ ...values, sort: DEFAULTS.sort }) !== "";

  return (
    <div className="space-y-4 rounded-2xl border border-border-soft/70 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form onSubmit={onSearch} role="search" className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order no., name, phone, Razorpay ID… (press Enter)"
            aria-label="Search orders"
            className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-ink-soft">
            From
            <input
              type="date"
              value={values.from}
              max={values.to || undefined}
              onChange={(e) => apply({ from: e.target.value })}
              className="rounded-lg border border-ink/15 bg-white px-2 py-2 text-sm text-ink outline-none focus:border-amber"
            />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-ink-soft">
            To
            <input
              type="date"
              value={values.to}
              min={values.from || undefined}
              onChange={(e) => apply({ to: e.target.value })}
              className="rounded-lg border border-ink/15 bg-white px-2 py-2 text-sm text-ink outline-none focus:border-amber"
            />
          </label>
          <select
            value={values.sort}
            onChange={(e) => apply({ sort: e.target.value })}
            aria-label="Sort orders"
            className="rounded-lg border border-ink/15 bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-amber"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChipRow label="Status" options={STATUS_OPTIONS} active={values.status} onSelect={(status) => apply({ status })} />
      <ChipRow
        label="Payment"
        options={PAYMENT_OPTIONS}
        active={values.payment}
        onSelect={(payment) => apply({ payment })}
      />

      {(hasFilters || isPending) && (
        <div className="flex items-center gap-3 text-xs">
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                startTransition(() => router.push(pathname, { scroll: false }));
              }}
              className="inline-flex items-center gap-1 font-medium text-amber-dark hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1 text-ink-soft">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ChipRow({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          aria-pressed={active === option.value}
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
            active === option.value
              ? "border-ink bg-ink text-cream"
              : "border-border-soft text-ink-soft hover:border-ink/30",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
