import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Add Product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
