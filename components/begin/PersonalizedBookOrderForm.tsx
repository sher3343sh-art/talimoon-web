"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Upload, X } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { toLocale } from "@/lib/journey/types";
import {
  BOOK_LANGUAGES,
  BookType,
  PAYMENT_METHODS,
  STEPS,
  TraitId,
  calculatePrice,
  formatSom,
} from "./orderFormData";
import {
  bookTypeForChildCount,
  emptyChild,
  emptyOrderer,
  type ChildProfile,
  type Orderer,
  type Phase01Result,
} from "@/lib/order/types";
import Phase02 from "./Phase02";
import Phase03 from "./Phase03";
import {
  formatRespectfulName,
  relationshipLabel,
  type RecipientRelationship,
} from "@/lib/order/relationship";
import Phase01 from "./Phase01";
import { JourneyProgress } from "./JourneyProgress";

// ─── Copy ───────────────────────────────────────────────────────────────────

const CHROME_EN = {
  back: "Back",
  continue: "Continue",
  sendOrder: "Send order",
  successHeading: "Your story is on its way",
  successBody: (phone: string) =>
    `We've received every detail. Our team will reach out on ${phone} once your book is ready to begin.`,

  heroesLabel: "Heroes of this story",
  years: (age: number | null) => (age == null ? "" : `, ${age}`),

  phone: "Phone number",
  region: "Region",
  city: "City",
  deliveryHint: "Where should the finished book reach you?",

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
  specialPhoto: "Special photo",
  specialPhotoHint: "Kept in its natural form — not stylized",
  characterPhotos: "Character photos",
  characterPhotosHint: "1–3 photos per additional character",
  atLeastPhotos: (min: number) => `At least ${min} photos required`,
  removePhoto: "Remove photo",

  bookLanguage: "Book language",
  numberOfCopies: "Number of copies",
  total: "Total",

  availableSoon: "Available soon",
  uploadReceipt: "Upload payment receipt",

  errContact: "Please add a phone number and where to deliver.",
};

const CHROME_UZ: typeof CHROME_EN = {
  back: "Orqaga",
  continue: "Davom etish",
  sendOrder: "Buyurtma yuborish",
  successHeading: "Hikoyangiz yo'lda",
  successBody: (phone: string) =>
    `Barcha ma'lumotlarni qabul qildik. Kitobingiz tayyor bo'lganda jamoamiz ${phone} raqamiga bog'lanadi.`,

  heroesLabel: "Hikoya qahramonlari",
  years: (age: number | null) => (age == null ? "" : `, ${age} yosh`),

  phone: "Telefon raqami",
  region: "Viloyat",
  city: "Shahar",
  deliveryHint: "Tayyor kitob Sizga qayerga yetib borsin?",

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
  wantsCharacters: "Boshqa qahramonlarni qo'shish",
  charactersPlaceholder: "Ism va qarindoshlik — masalan: opasi Madina, bobosi",

  childPhotos: "Farzand suratlari",
  childPhotosHint: "Yuzi aniq ko'rinadigan, yaxshi yoritilgan 3–5 ta surat",
  wantsSpecialPhoto: "Yakuniy sahifa uchun maxsus surat qo'shish",
  specialPhoto: "Maxsus surat",
  specialPhotoHint: "Tabiiy holida saqlanadi — stilizatsiya qilinmaydi",
  characterPhotos: "Qahramonlar suratlari",
  characterPhotosHint: "Har bir qo'shimcha qahramon uchun 1–3 ta surat",
  atLeastPhotos: (min: number) => `Kamida ${min} ta surat kerak`,
  removePhoto: "Suratni o'chirish",

  bookLanguage: "Kitob tili",
  numberOfCopies: "Nusxalar soni",
  total: "Jami",

  availableSoon: "Tez orada mavjud bo'ladi",
  uploadReceipt: "To'lov chekini yuklang",

  errContact: "Iltimos, telefon raqami va yetkazish manzilini kiriting.",
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  orderer: Orderer;
  recipientRelationship: RecipientRelationship;
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
  bookLanguage: string;
  copies: number;
  paymentMethod: string;
  receipt: File | null;
}

function emptyForm(): FormData {
  return {
    orderer: emptyOrderer(),
    recipientRelationship: { type: "parent" },
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
    bookLanguage: "",
    copies: 1,
    paymentMethod: "bank_transfer",
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
}: {
  onBack: () => void;
  /**
   * Pre-selects the child count when the form is entered from a
   * pricing card that already committed to a book type (e.g.
   * PricingSection on the product page). Omitted for the /begin flow.
   */
  initialBookType?: BookType;
}) {
  const { language } = useLanguage();
  const locale = toLocale(language);
  const t = useT(CHROME_EN, CHROME_UZ);

  const [phase, setPhase] = useState<
    "intro" | "world" | "character" | "steps"
  >("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<FormData>(emptyForm);
  const [phase01Seeded, setPhase01Seeded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showStepError, setShowStepError] = useState(false);

  const step = STEPS[stepIndex];
  const stepTitle = language === "UZ" ? step.titleUz : step.title;
  const isLastStep = stepIndex === STEPS.length - 1;
  const price = useMemo(
    () => calculatePrice(data.bookType, data.copies),
    [data.bookType, data.copies],
  );

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
      case "review":
        return (
          data.bookLanguage.length > 0 &&
          data.orderer.phone.trim().length > 5 &&
          data.orderer.region.trim().length > 0 &&
          data.orderer.city.trim().length > 0
        );
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
    if (isLastStep) {
      // TODO: wire to backend (upload + admin notification) once the
      // order-intake API exists. Validated form state only for now.
      setSubmitted(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setShowStepError(false);
  }

  function goBack() {
    if (stepIndex === 0) {
      setPhase("intro");
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
        onComplete={() => setPhase("character")}
      />
    );
  }

  // ── Phase 03: the child's character ─────────────────────────────────────
  if (phase === "character") {
    return (
      <Phase03
        childrenIn={data.children}
        onPatchChild={patchChild}
        onBack={() => setPhase("world")}
        onComplete={() => {
          setPhase("steps");
          setStepIndex(0);
          setShowStepError(false);
        }}
      />
    );
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[560px] w-full max-w-container-content flex-col items-center justify-center bg-surface-base px-6 py-16 text-center md:py-20 lg:py-28">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/[0.14]">
          <Check size={24} strokeWidth={2} className="text-accent-primary" />
        </span>
        <h2 className="font-display text-[26px] font-medium text-text-primary">
          {t.successHeading}
        </h2>
        <p className="mt-2 max-w-sm font-sans text-[14px] leading-[1.6] text-text-secondary">
          {t.successBody(data.orderer.phone)}
        </p>
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

              <ToggleRow
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

              <ToggleRow
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
                files={data.childPhotos}
                min={3}
                max={5}
                onChange={(files) => update("childPhotos", files)}
              />

              <ToggleRow
                label={t.wantsSpecialPhoto}
                checked={data.wantsSpecialPhoto}
                onChange={(v) => update("wantsSpecialPhoto", v)}
              />
              {data.wantsSpecialPhoto && (
                <PhotoUpload
                  label={t.specialPhoto}
                  hint={t.specialPhotoHint}
                  removeLabel={t.removePhoto}
                  atLeastLabel={t.atLeastPhotos}
                  files={data.specialPhoto ? [data.specialPhoto] : []}
                  max={1}
                  onChange={(files) => update("specialPhoto", files[0] ?? null)}
                />
              )}

              {data.wantsCharacters && (
                <PhotoUpload
                  label={t.characterPhotos}
                  hint={t.characterPhotosHint}
                  removeLabel={t.removePhoto}
                  atLeastLabel={t.atLeastPhotos}
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

              <p className="pt-1 font-sans text-[13px] text-text-secondary">
                {t.deliveryHint}
              </p>
              <Field label={t.phone}>
                <TextInput
                  type="tel"
                  autoComplete="tel"
                  value={data.orderer.phone}
                  onChange={(e) => updateOrderer("phone", e.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.region}>
                  <TextInput
                    value={data.orderer.region}
                    onChange={(e) => updateOrderer("region", e.target.value)}
                  />
                </Field>
                <Field label={t.city}>
                  <TextInput
                    value={data.orderer.city}
                    onChange={(e) => updateOrderer("city", e.target.value)}
                  />
                </Field>
              </div>

              <Field label={t.bookLanguage}>
                <div className="grid grid-cols-2 gap-2.5">
                  {BOOK_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={data.bookLanguage === lang}
                      onClick={() => update("bookLanguage", lang)}
                      className={[
                        "rounded-md border px-3.5 py-2.5 text-left font-sans text-[13.5px] font-medium text-text-primary transition-colors",
                        data.bookLanguage === lang
                          ? "border-accent-primary bg-accent-primary/[0.08]"
                          : "border-border-default bg-transparent",
                      ].join(" ")}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </Field>

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

              <div className="rounded-lg border border-border-default p-5">
                <div className="flex items-center justify-between font-sans text-[13.5px]">
                  <span className="text-text-secondary">{t.total}</span>
                  <span className="font-display text-[20px] font-medium text-text-primary">
                    {formatSom(price)}
                  </span>
                </div>
              </div>

              {showStepError && !canContinue() && (
                <p role="alert" className="font-sans text-[13px] text-state-error">
                  {t.errContact}
                </p>
              )}
            </>
          )}

          {step.id === "payment" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
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

              {data.paymentMethod === "bank_transfer" && (
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

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-border-default px-3.5 py-3 transition-colors"
    >
      <span className="font-sans text-[13.5px] font-medium text-text-primary">{label}</span>
      <span
        aria-hidden="true"
        className={[
          "relative h-5 w-9 rounded-pill transition-colors",
          checked ? "bg-accent-primary" : "bg-text-primary/[0.16]",
        ].join(" ")}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </span>
    </button>
  );
}

function PhotoUpload({
  label,
  hint,
  removeLabel,
  atLeastLabel,
  files,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  removeLabel: string;
  atLeastLabel: (min: number) => string;
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

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2.5">
        {previews.map(({ url }, i) => (
          <div
            key={i}
            className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-border-default"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
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
                const selectedFiles = Array.from(e.target.files ?? []);
                onChange([...files, ...selectedFiles].slice(0, max));
              }}
            />
          </label>
        )}
      </div>
      {min && files.length < min && (
        <span className="mt-1.5 block font-sans text-[12px] text-accent-primary">
          {atLeastLabel(min)}
        </span>
      )}
    </Field>
  );
}
