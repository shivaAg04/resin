"use client";

import { useEffect } from "react";

/** Longest intro animation (0.6s) plus the largest stagger delay, with margin. */
const INTRO_DURATION_MS = 1200;

/**
 * Lets the hero's fade-in-up intro play once per visit. After it finishes
 * this marks <html data-intro-played>, and globals.css turns the animation
 * off from then on — so returning to the homepage via client-side
 * navigation shows the hero instantly instead of blinking it in again.
 * A full page reload resets it, which is fine: that's a fresh visit.
 */
export function IntroAnimationGate() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.dataset.introPlayed = "";
    }, INTRO_DURATION_MS);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
