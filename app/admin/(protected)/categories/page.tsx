import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { getActiveProductCountsByCategory, getAllCategories } from "@/lib/data/categories";
import { createCategoryAction } from "./actions";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [categories, productCounts] = await Promise.all([
    getAllCategories(),
    getActiveProductCountsByCategory(),
  ]);

  const homeOrder = categories
    .filter((c) => c.show_on_home)
    .sort((a, b) => a.home_position - b.home_position)
    .map((c) => c.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Create categories here, then tag products with them from the product form. Renaming a
        category updates it everywhere it&apos;s tagged. Turn on &quot;Show on Home&quot; to give a
        category its own row on the homepage — use the arrows to set the order those rows appear
        in.
      </p>

      <form action={createCategoryAction} className="mt-6 flex items-center gap-2">
        <Input name="name" placeholder="e.g. Rodcuts" required className="flex-1" />
        <Button type="submit" size="sm">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {categories.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-soft py-10 text-center text-sm text-ink-soft">
            No categories yet. Add your first one above.
          </p>
        ) : (
          categories.map((category) => {
            const homeIndex = homeOrder.indexOf(category.id);
            return (
              <CategoryRow
                key={category.id}
                category={category}
                productCount={productCounts[category.id] ?? 0}
                isFirstOnHome={homeIndex <= 0}
                isLastOnHome={homeIndex === -1 || homeIndex === homeOrder.length - 1}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
