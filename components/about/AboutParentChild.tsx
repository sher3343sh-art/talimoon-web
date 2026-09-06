'use client';

/**
 * About 06 — PARENT + CHILD.
 * A quiet, intimate moment — the prepared editorial image of a parent
 * and child close together over a story; the emotional closing line
 * carries the section.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Section, SPACE_NORMAL } from './shared';

type PC = {
  headline: readonly [string, string];
  body: readonly string[];
  closing: string;
  artAlt: string;
};

const EN: PC = {
  headline: ['Created for the child.', 'Made meaningful with a parent.'],
  body: [
    'TALIMOON creates the experience that reaches the child — without leaving out the most important people in their life.',
    'Because a good story is worth more when it becomes conversation, closeness and time spent together between a child and a parent.',
  ],
  closing:
    'Because more precious than a child’s favourite story is having lived it with you.',
  artAlt: 'A parent and child sit close together from behind, sharing an open book.',
};
const UZ: PC = {
  headline: ['Bola uchun yaratiladi.', 'Ota-ona bilan ma’no kasb etadi.'],
  body: [
    'TALIMOON bolaga yetib boradigan tajribani yaratadi, lekin uning hayotidagi eng muhim insonlarni chetda qoldirmaydi.',
    'Chunki yaxshi hikoya bola bilan ota-ona o‘rtasida suhbat, yaqinlik va birga o‘tkazilgan vaqtga aylanganda uning qadri yanada ortadi.',
  ],
  closing:
    'Chunki bolaning eng sevimli hikoyasidan ham qadrlirog‘i — uni Siz bilan birga boshdan kechirganidir.',
  artAlt: 'Ota-ona va bola orqa tomondan, bir-biriga yaqin o‘tirib, ochiq kitobni birga ko‘rmoqda.',
};

const RU: PC = {
  headline: ['Создано для ребёнка.', 'Обретает смысл вместе с родителем.'],
  body: [
    'TALIMOON создаёт опыт, который доходит до ребёнка, не оставляя в стороне самых важных людей в его жизни.',
    'Ведь хорошая история значит намного больше, когда она превращается в разговор, близость и время, проведённое вместе ребёнком и родителем.',
  ],
  closing:
    'Ведь нет ничего дороже любимой истории ребёнка, пережитой вместе с Вами.',
  artAlt: 'Родитель и ребёнок сидят рядом, вид сзади, вместе рассматривая открытую книгу.',
};

export function AboutParentChild() {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-pc-heading" className={SPACE_NORMAL} railInset>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-20">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 mx-auto w-full max-w-[460px] lg:order-1"
        >
          <Image
            src="/images/about/about-parent-child.webp"
            alt={t.artAlt}
            width={1536}
            height={1024}
            quality={100}
            sizes="(max-width: 1024px) 92vw, 460px"
            className="h-auto w-full"
          />
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
              lineHeight: 1.16,
              letterSpacing: '-0.015em',
            }}
          >
            {t.headline[0]}
            <br />
            <span style={{ color: GOLD }}>{t.headline[1]}</span>
          </motion.h2>
          <div className="mt-6 space-y-4">
            {t.body.map((line, i) => (
              <motion.p
                key={i}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.1 + 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                className="text-[16px] md:text-[17px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.78 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </div>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-[820px] text-center text-[22px] sm:text-[26px] md:mt-12 md:text-[32px]"
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
