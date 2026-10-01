import "server-only";
import crypto from "node:crypto";

/** True once real keys are set — lets callers fail with a clear message instead of a confusing API error. */
export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function getCredentials() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured — set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  return { keyId, keySecret };
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/**
 * Creates a Razorpay order for the given amount (in rupees, server-computed
 * — never trust an amount from the client). Talks to Razorpay's REST API
 * directly over fetch rather than pulling in their SDK, since this is the
 * only call this app needs.
 */
export async function createRazorpayOrder(amountInRupees: number, receipt: string): Promise<RazorpayOrder> {
  const { keyId, keySecret } = getCredentials();

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: Math.round(amountInRupees * 100), // Razorpay expects paise
      currency: "INR",
      receipt,
    }),
  });

  if (!response.ok) {
    console.error("createRazorpayOrder failed", response.status, await response.text());
    throw new Error("Could not start payment. Please try again.");
  }

  return response.json();
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verifies the signature Razorpay's checkout widget returns after a successful payment. */
export function verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
  const { keySecret } = getCredentials();
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return safeCompare(expected, signature);
}

/**
 * Verifies a Razorpay webhook payload signature — a separate secret from
 * the API keys, set when you add the webhook in the Razorpay dashboard
 * pointed at /api/payments/webhook.
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set.");
  const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  return safeCompare(expected, signature);
}
