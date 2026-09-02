"use client";

/**
 * Objections — Personalized Books Sales V2, chapter 08 (sits directly
 * under pricing).
 * ----------------------------------------------------------------
 * Not a general FAQ. Five questions only — the real ones that stop an
 * otherwise-interested parent from ordering — answered short. Every
 * answer states a current, true rule (photo count, production window,
 * delivery), nothing aspirational.
 *
 * Quiet single-open accordion; chevron rotation and panel reveal are
 * disabled under prefers-reduced-motion (the panel just shows).
 */

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

interface QA {
  q: string;
  a: string;
}

const COPY_EN = {
  heading: "Before you order",
  items: [
    {
      q: "What if I don't know what to write?",
      a: "We don't expect a finished story or a long text from you. Our questions guide you step by step — you just answer them.",
    },
    {
      q: "Can one book include more than one child?",
      a: "Yes. Siblings can share a single story, each appearing as themselves. There's a multi-child option when you order.",
    },
    {
      q: "What kind of photos do you need?",
      a: "3–5 clear photos of your child — a mix of close and full-length, in good light. You upload them during the order.",
    },
    {
      q: "How long does the book take?",
      a: "Usually 5–7 days after you confirm your details. Each book is printed to order.",
    },
    {
      q: "How does delivery work?",
      a: "Uzbekistan: free within Tashkent city, 40 000 so‘m to other regions. International: a flat $15 per order. You choose delivery at checkout.",
    },
  ] satisfies QA[],
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Buyurtma berishdan oldin",
  items: [
    {
      q: "Nima yozishni bilmasam-chi?",
      a: "Sizdan tayyor hikoya yoki uzun matn kutmaymiz. Savollarimiz Sizni bosqichma-bosqich yo‘naltiradi — Siz shunchaki javob berasiz.",
    },
    {
      q: "Bir kitobda bir nechta farzand bo‘lishi mumkinmi?",
      a: "Ha. Aka-uka va opa-singillar bitta hikoyada, har biri o‘zi bo‘lib qatnashishi mumkin. Buyurtma vaqtida bir nechta farzand varianti bor.",
    },
    {
      q: "Qanday rasmlar kerak?",
      a: "Farzandingizning 3–5 ta aniq surati — yaqin va bo‘y-basti bilan, yaxshi yorug‘likda. Ularni buyurtma vaqtida yuklaysiz.",
    },
    {
      q: "Kitob qancha vaqtda tayyor bo‘ladi?",
      a: "Odatda ma’lumotlaringizni tasdiqlaganingizdan so‘ng 5–7 kun. Har bir kitob buyurtma asosida chop etiladi.",
    },
    {
      q: "Yetkazib berish qanday ishlaydi?",
      a: "O‘zbekiston: Toshkent shahri ichida bepul, boshqa viloyatlarga 40 000 so‘m. Xalqaro: buyurtmasiga bir martalik $15. Yetkazib berishni to‘lov bosqichida tanlaysiz.",
    },
  ] satisfies QA[],
};

export default function Objections() {
  const t = useT(COPY_EN, COPY_UZ);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="objections-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)] pb-16 pt-4 md:pb-20 lg:pb-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2
              id="objections-heading"
              className="font-serif text-[1.5rem] font-medium leading-[1.2] tracking-[-0.01em] text-[var(--text-primary,#2A241D)] sm:text-[1.75rem]"
            >
              {t.heading}
            </h2>
          </Reveal>

          <div className="mt-6 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))] border-y border-[var(--border-subtle,rgba(42,36,29,0.12))]">
            {t.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`objection-panel-${i}`}
                      id={`objection-trigger-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-[0.9375rem] font-medium text-[var(--text-primary,#2A241D)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#BA8450)] md:py-5 md:text-[1rem]"
                    >
                      {item.q}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className={[
                          "shrink-0 text-[var(--text-secondary,#49433C)] transition-transform duration-200 motion-reduce:transition-none",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={`objection-panel-${i}`}
                    role="region"
                    aria-labelledby={`objection-trigger-${i}`}
                    hidden={!isOpen}
                    className="pb-5 pr-8"
                  >
                    <p className="font-sans text-[0.9375rem] leading-[1.7] text-[var(--text-secondary,#49433C)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
