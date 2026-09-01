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
import { CreditCard, Globe, Heart, Camera } from "lucide-react";

export type BookType = "single" | "multi";

// ── Pricing — the single source of truth. PricingSection (product
//    page) and the /begin order flow both read from here; nothing
//    hardcodes a price. Book prices, extra-copy price and the regional
//    delivery fee all live here so a change is a one-line diff.
export const PRICING = {
  single: { base: 499_000, pages: "15–20", label: "One child", labelUz: "Bitta farzand" },
  multi: { base: 699_000, pages: "25–30", label: "Multiple children", labelUz: "Bir nechta farzand" },
  extraCopy: 300_000,
  /** Flat fee for delivery to any supported region except Toshkent city. */
  regionalDelivery: 40_000,
} as const;

/** Book price only — base + each ADDITIONAL copy (the first copy is
 *  included in the base). Delivery is added separately, see
 *  {@link calculateOrderTotal}. */
export function calculatePrice(bookType: BookType, copies: number): number {
  const base = PRICING[bookType].base;
  return base + Math.max(0, copies - 1) * PRICING.extraCopy;
}

export function formatSom(amount: number): string {
  return amount.toLocaleString("en-US").replace(/,/g, " ") + " so'm";
}

// ── Delivery regions (Uzbekistan) — stable codes are the business
//    identity; display labels never drive logic. Toshkent SHAHRI and
//    Toshkent VILOYATI are deliberately separate codes: the city is
//    free, the region is not.
export type DeliveryRegionCode =
  | "tashkent_city"
  | "tashkent_region"
  | "andijan"
  | "bukhara"
  | "fergana"
  | "jizzakh"
  | "khorezm"
  | "namangan"
  | "navoi"
  | "kashkadarya"
  | "karakalpakstan"
  | "samarkand"
  | "sirdarya"
  | "surkhandarya";

export interface DeliveryRegion {
  code: DeliveryRegionCode;
  label: string;
  labelUz: string;
}

export const DELIVERY_REGIONS: readonly DeliveryRegion[] = [
  { code: "tashkent_city", label: "Tashkent (city)", labelUz: "Toshkent shahri" },
  { code: "tashkent_region", label: "Tashkent region", labelUz: "Toshkent viloyati" },
  { code: "andijan", label: "Andijan", labelUz: "Andijon viloyati" },
  { code: "bukhara", label: "Bukhara", labelUz: "Buxoro viloyati" },
  { code: "fergana", label: "Fergana", labelUz: "Farg‘ona viloyati" },
  { code: "jizzakh", label: "Jizzakh", labelUz: "Jizzax viloyati" },
  { code: "khorezm", label: "Khorezm", labelUz: "Xorazm viloyati" },
  { code: "namangan", label: "Namangan", labelUz: "Namangan viloyati" },
  { code: "navoi", label: "Navoi", labelUz: "Navoiy viloyati" },
  { code: "kashkadarya", label: "Kashkadarya", labelUz: "Qashqadaryo viloyati" },
  { code: "karakalpakstan", label: "Karakalpakstan", labelUz: "Qoraqalpog‘iston" },
  { code: "samarkand", label: "Samarkand", labelUz: "Samarqand viloyati" },
  { code: "sirdarya", label: "Sirdarya", labelUz: "Sirdaryo viloyati" },
  { code: "surkhandarya", label: "Surkhandarya", labelUz: "Surxondaryo viloyati" },
] as const;

/** Codes with free delivery. */
export const FREE_DELIVERY_REGIONS: readonly DeliveryRegionCode[] = ["tashkent_city"];

export function isDeliveryRegionCode(v: string): v is DeliveryRegionCode {
  return DELIVERY_REGIONS.some((r) => r.code === v);
}

export function deliveryRegionLabel(code: string, locale: "uz" | "en"): string {
  const r = DELIVERY_REGIONS.find((x) => x.code === code);
  if (!r) return "";
  return locale === "uz" ? r.labelUz : r.label;
}

/** The delivery fee for a region CODE — never a free-text string.
 *  Empty / unknown code → 0. */
export function deliveryFeeFor(regionCode: string): number {
  if (!regionCode || !isDeliveryRegionCode(regionCode)) return 0;
  return FREE_DELIVERY_REGIONS.includes(regionCode) ? 0 : PRICING.regionalDelivery;
}

export interface OrderTotals {
  bookSubtotal: number;
  extraCopiesSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

/** THE deterministic order total. Every UI surface (review breakdown,
 *  payment amount, any future submitted-order payload) derives from
 *  this one function — no component recomputes pieces on its own. */
export function calculateOrderTotal(opts: {
  bookType: BookType;
  copies: number;
  deliveryRequired: boolean;
  regionCode?: string;
}): OrderTotals {
  const bookSubtotal = PRICING[opts.bookType].base;
  const extraCopiesSubtotal = Math.max(0, opts.copies - 1) * PRICING.extraCopy;
  const deliveryFee = opts.deliveryRequired ? deliveryFeeFor(opts.regionCode ?? "") : 0;
  return {
    bookSubtotal,
    extraCopiesSubtotal,
    deliveryFee,
    grandTotal: bookSubtotal + extraCopiesSubtotal + deliveryFee,
  };
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

// ── Book output language (spec §39–41) — the language the printed book
//    is written in, NOT the site UI language. Stable machine `code` is
//    the backend identity; `label` is shown in the language's own
//    script, never translated. `status: "soon"` renders disabled with a
//    "Tez orada" tag and cannot be ordered (spec §40). Every language
//    here is confirmed deliverable at production quality.
export type BookLanguageCode = "uz" | "en" | "ru" | "kk" | "ky" | "tg" | "ar";

export interface BookLanguageOption {
  code: BookLanguageCode;
  label: string;
  status: "available" | "soon";
}

export const BOOK_LANGUAGE_OPTIONS: readonly BookLanguageOption[] = [
  { code: "uz", label: "O‘zbekcha", status: "available" },
  { code: "en", label: "English", status: "available" },
  { code: "ru", label: "Русский", status: "available" },
  { code: "kk", label: "Қазақша", status: "available" },
  { code: "ky", label: "Кыргызча", status: "available" },
  { code: "tg", label: "Тоҷикӣ", status: "available" },
  { code: "ar", label: "العربية", status: "available" },
] as const;

export function bookLanguageLabel(code: string): string {
  return BOOK_LANGUAGE_OPTIONS.find((l) => l.code === code)?.label ?? "";
}

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

/**
 * Wizard steps AFTER Phase 01 ("Siz bilan tanishamiz" — orderer name,
 * relationship, children's names + ages — handled by Phase01.tsx).
 * The conversational chapters and these steps together form the seven
 * JOURNEY_CHAPTERS in `@/lib/order/phase01-copy`; the per-step
 * `chapter` index below points into that list so the progress rail
 * stays in sync. Chapter 3 ("Ko‘ngil so‘zlari") is its own quiet
 * screen between "a personal touch" and the photos — see
 * EmotionalBridge.tsx — not a wizard step, so no entry here.
 */
export type StepId =
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
  /** 0-based index into JOURNEY_CHAPTERS (chapter 0 is Phase 01). */
  chapter: number;
  /** Small circular badge above the step title — see PersonalizedBookOrderForm. */
  icon: LucideIcon;
}

export const STEPS: StepConfig[] = [
  { id: "personal-touch", chapter: 2, eyebrow: "A personal touch", eyebrowUz: "Shaxsiy jozibasi", title: "A personal touch", titleUz: "Shaxsiy jozibasi", icon: Heart },
  { id: "photos", chapter: 4, eyebrow: "Photos", eyebrowUz: "Suratlar", title: "Photos for the illustrations", titleUz: "Illyustratsiyalar uchun suratlar", icon: Camera },
  { id: "review", chapter: 5, eyebrow: "Review", eyebrowUz: "Ko'rib chiqamiz", title: "Delivery, language & review", titleUz: "Yetkazish, til va ko'rib chiqish", icon: Globe },
  { id: "payment", chapter: 6, eyebrow: "Finish", eyebrowUz: "Yakun", title: "Payment", titleUz: "To'lov", icon: CreditCard },
];
