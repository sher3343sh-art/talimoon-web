/**
 * TALIMOON — ORDER — the reusable selection-list logic behind every
 * "pick up to N, or write your own" question (Phase 02 interests,
 * Phase 03 appreciated qualities, Phase 03 growth behaviours).
 * ================================================================
 * Deterministic, no AI: a preset toggle and a custom addition go
 * through the exact same array, so a later screen reading that array
 * can never end up assuming a preset the adult didn't actually pick.
 *
 * Duplicate detection is a plain normalized-text compare (trim +
 * case-insensitive + collapsed whitespace) — never semantic matching.
 * "Futbol" and "futbol" collide; "Football" and "Futbol" do not,
 * unless a locale explicitly maps them (it doesn't, here).
 */

import type { SelectableAnswer } from "./types";
import { makeCustomAnswerId } from "./types";

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

/** Resolve one answer's display text — presets look up their label via
 *  `resolveLabel(id)` (locale-aware); a custom answer's `id` already
 *  IS its exact text. */
export function answerLabel(
  a: SelectableAnswer,
  resolveLabel: (id: string) => string,
): string {
  return a.source === "preset" ? resolveLabel(a.id) : a.id;
}

/** Toggle a preset on/off. Returns `null` (no change) when adding would
 *  exceed `max` — the caller shows the calm "you've picked N" feedback. */
export function togglePreset<T extends SelectableAnswer>(
  list: T[],
  key: string,
  max: number,
  makeItem: (key: string) => T,
): T[] | null {
  if (list.some((a) => a.source === "preset" && a.id === key)) {
    return list.filter((a) => !(a.source === "preset" && a.id === key));
  }
  if (list.length >= max) return null;
  return [...list, makeItem(key)];
}

/** Add a custom, free-text answer. Returns `null` when it would exceed
 *  `max`; returns the SAME list unchanged (a safe no-op) when the
 *  normalized text duplicates an existing preset or custom answer's
 *  display text. */
export function addCustomAnswer<T extends SelectableAnswer>(
  list: T[],
  rawText: string,
  max: number,
  makeItem: (id: string) => T,
  resolveLabel: (id: string) => string,
): T[] | null {
  const text = rawText.trim().replace(/\s+/g, " ");
  if (!text) return list;
  if (list.length >= max) return null;
  const norm = normalize(text);
  const isDuplicate = list.some((a) => normalize(answerLabel(a, resolveLabel)) === norm);
  if (isDuplicate) return list;
  return [...list, makeItem(makeCustomAnswerId(text))];
}

/** Remove one answer by id (works for either source). */
export function removeAnswer<T extends SelectableAnswer>(list: T[], id: string): T[] {
  return list.filter((a) => a.id !== id);
}
