'use client';

/**
 * About 06 — PARENT + CHILD.
 * A quiet, intimate moment — a parent and child seen from behind,
 * close together over a story — not stock photography. Line-art in
 * navy on cream; the emotional closing line carries the section.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Section } from './shared';

const EN = {
  headline: 'Made for children. Together with parents.',
  body: 'TALIMOON isn’t built just to keep a child busy. We build experiences a parent and child can read, listen to, play and talk through together — and make new memories.',
  closing:
    'Because more precious than a child’s favourite story is having lived it with you.',
  artAlt: 'A parent and child sit close together from behind, sharing an open book.',
};
const UZ: typeof EN = {
  headline: "Bolalar uchun yaratilgan. Ota-onalar bilan birga.",
  body: "TALIMOON bolani shunchaki band qilish uchun yaratilmaydi. Biz ota-ona va farzand birga o'qishi, tinglashi, o'ynashi, suhbatlashishi va yangi xotiralar yaratishi mumkin bo'lgan tajribalarni quramiz.",
  closing:
    "Chunki bolaning eng sevimli hikoyasidan ham qadrlirog'i — uni siz bilan birga boshdan kechirganidir.",
  artAlt: "Ota-ona va bola orqa tomondan, bir-biriga yaqin o'tirib, ochiq kitobni birga ko'rmoqda.",
};

function ReadingTogether({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 520 320" role="img" aria-label={title} className="h-auto w-full">
      <defs>
        <radialGradient id="ab-pc-fade" cx="50%" cy="58%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="66%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="ab-pc-mask">
          <rect width="520" height="320" fill="url(#ab-pc-fade)" />
        </mask>
      </defs>
      <g mask="url(#ab-pc-mask)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* warm light behind them */}
        <circle cx="260" cy="150" r="120" fill={GOLD} fillOpacity="0.05" />
        {/* parent — larger, left */}
        <g stroke={NAVY} strokeOpacity="0.6" strokeWidth="2.2">
          <circle cx="212" cy="112" r="26" fill={NAVY} fillOpacity="0.55" />
          <path d="M212 138 C176 146 164 210 168 288 L262 288 C266 208 250 148 212 138 Z" fill={NAVY} fillOpacity="0.55" />
        </g>
        {/* child — smaller, right, leaning in */}
        <g stroke={NAVY} strokeOpacity="0.6" strokeWidth="2">
          <circle cx="300" cy="150" r="19" fill={NAVY} fillOpacity="0.55" />
          <path d="M300 169 C276 175 268 224 270 288 L336 288 C340 226 326 178 300 169 Z" fill={NAVY} fillOpacity="0.55" />
        </g>
        {/* the shared book, held low between them — gold */}
        <g stroke={GOLD} strokeWidth="1.6">
          <path d="M232 250 C252 238 276 238 296 250 C276 262 252 262 232 250 Z" />
          <path d="M264 242 V258" strokeOpacity="0.7" />
        </g>
      </g>
    </svg>
  );
}

export function AboutParentChild() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-pc-heading" className="py-24 md:py-32 lg:py-40">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-20">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 mx-auto w-full max-w-[460px] lg:order-1"
        >
          <ReadingTogether title={t.artAlt} />
        </motion.div>

        <div className="order-1 max-w-[560px] lg:order-2">
          <motion.h2
            id="about-pc-heading"
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[26px] sm:text-[32px] md:text-[40px] lg:text-[44px]"
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
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[16px] md:text-[18px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.78 }}
          >
            {t.body}
          </motion.p>
        </div>
      </div>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-20 max-w-[820px] text-center text-[22px] sm:text-[26px] md:mt-24 md:text-[32px]"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          color: NAVY,
          lineHeight: 1.3,
        }}
      >
        {t.closing}
      </motion.p>
    </Section>
  );
}

export default AboutParentChild;
