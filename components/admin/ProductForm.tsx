"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategoryTagPicker } from "@/components/admin/CategoryTagPicker";
import { BundleItemsPicker, type PickableProduct } from "@/components/admin/BundleItemsPicker";
import { createProductAction, updateProductAction } from "@/app/admin/(protected)/products/actions";
import type { Category, Product, ProductInput } from "@/types";

export function ProductForm({
  product,
  categories,
  allProducts,
}: {
  product?: Product;
  categories: Category[];
  allProducts: PickableProduct[];
}) {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categories.map((c) => c.id) ?? []);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [reelUrl, setReelUrl] = useState(product?.reel_url ?? "");
  const [bundleItemIds, setBundleItemIds] = useState<string[]>(product?.bundle_items.map((b) => b.product_id) ?? []);

  const pickableProducts = allProducts.filter((p) => p.id !== product?.id);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const priceValue = Number(price);

    if (!name.trim()) return setError("Product name is required.");
    if (!Number.isFinite(priceValue) || priceValue < 0) return setError("Enter a valid price.");

    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: priceValue,
      categoryIds,
      is_active: isActive,
      images,
      reelUrl: reelUrl.trim(),
      bundleItemIds,
    };

    setSubmitting(true);
    const result = isEditing
      ? await updateProductAction(product!.id, input)
      : await createProductAction(input);

    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
    // On success the action redirects, so no further state update is needed.
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <FieldWrapper label="Product Name" htmlFor="name">
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </FieldWrapper>

      <FieldWrapper label="Price (₹)" htmlFor="price">
        <Input
          id="price"
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="max-w-40"
        />
      </FieldWrapper>

      <FieldWrapper label="Categories" htmlFor="categories" optional>
        <CategoryTagPicker categories={categories} selectedIds={categoryIds} onChange={setCategoryIds} />
      </FieldWrapper>

      <FieldWrapper label="Description" htmlFor="description">
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Product Images" htmlFor="images">
        <ImageUploader images={images} onChange={setImages} />
      </FieldWrapper>

      <FieldWrapper label="Bundle Items" htmlFor="bundleItems" optional>
        <p className="mb-2 text-xs text-ink-soft">
          Selling this as a combo of other products? Pick what&apos;s included — shown on this
          product&apos;s page. This product still has its own price above; picking items here doesn&apos;t
          change their price or stock.
        </p>
        <BundleItemsPicker products={pickableProducts} selectedIds={bundleItemIds} onChange={setBundleItemIds} />
      </FieldWrapper>

      <FieldWrapper label="Instagram Reel Link" htmlFor="reelUrl" optional>
        <Input
          id="reelUrl"
          type="url"
          placeholder="https://www.instagram.com/reel/..."
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Status" htmlFor="isActive">
        <Select
          id="isActive"
          value={isActive ? "active" : "inactive"}
          onChange={(e) => setIsActive(e.target.value === "active")}
        >
          <option value="active">Active — visible on the store</option>
          <option value="inactive">Inactive — hidden from customers</option>
        </Select>
      </FieldWrapper>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
