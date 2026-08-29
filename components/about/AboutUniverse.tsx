'use client';

/**
 * About 05 — ONE TALIMOON UNIVERSE.  A WOW moment.
 * Not four product cards: four worlds strung on one continuous golden
 * thread — book → story world → characters → physical play → library.
 * The thread weaves horizontally on desktop, vertically on mobile, and
 * draws itself in once on scroll.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Eyebrow, GoldRule, Section } from './shared';

const EN = {
  eyebrow: 'One universe',
  headline: 'Different products. One TALIMOON world.',
  worlds: [
    { key: 'books', name: 'Personalized Books', line: 'The child becomes part of the story.' },
    { key: 'yy', name: 'Yusuf & Yasmina', line: 'Stories and adventures continue through the characters.' },
    { key: 'toys', name: 'TALIMOON Toys', line: 'The story leaves the page and reaches the child’s hands.' },
    { key: 'library', name: 'Story Library', line: 'Reading, listening and watching meet in one place.' },
  ],
};
const UZ: typeof EN = {
  eyebrow: 'Bitta olam',
  headline: 'Turli mahsulotlar. Bitta TALIMOON olami.',
  worlds: [
    { key: 'books', name: 'Shaxsiylashtirilgan kitoblar', line: 'Bola hikoyaning bir qismiga aylanadi.' },
    { key: 'yy', name: 'Yusuf va Yasmina', line: 'Qahramonlar orqali hikoyalar va sarguzashtlar davom etadi.' },
    { key: 'toys', name: "TALIMOON o'yinchoqlari", line: "Hikoya sahifadan chiqib, bolaning qo'liga keladi." },
    { key: 'library', name: 'Hikoyalar kutubxonasi', line: "O'qish, tinglash va tomosha qilish tajribalari bir joyda uchrashadi." },
  ],
};

function WorldIcon({ k }: { k: string }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: '0 0 30 30',
    fill: 'none',
    stroke: GOLD,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (k === 'books')
    return (
      <svg {...common}>
        <path d="M6 8c3-1.6 6-1.6 9 0 3-1.6 6-1.6 9 0v14c-3-1.6-6-1.6-9 0-3-1.6-6-1.6-9 0V8Z" />
        <path d="M15 8v14" />
      </svg>
    );
  if (k === 'yy')
    return (
      <svg {...common}>
        <circle cx="11" cy="10" r="3" />
        <circle cx="19" cy="10" r="3" />
        <path d="M6 24c0-4 2.5-6 5-6s5 2 5 6M14 24c0-4 2.5-6 5-6s5 2 5 6" />
      </svg>
    );
  if (k === 'toys')
    return (
      <svg {...common}>
        <rect x="6" y="14" width="10" height="10" rx="1.5" />
        <circle cx="20.5" cy="19" r="4.5" />
        <path d="M15 6l1.6 3.4L20 11l-3.4 1.6L15 16l-1.6-3.4L10 11l3.4-1.6L15 6Z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="5" y="6" width="4.5" height="18" rx="1" />
      <rect x="11" y="6" width="4.5" height="18" rx="1" />
      <path d="M17.5 8l5 1.4-4 16.2-5-1.4" />
    </svg>
  );
}

export function AboutUniverse() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  const drawn = { pathLength: 1 };

  return (
    <Section labelledBy="about-universe-heading" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[720px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-universe-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-[28px] sm:text-[34px] md:text-[42px] lg:text-[46px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.14,
            letterSpacing: '-0.015em',
          }}
        >
          {t.headline}
        </motion.h2>
        <GoldRule className="mt-8" />
      </div>

      {/* DESKTOP / TABLET — horizontal thread through four nodes */}
      <div className="relative mt-16 hidden md:block">
        <svg
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 top-[28px] h-20 w-full"
        >
          <motion.path
            d="M40 40 C170 6 210 74 340 40 C470 6 530 74 660 40 C790 6 830 74 960 40"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={reduced ? drawn : { pathLength: 0 }}
            whileInView={drawn}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <ol className="relative grid grid-cols-4 gap-8">
          {t.worlds.map((w, i) => (
            <motion.li
              key={w.key}
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <span
                className="grid h-16 w-16 place-items-center rounded-full"
                style={{ background: '#FDFBF7', border: `1px solid ${GOLD}` }}
              >
                <WorldIcon k={w.key} />
              </span>
              <h3
                className="mt-5 text-[19px]"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}
              >
                {w.name}
              </h3>
              <p
                className="mt-2 max-w-[220px] text-[14px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.6 }}
              >
                {w.line}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* MOBILE — vertical thread down the left */}
      <ol className="relative mt-12 md:hidden">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[31px] top-6 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}, ${GOLD}, transparent)` }}
        />
        {t.worlds.map((w, i) => (
          <motion.li
            key={w.key}
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-5 py-5"
          >
            <span
              className="z-[1] grid h-16 w-16 shrink-0 place-items-center rounded-full"
              style={{ background: '#F7F3EC', border: `1px solid ${GOLD}` }}
            >
              <WorldIcon k={w.key} />
            </span>
            <div className="pt-2">
              <h3
                className="text-[19px]"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}
              >
                {w.name}
              </h3>
              <p
                className="mt-1.5 text-[15px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.65 }}
              >
                {w.line}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}

export default AboutUniverse;
