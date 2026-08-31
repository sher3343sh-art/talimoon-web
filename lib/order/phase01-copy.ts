/**
 * TALIMOON — ORDER — Phase 01 ("Siz bilan tanishamiz") copy.
 * ================================================================
 * All four site languages authored. Relationship-aware phrasing is
 * produced through `@/lib/order/relationship` — no global string
 * replacement, no Uzbek grammar baked into components.
 *
 * TONE LOCK (spec §1): TALIMOON always addresses the customer with
 * the respectful "Siz". Warm, courteous, adult. Not a survey.
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
  const and = { uz: " va ", en: " and ", ru: " и ", ar: " و", }[locale];
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
  eyebrow: string;
  continue: string;
  back: string;

  // 1 — name
  namePrimary: string;
  nameSupporting: string;
  nameQuestion: string;
  namePlaceholder: string;

  // 2 — acknowledgement
  ackGreeting: (name: string) => string;
  ackNext: string;

  // 3 — relationship
  relationshipQuestion: (name: string) => string;
  customLabelQuestion: string;
  customLabelPlaceholder: string;

  // 4 — child count
  countQuestion: (rel: RecipientRelationship) => string;
  countUnit: (n: number) => string;

  // 5 — child name + age
  childMoment: (index: number, total: number) => string;
  childNamePrompt: (index: number, total: number, rel: RecipientRelationship) => string;
  childNamePlaceholder: string;
  childAgeQuestion: (name: string) => string;
  otherAge: string;
  yearsSuffix: (age: number) => string;

  // 6 — transition out of Phase 01
  transitionOneChild: (name: string, age: number) => string;
  transitionOneChildSupport: (name: string) => string;
  transitionManyChildren: string;
  transitionManyChildrenNames: (names: string[]) => string;
  transitionManyChildrenSupport: string;
  transitionCta: (firstName: string) => string;

  // validation — human, gentle
  errName: string;
  errRelationship: string;
  errCustomLabel: string;
  errChildName: string;
  errAge: string;
  errAgeRange: string;

  /** Review-row label for the chosen relationship. */
  relationshipReviewLabel: (rel: RecipientRelationship) => string;
}

// ── Uzbek — the reference, richest relationship handling ──────────
const uz: Phase01Copy = {
  eyebrow: "SIZ BILAN TANISHAMIZ",
  continue: "Davom etish",
  back: "Orqaga",

  namePrimary: "Keling, avval Siz bilan tanishamiz.",
  nameSupporting:
    "Bu hikoyani kim uchun yaratayotganimizni bilishdan oldin, uni mehr bilan tayyorlayotgan insonni tanib olaylik.",
  nameQuestion: "Ismingiz qanday?",
  namePlaceholder: "Ismingizni yozing...",

  ackGreeting: (name) => `Tanishganimdan xursandman, ${name}.`,
  ackNext: "Endi eng muhim inson haqida gaplashamiz.",

  relationshipQuestion: (name) => `${name}, bu kitobni kim uchun tayyorlayapsiz?`,
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

  childMoment: (index, total) => {
    if (total === 1) return "Unda u bilan tanishamiz.";
    if (index === 0) return "Birinchi qahramonimiz kim?";
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

  transitionOneChild: (name, age) => `Demak, qahramonimiz — ${age} yoshli ${name}.`,
  transitionOneChildSupport: (name) =>
    `Endi ${name}ning o‘ziga xos dunyosiga biroz kirib ko‘ramiz.`,
  transitionManyChildren: "Ajoyib — qahramonlarimiz bilan tanishdik.",
  transitionManyChildrenNames: (names) => `${joinNames(names, "uz")}.`,
  transitionManyChildrenSupport:
    "Endi ularning har birini alohida yaxshiroq bilib olamiz.",
  transitionCta: (firstName) => `${firstName} bilan tanishamiz`,

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
  eyebrow: "GETTING TO KNOW YOU",
  continue: "Continue",
  back: "Back",

  namePrimary: "First, let's get to know you.",
  nameSupporting:
    "Before we learn who this story is for, we'd love to know the person preparing it with such care.",
  nameQuestion: "What's your name?",
  namePlaceholder: "Type your name...",

  ackGreeting: (name) => `Lovely to meet you, ${name}.`,
  ackNext: "Now, let's talk about the most important person.",

  relationshipQuestion: (name) => `${name}, who are you making this book for?`,
  customLabelQuestion: "Who are they to you?",
  customLabelPlaceholder: "For example: my cousin's child",

  countQuestion: () => "How many children will be the main characters of this story?",
  countUnit: (n) => `${n}`,

  childMoment: (index, total) => {
    if (total === 1) return "Then let's meet them.";
    if (index === 0) return "Who is our first character?";
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

  transitionOneChild: (name, age) => `So our hero is ${name}, age ${age}.`,
  transitionOneChildSupport: (name) => `Now let's step gently into ${name}'s own world.`,
  transitionManyChildren: "Wonderful — we've met our heroes.",
  transitionManyChildrenNames: (names) => `${joinNames(names, "en")}.`,
  transitionManyChildrenSupport: "Now let's get to know each of them a little better.",
  transitionCta: (firstName) => `Meet ${firstName}`,

  errName: "Please enter your name.",
  errRelationship: "Please choose one.",
  errCustomLabel: "Please add a few words.",
  errChildName: "Please enter their name.",
  errAge: "Please choose an age.",
  errAgeRange: "Please double-check the age.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "en"),
};

// ── Russian ──────────────────────────────────────────────────────
const ru: Phase01Copy = {
  eyebrow: "ЗНАКОМИМСЯ С ВАМИ",
  continue: "Продолжить",
  back: "Назад",

  namePrimary: "Сначала давайте познакомимся с Вами.",
  nameSupporting:
    "Прежде чем узнать, для кого эта история, нам хочется познакомиться с человеком, который готовит её с такой заботой.",
  nameQuestion: "Как Вас зовут?",
  namePlaceholder: "Напишите Ваше имя...",

  ackGreeting: (name) => `Очень приятно, ${name}.`,
  ackNext: "Теперь поговорим о самом важном человеке.",

  relationshipQuestion: (name) => `${name}, для кого Вы готовите эту книгу?`,
  customLabelQuestion: "Кем он(а) Вам приходится?",
  customLabelPlaceholder: "Например: ребёнок моего двоюродного брата",

  countQuestion: () => "Сколько детей станут главными героями этой истории?",
  countUnit: (n) => `${n}`,

  childMoment: (index, total) => {
    if (total === 1) return "Тогда давайте познакомимся.";
    if (index === 0) return "Кто наш первый герой?";
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

  transitionOneChild: (name, age) => `Итак, наш герой — ${name}, ${age} лет.`,
  transitionOneChildSupport: (name) =>
    `Теперь мягко заглянем в собственный мир ${name}.`,
  transitionManyChildren: "Прекрасно — мы познакомились с нашими героями.",
  transitionManyChildrenNames: (names) => `${joinNames(names, "ru")}.`,
  transitionManyChildrenSupport: "Теперь узнаем каждого из них немного лучше.",
  transitionCta: (firstName) => `Познакомиться с ${firstName}`,

  errName: "Пожалуйста, введите Ваше имя.",
  errRelationship: "Пожалуйста, выберите один вариант.",
  errCustomLabel: "Пожалуйста, добавьте несколько слов.",
  errChildName: "Пожалуйста, введите имя.",
  errAge: "Пожалуйста, выберите возраст.",
  errAgeRange: "Пожалуйста, проверьте возраст.",

  relationshipReviewLabel: (rel) => relationshipLabel(rel, "ru"),
};

// ── Arabic (RTL) ─────────────────────────────────────────────────
const ar: Phase01Copy = {
  eyebrow: "لِنَتَعَرَّفْ عَلَيْك",
  continue: "متابعة",
  back: "رجوع",

  namePrimary: "أولًا، دعنا نتعرّف عليك.",
  nameSupporting:
    "قبل أن نعرف لِمَن هذه القصة، يسعدنا أن نتعرّف على الشخص الذي يُعِدّها بكل هذا الحب.",
  nameQuestion: "ما اسمك؟",
  namePlaceholder: "اكتب اسمك...",

  ackGreeting: (name) => `سعدتُ بلقائك يا ${name}.`,
  ackNext: "الآن لنتحدّث عن أهمّ شخص.",

  relationshipQuestion: (name) => `${name}، لِمَن تُعِدّ هذا الكتاب؟`,
  customLabelQuestion: "ما صلته بك؟",
  customLabelPlaceholder: "مثال: ابن ابن عمّي",

  countQuestion: () => "كم عدد الأطفال الذين سيكونون أبطال هذه القصة؟",
  countUnit: (n) => `${n}`,

  childMoment: (index, total) => {
    if (total === 1) return "إذًا لنتعرّف عليه.";
    if (index === 0) return "من هو بطلنا الأول؟";
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
  childAgeQuestion: (name) =>
    name.trim() ? `كم عمر ${name.trim()}؟` : "كم عمره؟",
  otherAge: "عمر آخر",
  yearsSuffix: (age) => `${age} سنة`,

  transitionOneChild: (name, age) => `إذًا بطلنا هو ${name}، ${age} سنوات.`,
  transitionOneChildSupport: (name) => `الآن لندخل بهدوء إلى عالم ${name} الخاص.`,
  transitionManyChildren: "رائع — تعرّفنا على أبطالنا.",
  transitionManyChildrenNames: (names) => `${joinNames(names, "ar")}.`,
  transitionManyChildrenSupport: "الآن لنتعرّف على كلٍّ منهم بشكل أفضل.",
  transitionCta: (firstName) => `تعرّف على ${firstName}`,

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

// ── Journey chapters (progress rail) — used by Phase 01 and later ──
export interface Chapter {
  key: string;
  label: Record<Locale, string>;
}

export const JOURNEY_CHAPTERS: Chapter[] = [
  {
    key: "you",
    label: { uz: "Siz bilan tanishamiz", en: "Getting to know you", ru: "Знакомимся с Вами", ar: "لنتعرّف عليك" },
  },
  {
    key: "world",
    label: { uz: "Uning dunyosi", en: "Their world", ru: "Их мир", ar: "عالمه" },
  },
  {
    key: "wish",
    label: { uz: "Sizning tilagingiz", en: "Your wish", ru: "Ваше пожелание", ar: "أمنيتك" },
  },
  {
    key: "photos",
    label: { uz: "Suratlar", en: "Photos", ru: "Фотографии", ar: "الصور" },
  },
  {
    key: "review",
    label: { uz: "Ko‘rib chiqamiz", en: "Review", ru: "Проверяем", ar: "المراجعة" },
  },
  {
    key: "finish",
    label: { uz: "Yakun", en: "Finish", ru: "Завершение", ar: "الإنهاء" },
  },
];
