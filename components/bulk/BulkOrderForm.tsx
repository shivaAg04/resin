"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { submitBulkOrderRequest } from "@/app/(site)/bulk-orders/actions";

interface BulkForm {
  name: string;
  phone: string;
  location: string;
  products: string;
  quantity: string;
  neededBy: string;
  budget: string;
  details: string;
  website: string; // Honeypot
}

const EMPTY: BulkForm = {
  name: "",
  phone: "",
  location: "",
  products: "",
  quantity: "",
  neededBy: "",
  budget: "",
  details: "",
  website: "",
};

const REQUIRED: (keyof BulkForm)[] = ["name", "phone", "location", "products", "quantity"];

export function BulkOrderForm() {
  const [form, setForm] = useState<BulkForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof BulkForm, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);

  function update(key: keyof BulkForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors: Partial<Record<keyof BulkForm, string>> = {};
    for (const key of REQUIRED) {
      if (!form[key].trim()) nextErrors[key] = "Please fill this in";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const result = await submitBulkOrderRequest(form);

      if (result.error || !result.requestNumber) {
        setSubmitError(result.error ?? "Failed to submit request.");
        if (result.fieldErrors) setErrors(result.fieldErrors as Partial<Record<keyof BulkForm, string>>);
        setIsSubmitting(false);
        return;
      }

      setRequestNumber(result.requestNumber);
      setIsSubmitting(false);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  if (requestNumber) {
    return (
      <div className="flex flex-col items-center py-8 text-center animate-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lilac text-amber-dark">
          <CheckCircle2 className="h-8 w-8 text-amber-dark" />
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-soft">
          Request Reference: {requestNumber}
        </p>
        <h3 className="mt-2 font-display text-2xl font-medium uppercase text-ink">
          Enquiry Received!
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Thank you, <span className="font-semibold text-ink">{form.name}</span>! We&apos;ve saved your bulk order enquiry. Our team will review the details and reach out to you directly on WhatsApp ({form.phone}) with options and pricing.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setForm(EMPTY);
            setRequestNumber(null);
          }}
          className="mt-6 text-xs uppercase tracking-[0.12em]"
        >
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label="Your name" htmlFor="bulk-name" error={errors.name}>
          <Input
            id="bulk-name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="Phone / WhatsApp number" htmlFor="bulk-phone" error={errors.phone}>
          <Input
            id="bulk-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label="City / country" htmlFor="bulk-location" error={errors.location}>
        <Input
          id="bulk-location"
          placeholder="e.g. Lucknow, India"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="Products or occasion" htmlFor="bulk-products" error={errors.products}>
        <Input
          id="bulk-products"
          placeholder="e.g. Diwali hampers, wedding favours, corporate gifts"
          value={form.products}
          onChange={(e) => update("products", e.target.value)}
        />
      </FieldWrapper>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FieldWrapper label="Quantity" htmlFor="bulk-quantity" error={errors.quantity}>
          <Input
            id="bulk-quantity"
            inputMode="numeric"
            placeholder="e.g. 50"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="Needed by" htmlFor="bulk-date" optional>
          <Input
            id="bulk-date"
            type="date"
            value={form.neededBy}
            onChange={(e) => update("neededBy", e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="Budget" htmlFor="bulk-budget" optional>
          <Input
            id="bulk-budget"
            placeholder="e.g. ₹500 per piece"
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Anything else?" htmlFor="bulk-details" optional>
        <Textarea
          id="bulk-details"
          rows={4}
          placeholder="Colours, customisation, names or logos, packaging…"
          value={form.details}
          onChange={(e) => update("details", e.target.value)}
        />
      </FieldWrapper>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full text-xs uppercase tracking-[0.12em] sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Request a bulk quote
          </>
        )}
      </Button>
      <p className="text-xs text-ink-soft">
        We&apos;ll review your requirement and reach out directly with custom options and pricing.
      </p>
    </form>
  );
}
