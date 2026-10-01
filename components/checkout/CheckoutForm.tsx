"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CreditCard, Loader2, MessageCircle } from "lucide-react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/utils/format";
import { customerDetailsSchema, MAX_ORDER_QUANTITY, type CustomerDetailsInput } from "@/lib/utils/validation";
import { useCart } from "@/lib/cart/context";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error: { description: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill?: { name?: string; contact?: string };
      theme?: { color?: string };
      handler: (response: RazorpaySuccessResponse) => void;
      modal?: { ondismiss?: () => void };
    }) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

/** Loads Razorpay's checkout widget script once, only when someone actually picks "Pay Online". */
function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the payment widget."));
    document.body.appendChild(script);
  });
  return razorpayScriptPromise;
}

interface SingleProduct {
  productSlug: string;
  productName: string;
  productImage?: string;
  price: number;
  initialQuantity: number;
}

interface CheckoutFormProps {
  /** A single "Buy Now" product — omit to check out the current cart instead. */
  single?: SingleProduct;
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

export function CheckoutForm({ single }: CheckoutFormProps) {
  const router = useRouter();
  const cart = useCart();
  const [quantity, setQuantity] = useState(
    single ? Math.min(Math.max(single.initialQuantity, 1), MAX_ORDER_QUANTITY) : 1,
  );
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const checkoutItems = single
    ? [
        {
          productSlug: single.productSlug,
          name: single.productName,
          image: single.productImage,
          price: single.price,
          quantity,
        },
      ]
    : cart.items.map((item) => ({
        productSlug: item.productSlug,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

  const orderDescription = single
    ? single.productName
    : `${checkoutItems.length} item${checkoutItems.length === 1 ? "" : "s"}`;

  function updateField<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateFieldOnBlur(key: keyof FormState) {
    const fieldSchema = customerDetailsSchema.shape[key as keyof typeof customerDetailsSchema.shape];
    if (!fieldSchema) return;
    const result = fieldSchema.safeParse(form[key]);
    setErrors((prev) => ({ ...prev, [key]: result.success ? undefined : result.error.issues[0]?.message }));
  }

  function itemsPayload() {
    return checkoutItems.map(({ productSlug, quantity }) => ({ productSlug, quantity }));
  }

  async function placeCodOrder(parsedForm: CustomerDetailsInput) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsedForm, items: itemsPayload() }),
    });

    const data = await response.json();

    if (!response.ok) {
      setSubmitError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (!single) cart.clear();
    router.push(`/order-success/${data.orderNumber}?d=${data.confirmation}`);
  }

  async function payOnline(parsedForm: CustomerDetailsInput) {
    const createResponse = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsedForm, items: itemsPayload() }),
    });
    const created = await createResponse.json();

    if (!createResponse.ok) {
      setSubmitError(created.error ?? "Could not start payment. Please try again.");
      setSubmitting(false);
      return;
    }

    await loadRazorpayScript();
    if (!window.Razorpay) {
      setSubmitError("Could not load the payment widget. Please try again.");
      setSubmitting(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: created.keyId,
      amount: created.amount,
      currency: created.currency,
      name: "Spilled Colours",
      description: orderDescription,
      order_id: created.razorpayOrderId,
      prefill: { name: created.customerName, contact: created.whatsappNumber },
      theme: { color: "#ff8dc7" },
      handler: async (response) => {
        try {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verified = await verifyResponse.json();

          if (!verifyResponse.ok) {
            setSubmitError(verified.error ?? "Payment succeeded but could not be confirmed — please message us on WhatsApp.");
            setSubmitting(false);
            return;
          }

          if (!single) cart.clear();
          router.push(`/order-success/${verified.orderNumber}?d=${verified.confirmation}&paid=1`);
        } catch {
          setSubmitError("Payment succeeded but could not be confirmed — please message us on WhatsApp.");
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => setSubmitting(false),
      },
    });

    razorpay.on("payment.failed", (response) => {
      setSubmitError(response.error.description || "Payment failed. Please try again.");
      setSubmitting(false);
    });

    razorpay.open();
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
      if (paymentMethod === "online") {
        await payOnline(parsed.data);
      } else {
        await placeCodOrder(parsed.data);
      }
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="order-2 flex flex-col gap-5 lg:order-1">
        {single && (
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Quantity</h2>
            <div className="mt-2">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={MAX_ORDER_QUANTITY} />
            </div>
          </div>
        )}

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

        {RAZORPAY_KEY_ID && (
          <div className="border-t border-border-soft/70 pt-5">
            <h2 className="font-display text-lg font-semibold text-ink">Payment</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  paymentMethod === "cod" ? "border-amber bg-amber-light/40" : "border-border-soft/70 hover:border-ink/20",
                )}
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-ink-soft" />
                <span>
                  <span className="block text-sm font-medium text-ink">WhatsApp / Cash on Delivery</span>
                  <span className="block text-xs text-ink-soft">We&apos;ll confirm your order on WhatsApp</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  paymentMethod === "online" ? "border-amber bg-amber-light/40" : "border-border-soft/70 hover:border-ink/20",
                )}
              >
                <CreditCard className="h-5 w-5 shrink-0 text-ink-soft" />
                <span>
                  <span className="block text-sm font-medium text-ink">Pay Online Now</span>
                  <span className="block text-xs text-ink-soft">UPI, cards, netbanking</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {submitError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <p className="text-xs text-ink-soft">
          By placing this order you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline hover:text-ink">
            Terms
          </Link>
          ,{" "}
          <Link href="/refund-policy" className="underline hover:text-ink">
            Refund Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>

        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting
            ? paymentMethod === "online"
              ? "Opening payment..."
              : "Placing order..."
            : paymentMethod === "online"
              ? "Proceed to Pay"
              : "Place Order"}
        </Button>
      </form>

      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <OrderSummary items={checkoutItems} />
      </div>
    </div>
  );
}
