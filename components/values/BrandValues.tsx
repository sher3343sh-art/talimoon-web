// FILE: src/components/values/BrandValues.tsx
// Brand Values — REDESIGN per Creative Director's "Complete Layout
// Redesign" brief. This replaces the previous three-block structure
// (heading / boxed book image / value cards) with one continuous
// composition: a full-bleed atmospheric background sits behind the
// entire section, an original logo mark is embedded mid-composition
// with a soft glow, and the value cards sit directly on top of that
// same background rather than below a separate image.
//
// What changed structurally, and why:
// - The old <BookPlaceholder> was a boxed, aspect-ratio-constrained
//   <Image> sitting IN THE DOCUMENT FLOW between the description and
//   the value grid — that's exactly the "stacked components" feeling
//   the brief flags as the core problem. It has been replaced by
//   <SectionArtwork>, which is `position: absolute; inset: 0` behind
//   the whole section (z-0), so it costs zero flow height and every
//   piece of content (heading, description, logo, icons) renders on
//   top of the SAME background layer instead of before/after it.
// - Removing that ~500-700px flow-height image block (replaced by an
//   absolutely-positioned layer + a much smaller logo emblem) is what
//   delivers the "reduce visual height 10-20%" requirement — it is a
//   structural consequence of the fix, not a separate font/spacing cut.
// - Because the value grid now renders directly on top of the same
//   continuous background (not after a separate image), it inherently
//   "overlaps the artwork" and "sits on top of it" per the brief,
//   without needing an artificial negative margin hack.
// - Icon paths, icon order, and the ValueColumn markup are UNCHANGED
//   from the approved version, per explicit instruction to preserve
//   them exactly.
//
// Two things flagged rather than silently guessed (same policy as
// before — real ambiguity noted, not resolved by assumption):
//
// 1. Logo asset — the brief requires the "original TALIMOON logo SVG,
//    used exactly as-is, never redrawn." No logo file/path exists
//    anywhere in the previous BrandValues implementation, so the path
//    below (`/images/logo/talimoon-logo.svg`) is a placeholder that
//    needs to be pointed at wherever the real logo SVG actually lives
//    in the project (e.g. wherever Navbar imports it from). Swap the
//    `src` in <LogoEmblem> once that path is confirmed — nothing else
//    in this file needs to change.
// 2. Background artwork aspect ratio — the existing asset
//    (book.png) is 1560×696 (≈2.24:1), designed for a short, wide
//    box. Stretched full-bleed behind a now-vertical stack (heading +
//    description + logo + five values), `object-cover` will crop it
//    much more aggressively than before, especially on mobile where
//    the section is tall and narrow. The mask/blend below is tuned to
//    keep the crop invisible by fading it out well before the visible
//    edges, but this is a stopgap: the real fix is a piece of art
//    actually composed for a tall full-section background (soft
//    light/depth per the brief — "no extra books, no extra children"),
//    not a repurposed short banner image.

'use client';

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

// ============================================================
// Tokens — unchanged from the approved palette.
// ============================================================

const GOLD = '#C8A04A';
const GOLD_GRADIENT_FROM = '#C69A3B';
const GOLD_GRADIENT_TO = '#E7C96A';
const NAVY = '#17243C';
const CREAM = '#F8F5EF';

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

const VALUES: readonly ValueItem[] = [
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

// ============================================================
// Scroll animation — same macro sequence and timing as before:
// Eyebrow → Headline → Description → Logo Emblem → Five Values.
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

// Particle drift — extremely subtle, slow, staggered. Not a flashy
// sparkle effect: low peak opacity, small travel distance, long
// duration, so it reads as "atmosphere" rather than "animation."
const particleFloat: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: [0, 0.45, 0.25, 0.45, 0],
    y: [0, -8, -2, -6, 0],
    transition: {
      duration: 7 + i,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.8,
    },
  }),
};

const PARTICLES = [
  { top: '8%', left: '18%', size: 4 },
  { top: '72%', left: '84%', size: 3 },
  { top: '20%', left: '82%', size: 3 },
  { top: '85%', left: '12%', size: 4 },
  { top: '48%', left: '6%', size: 3 },
] as const;

// ============================================================
// Headline — unchanged: "light" in the gold gradient, rest in navy.
// ============================================================

function Headline() {
  return (
    <motion.h2
      id="brand-values-heading"
      variants={sequenceItem}
      className="relative z-10 mx-auto max-w-[900px] text-center text-[40px] md:text-[52px] lg:text-[68px]"
      style={{
        fontFamily: DISPLAY_FONT,
        fontWeight: 600,
        lineHeight: 0.95,
        letterSpacing: '-0.035em',
        color: NAVY,
        marginBottom: 22,
      }}
    >
      Every story begins
      <br />
      with a single page of{' '}
      <span
        style={{
          backgroundImage: `linear-gradient(180deg, ${GOLD_GRADIENT_FROM}, ${GOLD_GRADIENT_TO})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        light
      </span>
      .
    </motion.h2>
  );
}

// ============================================================
// Section artwork — the illustration as a true background layer.
// position: absolute, inset: 0, z-0, zero flow height. Sits behind
// the eyebrow, headline, description, logo, and value grid alike, so
// nothing in the section reads as "placed on top of" or "after" an
// image — it's all one surface. Mask fades the image out well
// before the section's own edges (no visible rectangle/frame), and
// mix-blend-mode: multiply lets the image's tones darken into the
// cream page color instead of sitting on top of it.
// ============================================================

function SectionArtwork() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse 82% 88% at 50% 46%, black 30%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 82% 88% at 50% 46%, black 30%, transparent 100%)',
          mixBlendMode: 'multiply',
          opacity: 0.8,
        }}
      >
        <Image
          src="/images/values/book.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Light source: strongest behind the logo, softening as it
          reaches the value row below — pure gradient, no image, so
          there's nothing resembling a connecting line. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 62% 68% at 50% 56%, ${GOLD}26, transparent 72%)`,
        }}
      />
    </div>
  );
}

// ============================================================
// Logo emblem — the original mark, unmodified, centered between the
// description and the values. Soft cinematic glow behind it, a
// handful of extremely delicate gold particles around it. Calm, not
// magical: no rotation, no scale-pulsing, no color shift on the mark
// itself.
// ============================================================

function LogoEmblem() {
  return (
    <motion.div
      variants={sequenceItem}
      className="relative z-10 flex items-center justify-center"
      style={{ width: 176, height: 176, marginBottom: 8 }}
    >
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: -44,
          background: `radial-gradient(circle, ${GOLD}33, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          custom={i}
          variants={particleFloat}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: GOLD,
            filter: 'blur(1px)',
          }}
        />
      ))}

      <Image
        src="/images/logo/talimoon-logo.svg"
        alt=""
        aria-hidden="true"
        width={100}
        height={100}
        className="relative z-10"
        priority
      />
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
            fontSize: 34,
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

      <p
        className="line-clamp-2 opacity-90 transition-opacity duration-[450ms] ease-out md:group-hover:opacity-100"
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

export function BrandValues() {
  return (
    <section
      aria-labelledby="brand-values-heading"
      className="relative w-full overflow-hidden px-6 md:px-16"
      style={{ backgroundColor: CREAM }}
    >
      <SectionArtwork />

      <motion.div
        className="relative z-10 mx-auto flex flex-col items-center md:min-h-[520px] md:justify-center"
        style={{ paddingTop: 64, paddingBottom: 64 }}
        variants={sequenceContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span
          variants={sequenceItem}
          className="block text-center uppercase"
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.30em',
            color: GOLD,
            marginBottom: 18,
          }}
        >
          OUR VALUES
        </motion.span>

        <Headline />

        <motion.p
          variants={sequenceItem}
          className="mx-auto max-w-[640px] text-center"
          style={{
            fontFamily: BODY_FONT,
            fontWeight: 400,
            fontSize: 21,
            lineHeight: 1.65,
            color: 'rgba(23,36,60,0.68)',
            marginBottom: 36,
          }}
        >
          From one open book, five timeless values grow in a child&rsquo;s
          heart and shape a beautiful tomorrow.
        </motion.p>

        <LogoEmblem />

        {/* Five Values — rendered directly on top of <SectionArtwork>,
            not after a separate image, so it visually overlaps and
            continues the same composition rather than sitting below
            it. Desktop: 5 equal columns, 32px gap, hairline dividers
            between (not around) columns. Mobile: vertical list. */}
        <motion.div
          variants={sequenceItem}
          className="grid w-full grid-cols-1 gap-y-12 md:grid-cols-5 md:gap-x-8 md:gap-y-0"
        >
          {VALUES.map((value, i) => (
            <ValueColumn key={value.id} item={value} showDivider={i > 0} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
