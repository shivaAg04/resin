"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** Skips the autoplaying background video for users who've asked for reduced motion. */
export function HeroVideo({ src }: { src: string }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reducedMotion) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className="h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
