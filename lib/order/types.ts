/**
 * TALIMOON — ORDER — data model.
 * ================================================================
 * The conceptual separation the order experience is built around
 * (Phase 01 spec §21):
 *
 *   Orderer               — the person placing the order + logistics
 *   RecipientRelationship  — structured type (+ optional custom label)
 *   ChildProfile           — one main character; EVERYTHING specific
 *                            to a child hangs off its stable `id`,
 *                            never an array index
 *   Order                  — orderer + derived bookType + children[]
 *
 * Phase 01 fills `orderer.name`, `recipientRelationship` and each
 * child's `id` / `name` / `age`. The remaining `ChildProfile` fields
 * are declared now but collected in later phases — the type is
 * already child-centric so that work is additive, not a refactor.
 */

import type { BookType } from "@/components/begin/orderFormData";
import type { Honorific, RecipientRelationship } from "./relationship";

export type { BookType };

export interface Orderer {
  /** Form of address, chosen alongside the name in Phase 01. `null`
   *  until answered; the plain name is used when it stays null. */
  honorific: Honorific | null;
  /** Collected first, in Phase 01. */
  name: string;
  /** Logistics — collected at order finalization, not in Phase 01. */
  phone: string;
  region: string;
  city: string;
}

export function emptyOrderer(): Orderer {
  return { honorific: null, name: "", phone: "", region: "", city: "" };
}

export interface ChildProfile {
  /** Stable identity — assigned once, on creation. Future child data
   *  attaches to this, so it must never be derived from position. */
  id: string;
  name: string;
  /** Numeric, or null until answered. */
  age: number | null;

  // ── Later phases (declared, not collected in Phase 01) ──────────
  interests?: string;
  deepInterest?: string;
  dreams?: string;
  strengths?: string[];
  growthAreas?: string;
  desiredFutureQualities?: string[];
  specialDetails?: string;
  photos?: File[];
}

/** A crypto-random id with a safe fallback for older browsers / SSR. */
export function makeChildId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return `child_${crypto.randomUUID()}`;
    }
  } catch {
    /* fall through */
  }
  return `child_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyChild(): ChildProfile {
  return { id: makeChildId(), name: "", age: null };
}

/** How many main children a single order can hold. Preserves the
 *  existing wizard's cap — change here if the product rule changes. */
export const MIN_MAIN_CHILDREN = 1;
export const MAX_MAIN_CHILDREN = 6;

/** Common ages offered as one-tap choices; anything outside is entered
 *  through "another age". Not a hard product limit — the existing
 *  product enforces none — just the fast path. */
export const QUICK_AGES: readonly number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const AGE_MIN = 1;
export const AGE_MAX = 17;

export function isValidAge(age: number | null): age is number {
  return (
    typeof age === "number" &&
    Number.isInteger(age) &&
    age >= AGE_MIN &&
    age <= AGE_MAX
  );
}

/**
 * Customer-facing child count → internal book type. The customer
 * never sees "single" / "multi"; this is the only place the mapping
 * lives. Pricing (`calculatePrice`) still keys off the result.
 */
export function bookTypeForChildCount(count: number): BookType {
  return count <= 1 ? "single" : "multi";
}

/** What Phase 01 hands to the rest of the experience. */
export interface Phase01Result {
  ordererHonorific: Honorific | null;
  ordererName: string;
  recipientRelationship: RecipientRelationship;
  children: ChildProfile[];
}
