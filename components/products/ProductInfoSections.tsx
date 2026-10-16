import Link from "next/link";
import { Clock, Gift, Globe, HandHeart, Palette, Ruler, Type } from "lucide-react";
import { Disclosure } from "@/components/ui/Disclosure";
import { POLICY } from "@/lib/legal";
import type { Product } from "@/types";

/** The 2×2 quick-facts grid under the price. Customisable products lead with what can be changed. */
export function ProductFeatureTiles({ product }: { product: Product }) {
  const making = { icon: Clock, title: "Making time", desc: `${POLICY.turnaroundDays} days` };
  const tiles = product.is_customisable
    ? [
        { icon: Palette, title: "Custom colours", desc: "& designs" },
        { icon: Ruler, title: "Size options", desc: "available" },
        { icon: Type, title: "Personalisation", desc: "(Names / Text)" },
        making,
      ]
    : [
        { icon: HandHeart, title: "Handcrafted", desc: "poured & finished by hand" },
        { icon: Gift, title: "Gift-ready", desc: "packed with care" },
        { icon: Globe, title: "Ships", desc: "India & worldwide" },
        making,
      ];

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-5">
      {tiles.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lilac text-amber-dark">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <span className="text-xs leading-snug text-ink">
            {title}
            <span className="block text-ink-soft">{desc}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Expandable "Product Details / What's Included / Care / Shipping / Bulk" sections. */
export function ProductInfoSections({ product }: { product: Product }) {
  const included = product.whats_included
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="border-t border-border-soft">
      <Disclosure title="Product Details">
        {product.description && <p className="whitespace-pre-line">{product.description}</p>}
        <ul className="mt-3 space-y-1">
          <li>Handmade resin — every piece is poured and finished by hand, so small variations make each one unique.</li>
          {product.categories.length > 0 && <li>Category: {product.categories.map((c) => c.name).join(", ")}</li>}
          {product.code && <li>Product code: {product.code}</li>}
        </ul>
      </Disclosure>

      {(included?.length || product.bundle_items.length > 0) && (
        <Disclosure title="What's Included">
          <ul className="list-disc space-y-1 pl-5">
            {included?.length
              ? included.map((line) => <li key={line}>{line}</li>)
              : product.bundle_items.map((item) => (
                  <li key={item.product_id}>
                    {item.quantity > 1 ? `${item.quantity} × ` : ""}
                    {item.name}
                  </li>
                ))}
          </ul>
        </Disclosure>
      )}

      <Disclosure title="Care Instructions">
        <ul className="list-disc space-y-1 pl-5">
          <li>Wipe clean with a soft, dry or slightly damp cloth.</li>
          <li>Keep away from direct sunlight and heat to avoid yellowing.</li>
          <li>Avoid harsh chemicals, abrasive scrubbers and the dishwasher.</li>
          <li>Handle with care — resin can chip or crack if dropped.</li>
        </ul>
      </Disclosure>

      <Disclosure title="Shipping & Delivery">
        <p>
          Made to order and dispatched within {POLICY.turnaroundDays} days. Delivery within India usually takes{" "}
          {POLICY.deliveryDays} business days after dispatch. We also ship internationally.
        </p>
        <Link href="/shipping-policy" className="mt-2 inline-block text-ink underline-offset-2 hover:underline">
          Read the shipping policy
        </Link>
      </Disclosure>

      <Disclosure title="Returns & Exchanges">
        <p>
          Every Spilled Colours piece is handmade and customized specifically for you, so we do not accept returns or
          exchanges for change of mind.
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          If your item arrives damaged, defective, or materially different from the approved design, please contact us
          within {POLICY.damageReportHours} hours of delivery with clear photos and an uncut unboxing video.
        </p>
        <Link href="/refund-policy" className="mt-2 inline-block font-medium text-ink underline underline-offset-2 hover:text-amber-dark">
          Read full Refund &amp; Cancellation Policy →
        </Link>
      </Disclosure>

      <Disclosure title="Bulk Orders">
        <p>Need this for a wedding, festive gifting or your team? We do bulk and corporate orders with custom details.</p>
        <Link href="/bulk-orders" className="mt-2 inline-block text-ink underline-offset-2 hover:underline">
          Request a bulk quote
        </Link>
      </Disclosure>
    </div>
  );
}
