"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InstagramEmbed } from "@/components/InstagramEmbed";
import { InstagramEmbedsLoader } from "@/components/InstagramEmbedsLoader";
import { cn } from "@/lib/utils/format";
import type { Reel } from "@/types";

const AUTO_ADVANCE_MS = 5000;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeMotion(callback: () => void) {
  const mql = window.matchMedia(MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/**
 * One reel at a time with side arrows; advances every 5s and wraps from the
 * last reel back to the first. Instagram's player is a cross-origin iframe,
 * so we can't see whether a reel is playing — instead, clicking into a reel
 * (focus moves into its iframe) is treated as "watching" and stops
 * auto-advance until the visitor uses the arrows or dots. Hovering pauses it
 * too. All reels stay mounted (slid with a transform) so switching never
 * reloads an embed.
 */
export function ReelsCarousel({ reels }: { reels: Reel[] }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [watching, setWatching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );

  const multiple = reels.length > 1;
  const autoPlaying = multiple && !reducedMotion && !hovering && !watching;

  useEffect(() => {
    if (!autoPlaying) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reels.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [autoPlaying, reels.length]);

  // Clicking inside an iframe blurs our window and focuses the iframe.
  useEffect(() => {
    function onWindowBlur() {
      setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof HTMLIFrameElement && containerRef.current?.contains(active)) setWatching(true);
      }, 0);
    }
    window.addEventListener("blur", onWindowBlur);
    return () => window.removeEventListener("blur", onWindowBlur);
  }, []);

  function goTo(next: number) {
    setWatching(false);
    setIndex((next + reels.length) % reels.length);
  }

  const arrowClasses =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-ink/10 transition-transform hover:scale-105 active:scale-95";

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[400px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Instagram reels"
    >
      <InstagramEmbedsLoader className="overflow-hidden rounded-lg">
        <div
          className="flex items-start transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reels.map((reel, i) => (
            <div
              key={reel.id}
              className="w-full shrink-0"
              aria-hidden={i !== index}
              // Keeps keyboard focus out of reels that are slid off-screen.
              inert={i !== index}
            >
              <InstagramEmbed url={reel.url} caption={reel.caption} />
            </div>
          ))}
        </div>
      </InstagramEmbedsLoader>

      {multiple && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous reel"
            className={cn(arrowClasses, "left-2 sm:-left-14")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next reel"
            className={cn(arrowClasses, "right-2 sm:-right-14")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-4 flex justify-center gap-1.5">
            {reels.map((reel, i) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show reel ${i + 1} of ${reels.length}`}
                aria-current={i === index}
                className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-ink" : "w-1.5 bg-ink/20")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
