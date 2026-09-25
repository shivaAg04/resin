"use client";

import { useSyncExternalStore } from "react";

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
  // this is a ~2.6MB autoplaying file, not worth it on 2G/3G.
  return Boolean(connection.saveData) || connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}

function getSaveDataServerSnapshot() {
  return false;
}

/**
 * Skips the autoplaying background video for reduced-motion users and for
 * anyone on Data Saver / a slow connection — most of this site's traffic is
 * mobile visitors coming from Instagram, where data cost and speed vary a
 * lot. Falls back to the gradient background in both cases.
 */
export function HeroVideo({ src }: { src: string }) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getMotionServerSnapshot);
  const saveData = useSyncExternalStore(subscribeSaveData, getSaveDataSnapshot, getSaveDataServerSnapshot);

  if (reducedMotion || saveData) return null;

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
