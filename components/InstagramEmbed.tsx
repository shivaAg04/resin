"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/** Reprocesses any not-yet-rendered instagram-media blockquotes on the page. */
export function processInstagramEmbeds() {
  window.instgrm?.Embeds.process();
}

export function InstagramEmbed({ url, caption }: { url: string; caption?: string | null }) {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    processInstagramEmbeds();
  }, []);

  return (
    <blockquote
      ref={ref}
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ margin: 0, width: "100%", minWidth: "270px" }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-soft underline">
        {caption || "View this reel on Instagram"}
      </a>
    </blockquote>
  );
}
