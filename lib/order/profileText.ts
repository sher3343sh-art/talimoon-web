/**
 * Serialises the RICH per-child structured answers collected in Phase 02
 * ("the child's world"), Phase 03 ("the child's character") and the
 * emotional bridge into the flat strings the order-intake contract carries
 * (`profile.children[i].{interests,dreams,strengths,growthAreas}`,
 * `profile.traits[]`, `profile.extraInfo`) and that the Story Profile DOCX
 * renders section by section.
 *
 * WHY THIS EXISTS: the /begin form moved this data onto `ChildProfile`
 * (per child) long ago, but `buildSubmitPayload` was never updated to send
 * it — so every structured Story Profile section rendered
 * "— taqdim etilmagan —" even though the customer had answered. This module
 * is the missing bridge. It is PURE (no I/O), deterministic, and only ever
 * re-expresses what the customer actually submitted — it never invents,
 * summarises away, or infers a value. An unanswered section yields
 * `undefined`, so the payload omits the key and the renderer legitimately
 * shows "— taqdim etilmagan —".
 *
 * The Story Profile dossier is Uzbek (all production staff are
 * Uzbek-speaking — see talimoon-intake src/storyprofile/render.ts), and the
 * customer's own words are always kept verbatim. The short orienting
 * prefixes below are taken from the localized Phase 02/03 copy so they
 * follow the book's language.
 */

import type { ChildProfile } from "./types";
import { interestLabel, phase02Copy, type Locale } from "./phase02-copy";
import { growthFull, phase03Copy, qualityLabel, valueLabel } from "./phase03-copy";

function clean(s: string | undefined | null): string {
  return (s ?? "").trim();
}

function joinLines(lines: Array<string | undefined | null>): string | undefined {
  const out = lines.map(clean).filter((l) => l.length > 0);
  return out.length > 0 ? out.join("\n") : undefined;
}

/**
 * §5 "Qiziqishlari va dunyosi" — the child's interests, each with its own
 * optional deepening detail, exactly as chosen. One interest per line.
 */
export function childInterestsText(child: ChildProfile, locale: Locale): string | undefined {
  const list = child.interests ?? [];
  if (list.length === 0) return undefined;
  return joinLines(
    list.map((a) => {
      const label = interestLabel(a.id, locale);
      const detail = clean(a.detail);
      return detail ? `${label} — ${detail}` : label;
    }),
  );
}

/**
 * §6 "Orzulari va sevimli mashg'ulotlari" — the absorbing activity (or the
 * explicit "no single activity") plus the dream: the CHILD's own dream when
 * they have one, otherwise the ADULT's hope, never conflated.
 */
export function childDreamsText(child: ChildProfile, locale: Locale): string | undefined {
  const c = phase02Copy(locale);
  const lines: Array<string | undefined> = [];

  if (clean(child.favoriteActivity)) {
    lines.push(`${c.pAbsorbs}: ${clean(child.favoriteActivity)}`);
  } else if (child.noFavoriteActivity) {
    lines.push(`${c.pAbsorbs}: ${c.q3None}`);
  }

  if (child.dreamStatus === "has-dream" && clean(child.childDream)) {
    lines.push(`${c.pDreams}: ${clean(child.childDream)}`);
  } else if (child.dreamStatus === "not-yet" && clean(child.adultHope)) {
    lines.push(`${c.pHope}: ${clean(child.adultHope)}`);
  }

  return joinLines(lines);
}

/**
 * §7 "Kuchli tomonlari" — the qualities the adult appreciates, each with
 * its own optional "when do you notice this?" example. One per line.
 */
export function childStrengthsText(child: ChildProfile, locale: Locale): string | undefined {
  const list = child.appreciatedQualities ?? [];
  if (list.length === 0) return undefined;
  return joinLines(
    list.map((a) => {
      const label = qualityLabel(a.id, locale);
      const detail = clean(a.detail);
      return detail ? `${label} — ${detail}` : label;
    }),
  );
}

/**
 * §8 "Rivojlantirish kerak bo'lgan jihatlar" — the behaviours the adult
 * would gently like to support, each with its own optional context; or the
 * explicit "nothing in particular right now".
 */
export function childGrowthText(child: ChildProfile, locale: Locale): string | undefined {
  if (child.noGrowthArea) {
    return phase03Copy(locale).q3None;
  }
  const list = child.growthBehaviors ?? [];
  if (list.length === 0) return undefined;
  return joinLines(
    list.map((a) => {
      const label = growthFull(a.id, locale);
      const context = clean(a.context);
      return context ? `${label} — ${context}` : label;
    }),
  );
}

/**
 * "Hissiy bog'lanish" — this child's emotional bridge: the private
 * situation, the feeling the story should carry, and the one line from the
 * heart. All three are the adult's own words. Prefixed with the child's
 * name only in a multi-child order so one child's context is never read
 * against another.
 */
export function childEmotionalText(
  child: ChildProfile,
  locale: Locale,
  withName: boolean,
): string | undefined {
  const eb = child.emotionalBridge;
  if (!eb) return undefined;
  const c = emotionalLabels(locale);
  const body = joinLines([
    clean(eb.privateContext) ? `${c.context}: ${clean(eb.privateContext)}` : undefined,
    clean(eb.intendedFeeling) ? `${c.feeling}: ${clean(eb.intendedFeeling)}` : undefined,
    clean(eb.heartMessage) ? `${c.heart}: “${clean(eb.heartMessage)}”` : undefined,
  ]);
  if (!body) return undefined;
  return withName && clean(child.name) ? `${clean(child.name)}:\n${body}` : body;
}

/** Order-level "Hissiy bog'lanish" — every child's bridge, in child order. */
export function orderEmotionalText(
  children: ChildProfile[],
  locale: Locale,
): string | undefined {
  const multi = children.length > 1;
  const parts = children
    .map((ch) => childEmotionalText(ch, locale, multi))
    .filter((p): p is string => !!p);
  return parts.length > 0 ? parts.join("\n\n") : undefined;
}

/**
 * "Tarbiyaviy yo'nalish" — the values the story should strengthen, taken
 * from every child's `desiredValues`, de-duplicated, order preserved.
 * Returns `undefined` (not `[]`) when no child chose any, so the payload
 * omits `profile.traits` entirely.
 */
export function orderDesiredValueLabels(
  children: ChildProfile[],
  locale: Locale,
): string[] | undefined {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ch of children) {
    for (const v of ch.desiredValues ?? []) {
      const label = valueLabel(v, locale);
      const key = label.toLocaleLowerCase();
      if (label && !seen.has(key)) {
        seen.add(key);
        out.push(label);
      }
    }
  }
  return out.length > 0 ? out : undefined;
}

function emotionalLabels(locale: Locale): { context: string; feeling: string; heart: string } {
  if (locale === "uz") {
    return { context: "Vaziyat", feeling: "His qilishini istaydi", heart: "Yurakdan" };
  }
  if (locale === "ru") {
    return { context: "Ситуация", feeling: "Что должен почувствовать", heart: "От сердца" };
  }
  return { context: "Situation", feeling: "Feeling to carry", heart: "From the heart" };
}
