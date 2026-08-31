/**
 * TALIMOON — ORDER — Phase 02 ("The child's world") copy + helpers.
 * ================================================================
 * IN SCOPE: Uzbek + English (respectful "Siz" throughout). RU / AR
 * are added later; the shape below is ready for them.
 *
 * TALIMOON SAVOL BERMAYDI — SUHBAT OCHADI.
 * SAVOL CHUQUR BO‘LISHI MUMKIN — JAVOB BERISH HECH QACHON QIYIN
 * BO‘LMASLIGI KERAK.
 *
 * The conversation, per child: interests (≤ 2 primary, prepared or
 * the adult's own words) → an optional deepening detail → the
 * absorbing activity, in the adult's words → a dream, told either by
 * the child or, if they haven't thought about it, hoped by the adult.
 * Then a quiet portrait — "FAYZBEKNING DUNYOSI" — and a bridge toward
 * the child's character.
 */

import type { ChildProfile } from "./types";

export type Locale = "uz" | "en";

// ── Prepared interest categories ─────────────────────────────────
export const INTEREST_KEYS = [
  "sport",
  "cars",
  "art",
  "building",
  "books",
  "animals",
  "nature",
  "music",
] as const;
export type InterestKey = (typeof INTEREST_KEYS)[number];

export const MAX_PRIMARY_INTERESTS = 2;

const INTEREST_LABELS: Record<InterestKey, Record<Locale, string>> = {
  sport: { uz: "Sport", en: "Sport" },
  cars: { uz: "Mashinalar", en: "Cars" },
  art: { uz: "Rasm va ijod", en: "Art & making" },
  building: { uz: "Yasash va qurish", en: "Building" },
  books: { uz: "Kitoblar", en: "Books" },
  animals: { uz: "Hayvonlar", en: "Animals" },
  nature: { uz: "Tabiat", en: "Nature" },
  music: { uz: "Musiqa", en: "Music" },
};

export function isInterestKey(v: string): v is InterestKey {
  return (INTEREST_KEYS as readonly string[]).includes(v);
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

  worldLabel: (name: string) => string;
  introLead: (name: string) => string;
  introSupport: string;

  // Q1 — interests
  q1: (name: string) => string;
  q1Help: string;
  customToggle: string;
  customPlaceholder: string;
  customAdd: string;
  interestLimitNote: string;
  removeInterest: (label: string) => string;
  errInterests: string;

  // Q2 — deepen
  q2Ack: (interestsText: string) => string;
  q2: (name: string) => string;
  q2Placeholder: string;
  q2Skip: string;

  // Q3 — absorbing activity
  q3: (name: string) => string;
  q3Help: string;
  q3Placeholder: string;
  q3None: string;
  errActivity: string;

  // Q4 — dream
  q4Lead: (name: string) => string;
  q4: (name: string) => string;
  q4HasDream: string;
  q4NotYet: string;
  errDreamRoute: string;

  // Q4a — the child's dream
  q4a: (name: string) => string;
  q4aHelp: string;
  q4aPlaceholder: string;
  errChildDream: string;

  // Q4b — the adult's hope
  q4bTransition: string;
  q4bLead: string;
  q4b: (name: string) => string;
  q4bHelp: string;
  q4bExample: string;
  q4bPlaceholder: string;
  errAdultHope: string;

  // Portrait section labels
  pLoves: string;
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
  introLead: (name) => `Endi ${name.trim()}ning dunyosiga biroz yaqinlashamiz.`,
  introSupport:
    "Uni quvontiradigan, qiziqtiradigan va orzu qilishga undaydigan narsalarni birga eslab ko‘ramiz.",

  q1: (name) => `${name.trim()}ning ko‘zlari nimani ko‘rganda yonib ketadi? 😊`,
  q1Help:
    "Uni darrov qiziqtirib qo‘yadigan narsalardan 2 tagacha tanlashingiz mumkin — yoki ro‘yxatda bo‘lmasa, o‘zingiz ham yozishingiz mumkin.",
  customToggle: "Ro‘yxatda yo‘qmi? O‘zingiz yozing",
  customPlaceholder: "Masalan: shaxmat, samolyotlar, pishirish...",
  customAdd: "Qo‘shish",
  interestLimitNote:
    "Hozircha 2 tasi — birini olib tashlab, o‘rniga boshqasini qo‘shsangiz bo‘ladi.",
  removeInterest: (label) => `“${label}” ni olib tashlash`,
  errInterests: "Iltimos, kamida bittasini belgilang yoki yozing.",

  q2Ack: (t) => `${t}ni yaxshi ko‘rishini bildik.`,
  q2: (name) =>
    `Yana bir oz o‘ylab ko‘ring — ${name.trim()} haqida esdan chiqib qolgan yana bir muhim detal yo‘qmi?`,
  q2Placeholder:
    "Masalan: futbolda darvozabon bo‘lib o‘ynaydi, mashinalarning markalarini yoddan biladi...",
  q2Skip: "Asosiylarini esladik",

  q3: (name) => `${name.trim()} nimaga berilib ketsa, vaqtni ham unutadi?`,
  q3Help:
    "Masalan: futbol o‘ynash, LEGOdan mashina yasash, rasm chizish, velosiped minish yoki o‘yinchoqlarini birma-bir terib chiqish.",
  q3Placeholder: "Bir-ikki jumlada yozing...",
  q3None: "Aniq bir mashg‘uloti yo‘q",
  errActivity: "Iltimos, yozing yoki “Aniq bir mashg‘uloti yo‘q”ni tanlang.",

  q4Lead: (name) => `Bir kuni ${name.trim()} katta bo‘ladi...`,
  q4: (name) => `${name.trim()} katta bo‘lganda kim bo‘lmoqchi?`,
  q4HasDream: "Orzusi bor",
  q4NotYet: "Hali bu haqda o‘ylab ko‘rmagan",
  errDreamRoute: "Iltimos, birini tanlang.",

  q4a: (name) => `${name.trim()} kim bo‘lmoqchi?`,
  q4aHelp:
    "Masalan: futbolchi, shifokor, uchuvchi bo‘lishni yoki o‘z biznesini yaratishni... Kasb bo‘lishi shart emas — dunyoni sayohat qilish yoki odamlarga yordam berish ham bo‘ladi.",
  q4aPlaceholder: "Uning o‘z so‘zlari bilan yozing...",
  errChildDream: "Iltimos, orzusini yozing.",

  q4bTransition: "Mayli, hali oldinda vaqt ko‘p. 😊",
  q4bLead: "Unda Sizning tilagingizni eshitaylik.",
  q4b: (name) =>
    `Siz ${name.trim()} katta bo‘lganda kim bo‘lishini yoki qanday inson bo‘lib ulg‘ayishini istardingiz?`,
  q4bHelp:
    "Kasbni ham, qalbingizdagi tilakni ham yozishingiz mumkin. Bir-ikki jumla kifoya.",
  q4bExample:
    "Masalan: «Shifokor bo‘lishini istardim. Lekin eng muhimi — mehribon, halol va o‘zi sevgan yo‘lni topgan inson bo‘lib ulg‘aysin.»",
  q4bPlaceholder: "O‘z so‘zlaringiz bilan...",
  errAdultHope: "Iltimos, tilagingizni yozing.",

  pLoves: "QIZIQADI",
  pAbsorbs: "BERILIB KETADI",
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
  introLead: (name) => `Now let's get a little closer to ${name.trim()}'s world.`,
  introSupport:
    "Let's remember together the things that delight them, hold their attention, and give them something to dream about.",

  q1: (name) => `What makes ${name.trim()}'s eyes light up? 😊`,
  q1Help:
    "Pick up to 2 things that catch their attention right away — or, if it isn't on the list, write your own.",
  customToggle: "Not on the list? Write your own",
  customPlaceholder: "For example: chess, planes, baking...",
  customAdd: "Add",
  interestLimitNote:
    "Two for now — remove one to make room for another.",
  removeInterest: (label) => `Remove “${label}”`,
  errInterests: "Please choose at least one, or write your own.",

  q2Ack: (t) => `So they love ${t}.`,
  q2: (name) =>
    `Think for a moment — is there another small but telling detail about ${name.trim()} we haven't remembered yet?`,
  q2Placeholder:
    "For example: plays in goal at football, knows every car badge by heart...",
  q2Skip: "We've got the main ones",

  q3: (name) => `What does ${name.trim()} get so absorbed in that they lose track of time?`,
  q3Help:
    "For example: playing football, building LEGO cars, drawing, cycling, or lining up every toy one by one.",
  q3Placeholder: "A sentence or two...",
  q3None: "No single activity like that",
  errActivity: "Please write something, or choose “No single activity like that”.",

  q4Lead: (name) => `One day ${name.trim()} will grow up...`,
  q4: (name) => `What does ${name.trim()} want to be when they grow up?`,
  q4HasDream: "They have a dream",
  q4NotYet: "They haven't thought about it yet",
  errDreamRoute: "Please choose one.",

  q4a: (name) => `What does ${name.trim()} want to become?`,
  q4aHelp:
    "For example: a footballer, a doctor, a pilot, or to build their own business... It doesn't have to be a job — travelling the world or helping people counts too.",
  q4aPlaceholder: "In their own words...",
  errChildDream: "Please write their dream.",

  q4bTransition: "That's alright — there's plenty of time ahead. 😊",
  q4bLead: "Then let's hear your own hope.",
  q4b: (name) =>
    `What would you wish for ${name.trim()} — what they might become, or the kind of person they grow into?`,
  q4bHelp:
    "You can name a profession, or a wish from the heart. A sentence or two is enough.",
  q4bExample:
    "For example: “I'd love them to be a doctor. But most of all — to grow into someone kind, honest, and doing what they love.”",
  q4bPlaceholder: "In your own words...",
  errAdultHope: "Please write your hope.",

  pLoves: "LOVES",
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
