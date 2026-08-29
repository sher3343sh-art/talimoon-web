'use client';

/**
 * HAYOT (Journey) — shared primitives.
 * ----------------------------------------------------------------
 * Reuses TALIMOON's existing narrative-page language, does not
 * invent a second system: Cormorant Garamond display + Manrope
 * body, cream #F7F3EC / navy #1C2A3A / restrained gold #B8935B, the
 * site's horizontal padding + reading container, and the same
 * reveal motion (opacity + a small rise, reduced-motion aware) that
 * About and Story Library use.
 *
 * This file holds ONLY what a foundation genuinely needs: the
 * type/colour constants, the reveal wrappers, the eyebrow + rule
 * marks, and a plain band shell. HAYOT's editorial rhythm (mixed
 * weights, the pulse, the stream) is deliberately NOT abstracted
 * here — those compositions arrive in later increments and each
 * owns its own layout.
 *
 * i18n: consumers pass `useT(EN, UZ)` copy objects; RU/AR fall back
 * to EN, exactly as the rest of the site does. Layout uses centred
 * measures / logical flow so it never depends on text length, and
 * the band accepts a `dir` for future RTL editions.
 */

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// ── Design constants (identical to about/shared.tsx) ────────────────
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

// ── Scroll reveal ──────────────────────────────────────────────────
export const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Wrap a block so its children rise in once, gently, on scroll. */
export function Reveal({
  children,
  className,
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : revealContainer}
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** A single revealed line/block. Plain element when motion is reduced. */
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

// ── Small shared marks ─────────────────────────────────────────────
/** The gold eyebrow the site uses to open a section (small caps,
 *  wide tracking) — matches Values / Our Products / About. */
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

/** A short centred gold hairline — the divider mark the site uses
 *  under eyebrows and between movements. */
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

// ── Band shell ─────────────────────────────────────────────────────
/**
 * A HAYOT band: full-width, its own vertical rhythm (passed via
 * `className`), the site's horizontal padding + reading container.
 * `tone="raised"` uses the slightly lighter paper. `dir` is passed
 * straight through for future RTL editions.
 */
export function Band({
  id,
  children,
  tone = 'cream',
  className = '',
  labelledBy,
  dir,
}: {
  id?: string;
  children: React.ReactNode;
  tone?: 'cream' | 'raised';
  className?: string;
  labelledBy?: string;
  dir?: 'ltr' | 'rtl';
}) {
  const bg = tone === 'raised' ? CREAM_RAISED : CREAM;
  return (
    <section
      id={id}
      dir={dir}
      aria-labelledby={labelledBy}
      className={`relative w-full overflow-hidden px-6 md:px-10 lg:px-16 ${className}`}
      style={{ backgroundColor: bg, color: NAVY }}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}
