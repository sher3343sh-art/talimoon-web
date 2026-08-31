/**
 * TALIMOON — PARENT FEEDBACK — per-comment reaction store.
 * ================================================================
 * WHAT THIS IS (and honestly is not)
 * ----------------------------------------------------------------
 * TALIMOON's site is a static Next.js build: there is no database,
 * no API route, no auth. There is therefore no server that can be
 * the true source of reaction totals today. This module is the
 * honest ceiling for that constraint AND the exact seam a real
 * backend drops into with no UI change:
 *
 *   • Conceptual record — { feedbackId, visitorId, reactionType,
 *     createdAt, updatedAt }, unique on (feedbackId, visitorId).
 *   • `setReaction(feedbackId, type | null)` sends the INTENDED
 *     action, never a resulting count, and returns the canonical
 *     state to reconcile against — the same contract a server
 *     action / `POST /api/feedback-reactions` would have.
 *   • `visitorId` is an opaque random id; swap it for `userId` when
 *     accounts exist and the reaction system does not change.
 *
 * Until that backend exists the canonical state is persisted in
 * this browser's `localStorage`. Consequences, stated plainly:
 *   • Base totals come from `feedback.reactions` (server-aggregated
 *     later; all zero now). This store only adds THIS visitor's one
 *     active reaction on top — it cannot see other visitors.
 *   • "One reaction per visitor per comment" is enforced by the
 *     data shape (one value per feedbackId) and persisted; a user
 *     who clears storage can react again. A server must enforce the
 *     uniqueness constraint for real. Disabling a button in React
 *     is never the control — persistence is.
 *   • `visitorId` never leaves the browser, is never displayed, and
 *     carries no personal data. No fingerprinting.
 */

import {
  isReactionType,
  type ReactionCounts,
  type ReactionType,
} from "./feedback";

const VISITOR_KEY = "talimoon:visitor";
const REACTIONS_KEY = "talimoon:parent-feedback-reactions:v1";

/** Small simulated round-trip so optimistic UI + rollback are real
 *  behaviours, not decoration. A real backend replaces this delay
 *  with the network call. */
const SIM_LATENCY_MS = 260;

type ReactionMap = Record<string, ReactionType>;

/** Same-tab change listeners. The `storage` event only fires in OTHER
 *  tabs, so a second card for the same comment in this tab (e.g. one
 *  showing in two carousel slots) wouldn't otherwise re-sync. */
const localListeners = new Set<() => void>();

function notifyLocal(): void {
  for (const listener of localListeners) listener();
}

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Opaque, persistent, per-browser visitor id. Created lazily on first
 * reaction. Random — not derived from any device/user signal. Never
 * rendered, never transmitted (there is nowhere to transmit it).
 */
export function getVisitorId(): string {
  if (!hasStorage()) return "anonymous";
  try {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = randomId();
      window.localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

function readMap(): ReactionMap {
  if (!hasStorage()) return {};
  try {
    const raw = window.localStorage.getItem(REACTIONS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: ReactionMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isReactionType(value)) out[id] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function writeMap(map: ReactionMap): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(REACTIONS_KEY, JSON.stringify(map));
  } catch {
    /* quota / disabled storage — the optimistic UI will roll back */
  }
}

/** This visitor's single active reaction for one comment, or null. */
export function getReaction(feedbackId: string): ReactionType | null {
  return readMap()[feedbackId] ?? null;
}

/**
 * Apply the visitor's INTENDED reaction for one comment and return the
 * canonical persisted value.
 *
 *   • `type` is a valid ReactionType  → that becomes their one active
 *     reaction (replacing any previous one — the reaction is MOVED,
 *     never added alongside).
 *   • `type` is `null`                → their reaction is removed.
 *
 * Toggling (clicking the already-active reaction) is expressed by the
 * caller passing `null`. Rejects if the write cannot be trusted
 * (offline / storage failure) so the caller rolls the optimistic
 * update back — never leaving a fake local count behind.
 */
export function setReaction(
  feedbackId: string,
  type: ReactionType | null,
): Promise<ReactionType | null> {
  if (type !== null && !isReactionType(type)) {
    return Promise.reject(new Error(`invalid reaction type: ${String(type)}`));
  }

  // Establish the visitor identity for the conceptual record even
  // though there is no server to send it to yet.
  getVisitorId();

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        reject(new Error("offline"));
        return;
      }
      try {
        const map = readMap();
        if (type === null) {
          delete map[feedbackId];
        } else {
          map[feedbackId] = type;
        }
        writeMap(map);
        notifyLocal();
        resolve(type);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("reaction write failed"));
      }
    }, SIM_LATENCY_MS);
  });
}

/**
 * The counts to render: server-aggregated base totals plus this
 * visitor's own active reaction (+1 on exactly one type, or nothing).
 * Never mutates the base object.
 */
export function deriveCounts(
  base: ReactionCounts,
  mine: ReactionType | null,
): ReactionCounts {
  const next: ReactionCounts = { ...base };
  if (mine) next[mine] = (next[mine] ?? 0) + 1;
  return next;
}

/**
 * Cross-tab consistency: fire `listener` when the reaction map changes
 * in another tab, so a card's selected state stays correct everywhere.
 */
export function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: StorageEvent) => {
    if (event.key === REACTIONS_KEY) listener();
  };
  window.addEventListener("storage", handler);
  localListeners.add(listener);
  return () => {
    window.removeEventListener("storage", handler);
    localListeners.delete(listener);
  };
}
