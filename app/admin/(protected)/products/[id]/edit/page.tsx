import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductByIdAdmin } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage(props: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await props.params;
  const [product, categories] = await Promise.all([getProductByIdAdmin(id), getAllCategories()]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit Product</h1>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
