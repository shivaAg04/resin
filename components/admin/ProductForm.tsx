"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategoryTagPicker } from "@/components/admin/CategoryTagPicker";
import { BundleItemsPicker, type PickableProduct } from "@/components/admin/BundleItemsPicker";
import { createProductAction, updateProductAction } from "@/app/admin/(protected)/products/actions";
import { formatPrice } from "@/lib/utils/format";
import { PRODUCT_BADGES } from "@/lib/products/badges";
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
  const [reelUrl2, setReelUrl2] = useState(product?.reel_url_2 ?? "");
  const [keywordsInput, setKeywordsInput] = useState((product?.keywords ?? []).join(", "));
  const [bundleItemIds, setBundleItemIds] = useState<string[]>(product?.bundle_items.map((b) => b.product_id) ?? []);
  const [isCustomisable, setIsCustomisable] = useState(product?.is_customisable ?? false);
  const [allowCustomerImage, setAllowCustomerImage] = useState(product?.allow_customer_image ?? false);
  const [designOptionsInput, setDesignOptionsInput] = useState((product?.design_options ?? []).join("\n"));
  const [showInNew, setShowInNew] = useState(product?.show_in_new ?? false);
  const [badges, setBadges] = useState<string[]>(product?.badges ?? []);
  const [whatsIncluded, setWhatsIncluded] = useState(product?.whats_included ?? "");
  const [discountAmount, setDiscountAmount] = useState(product?.discount_amount ? String(product.discount_amount) : "0");

  const pickableProducts = allProducts.filter((p) => p.id !== product?.id);
  const isBundle = bundleItemIds.length > 0;
  const bundleSubtotal = pickableProducts
    .filter((p) => bundleItemIds.includes(p.id))
    // Supabase returns numeric columns as strings — without Number() this
    // silently does string concatenation ("0" + "299.00" + ...) instead of
    // addition, which is exactly why the live total looked broken.
    .reduce((sum, p) => sum + Number(p.price), 0);
  const discountValue = Math.max(0, Number(discountAmount) || 0);
  const bundlePrice = Math.max(0, bundleSubtotal - discountValue);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const priceValue = isBundle ? bundlePrice : Number(price);

    if (!name.trim()) return setError("Product name is required.");
    if (!isBundle && (!Number.isFinite(priceValue) || priceValue < 0)) return setError("Enter a valid price.");

    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: priceValue,
      categoryIds,
      is_active: isActive,
      images,
      reelUrl: reelUrl.trim(),
      reelUrl2: reelUrl2.trim(),
      keywords: keywordsInput.split(",").map((k) => k.trim()).filter(Boolean),
      bundleItemIds,
      discountAmount: discountValue,
      isCustomisable,
      allowCustomerImage: isCustomisable ? allowCustomerImage : false,
      designOptions: designOptionsInput.split("\n").map((d) => d.trim()).filter(Boolean),
      showInNew,
      badges,
      whatsIncluded: whatsIncluded.trim(),
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
        {isBundle ? (
          <div>
            <div className="flex h-11 w-40 items-center rounded-xl border border-ink/10 bg-ink/5 px-4 text-sm text-ink-soft">
              {formatPrice(bundlePrice)}
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Auto-calculated from the bundle items and discount below.
            </p>
          </div>
        ) : (
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
        )}
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

      <FieldWrapper label="What's Included" htmlFor="whatsIncluded" optional>
        <Textarea
          id="whatsIncluded"
          rows={3}
          placeholder={"e.g. 1 nameplate (12\" × 6\")\nWall-mounting hooks\nGift box"}
          value={whatsIncluded}
          onChange={(e) => setWhatsIncluded(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">One item per line. Shown in the product page&apos;s &quot;What&apos;s Included&quot; section.</p>
      </FieldWrapper>

      <FieldWrapper label="Product Images" htmlFor="images">
        <ImageUploader images={images} onChange={setImages} />
      </FieldWrapper>

      <FieldWrapper label="Design Options" htmlFor="designOptions" optional>
        <Textarea
          id="designOptions"
          rows={3}
          placeholder={"Design 1\nDesign 2\nDesign 3"}
          value={designOptionsInput}
          onChange={(e) => setDesignOptionsInput(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">
          One design per line, matching the labels on your product images. Customers must pick one
          before adding to cart, and their choice shows on the order.
        </p>
      </FieldWrapper>

      <FieldWrapper label="Bundle Items" htmlFor="bundleItems" optional>
        <p className="mb-2 text-xs text-ink-soft">
          Selling this as a combo of other products? Pick what&apos;s included — the price above
          switches to auto-calculated (sum of these items, minus the discount below) and this combo
          shows up under whatever categories you pick, same as any product.
        </p>
        <BundleItemsPicker products={pickableProducts} selectedIds={bundleItemIds} onChange={setBundleItemIds} />
      </FieldWrapper>

      {isBundle && (
        <FieldWrapper label="Discount (₹)" htmlFor="discountAmount">
          <Input
            id="discountAmount"
            type="number"
            min={0}
            step="0.01"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="max-w-40"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Bundle subtotal {formatPrice(bundleSubtotal)} − discount {formatPrice(discountValue)} ={" "}
            <span className="font-medium text-ink">{formatPrice(bundlePrice)}</span>
          </p>
        </FieldWrapper>
      )}

      <FieldWrapper label="Search Keywords / Tags" htmlFor="keywords" optional>
        <Input
          id="keywords"
          type="text"
          placeholder="e.g. coaster, wedding gift, rakhi, photo frame, resin art, ocean blue"
          value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Separate tags with commas. Customers searching these terms will find this product.
        </p>
      </FieldWrapper>

      <FieldWrapper label="Instagram Reel / Video 1 Link" htmlFor="reelUrl" optional>
        <Input
          id="reelUrl"
          type="url"
          placeholder="https://www.instagram.com/reel/... or video URL"
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Instagram Reel / Video 2 Link" htmlFor="reelUrl2" optional>
        <Input
          id="reelUrl2"
          type="url"
          placeholder="https://www.instagram.com/reel/... or video URL (optional second video)"
          value={reelUrl2}
          onChange={(e) => setReelUrl2(e.target.value)}
        />
      </FieldWrapper>

      <div className="flex flex-col gap-3 rounded-2xl border border-border-soft bg-cream/50 p-4">
        <label className="flex items-start gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={isCustomisable}
            onChange={(e) => setIsCustomisable(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ink"
          />
          <span>
            <span className="font-medium">Customisable Product</span>
            <span className="block text-xs text-ink-soft">
              Shows &quot;Customisable&quot; badge, &quot;₹… onwards&quot; pricing, and displays a customization notes box on the product page.
            </span>
          </span>
        </label>

        {isCustomisable && (
          <label className="ml-6 flex items-start gap-2 border-t border-border-soft/60 pt-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={allowCustomerImage}
              onChange={(e) => setAllowCustomerImage(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-ink"
            />
            <span>
              <span className="font-medium">Allow customer photo upload (e.g. for photo frames / keepsakes)</span>
              <span className="block text-xs text-ink-soft">
                Shows an optional photo upload field on the product page for the client to attach their image.
              </span>
            </span>
          </label>
        )}

        <label className="flex items-start gap-2 border-t border-border-soft/60 pt-2.5 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={showInNew}
            onChange={(e) => setShowInNew(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-ink"
          />
          <span>
            <span className="font-medium">Show in &quot;New at Spilled Colours&quot;</span>
            <span className="block text-xs text-ink-soft">
              Picked products show first in that homepage section; newest products fill the rest.
            </span>
          </span>
        </label>
      </div>

      <FieldWrapper label="Badges" htmlFor="badges" optional>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_BADGES.map((badge) => {
            const selected = badges.includes(badge.value);
            return (
              <button
                key={badge.value}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  setBadges((current) =>
                    selected ? current.filter((b) => b !== badge.value) : [...current, badge.value],
                  )
                }
                className={
                  selected
                    ? "rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-cream"
                    : "rounded-full border border-border-soft px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-ink/30"
                }
              >
                {badge.label}
              </button>
            );
          })}
        </div>
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
