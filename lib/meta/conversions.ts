import "server-only";

import { createHash } from "node:crypto";
import { after } from "next/server";
import { cookies, headers } from "next/headers";

/**
 * Server side of Meta ads tracking (Conversions API). Survives ad blockers
 * and iOS tracking limits that drop the browser pixel. A no-op until both
 * NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_ACCESS_TOKEN are set.
 */
const GRAPH_API_VERSION = "v25.0";

export interface MetaCustomer {
  /** As stored: bare Indian 10-digit, or "+<code>…" for other countries. */
  phone?: string | null;
  name?: string | null;
  city?: string | null;
  pincode?: string | null;
}

export interface MetaServerEvent {
  eventName: "Purchase" | "Lead";
  /** Must match the eventId the browser pixel sends for the same action. */
  eventId: string;
  customer: MetaCustomer;
  customData?: Record<string, unknown>;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta wants digits only, including the country code. */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return phone.trim().startsWith("+") ? digits : `91${digits}`;
}

function hashedUserData(customer: MetaCustomer) {
  const data: Record<string, string[]> = {};
  if (customer.phone) data.ph = [sha256(normalizePhone(customer.phone))];

  const nameParts = customer.name?.trim().toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  if (nameParts.length > 0) data.fn = [sha256(nameParts[0])];
  if (nameParts.length > 1) data.ln = [sha256(nameParts[nameParts.length - 1])];

  if (customer.city) data.ct = [sha256(customer.city.toLowerCase().replace(/[^a-z]/g, ""))];
  if (customer.pincode) data.zp = [sha256(customer.pincode.replace(/\s/g, ""))];
  // Only Indian numbers come without a "+" prefix, so those customers are in India.
  if (customer.phone && !customer.phone.trim().startsWith("+")) data.country = [sha256("in")];
  return data;
}

/**
 * Sends the event after the response has gone out, so it never slows down
 * checkout or forms. Call only from Route Handlers or Server Functions —
 * they're where `after` can still read the visitor's headers and cookies.
 */
export function queueMetaEvent(event: MetaServerEvent) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  after(async () => {
    try {
      const headerList = await headers();
      const cookieStore = await cookies();
      const fbp = cookieStore.get("_fbp")?.value;
      const fbc = cookieStore.get("_fbc")?.value;

      const body = {
        data: [
          {
            event_name: event.eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: event.eventId,
            action_source: "website",
            event_source_url: headerList.get("referer") ?? process.env.NEXT_PUBLIC_SITE_URL,
            user_data: {
              ...hashedUserData(event.customer),
              client_ip_address: headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
              client_user_agent: headerList.get("user-agent") ?? undefined,
              ...(fbp ? { fbp } : {}),
              ...(fbc ? { fbc } : {}),
            },
            custom_data: event.customData,
          },
        ],
        ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
      };

      const response = await fetch(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
      );
      if (!response.ok) console.error("Meta CAPI error", event.eventName, response.status, await response.text());
    } catch (error) {
      console.error("Meta CAPI exception", event.eventName, error);
    }
  });
}
