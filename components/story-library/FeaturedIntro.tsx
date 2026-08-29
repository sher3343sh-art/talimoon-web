'use client';

/**
 * The Hall — featured slot.
 *
 * When a story is curated as featured, this becomes a cinematic hero
 * on the dimmed reading ground (cover + title + Begin). Until then —
 * and there is no published content in V1 — it degrades to a calm
 * editorial panel that says, plainly, what the two worlds are and how
 * a story comes to live here. Either way the slot reads as
 * intentional, never as an empty carousel.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import type { Story } from '@/lib/story-library/types';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, READING_GROUND } from './shared';

const EN = {
  panelEyebrow: 'How the library grows',
  panelLines: [
    'Every family who orders a personalized TALIMOON book is later asked, gently, whether they would like to share its digital version here.',
    'Nothing is published without a parent’s explicit permission. So this shelf fills, one real story at a time, with the families’ blessing.',
  ],
  panelClosing: 'The first stories are being prepared now.',
};
const UZ: typeof EN = {
  panelEyebrow: "Kutubxona qanday to'ladi",
  panelLines: [
    "Shaxsiy TALIMOON kitobiga buyurtma bergan har bir oiladan keyinroq, ohista, uning raqamli nusxasini shu yerda baham ko'rishni istaydimi, deb so'raladi.",
    "Hech narsa ota-onaning aniq roziligisiz e'lon qilinmaydi. Shu bois bu javon oilalar rizoligi bilan, bittalab haqiqiy hikoyalar bilan to'ladi.",
  ],
  panelClosing: 'Dastlabki hikoyalar hozir tayyorlanmoqda.',
};

function EditorialPanel() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[6px] px-7 py-12 md:px-14 md:py-16"
      style={{ backgroundColor: READING_GROUND, color: '#F7F3EC' }}
    >
      <span
        aria-hidden="true"
        className="absolute left-7 top-7 h-6 w-6 md:left-10 md:top-10"
        style={{ borderTop: `1px solid ${GOLD_SOFT}`, borderLeft: `1px solid ${GOLD_SOFT}` }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-7 right-7 h-6 w-6 md:bottom-10 md:right-10"
        style={{ borderBottom: `1px solid ${GOLD_SOFT}`, borderRight: `1px solid ${GOLD_SOFT}` }}
      />
      <div className="mx-auto max-w-[640px] text-center">
        <span
          className="block uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.24em',
            color: 'rgba(247,243,236,0.55)',
          }}
        >
          {t.panelEyebrow}
        </span>
        <div className="mt-6 space-y-4">
          {t.panelLines.map((line, i) => (
            <p
              key={i}
              className="text-[15px] md:text-[17px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: 'rgba(247,243,236,0.9)',
                lineHeight: 1.5,
              }}
            >
              {line}
            </p>
          ))}
        </div>
        <p
          className="mt-8 text-[13px]"
          style={{
            fontFamily: BODY,
            color: GOLD,
            letterSpacing: '0.06em',
          }}
        >
          {t.panelClosing}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturedIntro({ featured }: { featured: Story | null }) {
  // V1: always the editorial panel. When `featured` is a real
  // published story, this is where the cinematic cover hero goes
  // (next increment, alongside the Story page + Reader).
  if (!featured) return <EditorialPanel />;
  return <EditorialPanel />;
}

export default FeaturedIntro;
