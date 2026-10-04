"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils/format";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface NetworkInformation extends EventTarget {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

function getConnection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function subscribeMotion(callback: () => void) {
  const mql = window.matchMedia(MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getMotionSnapshot() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function getMotionServerSnapshot() {
  return false;
}

function subscribeSaveData(callback: () => void) {
  const connection = getConnection();
  connection?.addEventListener?.("change", callback);
  return () => connection?.removeEventListener?.("change", callback);
}

function getSaveDataSnapshot() {
  const connection = getConnection();
  if (!connection) return false;
  // Also skip the video on slow connections, not just explicit Data Saver —
  // this is a ~650KB autoplaying file, not worth it on 2G.
  return Boolean(connection.saveData) || connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}

function getSaveDataServerSnapshot() {
  return false;
}

function subscribePageLoad(callback: () => void) {
  window.addEventListener("load", callback);
  return () => window.removeEventListener("load", callback);
}

function getPageLoadSnapshot() {
  return document.readyState === "complete";
}

function getPageLoadServerSnapshot() {
  return false;
}

/**
 * Only the very first appearance fades in. Coming back to the homepage via
 * client-side navigation remounts this component, and replaying the fade
 * made the hero visibly blink every time.
 */
let hasShownVideo = false;

/**
 * Skips the autoplaying background video for reduced-motion users and for
 * anyone on Data Saver / a slow connection — most of this site's traffic is
 * mobile visitors coming from Instagram, where data cost and speed vary a
 * lot. Falls back to the gradient background in both cases.
 */
export function HeroVideo({ src }: { src: string }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getMotionServerSnapshot);
  const saveData = useSyncExternalStore(subscribeSaveData, getSaveDataSnapshot, getSaveDataServerSnapshot);

  // On a client-side navigation back to the homepage the page has long
  // since loaded, so this is true on the very first render: no blink.
  const pageLoaded = useSyncExternalStore(subscribePageLoad, getPageLoadSnapshot, getPageLoadServerSnapshot);
  const [fadeIn] = useState(() => !hasShownVideo);
  useEffect(() => {
    if (pageLoaded && !reducedMotion && !saveData) hasShownVideo = true;
  }, [pageLoaded, reducedMotion, saveData]);

  // Mount the video only after the page's own images and scripts have
  // finished loading, so this ~650KB download never competes with them.
  if (reducedMotion || saveData || !pageLoaded) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className={cn("h-full w-full object-cover", fadeIn && "animate-fade-in")}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
