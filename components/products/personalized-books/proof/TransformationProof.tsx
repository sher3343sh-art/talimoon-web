"use client";

/**
 * TransformationProof — Personalized Books Sales V2, chapter 05.
 * ----------------------------------------------------------------
 * Replaces BookShowcase's "A Story Written Only For Them" + its four
 * repeated feature bullets (those move to PhysicalProduct). This
 * section has ONE job: PROVE the personalization is real, almost
 * without reading —
 *
 *   your child's photo → their TALIMOON character → their book
 *   cover → an open page of their story
 *
 * Assets: TALIMOON has no real photo→character→cover→page sequence on
 * file yet, and the brief is explicit — do not fabricate proof, do
 * not invent a customer child, do not draw on canonical
 * Yusuf/Yasmina art here. So each frame is a LABELLED ASSET SLOT:
 * pass a real `src` when the production sequence lands and the slot
 * becomes the finished image with zero further layout work. Until
 * then it renders an honest placeholder naming exactly what belongs
 * there. See the page's completion report for the asset spec.
 */

import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

interface Frame {
  step: string;
  label: string;
  /** Real asset once produced; placeholder slot until then. */
  src?: string;
  alt: string;
}

const COPY_EN = {
  eyebrow: "Real personalization",
  heading: "From one photo to a story of their own.",
  lead:
    "This is not a ready-made story with a child's name inserted. The story begins with your child.",
  frames: [
    { step: "You give us", label: "Your child's photo", alt: "The photograph a parent uploads of their child" },
    { step: "We draw", label: "Their TALIMOON character", alt: "The child rendered as an illustrated TALIMOON story character" },
    { step: "We build", label: "Their book cover", alt: "The personalized book cover with the child as the hero" },
    { step: "They open", label: "A page of their story", alt: "An open spread from the child's personalized story" },
  ] satisfies Frame[],
  slotNote: "Final artwork in production",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Haqiqiy shaxsiylashtirish",
  heading: "Bir suratdan — uning o‘z hikoyasigacha.",
  lead:
    "Bu tayyor hikoyaga bolaning ismini qo‘shish emas. Hikoya farzandingizning o‘zidan boshlanadi.",
  frames: [
    { step: "Siz berasiz", label: "Farzandingizning surati", alt: "Ota-ona yuklaydigan bolaning surati" },
    { step: "Biz chizamiz", label: "Uning TALIMOON qahramoni", alt: "Bola illyustratsiyalangan TALIMOON qahramoni sifatida" },
    { step: "Biz yaratamiz", label: "Uning kitob muqovasi", alt: "Bola bosh qahramon bo‘lgan shaxsiylashtirilgan kitob muqovasi" },
    { step: "U ochadi", label: "Hikoyasining sahifasi", alt: "Bolaning shaxsiylashtirilgan hikoyasidan ochiq sahifa" },
  ] satisfies Frame[],
  slotNote: "Yakuniy rasm tayyorlanmoqda",
};

function FrameCard({ frame, note }: { frame: Frame; note: string }) {
  return (
    <figure className="flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px] border border-[var(--border-subtle,rgba(42,36,29,0.12))] bg-[var(--surface-warm-200,#EFE7DA)]">
        {frame.src ? (
          <Image
            src={frame.src}
            alt={frame.alt}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 80vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="text-[var(--text-primary,#2A241D)]/30"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.6" />
              <path d="M4 17l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <figcaption className="font-sans text-[0.8125rem] font-medium leading-[1.4] text-[var(--text-primary,#2A241D)]/70">
              {frame.label}
            </figcaption>
            <span className="font-sans text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--text-primary,#2A241D)]/40">
              {note}
            </span>
          </div>
        )}
      </div>
      <p className="mt-3 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#BA8450)]">
        {frame.step}
      </p>
      <p className="mt-1 font-serif text-[1rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
        {frame.label}
      </p>
    </figure>
  );
}

export default function TransformationProof() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="proof-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <Reveal className="max-w-[640px]">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
            {t.eyebrow}
          </p>
          <h2
            id="proof-heading"
            className="mt-3 font-serif text-[1.875rem] font-medium leading-[1.15] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.25rem] md:text-[2.625rem]"
          >
            {t.heading}
          </h2>
        </Reveal>

        {/* the sequence — horizontal progression on desktop, a stacked
            column on mobile. Connecting chevrons are decorative. */}
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {t.frames.map((frame, i) => (
            <Reveal key={i} delay={i * 70} className="relative">
              <FrameCard frame={frame} note={t.slotNote} />
              {i < t.frames.length - 1 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="absolute right-[-16px] top-[38%] hidden text-[var(--text-primary,#2A241D)]/25 lg:block"
                >
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={80} className="mt-12 max-w-[46ch] md:mt-16">
          <p className="font-serif text-[1.25rem] font-medium leading-[1.5] text-[var(--text-primary,#2A241D)] md:text-[1.4375rem]">
            {t.lead}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
