"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, Upload, X } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { toLocale } from "@/lib/journey/types";
import {
  BOOK_LANGUAGE_OPTIONS,
  BookLanguageCode,
  BookType,
  COUNTRIES,
  DELIVERY_REGIONS,
  STEPS,
  TraitId,
  buildPricingSnapshot,
  calculateOrderTotal,
  countryLabel,
  deliveryRegionLabel,
  formatMoney,
  marketHasOnlinePayment,
  paymentMethodsForMarket,
  type Market,
} from "./orderFormData";
import { setMarketPreference, useMarketPreference, marketFromLocation } from "@/lib/order/market";
import {
  bookTypeForChildCount,
  deliveryRequired,
  emptyChild,
  emptyOrderer,
  isDeliveryComplete,
  resetDeliveryForMarket,
  type ChildProfile,
  type DeliveryAddress,
  type DeliveryLocation,
  type Orderer,
  type Phase01Result,
} from "@/lib/order/types";
import Phase02 from "./Phase02";
import Phase03 from "./Phase03";
import EmotionalBridge from "./EmotionalBridge";
import { SwitchRow } from "./Switch";
import { ChildWorld } from "./ChildWorld";
import { growthFull } from "@/lib/order/phase03-copy";
import {
  formatRespectfulName,
  relationshipLabel,
  type RecipientRelationship,
} from "@/lib/order/relationship";
import Phase01 from "./Phase01";
import { JourneyProgress } from "./JourneyProgress";

/** Where "Yuragingizda qolgan gaplar" (its own quiet screen, not a
 *  wizard step) slots in: after "a personal touch", before the photos. */
const PERSONAL_TOUCH_STEP = STEPS.findIndex((s) => s.id === "personal-touch");
const PHOTOS_STEP = STEPS.findIndex((s) => s.id === "photos");

// ─── Copy ───────────────────────────────────────────────────────────────────

const CHROME_EN = {
  back: "Back",
  continue: "Continue",
  sendOrder: "Send order",

  // Completion — the order is SUBMITTED, not in production. Review →
  // confirmation → 5–7 day preparation → delivery notification.
  doneHeading: "Your order has been received",
  doneBody: [
    "We've received all the information you provided. The TALIMOON team will now review it carefully.",
    "If we need to clarify anything, we'll contact you. If everything is complete, we'll send you a message confirming your order.",
    "Once confirmed, your book is usually prepared within 5–7 days. When it is ready, we'll contact you with the delivery details.",
  ],
  doneNote: "Order updates will be sent to the phone number you provided.",

  heroesLabel: "Heroes of this story",
  years: (age: number | null) => (age == null ? "" : `, ${age}`),

  phone: "Phone number",
  // Delivery
  deliveryQ: "Would you like us to deliver your book?",
  deliveryYes: "Yes, I need delivery",
  deliveryNo: "No, I'll collect it myself",
  deliveryRegionField: "Region / area",
  deliveryRegionPlaceholder: "Select…",
  pickupSummary: "Self-pickup — no delivery fee",
  deliveryFree: "Free",
  rowBook: "Book",
  rowExtraCopies: (n: number) => (n === 1 ? "Extra copy" : `Extra copies × ${n}`),
  rowDelivery: "Delivery",
  payAmount: "Amount to pay",
  addrDistrict: "City / district",
  addrStreet: "Street / mahalla",
  addrBuilding: "House / building",
  addrApartment: "Flat / unit",
  addrLandmark: "Landmark",
  optional: "(optional)",
  locationCta: "Set the delivery location",
  locationHint:
    "If you'd like, you can attach a location so the courier finds the address more easily.",
  locationAttached: "Location attached",
  locationClear: "Remove location",
  locationDenied: "Couldn't get the location. You can carry on with the written address.",
  locationUnsupported:
    "This device can't share a location. The written address is enough.",
  locationLoading: "Getting location…",

  namePlaceholder: "Name",
  agePlaceholder: "Age",
  pagesUnit: "pages",

  interests: "What do they love doing?",
  interestsHint: "Hobbies, favorite games, anything that lights them up.",
  dreams: "What do they dream of becoming?",
  qualities: (max: number) => `Qualities to highlight (choose up to ${max})`,
  weaknesses: "Anything to gently work on?",
  weaknessesHint:
    "Optional — habits or behaviors you'd like the story to address.",
  extraInfo: "Anything else that makes the story more personal?",

  giftFrom: "Who is this gift from?",
  giftFromHint: "Name and relationship — e.g. Mom, Nilufar",
  wantsPersonalMessage: "Add a personal message",
  personalMessagePlaceholder: "A note that will appear at the end of the book",
  wantsCharacters: "Include other characters",
  charactersPlaceholder:
    "Names and relationship — e.g. sister Madina, grandfather",

  childPhotos: "Child photos",
  childPhotosHint: "3–5 clear, well-lit photos showing the face",
  wantsSpecialPhoto: "Add a special photo for the closing page",
  specialPhoto: "Special photo for the closing page",
  specialPhotoHint:
    "This photo is used on the book's final page as it really looks — it is not turned into an anime or cartoon drawing. So choose one that's as clear and bright as possible: a family photo, or one that means a lot to you.",
  specialPhotoNote: "The photo is used exactly as it is.",
  characterPhotos: "Photos of the other characters",
  characterPhotosHint: "1–3 photos for each additional character in the story",
  atLeastPhotos: (min: number) => `At least ${min} photos required`,
  removePhoto: "Remove photo",
  photoTooLarge: "That photo is too large. Please choose one under 15 MB.",
  photoNotImage: "Please choose an image file.",
  photoBroken: "This image couldn't be read. Please choose another.",

  bookLanguageQ: "Which language would you like the book in?",
  languageSoon: "Coming soon",
  numberOfCopies: "Number of copies",
  total: "Total",

  availableSoon: "Available soon",
  uploadReceipt: "Upload payment receipt",

  reviewLanguage: "Book language",
  reviewAddress: "Delivery",
  reviewCharacters: "Other characters",
  reviewPrivateNote: "Private note for TALIMOON",
  reviewPrivateHint: "Only used to understand the situation — not shown in the book.",
  reviewGrowthContext: "Situations",

  // Market / destination
  orderRegion: "Order region",
  marketUz: "Uzbekistan",
  marketIntl: "International",
  change: "Change",
  countryQ: "Which country is this order for?",
  countryField: "Country",
  countrySelect: "Select…",
  addrState: "State / province / region",
  addrCity: "City",
  addrLine: "Street / address",
  addrPostal: "Postal / ZIP code",
  addrNote: "Delivery note",
  intlDelivery: "International postal delivery",
  intlDeliveryHelp: "One flat postal charge for the whole order.",
  intlPayHeading: "International payment",
  intlPayNotice:
    "Online payment for international orders isn't available yet. Send your order and the TALIMOON team will contact you to arrange payment before your book is prepared.",

  errReview:
    "Please add a phone number, choose the book language, choose the destination country, and answer the delivery question (with a full address if you'd like delivery).",
};

const CHROME_UZ: typeof CHROME_EN = {
  back: "Orqaga",
  continue: "Davom etish",
  sendOrder: "Buyurtma yuborish",

  doneHeading: "Buyurtmangiz qabul qilindi",
  doneBody: [
    "Barcha ma’lumotlaringiz bizga yetib keldi. Endi TALIMOON jamoasi ularni diqqat bilan ko‘rib chiqadi.",
    "Agar biror ma’lumotga aniqlik kiritish kerak bo‘lsa, Siz bilan bog‘lanamiz. Hammasi joyida bo‘lsa, buyurtmangiz tasdiqlangani haqida xabar yuboramiz.",
    "Tasdiqlangandan so‘ng kitobingiz odatda 5–7 kun ichida tayyorlanadi. Tayyor bo‘lgach, yetkazib berish bo‘yicha Sizga alohida xabar beramiz.",
  ],
  doneNote: "Buyurtma holati bo‘yicha xabarlar Siz ko‘rsatgan telefon raqamiga yuboriladi.",

  heroesLabel: "Hikoya qahramonlari",
  years: (age: number | null) => (age == null ? "" : `, ${age} yosh`),

  phone: "Telefon raqami",
  deliveryQ: "Kitobni Sizga yetkazib beraylikmi?",
  deliveryYes: "Ha, yetkazib berish kerak",
  deliveryNo: "Yo‘q, o‘zim olib ketaman",
  deliveryRegionField: "Viloyat / hudud",
  deliveryRegionPlaceholder: "Tanlang…",
  pickupSummary: "O‘zim olib ketaman — yetkazib berish to‘lovi yo‘q",
  deliveryFree: "Bepul",
  rowBook: "Kitob",
  rowExtraCopies: (n: number) => (n === 1 ? "Qo‘shimcha nusxa" : `Qo‘shimcha nusxa × ${n}`),
  rowDelivery: "Yetkazib berish",
  payAmount: "To‘lov summasi",
  addrDistrict: "Shahar / tuman",
  addrStreet: "Ko‘cha / mahalla",
  addrBuilding: "Uy / bino",
  addrApartment: "Kvartira / xonadon",
  addrLandmark: "Mo‘ljal",
  optional: "(ixtiyoriy)",
  locationCta: "Yetkazib berish joyini belgilash",
  locationHint:
    "Istasangiz, kuryer manzilni osonroq topishi uchun lokatsiyani ham biriktirishingiz mumkin.",
  locationAttached: "Lokatsiya biriktirilgan",
  locationClear: "Lokatsiyani olib tashlash",
  locationDenied: "Lokatsiya olinmadi. Manzilni yozib davom etishingiz mumkin.",
  locationUnsupported:
    "Bu qurilma lokatsiyani ulasholmaydi. Yozilgan manzil yetarli.",
  locationLoading: "Lokatsiya olinmoqda…",

  namePlaceholder: "Ismi",
  agePlaceholder: "Yoshi",
  pagesUnit: "bet",

  interests: "Ular nimani yaxshi ko'radi?",
  interestsHint:
    "Sevimli mashg'ulotlari, o'yinlari — ularni quvontiradigan narsalar.",
  dreams: "Kim bo'lishni orzu qilishadi?",
  qualities: (max: number) => `Ta'kidlanadigan fazilatlar (${max} tagacha tanlang)`,
  weaknesses: "Astoydil ishlov berish kerak bo'lgan narsa bormi?",
  weaknessesHint:
    "Ixtiyoriy — hikoya orqali yumshoq ishora qilinishini istagan odat yoki xatti-harakat.",
  extraInfo: "Hikoyani yanada shaxsiy qiladigan boshqa narsa bormi?",

  giftFrom: "Bu sovg'a kimdan?",
  giftFromHint: "Ism va qarindoshlik — masalan: Onasi, Nilufar",
  wantsPersonalMessage: "Shaxsiy xabar qo'shish",
  personalMessagePlaceholder: "Kitob oxirida chiqadigan yozuv",
  wantsCharacters: "Hikoyaga boshqa qahramonlarni qo'shish",
  charactersPlaceholder: "Ism va qarindoshlik — masalan: opasi Madina, bobosi",

  childPhotos: "Farzand suratlari",
  childPhotosHint: "Yuzi aniq ko'rinadigan, yaxshi yoritilgan 3–5 ta surat",
  wantsSpecialPhoto: "Yakuniy sahifa uchun maxsus surat qo'shish",
  specialPhoto: "Yakuniy sahifa uchun maxsus surat",
  specialPhotoHint:
    "Bu surat kitobning yakuniy sahifasida o'zining haqiqiy ko'rinishida ishlatiladi — anime yoki multfilm rasmiga aylantirilmaydi. Shuning uchun imkon qadar tiniq, yorug' va Siz uchun chiroyli oilaviy yoki esda qolarli surat tanlang.",
  specialPhotoNote: "Surat qanday bo'lsa, shunday ishlatiladi.",
  characterPhotos: "Boshqa qahramonlar suratlari",
  characterPhotosHint: "Hikoyadagi har bir qo'shimcha qahramon uchun 1–3 ta surat",
  atLeastPhotos: (min: number) => `Kamida ${min} ta surat kerak`,
  removePhoto: "Suratni o'chirish",
  photoTooLarge: "Bu surat juda katta. Iltimos, 15 MB dan kichigini tanlang.",
  photoNotImage: "Iltimos, rasm faylini tanlang.",
  photoBroken: "Bu suratni o'qib bo'lmadi. Iltimos, boshqasini tanlang.",

  bookLanguageQ: "Kitob qaysi tilda bo'lishini xohlaysiz?",
  languageSoon: "Tez orada",
  numberOfCopies: "Nusxalar soni",
  total: "Jami",

  availableSoon: "Tez orada mavjud bo'ladi",
  uploadReceipt: "To'lov chekini yuklang",

  reviewLanguage: "Kitob tili",
  reviewAddress: "Yetkazib berish",
  reviewCharacters: "Boshqa qahramonlar",
  reviewPrivateNote: "TALIMOON uchun shaxsiy izoh",
  reviewPrivateHint: "Faqat vaziyatni tushunish uchun — kitobda ko'rsatilmaydi.",
  reviewGrowthContext: "Vaziyatlar",

  // Market / destination
  orderRegion: "Buyurtma hududi",
  marketUz: "O‘zbekiston",
  marketIntl: "Xalqaro",
  change: "O‘zgartirish",
  countryQ: "Buyurtmangiz qaysi davlat uchun?",
  countryField: "Davlat",
  countrySelect: "Tanlang…",
  addrState: "Shtat / viloyat / hudud",
  addrCity: "Shahar",
  addrLine: "Ko‘cha / manzil",
  addrPostal: "Pochta indeksi",
  addrNote: "Yetkazib berish izohi",
  intlDelivery: "Xalqaro pochta orqali yetkazib berish",
  intlDeliveryHelp: "Butun buyurtma uchun bir martalik pochta to‘lovi.",
  intlPayHeading: "Xalqaro to‘lov",
  intlPayNotice:
    "Xalqaro buyurtmalar uchun onlayn to‘lov hozircha mavjud emas. Buyurtmani yuboring — TALIMOON jamoasi kitob tayyorlanishidan oldin to‘lovni kelishish uchun Siz bilan bog‘lanadi.",

  errReview:
    "Iltimos, telefon raqamini kiriting, kitob tilini tanlang, yetkazib beriladigan davlatni tanlang va yetkazib berish savoliga javob bering (yetkazib berish kerak bo‘lsa, to‘liq manzil bilan).",
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  orderer: Orderer;
  recipientRelationship: RecipientRelationship;
  /** Commercial market for this order — decides the currency and the
   *  whole price list. Set from the "Order Now" that started the
   *  checkout, then editable via the "Buyurtma hududi" control on the
   *  review step. UZ ⇒ UZS, INTERNATIONAL ⇒ USD; the two never mix. */
  market: Market;
  /** Derived from `children.length` (see bookTypeForChildCount); kept
   *  on the model because pricing keys off it. The customer never
   *  sees "single" / "multi". */
  bookType: BookType;
  children: ChildProfile[];

  // ── Later chapters (still order-level for now; migrating to
  //    per-ChildProfile fields is Phase 02 work) ────────────────────
  interests: string;
  dreams: string;
  traits: TraitId[];
  weaknesses: string;
  extraInfo: string;
  giftFrom: string;
  wantsPersonalMessage: boolean;
  personalMessage: string;
  wantsCharacters: boolean;
  characters: string;
  childPhotos: File[];
  wantsSpecialPhoto: boolean;
  specialPhoto: File | null;
  characterPhotos: File[];
  /** Stable machine code (spec §41) — "" until chosen. */
  bookLanguageCode: BookLanguageCode | "";
  copies: number;
  paymentMethod: string;
  receipt: File | null;
}

function emptyForm(market: Market = "UZ"): FormData {
  const orderer = emptyOrderer();
  if (market === "UZ") orderer.deliveryAddress.countryCode = "UZ";
  return {
    orderer,
    recipientRelationship: { type: "parent" },
    market,
    paymentMethod: paymentMethodsForMarket(market)[0]?.id ?? "bank_transfer",
    bookType: "single",
    children: [emptyChild()],
    interests: "",
    dreams: "",
    traits: [],
    weaknesses: "",
    extraInfo: "",
    giftFrom: "",
    wantsPersonalMessage: false,
    personalMessage: "",
    wantsCharacters: false,
    characters: "",
    childPhotos: [],
    wantsSpecialPhoto: false,
    specialPhoto: null,
    characterPhotos: [],
    bookLanguageCode: "",
    copies: 1,
    receipt: null,
  };
}

// ─── Shared field primitives ────────────────────────────────────────────────

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[13px] font-medium text-text-primary">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block font-sans text-[12px] text-text-secondary">
          {hint}
        </span>
      )}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border-default bg-transparent px-3.5 py-2.5 font-sans text-[14px] text-text-primary outline-none transition-colors focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-accent-primary";

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} rows={props.rows ?? 3} className={inputClass + " resize-none"} />
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function PersonalizedBookOrderForm({
  onBack,
  initialBookType,
  initialMarket,
}: {
  onBack: () => void;
  /**
   * Pre-selects the child count when the form is entered from a
   * pricing card that already committed to a book type (e.g.
   * PricingSection on the product page). Omitted for the /begin flow.
   */
  initialBookType?: BookType;
  /**
   * The commercial market the customer had selected when they pressed
   * "Order Now" (spec §9–10). When present it ALWAYS wins over any
   * saved preference (spec §12) and is what the whole order inherits.
   * Omitted for a generic /begin entry — the flow then resolves the
   * market from a `?market=` hint, the saved preference, or the review
   * step's "Buyurtma hududi" control.
   */
  initialMarket?: Market;
}) {
  const { language } = useLanguage();
  const locale = toLocale(language);
  /** The order sub-components (ChildWorld, phase copy helpers) only
   *  speak uz / en; everything else falls back to en. */
  const bookLoc: "uz" | "en" = locale === "uz" ? "uz" : "en";
  const t = useT(CHROME_EN, CHROME_UZ);

  // ── Market resolution (spec §11–12). Priority: the explicit market
  //    from the Order Now that started this checkout (prop) > a
  //    `?market=` URL hint > the saved preference > UZ. Once the
  //    customer touches the region control, seeding stops — an explicit
  //    action always beats stale saved state (spec §12).
  const { preference: savedMarket } = useMarketPreference();
  const [marketTouched, setMarketTouched] = useState(false);
  const resolvedInitialMarket: Market =
    initialMarket ?? marketFromLocation() ?? savedMarket ?? "UZ";

  const [phase, setPhase] = useState<
    "intro" | "world" | "character" | "heart" | "steps"
  >("intro");
  const [stepIndex, setStepIndex] = useState(0);
  /** Where the customer lands when the "Yuragingizda qolgan gaplar"
   *  screen opens: "start" going forward, "end" stepping back from
   *  the photos so edits are quick. */
  const [heartEntry, setHeartEntry] = useState<"start" | "end">("start");
  /** "end" when the customer steps BACK from the first wizard step into
   *  Phase 03, so it opens on its completion screen (spec §03). */
  const [charEntry, setCharEntry] = useState<"start" | "end">("start");
  const [data, setData] = useState<FormData>(() => emptyForm(resolvedInitialMarket));
  const [phase01Seeded, setPhase01Seeded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showStepError, setShowStepError] = useState(false);

  // Switching market is ONE atomic transition (spec §17): currency,
  // every price, the delivery rules AND any stale delivery/address
  // state for the other market change together. Nothing is left that
  // could still feed the total.
  function changeMarket(next: Market) {
    setMarketTouched(true);
    setMarketPreference(next);
    setData((prev) => {
      if (prev.market === next) return prev;
      return {
        ...prev,
        market: next,
        orderer: {
          ...prev.orderer,
          deliveryAddress: resetDeliveryForMarket(prev.orderer.deliveryAddress, next),
        },
        paymentMethod: paymentMethodsForMarket(next)[0]?.id ?? prev.paymentMethod,
        receipt: null,
      };
    });
    setShowStepError(false);
  }

  // Seed the market from a `?market=` hint or the saved preference for a
  // plain /begin entry. The saved value is invisible to the `useState`
  // initializer (it only lands after hydration), so this reconciles it
  // in during render — React's supported "adjust state while rendering"
  // pattern, no effect, no cascading-render lint. It stops the moment
  // the customer has an explicit market: a prop, a URL hint, or a tap
  // on the region control (spec §12 — an explicit action always wins).
  const seedMarket = !initialMarket && !marketTouched
    ? marketFromLocation() ?? savedMarket
    : null;
  if (seedMarket && seedMarket !== data.market) {
    setData((prev) =>
      prev.market === seedMarket
        ? prev
        : {
            ...prev,
            market: seedMarket,
            orderer: {
              ...prev.orderer,
              deliveryAddress: resetDeliveryForMarket(
                prev.orderer.deliveryAddress,
                seedMarket,
              ),
            },
            paymentMethod:
              paymentMethodsForMarket(seedMarket)[0]?.id ?? prev.paymentMethod,
          },
    );
  }

  const step = STEPS[stepIndex];
  const stepTitle = language === "UZ" ? step.titleUz : step.title;
  const isLastStep = stepIndex === STEPS.length - 1;

  // THE order total — one deterministic, market-aware derivation the
  // review breakdown AND the payment amount both read (spec §26). The
  // whole result is in ONE currency (UZS or USD, from `data.market`);
  // delivery is only ever billed when the customer actively chose it.
  const wantsDelivery = deliveryRequired(data.orderer.deliveryAddress);
  const totals = useMemo(
    () =>
      calculateOrderTotal({
        market: data.market,
        bookType: data.bookType,
        copies: data.copies,
        deliveryRequired: wantsDelivery,
        regionCode: data.orderer.deliveryAddress.regionCode,
      }),
    [
      data.market,
      data.bookType,
      data.copies,
      wantsDelivery,
      data.orderer.deliveryAddress.regionCode,
    ],
  );
  /** Every money figure in this flow prints through here, so one order
   *  is always shown in one currency. */
  const money = (n: number) => formatMoney(n, totals.currency);
  const deliveryRowLabel =
    data.market === "INTERNATIONAL" ? t.intlDelivery : t.rowDelivery;

  function update<K extends keyof FormData>(
    key: K,
    value: FormData[K] | ((prev: FormData[K]) => FormData[K]),
  ) {
    setData((prev) => ({
      ...prev,
      [key]:
        typeof value === "function"
          ? (value as (p: FormData[K]) => FormData[K])(prev[key])
          : value,
    }));
    setShowStepError(false);
  }

  function updateOrderer<K extends keyof Orderer>(key: K, value: Orderer[K]) {
    setData((prev) => ({ ...prev, orderer: { ...prev.orderer, [key]: value } }));
    setShowStepError(false);
  }

  function updateAddress<K extends keyof DeliveryAddress>(
    key: K,
    value: DeliveryAddress[K],
  ) {
    setData((prev) => ({
      ...prev,
      orderer: {
        ...prev.orderer,
        deliveryAddress: { ...prev.orderer.deliveryAddress, [key]: value },
      },
    }));
    setShowStepError(false);
  }

  // ── Optional delivery location (spec §44–49). Permission is requested
  //    ONLY on an explicit tap — never on load. A denial / no support
  //    never blocks checkout; the written address is always enough.
  const [locState, setLocState] = useState<
    "idle" | "loading" | "denied" | "unsupported"
  >("idle");

  function requestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocState("unsupported");
      return;
    }
    setLocState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: DeliveryLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: Number.isFinite(pos.coords.accuracy)
            ? pos.coords.accuracy
            : undefined,
        };
        updateAddress("location", loc);
        setLocState("idle");
      },
      () => setLocState("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }

  function clearLocation() {
    updateAddress("location", undefined);
    setLocState("idle");
  }

  function handlePhase01(result: Phase01Result) {
    setData((prev) => ({
      ...prev,
      orderer: {
        ...prev.orderer,
        honorific: result.ordererHonorific,
        name: result.ordererName,
      },
      recipientRelationship: result.recipientRelationship,
      children: result.children,
      bookType: bookTypeForChildCount(result.children.length),
    }));
    setPhase01Seeded(true);
    setPhase("world");
    setStepIndex(0);
    setShowStepError(false);
  }

  function patchChild(id: string, p: Partial<ChildProfile>) {
    setData((prev) => ({
      ...prev,
      children: prev.children.map((ch) => (ch.id === id ? { ...ch, ...p } : ch)),
    }));
  }

  function canContinue(): boolean {
    switch (step.id) {
      case "personal-touch":
        return data.giftFrom.trim().length > 0;
      case "photos":
        return data.childPhotos.length >= 3;
      case "review": {
        // Phone + book language + an answered delivery question. If the
        // customer wants INTERNATIONAL delivery, a destination country
        // and the postal address are required; UZ delivery needs a
        // region + written address; pickup needs nothing further.
        const wantsDel = deliveryRequired(data.orderer.deliveryAddress);
        const countryOk =
          !wantsDel ||
          data.market === "UZ" ||
          data.orderer.deliveryAddress.countryCode.trim().length > 0;
        return (
          data.bookLanguageCode.length > 0 &&
          data.orderer.phone.trim().length > 5 &&
          countryOk &&
          isDeliveryComplete(data.orderer.deliveryAddress, data.market)
        );
      }
      case "payment":
        return true;
      default:
        return true;
    }
  }

  function goNext() {
    if (!canContinue()) {
      setShowStepError(true);
      return;
    }
    // "Yuragingizda qolgan gaplar" lives between "a personal touch" and
    // the photos — its own quiet screen, not a wizard step.
    if (step.id === "personal-touch") {
      setHeartEntry("start");
      setPhase("heart");
      setShowStepError(false);
      return;
    }
    if (isLastStep) {
      // A submitted order PRESERVES the prices that applied right now —
      // never recalculated from a later config (spec §35–37). This is
      // the payload shape the order-intake API will store.
      const snapshot = buildPricingSnapshot({
        market: data.market,
        countryCode:
          data.orderer.deliveryAddress.countryCode ||
          (data.market === "UZ" ? "UZ" : ""),
        bookType: data.bookType,
        copies: data.copies,
        deliveryRequired: wantsDelivery,
        regionCode: data.orderer.deliveryAddress.regionCode,
      });
      // TODO: POST this to the order-intake API once it exists (upload +
      // admin notification). Validated form state + pricing snapshot
      // only for now.
      if (typeof console !== "undefined") {
        console.info("[order] pricing snapshot", snapshot);
      }
      setSubmitted(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setShowStepError(false);
  }

  function goBack() {
    // Back from the photos returns through "Yuragingizda qolgan gaplar",
    // landing on its acknowledgement so an edit is one step away.
    if (step.id === "photos") {
      setHeartEntry("end");
      setPhase("heart");
      setShowStepError(false);
      return;
    }
    // Back from the FIRST wizard step goes to the immediately previous
    // screen — the end of Phase 03 ("the child's character") — NOT all
    // the way back to Phase 01 (spec §03).
    if (stepIndex === 0) {
      setCharEntry("end");
      setPhase("character");
      setShowStepError(false);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
    setShowStepError(false);
  }

  // ── Phase 01: the conversational opening ──────────────────────────────────
  if (phase === "intro") {
    return (
      <Phase01
        onBack={onBack}
        onComplete={handlePhase01}
        initialChildCount={
          initialBookType ? (initialBookType === "multi" ? 2 : 1) : undefined
        }
        initial={
          phase01Seeded
            ? {
                ordererHonorific: data.orderer.honorific,
                ordererName: data.orderer.name,
                recipientRelationship: data.recipientRelationship,
                children: data.children,
              }
            : undefined
        }
      />
    );
  }

  // ── Phase 02: the child's world ──────────────────────────────────────────
  if (phase === "world") {
    return (
      <Phase02
        childrenIn={data.children}
        onPatchChild={patchChild}
        onBack={() => setPhase("intro")}
        onComplete={() => {
          setCharEntry("start");
          setPhase("character");
        }}
      />
    );
  }

  // ── Phase 03: the child's character ─────────────────────────────────────
  if (phase === "character") {
    return (
      <Phase03
        childrenIn={data.children}
        onPatchChild={patchChild}
        entry={charEntry}
        onBack={() => {
          setCharEntry("start");
          setPhase("world");
        }}
        onComplete={() => {
          setPhase("steps");
          setStepIndex(0);
          setShowStepError(false);
        }}
      />
    );
  }

  // ── "Yuragingizda qolgan gaplar" — the emotional bridge ─────────────────
  //    A quiet screen between "a personal touch" and the photo upload.
  if (phase === "heart") {
    return (
      <EmotionalBridge
        childrenIn={data.children}
        recipientRelationship={data.recipientRelationship}
        ordererHonorific={data.orderer.honorific}
        entry={heartEntry}
        onPatchChild={patchChild}
        onBack={() => {
          setPhase("steps");
          setStepIndex(PERSONAL_TOUCH_STEP);
          setShowStepError(false);
        }}
        onComplete={() => {
          setPhase("steps");
          setStepIndex(PHOTOS_STEP);
          setShowStepError(false);
        }}
      />
    );
  }

  if (submitted) {
    // The order is SUBMITTED — not in production. It goes SUBMITTED →
    // REVIEW → CONFIRMED → PREPARATION (5–7 days) → READY → DELIVERY.
    return (
      <section className="mx-auto flex min-h-[560px] w-full max-w-container-content flex-col items-center bg-surface-base px-6 py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/[0.14]">
            <Check size={24} strokeWidth={2} className="text-accent-primary" />
          </span>
          <h2 className="font-display text-[26px] font-medium leading-tight text-text-primary">
            {t.doneHeading}
          </h2>
          <div className="mt-4 space-y-3 font-sans text-[14px] leading-[1.65] text-text-secondary">
            {t.doneBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12.5px] leading-[1.6] text-text-muted">
            {t.doneNote}
          </p>
        </div>
      </section>
    );
  }

  const StepIcon = step.icon;
  const heroLine = data.children
    .map((ch) => `${ch.name.trim()}${t.years(ch.age)}`)
    .filter((s) => s.trim().length > 0)
    .join(" · ");
  const respectfulName = formatRespectfulName(
    locale,
    data.orderer.honorific,
    data.orderer.name,
  );

  return (
    <section className="mx-auto w-full max-w-container-content bg-surface-base px-6 py-16 sm:px-8 md:py-20 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-xl">
        {/* Chapter header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-secondary transition-opacity hover:opacity-70"
          >
            <ArrowLeft size={14} strokeWidth={1.75} className="rtl:-scale-x-100" />
            {t.back}
          </button>
          <JourneyProgress locale={locale} current={step.chapter} />
        </div>

        {/* Who this story is for — a quiet reminder from Phase 01 */}
        {heroLine && (
          <p className="mb-6 font-sans text-[12.5px] text-text-secondary">
            <span className="font-medium uppercase tracking-[0.12em] text-text-muted">
              {t.heroesLabel}
            </span>
            <span className="mx-2 text-border-strong">·</span>
            {heroLine}
          </p>
        )}

        <span
          className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent-primary/[0.12]"
          aria-hidden="true"
        >
          <StepIcon size={22} strokeWidth={1.5} className="text-accent-primary" />
        </span>
        <h2 className="mb-8 text-center font-display text-[26px] font-medium leading-tight text-text-primary">
          {stepTitle}
        </h2>

        {/* Step content */}
        <div className="space-y-5">
          {/* "personalize" step removed — qualities, growth behaviour and
              desired values are now collected per child in Phase 03
              ("the child's character"). */}

          {step.id === "personal-touch" && (
            <>
              <Field label={t.giftFrom} hint={t.giftFromHint}>
                <TextInput
                  value={data.giftFrom}
                  onChange={(e) => update("giftFrom", e.target.value)}
                />
              </Field>

              <SwitchRow
                label={t.wantsPersonalMessage}
                checked={data.wantsPersonalMessage}
                onChange={(v) => update("wantsPersonalMessage", v)}
              />
              {data.wantsPersonalMessage && (
                <TextArea
                  value={data.personalMessage}
                  onChange={(e) => update("personalMessage", e.target.value)}
                  placeholder={t.personalMessagePlaceholder}
                />
              )}

              <SwitchRow
                label={t.wantsCharacters}
                checked={data.wantsCharacters}
                onChange={(v) => update("wantsCharacters", v)}
              />
              {data.wantsCharacters && (
                <TextArea
                  value={data.characters}
                  onChange={(e) => update("characters", e.target.value)}
                  placeholder={t.charactersPlaceholder}
                />
              )}
            </>
          )}

          {step.id === "photos" && (
            <>
              <PhotoUpload
                label={t.childPhotos}
                hint={t.childPhotosHint}
                removeLabel={t.removePhoto}
                atLeastLabel={t.atLeastPhotos}
                tooLargeLabel={t.photoTooLarge}
                notImageLabel={t.photoNotImage}
                brokenLabel={t.photoBroken}
                files={data.childPhotos}
                min={3}
                max={5}
                onChange={(files) => update("childPhotos", files)}
              />

              <SwitchRow
                label={t.wantsSpecialPhoto}
                checked={data.wantsSpecialPhoto}
                onChange={(v) => update("wantsSpecialPhoto", v)}
              />
              {data.wantsSpecialPhoto && (
                <div className="space-y-2">
                  <PhotoUpload
                    label={t.specialPhoto}
                    hint={t.specialPhotoHint}
                    removeLabel={t.removePhoto}
                    atLeastLabel={t.atLeastPhotos}
                    tooLargeLabel={t.photoTooLarge}
                    notImageLabel={t.photoNotImage}
                    brokenLabel={t.photoBroken}
                    files={data.specialPhoto ? [data.specialPhoto] : []}
                    max={1}
                    onChange={(files) => update("specialPhoto", files[0] ?? null)}
                  />
                  <p className="font-sans text-[12px] text-text-secondary">
                    {t.specialPhotoNote}
                  </p>
                </div>
              )}

              {data.wantsCharacters && (
                <PhotoUpload
                  label={t.characterPhotos}
                  hint={t.characterPhotosHint}
                  removeLabel={t.removePhoto}
                  atLeastLabel={t.atLeastPhotos}
                  tooLargeLabel={t.photoTooLarge}
                  notImageLabel={t.photoNotImage}
                  brokenLabel={t.photoBroken}
                  files={data.characterPhotos}
                  max={9}
                  onChange={(files) => update("characterPhotos", files)}
                />
              )}
            </>
          )}

          {step.id === "review" && (
            <>
              <div className="rounded-lg border border-border-default p-4">
                <p className="mb-3 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-text-muted">
                  {t.heroesLabel}
                  <span className="mx-2 text-border-strong">·</span>
                  <span className="text-text-secondary">
                    {relationshipLabel(data.recipientRelationship, locale)}
                  </span>
                </p>
                <p className="font-display text-[16px] font-medium text-text-primary">
                  {heroLine}
                </p>
                {respectfulName && (
                  <p className="mt-2 font-sans text-[12.5px] text-text-secondary">
                    {respectfulName}
                  </p>
                )}
              </div>

              {/* What we gathered per child — the full portrait, plus the
                  per-behaviour situations and (collapsed, never exposed)
                  the private note (spec §50). */}
              {data.children.map((ch) => {
                const contexts = (ch.growthBehaviors ?? [])
                  .filter((b) => (b.context ?? "").trim().length > 0)
                  .map((b) => ({
                    label: growthFull(b.id, bookLoc),
                    context: (b.context ?? "").trim(),
                  }));
                const eb = ch.emotionalBridge;
                const hasPrivate =
                  !!eb &&
                  [eb.privateContext, eb.intendedFeeling, eb.heartMessage].some(
                    (s) => (s ?? "").trim().length > 0,
                  );
                return (
                  <div key={ch.id} className="space-y-3">
                    <ChildWorld
                      child={ch}
                      locale={bookLoc}
                      variant="full"
                      phase="character"
                    />
                    {contexts.length > 0 && (
                      <div className="rounded-md border border-border-subtle px-4 py-3">
                        <p className="mb-1.5 font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                          {t.reviewGrowthContext}
                        </p>
                        <ul className="space-y-1">
                          {contexts.map((c2, i) => (
                            <li
                              key={i}
                              className="font-sans text-[13px] leading-[1.5] text-text-secondary"
                            >
                              <span className="text-text-primary">{c2.label}</span> —{" "}
                              {c2.context}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {hasPrivate && (
                      <details className="rounded-md border border-border-subtle px-4 py-3">
                        <summary className="cursor-pointer font-sans text-[12px] font-medium text-text-secondary">
                          {t.reviewPrivateNote}
                        </summary>
                        <p className="mt-2 font-sans text-[12px] text-text-muted">
                          {t.reviewPrivateHint}
                        </p>
                        <div className="mt-2 space-y-1.5 font-sans text-[13px] leading-[1.55] text-text-secondary">
                          {(eb?.privateContext ?? "").trim() && (
                            <p>{eb!.privateContext!.trim()}</p>
                          )}
                          {(eb?.intendedFeeling ?? "").trim() && (
                            <p>{eb!.intendedFeeling!.trim()}</p>
                          )}
                          {(eb?.heartMessage ?? "").trim() && (
                            <p>“{eb!.heartMessage!.trim()}”</p>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}

              {data.wantsCharacters && data.characters.trim() && (
                <div className="rounded-md border border-border-subtle px-4 py-3">
                  <p className="mb-1 font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {t.reviewCharacters}
                  </p>
                  <p className="font-sans text-[13.5px] leading-[1.5] text-text-secondary">
                    {data.characters.trim()}
                  </p>
                </div>
              )}

              {/* Book language — a human question, stable codes (spec §39–41) */}
              <Field label={t.bookLanguageQ}>
                <div className="grid grid-cols-2 gap-2.5">
                  {BOOK_LANGUAGE_OPTIONS.map((opt) => {
                    const soon = opt.status === "soon";
                    const active = data.bookLanguageCode === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        disabled={soon}
                        aria-pressed={active}
                        onClick={() => !soon && update("bookLanguageCode", opt.code)}
                        className={[
                          "flex items-center justify-between rounded-md border px-3.5 py-2.5 text-left font-sans text-[13.5px] font-medium transition-colors disabled:cursor-not-allowed",
                          active
                            ? "border-accent-primary bg-accent-primary/[0.08] text-text-primary"
                            : "border-border-default bg-transparent text-text-primary",
                          soon ? "opacity-45" : "",
                        ].join(" ")}
                      >
                        <span>{opt.label}</span>
                        {soon && (
                          <span className="ms-2 shrink-0 font-sans text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                            {t.languageSoon}
                          </span>
                        )}
                        {active && !soon && (
                          <Check size={14} strokeWidth={2.5} className="text-accent-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* Contact number — the order's point of contact, needed
                  whether or not there is delivery. */}
              <Field label={t.phone}>
                <TextInput
                  type="tel"
                  autoComplete="tel"
                  value={data.orderer.phone}
                  onChange={(e) => updateOrderer("phone", e.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </Field>

              {/* Order region — the commercial market (spec §13, §16,
                  §44). Doubles as the destination question for a direct
                  /begin entry and the "change it without restarting"
                  control. Quiet, one row, not a dashboard. */}
              <Field label={t.orderRegion}>
                <div
                  role="radiogroup"
                  aria-label={t.orderRegion}
                  className="grid grid-cols-2 gap-2.5"
                >
                  {(["UZ", "INTERNATIONAL"] as const).map((m) => {
                    const on = data.market === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => changeMarket(m)}
                        className={[
                          "rounded-md border px-3.5 py-2.5 text-left font-sans text-[13.5px] font-medium transition-colors",
                          on
                            ? "border-accent-primary bg-accent-primary/[0.08] font-semibold text-text-primary"
                            : "border-border-default text-text-primary",
                        ].join(" ")}
                      >
                        {m === "UZ" ? t.marketUz : t.marketIntl}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {data.market === "INTERNATIONAL" && (
                <Field label={t.countryField}>
                  <select
                    className={inputClass}
                    value={data.orderer.deliveryAddress.countryCode}
                    onChange={(e) => updateAddress("countryCode", e.target.value)}
                  >
                    <option value="">{t.countrySelect}</option>
                    {COUNTRIES.filter((c) => c.code !== "UZ").map((c) => (
                      <option key={c.code} value={c.code}>
                        {bookLoc === "uz" ? c.labelUz : c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Delivery — an explicit choice, never assumed (spec C1). */}
              <Field label={t.deliveryQ}>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {(["delivery", "pickup"] as const).map((choice) => {
                    const on = data.orderer.deliveryAddress.choice === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        aria-pressed={on}
                        onClick={() => updateAddress("choice", choice)}
                        className={[
                          "rounded-md border px-3.5 py-2.5 text-left font-sans text-[13.5px] font-medium transition-colors",
                          on
                            ? "border-accent-primary bg-accent-primary/[0.08] text-text-primary"
                            : "border-border-default text-text-primary",
                        ].join(" ")}
                      >
                        {choice === "delivery" ? t.deliveryYes : t.deliveryNo}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {data.orderer.deliveryAddress.choice === "pickup" && (
                <p className="font-sans text-[13px] text-text-secondary">
                  {t.pickupSummary}
                </p>
              )}

              {wantsDelivery && data.market === "UZ" && (
                <>
                  {/* Region CODE drives the fee — never a free-text string.
                      Toshkent shahri is free; every other region is 40 000. */}
                  <Field label={t.deliveryRegionField}>
                    <select
                      className={inputClass}
                      value={data.orderer.deliveryAddress.regionCode}
                      onChange={(e) => updateAddress("regionCode", e.target.value)}
                    >
                      <option value="">{t.deliveryRegionPlaceholder}</option>
                      {DELIVERY_REGIONS.map((r) => (
                        <option key={r.code} value={r.code}>
                          {bookLoc === "uz" ? r.labelUz : r.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label={t.addrDistrict}>
                    <TextInput
                      autoComplete="address-level2"
                      value={data.orderer.deliveryAddress.district}
                      onChange={(e) => updateAddress("district", e.target.value)}
                    />
                  </Field>
                  <Field label={t.addrStreet}>
                    <TextInput
                      autoComplete="address-line1"
                      value={data.orderer.deliveryAddress.street}
                      onChange={(e) => updateAddress("street", e.target.value)}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t.addrBuilding}>
                      <TextInput
                        value={data.orderer.deliveryAddress.building}
                        onChange={(e) => updateAddress("building", e.target.value)}
                      />
                    </Field>
                    <Field label={`${t.addrApartment} ${t.optional}`}>
                      <TextInput
                        value={data.orderer.deliveryAddress.apartment ?? ""}
                        onChange={(e) => updateAddress("apartment", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label={`${t.addrLandmark} ${t.optional}`}>
                    <TextInput
                      value={data.orderer.deliveryAddress.landmark ?? ""}
                      onChange={(e) => updateAddress("landmark", e.target.value)}
                    />
                  </Field>

                  <div className="rounded-md border border-border-default p-4">
                    {data.orderer.deliveryAddress.location ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-sans text-[13px] font-medium text-text-primary">
                          <MapPin size={15} strokeWidth={1.75} className="text-accent-primary" />
                          {t.locationAttached}
                        </span>
                        <button
                          type="button"
                          onClick={clearLocation}
                          className="font-sans text-[12.5px] font-medium text-text-secondary underline underline-offset-4 hover:text-text-primary"
                        >
                          {t.locationClear}
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={requestLocation}
                          disabled={locState === "loading"}
                          className="inline-flex items-center gap-2 rounded-md border border-border-strong px-3.5 py-2 font-sans text-[13px] font-medium text-text-primary transition-colors hover:border-accent-primary disabled:opacity-60"
                        >
                          <MapPin size={15} strokeWidth={1.75} className="text-accent-primary" />
                          {locState === "loading" ? t.locationLoading : t.locationCta}
                        </button>
                        <p className="mt-2 font-sans text-[12px] leading-[1.5] text-text-secondary">
                          {locState === "denied"
                            ? t.locationDenied
                            : locState === "unsupported"
                              ? t.locationUnsupported
                              : t.locationHint}
                        </p>
                      </>
                    )}
                  </div>

                  {/* The fee, shown immediately here — updates the moment
                      the region changes (spec C7). */}
                  <div className="flex items-center justify-between rounded-md border border-border-subtle px-4 py-3 font-sans text-[13px]">
                    <span className="text-text-secondary">{t.rowDelivery}</span>
                    <span className="font-medium text-text-primary">
                      {totals.deliveryFee === 0
                        ? t.deliveryFree
                        : money(totals.deliveryFee)}
                    </span>
                  </div>
                </>
              )}

              {/* International postal address (spec §23) — a general
                  structure, not the Uzbek viloyat/tuman/mahalla shape. */}
              {wantsDelivery && data.market === "INTERNATIONAL" && (
                <>
                  <Field label={t.addrCity}>
                    <TextInput
                      autoComplete="address-level2"
                      value={data.orderer.deliveryAddress.intlCity ?? ""}
                      onChange={(e) => updateAddress("intlCity", e.target.value)}
                    />
                  </Field>
                  <Field label={`${t.addrState} ${t.optional}`}>
                    <TextInput
                      autoComplete="address-level1"
                      value={data.orderer.deliveryAddress.intlState ?? ""}
                      onChange={(e) => updateAddress("intlState", e.target.value)}
                    />
                  </Field>
                  <Field label={t.addrLine}>
                    <TextInput
                      autoComplete="address-line1"
                      value={data.orderer.deliveryAddress.intlLine1 ?? ""}
                      onChange={(e) => updateAddress("intlLine1", e.target.value)}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t.addrBuilding}>
                      <TextInput
                        value={data.orderer.deliveryAddress.intlBuilding ?? ""}
                        onChange={(e) => updateAddress("intlBuilding", e.target.value)}
                      />
                    </Field>
                    <Field label={`${t.addrApartment} ${t.optional}`}>
                      <TextInput
                        value={data.orderer.deliveryAddress.intlApartment ?? ""}
                        onChange={(e) => updateAddress("intlApartment", e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field label={`${t.addrPostal} ${t.optional}`}>
                    <TextInput
                      autoComplete="postal-code"
                      value={data.orderer.deliveryAddress.intlPostalCode ?? ""}
                      onChange={(e) => updateAddress("intlPostalCode", e.target.value)}
                    />
                  </Field>
                  <Field label={`${t.addrNote} ${t.optional}`}>
                    <TextArea
                      value={data.orderer.deliveryAddress.intlNote ?? ""}
                      onChange={(e) => updateAddress("intlNote", e.target.value)}
                    />
                  </Field>

                  <div className="flex items-center justify-between rounded-md border border-border-subtle px-4 py-3 font-sans text-[13px]">
                    <span className="text-text-secondary">{t.intlDelivery}</span>
                    <span className="font-medium text-text-primary">
                      {money(totals.deliveryFee)}
                    </span>
                  </div>
                  <p className="font-sans text-[12px] text-text-secondary">
                    {t.intlDeliveryHelp}
                  </p>
                </>
              )}

              <Field label={t.numberOfCopies}>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => update("copies", Math.max(1, data.copies - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default font-sans text-[16px] text-text-primary"
                    aria-label="−"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-sans text-[15px] font-medium text-text-primary">
                    {data.copies}
                  </span>
                  <button
                    type="button"
                    onClick={() => update("copies", Math.min(5, data.copies + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default font-sans text-[16px] text-text-primary"
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
              </Field>

              {/* Price breakdown — the customer must see WHY the total is
                  what it is; the delivery fee is never hidden (spec D/E). */}
              <div className="rounded-lg border border-border-default p-5">
                <div className="space-y-2 font-sans text-[13.5px]">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">{t.rowBook}</span>
                    <span className="text-text-primary">
                      {money(totals.bookSubtotal)}
                    </span>
                  </div>
                  {data.copies > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">
                        {t.rowExtraCopies(data.copies - 1)}
                      </span>
                      <span className="text-text-primary">
                        {money(totals.extraCopiesSubtotal)}
                      </span>
                    </div>
                  )}
                  {wantsDelivery && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">{deliveryRowLabel}</span>
                      <span className="text-text-primary">
                        {totals.deliveryFee === 0
                          ? t.deliveryFree
                          : money(totals.deliveryFee)}
                      </span>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-2">
                    <span className="text-text-secondary">{t.total}</span>
                    <span className="font-display text-[20px] font-medium text-text-primary">
                      {money(totals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {showStepError && !canContinue() && (
                <p role="alert" className="font-sans text-[13px] text-state-error">
                  {t.errReview}
                </p>
              )}
            </>
          )}

          {step.id === "payment" && (
            <>
              {/* A quiet reminder of which market's prices these are —
                  the full control lives one step back on Review. */}
              <p className="font-sans text-[12px] text-text-secondary">
                <span className="font-medium uppercase tracking-[0.12em] text-text-muted">
                  {t.orderRegion}
                </span>
                <span className="mx-2 text-border-strong">·</span>
                {data.market === "UZ" ? t.marketUz : t.marketIntl}
              </p>

              {/* The amount to pay IS the order grand total — same
                  deterministic figure as the review breakdown (spec F). */}
              <div className="rounded-lg border border-border-default p-5">
                <div className="space-y-1.5 font-sans text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">{t.rowBook}</span>
                    <span className="text-text-primary">
                      {money(totals.bookSubtotal)}
                    </span>
                  </div>
                  {data.copies > 1 && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">
                        {t.rowExtraCopies(data.copies - 1)}
                      </span>
                      <span className="text-text-primary">
                        {money(totals.extraCopiesSubtotal)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">
                      {deliveryRowLabel}
                      {wantsDelivery &&
                        data.market === "UZ" &&
                        data.orderer.deliveryAddress.regionCode &&
                        ` · ${deliveryRegionLabel(
                          data.orderer.deliveryAddress.regionCode,
                          bookLoc,
                        )}`}
                      {wantsDelivery &&
                        data.market === "INTERNATIONAL" &&
                        data.orderer.deliveryAddress.countryCode &&
                        ` · ${countryLabel(
                          data.orderer.deliveryAddress.countryCode,
                          bookLoc,
                        )}`}
                    </span>
                    <span className="text-text-primary">
                      {wantsDelivery
                        ? totals.deliveryFee === 0
                          ? t.deliveryFree
                          : money(totals.deliveryFee)
                        : t.pickupSummary}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-border-subtle pt-2">
                    <span className="font-medium text-text-secondary">
                      {t.payAmount}
                    </span>
                    <span className="font-display text-[20px] font-medium text-text-primary">
                      {money(totals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethodsForMarket(data.market).map((method) => {
                  const active = data.paymentMethod === method.id;
                  const available = method.status === "available";
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={!available}
                      onClick={() => available && update("paymentMethod", method.id)}
                      className={[
                        "relative rounded-md border p-3.5 text-left transition-colors disabled:cursor-not-allowed",
                        active
                          ? "border-accent-primary bg-accent-primary/[0.08]"
                          : "border-border-default bg-transparent",
                        available ? "opacity-100" : "opacity-50",
                      ].join(" ")}
                    >
                      <span className="block font-sans text-[13px] font-medium text-text-primary">
                        {method.label}
                      </span>
                      <span className="mt-0.5 block font-sans text-[11.5px] text-text-secondary">
                        {available
                          ? language === "UZ"
                            ? method.sublabelUz
                            : method.sublabel
                          : t.availableSoon}
                      </span>
                    </button>
                  );
                })}
              </div>

              {data.market === "UZ" && data.paymentMethod === "bank_transfer" && (
                <div className="rounded-lg border border-border-default p-5">
                  <div className="mb-4 space-y-2 font-sans text-[13.5px]">
                    <p className="text-text-secondary">
                      Humo: <span className="text-text-primary">9860 1701 1310 7875</span>
                    </p>
                    <p className="text-text-secondary">
                      MasterCard:{" "}
                      <span className="text-text-primary">5476 3800 9259 3482</span>
                    </p>
                  </div>
                  <PhotoUpload
                    label={t.uploadReceipt}
                    removeLabel={t.removePhoto}
                    atLeastLabel={t.atLeastPhotos}
                    files={data.receipt ? [data.receipt] : []}
                    max={1}
                    onChange={(files) => update("receipt", files[0] ?? null)}
                  />
                </div>
              )}

              {/* International online payment isn't switched on yet —
                  say so honestly, never convert the order to UZS or
                  fake a successful charge (spec §33, §65). The order is
                  still captured; payment is arranged after submit. */}
              {!marketHasOnlinePayment(data.market) && (
                <div className="rounded-lg border border-border-default bg-surface-raised/40 p-5">
                  <p className="font-sans text-[13px] font-medium text-text-primary">
                    {t.intlPayHeading}
                  </p>
                  <p className="mt-1.5 font-sans text-[12.5px] leading-[1.6] text-text-secondary">
                    {t.intlPayNotice}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-9 flex items-center justify-end">
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-5 py-2.5 font-sans text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
          >
            {isLastStep ? t.sendOrder : t.continue}
            <ArrowRight size={14} strokeWidth={1.75} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Small shared components ────────────────────────────────────────────────
//    The switch/toggle lives in ./Switch (SwitchRow) — one deterministic
//    geometry for every true on/off control in the flow.

const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

function PhotoUpload({
  label,
  hint,
  removeLabel,
  atLeastLabel,
  tooLargeLabel,
  notImageLabel,
  brokenLabel,
  files,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  removeLabel: string;
  atLeastLabel: (min: number) => string;
  tooLargeLabel?: string;
  notImageLabel?: string;
  brokenLabel?: string;
  files: File[];
  min?: number;
  max: number;
  onChange: (files: File[]) => void;
}) {
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // Client-side guards (spec §35): image type, a sane size ceiling, and
  // a "couldn't read this file" state for a corrupt image.
  const [notice, setNotice] = useState<string | null>(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  function accept(incoming: File[]) {
    setNotice(null);
    const ok: File[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) {
        setNotice(notImageLabel ?? "Please choose an image file.");
        continue;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        setNotice(tooLargeLabel ?? "That photo is too large.");
        continue;
      }
      ok.push(f);
    }
    if (ok.length) {
      setBroken({});
      onChange([...files, ...ok].slice(0, max));
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2.5">
        {previews.map(({ url }, i) => (
          <div
            key={i}
            className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-border-default"
          >
            {broken[i] ? (
              <span className="px-1 text-center font-sans text-[10px] leading-[1.2] text-state-error">
                {brokenLabel ?? "Couldn't read this image"}
              </span>
            ) : (
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(files.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60"
              aria-label={removeLabel}
            >
              <X size={12} strokeWidth={2} color="#fff" />
            </button>
          </div>
        ))}
        {files.length < max && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong transition-colors hover:border-solid">
            <Upload size={16} strokeWidth={1.5} className="text-text-secondary" />
            <input
              type="file"
              accept="image/*"
              multiple={max > 1}
              className="hidden"
              onChange={(e) => {
                accept(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {notice && (
        <span role="alert" className="mt-1.5 block font-sans text-[12px] text-state-error">
          {notice}
        </span>
      )}
      {min && files.length < min && (
        <span className="mt-1.5 block font-sans text-[12px] text-accent-primary">
          {atLeastLabel(min)}
        </span>
      )}
    </Field>
  );
}
