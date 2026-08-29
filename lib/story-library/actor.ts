'use client';

/**
 * The identity seam. V1: an anonymous, stable per-device id kept in
 * localStorage — enough to own a "love", a comment or reading history
 * on this device. When accounts arrive, `Actor.id` is linked to a
 * `userId` and the device history merges; nothing that references
 * `getActorId()` needs to change.
 *
 * No PII. The id is a random token, not derived from anything about
 * the person or the device.
 */

const KEY = 'talimoon-actor-id';

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `a_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Returns a stable id for this device, creating one on first call.
 *  Returns a throwaway id (not persisted) when storage is unavailable
 *  so callers never have to null-check. */
export function getActorId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing) return existing;
    const fresh = randomId();
    window.localStorage.setItem(KEY, fresh);
    return fresh;
  } catch {
    return randomId();
  }
}

const NAME_KEY = 'talimoon-actor-name';

export function getActorName(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage.getItem(NAME_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export function setActorName(name: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
  } catch {
    /* non-critical */
  }
}
