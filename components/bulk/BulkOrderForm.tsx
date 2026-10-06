"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Field";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

interface BulkForm {
  name: string;
  phone: string;
  location: string;
  products: string;
  quantity: string;
  neededBy: string;
  budget: string;
  details: string;
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
};

const REQUIRED: (keyof BulkForm)[] = ["name", "location", "products", "quantity"];

/**
 * Bulk / corporate / wedding-favour enquiries. Nothing is stored: the form
 * just builds a tidy message and opens WhatsApp with it, so the
 * conversation continues where the business already handles orders.
 */
export function BulkOrderForm() {
  const [form, setForm] = useState<BulkForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof BulkForm, string>>>({});

  function update(key: keyof BulkForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof BulkForm, string>> = {};
    for (const key of REQUIRED) {
      if (!form[key].trim()) nextErrors[key] = "Please fill this in";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const details = [
      `Name: ${form.name.trim()}`,
      form.phone.trim() && `Phone: ${form.phone.trim()}`,
      `Location: ${form.location.trim()}`,
      `Products / occasion: ${form.products.trim()}`,
      `Quantity: ${form.quantity.trim()}`,
      form.neededBy && `Needed by: ${form.neededBy}`,
      form.budget.trim() && `Budget: ${form.budget.trim()}`,
      form.details.trim() && `Details: ${form.details.trim()}`,
    ].filter(Boolean);
    const message = ["Hi! I'd like to enquire about a bulk order.", "", ...details].join("\n");

    window.open(buildGenericWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label="Your name" htmlFor="bulk-name" error={errors.name}>
          <Input
            id="bulk-name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="Phone number" htmlFor="bulk-phone" optional>
          <Input
            id="bulk-phone"
            type="tel"
            autoComplete="tel"
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

      <Button type="submit" variant="whatsapp" size="lg" className="w-full sm:w-auto">
        <MessageCircle className="h-4 w-4" /> Send enquiry on WhatsApp
      </Button>
      <p className="text-xs text-ink-soft">
        This opens WhatsApp with your details filled in. Just press send.
      </p>
    </form>
  );
}
