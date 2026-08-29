'use client';

/**
 * About 04 — OUR CREATIVE BELIEF.
 * The philosophy behind how TALIMOON makes things. NOT the Home page's
 * five values (those are traits nurtured in a child). These are three
 * CREATION PRINCIPLES — set as large numbered editorial entries, no
 * icons, no cards.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'How we create',
  statement: [
    'Catching a child’s attention is easy.',
    'Leaving a good mark on their heart is a responsibility.',
  ],
  principles: [
    {
      n: '01',
      name: 'Meaning',
      body: 'Behind every story there has to be an idea worth telling.',
    },
    {
      n: '02',
      name: 'Beauty',
      body: 'Something made for a child deserves as much care and taste as anything made for anyone.',
    },
    {
      n: '03',
      name: 'Warmth',
      body: 'Upbringing isn’t only spoken. It has to reach a child in a form they can feel.',
    },
  ],
};
const UZ: typeof EN = {
  eyebrow: 'Biz qanday yaratamiz',
  statement: [
    "Bolaning e'tiborini jalb qilish oson.",
    "Uning qalbida yaxshi iz qoldirish esa mas'uliyat.",
  ],
  principles: [
    {
      n: '01',
      name: 'Mazmun',
      body: "Har bir hikoya ortida aytishga arziydigan fikr bo'lishi kerak.",
    },
    {
      n: '02',
      name: "Go'zallik",
      body: "Bola uchun yaratilgan narsa ham katta e'tibor va did bilan yaratilishi kerak.",
    },
    {
      n: '03',
      name: 'Mehr',
      body: "Tarbiya faqat aytilmaydi. U bola his qiladigan shaklda yetib borishi kerak.",
    },
  ],
};

export function AboutCreativeBelief() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-belief-heading" className="py-24 md:py-32 lg:py-40">
      <div className="max-w-[820px]">
        <Eyebrow align="start">{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-belief-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 text-[26px] sm:text-[32px] md:text-[40px] lg:text-[44px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.16,
            letterSpacing: '-0.015em',
          }}
        >
          {t.statement[0]}
          <br />
          <span style={{ color: GOLD }}>{t.statement[1]}</span>
        </motion.h2>
      </div>

      <div className="mt-16 md:mt-20">
        {t.principles.map((p, i) => (
          <motion.div
            key={p.n}
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.75, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-8 md:grid-cols-[120px_260px_1fr] md:gap-x-10 md:py-10"
            style={{
              borderTop: `1px solid ${i === 0 ? GOLD_SOFT : 'rgba(28,42,58,0.10)'}`,
            }}
          >
            <span
              aria-hidden="true"
              className="row-span-2 text-[40px] md:row-span-1 md:text-[52px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: 'transparent',
                WebkitTextStroke: `1px ${GOLD}`,
                lineHeight: 1,
              }}
            >
              {p.n}
            </span>
            <h3
              className="text-[22px] md:text-[26px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.2,
              }}
            >
              {p.name}
            </h3>
            <p
              className="col-span-2 max-w-[520px] text-[16px] md:col-span-1 md:text-[17px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
            >
              {p.body}
            </p>
          </motion.div>
        ))}
        <div style={{ borderTop: '1px solid rgba(28,42,58,0.10)' }} />
      </div>
    </Section>
  );
}

export default AboutCreativeBelief;
