"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Loader2, Upload, X } from "lucide-react";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/format";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/order-limits";
import { useCart } from "@/lib/cart/context";
import { createClient } from "@/lib/supabase/client";

interface BuyNowPanelProps {
  slug: string;
  name: string;
  price: number;
  image?: string;
  isCustomisable?: boolean;
  allowCustomerImage?: boolean;
}

export function BuyNowPanel({
  slug,
  name,
  price,
  image,
  isCustomisable = false,
  allowCustomerImage = false,
}: BuyNowPanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState(1);
  const [customizationText, setCustomizationText] = useState("");
  const [customerImageUrl, setCustomerImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `customer-uploads/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setCustomerImageUrl(data.publicUrl);
    } catch (err) {
      console.error("Upload error", err);
      setUploadError("Could not upload photo. You can also share it with us on WhatsApp.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleBuyNow() {
    addItem(
      {
        productSlug: slug,
        name,
        price,
        image,
        customization: customizationText.trim() || undefined,
        customerImageUrl: customerImageUrl || undefined,
      },
      quantity,
    );
    router.push("/checkout");
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Customization Details Box */}
        {isCustomisable && (
          <div className="rounded-2xl border border-amber/35 bg-gradient-to-br from-lilac/60 via-cream to-amber-light/30 p-4 shadow-sm">
            <label htmlFor="customizationNotes" className="block text-xs font-semibold uppercase tracking-wider text-amber-dark">
              Customisation Details
            </label>
            <p className="mt-0.5 text-xs text-ink-soft">
              Tell us how you would like this personalized:
            </p>
            <textarea
              id="customizationNotes"
              rows={3}
              value={customizationText}
              onChange={(e) => setCustomizationText(e.target.value)}
              placeholder="Please share the color, text, names, dates, etc."
              className="mt-2 w-full rounded-xl border border-border-soft bg-white p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />

            {/* Optional Customer Reference Photo Upload */}
            {allowCustomerImage && (
              <div className="mt-3 border-t border-border-soft/60 pt-3">
                <label className="block text-xs font-medium text-ink">
                  Upload Photo / Reference{" "}
                  <span className="font-normal text-ink-soft">(Optional, e.g. for photo frames)</span>
                </label>

                {customerImageUrl ? (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-border-soft bg-white p-2">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border-soft">
                      <Image src={customerImageUrl} alt="Your attached photo" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-ink">Photo attached ✓</p>
                      <a
                        href={customerImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-dark underline"
                      >
                        Preview photo
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomerImageUrl("")}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-red-600"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ink/30 bg-white/80 px-4 py-2.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-white"
                    >
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin text-ink-soft" /> : <Upload className="h-4 w-4 text-ink-soft" />}
                      {uploadingImage ? "Uploading photo..." : "Attach Reference Photo"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
                {uploadError && <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-soft">Quantity</span>
          <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
        </div>

        <Button onClick={handleBuyNow} size="lg" className="w-full text-xs uppercase tracking-[0.12em]">
          Buy Now <ArrowRight className="h-4 w-4" />
        </Button>
        <AddToCartButton
          productSlug={slug}
          name={name}
          price={price}
          image={image}
          quantity={quantity}
          customization={customizationText.trim() || undefined}
          customerImageUrl={customerImageUrl || undefined}
          className="h-13 w-full text-xs uppercase tracking-[0.12em]"
        />
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border-soft/70 bg-cream/95 p-3 backdrop-blur sm:hidden">
        <div className="flex flex-col">
          <span className="text-xs text-ink-soft">Total</span>
          <span className="font-display text-lg font-semibold">{formatPrice(price * quantity)}</span>
        </div>
        <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
        <Button onClick={handleBuyNow} className="text-xs uppercase tracking-[0.12em]">
          Buy Now
        </Button>
      </div>
    </>
  );
}
