"use client";

/**
 * Order MARKET preference — a tiny client-only store, the same shape as
 * `lib/i18n/LanguageContext` (module store + `useSyncExternalStore` +
 * localStorage). It remembers the market a visitor last chose so the
 * product-page selector and a direct `/begin` entry don't ask again on
 * every visit.
 *
 * This is a PREFERENCE, not the order. Resolution priority when a
 * checkout starts (spec §12) is:
 *   1. an explicit market handed in by the "Order Now" that was just
 *      clicked (a prop) — always wins
 *   2. the market already on an in-progress order
 *   3. this saved preference
 *   4. ask the customer
 *
 * `market` follows the destination country, never the site language:
 * someone in Qatar can read the site in Uzbek and still be an
 * INTERNATIONAL / USD order.
 */

import { useSyncExternalStore } from "react";
import type { Market } from "@/components/begin/orderFormData";

const STORAGE_KEY = "talimoon-market";
const VALID: readonly Market[] = ["UZ", "INTERNATIONAL"];

type Listener = () => void;
let listeners: Listener[] = [];

function read(): Market | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && (VALID as string[]).includes(stored)
      ? (stored as Market)
      : null;
  } catch {
    return null;
  }
}

let current: Market | null = read();

function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Market | null {
  return current;
}

function getServerSnapshot(): Market | null {
  return null;
}

/** Persist the customer's market choice. */
export function setMarketPreference(next: Market): void {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode / storage disabled — the in-memory value still works */
  }
  listeners.forEach((l) => l());
}

/** The saved preference, or `null` if the visitor has never chosen. */
export function useMarketPreference(): {
  preference: Market | null;
  setPreference: (m: Market) => void;
} {
  const preference = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return { preference, setPreference: setMarketPreference };
}

/** Read a `?market=` hint (uz | international | UZ | INTERNATIONAL) from
 *  the current URL, for a link that wants to force a market into
 *  `/begin`. Safe to call anywhere; returns null off the client. */
export function marketFromLocation(): Market | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search)
      .get("market")
      ?.trim()
      .toUpperCase();
    if (raw === "UZ" || raw === "UZBEKISTAN") return "UZ";
    if (raw === "INTERNATIONAL" || raw === "INTL") return "INTERNATIONAL";
    return null;
  } catch {
    return null;
  }
}
