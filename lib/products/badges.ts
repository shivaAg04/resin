import type { Product } from "@/types";

/** Optional product badges an admin can switch on, in display order. */
export const PRODUCT_BADGES = [
  { value: "bestseller", label: "Bestseller" },
  { value: "gift_ready", label: "Gift-ready" },
  { value: "made_to_order", label: "Made to order" },
] as const;

export type ProductBadge = (typeof PRODUCT_BADGES)[number]["value"];

export function isProductBadge(value: string): value is ProductBadge {
  return PRODUCT_BADGES.some((b) => b.value === value);
}

/** Every label to show for a product: "Customisable" first, then its badges in the fixed order. */
export function getProductBadgeLabels(product: Pick<Product, "is_customisable" | "badges">): string[] {
  const labels: string[] = product.is_customisable ? ["Customisable"] : [];
  for (const badge of PRODUCT_BADGES) {
    if (product.badges?.includes(badge.value)) labels.push(badge.label);
  }
  return labels;
}
