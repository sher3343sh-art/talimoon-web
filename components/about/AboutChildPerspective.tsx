'use client';

/**
 * About 03 — THE CHILD'S PERSPECTIVE.
 * One immersive idea, not three feature cards: an ordinary open book
 * unfolds into a large imaginative landscape seen from the child's
 * point of view. The three short lines read as a rhythm, not a grid.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Section } from './shared';

type CP = {
  headline: string;
  lines: readonly (readonly [string, string])[];
  support: string;
  artAlt: string;
};

const EN: CP = {
  headline: 'We look at the world through a child’s eyes.',
  lines: [
    ['An ordinary story', 'is an adventure.'],
    ['An ordinary question', 'is a discovery.'],
    ['An ordinary game', 'is a whole new world.'],
  ],
  support:
    'So in everything TALIMOON makes, a child’s curiosity, imagination and feelings come first.',
  artAlt:
    'A small open book on the ground unfolds upward into a wide landscape — hills, an arch, a path and stars — the way a child sees a story.',
};
const UZ: CP = {
  headline: "Biz dunyoga bolaning ko'zi bilan qaraymiz.",
  lines: [
    ['Bola uchun oddiy bir hikoya', 'sarguzasht.'],
    ['Oddiy savol', 'kashfiyot.'],
    ["Oddiy o'yin", "yangi bir dunyo."],
  ],
  support:
    "Shuning uchun TALIMOON yaratgan har bir tajribada bolaning qiziqishi, tasavvuri va his-tuyg'ulari birinchi o'rinda turadi.",
  artAlt:
    "Yerdagi kichik ochiq kitob yuqoriga qarab keng manzaraga aylanadi — tepaliklar, ravoq, yo'l va yulduzlar — bola hikoyani shunday ko'radi.",
};

function BookToWorld({ title }: { title: string }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 900 460"
      role="img"
      aria-label={title}
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="ab-cp-fade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ab-cp-sidefade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="14%" stopColor="#fff" stopOpacity="1" />
          <stop offset="86%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ab-cp-mask">
          <rect width="900" height="460" fill="url(#ab-cp-fade)" />
          <rect width="900" height="460" fill="url(#ab-cp-sidefade)" style={{ mixBlendMode: 'multiply' }} />
        </mask>
      </defs>

      <g mask="url(#ab-cp-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* the world rising out of the book — gold hairline */}
        <g stroke={GOLD} strokeWidth="1.4">
          {/* far hills */}
          <path d="M120 300 C260 250 340 250 460 292 C560 256 660 262 780 300" strokeOpacity="0.75" />
          <path d="M170 320 C300 288 430 300 540 322 C640 300 720 306 800 322" strokeOpacity="0.55" />
          {/* an arch on the horizon */}
          <path d="M470 268 v-40 a24 24 0 0 1 48 0 v40" strokeOpacity="0.85" />
          <path d="M462 268 h64" strokeOpacity="0.6" />
          {/* a path leading in, from the book up to the arch */}
          <path d="M450 392 C466 350 478 320 494 288" strokeOpacity="0.7" strokeDasharray="1 6" />
          {/* stars */}
          <path d="M330 150 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill={GOLD} stroke="none" fillOpacity="0.8" />
          <path d="M600 120 l2.6 6 l6 2.6 l-6 2.6 l-2.6 6 l-2.6 -6 l-6 -2.6 l6 -2.6 Z" fill={GOLD} stroke="none" fillOpacity="0.7" />
          <path d="M540 190 l2 4.6 l4.6 2 l-4.6 2 l-2 4.6 l-2 -4.6 l-4.6 -2 l4.6 -2 Z" fill={GOLD} stroke="none" fillOpacity="0.6" />
        </g>

        {/* the ordinary open book, foreground, navy — small and real */}
        <g stroke={NAVY} strokeOpacity="0.6" strokeWidth="2">
          <path d="M400 402 C424 388 452 388 476 402 C452 416 424 416 400 402 Z" fill={NAVY} fillOpacity="0.06" />
          <path d="M438 391 V415" />
          <path d="M410 398 h20 M446 398 h20" strokeOpacity="0.4" strokeWidth="1.4" />
        </g>
      </g>

      {reduced ? null : (
        <motion.g
          mask="url(#ab-cp-mask)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <path
            d="M438 388 C438 320 470 240 494 190"
            fill="none"
            stroke={GOLD}
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeDasharray="1 8"
          />
        </motion.g>
      )}
    </svg>
  );
}

export function AboutChildPerspective() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-cp-heading" className="py-24 md:py-32 lg:py-40" tone="raised">
      <div className="mx-auto max-w-[760px] text-center">
        <motion.h2
          id="about-cp-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[28px] sm:text-[34px] md:text-[42px] lg:text-[46px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.12,
            letterSpacing: '-0.015em',
          }}
        >
          {t.headline}
        </motion.h2>

        <div className="mt-10 flex flex-col items-center gap-3 md:mt-12">
          {t.lines.map(([a, b], i) => (
            <motion.p
              key={i}
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              className="text-[17px] md:text-[19px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.6 }}
            >
              <span>{a} — </span>
              <span style={{ color: NAVY, fontWeight: 600 }}>{b}</span>
            </motion.p>
          ))}
        </div>
      </div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-14 w-full max-w-[900px] md:mt-16"
      >
        <BookToWorld title={t.artAlt} />
      </motion.div>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-4 max-w-[620px] text-center text-[16px] md:mt-2 md:text-[18px]"
        style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
      >
        {t.support}
      </motion.p>
    </Section>
  );
}

export default AboutChildPerspective;
