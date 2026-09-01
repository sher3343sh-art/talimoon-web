'use client';

/**
 * About 01 — HERO.  Emotional entry into TALIMOON's worldview.
 * Not a sales hero: no CTA. The composition is "the inner world of a
 * child" — a small seated figure looking toward faint story fragments
 * (a book, a distant arch, stars, a branch, a small world) rising in
 * an arc and dissolving into the cream page. Line-art in restrained
 * gold + navy, radial-masked so it melts into the background.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'About TALIMOON',
  headline: 'A whole world lives inside every child.',
  body: 'TALIMOON is being built to make stories, books and experiences that leave a mark on a child’s imagination, knowledge and heart.',
  artAlt:
    'A child sits looking toward faint story fragments — a book, a distant arch, stars and a small world — rising and dissolving into light.',
};
const UZ: typeof EN = {
  eyebrow: 'TALIMOON HAQIDA',
  headline: 'Har bir bolaning ichida bir olam bor.',
  body: "TALIMOON bolalarning tasavvuri, bilimi va qalbida iz qoldiradigan hikoyalar, kitoblar va tajribalar yaratish uchun qurilmoqda.",
  artAlt:
    "Bola o'tirib, xayolidagi hikoya bo'laklariga — kitob, uzoqdagi ravoq, yulduzlar va kichik bir olamga qarab turibdi; ular yorug'lik ichida erib ketmoqda.",
};

function InnerWorldArt({ title }: { title: string }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 560 460"
      role="img"
      aria-label={title}
      className="h-auto w-full"
      style={{ maxWidth: 560 }}
    >
      <defs>
        <radialGradient id="ab-hero-fade" cx="52%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="62%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="ab-hero-mask">
          <rect width="560" height="460" fill="url(#ab-hero-fade)" />
        </mask>
        <linearGradient id="ab-hero-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9A876" />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>

      <g
        mask="url(#ab-hero-mask)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ground / horizon */}
        <path
          d="M40 372 H520"
          stroke={NAVY}
          strokeOpacity="0.16"
          strokeWidth="1.25"
        />

        {/* the child — a calm seated silhouette, navy */}
        <g stroke={NAVY} strokeOpacity="0.62" strokeWidth="2">
          <circle cx="150" cy="300" r="17" fill={NAVY} fillOpacity="0.62" />
          <path d="M150 317 C133 322 128 348 130 372 L172 372 C176 346 168 322 150 317 Z" fill={NAVY} fillOpacity="0.62" />
          <path d="M133 372 C130 340 137 320 150 317" />
        </g>

        {/* rising arc of story fragments — gold hairline */}
        <g stroke="url(#ab-hero-gold)" strokeWidth="1.5">
          {/* open book, closest */}
          <path d="M196 286 C214 276 236 276 252 286 C236 296 214 296 196 286 Z" />
          <path d="M224 279 V293" strokeOpacity="0.7" />

          {/* leaf branch */}
          <path d="M276 236 C296 224 318 226 336 214" strokeOpacity="0.9" />
          <path d="M292 231 c-4 -8 -2 -14 4 -18 M305 224 c-4 -8 -2 -14 4 -18 M318 219 c-4 -8 -2 -14 4 -18" strokeOpacity="0.75" />

          {/* distant arch / storybook architecture */}
          <path d="M356 190 v-34 a20 20 0 0 1 40 0 v34" strokeOpacity="0.9" />
          <path d="M350 190 h52" strokeOpacity="0.7" />

          {/* small world */}
          <circle cx="452" cy="138" r="22" strokeOpacity="0.9" />
          <path d="M430 138 h44 M452 116 c12 8 12 36 0 44 M452 116 c-12 8 -12 36 0 44" strokeOpacity="0.55" />
          <ellipse cx="452" cy="138" rx="34" ry="9" strokeOpacity="0.5" />

          {/* stars */}
          <path d="M300 150 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="url(#ab-hero-gold)" stroke="none" fillOpacity="0.85" />
          <path d="M410 96 l2.4 5.6 l5.6 2.4 l-5.6 2.4 l-2.4 5.6 l-2.4 -5.6 l-5.6 -2.4 l5.6 -2.4 Z" fill="url(#ab-hero-gold)" stroke="none" fillOpacity="0.8" />
          <path d="M244 210 l2 4.6 l4.6 2 l-4.6 2 l-2 4.6 l-2 -4.6 l-4.6 -2 l4.6 -2 Z" fill="url(#ab-hero-gold)" stroke="none" fillOpacity="0.7" />

          {/* the child's line of sight — a single quiet thread from the
              figure up into the world */}
          <path
            d="M168 292 C240 250 330 200 430 150"
            strokeOpacity="0.4"
            strokeDasharray="1 7"
          />
        </g>
      </g>

      {reduced ? null : (
        <motion.circle
          cx="452"
          cy="138"
          r="2.4"
          fill={GOLD}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          mask="url(#ab-hero-mask)"
        />
      )}
    </svg>
  );
}

export function AboutHero() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-hero-heading" className="pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
      <div className="grid items-center gap-12 md:gap-10 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[620px]"
        >
          <Eyebrow align="start">{t.eyebrow}</Eyebrow>
          <h1
            id="about-hero-heading"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
            className="mt-4 text-[34px] sm:text-[42px] md:text-[52px] lg:text-[58px]"
          >
            {t.headline}
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              color: NAVY_64,
              lineHeight: 1.7,
            }}
            className="mt-6 text-[16px] md:mt-7 md:text-[18px]"
          >
            {t.body}
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none"
        >
          <InnerWorldArt title={t.artAlt} />
        </motion.div>
      </div>
    </Section>
  );
}

export default AboutHero;
