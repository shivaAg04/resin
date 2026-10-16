import { z } from "zod";

/** No stock tracking — this is just a sane ceiling on a single order's quantity. */
import { MAX_ORDER_QUANTITY } from "@/lib/utils/order-limits";

export { MAX_ORDER_QUANTITY };

/** Normalizes a loosely-formatted Indian mobile number to 10 bare digits. */
export function normalizeIndianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** International numbers are stored as "+<country code><number>", digits only after the +. */
export function normalizeInternationalNumber(raw: string): string {
  const digits = raw.replace(/^\s*00/, "").replace(/\D/g, "");
  return `+${digits}`;
}

const indianMobileSchema = z
  .string()
  .trim()
  .min(1, "WhatsApp number is required")
  .transform(normalizeIndianMobile)
  .refine((v) => /^[6-9]\d{9}$/.test(v), {
    message: "Enter a valid 10-digit Indian mobile number",
  });

export const customerDetailsSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  whatsappNumber: indianMobileSchema,
  address: z.string().trim().min(5, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  instagramUsername: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/^@/, "") : v)),
  specialInstructions: z.string().trim().max(500).optional(),
});

export const cartItemSchema = z.object({
  productSlug: z.string().trim().min(1, "Product is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1").max(MAX_ORDER_QUANTITY),
  customization: z.string().trim().max(1000).optional(),
  customerImageUrl: z.string().trim().optional(),
});

export const createOrderSchema = customerDetailsSchema.extend({
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
});

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * A WhatsApp number from a form that doesn't ask for a country: "+<code>…"
 * (or "00<code>…") is international, anything else is read as an Indian
 * mobile. Returns the stored form ("9876543210" or "+447700900123").
 */
export function normalizeAnyWhatsAppNumber(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
    const international = normalizeInternationalNumber(trimmed);
    return international.startsWith("+91") ? normalizeIndianMobile(international) : international;
  }
  return normalizeIndianMobile(trimmed);
}

function isValidStoredWhatsAppNumber(value: string): boolean {
  if (value.startsWith("+")) return value.length >= 9 && value.length <= 16;
  return /^[6-9]\d{9}$/.test(value);
}

const requiredChoice = (message: string) => z.string().trim().min(1, message).max(120);

export const customRequestSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required").max(100),
  whatsappNumber: z
    .string()
    .trim()
    .min(1, "WhatsApp number is required")
    .transform(normalizeAnyWhatsAppNumber)
    .refine(isValidStoredWhatsAppNumber, {
      message: "Enter a 10-digit mobile number, or include your country code (e.g. +44…)",
    }),
  lookingFor: requiredChoice("Please choose what you're looking for"),
  occasion: requiredChoice("Please choose an occasion"),
  budget: requiredChoice("Please choose a budget"),
  quantity: requiredChoice("Please choose a quantity"),
  requiredDate: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "Enter a valid date" }),
  preferredColours: z.string().trim().min(2, "Tell us the colours you'd like").max(200),
  details: z.string().trim().max(1000, "Please keep this under 1000 characters").optional(),
  referenceImages: z.array(z.string()).max(3).default([]),
});

export type CustomRequestInput = z.infer<typeof customRequestSchema>;
