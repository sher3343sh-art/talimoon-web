'use client';

/**
 * About 02 — ORIGIN / WHY WE EXIST.
 * The emotional "why" before any dates or company facts. A single
 * golden line begins from one point and evolves down the section
 * (point → line → story → path → world); it draws itself in once on
 * scroll and then holds. The section's weight is the central question.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'Why TALIMOON?',
  headline: 'It began with a single question.',
  question:
    'How do we leave our children not just a beautiful childhood, but a meaningful one?',
  body: [
    'TALIMOON was born from that question.',
    'We wanted the things children love to read, listen to, watch and play with to be more than a way to pass the time.',
    'We believed each of them could leave a good mark on a child’s heart.',
  ],
};
const UZ: typeof EN = {
  eyebrow: 'Nega TALIMOON?',
  headline: 'Hammasi bitta savoldan boshlandi.',
  question:
    "Farzandlarimizga shunchaki chiroyli bolalik emas, mazmunli bolalikni qanday qoldiramiz?",
  body: [
    "TALIMOON shu savoldan tug'ildi.",
    "Biz bolalar sevib o'qiydigan, tinglaydigan, tomosha qiladigan va o'ynaydigan narsalar shunchaki vaqt o'tkazish vositasi bo'lib qolmasligini istadik.",
    "Ularning har biri bolaning qalbida yaxshi bir iz qoldirishi mumkinligiga ishondik.",
  ],
};

/** The evolving golden line: one point at the top, growing into a path
 *  and a small world at the foot. Vertical rail on md+, a slim top
 *  accent on mobile. */
function GoldenThread() {
  const reduced = useReducedMotion();
  const draw = reduced
    ? { pathLength: 1, opacity: 0.9 }
    : { pathLength: 1, opacity: 0.9 };
  return (
    <svg
      viewBox="0 0 60 520"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-full w-[60px]"
    >
      {/* seed point */}
      <circle cx="30" cy="14" r="3.4" fill={GOLD} />
      <circle cx="30" cy="14" r="8" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="1" />
      {/* the line: straight, then a gentle path, opening into a loop */}
      <motion.path
        d="M30 22 V150 C30 210 8 250 30 300 C50 344 50 392 30 430"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduced ? draw : { pathLength: 0, opacity: 0.5 }}
        whileInView={draw}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* the small world it grows into */}
      <motion.g
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1.9 }}
      >
        <circle cx="30" cy="454" r="16" fill="none" stroke={GOLD} strokeWidth="1.5" />
        <ellipse cx="30" cy="454" rx="16" ry="5" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
        <path d="M30 438 v32 M14 454 h32" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

export function AboutOrigin() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section
      labelledBy="about-origin-heading"
      className="py-24 md:py-32 lg:py-40"
    >
      <div className="grid gap-10 md:grid-cols-[60px_1fr] md:gap-12 lg:gap-16">
        {/* golden thread rail — hidden on the smallest screens, a slim
            left rail from md up */}
        <div className="hidden md:block" aria-hidden="true">
          <div className="sticky top-24 h-[520px]">
            <GoldenThread />
          </div>
        </div>

        <div className="max-w-[680px]">
          {/* mobile top accent instead of the rail */}
          <span
            aria-hidden="true"
            className="mb-8 flex items-center gap-3 md:hidden"
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: GOLD }} />
            <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
          </span>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow align="start">{t.eyebrow}</Eyebrow>
            <h2
              id="about-origin-heading"
              className="mt-4 text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.12,
                letterSpacing: '-0.015em',
              }}
            >
              {t.headline}
            </h2>
          </motion.div>

          <motion.blockquote
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 border-0 pl-5 md:mt-12"
            style={{ borderLeft: `2px solid ${GOLD}` }}
          >
            <p
              className="text-[22px] sm:text-[26px] md:text-[30px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.28,
                fontStyle: 'italic',
              }}
            >
              {t.question}
            </p>
          </motion.blockquote>

          <div className="mt-10 space-y-4 md:mt-12">
            {t.body.map((line, i) => (
              <motion.p
                key={i}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.7,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-[560px] text-[16px] md:text-[17px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AboutOrigin;
