/**
 * TALIMOON — ORDER — Phase 02 ("The child's world") copy + helpers.
 * ================================================================
 * IN SCOPE: Uzbek + English (respectful "Siz" throughout).
 *
 * TALIMOON SAVOL BERMAYDI — SUHBAT OCHADI.
 * SAVOL CHUQUR BO‘LISHI MUMKIN — JAVOB BERISH HECH QACHON QIYIN
 * BO‘LMASLIGI KERAK.
 *
 * Every question opens a NEW layer of the child — never the previous
 * one in different words (spec §20):
 *   QIZIQISHLARI     — WHAT interests the child? (≤ 2, prepared or the
 *                       adult's own words)
 *   BIR OZ ANIQROQ    — WHAT specifically about those interests? (an
 *                       optional deepening of Q1's own answer, not a
 *                       third interest)
 *   SEVIMLI MASHG‘ULOTI — WHAT does the child actually love DOING?
 *                       (an action, in the adult's words)
 *   ORZUSI            — WHAT does the child dream of becoming — asked
 *                       and answered directly, no "does a dream exist?"
 *                       pre-question. "Hali bu haqda o‘ylab ko‘rmagan"
 *                       swaps this for SIZNING TILAGINGIZ, the ADULT's
 *                       own hope — never presented as the child's own.
 * Then a quiet portrait — "FAYZBEKNING DUNYOSI" — and a bridge toward
 * the child's character.
 */

import type { ChildProfile } from "./types";

export type Locale = "uz" | "en";

// ── Prepared interest categories — all NOUNS/topics, never activities
//    (an activity is Q3's job; mixing the two blurs Q1 and Q3 into the
//    same question in different words) ────────────────────────────
export const INTEREST_KEYS = [
  "football",
  "cars",
  "planes",
  "animals",
  "books",
  "nature",
  "music",
  "drawings",
] as const;
export type InterestKey = (typeof INTEREST_KEYS)[number];

export const MAX_PRIMARY_INTERESTS = 2;

const INTEREST_LABELS: Record<InterestKey, Record<Locale, string>> = {
  football: { uz: "Futbol", en: "Football" },
  cars: { uz: "Mashinalar", en: "Cars" },
  planes: { uz: "Samolyotlar", en: "Planes" },
  animals: { uz: "Hayvonlar", en: "Animals" },
  books: { uz: "Kitoblar", en: "Books" },
  nature: { uz: "Tabiat", en: "Nature" },
  music: { uz: "Musiqa", en: "Music" },
  drawings: { uz: "Rasmlar", en: "Drawings" },
};

/** Q2's per-topic "what specifically" example — short, concrete, and
 *  joined (spec §05) into the deepening question's helper text. */
const DEEPEN_EXAMPLES: Record<InterestKey, Record<Locale, string>> = {
  football: {
    uz: "darvozabonlik yoki sevimli jamoasi",
    en: "playing in goal, or their favourite team",
  },
  cars: {
    uz: "markalari, tezligi yoki qanday ishlashi",
    en: "the brands, the speed, or how they work",
  },
  planes: {
    uz: "turlari yoki qanday parvoz qilishi",
    en: "the types, or how they fly",
  },
  animals: {
    uz: "qaysi hayvon yoki ularning odatlari",
    en: "which animal, or their habits",
  },
  books: {
    uz: "qanday hikoyalar yoki qahramonlar",
    en: "the stories, or the characters",
  },
  nature: {
    uz: "qanday joylar yoki mavsumlar",
    en: "which places, or seasons",
  },
  music: {
    uz: "qanday ohang yoki cholg‘u asboblari",
    en: "the sound, or an instrument",
  },
  drawings: {
    uz: "nimalarni chizishni yoki qanday ranglar",
    en: "what they draw, or the colours",
  },
};

export function isInterestKey(v: string): v is InterestKey {
  return (INTEREST_KEYS as readonly string[]).includes(v);
}

/**
 * Q2's helper — built from the actual interests chosen in Q1, so the
 * example always matches what the adult just told us instead of a
 * generic one (spec §07: "examples exist to answer 'what should I
 * write here'"). Falls back to a topic-neutral line when every chosen
 * interest is the adult's own custom words (no prepared example
 * exists for free text).
 */
export function deepenHelp(interests: string[] | undefined, locale: Locale): string {
  const known = (interests ?? []).filter(isInterestKey);
  if (known.length === 0) {
    return locale === "uz"
      ? "Masalan: bu narsaning aynan qaysi tomoni ko‘proq e’tiborini tortishini yozing."
      : "For example, describe exactly which part of it catches their attention most.";
  }
  if (locale === "uz") {
    const parts = known.map((k, i) => {
      const topic = INTEREST_LABELS[k].uz.toLocaleLowerCase("uz");
      const detail = DEEPEN_EXAMPLES[k].uz;
      return i === 1 ? `${topic}da esa ${detail}` : `${topic}da ${detail}`;
    });
    return `Masalan: ${parts.join("; ")}.`;
  }
  const parts = known.map((k) => `in ${INTEREST_LABELS[k].en.toLowerCase()}, ${DEEPEN_EXAMPLES[k].en}`);
  return `For example: ${parts.join("; ")}.`;
}

/** Display label for one stored interest — a prepared category maps to
 *  its label; the adult's own words are shown as typed. */
export function interestLabel(v: string, locale: Locale): string {
  return isInterestKey(v) ? INTEREST_LABELS[v][locale] : v.trim();
}

export function interestOptions(
  locale: Locale,
): { key: InterestKey; label: string }[] {
  return INTEREST_KEYS.map((key) => ({ key, label: INTEREST_LABELS[key][locale] }));
}

function joinList(items: string[], locale: Locale): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  const and = locale === "uz" ? " va " : " and ";
  return clean.slice(0, -1).join(", ") + and + clean[clean.length - 1];
}

/** "sport · shaxmat" for the portrait row. */
export function interestsDisplay(interests: string[] | undefined, locale: Locale): string {
  return (interests ?? []).map((v) => interestLabel(v, locale)).join(" · ");
}

// ── Copy shape ───────────────────────────────────────────────────
export interface Phase02Copy {
  continue: string;
  back: string;

  /** Portrait title only now — the old per-child "intro" screen that
   *  duplicated this eyebrow is gone (spec §02); Phase 01's completion
   *  screen is the merged introduction into Phase 02. */
  worldLabel: (name: string) => string;

  // Q1 — QIZIQISHLARI: WHAT interests the child?
  q1Label: string;
  q1: (name: string) => string;
  q1Help: string;
  customToggle: string;
  customPlaceholder: string;
  customAdd: string;
  interestLimitNote: string;
  removeInterest: (label: string) => string;
  errInterests: string;

  // Q2 — BIR OZ ANIQROQ: WHAT specifically about those interests?
  //      Deepens Q1's own answer — never a second broad interest.
  q2Label: string;
  q2: (name: string, interestsText: string) => string;
  q2Placeholder: string;
  q2Skip: string;

  // Q3 — SEVIMLI MASHG‘ULOTI: WHAT does the child actually love DOING?
  q3Label: string;
  q3: (name: string) => string;
  q3Help: string;
  q3Placeholder: string;
  q3None: string;
  errActivity: string;

  // Q4 — ORZUSI: WHAT does the child dream of becoming? Answered
  //      directly — no "does a dream exist?" pre-question (spec §07).
  q4Label: string;
  q4: (name: string) => string;
  q4Help: string;
  q4Placeholder: string;
  q4NotYet: string;
  errChildDream: string;

  // The adult's hope — swaps in when "Hali bu haqda o‘ylab ko‘rmagan"
  // is chosen. NEVER the child's own words (spec §09).
  q4bTransition: string;
  q4b: (name: string) => string;
  q4bHelp: (name: string) => string;
  q4bPlaceholder: string;
  /** The quiet way back to the dream input, if the adult changes their mind. */
  q4BackToDream: string;
  errAdultHope: string;

  // Portrait section labels
  pLoves: string;
  pDetail: string;
  pAbsorbs: string;
  pDreams: string;
  pHope: string;
  portraitEmpty: string;

  // Milestone / bridge
  milestoneHeading: (name: string) => string;
  milestoneBridge: (name: string) => string;
  nextChildLead: (doneName: string) => string;
  nextChildBridge: (nextName: string) => string;
  nextChildCta: (nextName: string) => string;
}

// ── Uzbek ────────────────────────────────────────────────────────
const uz: Phase02Copy = {
  continue: "Davom etish",
  back: "Orqaga",

  worldLabel: (name) => `${name.trim()}ning dunyosi`,

  q1Label: "QIZIQISHLARI",
  q1: (name) => `${name.trim()}ni ayniqsa nimalar qiziqtiradi?`,
  q1Help:
    "Ko‘rsa, eshitsa yoki gap ochilsa darrov e’tiborini tortadigan narsalarni o‘ylab ko‘ring.",
  customToggle: "Ro‘yxatda yo‘qmi? O‘zingiz yozing",
  customPlaceholder: "Masalan: shaxmat, samolyotlar, pishirish...",
  customAdd: "Qo‘shish",
  interestLimitNote:
    "Hozircha 2 tasi — birini olib tashlab, o‘rniga boshqasini qo‘shsangiz bo‘ladi.",
  removeInterest: (label) => `“${label}” ni olib tashlash`,
  errInterests: "Iltimos, kamida bittasini belgilang yoki yozing.",

  q2Label: "BIR OZ ANIQROQ",
  q2: (name, interestsText) =>
    `${name.trim()} uchun ${interestsText}ning aynan nimasi ko‘proq yoqadi?`,
  q2Placeholder: "Bir necha so‘z bilan yozing...",
  q2Skip: "Asosiylarini esladik",

  q3Label: "SEVIMLI MASHG‘ULOTI",
  q3: (name) => `${name.trim()} nima qilayotganda vaqtni ham unutib qo‘yadi?`,
  q3Help:
    "Uning eng berilib qiladigan mashg‘ulotini eslang. Masalan: futbol o‘ynash, LEGOdan mashina yasash, rasm chizish, velosiped minish, kitob varaqlash yoki o‘yinchoqlarini tartib bilan terish.",
  q3Placeholder: "Masalan: hovlida futbol o‘ynasa, vaqtni unutib qo‘yadi...",
  q3None: "Aniq bir mashg‘uloti yo‘q",
  errActivity: "Iltimos, yozing yoki “Aniq bir mashg‘uloti yo‘q”ni tanlang.",

  q4Label: "ORZUSI",
  q4: (name) => `${name.trim()} katta bo‘lganda kim bo‘lmoqchi?`,
  q4Help: "Masalan: futbolchi, uchuvchi, shifokor, muhandis, rassom...",
  q4Placeholder: "Masalan: uchuvchi...",
  q4NotYet: "Hali bu haqda o‘ylab ko‘rmagan",
  errChildDream: "Iltimos, orzusini yozing.",

  q4bTransition: "Mayli, hali oldinda vaqt ko‘p. 😊",
  q4b: (name) => `Siz ${name.trim()}ning kelajagini qanday tasavvur qilasiz?`,
  q4bHelp: (name) =>
    `${name.trim()} kelajakda qaysi kasb egasi bo‘lishini istashingizni yozishingiz mumkin. Yoki uning mehribon, halol, o‘ziga ishongan va o‘zi sevgan yo‘lini topgan inson bo‘lib ulg‘ayishini istashingizni yozing. Istasangiz, qalbingizdagi boshqa tilakni ham o‘z so‘zlaringiz bilan erkin yozishingiz mumkin.`,
  q4bPlaceholder:
    "Masalan: Shifokor bo‘lishini istardim. Eng muhimi, yaxshi inson bo‘lib, o‘zi sevgan yo‘lini topishini xohlayman...",
  q4BackToDream: "Aslida, orzusi bor",
  errAdultHope: "Iltimos, tilagingizni yozing.",

  pLoves: "QIZIQADI",
  pDetail: "AYNIQSA YOQADI",
  pAbsorbs: "BERILIB QILADI",
  pDreams: "ORZU QILADI",
  pHope: "SIZNING TILAGINGIZ",
  portraitEmpty: "Uni birga kashf etamiz.",

  milestoneHeading: (name) => `${name.trim()}ning dunyosiga ancha yaqinlashdik.`,
  milestoneBridge: (name) =>
    `Endi ${name.trim()}ning o‘ziga xos xarakterini yaxshiroq bilib olamiz.`,
  nextChildLead: (doneName) => `${doneName.trim()}ning dunyosiga ancha yaqinlashdik.`,
  nextChildBridge: (nextName) => `Endi ${nextName.trim()} bilan davom etamiz.`,
  nextChildCta: (nextName) => `${nextName.trim()} bilan tanishamiz`,
};

// ── English ──────────────────────────────────────────────────────
const en: Phase02Copy = {
  continue: "Continue",
  back: "Back",

  worldLabel: (name) => `${name.trim()}'s world`,

  q1Label: "INTERESTS",
  q1: (name) => `What especially interests ${name.trim()}?`,
  q1Help:
    "Think of what grabs their attention right away — something they love seeing, hearing about, or talking about.",
  customToggle: "Not on the list? Write your own",
  customPlaceholder: "For example: chess, planes, baking...",
  customAdd: "Add",
  interestLimitNote:
    "Two for now — remove one to make room for another.",
  removeInterest: (label) => `Remove “${label}”`,
  errInterests: "Please choose at least one, or write your own.",

  q2Label: "A CLOSER LOOK",
  q2: (name, interestsText) => `What exactly about ${interestsText} does ${name.trim()} enjoy most?`,
  q2Placeholder: "A few words is enough...",
  q2Skip: "We've got the main ones",

  q3Label: "FAVOURITE ACTIVITY",
  q3: (name) => `What does ${name.trim()} do that makes them lose all track of time?`,
  q3Help:
    "Think of the activity they get most absorbed in. For example: playing football, building LEGO cars, drawing, cycling, flipping through a book, or lining up their toys just so.",
  q3Placeholder: "For example: playing football in the yard, they lose all track of time...",
  q3None: "No single activity like that",
  errActivity: "Please write something, or choose “No single activity like that”.",

  q4Label: "DREAM",
  q4: (name) => `What does ${name.trim()} want to be when they grow up?`,
  q4Help: "For example: a footballer, a pilot, a doctor, an engineer, an artist...",
  q4Placeholder: "For example: a pilot...",
  q4NotYet: "They haven't thought about it yet",
  errChildDream: "Please write their dream.",

  q4bTransition: "That's alright — there's plenty of time ahead. 😊",
  q4b: (name) => `How do you picture ${name.trim()}'s future?`,
  q4bHelp: (name) =>
    `You're welcome to write which profession you'd hope ${name.trim()} might have. Or that you hope they grow up kind, honest, self-assured, and doing what they love. Feel free to write any other hope from the heart, in your own words too.`,
  q4bPlaceholder:
    "For example: I'd love for them to become a doctor. But most of all, I hope they grow into a good person who finds what they love...",
  q4BackToDream: "Actually, they do have a dream",
  errAdultHope: "Please write your hope.",

  pLoves: "INTERESTED IN",
  pDetail: "ESPECIALLY LIKES",
  pAbsorbs: "LOSES TIME IN",
  pDreams: "DREAMS OF",
  pHope: "YOUR HOPE",
  portraitEmpty: "We'll discover it together.",

  milestoneHeading: (name) => `We've come a long way into ${name.trim()}'s world.`,
  milestoneBridge: (name) =>
    `Now let's get to know ${name.trim()}'s own character a little better.`,
  nextChildLead: (doneName) => `We've come a long way into ${doneName.trim()}'s world.`,
  nextChildBridge: (nextName) => `Now let's carry on with ${nextName.trim()}.`,
  nextChildCta: (nextName) => `Meet ${nextName.trim()}`,
};

export const PHASE02_COPY: Record<Locale, Phase02Copy> = { uz, en };

export function phase02Copy(locale: string): Phase02Copy {
  return locale === "uz" ? uz : en;
}

// ── Natural summary — only from what the adult actually told us ───
export function composeSummary(child: ChildProfile, locale: Locale): string {
  const parts: string[] = [];
  const interests = (child.interests ?? []).map((v) => {
    const l = interestLabel(v, locale);
    return locale === "uz" ? l.toLocaleLowerCase("uz") : l.toLowerCase();
  });

  if (locale === "uz") {
    if (interests.length) parts.push(`${joinList(interests, "uz")}ni yaxshi ko‘radi`);
    if (child.interestDetail?.trim()) parts.push(child.interestDetail.trim());
    if (child.favoriteActivity?.trim() && !child.noFavoriteActivity) {
      parts.push(`ko‘proq berilib ketadigan mashg‘uloti — ${child.favoriteActivity.trim()}`);
    }
    if (child.dreamStatus === "has-dream" && child.childDream?.trim()) {
      parts.push(`bir kuni ${child.childDream.trim()} orzusida`);
    }
  } else {
    if (interests.length) parts.push(`loves ${joinList(interests, "en")}`);
    if (child.interestDetail?.trim()) parts.push(child.interestDetail.trim());
    if (child.favoriteActivity?.trim() && !child.noFavoriteActivity) {
      parts.push(`gets absorbed in ${child.favoriteActivity.trim()}`);
    }
    if (child.dreamStatus === "has-dream" && child.childDream?.trim()) {
      parts.push(`dreams of ${child.childDream.trim()}`);
    }
  }

  if (!parts.length) return "";
  const joined =
    locale === "uz"
      ? parts.length === 1
        ? parts[0]
        : parts.slice(0, -1).join(", ") + " va " + parts[parts.length - 1]
      : parts.length === 1
        ? parts[0]
        : parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
  const sentence = joined.charAt(0).toLocaleUpperCase() + joined.slice(1) + ".";
  return sentence;
}
