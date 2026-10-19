"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPixel } from "@/lib/meta/pixel";

/**
 * Logs a PageView on each client-side route change (the base code in
 * MetaPixelSnippet logs the first one) and a Contact for every WhatsApp link click.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
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

  return null;
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
