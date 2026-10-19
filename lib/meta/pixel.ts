/**
 * Browser side of Meta (Facebook/Instagram) ads tracking. Every call is a
 * no-op until NEXT_PUBLIC_META_PIXEL_ID is set. Events that the server also
 * sends through the Conversions API (Purchase, Lead) pass the same eventId
 * so Meta counts them once.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** The fbq queue defined by Meta's base code (MetaPixelSnippet); null when the pixel is off. */
function getFbq(): Fbq | null {
  if (!META_PIXEL_ID || typeof window === "undefined") return null;
  return window.fbq ?? null;
}

export type PixelEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "Contact";

export function trackPixel(event: PixelEvent, params?: Record<string, unknown>, eventId?: string) {
  const fbq = getFbq();
  if (!fbq) return;
  if (eventId) fbq("track", event, params ?? {}, { eventID: eventId });
  else fbq("track", event, params ?? {});
}
