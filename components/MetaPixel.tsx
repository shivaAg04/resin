"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, trackPixel } from "@/lib/meta/pixel";

/** Loads the Meta pixel, logs a PageView per route, and a Contact for every WhatsApp link click. */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    trackPixel("PageView");
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//.test(href)) trackPixel("Contact");
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!META_PIXEL_ID) return null;
  return <Script src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />;
}

/** Fires one pixel event when mounted — lets server components (product, order-success pages) track views. */
export function TrackPixelEvent({
  event,
  params,
  eventId,
}: {
  event: Parameters<typeof trackPixel>[0];
  params?: Record<string, unknown>;
  eventId?: string;
}) {
  // Params are rebuilt every render; keying on their JSON stops re-firing for the same payload.
  const payload = JSON.stringify(params ?? {});
  useEffect(() => {
    trackPixel(event, JSON.parse(payload), eventId);
  }, [event, payload, eventId]);
  return null;
}
