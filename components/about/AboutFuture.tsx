'use client';

/**
 * About 09 — THE FUTURE.
 * Direction, not hype. No roadmap, no unshipped products. The TALIMOON
 * world quietly expands toward the horizon — the golden line from the
 * Origin section continuing outward past the frame.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'Ahead',
  headline: 'A world that began with one book is still being built.',
  body: 'We see TALIMOON’s future not as separate products, but as one world that grows alongside a child. Stories, characters, books, digital experiences and what comes next all serve one purpose: creating what stays in a child’s heart — meaningful, beautiful, and memorable.',
  closing: [
    'Our goal isn’t to make more products.',
    'It’s to make better experiences that stay with childhood.',
  ],
  artAlt: 'A wide horizon with a golden path continuing outward and small far shapes suggesting new worlds.',
};
const UZ: typeof EN = {
  eyebrow: 'OLDINDA',
  headline: 'Bir kitobdan boshlangan dunyo hali qurilmoqda.',
  body: "TALIMOONning kelajagini alohida mahsulotlarda emas, bolaning ulg'ayishi bilan birga rivojlanadigan yagona olamda ko'ramiz. Hikoyalar, qahramonlar, kitoblar, raqamli tajribalar va kelajakdagi mahsulotlar bir maqsad atrofida birlashadi: bolalikda qalbga singadigan narsalarni mazmunli, go'zal va esda qoladigan shaklda yaratish.",
  closing: [
    "Maqsadimiz ko'proq mahsulot yaratish emas.",
    "Bolalikda qoladigan yaxshiroq tajribalar yaratish.",
  ],
  artAlt: "Keng ufq; oltin yo'l tashqariga davom etadi, uzoqdagi kichik shakllar yangi olamlarni eslatadi.",
};

function Horizon({ title }: { title: string }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 1000 220" role="img" aria-label={title} className="h-auto w-full">
      <defs>
        <linearGradient id="ab-fut-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="16%" stopColor="#fff" stopOpacity="1" />
          <stop offset="78%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ab-fut-mask">
          <rect width="1000" height="220" fill="url(#ab-fut-fade)" />
        </mask>
      </defs>
      <g mask="url(#ab-fut-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 150 H960" stroke={NAVY} strokeOpacity="0.14" strokeWidth="1.25" />
        <motion.path
          d="M120 150 C300 150 360 128 520 120 C700 111 780 96 940 78"
          stroke={GOLD}
          strokeWidth="1.5"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <g stroke={GOLD} strokeWidth="1.3" strokeOpacity="0.7">
          <circle cx="620" cy="112" r="9" />
          <path d="M700 100 v-14 a8 8 0 0 1 16 0 v14 M694 100 h28" strokeOpacity="0.6" />
          <path d="M812 84 l2.4 5.4 l5.4 2.4 l-5.4 2.4 l-2.4 5.4 l-2.4 -5.4 l-5.4 -2.4 l5.4 -2.4 Z" fill={GOLD} stroke="none" fillOpacity="0.7" />
        </g>
      </g>
    </svg>
  );
}

export function AboutFuture() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-future-heading" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[720px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-future-heading"
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
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-[620px] text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.78 }}
        >
          {t.body}
        </motion.p>
      </div>

      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="mx-auto mt-12 w-full max-w-[1000px] md:mt-16"
      >
        <Horizon title={t.artAlt} />
      </motion.div>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-[760px] text-center text-[22px] sm:text-[26px] md:mt-14 md:text-[32px]"
        style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.32 }}
      >
        {t.closing[0]}
        <br />
        <span style={{ color: GOLD }}>{t.closing[1]}</span>
      </motion.p>
    </Section>
  );
}

export default AboutFuture;
