"use client";

import { useEffect } from "react";

const STORAGE_KEY = "spilled_colours_saved_orders";

interface SavedEntry {
  orderNumber: string;
  phone: string;
  savedAt: string;
}

export function SaveOrderOnSuccess({
  orderNumber,
  phone,
}: {
  orderNumber: string;
  phone: string;
}) {
  useEffect(() => {
    if (!orderNumber || !phone) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: SavedEntry[] = raw ? JSON.parse(raw) : [];
      const filtered = existing.filter(
        (e) => e.orderNumber.toUpperCase() !== orderNumber.toUpperCase()
      );
      const updated: SavedEntry[] = [
        {
          orderNumber: orderNumber.toUpperCase(),
          phone: phone.trim(),
          savedAt: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [orderNumber, phone]);

  return null;
}
