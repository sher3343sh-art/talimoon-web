"use client";

/**
 * StorySolution — Personalized Books Sales V2, chapter 03.
 * ----------------------------------------------------------------
 * The turn of the page: from SAYING the lesson to LETTING THE CHILD
 * EXPERIENCE IT through a story. Two movements in one continuous
 * chapter:
 *
 *   A) the bridge — a few bare imperatives ("Be patient." "Try
 *      again.") resolving into the line the whole page turns on:
 *      "Nasihatni hikoyaga aylantiramiz." / "We turn guidance into
 *      story."
 *
 *   B) one short interactive micro-story that DEMONSTRATES the
 *      mechanism instead of describing it: the hero tries, it doesn't
 *      work, the visitor makes the choice, and the story shows where
 *      that choice leads.
 *
 * Deliberately restrained claims: a story is offered as ANOTHER way a
 * parent can support a lesson they're already teaching — never "this
 * works better than parenting", never "this fixes the child".
 *
 * This is the page's one deep-navy beat — the chapter visibly shifts
 * key here, then the page returns to warm cream.
 */

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal, usePrefersReducedMotion } from "../_shared/Reveal";

type Choice = "retry" | "back";

const COPY_EN = {
  imperatives: ["Be patient.", "Try again.", "Learn to share.", "Be responsible."],
  bridge:
    "Maybe this time we won't only tell them. We'll let them live it inside a story.",
  keyLine: "We turn guidance into story.",
  keyNote:
    "Not instead of what you teach — alongside it. A personalized story becomes one more way the lesson reaches your child.",
  demoEyebrow: "See how it works",
  situationLabel: "When they give up quickly",
  parentUsuallySays: "“Try again. Don't give up so fast.”",
  setup:
    "In a TALIMOON story, your child is the hero. The hero tries something. It doesn't work the first time. Now there is a choice:",
  choiceBack: "Turn back",
  choiceRetry: "Try once more",
  afterRetry:
    "The hero tries once more — and this time something shifts. The story carries on, and your child feels where that choice led.",
  afterBack:
    "The hero turns back, and the story quietly shows what that path holds. A little later, another chance to choose comes around.",
  again: "Make the other choice",
  resolve1: "We never tell a child “you give up.”",
  resolve2:
    "We build a story that shows them a different choice — through a hero who feels close to them.",
};

const COPY_UZ: typeof COPY_EN = {
  imperatives: ["Sabr qil.", "Yana urinib ko‘r.", "Bo‘lishishni o‘rgan.", "Mas’uliyatli bo‘l."],
  bridge:
    "Balki bu safar unga faqat aytib bermasmiz. Uni hikoyada boshdan kechirishiga imkon berarmiz.",
  keyLine: "Nasihatni hikoyaga aylantiramiz.",
  keyNote:
    "Siz o‘rgatayotgan narsa o‘rniga emas — u bilan yonma-yon. Shaxsiylashtirilgan hikoya nasihat farzandingizga yetadigan yana bir yo‘lga aylanadi.",
  demoEyebrow: "Qanday ishlashini ko‘ring",
  situationLabel: "Tez taslim bo‘lganda",
  parentUsuallySays: "“Yana urinib ko‘r. Darrov taslim bo‘lma.”",
  setup:
    "TALIMOON hikoyasida farzandingiz — bosh qahramon. Qahramon biror narsani sinab ko‘radi. Birinchi urinishda bo‘lmaydi. Endi tanlov bor:",
  choiceBack: "Ortga qaytish",
  choiceRetry: "Yana bir marta urinib ko‘rish",
  afterRetry:
    "Qahramon yana bir marta urinadi — va bu safar nimadir o‘zgaradi. Hikoya davom etadi, farzandingiz esa bu tanlov qayerga olib borganini his qiladi.",
  afterBack:
    "Qahramon ortga qaytadi va hikoya bu yo‘lda nima borligini sokin ko‘rsatadi. Biroz o‘tib, yana tanlov qilish imkoni keladi.",
  again: "Boshqa tanlovni ko‘rish",
  resolve1: "Biz bolaga “sen taslim bo‘lasan” demaymiz.",
  resolve2:
    "Unga boshqa tanlovni o‘ziga yaqin qahramon orqali ko‘rsatadigan hikoya yaratamiz.",
};

export default function StorySolution() {
  const t = useT(COPY_EN, COPY_UZ);
  const reduced = usePrefersReducedMotion();
  const [choice, setChoice] = useState<Choice | null>(null);

  return (
    <section
      aria-labelledby="story-solution-heading"
      className="w-full bg-[#1C2A3A] text-[#F3ECDF]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-32">
        {/* ── A · the bridge ─────────────────────────────────────── */}
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
              {t.imperatives.map((line, i) => (
                <li
                  key={i}
                  className="font-sans text-[0.9375rem] text-[#F3ECDF]/45 md:text-[1rem]"
                >
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80} className="mt-7 flex justify-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 28"
              width="22"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-[#C79A4B]"
            >
              <path d="M12 2v22M5 17l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Reveal>

          <Reveal delay={120}>
            <p className="mx-auto mt-7 max-w-[40ch] font-sans text-[1.0625rem] leading-[1.7] text-[#F3ECDF]/80 md:text-[1.125rem]">
              {t.bridge}
            </p>
            <h2
              id="story-solution-heading"
              className="mt-8 font-serif text-[2rem] font-medium leading-[1.15] tracking-[-0.015em] text-[#F3ECDF] sm:text-[2.5rem] md:text-[3rem]"
            >
              {t.keyLine}
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] font-sans text-[0.9375rem] leading-[1.7] text-[#F3ECDF]/60">
              {t.keyNote}
            </p>
          </Reveal>
        </div>

        {/* ── B · the micro-story ────────────────────────────────── */}
        <Reveal
          delay={60}
          className="mx-auto mt-16 max-w-[640px] rounded-2xl border border-[#F3ECDF]/12 bg-[#F3ECDF]/[0.04] p-6 md:mt-20 md:p-9"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C79A4B]">
            {t.demoEyebrow}
          </p>

          <p className="mt-4 font-serif text-[1.25rem] font-medium leading-[1.35] text-[#F3ECDF] md:text-[1.4375rem]">
            {t.situationLabel}
          </p>
          <p className="mt-2 font-sans text-[0.9375rem] italic leading-[1.6] text-[#F3ECDF]/55">
            {t.parentUsuallySays}
          </p>

          <p className="mt-6 font-sans text-[0.9375rem] leading-[1.7] text-[#F3ECDF]/80">
            {t.setup}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setChoice("back")}
              aria-pressed={choice === "back"}
              className={[
                "min-h-[44px] flex-1 rounded-lg border px-4 py-2.5 font-sans text-[0.9375rem] transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C79A4B]",
                choice === "back"
                  ? "border-[#C79A4B] bg-[#C79A4B]/15 text-[#F3ECDF]"
                  : "border-[#F3ECDF]/25 text-[#F3ECDF]/80 hover:border-[#F3ECDF]/50",
              ].join(" ")}
            >
              {t.choiceBack}
            </button>
            <button
              type="button"
              onClick={() => setChoice("retry")}
              aria-pressed={choice === "retry"}
              className={[
                "min-h-[44px] flex-1 rounded-lg border px-4 py-2.5 font-sans text-[0.9375rem] transition-colors duration-200 motion-reduce:transition-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C79A4B]",
                choice === "retry"
                  ? "border-[#C79A4B] bg-[#C79A4B]/15 text-[#F3ECDF]"
                  : "border-[#F3ECDF]/25 text-[#F3ECDF]/80 hover:border-[#F3ECDF]/50",
              ].join(" ")}
            >
              {t.choiceRetry}
            </button>
          </div>

          {choice && (
            <div
              className="mt-6 border-t border-[#F3ECDF]/12 pt-6"
              style={
                reduced
                  ? undefined
                  : { animation: "pb-fade-in 420ms cubic-bezier(0.22,1,0.36,1)" }
              }
            >
              <p className="font-sans text-[0.9375rem] leading-[1.7] text-[#F3ECDF]/85">
                {choice === "retry" ? t.afterRetry : t.afterBack}
              </p>
              <button
                type="button"
                onClick={() => setChoice(choice === "retry" ? "back" : "retry")}
                className="mt-3 font-sans text-[0.875rem] font-medium text-[#C79A4B] underline underline-offset-4 hover:text-[#F3ECDF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C79A4B]"
              >
                {t.again}
              </button>

              <p className="mt-6 font-serif text-[1.0625rem] font-medium leading-[1.5] text-[#F3ECDF]">
                {t.resolve1}
              </p>
              <p className="mt-1.5 font-sans text-[0.9375rem] leading-[1.7] text-[#F3ECDF]/75">
                {t.resolve2}
              </p>
            </div>
          )}

          <style>{`
            @keyframes pb-fade-in {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </Reveal>
      </div>
    </section>
  );
}
