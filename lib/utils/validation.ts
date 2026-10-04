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
});

export const createOrderSchema = customerDetailsSchema.extend({
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
});

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
