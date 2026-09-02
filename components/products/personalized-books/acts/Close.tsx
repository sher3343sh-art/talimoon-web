"use client";

/**
 * ACT 06 — EMOTIONAL CLOSE
 * ----------------------------------------------------------------
 * The page goes quiet again. One feeling, one final ask, then a
 * compact FAQ (four questions that actually stop a buyer). Nothing
 * commercial after this.
 */

import { useState } from "react";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

const COPY_EN = {
  heading: "What would you want to tell them today?",
  lines: ["“I believe in you.”", "“You can be kind.”", "“You can do this.”", "“I love you.”"],
  turn: "Now turn it into their story.",
  proposition: ["Made for them.", "Written to reach their heart.", "A story no one else will have."],
  cta: "Create my child's story →",
  faqHeading: "A few questions",
  faqs: [
    {
      q: "What if I don't know what to write?",
      a: "You don't need a finished story or a long text. The questions guide you step by step — you just answer them.",
    },
    {
      q: "Can one book include more than one child?",
      a: "Yes. Siblings can share a single story, each appearing as themselves. There's a multi-child option when you order.",
    },
    {
      q: "What kind of photos do you need?",
      a: "3–5 clear photos of your child, in good light — a mix of close and full-length. You upload them during the order.",
    },
    {
      q: "How long does it take?",
      a: "Most books are ready in 5–7 days: you review the story, then it's printed and delivered.",
    },
  ],
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Bugun siz unga nima deyishni istardingiz?",
  lines: ["“Men senga ishonaman.”", "“Sen mehribon bo‘la olasan.”", "“Sen buni uddalaysan.”", "“Men seni yaxshi ko‘raman.”"],
  turn: "Endi buni uning hikoyasiga aylantiring.",
  proposition: ["U uchun yaratilgan.", "Uning qalbiga yetadigan.", "Boshqa hech kimda bo‘lmaydigan hikoya."],
  cta: "Farzandimning hikoyasini yaratish →",
  faqHeading: "Bir nechta savol",
  faqs: [
    {
      q: "Nima yozishni bilmasam-chi?",
      a: "Sizdan tayyor hikoya yoki uzun matn kutilmaydi. Savollar Sizni bosqichma-bosqich yo‘naltiradi — Siz shunchaki javob berasiz.",
    },
    {
      q: "Bitta kitobda bir nechta farzand bo‘lishi mumkinmi?",
      a: "Ha. Aka-uka va opa-singillar bitta hikoyani bo‘lishishi, har biri o‘zi bo‘lib ishtirok etishi mumkin. Buyurtma paytida bir nechta farzand varianti bor.",
    },
    {
      q: "Qanday suratlar kerak?",
      a: "Farzandingizning yorug‘ joyda olingan 3–5 ta aniq surati — yaqindan va to‘liq bo‘yicha aralash. Ularni buyurtma paytida yuklaysiz.",
    },
    {
      q: "Qancha vaqt oladi?",
      a: "Ko‘pchilik kitoblar 5–7 kunda tayyor bo‘ladi: Siz hikoyani ko‘rib chiqasiz, so‘ng u chop etilib yetkaziladi.",
    },
  ],
};

export default function Close() {
  const t = useT(COPY_EN, COPY_UZ);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-labelledby="close-heading" className="w-full bg-surface-base">
      <div className="mx-auto max-w-[760px] px-5 py-16 text-center sm:px-8 md:py-20 lg:py-24">
        <Reveal>
          <div aria-hidden="true" className="mx-auto mb-9 h-px w-14 bg-accent-primary/40" />
          <h2
            id="close-heading"
            className="text-balance font-display text-[1.875rem] font-medium leading-[1.15] tracking-[-0.015em] text-text-primary sm:text-[2.5rem] md:text-[3rem]"
          >
            {t.heading}
          </h2>
        </Reveal>

        <Reveal delay={60} className="mt-8">
          <ul className="mx-auto flex max-w-[30ch] flex-col gap-1.5">
            {t.lines.map((l, i) => (
              <li
                key={i}
                className="font-display text-[1.1875rem] font-normal italic leading-[1.5] text-text-secondary md:text-[1.375rem]"
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-7 font-display text-[1.25rem] font-medium leading-[1.4] text-text-primary md:text-[1.4375rem]">
            {t.turn}
          </p>
        </Reveal>

        <Reveal delay={60} className="mt-10">
          <p className="mx-auto max-w-[40ch] font-sans text-[1.0625rem] leading-[1.7] text-text-secondary">
            {t.proposition.join(" ")}
          </p>
          <a
            href="#pricing"
            className="tm-cta-gold mt-8 inline-flex h-12 items-center justify-center px-7 font-sans text-[13.5px] font-medium tracking-[0.015em]"
          >
            {t.cta}
          </a>
        </Reveal>

        {/* Compact FAQ */}
        <div className="mx-auto mt-16 max-w-[620px] text-start md:mt-20">
          <h3 className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            {t.faqHeading}
          </h3>
          <dl className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
            {t.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <dt>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-[44px] w-full items-center justify-between gap-4 py-3.5 text-start font-sans text-[0.9375rem] font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
                    >
                      {f.q}
                      <span
                        aria-hidden="true"
                        className={`shrink-0 text-accent-primary transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                  </dt>
                  {isOpen && (
                    <dd className="pb-4 font-sans text-[0.9375rem] leading-[1.7] text-text-secondary">
                      {f.a}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
