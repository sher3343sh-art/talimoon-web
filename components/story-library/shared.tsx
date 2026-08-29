'use client';

/**
 * Story Library — shared primitives.
 * ----------------------------------------------------------------
 * Reuses TALIMOON's visual DNA, does not invent a second system:
 * Cormorant Garamond display + Manrope body, cream #F7F3EC / navy
 * #1C2A3A / restrained gold #B8935B (= --gold-500), the site's
 * container + horizontal padding, and the same reveal motion the
 * marketing sections use (opacity + a small rise, reduced-motion
 * aware). Story Library reads a touch more immersive than a
 * marketing page — that shows up as a darker "reading" ground in the
 * Reader and the featured slot, not as new colours or type.
 */

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

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
export const GOLD_FAINT = 'rgba(184,147,91,0.12)';
/** The dimmed ground the Reader and the featured hero sit on. */
export const READING_GROUND = '#141C26';

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

/** Wrap a band so its children rise in once on scroll. */
export function Reveal({
  children,
  className,
  amount = 0.25,
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
  if (reduced)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  return (
    <motion.div variants={revealItem} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export function Eyebrow({
  children,
  className = '',
  tone = 'gold',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'gold' | 'inverse';
}) {
  return (
    <span
      className={`block uppercase ${className}`}
      style={{
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 13,
        letterSpacing: '0.24em',
        color: tone === 'inverse' ? 'rgba(247,243,236,0.66)' : GOLD,
      }}
    >
      {children}
    </span>
  );
}

/** A Story Library band: full-width, its own vertical rhythm, the
 *  site's horizontal padding + reading container. */
export function Band({
  id,
  children,
  tone = 'cream',
  className = '',
  labelledBy,
}: {
  id?: string;
  children: React.ReactNode;
  tone?: 'cream' | 'raised' | 'ground';
  className?: string;
  labelledBy?: string;
}) {
  const bg =
    tone === 'ground' ? READING_GROUND : tone === 'raised' ? CREAM_RAISED : CREAM;
  const color = tone === 'ground' ? CREAM : NAVY;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative w-full overflow-hidden px-6 md:px-10 lg:px-16 ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

// ── PlaceholderCover ───────────────────────────────────────────────
/**
 * An on-brand stand-in for a book cover we don't have artwork for
 * yet — a navy plate with a thin gold inner frame, a small mark and
 * the label. It reads as "prepared, not missing", so a near-empty
 * library still feels intentional and premium. Swapped out the moment
 * a real cover exists.
 */
export function PlaceholderCover({
  label,
  title,
  className = '',
}: {
  /** e.g. "01-QISM" */
  label?: string;
  title?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 300"
      role="img"
      aria-label={
        title ? `${label ? label + ' — ' : ''}${title}` : label || 'Cover'
      }
      className={`h-auto w-full ${className}`}
      style={{ display: 'block' }}
    >
      <rect width="240" height="300" fill={NAVY} />
      <rect
        x="14"
        y="14"
        width="212"
        height="272"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.5"
        strokeWidth="1"
      />
      {/* small mark */}
      <g
        transform="translate(120 120)"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <circle r="16" strokeOpacity="0.85" />
        <path d="M-16 0 A16 16 0 0 1 16 0" strokeOpacity="0.45" />
        <path d="M0 -22 v6 M0 16 v6 M-22 0 h6 M16 0 h6" strokeOpacity="0.4" />
      </g>
      {label ? (
        <text
          x="120"
          y="196"
          textAnchor="middle"
          fill={GOLD}
          style={{
            fontFamily: BODY,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.22em',
          }}
        >
          {label.toUpperCase()}
        </text>
      ) : null}
      {title ? (
        <text
          x="120"
          y="224"
          textAnchor="middle"
          fill="rgba(247,243,236,0.7)"
          style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600 }}
        >
          {title}
        </text>
      ) : null}
    </svg>
  );
}
