/**
 * TALIMOON — ORDER — relationship-aware copy engine.
 * ================================================================
 * The order experience never assumes the customer is a parent. This
 * module is the semantic layer that lets every later screen phrase a
 * question in a way that fits the orderer's real relationship to the
 * child — "Nabirangiz Madina necha yoshda?" rather than a wooden
 * "Farzandingiz…" for a grandparent.
 *
 * Design rules (see the Phase 01 spec §10, §23):
 *   • NO global string replacement. UZ / EN / RU / AR inflect kinship
 *     terms differently; each locale gets its own small table here.
 *   • The relationship noun is used SPARINGLY — most sentences just
 *     use the child's name. `childRef()` returns the name alone by
 *     default; `childRefWithNoun()` is the occasional flourish.
 *   • Where a possessive kinship noun would be awkward or gendered
 *     (a younger sibling, "my brother's child", a friend's child,
 *     a custom relationship), the copy falls back to a neutral
 *     "main character of this story" phrasing — `usesNeutralCount`.
 *   • The stored shape is a structured `type` + optional `customLabel`
 *     (never just display text), so business logic and future locales
 *     stay possible.
 */

import type { Locale } from "@/lib/journey/types";

export type { Locale };

export type RelationshipType =
  | "parent" // Farzandim
  | "grandparent" // Nabiram
  | "aunt-uncle" // Jiyanim (orderer is the aunt / uncle)
  | "sibling" // Ukam / singlim (the child is the orderer's younger sibling)
  | "sibling-child" // Akam / opamning farzandi
  | "friend-child" // Yaqin insonimning farzandi
  | "other"; // Boshqa — custom, `customLabel` is filled in

export interface RecipientRelationship {
  type: RelationshipType;
  /** Only for `type === "other"` — the orderer's own words, e.g.
   *  "amakivachchamning farzandi". Trimmed, never used for logic. */
  customLabel?: string;
}

export const RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "parent",
  "grandparent",
  "aunt-uncle",
  "sibling",
  "sibling-child",
  "friend-child",
  "other",
] as const;

export function isRelationshipType(value: unknown): value is RelationshipType {
  return (
    typeof value === "string" &&
    (RELATIONSHIP_TYPES as readonly string[]).includes(value)
  );
}

// ── Per-locale kinship tables ─────────────────────────────────────
// `option`      — label in the relationship selector.
// `possessive`  — "your <child-noun>", used before a name; null → use
//                 the name alone (awkward or gendered otherwise).
// `usesNeutralCount` — the count question avoids the kinship noun.

interface RelationshipEntry {
  option: string;
  possessive: string | null;
  usesNeutralCount: boolean;
}

type LocaleTable = Record<RelationshipType, RelationshipEntry>;

const UZ: LocaleTable = {
  parent: { option: "Farzandim", possessive: "farzandingiz", usesNeutralCount: false },
  grandparent: { option: "Nabiram", possessive: "nabirangiz", usesNeutralCount: false },
  "aunt-uncle": { option: "Jiyanim", possessive: "jiyaningiz", usesNeutralCount: false },
  sibling: { option: "Ukam / singlim", possessive: null, usesNeutralCount: true },
  "sibling-child": {
    option: "Akam / opamning farzandi",
    possessive: "jiyaningiz",
    usesNeutralCount: false,
  },
  "friend-child": {
    option: "Yaqin insonimning farzandi",
    possessive: null,
    usesNeutralCount: true,
  },
  other: { option: "Boshqa", possessive: null, usesNeutralCount: true },
};

const EN: LocaleTable = {
  parent: { option: "My child", possessive: "your child", usesNeutralCount: false },
  grandparent: {
    option: "My grandchild",
    possessive: "your grandchild",
    usesNeutralCount: false,
  },
  "aunt-uncle": { option: "My niece / nephew", possessive: null, usesNeutralCount: true },
  sibling: {
    option: "My younger brother / sister",
    possessive: null,
    usesNeutralCount: true,
  },
  "sibling-child": {
    option: "My sibling's child",
    possessive: null,
    usesNeutralCount: true,
  },
  "friend-child": {
    option: "A close friend's child",
    possessive: null,
    usesNeutralCount: true,
  },
  other: { option: "Someone else", possessive: null, usesNeutralCount: true },
};

const RU: LocaleTable = {
  parent: { option: "Мой ребёнок", possessive: "ваш ребёнок", usesNeutralCount: false },
  grandparent: {
    option: "Мой внук / внучка",
    possessive: null,
    usesNeutralCount: true,
  },
  "aunt-uncle": {
    option: "Мой племянник / племянница",
    possessive: null,
    usesNeutralCount: true,
  },
  sibling: {
    option: "Мой младший брат / сестра",
    possessive: null,
    usesNeutralCount: true,
  },
  "sibling-child": {
    option: "Ребёнок моего брата / сестры",
    possessive: null,
    usesNeutralCount: true,
  },
  "friend-child": {
    option: "Ребёнок близкого человека",
    possessive: null,
    usesNeutralCount: true,
  },
  other: { option: "Другой человек", possessive: null, usesNeutralCount: true },
};

const AR: LocaleTable = {
  parent: { option: "طفلي", possessive: "طفلك", usesNeutralCount: false },
  grandparent: { option: "حفيدي / حفيدتي", possessive: "حفيدك", usesNeutralCount: false },
  "aunt-uncle": {
    option: "ابن / ابنة أخي أو أختي",
    possessive: null,
    usesNeutralCount: true,
  },
  sibling: { option: "أخي الأصغر / أختي الصغرى", possessive: null, usesNeutralCount: true },
  "sibling-child": {
    option: "ابن أخي أو أختي",
    possessive: null,
    usesNeutralCount: true,
  },
  "friend-child": {
    option: "طفل شخص عزيز عليّ",
    possessive: null,
    usesNeutralCount: true,
  },
  other: { option: "شخص آخر", possessive: null, usesNeutralCount: true },
};

const TABLES: Record<Locale, LocaleTable> = { uz: UZ, en: EN, ru: RU, ar: AR };

// ── Public helpers ───────────────────────────────────────────────

/** Selector option label for one relationship in one locale. */
export function relationshipOption(type: RelationshipType, locale: Locale): string {
  return TABLES[locale][type].option;
}

/** All selector options, in display order. */
export function relationshipOptions(
  locale: Locale,
): { type: RelationshipType; label: string }[] {
  return RELATIONSHIP_TYPES.map((type) => ({
    type,
    label: relationshipOption(type, locale),
  }));
}

/**
 * How the child is referred to. `withNoun: true` prepends the
 * possessive kinship noun when the locale + relationship allow one
 * ("nabirangiz Madina"); otherwise it is just the trimmed name.
 * `customLabel` is never spliced into a sentence — it is only shown
 * back on its own (e.g. a review row), so `other` always uses the
 * bare name here.
 */
export function childRef(
  rel: RecipientRelationship,
  name: string,
  locale: Locale,
  opts: { withNoun?: boolean } = {},
): string {
  const clean = name.trim();
  if (!opts.withNoun) return clean;
  const possessive = TABLES[locale][rel.type].possessive;
  if (!possessive || !clean) return clean;
  return locale === "ar" ? `${possessive} ${clean}` : `${possessive} ${clean}`;
}

/** Does the count question for this relationship avoid the kinship noun? */
export function usesNeutralCount(
  rel: RecipientRelationship,
  locale: Locale,
): boolean {
  return TABLES[locale][rel.type].usesNeutralCount;
}

/** The possessive kinship noun on its own ("nabirangiz"), or null. */
export function possessiveNoun(
  rel: RecipientRelationship,
  locale: Locale,
): string | null {
  return TABLES[locale][rel.type].possessive;
}

/**
 * A short human label for the chosen relationship, for review / back
 * references. For `other` this is the orderer's `customLabel` if set.
 */
export function relationshipLabel(
  rel: RecipientRelationship,
  locale: Locale,
): string {
  if (rel.type === "other" && rel.customLabel?.trim()) {
    return rel.customLabel.trim();
  }
  return relationshipOption(rel.type, locale);
}
