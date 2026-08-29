'use client';

/**
 * "Continue reading" — V1 implementation.
 * ----------------------------------------------------------------
 * Per-device, no account required: the single biggest reason a child
 * returns to Yusuf & Yasmina, at almost no cost. Stored in
 * localStorage under one key as `{ [slug]: ReadingProgress }`.
 *
 * When accounts arrive, the same `ReadingProgress` shape syncs
 * server-side and this module becomes a cache in front of it — the
 * Y&Y spine and the "Continue" button, which read through
 * `getProgress()` / `getAllProgress()`, do not change.
 *
 * Every access is guarded: private windows, cleared storage and
 * storage-blocked contexts must all degrade to "no saved progress".
 */

import type { ReadingProgress } from './types';

const KEY = 'talimoon-reading-progress';

type Store = Record<string, ReadingProgress>;

function readStore(): Store {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* storage blocked / full — progress is a convenience, not critical */
  }
}

export function getProgress(slug: string): ReadingProgress | null {
  return readStore()[slug] ?? null;
}

export function getAllProgress(): Store {
  return readStore();
}

export function saveProgress(next: ReadingProgress): void {
  const store = readStore();
  store[next.slug] = { ...next, atISO: next.atISO || new Date().toISOString() };
  writeStore(store);
}

export function clearProgress(slug: string): void {
  const store = readStore();
  if (slug in store) {
    delete store[slug];
    writeStore(store);
  }
}

/** Of a set of series-episode slugs (in episode order), the furthest
 *  one the reader has any saved progress on — powers the series-level
 *  "Continue" affordance. */
export function furthestProgress(
  orderedSlugs: readonly string[],
): { slug: string; progress: ReadingProgress } | null {
  const store = readStore();
  for (let i = orderedSlugs.length - 1; i >= 0; i--) {
    const p = store[orderedSlugs[i]];
    if (p) return { slug: orderedSlugs[i], progress: p };
  }
  return null;
}
