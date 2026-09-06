'use client';

/**
 * The Hall — World I: Family Stories.
 *
 * Published family stories are shown as a warm, hand-placed cluster
 * (slight rotations, varied sizes — like framed pictures on a mantel),
 * each with only its title and a family-chosen dedication. No
 * surname, no location, no age unless the family opted in.
 *
 * With none published yet, the cluster becomes empty frames waiting
 * to be filled — which literally pictures the promise: *your story
 * could be here*. It is calm and intentional, not a "no results"
 * message.
 */

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import type { Story } from '@/lib/story-library/types';
import {
  BODY,
  DISPLAY,
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  NAVY,
  NAVY_48,
  NAVY_64,
} from './shared';

const EN = {
  eyebrow: 'Personalized collections',
  heading: 'Made for one child. Shared by their family.',
  body: 'Each book carries a child’s name, interests and familiar world. Only the stories families choose to share are collected here.',
  consentNote: 'Only with the family’s permission.',
  emptyLead: 'The first approved stories will appear here soon.',
  viewAll: 'Explore the collections',
};
const UZ: typeof EN = {
  eyebrow: "Shaxsiylashtirilgan to'plamlar",
  heading: 'Bir bola uchun yaratilgan. Oilasi tomonidan ulashilgan.',
  body: "Har bir kitobda bolaning ismi, qiziqishlari va unga tanish olam bor. Bu yerda faqat oilasi ulashishni tanlagan hikoyalar jamlanadi.",
  consentNote: 'Faqat oila ruxsati bilan.',
  emptyLead: 'Ilk ruxsat berilgan hikoyalar tez orada shu yerda paydo bo‘ladi.',
  viewAll: "To'plamlarni ko'rish",
};
const RU: typeof EN = {
  eyebrow: 'Именные коллекции',
  heading: 'Создано для одного ребёнка. Опубликовано его семьёй.',
  body: 'В каждой книге отражены имя, интересы и близкий ребёнку мир. Здесь собраны только те истории, которыми семьи решили поделиться.',
  consentNote: 'Только с согласия семьи.',
  emptyLead: 'Первые одобренные истории скоро появятся здесь.',
  viewAll: 'Смотреть коллекции',
};

// gentle, fixed "hand-placed" transforms for the frame cluster
const FRAMES = [
  { w: 'w-[38%] sm:w-[26%]', rot: -3, up: 'mt-6 sm:mt-10' },
  { w: 'w-[46%] sm:w-[30%]', rot: 2, up: 'mt-0' },
  { w: 'w-[40%] sm:w-[24%]', rot: -1.5, up: 'mt-8 sm:mt-14' },
  { w: 'hidden sm:block sm:w-[22%]', rot: 3.5, up: 'sm:mt-4' },
];

export function FamilyStoriesWorld({ stories }: { stories: Story[] }) {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();
  const isEmpty = stories.length === 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 18 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[440px]"
      >
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2
          className="mt-4 text-[24px] sm:text-[28px] md:text-[32px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
          }}
        >
          {t.heading}
        </h2>
        <p
          className="mt-4 text-[15px] md:text-[16px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.72 }}
        >
          {t.body}
        </p>
        <p
          className="mt-6 text-[12px] uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: NAVY_48,
          }}
        >
          {t.consentNote}
        </p>
        <Link
          href="/story-library/families"
          className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase transition-opacity duration-300 hover:opacity-60"
          style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.16em', color: NAVY }}
        >
          {t.viewAll}
          <span aria-hidden="true" style={{ color: GOLD }}>&rarr;</span>
        </Link>
      </motion.div>

      {/* the mantel */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 22 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
          {FRAMES.map((f, i) => (
            <div
              key={i}
              className={`${f.w} ${f.up}`}
              style={{ transform: `rotate(${f.rot}deg)` }}
            >
              <div
                className="w-full"
                style={{
                  aspectRatio: '4 / 5',
                  background: '#FDFBF7',
                  border: `1px solid ${GOLD_SOFT}`,
                  boxShadow: '0 10px 30px rgba(28,42,58,0.06)',
                  borderRadius: 2,
                }}
                aria-hidden={isEmpty ? 'true' : undefined}
              />
            </div>
          ))}
        </div>
        {isEmpty ? (
          <p
            className="mt-8 text-center text-[13px]"
            style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}
          >
            {t.emptyLead}
          </p>
        ) : null}
      </motion.div>
    </div>
  );
}

export default FamilyStoriesWorld;
