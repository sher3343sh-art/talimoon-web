"use client";

import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

/**
 * EmotionalBanner — Personalized Books Sales V2, chapter 10 (the
 * close).
 * ----------------------------------------------------------------
 * The quiet ending. No features, no company story, no Values recap —
 * one feeling and one last ask. Unlike the earlier (CTA-less) version
 * of this section, Sales V2 makes the final ask here per the brief:
 * a single primary CTA into the on-page order flow (`#pricing`, which
 * carries the visitor's chosen market into PersonalizedBookOrderForm),
 * plus one short line that lowers the step of starting.
 */

const COPY_EN = {
  heading: "One day they'll grow up. This story stays.",
  paragraph:
    "Keep who your child is today — what they love, and what you want to pass on to them — inside a story that is theirs.",
  cta: "Create My Child's Story →",
  frictionReducer: "You begin by introducing them to us — just a few minutes.",
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Bir kun u ulg‘ayadi. Bu hikoya esa qoladi.",
  paragraph:
    "Farzandingiz bugun kim ekanini, nimani sevishini va Siz unga nimalarni yetkazmoqchi ekaningizni uning o‘z hikoyasida saqlang.",
  cta: "Farzandimning hikoyasini yaratish →",
  frictionReducer: "Bir necha daqiqada uni bizga tanishtirishdan boshlaysiz.",
};

export default function EmotionalBanner() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="emotional-banner-heading"
      className="relative bg-surface-base py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <div aria-hidden="true" className="mx-auto mb-10 h-px w-14 bg-accent-primary/40 sm:mb-14 sm:w-16" />
          <h2
            id="emotional-banner-heading"
            className="text-balance font-serif text-[2.25rem] font-normal leading-[1.15] tracking-tight text-text-primary sm:text-5xl sm:leading-[1.12] lg:text-6xl lg:leading-[1.1]"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-7 max-w-[52ch] text-pretty font-sans text-lg leading-relaxed text-text-secondary sm:mt-8">
            {t.paragraph}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
            <a
              href="#pricing"
              className="tm-cta-gold inline-flex h-12 items-center justify-center px-7 font-sans text-[13.5px] font-medium tracking-[0.015em]"
            >
              {t.cta}
            </a>
            <p className="font-sans text-[13px] text-text-secondary">{t.frictionReducer}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
