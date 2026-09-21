/**
 * The order-success page renders from data passed back through the URL
 * instead of re-querying Supabase for the order. Order numbers are
 * sequential (ORD-1001, ORD-1002, ...) and therefore guessable, so there is
 * intentionally no RLS policy letting anonymous visitors read orders by
 * number — that would let anyone enumerate other customers' addresses and
 * phone numbers. This payload is the customer's own just-submitted data
 * being echoed back for display only; it is never trusted for a write.
 */
export interface OrderConfirmationPayload {
  orderNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  totalAmount: number;
  customerName: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string | null;
  pincode: string;
}

export function encodeOrderConfirmation(payload: OrderConfirmationPayload): string {
  const json = JSON.stringify(payload);
  return encodeURIComponent(Buffer.from(json, "utf-8").toString("base64"));
}

export function decodeOrderConfirmation(encoded: string): OrderConfirmationPayload | null {
  try {
    const json = Buffer.from(decodeURIComponent(encoded), "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    if (typeof parsed?.orderNumber !== "string") return null;
    return parsed as OrderConfirmationPayload;
  } catch {
    return null;
  }
}
