'use client';

/**
 * About 04 — THE CHILD'S PERSPECTIVE.
 * One immersive idea, not three feature cards: the prepared editorial
 * image of a child's imaginative view of a story, under three short
 * lines that read as a rhythm, not a grid.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, NAVY, NAVY_64, Section, SPACE_NORMAL } from './shared';

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

export function AboutChildPerspective() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-cp-heading" className={SPACE_NORMAL} tone="raised" railInset>
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

        <div className="mt-8 flex flex-col items-center gap-3 md:mt-10">
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
        className="mx-auto mt-8 w-full max-w-[840px] md:mt-10"
      >
        <Image
          src="/images/about/about-child-perspective.webp"
          alt={t.artAlt}
          width={1536}
          height={1024}
          quality={100}
          sizes="(max-width: 1024px) 92vw, 900px"
          className="h-auto w-full"
        />
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
