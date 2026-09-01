'use client';

/**
 * About 07 — THE PEOPLE BEHIND TALIMOON.
 * ----------------------------------------------------------------
 * Not a corporate "Our Team" page — TALIMOON is a founder-led, closely
 * built creative company, and this section says so through composition
 * rather than a caption. Sherzodbek gets the larger, primary editorial
 * treatment (his portrait and words lead); Oybek gets a real, dignified
 * secondary treatment — smaller, never diminished. No skill tags, no
 * social badges, no fake stats, no org-chart aesthetic.
 *
 * REALITY OVER ARTIFICIAL PERFECTION (spec §16/§29/§37): neither
 * portrait exists in the repo yet, so both `PEOPLE[].src` stay
 * undefined and `PersonFrame` renders an honest composed placeholder —
 * never a stock photo or a fabricated likeness. Drop the real photos
 * at `/public/images/about/sherzodbek.jpg` and `/public/images/about/oybek.jpg`
 * and set `src` below; nothing else needs to change.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, NAVY_48, Eyebrow, Section } from './shared';

const EASE = [0.22, 1, 0.36, 1] as const;

const EN = {
  eyebrow: 'The people behind TALIMOON',
  headline: 'Now, meet the people building it.',
  founder: {
    name: 'Sherzodbek Yunusov',
    title: 'Founder of TALIMOON',
    body: 'He shapes TALIMOON’s core concept, story world, product direction, design and digital experience as one coherent vision, and leads the project’s creative and technical development.',
    reflection:
      'He thinks less about what a story should tell a child, and more about what a child will carry away from it.',
    alt: 'Sherzodbek Yunusov, founder of TALIMOON.',
  },
  partner: {
    name: 'Oybek Ubaydullayev',
    role: 'Operations & Customer Experience',
    body: 'Part of TALIMOON since its earliest days — he helped the first book reach the children as a printed copy, and played an important role in choosing the TALIMOON name. Today he coordinates printing, orders, customer communication, sales and delivery.',
    alt: 'Oybek Ubaydullayev.',
  },
};

const UZ: typeof EN = {
  eyebrow: 'TALIMOON ORTIDAGI INSONLAR',
  headline: 'Endi uning ortidagi insonlar bilan tanishing.',
  founder: {
    name: 'Sherzodbek Yunusov',
    title: 'TALIMOON asoschisi',
    body: "TALIMOONning asosiy konsepsiyasi, hikoya dunyosi, mahsulot yo'nalishlari, dizayni va raqamli tajribasini bir butun qarash atrofida shakllantiradi. Loyihaning ijodiy va texnologik rivojlanishini boshqaradi.",
    reflection:
      "U bolaga nimani aytish kerakligidan ko'ra, bola nimani his qilib olib ketishi haqida ko'proq o'ylaydi.",
    alt: 'Sherzodbek Yunusov, TALIMOON asoschisi.',
  },
  partner: {
    name: 'Oybek Ubaydullayev',
    role: 'Operatsion boshqaruv va mijozlar tajribasi',
    body: "TALIMOONning ilk kunlaridan beri loyiha yonida. Birinchi kitobning chop etilib bolalarga yetib borishida yordam bergan va TALIMOON nomining tanlanishida muhim rol o'ynagan. Bugun chop etish jarayonlari, buyurtmalar, mijozlar bilan aloqa, sotuv va yetkazib berish ishlarini muvofiqlashtiradi.",
    alt: 'Oybek Ubaydullayev.',
  },
};

/** Honest portrait slot — a real photo when `src` is set, otherwise a
 *  composed frame that never stands in for a real likeness. */
function PersonFrame({
  src,
  alt,
  size = 'large',
}: {
  src?: string;
  alt: string;
  size?: 'large' | 'medium';
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: size === 'large' ? '4 / 5' : '1 / 1',
        background: '#FDFBF7',
        border: `1px solid ${GOLD_SOFT}`,
        borderRadius: 2,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={size === 'large' ? '(max-width: 1024px) 90vw, 460px' : '(max-width: 1024px) 60vw, 320px'}
          className="object-cover"
        />
      ) : (
        <>
          <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5" style={{ borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5" style={{ borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
        </>
      )}
    </div>
  );
}

// Real portraits, when they exist — drop the files and set `src`.
const PORTRAITS: { founder?: string; partner?: string } = {};

export function AboutPeople() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-people-heading" className="py-24 md:py-32 lg:py-40" tone="raised">
      <div className="mx-auto max-w-[640px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-people-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-4 text-[26px] sm:text-[32px] md:text-[38px]"
          style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.18, letterSpacing: '-0.015em' }}
        >
          {t.headline}
        </motion.h2>
      </div>

      {/* Founder — the larger, primary editorial treatment */}
      <div className="mt-16 grid items-center gap-10 md:mt-20 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto w-full max-w-[340px] lg:mx-0"
        >
          <PersonFrame src={PORTRAITS.founder} alt={t.founder.alt} size="large" />
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="max-w-[560px]"
        >
          <h3 className="text-[24px] md:text-[30px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>
            {t.founder.name}
          </h3>
          <p className="mt-1.5 text-[13px] uppercase" style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.14em', color: GOLD }}>
            {t.founder.title}
          </p>
          <p className="mt-6 text-[16px] md:text-[17px]" style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}>
            {t.founder.body}
          </p>
          <p
            className="mt-5 text-[15px] italic md:text-[16px]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: NAVY_48, lineHeight: 1.6 }}
          >
            {t.founder.reflection}
          </p>
        </motion.div>
      </div>

      {/* A quiet hairline between the two — different weight, same respect */}
      <div className="mx-auto my-16 h-px w-full max-w-[1000px] md:my-20" style={{ background: 'rgba(28,42,58,0.10)' }} />

      {/* Partner — a real, dignified secondary treatment */}
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-14">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto w-full max-w-[200px] lg:mx-0"
        >
          <PersonFrame src={PORTRAITS.partner} alt={t.partner.alt} size="medium" />
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          className="max-w-[560px]"
        >
          <h3 className="text-[20px] md:text-[24px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>
            {t.partner.name}
          </h3>
          <p className="mt-1.5 text-[13px] uppercase" style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.14em', color: GOLD }}>
            {t.partner.role}
          </p>
          <p className="mt-5 text-[15.5px] md:text-[16.5px]" style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}>
            {t.partner.body}
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

export default AboutPeople;
