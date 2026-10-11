"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FieldWrapper, Input, Select, Textarea } from "@/components/ui/Field";
import {
  BUDGET_OPTIONS,
  LOOKING_FOR_OPTIONS,
  MAX_REFERENCE_IMAGE_BYTES,
  MAX_REFERENCE_IMAGES,
  OCCASION_OPTIONS,
  QUANTITY_OPTIONS,
  REFERENCE_BUCKET,
  REFERENCE_IMAGE_TYPES,
} from "@/lib/custom-requests/options";
import { prepareReferenceUploads, submitCustomRequest } from "@/app/(site)/custom-orders/actions";

type Fields = {
  customerName: string;
  whatsappNumber: string;
  lookingFor: string;
  occasion: string;
  budget: string;
  quantity: string;
  requiredDate: string;
  preferredColours: string;
  details: string;
  website: string; // honeypot
};

const EMPTY: Fields = {
  customerName: "",
  whatsappNumber: "",
  lookingFor: "",
  occasion: "",
  budget: "",
  quantity: "",
  requiredDate: "",
  preferredColours: "",
  details: "",
  website: "",
};

const REQUIRED: (keyof Fields)[] = [
  "customerName",
  "whatsappNumber",
  "lookingFor",
  "occasion",
  "budget",
  "quantity",
  "preferredColours",
];

interface PickedPhoto {
  file: File;
  previewUrl: string;
}

const caps = "text-xs uppercase tracking-[0.12em]";

export function CustomOrderForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "photos", string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "saving">("idle");
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function addPhotos(fileList: FileList | null) {
    if (!fileList) return;
    const next = [...photos];
    let error: string | undefined;
    for (const file of Array.from(fileList)) {
      if (next.length >= MAX_REFERENCE_IMAGES) {
        error = `You can add up to ${MAX_REFERENCE_IMAGES} photos.`;
        break;
      }
      if (!REFERENCE_IMAGE_TYPES[file.type]) {
        error = "Please upload JPG, PNG, WEBP or HEIC photos.";
        continue;
      }
      if (file.size > MAX_REFERENCE_IMAGE_BYTES) {
        error = "Each photo must be under 10 MB.";
        continue;
      }
      next.push({ file, previewUrl: URL.createObjectURL(file) });
    }
    setPhotos(next);
    setErrors((prev) => ({ ...prev, photos: error }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photos[index].previewUrl);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  /** Uploads straight to the private bucket via one-time URLs; returns the stored paths. */
  async function uploadPhotos(): Promise<string[] | null> {
    if (photos.length === 0) return [];
    const prepared = await prepareReferenceUploads(photos.map(({ file }) => ({ type: file.type, size: file.size })));
    if (prepared.error || !prepared.uploads) {
      setSubmitError(prepared.error ?? "Couldn't upload your photos. Please try again.");
      return null;
    }

    // Loaded only when someone actually attaches photos, to keep this page light.
    const { createClient } = await import("@/lib/supabase/client");
    const storage = createClient().storage.from(REFERENCE_BUCKET);

    const results = await Promise.all(
      prepared.uploads.map(({ path, token }, i) =>
        storage.uploadToSignedUrl(path, token, photos[i].file, { contentType: photos[i].file.type }),
      ),
    );
    if (results.some((r) => r.error)) {
      setSubmitError("Couldn't upload your photos. Please try again, or remove them and send without.");
      return null;
    }
    return prepared.uploads.map((u) => u.path);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const missing: Partial<Record<keyof Fields, string>> = {};
    for (const key of REQUIRED) {
      if (!fields[key].trim()) missing[key] = "Please fill this in";
    }
    if (Object.keys(missing).length > 0) {
      setErrors(missing);
      setSubmitError("Please fill in the highlighted fields.");
      return;
    }

    try {
      setStatus("uploading");
      const referenceImages = await uploadPhotos();
      if (referenceImages === null) {
        setStatus("idle");
        return;
      }

      setStatus("saving");
      const result = await submitCustomRequest({ ...fields, referenceImages });
      if ("error" in result) {
        setErrors(result.fieldErrors ?? {});
        setSubmitError(result.error);
        setStatus("idle");
        return;
      }

      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setRequestNumber(result.requestNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (requestNumber) {
    return (
      <div className="flex flex-col items-center rounded-lg bg-lilac px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-amber-dark">
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <h2 className="mt-5 font-display text-3xl font-medium text-ink">Thank you!</h2>
        <p className="mt-1 font-script text-3xl text-amber-dark">We&apos;ve got your idea</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
          Your request number is <span className="font-medium text-ink">{requestNumber}</span>. We&apos;ll look at
          your details and message you on WhatsApp with options and a quote.
        </p>
        <ButtonLink href="/products" variant="outline" className={`mt-7 ${caps}`}>
          Browse the collection
        </ButtonLink>
      </div>
    );
  }

  const busy = status !== "idle";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Honeypot — hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <FieldWrapper label="Name" htmlFor="co-name" error={errors.customerName}>
        <Input
          id="co-name"
          autoComplete="name"
          placeholder="Your name"
          value={fields.customerName}
          onChange={(e) => update("customerName", e.target.value)}
        />
      </FieldWrapper>

      <FieldWrapper label="WhatsApp Number" htmlFor="co-phone" error={errors.whatsappNumber}>
        <Input
          id="co-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={fields.whatsappNumber}
          onChange={(e) => update("whatsappNumber", e.target.value)}
        />
        <p className="text-xs text-ink-soft">Outside India? Add your country code, e.g. +44…</p>
      </FieldWrapper>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label="What are you looking for?" htmlFor="co-looking" error={errors.lookingFor}>
          <Select id="co-looking" value={fields.lookingFor} onChange={(e) => update("lookingFor", e.target.value)}>
            <option value="">Select an option</option>
            {LOOKING_FOR_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Occasion" htmlFor="co-occasion" error={errors.occasion}>
          <Select id="co-occasion" value={fields.occasion} onChange={(e) => update("occasion", e.target.value)}>
            <option value="">Select an option</option>
            {OCCASION_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Approximate Budget" htmlFor="co-budget" error={errors.budget}>
          <Select id="co-budget" value={fields.budget} onChange={(e) => update("budget", e.target.value)}>
            <option value="">Select an option</option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </FieldWrapper>
        <FieldWrapper label="Quantity" htmlFor="co-quantity" error={errors.quantity}>
          <Select id="co-quantity" value={fields.quantity} onChange={(e) => update("quantity", e.target.value)}>
            <option value="">Select an option</option>
            {QUANTITY_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldWrapper label="Required Date" htmlFor="co-date" error={errors.requiredDate} optional>
          <Input
            id="co-date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={fields.requiredDate}
            onChange={(e) => update("requiredDate", e.target.value)}
          />
        </FieldWrapper>
        <FieldWrapper label="Preferred Colours" htmlFor="co-colours" error={errors.preferredColours}>
          <Input
            id="co-colours"
            placeholder="e.g. pink, gold, pastel"
            value={fields.preferredColours}
            onChange={(e) => update("preferredColours", e.target.value)}
          />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Upload Reference / Image" htmlFor="co-photos" error={errors.photos} optional>
        <div className="flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <div key={photo.previewUrl} className="relative h-24 w-24 overflow-hidden rounded-lg border border-border-soft">
              <Image src={photo.previewUrl} alt={`Reference ${index + 1}`} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                aria-label={`Remove reference ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {photos.length < MAX_REFERENCE_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 min-w-24 flex-1 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-ink/15 px-4 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">Choose photo{photos.length === 0 ? "s" : ""}</span>
              <span className="text-[10px] text-ink-soft/70">Up to {MAX_REFERENCE_IMAGES}, 10 MB each</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="co-photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={(e) => addPhotos(e.target.files)}
        />
      </FieldWrapper>

      <FieldWrapper label="Additional Details" htmlFor="co-details" error={errors.details} optional>
        <Textarea
          id="co-details"
          rows={4}
          placeholder="Tell us anything else — names or text to add, size, the story behind it…"
          value={fields.details}
          onChange={(e) => update("details", e.target.value)}
        />
      </FieldWrapper>

      {submitError && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      <Button type="submit" size="lg" disabled={busy} className={`mt-2 w-full ${caps}`}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "uploading" ? "Uploading photos..." : status === "saving" ? "Sending..." : "Get my custom quote"}
        {!busy && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}
