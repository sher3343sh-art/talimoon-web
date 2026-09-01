'use client';

/**
 * About 08 — HOW WE CREATE.  Critical for trust — and for potential
 * partners specifically (spec §15/§24): it demonstrates execution
 * ability without a single business word. A six-step creation journey
 * set as an editorial progression (never the identical-cards look of
 * an agency site), then a row of plates that follow the same arc
 * (idea → story → world → experience → review → family). No invented
 * stats, awards, testimonials, partners, team size or credentials.
 *
 * This is deliberately NOT "Creative belief" (AboutCreativeBelief) —
 * that section is the PRINCIPLES guiding what gets made; this one is
 * the PROCESS that makes it. Step 01 here is "Understanding", not
 * "Meaning", specifically so the two sections never reuse the same
 * word for two different ideas.
 *
 * The plates take real assets when they exist — drop images at
 * `/images/about/process-1..6.jpg` (4:5, ~1000px wide) and set `src`
 * on each PLATES entry below. Until then they render as composed
 * frames that still communicate the progression honestly.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_48, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'From an idea to a family',
  headline: 'Every TALIMOON experience starts with a single thought.',
  statement: 'We don’t want to make things for children that are merely “good enough”.',
  steps: [
    { n: '01', name: 'Understanding', body: 'First we decide what this should mean to the child it’s for.' },
    { n: '02', name: 'Story', body: 'The idea becomes an experience a child will happily follow.' },
    { n: '03', name: 'World', body: 'Every image should enrich a child’s imagination.' },
    { n: '04', name: 'Experience', body: 'Reading, listening, watching or playing — the format serves the purpose.' },
    { n: '05', name: 'Review', body: 'We look at the result again, through a child’s eyes and a parent’s.' },
    { n: '06', name: 'Coming to life', body: 'It reaches a real child, in a real family.' },
  ],
  plates: ['Idea', 'Story', 'World', 'Experience', 'Review', 'Family'],
  platesNote: 'From a first note to a finished story.',
};
const UZ: typeof EN = {
  eyebrow: "G'oyadan oilagacha",
  headline: 'Har bir TALIMOON tajribasi bir fikrdan boshlanadi.',
  statement: "Biz bolalar uchun 'shunchaki yetarli' mahsulot yaratishni istamaymiz.",
  steps: [
    { n: '01', name: 'Tushunish', body: "Avval bu narsa mo'ljallangan bola uchun nimani anglatishi kerakligini aniqlaymiz." },
    { n: '02', name: 'Hikoya', body: "G'oya bola sevib kuzatadigan tajribaga aylanadi." },
    { n: '03', name: 'Tasvir', body: 'Har bir tasvir bolaning tasavvurini boyitishi kerak.' },
    { n: '04', name: 'Tajriba', body: "O'qish, tinglash, tomosha qilish yoki o'ynash — format maqsadga xizmat qiladi." },
    { n: '05', name: 'Tekshiruv', body: "Natijaga yana bolaning va ota-onaning ko'zi bilan qaraymiz." },
    { n: '06', name: 'Hayotga chiqish', body: "U haqiqiy bolaga, haqiqiy oilaga yetib boradi." },
  ],
  plates: ["G'oya", 'Hikoya', 'Tasvir', 'Tajriba', 'Tekshiruv', 'Oila'],
  platesNote: "Ilk qaydlardan tayyor hikoyagacha.",
};

// Real proof assets, when they exist. Leave `src` undefined to render
// the composed empty frame instead of a broken image.
const PLATES: { src?: string }[] = [
  {}, {}, {}, {}, {}, {},
];

export function AboutHowWeCreate() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-create-heading" className="py-24 md:py-32 lg:py-40" tone="raised">
      <div className="max-w-[760px]">
        <Eyebrow align="start">{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-create-heading"
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
          {t.headline}
        </motion.h2>
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-[560px] text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
        >
          {t.statement}
        </motion.p>
      </div>

      {/* Six steps, two rows of three — an editorial progression, not a
          single cramped row (spec §15: never six identical cards). */}
      <ol className="mt-16 grid gap-y-0 md:mt-20 md:grid-cols-3 md:gap-x-8 md:gap-y-10">
        {t.steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            className="relative py-6 md:py-0 md:pt-8"
            style={{
              borderTop: `1px solid ${i === 0 ? GOLD_SOFT : 'rgba(28,42,58,0.10)'}`,
            }}
          >
            <span
              className="text-[13px]"
              style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.18em', color: GOLD }}
            >
              {s.n}
            </span>
            <h3
              className="mt-2 text-[19px] md:text-[21px]"
              style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}
            >
              {s.name}
            </h3>
            <p
              className="mt-2 text-[14px] md:text-[15px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {s.body}
            </p>
          </motion.li>
        ))}
      </ol>

      {/* Proof plates — same arc, as images or composed frames */}
      <div className="mt-16 md:mt-24">
        <p
          className="mb-6 text-center text-[13px] uppercase"
          style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.2em', color: NAVY_48 }}
        >
          {t.platesNote}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5">
          {PLATES.map((p, i) => (
            <motion.figure
              key={i}
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{
                  aspectRatio: '4 / 5',
                  background: '#F7F3EC',
                  border: '1px solid rgba(28,42,58,0.12)',
                  borderRadius: 2,
                }}
              >
                {p.src ? (
                  <Image
                    src={p.src}
                    alt={t.plates[i]}
                    fill
                    sizes="(max-width: 768px) 45vw, 18vw"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 h-4 w-4"
                    style={{ borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }}
                  />
                )}
              </div>
              <figcaption
                className="mt-2 text-[12px]"
                style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}
              >
                {String(i + 1).padStart(2, '0')} · {t.plates[i]}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default AboutHowWeCreate;
