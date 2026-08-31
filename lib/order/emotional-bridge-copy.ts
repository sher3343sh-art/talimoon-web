/**
 * TALIMOON — ORDER — "Yuragingizda qolgan gaplar" (the emotional
 * bridge) copy + helpers.
 * ================================================================
 * IN SCOPE: Uzbek + English (respectful "Siz"). RU / AR fall back to
 * English, matching the other later phases.
 *
 * This section is NOT only for conflict, divorce or a family problem.
 * It fits, just as naturally: a parent working abroad; travel or
 * long-distance separation; work leaving less time together; a
 * grandparent living far away; an adult who simply finds feelings
 * hard to say; a parent who wants to say they are proud — as well as
 * emotional distance, an argument, or another delicate situation.
 *
 * The adult explains the real situation privately. TALIMOON never
 * copies difficult adult detail into the child's story. The future
 * story carries only the SAFE emotional meaning behind it — love,
 * longing, reassurance, pride, gratitude, apology, hope, connection.
 * Never blame, never sides, never "who is right".
 *
 * TALIMOON is not a psychologist or a therapist, and shows it by
 * staying warm and plain rather than clinical.
 */

import type { Honorific, RecipientRelationship } from "./relationship";

export type Locale = "uz" | "en";

/**
 * A gentle self-reference for the Q3 examples only ("Dadang seni
 * sog'inadi"). Never stored, never shown to the child. Returns null
 * when the relationship + honorific don't allow a confident,
 * non-guessed word — the caller then uses a neutral first-person
 * example instead.
 */
export function caregiverSelfRef(
  rel: RecipientRelationship,
  honorific: Honorific | null | undefined,
  locale: Locale,
): string | null {
  const h = honorific ?? null;
  if (locale === "uz") {
    if (rel.type === "parent") return h === "mr" ? "Dadang" : h === "ms" ? "Oying" : null;
    if (rel.type === "grandparent") return h === "mr" ? "Bobong" : h === "ms" ? "Buving" : null;
    if (rel.type === "sibling") return h === "mr" ? "Akang" : h === "ms" ? "Opang" : null;
    return null;
  }
  if (rel.type === "parent") return h === "mr" ? "Dad" : h === "ms" ? "Mum" : null;
  if (rel.type === "grandparent") return h === "mr" ? "Grandpa" : h === "ms" ? "Grandma" : null;
  return null;
}

// ── Copy ─────────────────────────────────────────────────────────
export interface EmotionalBridgeCopy {
  continue: string;
  back: string;
  eyebrow: string;

  /** First line of the intro, rendered as the quiet opening heading. */
  introHeading: string;
  /** The rest of the intro. */
  introBody: string[];
  /** Reassurance about how the private details are used — shown as
   *  quiet prose under a hairline, never a warning banner. */
  trustNote: string[];
  /** Lighter lead-in when this is not the first child. */
  nextChildLead: (name: string) => string;

  // Q1 — a real situation (private context)
  q1: (name: string, multi: boolean) => string;
  q1Help: string;
  q1Placeholder: string;
  q1Skip: string;

  // Q2 — what the child should feel
  q2: (name: string, multi: boolean) => string;
  q2Help: string;
  q2Placeholder: string;

  // Q3 — one sentence from the heart
  q3: (name: string, multi: boolean) => string;
  q3Help: string;
  q3Placeholder: string;
  q3Examples: (selfRef: string | null) => string[];

  // Acknowledgement
  ackHeading: string;
  ackBody: string;
  nextChildCta: (name: string) => string;
}

// ── Uzbek ────────────────────────────────────────────────────────
const uz: EmotionalBridgeCopy = {
  continue: "Davom etish",
  back: "Orqaga",
  eyebrow: "Yuragingizda qolgan gaplar",

  introHeading:
    "Ba’zan bolaga aytmoqchi bo‘lgan eng muhim gaplarimiz yuragimizda qolib ketadi.",
  introBody: [
    "Balki Siz undan uzoqdasiz, safardasiz, ish tufayli birga kamroq vaqt o‘tkazasiz yoki shunchaki ichingizdagilarni so‘z bilan yetkazish qiyindir. Ba’zan esa orangizda araz yoki boshqa nozik bir vaziyat ham bo‘lishi mumkin.",
    "Agar bolangiz bilishini yoki his qilishini istagan gaplaringiz bo‘lsa, ularni bu yerda biz bilan bo‘lishishingiz mumkin.",
  ],
  trustNote: [
    "Bu yerda yozgan shaxsiy tafsilotlaringiz bolaga aynan shu shaklda ko‘rsatilmaydi va hikoyaga so‘zma-so‘z ko‘chirilmaydi.",
    "TALIMOON ularning ortidagi mehr, sog‘inch, umid va aytilmay qolgan tuyg‘ularni bolaga mos, ehtiyotkor hikoya yaratishda tushunish uchun foydalanadi.",
  ],
  nextChildLead: (name) =>
    `${name.trim()} uchun ham — yuragingizda qolgan gaplar bo‘lsa, shu yerda bo‘lishishingiz mumkin.`,

  q1: (name, multi) =>
    multi
      ? `Siz bilan ${name.trim()} orasida biz bilishimiz foydali bo‘lgan biror holat bormi?`
      : "Siz bilan uning orasida biz bilishimiz foydali bo‘lgan biror holat bormi?",
  q1Help:
    "Masalan: undan uzoqda yashashingiz yoki safarda bo‘lishingiz, ish tufayli birga kamroq vaqt o‘tkazishingiz, aytilmay qolgan gaplaringiz, orangizdagi araz yoki boshqa nozik bir vaziyat.",
  q1Placeholder: "Xohlagancha yozing — bu faqat biz uchun.",
  q1Skip: "Alohida holat yo‘q",

  q2: (name, multi) =>
    multi
      ? `${name.trim()} bu hikoyani o‘qiganda Sizdan nimani his qilishini istardingiz?`
      : "U bu hikoyani o‘qiganda Sizdan nimani his qilishini istardingiz?",
  q2Help:
    "Masalan: uni qanchalik yaxshi ko‘rishingizni, uzoqda bo‘lsangiz ham doim yodingizda ekanini, u bilan faxrlanishingizni, uni sog‘inishingizni yoki orangizdagi mehr kamaymaganini.",
  q2Placeholder: "O‘z so‘zlaringiz bilan...",

  q3: (name, multi) =>
    multi
      ? `Agar ${name.trim()}ga hozir yuragingizdan faqat bitta gap ayta olsangiz, nima der edingiz?`
      : "Agar unga hozir yuragingizdan faqat bitta gap ayta olsangiz, nima der edingiz?",
  q3Help: "Bir jumla ham yetarli.",
  q3Placeholder: "Bir jumla...",
  q3Examples: (ref) => [
    ref ? `${ref} seni har kuni sog‘inadi.` : "Seni har kuni sog‘inaman.",
    "Sen bilan faxrlanaman.",
    "Nima bo‘lishidan qat’i nazar, seni yaxshi ko‘raman.",
    "Uzoqda bo‘lsam ham, qalbim doim sen bilan.",
  ],

  ackHeading: "Rahmat. Siz yetkazmoqchi bo‘lgan eng muhim tuyg‘uni tushundik.",
  ackBody:
    "Uni bolaga mos, ehtiyotkor bir hikoyaga aylantiramiz — hech kimni ayblamasdan, hech kimni tanlashga majbur qilmasdan.",
  nextChildCta: (name) => `${name.trim()} bilan davom etamiz`,
};

// ── English ──────────────────────────────────────────────────────
const en: EmotionalBridgeCopy = {
  continue: "Continue",
  back: "Back",
  eyebrow: "Words still in your heart",

  introHeading:
    "Sometimes the most important things we want to say to a child stay in our hearts, unsaid.",
  introBody: [
    "Perhaps you live far from them, you're away travelling, work leaves you less time together, or it's simply hard to put what you feel into words. Sometimes there may be a rift between you, or another delicate situation.",
    "If there's something you'd like your child to know, or to feel, you can share it with us here.",
  ],
  trustNote: [
    "The personal details you write here are never shown to the child as they are, and are never copied word-for-word into the story.",
    "TALIMOON uses them only to understand the love, longing, hope and unspoken feeling behind them, so it can shape a gentle, age-appropriate story for the child.",
  ],
  nextChildLead: (name) =>
    `And for ${name.trim()} — if there's something still in your heart, you can share it here too.`,

  q1: (name, multi) =>
    multi
      ? `Is there something between you and ${name.trim()} that would help us to understand?`
      : "Is there something between you and them that would help us to understand?",
  q1Help:
    "For example: living far from them or being away travelling, less time together because of work, things left unsaid, a rift between you, or another delicate situation.",
  q1Placeholder: "Write as much as you like — this is just for us.",
  q1Skip: "Nothing in particular",

  q2: (name, multi) =>
    multi
      ? `When ${name.trim()} reads this story, what would you like them to feel from you?`
      : "When they read this story, what would you like them to feel from you?",
  q2Help:
    "For example: how much you love them, that they're always in your thoughts even when you're far away, that you're proud of them, that you miss them, or that the warmth between you hasn't faded.",
  q2Placeholder: "In your own words...",

  q3: (name, multi) =>
    multi
      ? `If you could say just one thing from your heart to ${name.trim()} right now, what would it be?`
      : "If you could say just one thing from your heart right now, what would it be?",
  q3Help: "One sentence is enough.",
  q3Placeholder: "One sentence...",
  q3Examples: (ref) => [
    ref ? `${ref} misses you every day.` : "I miss you every day.",
    "I'm proud of you.",
    "No matter what, I love you.",
    "Even when I'm far away, my heart is always with you.",
  ],

  ackHeading:
    "Thank you. We understand the most important feeling you want to carry across.",
  ackBody:
    "We'll shape it into a gentle story for the child — without blaming anyone, without asking them to take sides.",
  nextChildCta: (name) => `Carry on with ${name.trim()}`,
};

export const EMOTIONAL_BRIDGE_COPY: Record<Locale, EmotionalBridgeCopy> = { uz, en };

export function emotionalBridgeCopy(locale: string): EmotionalBridgeCopy {
  return locale === "uz" ? uz : en;
}
