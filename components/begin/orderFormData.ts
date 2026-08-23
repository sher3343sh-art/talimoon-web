// orderFormData.ts
// Single source of truth for order-form copy, pricing, and step config.
// Mirrors nasiha_bot's lang.py pricing logic — keep both in sync if prices change.
//
// Bilingual fields carry both `en`/`uz` (or `label`/`labelUz`, etc.) directly
// on the same record, rather than two parallel arrays — this project's other
// per-item bilingual data (e.g. RealTalimoonMoments' MOMENT_COPY_UZ) keys a
// separate lookup by id instead, but everything here is a fixed, small,
// closed list (never fetched/filtered by id elsewhere), so co-locating both
// languages on one object is simpler and keeps a price change or a wording
// fix a one-line diff instead of two arrays to keep in sync by hand.
//
// This file stays a plain .ts module (no JSX) even though it imports
// lucide-react icon *components* for STEPS — importing a component
// reference isn't JSX, so the extension doesn't need to change, and every
// consumer of STEPS gets the icon and its copy from one place instead of
// a second array to keep index-aligned by hand.

import type { LucideIcon } from "lucide-react";
import { CreditCard, Globe, Heart, Camera, Sparkles, User, Users } from "lucide-react";

export type BookType = "single" | "multi";

export const PRICING = {
  single: { base: 500_000, pages: "15–20", label: "One child", labelUz: "Bitta farzand" },
  multi: { base: 700_000, pages: "25–30", label: "Multiple children", labelUz: "Bir nechta farzand" },
  extraCopy: 300_000,
} as const;

export function calculatePrice(bookType: BookType, copies: number): number {
  const base = PRICING[bookType].base;
  return base + Math.max(0, copies - 1) * PRICING.extraCopy;
}

export function formatSom(amount: number): string {
  return amount.toLocaleString("en-US").replace(/,/g, " ") + " so'm";
}

export const TRAITS = [
  { id: "learning", en: "Love of learning", uz: "Bilimga ishtiyoq" },
  { id: "responsibility", en: "Responsibility", uz: "Mas'uliyat" },
  { id: "patience", en: "Patience", uz: "Sabr-toqat" },
  { id: "gratitude", en: "Gratitude", uz: "Minnatdorchilik" },
  { id: "courage", en: "Courage", uz: "Jasorat" },
  { id: "kindness", en: "Kindness", uz: "Mehribonlik" },
  { id: "cleanliness", en: "Cleanliness", uz: "Ozodalik" },
  { id: "manners", en: "Good manners", uz: "Odob-axloq" },
] as const;

export type TraitId = (typeof TRAITS)[number]["id"];

export const MAX_TRAITS = 3;

// Native script per language, not translated — a language name is always
// shown in its own script regardless of the UI's current language.
export const BOOK_LANGUAGES = ["O'zbek", "Русский", "English", "العربية"] as const;

export const PAYMENT_METHODS = [
  {
    id: "bank_transfer",
    label: "UZCARD / Humo",
    sublabel: "Bank transfer + receipt",
    sublabelUz: "Bank o'tkazmasi + chek",
    status: "available",
  },
  {
    id: "visa_mc",
    label: "Visa / Mastercard",
    sublabel: "International cards",
    sublabelUz: "Xalqaro kartalar",
    status: "soon",
  },
  {
    id: "paypal",
    label: "PayPal",
    sublabel: "International",
    sublabelUz: "Xalqaro",
    status: "soon",
  },
  {
    id: "ipay",
    label: "iPay",
    sublabel: "Regional",
    sublabelUz: "Mintaqaviy",
    status: "soon",
  },
] as const;

export type StepId =
  | "contact"
  | "book"
  | "personalize"
  | "personal-touch"
  | "photos"
  | "review"
  | "payment";

export interface StepConfig {
  id: StepId;
  title: string;
  titleUz: string;
  eyebrow: string;
  eyebrowUz: string;
  /** Small circular badge above the step title — see PersonalizedBookOrderForm. */
  icon: LucideIcon;
}

export const STEPS: StepConfig[] = [
  { id: "contact", eyebrow: "Step 1 of 7", eyebrowUz: "1/7-qadam", title: "Who should we send it to", titleUz: "Kimga yuboramiz", icon: User },
  { id: "book", eyebrow: "Step 2 of 7", eyebrowUz: "2/7-qadam", title: "About the child", titleUz: "Farzandingiz haqida", icon: Users },
  { id: "personalize", eyebrow: "Step 3 of 7", eyebrowUz: "3/7-qadam", title: "Make it truly theirs", titleUz: "Chinakam o'ziga xos qiling", icon: Sparkles },
  { id: "personal-touch", eyebrow: "Step 4 of 7", eyebrowUz: "4/7-qadam", title: "A personal touch", titleUz: "Shaxsiy jozibasi", icon: Heart },
  { id: "photos", eyebrow: "Step 5 of 7", eyebrowUz: "5/7-qadam", title: "Photos for the illustrations", titleUz: "Illyustratsiyalar uchun suratlar", icon: Camera },
  { id: "review", eyebrow: "Step 6 of 7", eyebrowUz: "6/7-qadam", title: "Language, copies & review", titleUz: "Til, nusxalar va ko'rib chiqish", icon: Globe },
  { id: "payment", eyebrow: "Step 7 of 7", eyebrowUz: "7/7-qadam", title: "Payment", titleUz: "To'lov", icon: CreditCard },
];
