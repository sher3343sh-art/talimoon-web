/**
 * TALIMOON — PARENT FEEDBACK — per-visitor "read" tracking.
 * ================================================================
 * Same static-site honesty ceiling as `reactions.ts`: there is no
 * server, so there is no true count of how many DISTINCT people have
 * read the comments. What this module can do honestly:
 *
 *   • record which comment ids THIS browser has actually scrolled to
 *     and dwelled on (localStorage), and
 *   • expose that as "you have read k of n" progress.
 *
 * A read is registered only after a card has been the centre card for
 * a short dwell while the carousel is on screen — i.e. the visitor
 * actually stopped on it. Never on load, never for the faded side
 * cards, never from a click alone.
 *
 * `audienceCount()` is the seam for a real aggregate: it returns null
 * today. When a backend exists it returns the true number of distinct
 * readers and the meta line shows that instead — nothing else changes.
 */

const READ_KEY = "talimoon:parent-feedback-read:v1";

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function readIds(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify(ids));
  } catch {
    /* quota / disabled storage — the progress line simply won't grow */
  }
}

/** Mark one comment as read by this visitor. Idempotent. */
export function markRead(feedbackId: string): void {
  const ids = readIds();
  if (ids.includes(feedbackId)) return;
  ids.push(feedbackId);
  writeIds(ids);
  notify();
}

/** How many of `ids` this visitor has already read. */
export function readCountAmong(ids: readonly string[]): number {
  const read = new Set(readIds());
  return ids.reduce((n, id) => (read.has(id) ? n + 1 : n), 0);
}

export function hasRead(feedbackId: string): boolean {
  return readIds().includes(feedbackId);
}

/**
 * The real number of distinct people who have read these comments.
 * Needs a backend to be honest — null until one exists.
 */
export function audienceCount(): number | null {
  return null;
}

/** Re-run `listener` when the read set changes (this tab or another). */
export function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: StorageEvent) => {
    if (event.key === READ_KEY) listener();
  };
  window.addEventListener("storage", handler);
  listeners.add(listener);
  return () => {
    window.removeEventListener("storage", handler);
    listeners.delete(listener);
  };
}
