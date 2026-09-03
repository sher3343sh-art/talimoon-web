"use client";

/**
 * ACT 03 — THE TALIMOON METHOD · Solution
 * ----------------------------------------------------------------
 * The page's one deep-navy beat. Reveals the mechanism by SHOWING,
 * not explaining: the parent picks what they want to nurture, and
 * the panel shows how that meaning is carried inside a story where
 * the child is the hero — never a behavioural guarantee, always
 * "another way the meaning reaches your child".
 *
 * Interactive but light: one useState, three chips, a panel that
 * cross-fades (respecting prefers-reduced-motion). No motion lib.
 */

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal, usePrefersReducedMotion } from "../_shared/Reveal";

interface Example {
  wish: string;
  parentSays: string;
  inStory: string;
}

const COPY_EN = {
  eyebrow: "How it works",
  heading: ["We don't repeat the lesson.", "We turn it into their story."],
  pickLabel: "What would you like to nurture in your child?",
  examples: [
    {
      wish: "More self-belief",
      parentSays: "“I wish they trusted themselves a little more.”",
      inStory:
        "The hero meets something hard, makes a choice, tries — and lives a small, real victory. They are never told “believe in yourself.” They see the strength that was already theirs, inside the story.",
    },
    {
      wish: "Kinder to their sibling",
      parentSays: "“I wish they were gentler with their brother.”",
      inStory:
        "Instead of “don't fight,” the siblings enter an adventure that only works when each one's strength matters. They feel — inside the story — that they need each other.",
    },
    {
      wish: "Curious about learning",
      parentSays: "“I wish they were more curious about school.”",
      inStory:
        "Knowledge becomes something the hero actually uses to move forward. Learning stops being a task and becomes the thing that carries the adventure.",
    },
  ] satisfies Example[],
  close: [
    "You tell us what you want to reach their heart.",
    "We turn it into a story they’ll come back to on their own.",
  ],
  cta: "What do I want to pass on? →",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Qanday ishlaydi",
  heading: ["Nasihatni takrorlamaymiz.", "Uni uning hikoyasiga aylantiramiz."],
  pickLabel: "Farzandingizda nimani tarbiyalamoqchisiz?",
  examples: [
    {
      wish: "O‘ziga ishonch",
      parentSays: "“O‘ziga ko‘proq ishonsa edi.”",
      inStory:
        "Qahramon qiyinchilikka duch keladi, qaror qiladi, urinib ko‘radi va kichik, chin g‘alabani boshdan kechiradi. Unga faqat “o‘zingga ishon” deyilmaydi — u o‘zidagi kuchni hikoya ichida ko‘radi.",
    },
    {
      wish: "Ukasiga mehr",
      parentSays: "“Ukasiga mehribonroq bo‘lsa edi.”",
      inStory:
        "“Urishmanglar” degan nasihat o‘rniga, aka-uka faqat bir-birining kuchi kerak bo‘lgan sarguzashtga kiradi. Ular bir-biriga kerak ekanini hikoyada his qiladi.",
    },
    {
      wish: "O‘qishga qiziqish",
      parentSays: "“O‘qishga qiziqsa edi.”",
      inStory:
        "Bilim qahramonga oldinga siljish uchun kerak bo‘lib qoladi. O‘qish vazifa bo‘lishdan to‘xtab, sarguzashtni olib boradigan narsaga aylanadi.",
    },
  ] satisfies Example[],
  close: [
    "Siz qalbiga nimani singdirmoqchi ekaningizni aytasiz.",
    "Biz uni farzandingiz sevib qaytadigan hikoyaga aylantiramiz.",
  ],
  cta: "Farzandimga nimani yetkazmoqchiman? →",
};

export default function Method() {
  const t = useT(COPY_EN, COPY_UZ);
  const roleParent = useT("The parent", "Ota-ona");
  const roleStory = useT("Inside the story", "Hikoya ichida");
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const ex = t.examples[active] ?? t.examples[0]!;

  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="w-full scroll-mt-20 bg-surface-contrast text-text-inverse md:scroll-mt-24"
    >
      <div className="mx-auto max-w-[1000px] px-5 py-14 sm:px-8 md:py-16 lg:py-20">
        <Reveal className="max-w-[640px]">
          <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#C79A4B]">
            {t.eyebrow}
          </p>
          <h2
            id="method-heading"
            className="mt-4 font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] sm:text-[2.25rem] md:text-[2.625rem]"
          >
            {t.heading[0]}
            <br />
            <span className="text-[#F0DDA6]">{t.heading[1]}</span>
          </h2>
        </Reveal>

        <Reveal delay={60} className="mt-10 md:mt-12">
          <p className="font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-text-inverse-muted">
            {t.pickLabel}
          </p>
          <div role="tablist" aria-label={t.pickLabel} className="mt-3 flex flex-wrap gap-2.5">
            {t.examples.map((e, i) => {
              const on = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={[
                    "min-h-[44px] rounded-full border px-4 py-2 font-sans text-[0.9375rem] transition-colors duration-200 motion-reduce:transition-none",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C79A4B]",
                    on
                      ? "border-[#C79A4B] bg-[#C79A4B]/20 font-medium text-text-inverse"
                      : "border-text-inverse/25 text-text-inverse/75 hover:border-text-inverse/50",
                  ].join(" ")}
                >
                  {e.wish}
                </button>
              );
            })}
          </div>

          <div
            key={active}
            className="mt-7 grid gap-6 rounded-2xl border border-text-inverse/12 bg-text-inverse/[0.04] p-6 md:mt-8 md:grid-cols-[minmax(0,15rem)_1fr] md:p-8"
            style={
              reduced ? undefined : { animation: "pb-method-fade 380ms cubic-bezier(0.22,1,0.36,1)" }
            }
          >
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-text-inverse-muted">
                {roleParent}
              </p>
              <p className="mt-2 font-display text-[1.1875rem] font-medium italic leading-[1.45] text-text-inverse md:text-[1.3125rem]">
                {ex.parentSays}
              </p>
            </div>
            <div className="md:border-s md:border-text-inverse/12 md:ps-8">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C79A4B]">
                {roleStory}
              </p>
              <p className="mt-2 font-sans text-[0.9375rem] leading-[1.75] text-text-inverse/85 md:text-[1rem]">
                {ex.inStory}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={60} className="mt-12 max-w-[52ch] md:mt-14">
          <p className="font-display text-[1.125rem] font-medium leading-[1.55] text-text-inverse md:text-[1.25rem]">
            {t.close[0]}
          </p>
          <p className="mt-1.5 font-sans text-[0.9375rem] leading-[1.7] text-text-inverse/75 md:text-[1rem]">
            {t.close[1]}
          </p>
          <a
            href="#pricing"
            className="mt-7 inline-flex min-h-[44px] items-center font-sans text-[0.9375rem] font-medium text-[#F0DDA6] underline decoration-[#C79A4B]/50 decoration-1 underline-offset-[6px] transition-colors hover:decoration-[#F0DDA6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C79A4B]"
          >
            {t.cta}
          </a>
        </Reveal>
      </div>

      <style>{`
        @keyframes pb-method-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
