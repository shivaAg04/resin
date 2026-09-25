import type { Category, Product } from "@/types";

/**
 * Demo fallback data — used only when Supabase hasn't been configured yet
 * (see products.ts). Mirrors supabase/seed.sql so the local preview and a
 * freshly-seeded real database look the same. Once real credentials + the
 * migration/seed are in place, Supabase queries succeed and this is never
 * reached.
 */
const now = new Date().toISOString();

function category(id: string, code: string, name: string, slug: string, homePosition: number): Category {
  return { id, code, name, slug, show_on_home: true, home_position: homePosition, created_at: now, updated_at: now };
}

const RODCUTS = category("c0000000-0000-0000-0000-000000000001", "C001", "Rodcuts", "rodcuts", 0);
const CUSTOM = category("c0000000-0000-0000-0000-000000000002", "C002", "Custom", "custom", 1);
const PREMIUM = category("c0000000-0000-0000-0000-000000000003", "C003", "Premium", "premium", 2);

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    code: "P001",
    name: "Resin Rodcut Classic",
    slug: "resin-rodcut-classic",
    description:
      "A timeless handmade resin rodcut piece with a smooth glass-like finish. Each one is individually cast and polished by hand.",
    price: 299,
    categories: [RODCUTS],
    is_active: true,
    images: [],
    sort_order: 0,
    reel_url: null,
    bundle_items: [],
    discount_amount: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    code: "P002",
    name: "Ocean Blue Resin Rodcut",
    slug: "ocean-blue-resin-rodcut",
    description:
      "Inspired by ocean waves, this rodcut swirls deep blues and whites for a calming, beach-glass look.",
    price: 399,
    categories: [RODCUTS],
    is_active: true,
    images: [],
    sort_order: 1,
    reel_url: null,
    bundle_items: [],
    discount_amount: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    code: "P003",
    name: "Floral Resin Rodcut",
    slug: "floral-resin-rodcut",
    description: "Real dried flowers suspended in crystal-clear resin — a delicate, nature-inspired keepsake.",
    price: 449,
    categories: [RODCUTS],
    is_active: true,
    images: [],
    sort_order: 2,
    reel_url: null,
    bundle_items: [],
    discount_amount: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    code: "P004",
    name: "Custom Name Resin Rodcut",
    slug: "custom-name-resin-rodcut",
    description: "Personalize this rodcut with any name or short text, hand-finished in resin. Perfect as a gift.",
    price: 599,
    categories: [CUSTOM],
    is_active: true,
    images: [],
    sort_order: 3,
    reel_url: null,
    bundle_items: [],
    discount_amount: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    code: "P005",
    name: "Premium Resin Rodcut",
    slug: "premium-resin-rodcut",
    description:
      "Our most detailed piece, layered with metallic pigments and gold foil accents for a premium finish.",
    price: 699,
    categories: [PREMIUM, RODCUTS],
    is_active: true,
    images: [],
    sort_order: 4,
    reel_url: null,
    bundle_items: [],
    discount_amount: 0,
    created_at: now,
    updated_at: now,
  },
];
