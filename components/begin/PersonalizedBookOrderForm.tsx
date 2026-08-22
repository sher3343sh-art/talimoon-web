"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
} from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import {
  BOOK_LANGUAGES,
  BookType,
  MAX_TRAITS,
  PAYMENT_METHODS,
  PRICING,
  STEPS,
  TRAITS,
  TraitId,
  calculatePrice,
  formatSom,
} from "./orderFormData";

// ─── Copy ───────────────────────────────────────────────────────────────────

const CHROME_EN = {
  back: "Back",
  continue: "Continue",
  sendOrder: "Send order",
  successHeading: "Your story is on its way",
  successBody: (phone: string) =>
    `We've received every detail. Our team will reach out on ${phone} once your book is ready to begin.`,

  fullName: "Full name",
  fullNamePlaceholder: "Parent or guardian's name",
  phone: "Phone number",
  region: "Region",
  city: "City",

  howManyChildren: "How many children?",
  namePlaceholder: "Name",
  agePlaceholder: "Age",
  pagesUnit: "pages",

  interests: "What do they love doing?",
  interestsHint: "Hobbies, favorite games, anything that lights them up.",
  dreams: "What do they dream of becoming?",
  qualities: (max: number) => `Qualities to highlight (choose up to ${max})`,
  weaknesses: "Anything to gently work on?",
  weaknessesHint: "Optional — habits or behaviors you'd like the story to address.",
  extraInfo: "Anything else that makes the story more personal?",

  giftFrom: "Who is this gift from?",
  giftFromHint: "Name and relationship — e.g. Mom, Nilufar",
  wantsPersonalMessage: "Add a personal message",
  personalMessagePlaceholder: "A note that will appear at the end of the book",
  wantsCharacters: "Include other characters",
  charactersPlaceholder: "Names and relationship — e.g. sister Madina, grandfather",

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
};

const CHROME_UZ: typeof CHROME_EN = {
  back: "Orqaga",
  continue: "Davom etish",
  sendOrder: "Buyurtma yuborish",
  successHeading: "Hikoyangiz yo'lda",
  successBody: (phone: string) =>
    `Barcha ma'lumotlarni qabul qildik. Kitobingiz tayyor bo'lganda jamoamiz ${phone} raqamiga bog'lanadi.`,

  fullName: "To'liq ism",
  fullNamePlaceholder: "Ota-ona yoki vasiyning ismi",
  phone: "Telefon raqami",
  region: "Viloyat",
  city: "Shahar",

  howManyChildren: "Nechta farzand?",
  namePlaceholder: "Ismi",
  agePlaceholder: "Yoshi",
  pagesUnit: "bet",

  interests: "Ular nimani yaxshi ko'radi?",
  interestsHint: "Sevimli mashg'ulotlari, o'yinlari — ularni quvontiradigan narsalar.",
  dreams: "Kim bo'lishni orzu qilishadi?",
  qualities: (max: number) => `Ta'kidlanadigan fazilatlar (${max} tagacha tanlang)`,
  weaknesses: "Astoydil ishlov berish kerak bo'lgan narsa bormi?",
  weaknessesHint: "Ixtiyoriy — hikoya orqali yumshoq ishora qilinishini istagan odat yoki xatti-harakat.",
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
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface Child {
  name: string;
  age: string;
}

interface FormData {
  fullName: string;
  phone: string;
  region: string;
  city: string;
  bookType: BookType;
  children: Child[];
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

const EMPTY: FormData = {
  fullName: "",
  phone: "",
  region: "",
  city: "",
  bookType: "single",
  children: [{ name: "", age: "" }],
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
}: {
  onBack: () => void;
}) {
  const { language } = useLanguage();
  const t = useT(CHROME_EN, CHROME_UZ);
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const step = STEPS[stepIndex];
  const stepEyebrow = language === "UZ" ? step.eyebrowUz : step.eyebrow;
  const stepTitle = language === "UZ" ? step.titleUz : step.title;
  const isLastStep = stepIndex === STEPS.length - 1;
  const price = useMemo(
    () => calculatePrice(data.bookType, data.copies),
    [data.bookType, data.copies]
  );

  // Accepts either a plain value or a `(prev) => next` updater, mirroring
  // React's own setState overload. The updater form is required for any
  // field computed FROM its own current value (traits, children) — two
  // clicks fired in the same tick (e.g. selecting two trait pills in
  // quick succession) both close over the same pre-render `data`, so
  // computing `[...data.traits, x]` from that stale snapshot lets the
  // second click silently overwrite the first. Reading `prev[key]`
  // instead reads React's own queued value, so both updates apply.
  function update<K extends keyof FormData>(
    key: K,
    value: FormData[K] | ((prev: FormData[K]) => FormData[K])
  ) {
    setData((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? (value as (p: FormData[K]) => FormData[K])(prev[key]) : value,
    }));
  }

  function canContinue(): boolean {
    switch (step.id) {
      case "contact":
        return (
          data.fullName.trim().length > 1 &&
          data.phone.trim().length > 5 &&
          data.region.trim().length > 0 &&
          data.city.trim().length > 0
        );
      case "book":
        return data.children.every(
          (c) => c.name.trim().length > 0 && c.age.trim().length > 0
        );
      case "personalize":
        return data.interests.trim().length > 0 && data.traits.length > 0;
      case "personal-touch":
        return data.giftFrom.trim().length > 0;
      case "photos":
        return data.childPhotos.length >= 3;
      case "review":
        return data.bookLanguage.length > 0;
      case "payment":
        return true;
      default:
        return true;
    }
  }

  function goNext() {
    if (!canContinue()) return;
    if (isLastStep) {
      // TODO: wire to backend (Drive upload + admin notification) once
      // the order-intake API exists. For now this only demonstrates the
      // completed, validated form state.
      setSubmitted(true);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      onBack();
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[560px] w-full max-w-container-content flex-col items-center justify-center bg-surface-base px-6 pb-16 pt-32 text-center">
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/[0.14]">
          <Check size={24} strokeWidth={2} className="text-accent-primary" />
        </span>
        <h2 className="font-display text-[26px] font-medium text-text-primary">
          {t.successHeading}
        </h2>
        <p className="mt-2 max-w-sm font-sans text-[14px] leading-[1.6] text-text-secondary">
          {t.successBody(data.phone)}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-container-content bg-surface-base px-6 pb-14 pt-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-secondary transition-opacity hover:opacity-70"
            >
              <ArrowLeft size={14} strokeWidth={1.75} />
              {t.back}
            </button>
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-accent-primary">
              {stepEyebrow}
            </span>
          </div>
          <div className="h-[2px] w-full overflow-hidden rounded-pill bg-border-subtle">
            <div
              className="h-full rounded-pill bg-accent-primary transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="mb-8 font-display text-[26px] font-medium leading-tight text-text-primary">
          {stepTitle}
        </h2>

        {/* Step content */}
        <div className="space-y-5">
          {step.id === "contact" && (
            <>
              <Field label={t.fullName}>
                <TextInput
                  value={data.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                />
              </Field>
              <Field label={t.phone}>
                <TextInput
                  type="tel"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.region}>
                  <TextInput
                    value={data.region}
                    onChange={(e) => update("region", e.target.value)}
                  />
                </Field>
                <Field label={t.city}>
                  <TextInput
                    value={data.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {step.id === "book" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {(["single", "multi"] as BookType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      update("bookType", type);
                      if (type === "single") {
                        update("children", (prev) => [prev[0] ?? { name: "", age: "" }]);
                      } else {
                        update("children", (prev) =>
                          prev.length < 2
                            ? [{ name: "", age: "" }, { name: "", age: "" }]
                            : prev
                        );
                      }
                    }}
                    className={[
                      "rounded-md border p-4 text-left transition-colors",
                      data.bookType === type
                        ? "border-accent-primary bg-accent-primary/[0.08]"
                        : "border-border-default bg-transparent",
                    ].join(" ")}
                  >
                    <span className="block font-sans text-[13.5px] font-medium text-text-primary">
                      {language === "UZ" ? PRICING[type].labelUz : PRICING[type].label}
                    </span>
                    <span className="mt-0.5 block font-sans text-[12px] text-text-secondary">
                      {PRICING[type].pages} {t.pagesUnit} · {formatSom(PRICING[type].base)}
                    </span>
                  </button>
                ))}
              </div>

              {data.bookType === "multi" && (
                <Field label={t.howManyChildren}>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        update("children", (prev) => (prev.length <= 2 ? prev : prev.slice(0, -1)));
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default font-sans text-[16px] text-text-primary"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-sans text-[15px] font-medium text-text-primary">
                      {data.children.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        update("children", (prev) =>
                          prev.length >= 6 ? prev : [...prev, { name: "", age: "" }]
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default font-sans text-[16px] text-text-primary"
                    >
                      +
                    </button>
                  </div>
                </Field>
              )}

              <div className="space-y-3">
                {data.children.map((child, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-4 font-sans text-[13px] text-text-secondary">
                      {i + 1}.
                    </span>
                    <div className="flex-1">
                      <TextInput
                        placeholder={t.namePlaceholder}
                        value={child.name}
                        onChange={(e) => {
                          const value = e.target.value;
                          update("children", (prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], name: value };
                            return next;
                          });
                        }}
                      />
                    </div>
                    <div className="w-20">
                      <TextInput
                        placeholder={t.agePlaceholder}
                        value={child.age}
                        onChange={(e) => {
                          const value = e.target.value;
                          update("children", (prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], age: value };
                            return next;
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step.id === "personalize" && (
            <>
              <Field label={t.interests} hint={t.interestsHint}>
                <TextArea
                  value={data.interests}
                  onChange={(e) => update("interests", e.target.value)}
                />
              </Field>
              <Field label={t.dreams}>
                <TextArea
                  value={data.dreams}
                  onChange={(e) => update("dreams", e.target.value)}
                />
              </Field>
              <Field label={t.qualities(MAX_TRAITS)}>
                <div className="flex flex-wrap gap-2">
                  {TRAITS.map((trait) => {
                    const active = data.traits.includes(trait.id);
                    return (
                      <button
                        key={trait.id}
                        type="button"
                        onClick={() => {
                          update("traits", (prev) =>
                            prev.includes(trait.id)
                              ? prev.filter((id) => id !== trait.id)
                              : prev.length < MAX_TRAITS
                                ? [...prev, trait.id]
                                : prev
                          );
                        }}
                        className={[
                          "rounded-pill border px-3.5 py-1.5 font-sans text-[12.5px] font-medium transition-colors",
                          active
                            ? "border-accent-primary bg-accent-primary text-white"
                            : "border-border-default bg-transparent text-text-primary",
                        ].join(" ")}
                      >
                        {language === "UZ" ? trait.uz : trait.en}
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label={t.weaknesses} hint={t.weaknessesHint}>
                <TextArea
                  value={data.weaknesses}
                  onChange={(e) => update("weaknesses", e.target.value)}
                />
              </Field>
              <Field label={t.extraInfo}>
                <TextArea
                  value={data.extraInfo}
                  onChange={(e) => update("extraInfo", e.target.value)}
                />
              </Field>
            </>
          )}

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
              <Field label={t.bookLanguage}>
                <div className="grid grid-cols-2 gap-2.5">
                  {BOOK_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
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
                        {available ? (language === "UZ" ? method.sublabelUz : method.sublabel) : t.availableSoon}
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
            disabled={!canContinue()}
            className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-5 py-2.5 font-sans text-[13.5px] font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastStep ? t.sendOrder : t.continue}
            <ArrowRight size={14} strokeWidth={1.75} />
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
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-border-default px-3.5 py-3 transition-colors"
    >
      <span className="font-sans text-[13.5px] font-medium text-text-primary">{label}</span>
      <span
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
  // Object URLs are created once per file (not on every render) and
  // revoked on cleanup to avoid leaking memory during a long form session.
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
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
