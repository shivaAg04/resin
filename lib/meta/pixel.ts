/**
 * Browser side of Meta (Facebook/Instagram) ads tracking. Every call is a
 * no-op until NEXT_PUBLIC_META_PIXEL_ID is set. Events that the server also
 * sends through the Conversions API (Purchase, Lead) pass the same eventId
 * so Meta counts them once.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/**
 * Meta's standard queueing stub: calls made before fbevents.js has loaded are
 * queued and replayed by it, so events fired on mount are never lost.
 */
function getFbq(): Fbq | null {
  if (!META_PIXEL_ID || typeof window === "undefined") return null;
  if (window.fbq) return window.fbq;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  fbq("init", META_PIXEL_ID);
  return fbq;
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
