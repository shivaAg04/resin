import Link from "next/link";
import { cn } from "@/lib/utils/format";
import type { Category } from "@/types";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products"
        className={cn(
          "rounded-full border px-4 py-1.5 text-[13px] transition-colors",
          !activeSlug
            ? "border-ink bg-ink text-cream"
            : "border-ink/15 bg-white text-ink-soft hover:border-ink/40 hover:text-ink",
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.slug)}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-[13px] transition-colors",
            activeSlug === category.slug
              ? "border-ink bg-ink text-cream"
              : "border-ink/15 bg-white text-ink-soft hover:border-ink/40 hover:text-ink",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
