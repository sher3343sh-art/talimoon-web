'use client';

/**
 * The Hall — header. One human line about what this place is. No
 * stats, no "250+", no "categories" — nothing that depends on the
 * library being large.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, Eyebrow, NAVY, NAVY_64 } from './shared';

const EN = {
  eyebrow: 'Story Library',
  heading: 'Real family stories, and the world of Yusuf & Yasmina.',
  body: 'A small, growing collection — personalized books that families have chosen to share, alongside TALIMOON’s own continuing story world.',
};
const UZ: typeof EN = {
  eyebrow: 'Hikoyalar kutubxonasi',
  heading: 'Haqiqiy oila hikoyalari va Yusuf va Yasmina olami.',
  body: "Kichik, ammo o'sib boruvchi to'plam — oilalar baham ko'rishni tanlagan shaxsiy kitoblar va TALIMOONning davom etayotgan hikoya olami.",
};

export function LibraryHeader() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-[760px]"
    >
      <Eyebrow>{t.eyebrow}</Eyebrow>
      <h1
        className="mt-4 text-[30px] sm:text-[38px] md:text-[46px] lg:text-[50px]"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          color: NAVY,
          lineHeight: 1.12,
          letterSpacing: '-0.015em',
        }}
      >
        {t.heading}
      </h1>
      <p
        className="mt-5 max-w-[560px] text-[16px] md:text-[17px]"
        style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.72 }}
      >
        {t.body}
      </p>
    </motion.div>
  );
}

export default LibraryHeader;
