import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductReviewsManager } from "@/components/admin/ProductReviewsManager";
import { getAllProductsAdmin, getProductByIdAdmin } from "@/lib/data/products";
import { getAllCategories } from "@/lib/data/categories";
import { getAllReviewsForProductAdmin } from "@/lib/data/reviews";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage(props: PageProps<"/admin/products/[id]/edit">) {
  const { id } = await props.params;
  const [product, categories, reviews, allProducts] = await Promise.all([
    getProductByIdAdmin(id),
    getAllCategories(),
    getAllReviewsForProductAdmin(id),
    getAllProductsAdmin(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit Product</h1>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} allProducts={allProducts} />
      </div>

      <div className="mt-10 max-w-2xl border-t border-border-soft/70 pt-8">
        <h2 className="font-display text-xl font-semibold text-ink">Customer Reviews</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Add reviews you&apos;ve collected (WhatsApp, DMs, etc.) — shown on this product&apos;s page.
        </p>
        <div className="mt-4">
          <ProductReviewsManager productId={product.id} reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
