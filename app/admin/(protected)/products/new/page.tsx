import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAllCategories } from "@/lib/data/categories";
import { getAllProductsAdmin } from "@/lib/data/products";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const [categories, allProducts] = await Promise.all([getAllCategories(), getAllProductsAdmin()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Add Product</h1>
      <div className="mt-6">
        <ProductForm categories={categories} allProducts={allProducts} />
      </div>
    </div>
  );
}
