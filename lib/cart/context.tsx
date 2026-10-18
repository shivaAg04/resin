"use client";

import { useSyncExternalStore } from "react";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/order-limits";
import { trackPixel } from "@/lib/meta/pixel";

export interface CartItem {
  id?: string;
  productSlug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  customization?: string;
  customerImageUrl?: string;
}

export function itemKey(item: { productSlug: string; customization?: string; customerImageUrl?: string }): string {
  return `${item.productSlug}::${item.customization ?? ""}::${item.customerImageUrl ?? ""}`;
}

const STORAGE_KEY = "resin-cart";

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota) — cart just won't persist across reloads.
  }
}

/**
 * There are no customer accounts, so the cart is per-browser state kept in
 * localStorage — no server round trip, no login. A plain module-level store
 * (read via useSyncExternalStore) rather than React Context, since the cart
 * has exactly one instance for the whole app and this sidesteps the
 * "setState synchronously on mount" hydration problem localStorage-backed
 * state normally runs into — the same pattern HeroVideo uses for
 * matchMedia/connection reads. Checkout always re-verifies price/
 * availability server-side regardless of what's in here.
 */
let items: CartItem[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  items = readStoredCart();
  initialized = true;
}

function notify() {
  writeStoredCart(items);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureInitialized();
  return items;
}

function getServerSnapshot() {
  return items;
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  ensureInitialized();
  const key = itemKey(item);
  const existing = items.find((i) => itemKey(i) === key);
  items = existing
    ? items.map((i) =>
        itemKey(i) === key
          ? { ...i, quantity: Math.min(MAX_ORDER_QUANTITY, i.quantity + quantity) }
          : i,
      )
    : [...items, { ...item, id: item.id ?? (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), quantity: Math.min(MAX_ORDER_QUANTITY, quantity) }];
  notify();
  trackPixel("AddToCart", {
    content_ids: [item.productSlug],
    content_type: "product",
    content_name: item.name,
    value: item.price * quantity,
    currency: "INR",
  });
}

export function removeFromCart(identifier: string) {
  ensureInitialized();
  items = items.filter((i) => i.id !== identifier && itemKey(i) !== identifier && i.productSlug !== identifier);
  notify();
}

export function updateCartQuantity(identifier: string, quantity: number) {
  if (quantity < 1) {
    removeFromCart(identifier);
    return;
  }
  ensureInitialized();
  items = items.map((i) =>
    i.id === identifier || itemKey(i) === identifier || i.productSlug === identifier
      ? { ...i, quantity: Math.min(MAX_ORDER_QUANTITY, quantity) }
      : i,
  );
  notify();
}

export function clearCart() {
  ensureInitialized();
  items = [];
  notify();
}

export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items: cartItems,
    isHydrated: initialized,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateQuantity: updateCartQuantity,
    clear: clearCart,
    totalItems,
    totalPrice,
  };
}
