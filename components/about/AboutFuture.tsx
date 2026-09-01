'use client';

/**
 * About 09 — THE FUTURE.
 * Direction, not hype. No roadmap, no unshipped products. The prepared
 * editorial image of the TALIMOON world quietly expanding toward the
 * horizon.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Eyebrow, Section, SPACE_NORMAL } from './shared';

const EN = {
  eyebrow: 'Ahead',
  headline: 'A world that began with one book is still being built.',
  body: 'We see TALIMOON’s future not as separate products, but as one world that grows as a child grows.',
  closing: [
    'Our goal isn’t to make more products.',
    'It’s to make better experiences that become a meaningful part of childhood and family life.',
  ],
  artAlt: 'A wide horizon with a golden path continuing outward and small far shapes suggesting new worlds.',
};
const UZ: typeof EN = {
  eyebrow: 'OLDINDA',
  headline: 'Bir kitobdan boshlangan dunyo hali qurilmoqda.',
  body: "TALIMOONning kelajagini alohida mahsulotlar sifatida emas, bolaning ulg'ayishi bilan birga o'sadigan yagona olam sifatida ko'ramiz.",
  closing: [
    "Maqsadimiz ko'proq mahsulot yaratish emas.",
    "Bolalik va oila hayotining mazmunli qismiga aylanadigan yaxshiroq tajribalar yaratish.",
  ],
  artAlt: "Keng ufq; oltin yo'l tashqariga davom etadi, uzoqdagi kichik shakllar yangi olamlarni eslatadi.",
};

export function AboutFuture() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-future-heading" className={SPACE_NORMAL} railInset>
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
        className="mx-auto mt-8 w-full max-w-[920px] md:mt-10"
      >
        <Image
          src="/images/about/about-future.webp"
          alt={t.artAlt}
          width={2204}
          height={713}
          quality={100}
          sizes="(max-width: 1024px) 92vw, 1000px"
          className="h-auto w-full"
        />
      </motion.div>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-8 max-w-[760px] text-center text-[22px] sm:text-[26px] md:mt-10 md:text-[32px]"
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
