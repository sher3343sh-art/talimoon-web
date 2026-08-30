// FILE: src/components/values/BrandValues.tsx
// Brand Values — PRODUCTION CLEANUP PASS.
// Purpose: strip every decorative/atmospheric visual layer so the
// raw content structure can be inspected on its own. This is NOT a
// redesign — layout, spacing, alignment, sizing, typography,
// responsiveness, and content-relevant animations are all untouched.
//
// Removed in this pass:
// - <LogoEmblem> (the center Talimoon logo mark, its glow blur,
//   its radial gradient halo, and its five floating gold particles)
//   — deleted entirely, including its call site.
// - PARTICLES data and the particleFloat animation variant, which
//   existed solely to drive the now-removed logo particles.
// - Every darkening/shadow layer that used to sit ON TOP of the
//   background image: the WebkitMaskImage/maskImage fade mask, the
//   mix-blend-mode: multiply, the atmosphere-only opacity: 0.8, and
//   the radial "light source" gradient overlay.
//
// Kept / restored:
// - <SectionArtwork>: the painted scene (`values-scene.png`) itself
//   IS the requested background, so it stays — full opacity, no mask,
//   no gradient laid over it. Plain <Image fill className="object-
//   cover" />, nothing else. This is content (the requested visual),
//   not decoration, so it's not in the "remove" list.
// - SectionArtwork's positioning is now pinned with explicit inline
//   styles (position: absolute; inset: 0; width/height: 100%) on
//   both the wrapper div and the <Image> itself, on top of the
//   Tailwind classes. This guarantees the artwork contributes ZERO
//   flow height to the section — the section's height is driven
//   only by its normal-flow content (label, heading, description,
//   value grid), exactly as it was in the no-background version.
// - Cream section background (shows only in any area the image
//   doesn't cover, e.g. object-cover edge cases).
// - Eyebrow label, headline (incl. its gold gradient text — that's
//   typography styling, not atmospheric lighting), description.
// - All five value icons, titles, gold underline accents, and
//   descriptions — value-card markup is untouched.
// - Desktop hairline dividers between columns.
// - The scroll-reveal stagger animation (sequenceContainer /
//   sequenceItem) — this drives real content (heading, paragraph,
//   value grid), not decoration, so it stays.

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';

// ============================================================
// Tokens — unchanged from the approved palette.
// ============================================================

const GOLD = '#C8A04A';
const GOLD_GRADIENT_FROM = '#C69A3B';
const GOLD_GRADIENT_TO = '#E7C96A';
const NAVY = '#17243C';

const DISPLAY_FONT = "'Cormorant Garamond', serif";
const BODY_FONT = "'Inter', sans-serif";

// ============================================================
// Content — VALUES array, icon paths, and order are UNCHANGED.
// ============================================================

interface ValueItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly iconSrc: string;
}

const VALUES_EN: readonly ValueItem[] = [
  {
    id: 'knowledge',
    title: 'Knowledge',
    description: 'Sparks a lifelong love of learning.',
    iconSrc: '/images/values/icon/Knowledge.png',
  },
  {
    id: 'character',
    title: 'Character',
    description: 'Shapes kindness, respect, and good conduct.',
    iconSrc: '/images/values/icon/Character.png',
  },
  {
    id: 'imagination',
    title: 'Imagination',
    description: 'Inspires creativity and independent thought.',
    iconSrc: '/images/values/icon/Imagination.png',
  },
  {
    id: 'compassion',
    title: 'Compassion',
    description: 'Instills empathy and human warmth.',
    iconSrc: '/images/values/icon/Compassion.png',
  },
  {
    id: 'wisdom',
    title: 'Wisdom',
    description: 'Guides children toward a life of character and purpose.',
    iconSrc: '/images/values/icon/Wisdom.png',
  },
] as const;

// 2026-08-28 — Uzbek value system re-aligned to the final semantic
// model: Bilim -> Odob va poklik -> Tasavvur -> Mehr-shafqat -> Komillik.
// "Xarakter" (too broad/abstract) replaced by "Odob va poklik" (a
// concrete upbringing focus: good conduct, respect, tidiness, purity,
// good daily habits) and "Donolik" by "Komillik" (the child growing,
// with these traits, into a whole/good person as the culmination).
// All five descriptions moved to a consistent first-person-plural
// "we nurture" voice. `id`s are language-independent keys — unchanged,
// so EN/RU/AR copy is untouched.
const VALUES_UZ: readonly ValueItem[] = [
  {
    id: 'knowledge',
    title: 'Bilim',
    description: "O'rganish, izlanish va savol berishga qiziqish uyg'otamiz.",
    iconSrc: '/images/values/icon/Knowledge.png',
  },
  {
    id: 'character',
    title: 'Odob va poklik',
    description:
      "Go'zal xulq, hurmat, ozodalik va poklikni kundalik odatga aylantirishga o'rgatamiz.",
    iconSrc: '/images/values/icon/Character.png',
  },
  {
    id: 'imagination',
    title: 'Tasavvur',
    description: "Ijodkorlikni, tasavvurni va mustaqil fikrlashni rivojlantiramiz.",
    iconSrc: '/images/values/icon/Imagination.png',
  },
  {
    id: 'compassion',
    title: 'Mehr-shafqat',
    description: "Mehr, hamdardlik va boshqalarga g'amxo'rlik qilishni o'rgatamiz.",
    iconSrc: '/images/values/icon/Compassion.png',
  },
  {
    id: 'wisdom',
    title: 'Komillik',
    description:
      "O'z ustida ishlash, to'g'ri tanlov qilish va hayotda ma'noli yo'l topishga ilhomlantiramiz.",
    iconSrc: '/images/values/icon/Wisdom.png',
  },
] as const;

// ============================================================
// Scroll animation — same macro sequence and timing as before:
// Eyebrow → Headline → Description → Five Values.
// Stagger 0.10, duration 0.70, easeOut. The five columns still fade
// in together as the final stage, not re-staggered individually.
// ============================================================

const sequenceContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const sequenceItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

// ============================================================
// Section artwork — the background image, shown plainly: no mask,
// blend mode, gradient overlay or opacity change.
// 2026-08-28: this section uses its OWN asset, `values-scene.png`
// (1536x1536, square) — a painted scene prepared to fit this layout:
// the left ~44% is kept clear (resolving to cream) for the headline +
// questions, the focal art sits in the right ~half. The file is
// colour-graded from the artist's original so its cream white point
// lands on the site cream `#F7F3EC` (= `--surface-base`), matching the
// flat-cream FourDoorsSection right below it — no CSS tint needed.
// (The shared `book.png` — a wider line-art-only texture — stays with
// FourDoorsSection's HeritageBackdrop; this section no longer touches
// it.) The wrapper's aspect-ratio matches the file exactly, the image
// is pinned to the TOP of the section and spans the full width, so
// nothing is ever cropped at any viewport width. Below it the
// section's own cream (`bg-surface-base`) continues seamlessly (the
// image's lower edge is already that cream), so the five values sit on
// flat cream. Zero flow height.
// ============================================================

function SectionArtwork() {
  return (
    <div
      aria-hidden="true"
      /* 2026-08-28 — DESKTOP / TABLET ONLY. On mobile this full-width
         square sat behind the eyebrow + headline and the navy type
         collided with the painted focal art. Mobile instead stacks:
         eyebrow + headline on flat cream, then <MobileValuesScene />
         renders the same painting inline below them. */
      /* 2026-08-29 — width-capped + centred. This square is
         `width:100%; aspect-ratio:1/1`, so its RENDERED HEIGHT equals
         the viewport width. The section's own height is driven by its
         text content (~1480px) and does NOT grow with width, so on any
         viewport wider than ~1500px the square grew taller than the
         section and its lower half (the painted child) was guillotined
         by the section's `overflow-hidden`. Capping the width at
         1600px freezes the square at ~1600² once screens pass that —
         matching the section height, child fully visible — and leaves
         every viewport at or below 1600px (all common laptops)
         completely unchanged. */
      className="pointer-events-none absolute left-1/2 top-0 z-0 hidden w-full max-w-[1600px] -translate-x-1/2 overflow-hidden md:block"
      style={{
        aspectRatio: '1 / 1',
        // Seam fades on BOTH edges of the painted square so it never
        // meets a section border as a hard line:
        //  • TOP (new, 2026-08-29) — the gold branch/leaf flourishes
        //    baked into the scene's top corners used to be sliced
        //    mid-leaf exactly at the Hero↕Values border ("xunik
        //    kesilgan barglar"). Fading the image in from transparent
        //    over its first ~15% lets that foliage die out into flat
        //    `--surface-base` cream, so the Hero's own bottom cream
        //    fade and this scene melt into one shared calm band at the
        //    join. Focal art (sun/city ~y25%+, child ~y45-83%) is well
        //    below the fade, untouched.
        //  • BOTTOM — same idea toward FourDoorsSection: the lower gold
        //    flourish linework dies into cream before the section ends.
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 13%, black 72%, transparent 90%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 13%, black 72%, transparent 90%)',
      }}
    >
      <Image
        src="/images/values/values-scene.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top"
        priority
      />
    </div>
  );
}

// ============================================================
// Headline — unchanged: "light" in the gold gradient, rest in navy.
// ============================================================

const HEADLINE_EN = {
  line1: 'Every story begins',
  line2Pre: 'with a single page of',
  highlight: 'light',
  // 2026-08-28 — small deck line under the headline.
  subhead:
    'Talimoon creates content for children that brings together knowledge, upbringing, and imagination.',
};
// 2026-08-28 — UZ heading replaced with a single flowing line,
// "Bolalikdan qalbga singadigan qadriyatlarimiz.", only the last word
// gold. EN keeps its original two-line "…page of light." wording.
const HEADLINE_UZ: typeof HEADLINE_EN = {
  line1: 'Bolalikdan qalbga singadigan',
  line2Pre: '',
  highlight: 'qadriyatlarimiz',
  subhead:
    "Talimoon bolalar uchun bilim, tarbiya va tasavvurni birlashtirgan mazmun yaratadi.",
};

function Headline() {
  const { language } = useLanguage();
  const t = useT(HEADLINE_EN, HEADLINE_UZ);
  const highlightSpan = (
    <span
      style={{
        backgroundImage: `linear-gradient(180deg, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {t.highlight}
    </span>
  );

  return (
    <motion.h2
      id="brand-values-heading"
      variants={sequenceItem}
      /* 2026-08-29 — md+ size is now fluid: clamp(30px, 4vw, 58px).
         It was a hard step (44px at md, 58px at lg) tuned to one
         screen width; between ~1024 and ~1300px the long UZ line
         "Bolalikdan qalbga singadigan qadriyatlarimiz." wrapped and,
         with the tight leading, crammed. 4vw hits the 58px cap at
         ~1450px (so every common laptop — 1440 / 1512 / 1536 — is
         pixel-identical to before) and scales DOWN below that instead
         of wrapping. Mobile keeps its explicit 30px / 1.15 step.
         Leading nudged 0.95 -> 1.0 on md+ so a wrapped line never
         overlaps the one above it. */
      className="relative z-10 mx-auto max-w-[900px] text-center text-[30px] leading-[1.15] [text-wrap:balance] md:text-[clamp(30px,4vw,58px)] md:leading-[1.0] lg:max-w-[1240px]"
      style={{
        fontFamily: DISPLAY_FONT,
        fontWeight: 600,
        letterSpacing: '-0.035em',
        color: NAVY,
        marginBottom: 12,
      }}
    >
      {language === 'UZ' ? (
        <>
          {t.line1} {highlightSpan}.
        </>
      ) : (
        <>
          {t.line1}
          <br />
          {t.line2Pre} {highlightSpan}.
        </>
      )}
    </motion.h2>
  );
}

// ============================================================
// Deck — one small supporting line directly under the headline
// (2026-08-28). Body font, muted navy, well under the headline size
// so it reads as a subtitle, not a second heading. Part of the same
// scroll-reveal stagger (`sequenceItem`).
//
// 2026-08-28 (polish): the first pass felt cramped — leading was
// tighter (1.55) than the section's body-copy norm (~1.65) and it sat
// almost touching the headline. Opened it up: line-height 1.72, a
// faint positive letter-spacing for an airy subtitle feel, and a
// small `marginTop` so it breathes under the headline (the headline's
// own `marginBottom` stays small so the two still read as one unit).
// The measure is wide (820px) so the UZ line sits on ONE row on
// desktop, mirroring the headline above it; it still wraps naturally
// on tablet / mobile where the viewport is narrower than that.
// ============================================================

function HeadlineDeck() {
  const t = useT(HEADLINE_EN, HEADLINE_UZ);
  return (
    <motion.p
      variants={sequenceItem}
      /* DESKTOP / TABLET ONLY — on mobile this same line is placed in
         the clear cream area to the LEFT of the child inside
         <MobileValuesScene /> instead of stacked under the headline. */
      className="relative z-10 mx-auto hidden max-w-[820px] text-center md:block"
      style={{
        fontFamily: BODY_FONT,
        fontWeight: 400,
        fontSize: 18,
        lineHeight: 1.72,
        letterSpacing: '0.008em',
        color: 'rgba(23,36,60,0.6)',
        marginTop: 6,
      }}
    >
      {t.subhead}
    </motion.p>
  );
}

// ============================================================
// Mobile-only composition (2026-08-28 mobile pass)
// ------------------------------------------------------------
// Phones don't get the section-wide `SectionArtwork` background —
// there the painted focal art fought the navy headline. Instead the
// SAME `values-scene.png` renders here as a full-bleed inline plate
// directly under the (now smaller) headline, its top/bottom edges
// dissolving into the section cream. The deck line
// ("Talimoon bolalar uchun bilim, tarbiya…") is laid into the clear
// cream space to the LEFT of the seated child — a soft left-side
// cream lift keeps it legible over the pale sky without a visible
// card, and its column stops short of the child so type never sits
// on the illustration. `md:hidden`; desktop path is untouched.
// ============================================================

function MobileValuesScene() {
  const t = useT(HEADLINE_EN, HEADLINE_UZ);
  return (
    <motion.div
      variants={sequenceItem}
      /* pulled UP so its (edge-melted) top rises behind the second
         heading line "qadriyatlarimiz"; sits BELOW the heading
         (z-0 < the heading's z-10) so the navy/gold type stays on top
         while the painting washes in behind it. */
      className="relative z-0 -mt-12 w-[calc(100%+3rem)] md:hidden"
    >
      <div
        className="pointer-events-none relative w-full overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        <Image
          src="/images/values/values-scene.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* all four edges melt into the section cream so the painting
            has no hard rectangle — it dissolves into the background
            and just reads as an atmospheric wash behind the type. The
            sepia city (well inside the left edge) and the child stay
            legible. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[8%]"
          style={{
            background:
              'linear-gradient(to top, transparent, var(--surface-base))',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[34%]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, var(--surface-base) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[10%]"
          style={{
            background:
              'linear-gradient(to right, var(--surface-base), transparent)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[12%]"
          style={{
            background:
              'linear-gradient(to left, var(--surface-base), transparent)',
          }}
        />
        {/* Deck line as a display "banner" lockup, set over the city /
            to the LEFT of the seated child (never on the child). No
            box / scrim — a soft cream glow is the only legibility aid.
            The three pillars are picked out in gold. */}
        <p
          className="absolute left-[4%] top-[38%] w-[50%] -translate-y-1/2 text-left"
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 500,
            fontSize: 18,
            lineHeight: 1.42,
            letterSpacing: '0.012em',
            color: NAVY,
            textShadow:
              '0 1px 16px rgba(247,243,236,0.72), 0 1px 3px rgba(247,243,236,0.9)',
          }}
        >
          {(() => {
            const d = t.subhead;
            const keys = [
              'bilim, tarbiya va tasavvurni',
              'knowledge, upbringing, and imagination',
            ];
            const key = keys.find((k) => d.includes(k));
            if (!key) return d;
            const at = d.indexOf(key);
            return (
              <>
                {d.slice(0, at)}
                <span style={{ color: GOLD }}>{key}</span>
                {d.slice(at + key.length)}
              </>
            );
          })()}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// One value column — UNCHANGED markup, icon src, and order. Divider
// sits between columns (not around the group), desktop only.
// ============================================================

const ValueColumn = React.memo(function ValueColumn({
  item,
  showDivider,
}: {
  item: ValueItem;
  showDivider: boolean;
}) {
  const { title, description, iconSrc } = item;

  return (
    <div className="group relative flex flex-col items-center text-center">
      {showDivider && (
        <span
          aria-hidden="true"
          className="absolute -left-4 top-1/2 hidden h-[120px] w-px -translate-y-1/2 md:block"
          style={{ backgroundColor: 'rgba(23,36,60,0.08)' }}
        />
      )}

      <div className="relative h-[72px] w-[72px]">
        <Image
          src={iconSrc}
          alt=""
          fill
          aria-hidden="true"
          sizes="72px"
          className="object-contain transition-transform duration-[450ms] ease-out md:group-hover:-translate-y-1"
        />
      </div>

      <h3
        className="transition-colors duration-[450ms] ease-out md:group-hover:text-[var(--bv-gold)]"
        style={
          {
            fontFamily: DISPLAY_FONT,
            /* 2026-08-29 — was a fixed 34px from md up, with no
               breakpoint of its own, so in the 5-column grid it wrapped
               "Odob va poklik" / "Mehr-shafqat" to 2-3 ragged lines on
               anything narrower than ~1450px. Fluid now: 2.3vw hits the
               34px cap at ~1478px (laptops unchanged) and shrinks to
               fit the column below that rather than wrapping. */
            fontSize: 'clamp(20px, 2.3vw, 34px)',
            fontWeight: 600,
            color: NAVY,
            marginTop: 28,
            '--bv-gold': GOLD,
          } as React.CSSProperties
        }
      >
        {title}
      </h3>

      <div
        aria-hidden="true"
        className="mt-1"
        style={{
          width: 42,
          height: 8,
          backgroundImage: `linear-gradient(to right, transparent, ${GOLD}66, transparent)`,
        }}
      />

      {/* line-clamp-4 (was -2): the re-aligned value descriptions run
          a little longer than the old ones and were getting cut off at
          two lines — this shows them in full while still capping any
          future runaway string. */}
      <p
        className="line-clamp-4 opacity-90 transition-opacity duration-[450ms] ease-out md:group-hover:opacity-100"
        style={{
          fontFamily: BODY_FONT,
          fontSize: 17,
          fontWeight: 400,
          lineHeight: 1.7,
          color: 'rgba(23,36,60,0.70)',
          marginTop: 10,
        }}
      >
        {description}
      </p>
    </div>
  );
});

// ============================================================
// Main export
// ============================================================

const SECTION_COPY_EN = {
  eyebrow: 'OUR VALUES',
  description:
    "From one open book, five timeless values grow in a child's heart and shape a beautiful tomorrow.",
};

const SECTION_COPY_UZ: typeof SECTION_COPY_EN = {
  eyebrow: 'QADRIYATLARIMIZ',
  description:
    "Bolalikda qalbga singdirilgan qadriyatlar bir umr hamroh bo'ladi. Shuning uchun Talimoon yaratgan har bir hikoya, kitob va mahsulot besh asosiy qadriyatga tayanadi.",
};

// 2026 — a quiet editorial transition at the end of Values that
// routes to /about. Wording is plain on purpose: the visitor should
// know exactly where it leads (who TALIMOON is, why it exists, what
// it believes). A quiet text link, not a button. All four site
// languages authored.
const ABOUT_LINK: Record<string, string> = {
  UZ: 'TALIMOON haqida batafsil',
  EN: 'About TALIMOON',
  RU: 'Подробнее о TALIMOON',
  AR: 'المزيد عن TALIMOON',
};

// ============================================================
// Reflective questions — the block that sits to the LEFT of the
// illustration space (illustration arrives in a later step).
// Editorial storytelling, not a FAQ: a small gold "?" line mark, a
// firm question, a soft supporting line, separated only by a
// hairline — no card / box / border / shadow, it lives directly on
// the cream canvas. UZ copy is final and approved; EN mirrors it so
// `useT` has both objects and the block is ready for RU/AR later.
// ============================================================

interface Reflection {
  readonly q: string;
  readonly s: string;
}
interface ReflectCopy {
  readonly prompt: string;
  readonly items: readonly Reflection[];
}

const REFLECT_EN: ReflectCopy = {
  prompt: 'Have you ever wondered?',
  items: [
    {
      q: 'What kind of person do you hope your child grows into?',
      s: 'What values are taking shape in their heart today that will guide the life ahead of them?',
    },
    {
      q: "What is shaping your child's world right now?",
      s: 'What mark do the things they watch, hear, read and play with leave on their heart?',
    },
    {
      q: 'Can they choose what is right even when no one is telling them to?',
      s: 'Are knowledge, good manners, kindness and independent thinking becoming their own inner compass?',
    },
    {
      q: 'One day they will walk their own path. What do you hope stays in their heart?',
      s: 'The values placed in their heart today will show tomorrow in their decisions, their relationships and who they become.',
    },
  ],
};

const REFLECT_UZ: ReflectCopy = {
  prompt: "O'ylab ko'rganmisiz?",
  items: [
    {
      q: "Farzandingiz ulg'ayganda qanday inson bo'lishini istaysiz?",
      s: "Bugun uning qalbida ertangi hayotiga yo'l ko'rsatadigan qanday qadriyatlar shakllanmoqda?",
    },
    {
      q: 'Uning dunyosini bugun nimalar shakllantiryapti?',
      s: "Ko'rayotgani, tinglayotgani, o'qiyotgani va o'ynayotgani uning qalbida qanday iz qoldiryapti?",
    },
    {
      q: 'Hech kim aytib turmaganda ham, u yaxshini tanlay oladimi?',
      s: 'Bilim, odob, mehr va mustaqil fikrlash uning ichki mezoniga aylanib boryaptimi?',
    },
    {
      q: "Bir kun u o'z yo'lidan ketadi. Uning qalbida nimalar qolishini istaysiz?",
      s: "Bugun qalbiga singdirilgan qadriyatlar ertaga uning qarorlari, munosabatlari va kim bo'lib yetishishida namoyon bo'ladi.",
    },
  ],
};

function AskMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      stroke={GOLD}
      strokeLinecap="round"
      aria-hidden="true"
      className="mt-[1px] shrink-0"
    >
      {/* thin gold ring (small — well under the 36px cap, not the big
          reference circles) with a light line "?" inside */}
      <circle cx="17" cy="17" r="15.6" strokeWidth="1.1" />
      <path
        d="M13.2 13.4a4 4 0 1 1 5.9 3.9c-1.7 1 -2.4 1.9 -2.4 3.5"
        strokeWidth="1.5"
      />
      <circle cx="16.7" cy="24" r="0.7" fill={GOLD} stroke="none" />
    </svg>
  );
}

function ReflectiveQuestions() {
  const t = useT(REFLECT_EN, REFLECT_UZ);

  return (
    <motion.div
      variants={sequenceContainer}
      /* mobile: pull the whole block UP so "O'ylab ko'rganmisiz?"
         descends onto the painting's faded lower edge (over the faint
         flourish lines) — the scene reads as a background here, no box
         around the text. md+ keeps its own top gap. */
      className="relative z-10 -mt-36 w-full md:mt-10 md:grid md:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] md:items-start md:gap-14 lg:gap-20"
    >
      {/* LEFT — prompt + four reflective questions */}
      <motion.div variants={sequenceContainer} className="max-w-[560px] text-left">
        <motion.p
          variants={sequenceItem}
          /* cream glow is invisible on the desktop cream canvas; on
             mobile it lifts the prompt off the faded painting. */
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 600,
            fontSize: 22,
            color: GOLD,
            textShadow: '0 1px 12px rgba(247,243,236,0.7)',
          }}
        >
          {t.prompt}
        </motion.p>
        <div
          aria-hidden="true"
          className="mt-2"
          style={{ width: 40, height: 2, backgroundColor: GOLD }}
        />

        {t.items.map((it, i) => (
          <motion.div
            key={i}
            variants={sequenceItem}
            /* mobile tightens the stack (first gap 26 -> 16); md+ same */
            className={i === 0 ? 'mt-4 md:mt-[26px]' : undefined}
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className="mb-3 block md:mb-6"
                style={{
                  height: 1,
                  backgroundImage: `repeating-linear-gradient(to right, ${GOLD}66 0 5px, transparent 5px 11px)`,
                }}
              />
            )}
            <div className="flex gap-3">
              <AskMark />
              <div>
                <h3
                  className="leading-[1.28] md:leading-[1.35]"
                  style={{
                    fontFamily: BODY_FONT,
                    fontWeight: 600,
                    fontSize: 18.5,
                    color: NAVY,
                  }}
                >
                  {it.q}
                </h3>
                <p
                  className="mt-[5px] leading-[1.45] md:mt-[7px] md:leading-[1.6]"
                  style={{
                    fontFamily: BODY_FONT,
                    fontWeight: 400,
                    fontSize: 15,
                    color: 'rgba(23,36,60,0.56)',
                    maxWidth: 440,
                  }}
                >
                  {it.s}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* RIGHT — intentionally empty. The `values-scene.png` artwork
          behind the whole section already paints the child + sunlit
          city in this half, so it reads as breathing room, not an
          unfinished panel. No placeholder / dashed box / label. */}
      <div aria-hidden="true" className="hidden md:block" />
    </motion.div>
  );
}

export function BrandValues() {
  const { language } = useLanguage();
  const sectionCopy = useT(SECTION_COPY_EN, SECTION_COPY_UZ);
  const values = useT(VALUES_EN, VALUES_UZ);
  const aboutLinkLabel = ABOUT_LINK[language] ?? ABOUT_LINK.EN;

  return (
    <section
      aria-labelledby="brand-values-heading"
      className="relative w-full overflow-hidden bg-surface-base px-6 md:px-16"
    >
      <SectionArtwork />

      {/* Hero → Values seam (2026-08-29). Two layers, painted over the
          very top of the section, under the content (z-[1] > SectionArtwork
          z-0, < content z-10):
           1. a flat `--surface-base` band that fades out by ~full height
              — so the top of the painted scene AND the Hero's bottom
              cream fade both resolve into one shared calm cream band at
              the border instead of a hard cut.
           2. a whisper of warm gold light bleeding down from the seam —
              the golden-hour glow of the Hero photos "carrying over"
              into the Values cream. Barely-there (α .06); it just keeps
              the two sections in one warm key rather than snapping from
              photographic to flat. No rule, no line — a pure premium
              dissolve.
          Desktop/tablet only: on mobile there's no SectionArtwork here,
          the eyebrow+heading already sit on plain cream, and the Hero's
          own colour-matched fade is enough. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] hidden h-[220px] md:block"
        style={{
          background:
            'radial-gradient(130% 120px at 50% 0%, rgba(200,160,74,0.06), transparent 72%), linear-gradient(to bottom, var(--surface-base) 0%, var(--surface-base) 16%, transparent 100%)',
        }}
      />

      <motion.div
        /* mobile pulls the section up (pt 80 -> 40) and tightens the
           bottom (pb 88 -> 64); md+ keeps the original rhythm. */
        className="relative z-10 mx-auto flex w-full max-w-[1240px] flex-col items-center pt-10 pb-16 md:pt-20 md:pb-[88px]"
        variants={sequenceContainer}
        initial="hidden"
        whileInView="visible"
        /* 2026-08-29 — was amount: 0.2. This block is ~1480px tall, so
           0.2 meant ~300px of it had to scroll into view before the
           reveal even began — the section read as "empty until you
           scroll past it". 0.05 fires as its top edge arrives, so the
           eyebrow/headline animate in as you reach them. */
        viewport={{ once: true, amount: 0.05 }}
      >
        <motion.span
          variants={sequenceItem}
          /* mobile: much smaller (17 -> 10) and flanked by gold ✦ so it
             reads as a small section mark; md+ unchanged. */
          className="mb-2.5 block text-center text-[10px] uppercase md:mb-[18px] md:text-[17px]"
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 600,
            letterSpacing: '0.30em',
            color: GOLD,
          }}
        >
          <span aria-hidden="true" className="md:hidden">✦</span>
          {sectionCopy.eyebrow}
          <span aria-hidden="true" className="md:hidden">✦</span>
        </motion.span>

        <Headline />
        <HeadlineDeck />
        <MobileValuesScene />

        {/* Reflective questions (left) + reserved illustration space
            (right). Copy / icons / layout of everything else is
            untouched; the five values below simply flow down. */}
        <ReflectiveQuestions />

        {/* Supporting statement — sits AFTER the questions, reading as
            TALIMOON's answer to them, just above the five values.
            Wider max-width so the longer copy settles into ~2 balanced
            lines by natural wrap (no forced <br>). Only "besh asosiy
            qadriyatga" gets a flat-gold accent — the same gold the
            headline highlight uses, no new style; falls back to plain
            text if the phrase isn't present (e.g. EN). */}
        <motion.p
          variants={sequenceItem}
          /* 2026-08-28 — extra top gap on md+ so this line clears the
             lower edge of the `values-scene.png` child illustration
             (the image is a full-width square pinned to the section
             top, so on wider viewports the child sits lower); it now
             starts below the artwork rather than touching it. Mobile
             keeps the tighter `mt-16` — there the square image is only
             ~1 viewport-width tall, so the child is already well
             above this point. */
          className="mx-auto mt-8 max-w-[860px] text-center md:mt-40"
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 400,
            fontSize: 21,
            lineHeight: 1.65,
            color: 'rgba(23,36,60,0.68)',
          }}
        >
          {(() => {
            const d = sectionCopy.description;
            const key = 'besh asosiy qadriyatga';
            const at = d.indexOf(key);
            if (at === -1) return d;
            return (
              <>
                {d.slice(0, at)}
                <span style={{ color: GOLD }}>{key}</span>
                {d.slice(at + key.length)}
              </>
            );
          })()}
        </motion.p>

        {/* Five Values — icons, titles, and descriptions unchanged.
            Desktop: 5 equal columns, 32px gap, hairline dividers
            between (not around) columns. Mobile: vertical list. */}
        <motion.div
          variants={sequenceItem}
          className="mt-10 grid w-full grid-cols-1 gap-y-10 md:mt-16 md:grid-cols-5 md:gap-x-8 md:gap-y-0"
        >
          {values.map((value, i) => (
            <ValueColumn key={value.id} item={value} showDivider={i > 0} />
          ))}
        </motion.div>

        {/* Quiet closing sentence — a plain, clearly-worded handoff to
            the full TALIMOON story (/about). A restrained text link,
            not a button. */}
        <motion.div variants={sequenceItem} className="mt-12 md:mt-16">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-[2px] outline-none transition-opacity duration-300 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--surface-base,#F7F3EC)]"
            style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
          >
            <span
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: '-0.01em',
                color: NAVY,
              }}
            >
              {aboutLinkLabel}
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100"
              style={{ color: GOLD, fontSize: 18 }}
            >
              &rarr;
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
