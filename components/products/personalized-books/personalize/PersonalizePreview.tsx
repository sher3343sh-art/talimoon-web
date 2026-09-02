"use client";

/**
 * PersonalizePreview — Personalized Books Sales V2, chapter 06.
 * ----------------------------------------------------------------
 * Replaces InsideBook's "What Your Child Will Discover" feature list.
 * The page's most imaginative moment: the visitor watches one child
 * (Fayzbek, 9) turn from "a nine-year-old" into a specific person,
 * then tries the same move for a situation they recognise — and sees
 * the story direction it would take.
 *
 * HARD boundaries (brief §10):
 *  - not the real order form, and visibly not checkout
 *  - collects NOTHING — no inputs, no child data, no persistence
 *  - does not duplicate /begin
 *  - one prebuilt example + a single-select situation explorer, no
 *    gamification
 */

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

interface Row {
  q: string;
  a: string;
}
interface Situation {
  key: string;
  label: string;
  value: string;
  direction: string;
}

const COPY_EN = {
  eyebrow: "Imagine it for your child",
  heading: "The moment a child stops being “a child” and becomes someone specific.",
  exampleName: "Fayzbek",
  exampleAge: "Age 9",
  rows: [
    { q: "What does he love?", a: "Space" },
    { q: "What does he dream of?", a: "Becoming a pilot" },
    { q: "His strength", a: "Kind-hearted" },
    { q: "What you want to support", a: "Patience" },
    { q: "A line from you", a: "“I believe in you.”" },
  ] satisfies Row[],
  reveal: "Now this is no longer simply “a nine-year-old child.” This is Fayzbek.",
  tryHeading: "Now try it for a situation you recognise",
  tryHint: "Pick one — see the direction a story would take. Nothing is saved.",
  resultPrefix: "The story would support",
  situations: [
    {
      key: "gives-up",
      label: "Gives up quickly",
      value: "Courage",
      direction:
        "A story about courage — even when it's hard, the hero chooses to take one more step.",
    },
    {
      key: "waiting",
      label: "Finds it hard to wait",
      value: "Patience",
      direction:
        "A story about patience — the hero lives through the worth of waiting and steadying themselves.",
    },
    {
      key: "confidence",
      label: "Loses confidence in themselves",
      value: "Confidence",
      direction:
        "A story about self-belief — the hero finds their own strength through small, real wins.",
    },
    {
      key: "reminders",
      label: "Always needs reminding",
      value: "Responsibility",
      direction:
        "A story about responsibility — the hero comes to do their part without being told.",
    },
    {
      key: "sharing",
      label: "Sharing is still hard",
      value: "Kindness",
      direction:
        "A story about kindness — sharing and thinking of others becomes meaningful to the hero inside the events.",
    },
    {
      key: "big-feelings",
      label: "Big feelings are hard to hold",
      value: "Patience",
      direction:
        "A story about steadiness — the hero learns to sit with a strong feeling before acting on it.",
    },
  ] satisfies Situation[],
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Farzandingiz uchun tasavvur qiling",
  heading: "Bola “bola” bo‘lishdan to‘xtab, aniq bir insonga aylanadigan lahza.",
  exampleName: "Fayzbek",
  exampleAge: "9 yosh",
  rows: [
    { q: "U nimani yaxshi ko‘radi?", a: "Kosmos" },
    { q: "U nimani orzu qiladi?", a: "Uchuvchi bo‘lish" },
    { q: "Uning kuchli jihati", a: "Mehribon" },
    { q: "Siz nimani qo‘llab-quvvatlamoqchisiz?", a: "Sabr" },
    { q: "Sizdan qoladigan gap", a: "“Men senga ishonaman.”" },
  ] satisfies Row[],
  reveal: "Endi bu shunchaki “9 yoshli bola” emas. Bu Fayzbek.",
  tryHeading: "Endi o‘zingiz taniydigan holat uchun sinab ko‘ring",
  tryHint: "Birini tanlang — hikoya qaysi yo‘nalishni olishini ko‘ring. Hech narsa saqlanmaydi.",
  resultPrefix: "Hikoya quyidagini qo‘llab-quvvatlaydi:",
  situations: [
    {
      key: "gives-up",
      label: "Tez taslim bo‘ladi",
      value: "Jasorat",
      direction:
        "Jasorat haqidagi hikoya — qiyin bo‘lsa ham, qahramon yana bir qadam tashlashni tanlaydi.",
    },
    {
      key: "waiting",
      label: "Kutishga qiynaladi",
      value: "Sabr",
      direction:
        "Sabr haqidagi hikoya — qahramon kutish va o‘zini bosishning qiymatini o‘z boshidan kechiradi.",
    },
    {
      key: "confidence",
      label: "O‘ziga ishonmay qoladi",
      value: "O‘ziga ishonch",
      direction:
        "O‘ziga ishonch haqidagi hikoya — qahramon o‘z kuchini kichik, haqiqiy g‘alabalar orqali topadi.",
    },
    {
      key: "reminders",
      label: "Doim eslatish kerak",
      value: "Mas’uliyat",
      direction:
        "Mas’uliyat haqidagi hikoya — qahramon o‘z ishini eslatilmasdan bajarishga o‘zi keladi.",
    },
    {
      key: "sharing",
      label: "Bo‘lishish qiyin",
      value: "Mehribonlik",
      direction:
        "Mehribonlik haqidagi hikoya — bo‘lishish va boshqalarni o‘ylash voqealar ichida qahramon uchun ma’noli bo‘lib qoladi.",
    },
    {
      key: "big-feelings",
      label: "Hissiyotini boshqarish qiyin",
      value: "Sabr",
      direction:
        "Bosiqlik haqidagi hikoya — qahramon kuchli hissiyotni harakatdan oldin his qilishni o‘rganadi.",
    },
  ] satisfies Situation[],
};

export default function PersonalizePreview() {
  const t = useT(COPY_EN, COPY_UZ);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = t.situations.find((s) => s.key === activeKey) ?? null;

  return (
    <section
      aria-labelledby="personalize-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16">
        {/* left — the Fayzbek example */}
        <div>
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
              {t.eyebrow}
            </p>
            <h2
              id="personalize-heading"
              className="mt-3 font-serif text-[1.75rem] font-medium leading-[1.18] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.125rem] md:text-[2.375rem]"
            >
              {t.heading}
            </h2>
          </Reveal>

          <Reveal
            delay={80}
            className="mt-8 rounded-2xl border border-[var(--border-subtle,rgba(42,36,29,0.12))] bg-[var(--surface-overlay,#fff)]/60 p-6 md:p-7"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-[1.5rem] font-medium text-[var(--text-primary,#2A241D)]">
                {t.exampleName}
              </span>
              <span className="font-sans text-[0.875rem] text-[var(--text-secondary,#49433C)]">
                {t.exampleAge}
              </span>
            </div>
            <dl className="mt-4 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
              {t.rows.map((row, i) => (
                <div key={i} className="flex items-baseline justify-between gap-6 py-2.5">
                  <dt className="font-sans text-[0.875rem] text-[var(--text-secondary,#49433C)]">
                    {row.q}
                  </dt>
                  <dd className="text-right font-sans text-[0.9375rem] font-medium text-[var(--text-primary,#2A241D)]">
                    {row.a}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 font-serif text-[1.1875rem] font-medium leading-[1.5] text-[var(--text-primary,#2A241D)] md:text-[1.3125rem]">
              {t.reveal}
            </p>
          </Reveal>
        </div>

        {/* right — try it */}
        <div className="lg:pt-16">
          <Reveal>
            <h3 className="font-serif text-[1.375rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)] md:text-[1.5rem]">
              {t.tryHeading}
            </h3>
            <p className="mt-2 font-sans text-[0.875rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
              {t.tryHint}
            </p>
          </Reveal>

          <Reveal delay={70} className="mt-6 flex flex-wrap gap-2.5">
            {t.situations.map((s) => {
              const on = s.key === activeKey;
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActiveKey(on ? null : s.key)}
                  className={[
                    "min-h-[44px] rounded-full border px-4 py-2 font-sans text-[0.875rem] transition-colors duration-200 motion-reduce:transition-none",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#BA8450)]",
                    on
                      ? "border-[var(--accent-primary,#BA8450)] bg-[var(--accent-primary,#BA8450)]/12 font-medium text-[var(--text-primary,#2A241D)]"
                      : "border-[var(--border-default,rgba(42,36,29,0.18))] text-[var(--text-secondary,#49433C)] hover:border-[var(--text-primary,#2A241D)]/40",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              );
            })}
          </Reveal>

          <div className="mt-6 min-h-[132px]" aria-live="polite">
            {active && (
              <div
                className="rounded-xl border border-[var(--border-subtle,rgba(42,36,29,0.12))] bg-[var(--surface-warm-200,#EFE7DA)]/60 p-5"
                style={{ animation: "pb-pv-in 380ms cubic-bezier(0.22,1,0.36,1)" }}
              >
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#BA8450)]">
                  {t.resultPrefix}
                </p>
                <p className="mt-1.5 font-serif text-[1.25rem] font-medium text-[var(--text-primary,#2A241D)]">
                  {active.value}
                </p>
                <p className="mt-2 font-sans text-[0.9375rem] leading-[1.7] text-[var(--text-secondary,#49433C)]">
                  {active.direction}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pb-pv-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pb-pv-in"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
