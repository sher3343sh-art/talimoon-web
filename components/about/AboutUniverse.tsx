'use client';

/**
 * About 05 — ONE TALIMOON UNIVERSE.  Placed after Creative Belief: the
 * visitor now knows WHY TALIMOON exists and WHAT every experience must
 * carry — this is what that belief is becoming.
 *
 * Five worlds, not five product cards (spec §17–20): the child-facing
 * four plus HAYOT, the parent-facing knowledge layer. Set as one
 * editorial index — number · name · one line — so it reads as
 * "one philosophy, many expressions", never a pricing/features grid.
 * A single <ol> renders once; only the decorative connecting rule
 * (aria-hidden) changes between breakpoints — the accessible content
 * is never duplicated in the DOM (spec §55).
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, Eyebrow, GoldRule, Section, SPACE_NORMAL } from './shared';

const EASE = [0.22, 1, 0.36, 1] as const;

const EN = {
  eyebrow: 'One universe',
  headline: 'From one story to a whole world.',
  worlds: [
    { key: 'books', name: 'Personalized Books', line: 'The child becomes the hero of their own story.' },
    { key: 'yy', name: 'Yusuf & Yasmina', line: 'Characters a child can see a piece of themselves in. As the stories continue, knowledge, character, values and good habits grow along with them.' },
    { key: 'toys', name: 'TALIMOON Toys', line: 'The story leaves the page and reaches the child’s hands.' },
    { key: 'library', name: 'Story Library', line: 'Reading, listening and watching stories meet in one experience.' },
    { key: 'hayot', name: 'HAYOT — For Parents', line: 'Knowledge and reflections on parenting, a child’s world and everyday habits — grounded in trustworthy sources.' },
  ],
};
const UZ: typeof EN = {
  eyebrow: 'BITTA OLAM',
  headline: 'Bir hikoyadan butun bir olamga.',
  worlds: [
    { key: 'books', name: 'Shaxsiylashtirilgan kitoblar', line: 'Bola o‘z hikoyasining bosh qahramoniga aylanadi.' },
    { key: 'yy', name: 'Yusuf va Yasmina', line: 'Bola o‘zidan bir parcha topa oladigan qahramonlar. Yusuf va Yasmina bilan hikoyalar davom etar ekan, bilim, xulq, qadriyat va yaxshi odatlar ham ular bilan birga rivojlanadi.' },
    { key: 'toys', name: 'TALIMOON o‘yinchoqlari', line: 'Hikoya sahifadan chiqib, bolaning qo‘liga keladi.' },
    { key: 'library', name: 'Hikoyalar kutubxonasi', line: 'Hikoyalarni o‘qish, tinglash va tomosha qilish bir tajribada uchrashadi.' },
    { key: 'hayot', name: 'HAYOT — ota-onalar uchun', line: 'Tarbiya, bola dunyosi va kundalik odatlar haqida ishonchli manbalarga tayangan bilim va fikrlar.' },
  ],
};

export function AboutUniverse() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-universe-heading" className={SPACE_NORMAL} tone="raised" railInset>
      <div className="mx-auto max-w-[720px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-universe-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
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
        <GoldRule className="mt-7" />
      </div>

      {/* One editorial index of five worlds — number · name · line.
          Renders once; the row rule is decorative only. */}
      <ol className="mx-auto mt-10 max-w-[920px] md:mt-12">
        {t.worlds.map((w, i) => (
          <motion.li
            key={w.key}
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
            className="grid gap-x-8 gap-y-1.5 py-5 md:grid-cols-[auto_minmax(0,300px)_1fr] md:items-baseline md:py-6"
            style={{ borderTop: `1px solid ${i === 0 ? GOLD_SOFT : 'rgba(28,42,58,0.10)'}` }}
          >
            <span
              aria-hidden="true"
              className="text-[12px] md:text-[13px]"
              style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.16em', color: GOLD }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3
              className="text-[19px] md:text-[22px]"
              style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.22 }}
            >
              {w.name}
            </h3>
            <p
              className="max-w-[520px] text-[15px] md:text-[15.5px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {w.line}
            </p>
          </motion.li>
        ))}
        <div style={{ borderTop: '1px solid rgba(28,42,58,0.10)' }} />
      </ol>
    </Section>
  );
}

export default AboutUniverse;
