"use client";

/**
 * ACT 05 — "QANDAY YARATILADI" · the product-journey stage
 * ----------------------------------------------------------------
 * The showcase immediately before pricing. Not three identical cards:
 * an art-directed editorial sequence where the genuine TALIMOON
 * "How It Works" photography dominates and the visitor visually
 * travels CHILD -> STORY -> PHYSICAL BOOK. Step 03 (the finished
 * hardcovers) is the visual climax, and the section closes tight so
 * PRODUCT -> VALUE -> PRICE reads as one decision.
 *
 * Imagery: the original "How It Works" assets — CorelDRAW SVGs whose
 * embedded artwork was extracted losslessly and re-encoded to WebP
 * (the .svg originals were 7-8 MB UTF-16 and render null through
 * next/image). Same pictures, web-usable container.
 *
 * A single hairline warm-gold "story thread" links the three beats.
 * It draws in once on scroll and then holds; prefers-reduced-motion
 * gets it fully drawn, static. `PricingSection` (#pricing, market +
 * order form) is rendered straight after, untouched.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal, usePrefersReducedMotion } from "../_shared/Reveal";
import PricingSection from "../pricing/PricingSection";

const IMG = "/images/products/personalized-books/how-it-works";

interface JourneyStepData {
  n: string;
  title: string;
  body: string;
  img: string;
  alt: string;
  /** object-position for the editorial crop of this frame. */
  pos: string;
}

const COPY_EN = {
  eyebrow: "How it's made",
  heading: ["You tell it.", "We turn it into a book."],
  support: "A few simple steps — and your child is holding their own story.",
  steps: [
    {
      n: "01",
      title: "You tell us about your child",
      body: "A few simple questions about their world, their interests, and what matters to you.",
      img: `${IMG}/step-1-family-details.webp`,
      alt: "A family looking together at a tablet, filling in details about their child",
      pos: "50% 44%",
    },
    {
      n: "02",
      title: "We picture their world",
      body: "Every scene and illustration is made so your child feels like the true hero of the story.",
      img: `${IMG}/step-2-create-story.webp`,
      alt: "A writer shaping the personalized story, with the draft and illustrations on screen",
      pos: "52% 42%",
    },
    {
      n: "03",
      title: "Their book comes into the world",
      body: "You review it, it's printed with care, and it reaches your family.",
      img: `${IMG}/step-3-printed-with-care.webp`,
      alt: "Finished personalized hardcover books in the TALIMOON print studio, with a gift box",
      pos: "50% 50%",
    },
  ] satisfies JourneyStepData[],
  trust:
    "Hardcover · anime-style illustration from your photos · built only from what you tell us · ready in 7–10 days",
  cta: "Begin their story →",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Qanday yaratiladi",
  heading: ["Siz aytib berasiz.", "Biz uni kitobga aylantiramiz."],
  support:
    "Bir necha oddiy qadam — va farzandingiz o'z hikoyasini qo'lida ushlab turadi.",
  steps: [
    {
      n: "01",
      title: "Farzandingiz haqida aytib berasiz",
      body: "Uning dunyosi, qiziqishlari va Siz uchun muhim narsalar haqida bir necha oddiy savol.",
      img: `${IMG}/step-1-family-details.webp`,
      alt: "Oila birga planshetda farzandi haqidagi ma'lumotlarni to'ldirmoqda",
      pos: "50% 44%",
    },
    {
      n: "02",
      title: "Uning dunyosini tasvirlaymiz",
      body: "Har bir sahna va tasvir farzandingiz hikoyaning haqiqiy qahramonidek his qilishi uchun yaratiladi.",
      img: `${IMG}/step-2-create-story.webp`,
      alt: "Muallif shaxsiy hikoyani yaratmoqda — ekranda matn va rasmlar",
      pos: "52% 42%",
    },
    {
      n: "03",
      title: "Uning kitobi dunyoga keladi",
      body: "Siz ko'rib chiqasiz, kitob ehtiyotkorlik bilan chop etiladi va oilangizga yetkaziladi.",
      img: `${IMG}/step-3-printed-with-care.webp`,
      alt: "TALIMOON bosmaxonasida tayyor shaxsiy qattiq muqovali kitoblar va sovg'a qutisi",
      pos: "50% 50%",
    },
  ],
  trust:
    "Qattiq muqova · suratlardan anime uslubidagi illyustratsiya · faqat Siz aytgan ma'lumot asosida · 7–10 kunda tayyor",
  cta: "Uning hikoyasini boshlash →",
};

/** The warm-gold story thread between two beats (lg only). One thin
 *  curve that draws in once when it scrolls into view, then holds. */
function GoldThread({ variant }: { variant: "a" | "b" }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<SVGPathElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (reduced) return; // reduced motion: rendered fully drawn, no observer
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setDrawn(true), 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [reduced]);

  // a: mass moves left image -> right image; b: right image -> left image.
  const d =
    variant === "a"
      ? "M300,2 C300,46 700,12 700,58"
      : "M700,2 C700,46 300,12 300,58";

  return (
    <div aria-hidden="true" className="relative hidden h-10 w-full lg:block">
      <svg
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <path
          ref={ref}
          d={d}
          pathLength={1}
          fill="none"
          stroke="var(--gold-mid)"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: 0.55,
            strokeDasharray: 1,
            strokeDashoffset: reduced || drawn ? 0 : 1,
            transition: reduced
              ? undefined
              : "stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
    </div>
  );
}

/**
 * One editorial row. ONE structural system for all three steps: a
 * 2-column grid (image ~54% / copy ~46%) that is `items-center`. The
 * desktop step number is a large, faint watermark placed BEHIND the
 * start of the copy via a single-cell grid overlap (two children sharing
 * `grid-area: 1/1`) — NOT absolute positioning, NOT translateY — so the
 * readable text (title + body) genuinely sits at the vertical centre of
 * its own image. The alternation is pure `order`. On mobile every step
 * stacks the same way: step number → image → copy.
 */
function JourneyStep({ step, index }: { step: JourneyStepData; index: number }) {
  const imageLeft = index !== 1; // rows 01 & 03: image left; row 02: image right
  const climax = index === 2;

  const numberTone = climax
    ? "text-[color:var(--accent-primary)]/[0.16]"
    : "text-[color:var(--surface-contrast)]/[0.09]";

  return (
    <div
      className={[
        "py-2 lg:grid lg:items-center lg:gap-x-14 lg:py-10",
        // same rule every row, mirrored: the image track is always the
        // wider ~54%, whichever side it sits on.
        imageLeft ? "lg:grid-cols-[54fr_46fr]" : "lg:grid-cols-[46fr_54fr]",
      ].join(" ")}
    >
      {/* Step number — mobile only, first in the stack so it is never
          visually detached from its own step. */}
      <span
        aria-hidden="true"
        className={`block font-display text-[2.5rem] font-medium leading-none lg:hidden ${numberTone}`}
      >
        {step.n}
      </span>

      {/* Image — trimmed ~12% and nudged toward the column's outer edge.
          The inset lives on THIS box (which has a real width), NOT on the
          grid item: an auto margin on the grid item makes it fit-content,
          which collapses the `w-full` + aspect-ratio box (its only child
          is an absolutely-positioned <Image fill>) to zero — hiding the
          image. Aspect ratio preserved. */}
      <Reveal
        y={climax ? 20 : 14}
        className={["mt-4 lg:mt-0", imageLeft ? "lg:order-1" : "lg:order-2"].join(" ")}
      >
        <div
          className={[
            "relative w-full overflow-hidden rounded-[10px] ring-1 ring-[color:var(--surface-contrast)]/10 lg:max-w-[88%]",
            imageLeft ? "lg:me-auto" : "lg:ms-auto",
            climax
              ? "aspect-[4/3] shadow-[0_26px_56px_-32px_rgba(28,42,58,0.30)]"
              : "aspect-[16/10] shadow-[0_20px_44px_-30px_rgba(28,42,58,0.20)]",
          ].join(" ")}
        >
          <Image
            src={step.img}
            alt={step.alt}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            quality={100}
            className="object-cover"
            style={{ objectPosition: step.pos }}
          />
        </div>
      </Reveal>

      {/* Number watermark + copy — the copy is one single grid cell; the
          large faint numeral shares that cell so it sits behind the text
          without consuming vertical space, letting `items-center` place
          the title + body at the image's true vertical centre. */}
      <Reveal
        delay={90}
        className={["mt-5 lg:mt-0", imageLeft ? "lg:order-2" : "lg:order-1"].join(" ")}
      >
        <div className="lg:grid lg:grid-cols-1">
          <span
            aria-hidden="true"
            className={`hidden font-display text-[5rem] font-medium leading-none lg:block lg:[grid-area:1/1] lg:self-center lg:justify-self-start ${numberTone}`}
          >
            {step.n}
          </span>
          <div className="lg:[grid-area:1/1] lg:self-center">
            <h3 className="font-display text-[1.375rem] font-medium leading-[1.3] tracking-[-0.01em] text-text-primary md:text-[1.5rem]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[48ch] font-sans text-[0.9375rem] leading-[1.75] text-text-secondary md:text-[1.0625rem]">
              {step.body}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function ProcessPrice() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <>
      <section
        aria-labelledby="process-heading"
        className="w-full bg-gradient-to-b from-surface-base via-surface-base to-[#F3ECDE]"
      >
        <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-16 sm:px-8 md:pb-12 md:pt-20 lg:pb-12 lg:pt-24">
          {/* Intro — a wide, centred editorial header. The headline spreads
              horizontally (one line on wide desktop, a balanced two when it
              needs to wrap) — no narrow column, no manual line break. */}
          <Reveal className="mx-auto max-w-[1040px] text-center">
            <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t.eyebrow}
            </p>
            <h2
              id="process-heading"
              className="mt-3 text-balance font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] text-text-primary sm:text-[2.125rem] md:text-[2.5rem]"
            >
              {t.heading[0]} <span className="text-text-secondary">{t.heading[1]}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] font-sans text-[0.9375rem] leading-[1.7] text-text-secondary md:text-[1rem]">
              {t.support}
            </p>
          </Reveal>

          {/* The journey — alternating editorial sequence. Generous space
              below the header before the first step begins. */}
          <div className="mt-14 md:mt-16 lg:mt-20">
            {t.steps.map((step, i) => (
              <div key={step.n}>
                <JourneyStep step={step} index={i} />
                {i < t.steps.length - 1 && (
                  <>
                    <GoldThread variant={i === 0 ? "a" : "b"} />
                    <div
                      aria-hidden="true"
                      className="mx-auto my-4 h-9 w-px bg-gradient-to-b from-accent-primary/0 via-accent-primary/50 to-accent-primary/0 lg:hidden"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Tight close straight into pricing */}
          <Reveal delay={60} className="mt-10 border-t border-text-primary/10 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[62ch] font-sans text-[0.8125rem] leading-[1.7] text-text-muted">
                {t.trust}
              </p>
              <a
                href="#pricing"
                className="inline-flex min-h-[44px] shrink-0 items-center font-sans text-[0.9375rem] font-medium text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
              >
                {t.cta}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PricingSection />
    </>
  );
}
