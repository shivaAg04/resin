import { NextResponse, type NextRequest } from "next/server";
import { markOrderPaid } from "@/lib/data/orders";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";

/**
 * Safety net for the case where /api/payments/verify never gets called —
 * e.g. the customer's tab closes right after paying, before the browser's
 * verify request lands. Configure this URL as a webhook in the Razorpay
 * dashboard (Settings → Webhooks) once you have an account, subscribed to
 * the "payment.captured" event, and copy its secret into
 * RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-razorpay-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let validSignature: boolean;
  try {
    validSignature = verifyWebhookSignature(rawBody, signature);
  } catch (error) {
    console.error("webhook: not configured", error);
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  if (!validSignature) {
    console.error("webhook: signature mismatch");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let payload: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (payload.event !== "payment.captured") {
    // Not an event we act on (e.g. payment.failed) — ack so Razorpay doesn't retry.
    return NextResponse.json({ ok: true });
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment?.order_id || !payment.id) {
    return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
  }

  const result = await markOrderPaid(payment.order_id, payment.id);
  if (result.error) {
    // 500 so Razorpay retries — this is likely a transient DB error, not a bad event.
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
