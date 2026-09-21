import Link from "next/link";
import { cn } from "@/lib/utils/format";
import type { Category } from "@/types";

export function CategoryTagPicker({
  categories,
  selectedIds,
  onChange,
}: {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  return (
    <div>
      {categories.length === 0 ? (
        <p className="text-sm text-ink-soft">
          No categories yet.{" "}
          <Link href="/admin/categories" className="font-medium text-amber-dark hover:underline">
            Create one
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = selectedIds.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggle(category.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  selected
                    ? "border-ink bg-ink text-cream"
                    : "border-border-soft text-ink-soft hover:border-ink/30",
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}
      <Link
        href="/admin/categories"
        className="mt-2 inline-block text-xs text-ink-soft underline-offset-2 hover:text-ink hover:underline"
      >
        Manage categories
      </Link>
    </div>
  );
}
