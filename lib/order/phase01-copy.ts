/**
 * TALIMOON — ORDER — Phase 01 ("Siz bilan tanishamiz") copy.
 * ================================================================
 * IN SCOPE: Uzbek + English (spec §4). Russian / Arabic keys are
 * kept so the wider localisation infrastructure doesn't break, with
 * sensible equivalents — not the focus of this pass.
 *
 * TONE LOCK: TALIMOON greets the customer, then addresses them with
 * the respectful "Siz" and their chosen honorific. Warm, courteous,
 * adult. Not a survey. (spec §1–3)
 *
 * Relationship-aware phrasing comes from `@/lib/order/relationship`
 * — no global string replacement, no Uzbek grammar in components.
 */

import type { Locale } from "@/lib/journey/types";
import {
  possessiveNoun,
  relationshipLabel,
  usesNeutralCount,
  type RecipientRelationship,
} from "./relationship";

function capitalize(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s;
}

/** Join names as "A, B and C" per locale. */
function joinNames(names: string[], locale: Locale): string {
  const clean = names.map((n) => n.trim()).filter(Boolean);
  if (clean.length <= 1) return clean[0] ?? "";
  const last = clean[clean.length - 1];
  const head = clean.slice(0, -1).join(", ");
  const and = { uz: " va ", en: " and ", ru: " и ", ar: " و" }[locale];
  return `${head}${and}${last}`;
}

const UZ_ORDINALS = [
  "birinchi",
  "ikkinchi",
  "uchinchi",
  "to‘rtinchi",
  "beshinchi",
  "oltinchi",
];
const EN_ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth"];
const RU_ORDINALS = ["первый", "второй", "третий", "четвёртый", "пятый", "шестой"];
const AR_ORDINALS = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"];

export interface Phase01Copy {
  continue: string;
  back: string;

  // 1 — welcome + identity (one scene: greeting, honorific, name)
  greetingPrimary: string;
  greetingWelcome: string;
  greetingLead: string;
  addressQuestion: string;
  namePlaceholder: string;

  // 2 — relationship (the acknowledgement is the lead-in here now)
  ackLine: (respectfulName: string) => string;
  relationshipQuestion: string;
  customLabelQuestion: string;
  customLabelPlaceholder: string;

  // 3 — child count
  countQuestion: (rel: RecipientRelationship) => string;
  countUnit: (n: number) => string;

  // 4 — child name + age ("meeting a character")
  /** Conversational scene heading — never just the bare name; once the
   *  name is typed it is woven in naturally. */
  childMoment: (index: number, total: number, name: string) => string;
  childNamePrompt: (index: number, total: number, rel: RecipientRelationship) => string;
  childNamePlaceholder: string;
  childAgeQuestion: (name: string) => string;
  otherAge: string;
  yearsSuffix: (age: number) => string;

  // 5 — the completion milestone
  completionOneChild: (name: string, age: number) => string;
  completionOneChildSupport: (name: string) => string;
  completionManyHeading: string;
  completionManyNames: (names: string[]) => string;
  completionManySupport: string;
  transitionCta: (firstName: string) => string;

  // validation — human, gentle, shown only after an attempt
  errHonorific: string;
  errName: string;
  errRelationship: string;
  errCustomLabel: string;
  errChildName: string;
  errAge: string;
  errAgeRange: string;

  relationshipReviewLabel: (rel: RecipientRelationship) => string;
}

// ── Uzbek ────────────────────────────────────────────────────────
const uz: Phase01Copy = {
  continue: "Davom etish",
  back: "Orqaga",

  greetingPrimary: "Assalomu alaykum.",
  greetingWelcome: "TALIMOONga xush kelibsiz.",
  greetingLead: "Keling, avval Siz bilan tanishamiz.",
  addressQuestion: "Sizga qanday murojaat qilsak bo‘ladi?",
  namePlaceholder: "Ismingizni yozing...",

  ackLine: (rn) => `Tanishganimdan xursandman, ${rn}.`,
  relationshipQuestion: "Bu kitobni kim uchun tayyorlayapsiz?",
  customLabelQuestion: "U Sizga kim bo‘ladi?",
  customLabelPlaceholder: "Masalan: amakivachchamning farzandi",

  countQuestion: (rel) => {
    if (usesNeutralCount(rel, "uz")) {
      return "Bu hikoyaning nechta asosiy qahramoni bo‘ladi?";
    }
    const noun = possessiveNoun(rel, "uz")!;
    return `Nechta ${noun} bu hikoyaning bosh qahramoni bo‘ladi?`;
  },
  countUnit: (n) => `${n} ta`,

  childMoment: (index, total, name) => {
    const nm = name.trim();
    if (nm) {
      return index === 0
        ? `${nm} bilan tanishamiz.`
        : `Endi ${nm} bilan tanishamiz.`;
    }
    if (total === 1) return "Unda qahramonimiz bilan tanishamiz.";
    if (index === 0) return "Birinchi qahramonimiz bilan tanishamiz.";
    if (index === total - 1) return "Yana bittasi qoldi 😊";
    return `Endi ${UZ_ORDINALS[index]} qahramonimiz bilan tanishamiz.`;
  },
  childNamePrompt: (index, total, rel) => {
    if (total > 1) return "Ismi";
    const noun = possessiveNoun(rel, "uz");
    if (noun) return `${capitalize(noun)}ning ismi nima?`;
    return "Qahramonimizning ismi nima?";
  },
  childNamePlaceholder: "Ismini yozing...",
  childAgeQuestion: (name) =>
    name.trim() ? `${name.trim()} necha yoshda?` : "Necha yoshda?",
  otherAge: "Boshqa yosh",
  yearsSuffix: (age) => `${age} yosh`,

  completionOneChild: (name, age) => `Demak, qahramonimiz — ${age} yoshli ${name}.`,
  completionOneChildSupport: (name) =>
    `Endi ${name}ning o‘ziga xos dunyosini yaxshiroq bilib olamiz.`,
  completionManyHeading: "Qahramonlarimiz bilan tanishdik.",
  completionManyNames: (names) => joinNames(names, "uz"),
  completionManySupport:
    "Endi ularning har birining o‘ziga xos dunyosini yaxshiroq bilib olamiz.",
  transitionCta: (firstName) => `${firstName} bilan tanishamiz`,

  errHonorific: "Iltimos, murojaat shaklini tanlang.",
  errName: "Iltimos, ismingizni kiriting.",
  errRelationship: "Iltimos, birini tanlang.",
  errCustomLabel: "Iltimos, bir necha so‘z bilan yozing.",
  errChildName: "Iltimos, ismini kiriting.",
  errAge: "Yoshni tanlang, iltimos.",
  errAgeRange: "Yoshni tekshirib ko‘ring, iltimos.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "uz"),
};

// ── English ──────────────────────────────────────────────────────
const en: Phase01Copy = {
  continue: "Continue",
  back: "Back",

  greetingPrimary: "Hello.",
  greetingWelcome: "Welcome to TALIMOON.",
  greetingLead: "First, let's get to know you.",
  addressQuestion: "How may we address you?",
  namePlaceholder: "Type your name...",

  ackLine: (rn) => `It's a pleasure to meet you, ${rn}.`,
  relationshipQuestion: "Who are you making this book for?",
  customLabelQuestion: "Who are they to you?",
  customLabelPlaceholder: "For example: my cousin's child",

  countQuestion: () => "How many children will be the main characters of this story?",
  countUnit: (n) => `${n}`,

  childMoment: (index, total, name) => {
    const nm = name.trim();
    if (nm) {
      return index === 0 ? `Let's meet ${nm}.` : `Now, let's meet ${nm}.`;
    }
    if (total === 1) return "Then let's meet them.";
    if (index === 0) return "Let's meet our first character.";
    if (index === total - 1) return "Just one more 😊";
    return `Now let's meet the ${EN_ORDINALS[index]} character.`;
  },
  childNamePrompt: (index, total, rel) => {
    if (total > 1) return "Name";
    const noun = possessiveNoun(rel, "en");
    if (noun) return `What is ${noun}'s name?`;
    return "What is their name?";
  },
  childNamePlaceholder: "Type their name...",
  childAgeQuestion: (name) =>
    name.trim() ? `How old is ${name.trim()}?` : "How old are they?",
  otherAge: "Another age",
  yearsSuffix: (age) => `${age} years old`,

  completionOneChild: (name, age) => `So our hero is ${name}, age ${age}.`,
  completionOneChildSupport: (name) =>
    `Now let's get to know ${name}'s own world a little better.`,
  completionManyHeading: "We've met our heroes.",
  completionManyNames: (names) => joinNames(names, "en"),
  completionManySupport:
    "Now let's get to know each of their worlds a little better.",
  transitionCta: (firstName) => `Meet ${firstName}`,

  errHonorific: "Please choose a form of address.",
  errName: "Please enter your name.",
  errRelationship: "Please choose one.",
  errCustomLabel: "Please add a few words.",
  errChildName: "Please enter their name.",
  errAge: "Please choose an age.",
  errAgeRange: "Please double-check the age.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "en"),
};

// ── Russian (infra parity, not this pass's focus) ────────────────
const ru: Phase01Copy = {
  continue: "Продолжить",
  back: "Назад",

  greetingPrimary: "Здравствуйте.",
  greetingWelcome: "Рады видеть Вас в TALIMOON.",
  greetingLead: "Сначала давайте познакомимся с Вами.",
  addressQuestion: "Как к Вам можно обращаться?",
  namePlaceholder: "Напишите Ваше имя...",

  ackLine: (rn) => `Очень приятно, ${rn}.`,
  relationshipQuestion: "Для кого Вы готовите эту книгу?",
  customLabelQuestion: "Кем он(а) Вам приходится?",
  customLabelPlaceholder: "Например: ребёнок моего двоюродного брата",

  countQuestion: () => "Сколько детей станут главными героями этой истории?",
  countUnit: (n) => `${n}`,

  childMoment: (index, total, name) => {
    const nm = name.trim();
    if (nm) return index === 0 ? `Знакомимся с ${nm}.` : `Теперь знакомимся с ${nm}.`;
    if (total === 1) return "Тогда давайте познакомимся.";
    if (index === 0) return "Знакомимся с нашим первым героем.";
    if (index === total - 1) return "Остался ещё один 😊";
    return `Теперь познакомимся с ${RU_ORDINALS[index]} героем.`;
  },
  childNamePrompt: (index, total, rel) => {
    if (total > 1) return "Имя";
    const noun = possessiveNoun(rel, "ru");
    if (noun) return `Как зовут ${noun === "ваш ребёнок" ? "Вашего ребёнка" : noun}?`;
    return "Как его(её) зовут?";
  },
  childNamePlaceholder: "Напишите имя...",
  childAgeQuestion: (name) =>
    name.trim() ? `Сколько лет ${name.trim()}?` : "Сколько ему(ей) лет?",
  otherAge: "Другой возраст",
  yearsSuffix: (age) => `${age} лет`,

  completionOneChild: (name, age) => `Итак, наш герой — ${name}, ${age} лет.`,
  completionOneChildSupport: (name) =>
    `Теперь узнаем собственный мир ${name} немного лучше.`,
  completionManyHeading: "Мы познакомились с нашими героями.",
  completionManyNames: (names) => joinNames(names, "ru"),
  completionManySupport: "Теперь узнаем мир каждого из них немного лучше.",
  transitionCta: (firstName) => `Познакомиться с ${firstName}`,

  errHonorific: "Пожалуйста, выберите форму обращения.",
  errName: "Пожалуйста, введите Ваше имя.",
  errRelationship: "Пожалуйста, выберите один вариант.",
  errCustomLabel: "Пожалуйста, добавьте несколько слов.",
  errChildName: "Пожалуйста, введите имя.",
  errAge: "Пожалуйста, выберите возраст.",
  errAgeRange: "Пожалуйста, проверьте возраст.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "ru"),
};

// ── Arabic (infra parity, not this pass's focus) ────────────────
const ar: Phase01Copy = {
  continue: "متابعة",
  back: "رجوع",

  greetingPrimary: "أهلًا وسهلًا.",
  greetingWelcome: "يسعدنا وجودك في TALIMOON.",
  greetingLead: "أولًا، دعنا نتعرّف عليك.",
  addressQuestion: "كيف نخاطبك؟",
  namePlaceholder: "اكتب اسمك...",

  ackLine: (rn) => `سعدتُ بلقائك يا ${rn}.`,
  relationshipQuestion: "لِمَن تُعِدّ هذا الكتاب؟",
  customLabelQuestion: "ما صلته بك؟",
  customLabelPlaceholder: "مثال: ابن ابن عمّي",

  countQuestion: () => "كم عدد الأطفال الذين سيكونون أبطال هذه القصة؟",
  countUnit: (n) => `${n}`,

  childMoment: (index, total, name) => {
    const nm = name.trim();
    if (nm) return index === 0 ? `لنتعرّف على ${nm}.` : `الآن لنتعرّف على ${nm}.`;
    if (total === 1) return "إذًا لنتعرّف عليه.";
    if (index === 0) return "لنتعرّف على بطلنا الأول.";
    if (index === total - 1) return "بقي واحد فقط 😊";
    return `الآن لنتعرّف على البطل ${AR_ORDINALS[index]}.`;
  },
  childNamePrompt: (index, total, rel) => {
    if (total > 1) return "الاسم";
    const noun = possessiveNoun(rel, "ar");
    if (noun) return `ما اسم ${noun}؟`;
    return "ما اسمه؟";
  },
  childNamePlaceholder: "اكتب الاسم...",
  childAgeQuestion: (name) => (name.trim() ? `كم عمر ${name.trim()}؟` : "كم عمره؟"),
  otherAge: "عمر آخر",
  yearsSuffix: (age) => `${age} سنة`,

  completionOneChild: (name, age) => `إذًا بطلنا هو ${name}، ${age} سنوات.`,
  completionOneChildSupport: (name) => `الآن لنتعرّف على عالم ${name} الخاص بشكل أفضل.`,
  completionManyHeading: "تعرّفنا على أبطالنا.",
  completionManyNames: (names) => joinNames(names, "ar"),
  completionManySupport: "الآن لنتعرّف على عالم كلٍّ منهم بشكل أفضل.",
  transitionCta: (firstName) => `تعرّف على ${firstName}`,

  errHonorific: "من فضلك اختر صيغة المخاطبة.",
  errName: "من فضلك أدخل اسمك.",
  errRelationship: "من فضلك اختر واحدًا.",
  errCustomLabel: "من فضلك أضف بضع كلمات.",
  errChildName: "من فضلك أدخل الاسم.",
  errAge: "من فضلك اختر العمر.",
  errAgeRange: "من فضلك تحقّق من العمر.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "ar"),
};

export const PHASE01_COPY: Record<Locale, Phase01Copy> = { uz, en, ru, ar };

export function phase01Copy(locale: Locale): Phase01Copy {
  return PHASE01_COPY[locale] ?? en;
}

// ── Journey chapters (progress rail) — Phase 01 is chapter 0 ──────
export interface Chapter {
  key: string;
  label: Record<Locale, string>;
}

export const JOURNEY_CHAPTERS: Chapter[] = [
  {
    key: "you",
    label: { uz: "Siz bilan tanishamiz", en: "Getting to know you", ru: "Знакомство", ar: "لنتعرّف عليك" },
  },
  {
    key: "world",
    label: { uz: "Uning dunyosi", en: "Their world", ru: "Их мир", ar: "عالمه" },
  },
  {
    key: "character",
    label: { uz: "Xarakteri", en: "Character", ru: "Характер", ar: "الشخصية" },
  },
  {
    key: "photos",
    label: { uz: "Suratlar", en: "Photos", ru: "Фотографии", ar: "الصور" },
  },
  {
    key: "review",
    label: { uz: "Ko‘rib chiqamiz", en: "Review", ru: "Проверка", ar: "المراجعة" },
  },
  {
    key: "finish",
    label: { uz: "Yakun", en: "Finish", ru: "Завершение", ar: "الإنهاء" },
  },
];
