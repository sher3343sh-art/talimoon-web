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
// - <SectionArtwork>: the book.png image itself IS the requested
//   background, so it stays — full opacity, no mask, no blend mode,
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
// Section artwork — the background image, shown plainly. No mask,
// no blend mode, no gradient overlay, no opacity reduction — the
// image renders at full strength with nothing darkening it.
// position: absolute, inset: 0, z-0, zero flow height, so it sits
// behind the content without affecting layout/spacing.
// ============================================================

function SectionArtwork() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Image
        src="/images/values/book.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        priority
      />
    </div>
  );
}

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

        {/* Five Values — icons, titles, and descriptions unchanged.
            Desktop: 5 equal columns, 32px gap, hairline dividers
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
