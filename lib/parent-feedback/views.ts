/**
 * TALIMOON — PARENT FEEDBACK — shared "reads" counter (client side).
 * ================================================================
 * Talks to `/api/feedback-views`, which keeps ONE number in Redis:
 * how many times the approved comments have been scrolled through.
 * No de-duplication — a returning visitor reading again counts again.
 *
 *   • `reportRead()` — fire once per page load, after the visitor has
 *     actually dwelled on the comments. Sends one increment.
 *   • `getCount()` / `subscribe()` — a tiny external store the meta
 *     line reads via `useSyncExternalStore`.
 *
 * If the backend is not configured the route returns `{ count: null }`
 * and the count simply stays `null`, so the meta line shows only the
 * comment total — never an invented figure.
 */

const ENDPOINT = "/api/feedback-views";

let count: number | null = null;
let didFetch = false;
let didReport = false;

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function apply(next: unknown): void {
  if (typeof next === "number" && Number.isFinite(next) && next !== count) {
    count = next;
    notify();
  }
}

/** Current shared total, or null when the backend isn't answering. */
export function getCount(): number | null {
  return count;
}

async function refresh(): Promise<void> {
  try {
    const res = await fetch(ENDPOINT, { cache: "no-store" });
    const data: unknown = await res.json();
    apply((data as { count?: unknown }).count);
  } catch {
    /* leave `count` as it is */
  }
}

/**
 * Record one read. Guarded so a single page load sends at most one
 * increment no matter how many comments the visitor moves through.
 */
export async function reportRead(): Promise<void> {
  if (didReport) return;
  didReport = true;
  try {
    const res = await fetch(ENDPOINT, { method: "POST" });
    const data: unknown = await res.json();
    apply((data as { count?: unknown }).count);
  } catch {
    didReport = false;
  }
}

/** Subscribe the meta line; the first subscriber triggers the fetch. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!didFetch) {
    didFetch = true;
    void refresh();
  }
  return () => {
    listeners.delete(listener);
  };
}
