"use client";

import { useSyncExternalStore } from "react";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/validation";

export interface CartItem {
  productSlug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
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
  const existing = items.find((i) => i.productSlug === item.productSlug);
  items = existing
    ? items.map((i) =>
        i.productSlug === item.productSlug
          ? { ...i, quantity: Math.min(MAX_ORDER_QUANTITY, i.quantity + quantity) }
          : i,
      )
    : [...items, { ...item, quantity: Math.min(MAX_ORDER_QUANTITY, quantity) }];
  notify();
}

export function removeFromCart(productSlug: string) {
  ensureInitialized();
  items = items.filter((i) => i.productSlug !== productSlug);
  notify();
}

export function updateCartQuantity(productSlug: string, quantity: number) {
  if (quantity < 1) {
    removeFromCart(productSlug);
    return;
  }
  ensureInitialized();
  items = items.map((i) =>
    i.productSlug === productSlug ? { ...i, quantity: Math.min(MAX_ORDER_QUANTITY, quantity) } : i,
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
