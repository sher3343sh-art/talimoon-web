'use client';

/**
 * The Hall — "how the library grows" banner.
 * ----------------------------------------------------------------
 * Replaces the old dark reading-ground editorial panel with a wide
 * editorial banner: warm cream base, real HTML copy on the left, and an organic
 * navy silhouette on the right framing a still-empty visual stage for
 * a future book-composition asset.
 *
 * The navy shapes are pure CSS (asymmetric border-radius "blobs"),
 * not clip-path — cheap to reason about, and they resize cleanly at
 * every breakpoint without per-viewport coordinates. A 1px inset gold
 * ring on each blob is the "thin accent line" between navy and cream;
 * there is no separate gold layer to keep in sync.
 *
 * Where the future artwork goes: `#story-library-banner-visual`,
 * inside the `data-visual-stage` wrapper below. It sits in normal
 * flow, centered over/between the navy shapes, so a transparent PNG/
 * WebP of the books can be dropped in as a single `<img>`/`next/image`
 * child without touching the surrounding structure.
 */

import Link from 'next/link';
import { HeartHandshake, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, Eyebrow, GOLD, GOLD_SOFT, NAVY, NAVY_48, NAVY_64 } from './shared';

const EN = {
  eyebrow: 'How a story joins the library',
  heading: 'Every story begins with a family.',
  body: 'A personalized TALIMOON book appears here only when its family chooses to share it. Without their clear permission, it remains entirely private.',
  trust: [
    { title: 'Only with a parent’s permission', icon: 'heart' as const },
    { title: 'Personal details treated with care', icon: 'shield' as const },
    { title: 'A source of inspiration for families', icon: 'spark' as const },
  ],
  trustLine: 'No personal book is ever published without permission.',
  cta: 'Learn more',
};
const UZ: typeof EN = {
  eyebrow: "Hikoya kutubxonaga qanday qo'shiladi",
  heading: 'Har bir hikoya avval bir oilaga tegishli.',
  body: "Shaxsiylashtirilgan TALIMOON kitobi bu yerda faqat oila uni ulashishni tanlaganda paydo bo'ladi. Ularning aniq ruxsatisiz kitob maxfiy qoladi.",
  trust: [
    { title: 'Faqat ota-ona ruxsati bilan', icon: 'heart' },
    { title: "Shaxsiy ma'lumotlarga ehtiyotkorlik bilan", icon: 'shield' },
    { title: 'Oilalar uchun ilhom manbai', icon: 'spark' },
  ],
  trustLine: "Ruxsatsiz hech bir shaxsiy kitob e'lon qilinmaydi.",
  cta: 'Qanday ishlashini ko‘ring',
};
const RU: typeof EN = {
  eyebrow: 'Как история попадает в библиотеку',
  heading: 'Каждая история начинается в семье.',
  body: 'Именная книга TALIMOON появляется здесь только тогда, когда семья сама решает поделиться ею. Без явного согласия она остаётся полностью личной.',
  trust: [
    { title: 'Только с согласия родителей', icon: 'heart' },
    { title: 'Бережное отношение к личным данным', icon: 'shield' },
    { title: 'Источник вдохновения для семей', icon: 'spark' },
  ],
  trustLine: 'Ни одна личная книга не публикуется без согласия.',
  cta: 'Узнать больше',
};

const TRUST_ICONS: Record<(typeof EN)['trust'][number]['icon'], LucideIcon> = {
  heart: HeartHandshake,
  shield: ShieldCheck,
  spark: Sparkles,
};

/** A tiny 4-point sparkle — the "1–2 restrained decorative details".
 *  Hand-drawn rather than another icon-set import, so its weight and
 *  proportions stay exactly this restrained. */
function Spark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ color: GOLD }}
    >
      <path
        d="M12 2.5 L13.4 9.6 L20.5 12 L13.4 14.4 L12 21.5 L10.6 14.4 L3.5 12 L10.6 9.6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HowTheLibraryGrows() {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-12 lg:grid-cols-[43%_1fr] lg:items-center lg:gap-16">
      {/* ── Left: real HTML content ─────────────────────────────── */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[480px]"
      >
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2
          className="mt-4 text-[32px] sm:text-[38px] md:text-[40px] lg:text-[42px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {t.heading}
        </h2>
        <p
          className="mt-5 text-[15px] md:text-[16px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
        >
          {t.body}
        </p>

        <ul className="mt-9 space-y-4">
          {t.trust.map((item) => {
            const Icon = TRUST_ICONS[item.icon];
            return (
              <li key={item.title} className="flex items-center gap-3.5">
                <Icon aria-hidden="true" strokeWidth={1.5} size={19} style={{ color: GOLD, flexShrink: 0 }} />
                <span style={{ fontFamily: BODY, fontWeight: 500, fontSize: 14.5, color: NAVY }}>
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>

        <p
          className="mt-7 max-w-[400px] text-[12.5px]"
          style={{ fontFamily: BODY, fontStyle: 'italic', color: NAVY_48, lineHeight: 1.6 }}
        >
          {t.trustLine}
        </p>

        <Link
          href="/story-library/families"
          className="mt-8 inline-flex items-center gap-2 rounded-sm text-[12.5px] uppercase transition-opacity duration-300 hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: NAVY,
            outlineColor: GOLD,
          }}
        >
          {t.cta}
          <span aria-hidden="true" style={{ color: GOLD }}>
            &rarr;
          </span>
        </Link>
      </motion.div>

      {/* ── Right: organic visual stage (image inserted later) ──── */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none"
      >
        <div className="relative aspect-[6/5] w-full">
          {/* organic navy accent — large, top-right */}
          <span
            className="absolute -right-3 -top-4 h-[62%] w-[68%] sm:-right-4 sm:-top-6"
            style={{
              background: NAVY,
              borderRadius: '58% 42% 61% 39% / 45% 58% 42% 55%',
              boxShadow: `inset 0 0 0 1px ${GOLD_SOFT}`,
            }}
          />
          {/* organic navy accent — small, bottom-left (controlled asymmetry) */}
          <span
            className="absolute -bottom-3 -left-2 h-[34%] w-[36%] sm:-bottom-4 sm:-left-3"
            style={{
              background: NAVY,
              borderRadius: '46% 54% 38% 62% / 62% 40% 60% 38%',
              boxShadow: `inset 0 0 0 1px ${GOLD_SOFT}`,
            }}
          />

          <Spark className="absolute right-[6%] top-[2%] h-4 w-4 opacity-80" />
          <Spark className="absolute bottom-[10%] left-[1%] h-3 w-3 opacity-60" />

          {/* FUTURE ASSET SLOT — insert the finished transparent book
              composition (single PNG/WebP) as this element's child.
              Intentionally empty: no placeholder image, no fake cover,
              no "image here" text. Sized/positioned so it reads as a
              deliberate reserved stage, not a broken layout. */}
          <div
            id="story-library-banner-visual"
            data-visual-stage="how-the-library-grows"
            className="absolute inset-[8%] sm:inset-[10%]"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default HowTheLibraryGrows;
