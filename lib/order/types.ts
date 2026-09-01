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

/**
 * The written delivery address is the PRIMARY address (spec §42–49).
 * `location` is optional extra precision — a pin the courier can use —
 * and never a substitute for the written fields. Stored provider-neutral
 * (plain lat/lng/accuracy) so a map layer can be added later without
 * touching the order model.
 */
export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface DeliveryAddress {
  /** Viloyat */
  region: string;
  /** Shahar / tuman */
  cityDistrict: string;
  /** Ko‘cha */
  street: string;
  /** Uy / bino */
  building: string;
  /** Kvartira / xonadon — optional */
  apartment?: string;
  /** Mo‘ljal — optional */
  landmark?: string;
  /** Optional GPS pin (spec §44–49). */
  location?: DeliveryLocation;
}

export function emptyDeliveryAddress(): DeliveryAddress {
  return { region: "", cityDistrict: "", street: "", building: "" };
}

/** The written address is enough on its own — a pin is never required
 *  (spec §44/§70). */
export function isDeliveryAddressComplete(a: DeliveryAddress): boolean {
  return (
    a.region.trim().length > 0 &&
    a.cityDistrict.trim().length > 0 &&
    a.street.trim().length > 0 &&
    a.building.trim().length > 0
  );
}

export interface Orderer {
  /** Form of address, chosen alongside the name in Phase 01. `null`
   *  until answered; the plain name is used when it stays null. */
  honorific: Honorific | null;
  /** Collected first, in Phase 01. */
  name: string;
  /** Logistics — collected at order finalization, not in Phase 01. */
  phone: string;
  /** Structured delivery address (+ optional pin). See {@link DeliveryAddress}. */
  deliveryAddress: DeliveryAddress;
}

export function emptyOrderer(): Orderer {
  return {
    honorific: null,
    name: "",
    phone: "",
    deliveryAddress: emptyDeliveryAddress(),
  };
}

/** Phase 02 dream routes. `null` until the adult chooses one. */
export type DreamStatus = "has-dream" | "not-yet" | null;

/**
 * The shared answer model behind every multi-select-or-write-your-own
 * question in Phase 02/03 (interests, appreciated qualities, growth
 * behaviours). A preset and a custom answer become the SAME kind of
 * data the moment either is chosen — later screens read this array,
 * never a hardcoded assumption about which preset the adult picked.
 *
 * `id` is the stable identity: a prepared key ("football", "kind") for
 * a preset, or the custom text itself for a custom answer (already
 * de-duplicated against everything else in the list, so this is safe).
 * Display text is resolved from `id` through that category's own
 * locale-aware label lookup (`interestLabel` / `qualityLabel` /
 * `growthFull`) — which already falls through to the raw text for
 * anything that isn't a known key — so a preset's label stays correct
 * if the orderer switches language mid-flow, and nothing needs to
 * freeze a translated string on the object itself.
 */
export interface SelectableAnswer {
  id: string;
  source: "preset" | "custom";
}

/** An interest, plus its own optional deepening detail (spec: detail
 *  lives on the SAME interest, never a separate array keyed by position). */
export interface InterestAnswer extends SelectableAnswer {
  detail?: string;
}

/**
 * A growth behaviour, plus ITS OWN optional context (spec §22–26):
 * every selected behaviour carries when/where it tends to show up.
 * There is no single global "growth context" any more — one behaviour's
 * context can never be attributed to another. `context` and
 * `noSpecificContext` are mutually exclusive on the same item.
 */
export interface GrowthBehaviorAnswer extends SelectableAnswer {
  context?: string;
  noSpecificContext?: boolean;
}

/** Set one growth behaviour's context, or its "no particular situation"
 *  flag — the two are mutually exclusive on that single item (spec §25). */
export function setGrowthItemContext(
  list: GrowthBehaviorAnswer[],
  id: string,
  patch: { context?: string; noSpecificContext?: boolean },
): GrowthBehaviorAnswer[] {
  return list.map((a) => {
    if (a.id !== id) return a;
    if (patch.noSpecificContext === true) {
      return { ...a, noSpecificContext: true, context: "" };
    }
    if (patch.noSpecificContext === false && patch.context === undefined) {
      return { ...a, noSpecificContext: false };
    }
    if (patch.context !== undefined) {
      return { ...a, context: patch.context, noSpecificContext: false };
    }
    return a;
  });
}

/**
 * "Yuragingizda qolgan gaplar" — the emotional bridge. Three
 * conceptually separate pieces, gathered per child, every one
 * optional.
 *
 * `privateContext` may be a difficult adult account (distance, an
 * argument, a delicate family matter). It stays PRIVATE: it is never
 * shown to the child in the form and never copied into the story.
 * It is used only to understand the safe feeling to convey — and
 * never to blame a caregiver, take a side, or press the child to
 * forgive or love someone.
 */
export interface EmotionalBridge {
  /** Q1 — the real situation, in the adult's words. Private context. */
  privateContext?: string;
  /** Q2 — what the adult hopes the child feels from the story. */
  intendedFeeling?: string;
  /** Q3 — one sentence the adult would say from the heart. */
  heartMessage?: string;
  /** True once this child's section has been seen through to the end.
   *  The section is optional, so this can be true with every field
   *  left blank. */
  done?: boolean;
}

export interface ChildProfile {
  /** Stable identity — assigned once, on creation. Future child data
   *  attaches to this, so it must never be derived from position. */
  id: string;
  name: string;
  /** Numeric, or null until answered. */
  age: number | null;
  /**
   * THIS child's relationship to the orderer. Families are often mixed
   * (a own child and a nephew growing up together as the two main
   * characters) — never assume every child shares the order-level
   * `recipientRelationship`. Set directly from Phase 01 when the
   * orderer chose a single relationship type for everyone; asked per
   * child, right after names/ages, when 2–3 types were chosen.
   */
  relationship?: RecipientRelationship;

  // ── Phase 02 — "the child's world" (per child) ─────────────────
  /** Up to 3 primary interests — preset and custom answers side by
   *  side in one array (spec: they must have equal status). */
  interests?: InterestAnswer[];
  /** The absorbing activity, in the adult's words (question 03). */
  favoriteActivity?: string;
  /** Set when the adult says there is no single absorbing activity. */
  noFavoriteActivity?: boolean;
  /** Which dream route is active. */
  dreamStatus?: DreamStatus;
  /** The CHILD's own stated dream (only when dreamStatus === "has-dream"). */
  childDream?: string;
  /** What the ADULT hopes for the child (only when dreamStatus === "not-yet").
   *  Never attributed to the child. */
  adultHope?: string;
  /** True once this child's Phase 02 conversation is finished. */
  phase02Done?: boolean;

  // ── Phase 03 — "the child's character" (per child) ─────────────
  /** Up to 3 qualities the adult appreciates — preset and custom side
   *  by side. Never a judgement, always something valued. */
  appreciatedQualities?: SelectableAnswer[];
  /** A real moment those qualities show (optional free text). */
  qualityExample?: string;
  /** Set when the adult says no example comes to mind right now —
   *  mutually exclusive with `qualityExample` (spec §31). */
  noQualityExample?: boolean;
  /** Up to 3 behaviours the adult would gently like to support —
   *  preset and custom side by side. Each describes a behaviour or
   *  situation, never labels the child, and carries its OWN optional
   *  context (spec §22–26). */
  growthBehaviors?: GrowthBehaviorAnswer[];
  /** Set when the adult says there is nothing in particular right now —
   *  exclusive with `growthBehaviors` (spec §19–21). */
  noGrowthArea?: boolean;
  /** Up to 3 values the story should strengthen. */
  desiredValues?: string[];
  /** True once this child's Phase 03 conversation is finished. */
  phase03Done?: boolean;

  // ── "Yuragingizda qolgan gaplar" — the emotional bridge (per child) ──
  /** Private context + the feeling to carry across + one heartfelt
   *  line. Kept per child; one child's private context is never shown
   *  against another. See {@link EmotionalBridge}. */
  emotionalBridge?: EmotionalBridge;

  // ── Later phases (declared, not collected yet) ─────────────────
  specialDetails?: string;
  photos?: File[];
}

/**
 * When the adult switches dream routes, the other route's answer is
 * stale and must not leak into the portrait or the summary. Returns a
 * patch that clears whatever no longer belongs to the active path.
 */
export function reconcileDream(status: DreamStatus): Partial<ChildProfile> {
  if (status === "has-dream") return { dreamStatus: status, adultHope: "" };
  if (status === "not-yet") return { dreamStatus: status, childDream: "" };
  return { dreamStatus: null, childDream: "", adultHope: "" };
}

/**
 * When the adult switches to "nothing in particular" (spec §19–21), the
 * growth behaviours — and the per-item contexts that live on them — are
 * stale and must not reach the portrait or the summary. Clearing the
 * array clears every attached context with it.
 */
export function reconcileGrowth(hasBehavior: boolean): Partial<ChildProfile> {
  return hasBehavior
    ? { noGrowthArea: false }
    : { noGrowthArea: true, growthBehaviors: [] };
}

/** Quality example ↔ "no example comes to mind" are mutually exclusive
 *  (spec §15/§52) — entering one always clears the other. */
export function reconcileQualityExample(hasExample: boolean): Partial<ChildProfile> {
  return hasExample
    ? { noQualityExample: false }
    : { noQualityExample: true, qualityExample: "" };
}

/** A stable id for a CUSTOM selectable answer — the normalized text
 *  itself, so duplicate detection and identity are the same check.
 *  Presets use their prepared key directly as `id` instead. */
export function makeCustomAnswerId(text: string): string {
  return text.trim().replace(/\s+/g, " ");
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
