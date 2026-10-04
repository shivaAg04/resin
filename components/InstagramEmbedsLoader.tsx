"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { processInstagramEmbeds } from "@/components/InstagramEmbed";

const SCRIPT_SRC = "https://www.instagram.com/embed.js";
let scriptPromise: Promise<void> | null = null;

function loadInstagramScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Instagram embed script failed to load"));
    };
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Wraps a block of Instagram embeds and only loads Instagram's embed.js
 * (plus the iframes it creates, ~1MB together) once the block is about to
 * scroll into view. Visitors who never scroll that far never pay for it;
 * until then the embeds show their plain "View on Instagram" link.
 */
export function InstagramEmbedsLoader({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadInstagramScript()
          .then(processInstagramEmbeds)
          .catch(() => {});
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
