/**
 * TALIMOON — ORDER — Phase 03 ("The child's character") copy + helpers.
 * ================================================================
 * IN SCOPE: Uzbek + English (respectful "Siz"). RU / AR later.
 *
 * TALIMOON never asks "what is wrong with this child". It gathers,
 * respectfully: what the adult appreciates, a real moment it shows,
 * ONE behaviour they'd gently like to support, when it usually
 * appears, and the values the story should strengthen. No diagnosis,
 * no inference, no personality labels. A behaviour is described —
 * the child is never defined by it.
 */

import type { ChildProfile } from "./types";

export type Locale = "uz" | "en";

// ── Appreciated qualities ────────────────────────────────────────
export const QUALITY_KEYS = [
  "kind",
  "curious",
  "hardworking",
  "brave",
  "responsible",
  "sincere",
  "patient",
  "quick-minded",
] as const;
export type QualityKey = (typeof QUALITY_KEYS)[number];
export const MAX_QUALITIES = 3;

const QUALITY_LABELS: Record<QualityKey, Record<Locale, string>> = {
  kind: { uz: "Mehribon", en: "Kind" },
  curious: { uz: "Qiziquvchan", en: "Curious" },
  hardworking: { uz: "Tirishqoq", en: "Hard-working" },
  brave: { uz: "Jasur", en: "Brave" },
  responsible: { uz: "Mas’uliyatli", en: "Responsible" },
  sincere: { uz: "Samimiy", en: "Sincere" },
  patient: { uz: "Sabrli", en: "Patient" },
  "quick-minded": { uz: "Zehni o‘tkir", en: "Quick-minded" },
};

// ── Growth behaviours ────────────────────────────────────────────
// `full`  — what the adult picks (a behaviour, never a label)
// `soft`  — the dignified word shown in the portrait
export const GROWTH_KEYS = [
  "waiting",
  "temper",
  "upset",
  "finishing",
  "order",
  "sharing",
  "confidence",
] as const;
export type GrowthKey = (typeof GROWTH_KEYS)[number];

const GROWTH: Record<GrowthKey, { full: Record<Locale, string>; soft: Record<Locale, string> }> = {
  waiting: {
    full: { uz: "Sabr qilishga qiynaladi", en: "Finds it hard to wait" },
    soft: { uz: "Sabr", en: "Patience" },
  },
  temper: {
    full: { uz: "Xohlagani bo‘lmasa tez jahli chiqadi", en: "Gets frustrated when things don't go their way" },
    soft: { uz: "Xotirjamlik", en: "Staying calm" },
  },
  upset: {
    full: { uz: "Tez xafa bo‘ladi", en: "Gets upset easily" },
    soft: { uz: "Bardosh", en: "Resilience" },
  },
  finishing: {
    full: { uz: "Boshlagan ishini oxiriga yetkazishga qiynaladi", en: "Finds it hard to finish what they start" },
    soft: { uz: "Ishni yakunlash", en: "Following through" },
  },
  order: {
    full: { uz: "Tartibga rioya qilishga qiynaladi", en: "Finds it hard to keep to routines" },
    soft: { uz: "Tartib", en: "Routine" },
  },
  sharing: {
    full: { uz: "Boshqalar bilan bo‘lishishga qiynaladi", en: "Finds sharing hard" },
    soft: { uz: "Baham ko‘rish", en: "Sharing" },
  },
  confidence: {
    full: { uz: "Ba’zan o‘ziga ishonchi yetmay qoladi", en: "Sometimes lacks self-belief" },
    soft: { uz: "O‘ziga ishonch", en: "Self-belief" },
  },
};

// ── Desired values ──────────────────────────────────────────────
export const VALUE_KEYS = [
  "patience",
  "gratitude",
  "manners",
  "responsibility",
  "courage",
  "compassion",
  "purity",
] as const;
export type ValueKey = (typeof VALUE_KEYS)[number];
export const MAX_VALUES = 3;

const VALUE_LABELS: Record<ValueKey, Record<Locale, string>> = {
  patience: { uz: "Sabr", en: "Patience" },
  gratitude: { uz: "Shukr", en: "Gratitude" },
  manners: { uz: "Odob", en: "Good manners" },
  responsibility: { uz: "Mas’uliyat", en: "Responsibility" },
  courage: { uz: "Jasorat", en: "Courage" },
  compassion: { uz: "Mehr-shafqat", en: "Compassion" },
  purity: { uz: "Poklik", en: "Purity" },
};

// ── Lookups ─────────────────────────────────────────────────────
export function isQualityKey(v: string): v is QualityKey {
  return (QUALITY_KEYS as readonly string[]).includes(v);
}
export function isGrowthKey(v: string): v is GrowthKey {
  return (GROWTH_KEYS as readonly string[]).includes(v);
}
export function isValueKey(v: string): v is ValueKey {
  return (VALUE_KEYS as readonly string[]).includes(v);
}
export function qualityLabel(v: string, locale: Locale): string {
  return isQualityKey(v) ? QUALITY_LABELS[v][locale] : v.trim();
}
export function valueLabel(v: string, locale: Locale): string {
  return isValueKey(v) ? VALUE_LABELS[v][locale] : v.trim();
}
/** Full text the adult chose. */
export function growthFull(v: string, locale: Locale): string {
  return isGrowthKey(v) ? GROWTH[v].full[locale] : v.trim();
}
/** Dignified word for the portrait. Custom text is shown as written. */
export function growthSoft(v: string, locale: Locale): string {
  return isGrowthKey(v) ? GROWTH[v].soft[locale] : v.trim();
}

export function qualityOptions(locale: Locale) {
  return QUALITY_KEYS.map((key) => ({ key, label: QUALITY_LABELS[key][locale] }));
}
export function growthOptions(locale: Locale) {
  return GROWTH_KEYS.map((key) => ({ key, label: GROWTH[key].full[locale] }));
}
export function valueOptions(locale: Locale) {
  return VALUE_KEYS.map((key) => ({ key, label: VALUE_LABELS[key][locale] }));
}

function joinList(items: string[], locale: Locale): string {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  const and = locale === "uz" ? " va " : " and ";
  return clean.slice(0, -1).join(", ") + and + clean[clean.length - 1];
}
export function qualitiesDisplay(list: string[] | undefined, locale: Locale): string {
  return (list ?? []).map((v) => qualityLabel(v, locale)).join(" · ");
}
export function valuesDisplay(list: string[] | undefined, locale: Locale): string {
  return (list ?? []).map((v) => valueLabel(v, locale)).join(" · ");
}

// ── Copy ─────────────────────────────────────────────────────────
export interface Phase03Copy {
  continue: string;
  back: string;

  charLabel: (name: string) => string;
  introLead: (name: string) => string;
  introSupport: string;

  // Q1 — appreciated qualities
  q1: (name: string) => string;
  q1Help: string;
  customToggle: string;
  customPlaceholder: string;
  customAdd: string;
  limitNote: (max: number) => string;
  removeItem: (label: string) => string;
  errQualities: string;

  // Q2 — a real example
  q2Ack: (qualitiesText: string) => string;
  q2: (name: string) => string;
  q2Help: string;
  q2Placeholder: string;
  q2Skip: string;

  // Q3 — one growth behaviour
  q3: (name: string) => string;
  q3Help: string;
  q3CustomToggle: string;
  q3CustomPlaceholder: string;
  q3CustomHint: string;
  q3None: string;
  errGrowth: string;

  // Q4 — context
  q4: (name: string) => string;
  q4Help: string;
  q4Placeholder: string;
  q4Skip: string;

  // Q5 — desired values
  q5: (name: string) => string;
  q5Help: string;
  errValues: string;

  // Portrait labels
  pQualities: string;
  pGrowth: string;
  pValues: string;

  // Milestone
  milestoneHeading: (name: string) => string;
  milestoneBridge: string;
  nextChildLead: (doneName: string) => string;
  nextChildBridge: (nextName: string) => string;
  nextChildCta: (nextName: string) => string;
}

const uz: Phase03Copy = {
  continue: "Davom etish",
  back: "Orqaga",

  charLabel: (name) => `${name.trim()}ning xarakteri`,
  introLead: (name) => `Endi ${name.trim()}ning o‘ziga xos xarakterini yaxshiroq bilib olamiz.`,
  introSupport:
    "Uni nimalari quvontiradi, qaysi jihat biroz e’tibor so‘raydi va hikoya nimalarni qo‘llab-quvvatlashi kerak — shularni birga eslaymiz.",

  q1: (name) => `${name.trim()}ning qaysi jihatlari Sizni ayniqsa quvontiradi?`,
  q1Help:
    "Uni eng yaxshi ifodalaydigan 3 tagacha jihatni tanlashingiz mumkin — yoki ro‘yxatda bo‘lmasa, o‘zingiz yozishingiz mumkin.",
  customToggle: "Ro‘yxatda yo‘qmi? O‘zingiz yozing",
  customPlaceholder: "Masalan: xushmuomala, adolatli, tashabbuskor...",
  customAdd: "Qo‘shish",
  limitNote: (max) => `Hozircha ${max} tasi — birini olib tashlab, o‘rniga boshqasini qo‘shsangiz bo‘ladi.`,
  removeItem: (label) => `“${label}” ni olib tashlash`,
  errQualities: "Davom etishdan oldin uni ifodalaydigan kamida bitta jihatni tanlang.",

  q2Ack: (t) => `${t} — tushundik.`,
  q2: (name) => `Buni ${name.trim()}da qaysi paytlarda ko‘proq sezasiz?`,
  q2Help:
    "Xayolingizga bir voqea kelsa yozing — bu hikoyani yanada shaxsiy qiladi.",
  q2Placeholder:
    "Masalan: ukasiga yordam beradi, o‘yinchoqlarini bo‘lishadi, kimdir xafa bo‘lsa yoniga boradi...",
  q2Skip: "Hozircha bir misol yodimda yo‘q",

  q3: (name) => `${name.trim()}ning qaysi odati yoki xatti-harakatini biroz yaxshilashni istardingiz?`,
  q3Help:
    "Hikoyada bunga tanbeh bilan emas, voqealar orqali muloyim yo‘l ko‘rsatamiz. Bittasini tanlang.",
  q3CustomToggle: "Boshqacha bo‘lsa, o‘zingiz yozing",
  q3CustomPlaceholder:
    "Masalan: yutqazsa tez xafa bo‘ladi, ertalab turishga erinadi...",
  q3CustomHint: "Bolaning o‘zini emas, odat yoki vaziyatni yozing.",
  q3None: "Hozircha alohida e’tibor beradigan jihat yo‘q",
  errGrowth: "Iltimos, birini tanlang yoki “Hozircha alohida e’tibor beradigan jihat yo‘q”ni belgilang.",

  q4: (name) => `Bu ${name.trim()}da ko‘proq qaysi paytlarda seziladi?`,
  q4Help:
    "Faqat qachon va qaysi vaziyatda — sababini izlashimiz shart emas.",
  q4Placeholder:
    "Masalan: navbat kutganda, o‘yinda yutqazganda yoki xohlagan narsasi darrov bo‘lmaganda...",
  q4Skip: "Aniq bir vaziyat yo‘q",

  q5: (name) => `Hikoya orqali ${name.trim()}da qaysi qadriyatlarni yanada qo‘llab-quvvatlashni istardingiz?`,
  q5Help:
    "Bu fazilatlar unda allaqachon bo‘lishi mumkin — hikoya ularni yanada mustahkamlashga xizmat qiladi. 3 tagacha.",
  errValues: "Iltimos, kamida bitta qadriyatni tanlang.",

  pQualities: "SIZNI QUVONTIRADIGAN JIHATLARI",
  pGrowth: "RIVOJLANTIRAMIZ",
  pValues: "HIKOYADA QO‘LLAB-QUVVATLAYMIZ",

  milestoneHeading: (name) => `${name.trim()}ni endi yanada yaxshiroq taniyapmiz.`,
  milestoneBridge: "Endi hikoyaga bir necha shaxsiy jozibalar qo‘shamiz.",
  nextChildLead: (doneName) => `${doneName.trim()}ni endi yanada yaxshiroq taniyapmiz.`,
  nextChildBridge: (nextName) => `Endi ${nextName.trim()} bilan davom etamiz.`,
  nextChildCta: (nextName) => `${nextName.trim()} bilan davom etamiz`,
};

const en: Phase03Copy = {
  continue: "Continue",
  back: "Back",

  charLabel: (name) => `${name.trim()}'s character`,
  introLead: (name) => `Now let's get to know ${name.trim()}'s own character a little better.`,
  introSupport:
    "What delights you about them, what could use a little gentle guidance, and what the story should strengthen — let's remember it together.",

  q1: (name) => `What do you especially love about ${name.trim()}?`,
  q1Help:
    "Choose up to 3 things that describe them best — or, if it isn't on the list, write your own.",
  customToggle: "Not on the list? Write your own",
  customPlaceholder: "For example: thoughtful, fair, full of initiative...",
  customAdd: "Add",
  limitNote: (max) => `${max} for now — remove one to make room for another.`,
  removeItem: (label) => `Remove “${label}”`,
  errQualities: "Please choose at least one thing that describes them before continuing.",

  q2Ack: (t) => `${t} — noted.`,
  q2: (name) => `When do you notice this most in ${name.trim()}?`,
  q2Help: "If a moment comes to mind, share it — it makes the story more personal.",
  q2Placeholder:
    "For example: helps their little brother, shares their toys, goes over when someone is upset...",
  q2Skip: "No example comes to mind right now",

  q3: (name) => `Is there a habit or behaviour of ${name.trim()}'s you'd gently like to support?`,
  q3Help:
    "In the story we won't scold — we'll show a gentle way through events. Pick one.",
  q3CustomToggle: "Something else? Write your own",
  q3CustomPlaceholder:
    "For example: gets upset when they lose, is reluctant to get up in the morning...",
  q3CustomHint: "Describe the habit or the situation, not the child.",
  q3None: "Nothing in particular for now",
  errGrowth: "Please choose one, or select “Nothing in particular for now”.",

  q4: (name) => `When does this usually show with ${name.trim()}?`,
  q4Help: "Just when and in what situation — we don't need to look for a reason.",
  q4Placeholder:
    "For example: when waiting in line, when losing a game, or when something isn't available right away...",
  q4Skip: "No particular situation",

  q5: (name) => `Which values would you like the story to strengthen in ${name.trim()}?`,
  q5Help:
    "They may already have these — the story simply helps make them stronger. Up to 3.",
  errValues: "Please choose at least one value.",

  pQualities: "WHAT YOU LOVE IN THEM",
  pGrowth: "GROWING TOWARD",
  pValues: "THE STORY WILL STRENGTHEN",

  milestoneHeading: (name) => `We know ${name.trim()} a little better now.`,
  milestoneBridge: "Now let's add a few personal touches to the story.",
  nextChildLead: (doneName) => `We know ${doneName.trim()} a little better now.`,
  nextChildBridge: (nextName) => `Now let's carry on with ${nextName.trim()}.`,
  nextChildCta: (nextName) => `Carry on with ${nextName.trim()}`,
};

export const PHASE03_COPY: Record<Locale, Phase03Copy> = { uz, en };
export function phase03Copy(locale: string): Phase03Copy {
  return locale === "uz" ? uz : en;
}

// ── Natural summary — ONLY from supplied answers, no psychology ───
export function composeCharSummary(child: ChildProfile, name: string, locale: Locale): string {
  const q = (child.appreciatedQualities ?? []).map((v) => {
    const l = qualityLabel(v, locale);
    return locale === "uz" ? l.toLocaleLowerCase("uz") : l.toLowerCase();
  });
  const vals = (child.desiredValues ?? []).map((v) => {
    const l = valueLabel(v, locale);
    return locale === "uz" ? l.toLocaleLowerCase("uz") : l.toLowerCase();
  });
  const nm = name.trim();
  const parts: string[] = [];

  if (locale === "uz") {
    if (q.length) parts.push(`${nm}ning ${joinList(q, "uz")} tomonlarini bildik.`);
    if (child.qualityExample?.trim()) parts.push(child.qualityExample.trim().replace(/\.?$/, "."));
    if (vals.length)
      parts.push(
        `Hikoyada esa ${joinList(vals, "uz")}ni tabiiy voqealar orqali yanada qo‘llab-quvvatlaymiz.`,
      );
  } else {
    if (q.length) parts.push(`We've seen ${nm}'s ${joinList(q, "en")} side.`);
    if (child.qualityExample?.trim()) parts.push(child.qualityExample.trim().replace(/\.?$/, "."));
    if (vals.length)
      parts.push(`In the story we'll gently strengthen ${joinList(vals, "en")}.`);
  }
  return parts.join(" ");
}
