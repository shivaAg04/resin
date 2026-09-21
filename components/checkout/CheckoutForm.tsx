"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { customerDetailsSchema, MAX_ORDER_QUANTITY } from "@/lib/utils/validation";

interface CheckoutFormProps {
  productSlug: string;
  productName: string;
  productImage?: string;
  price: number;
  initialQuantity: number;
}

type FormState = {
  customerName: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  instagramUsername: string;
  specialInstructions: string;
};

const initialFormState: FormState = {
  customerName: "",
  whatsappNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  instagramUsername: "",
  specialInstructions: "",
};

export function CheckoutForm({
  productSlug,
  productName,
  productImage,
  price,
  initialQuantity,
}: CheckoutFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(Math.min(Math.max(initialQuantity, 1), MAX_ORDER_QUANTITY));
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateFieldOnBlur(key: keyof FormState) {
    const fieldSchema = customerDetailsSchema.shape[key as keyof typeof customerDetailsSchema.shape];
    if (!fieldSchema) return;
    const result = fieldSchema.safeParse(form[key]);
    setErrors((prev) => ({ ...prev, [key]: result.success ? undefined : result.error.issues[0]?.message }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const parsed = customerDetailsSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, productSlug, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/order-success/${data.orderNumber}?d=${data.confirmation}`);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="order-2 flex flex-col gap-5 lg:order-1">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Quantity</h2>
          <div className="mt-2">
            <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
          </div>
        </div>

        <div className="border-t border-border-soft/70 pt-5">
          <h2 className="font-display text-lg font-semibold text-ink">Your Details</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldWrapper label="Full Name" htmlFor="customerName" error={errors.customerName}>
              <Input
                id="customerName"
                autoComplete="name"
                value={form.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                onBlur={() => validateFieldOnBlur("customerName")}
              />
            </FieldWrapper>

            <FieldWrapper label="WhatsApp Number" htmlFor="whatsappNumber" error={errors.whatsappNumber}>
              <Input
                id="whatsappNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="98765 43210"
                value={form.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                onBlur={() => validateFieldOnBlur("whatsappNumber")}
              />
            </FieldWrapper>
          </div>

          <div className="mt-4">
            <FieldWrapper label="Address" htmlFor="address" error={errors.address}>
              <Textarea
                id="address"
                rows={2}
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                onBlur={() => validateFieldOnBlur("address")}
              />
            </FieldWrapper>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FieldWrapper label="City" htmlFor="city" error={errors.city}>
              <Input
                id="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                onBlur={() => validateFieldOnBlur("city")}
              />
            </FieldWrapper>

            <FieldWrapper label="State" htmlFor="state" error={errors.state}>
              <Input
                id="state"
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                onBlur={() => validateFieldOnBlur("state")}
              />
            </FieldWrapper>

            <FieldWrapper label="Pincode" htmlFor="pincode" error={errors.pincode}>
              <Input
                id="pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                onBlur={() => validateFieldOnBlur("pincode")}
              />
            </FieldWrapper>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldWrapper label="Instagram Username" htmlFor="instagramUsername" optional>
              <Input
                id="instagramUsername"
                placeholder="@yourhandle"
                value={form.instagramUsername}
                onChange={(e) => updateField("instagramUsername", e.target.value)}
              />
            </FieldWrapper>
          </div>

          <div className="mt-4">
            <FieldWrapper label="Special Instructions" htmlFor="specialInstructions" optional>
              <Textarea
                id="specialInstructions"
                rows={3}
                placeholder="Custom color, gifting note, etc."
                value={form.specialInstructions}
                onChange={(e) => updateField("specialInstructions", e.target.value)}
              />
            </FieldWrapper>
          </div>
        </div>

        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Placing order..." : "Place Order"}
        </Button>
      </form>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <OrderSummary productName={productName} productImage={productImage} price={price} quantity={quantity} />
      </div>
    </div>
  );
}
