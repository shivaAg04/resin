import type { AdminOrderFilters } from "@/lib/data/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

// No runtime imports from lib/data here: the client-side filter controls use this file too.

export const PAYMENT_FILTERS = ["cod", "paid", "unpaid", "failed"] as const;
export type PaymentFilter = (typeof PAYMENT_FILTERS)[number];

export const ORDER_SORTS = ["newest", "oldest", "amount_desc", "amount_asc"] as const;
export type OrderSort = (typeof ORDER_SORTS)[number];

/** Orders-page filters as plain strings, the shape the URL and the filter controls share. */
export interface OrderFilterValues {
  status: string;
  payment: string;
  search: string;
  from: string;
  to: string;
  sort: string;
}

export const ORDER_FILTER_DEFAULTS: OrderFilterValues = {
  status: "all",
  payment: "all",
  search: "",
  from: "",
  to: "",
  sort: "newest",
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: string): string {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? value : fallback;
}

/** Reads the filters from page search params, dropping anything unrecognised. */
export function parseOrderFilters(params: Record<string, string | string[] | undefined>): OrderFilterValues {
  const date = (value: unknown) => (typeof value === "string" && DATE_PATTERN.test(value) ? value : "");
  return {
    status: pick(params.status, ORDER_STATUSES, "all"),
    payment: pick(params.payment, PAYMENT_FILTERS, "all"),
    search: typeof params.search === "string" ? params.search.trim().slice(0, 100) : "",
    from: date(params.from),
    to: date(params.to),
    sort: pick(params.sort, ORDER_SORTS, "newest"),
  };
}

export function toAdminOrderFilters(values: OrderFilterValues): AdminOrderFilters {
  return {
    status: values.status as OrderStatus | "all",
    payment: values.payment as AdminOrderFilters["payment"],
    search: values.search,
    from: values.from || undefined,
    to: values.to || undefined,
    sort: values.sort as AdminOrderFilters["sort"],
  };
}

/** Builds the query string, leaving out anything still at its default so URLs stay short. */
export function buildOrderQuery(values: OrderFilterValues): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(ORDER_FILTER_DEFAULTS) as (keyof OrderFilterValues)[]) {
    const value = values[key].trim();
    if (value && value !== ORDER_FILTER_DEFAULTS[key]) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
