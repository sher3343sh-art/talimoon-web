'use client';

/**
 * About page — shared primitives.
 * ----------------------------------------------------------------
 * The About page is one continuous editorial story, not a stack of
 * identical sections. This file holds only what genuinely repeats:
 * the type/colour constants (matching the shipped premium sections —
 * Cormorant Garamond display + Manrope body, cream `#F7F3EC`, navy
 * `#1C2A3A`, restrained gold `#B8935B` = `--gold-500`), the scroll
 * reveal (opacity + a 16–24px rise, reduced-motion aware), and a
 * plain section shell. Every section builds its own rhythm on top —
 * no shared "heading + paragraph + 3 cards" block.
 *
 * i18n: sections pass `useT(EN, UZ, RU)` copy objects — RU is real,
 * translated content, not a fallback; only AR still falls back to EN.
 * Layout uses logical flow / centred measures so it does not depend on
 * Uzbek or Russian text length.
 */

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// ── Design constants ────────────────────────────────────────────────
export const DISPLAY =
  "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif";
export const BODY =
  "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif";

export const CREAM = '#F7F3EC';
export const CREAM_RAISED = '#FDFBF7';
export const NAVY = '#1C2A3A';
export const NAVY_80 = 'rgba(28,42,58,0.80)';
export const NAVY_64 = 'rgba(28,42,58,0.64)';
export const NAVY_48 = 'rgba(28,42,58,0.48)';
export const GOLD = '#B8935B';
export const GOLD_SOFT = 'rgba(184,147,91,0.35)';
export const GOLD_FAINT = 'rgba(184,147,91,0.14)';

// ── Vertical rhythm ─────────────────────────────────────────────────
// Not every section is a hero. Three tiers keep the page moving without
// feeling cramped (mobile → md → lg). Tightened hard from the earlier
// values so the story reads as one continuous editorial piece rather
// than a stack of full-height panels — the section-to-section
// transition (one section's pb + the next section's pt) now lands around
// MAJOR ~112px / NORMAL ~80px / COMPACT ~64px on desktop instead of the
// old ~200–224px. Premium is not the same as large empty cream zones.
//   MAJOR   ~40 / 48 / 56px  — the page's big emotional beats
//   NORMAL  ~32 / 36 / 40px  — most editorial sections
//   COMPACT ~24 / 32 / 32px  — structural / list / process sections
export const SPACE_MAJOR = 'py-10 md:py-12 lg:py-14';
export const SPACE_NORMAL = 'py-8 md:py-9 lg:py-10';
export const SPACE_COMPACT = 'py-6 md:py-8 lg:py-8';

// ── Scroll reveal ───────────────────────────────────────────────────
// One calm container→children stagger. Sections apply `revealContainer`
// to a wrapper (initial/whileInView) and `revealItem` to each child.
export const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Wrap a section's body so its children rise in once, gently, on scroll. */
export function Reveal({
  children,
  className,
  amount = 0.25,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  as?: 'div' | 'section';
}) {
  const reduced = useReducedMotion();
  const Comp = as === 'section' ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      variants={reduced ? undefined : revealContainer}
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, amount }}
    >
      {children}
    </Comp>
  );
}

/** A single revealed line/block. Falls back to a plain element when
 *  motion is reduced. */
export function Rise({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div variants={revealItem} className={className} style={style}>
      {children}
    </motion.div>
  );
}

// ── Small shared marks ──────────────────────────────────────────────
/** The gold eyebrow used to open several sections (small caps, wide
 *  tracking), matching the Values / Our Products eyebrows. */
export function Eyebrow({
  children,
  className = '',
  align = 'center',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'center' | 'start';
}) {
  return (
    <span
      className={`block uppercase ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
      style={{
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: '0.26em',
        color: GOLD,
      }}
    >
      {children}
    </span>
  );
}

/** A short centred gold hairline — the section-divider mark the site
 *  already uses under eyebrows. */
export function GoldRule({
  width = 44,
  className = '',
}: {
  width?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`mx-auto block ${className}`}
      style={{
        width,
        height: 1,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
      }}
    />
  );
}

/** Section shell — full-width, cream by default, generous vertical
 *  rhythm, the site's standard horizontal padding + reading container.
 *  `tone="raised"` uses the slightly lighter paper; `tone="navy"` is
 *  the dark editorial surface used once, at the close.
 *  `railInset` reserves room on the leading side (xl+ only) for the
 *  desktop chapter rail — which sits in the gutter of this same
 *  centred 1200px measure — so the fixed rail never overlaps the
 *  reading column. The full-bleed background is unaffected. */
export function Section({
  id,
  children,
  tone = 'cream',
  className = '',
  labelledBy,
  railInset = false,
}: {
  id?: string;
  children: React.ReactNode;
  tone?: 'cream' | 'raised' | 'navy';
  className?: string;
  labelledBy?: string;
  railInset?: boolean;
}) {
  const bg =
    tone === 'navy' ? NAVY : tone === 'raised' ? CREAM_RAISED : CREAM;
  const color = tone === 'navy' ? CREAM : NAVY;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative w-full overflow-hidden px-6 md:px-10 lg:px-16 ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      <div className={`mx-auto w-full max-w-[1200px] ${railInset ? 'xl:ps-[256px]' : ''}`}>
        {children}
      </div>
    </section>
  );
}
