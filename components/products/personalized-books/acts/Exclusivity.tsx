"use client";

/**
 * ACT 04 — EXCLUSIVITY · Desire
 * ----------------------------------------------------------------
 * The turn from "parental need" to "I want this object". Premium
 * product imagery (the existing TALIMOON book mockups) beside a
 * short, exclusive claim: this book cannot exist anywhere else,
 * because this child exists nowhere else. No fake-luxury language,
 * no invented testimonials — the "Bu men-ku!" beat is framed as the
 * described experience of a child seeing themselves, not a quote
 * attributed to a customer.
 */

import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

const COPY_EN = {
  eyebrow: "Made for one child",
  heading: "You won't find this book in a shop.",
  follow: "Because your child isn't there.",
  items: ["Their name.", "Their likeness.", "Their world.", "Their loved ones.", "Their story."],
  recognitionLabel: "The moment they open it",
  recognition: "“That's me!”",
  recognitionNote:
    "A child turns a page and finds their own face, their own room, the people they love — living inside the adventure.",
  imageAlt: "A child joyfully discovering herself inside her personalized TALIMOON story",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Bitta bola uchun yaratilgan",
  heading: "Bunday kitobni do‘kondan topolmaysiz.",
  follow: "Chunki u yerda sizning farzandingiz yo‘q.",
  items: ["Uning ismi.", "Uning qiyofasi.", "Uning dunyosi.", "Uning yaqinlari.", "Uning hikoyasi."],
  recognitionLabel: "U kitobni ochgan lahza",
  recognition: "“Bu men-ku!”",
  recognitionNote:
    "Bola sahifani ochadi va o‘z yuzini, o‘z xonasini, sevgan insonlarini — sarguzasht ichida yashayotgan holda ko‘radi.",
  imageAlt: "Bola o‘zini TALIMOON hikoyasi ichida quvonch bilan kashf etmoqda",
};

export default function Exclusivity() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      id="exclusivity"
      aria-labelledby="exclusivity-heading"
      className="w-full scroll-mt-20 bg-surface-base md:scroll-mt-24"
    >
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 md:py-16 lg:py-20">
        {/* Eyebrow + headline — a wide, centred section header above the
            image/text composition. The headline spreads horizontally
            (one line on a normal desktop, a balanced two lines when it
            has to wrap) — never a narrow column, never a manual break. */}
        <Reveal className="mx-auto max-w-[1000px] text-center">
          <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            {t.eyebrow}
          </p>
          <h2
            id="exclusivity-heading"
            className="mt-4 text-balance font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] text-text-primary sm:text-[2.125rem] md:text-[2.5rem]"
          >
            {t.heading}
          </h2>
        </Reveal>

        {/* Image + claim */}
        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Product imagery — the real TALIMOON book, from the hero
              photograph (the strongest genuine product asset in the repo). */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-[460px] overflow-hidden rounded-[14px] shadow-[0_18px_48px_-18px_rgba(33,29,24,0.20)] ring-1 ring-border-subtle lg:max-w-none">
              <Image
                src="/images/products/personalized-books/exclusivity/exclusive-book-moment.webp"
                alt={t.imageAlt}
                fill
                sizes="(min-width: 1024px) 46vw, 90vw"
                quality={100}
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          {/* Claim */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="font-display text-[1.25rem] font-medium leading-[1.4] text-text-secondary md:text-[1.4375rem]">
                {t.follow}
              </p>
            </Reveal>

            <ul className="mt-8 space-y-2.5">
              {t.items.map((it, i) => (
                <Reveal
                  as="li"
                  key={i}
                  delay={i * 60}
                  y={8}
                  className="flex items-baseline gap-3 font-display text-[1.125rem] font-normal leading-[1.4] text-text-primary md:text-[1.28rem]"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent-primary" />
                  {it}
                </Reveal>
              ))}
            </ul>

            <Reveal delay={60} className="mt-12 border-s-2 border-accent-primary/40 ps-5 md:mt-14">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                {t.recognitionLabel}
              </p>
              <p className="mt-1.5 font-display text-[1.5rem] font-medium italic leading-[1.3] text-text-primary md:text-[1.75rem]">
                {t.recognition}
              </p>
              <p className="mt-2 max-w-[44ch] font-sans text-[0.9375rem] leading-[1.7] text-text-secondary">
                {t.recognitionNote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
