'use client';

/**
 * About 07 — HOW WE CREATE / PROOF.  Critical for trust.
 * Evidence that real thinking and real work sit behind the beliefs:
 * a five-step creation process set as an editorial progression, then
 * a row of plates that follow the same arc (idea → sketch →
 * illustration → finished experience → child). No invented stats,
 * awards, testimonials, partners, team size or credentials.
 *
 * The plates take real assets when they exist — drop images at
 * `/images/about/proof-1..5.jpg` (4:5, ~1000px wide) and set `src` on
 * each PLATES entry below. Until then they render as composed frames
 * that still communicate the progression honestly.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_48, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'The work behind it',
  headline: 'Every detail has a reason.',
  statement: 'We don’t want to make things for children that are merely “good enough”.',
  steps: [
    { n: '01', name: 'Meaning', body: 'First we decide what mark the story should leave on a child.' },
    { n: '02', name: 'Story', body: 'We turn the idea into an experience a child will happily follow.' },
    { n: '03', name: 'Image', body: 'Every detail should enrich a child’s imagination.' },
    { n: '04', name: 'Experience', body: 'Reading, listening, watching or playing — the format serves the purpose.' },
    { n: '05', name: 'Review', body: 'We look at the result again, through a child’s eyes and a parent’s.' },
  ],
  plates: ['Idea', 'Sketch', 'Illustration', 'Finished experience', 'A child, a family'],
  platesNote: 'From a first note to a finished story.',
};
const UZ: typeof EN = {
  eyebrow: 'Ortidagi mehnat',
  headline: 'Har bir detalning sababi bor.',
  statement: "Biz bolalar uchun 'shunchaki yetarli' mahsulot yaratishni istamaymiz.",
  steps: [
    { n: '01', name: "Ma'no", body: "Avval hikoya bolada qanday iz qoldirishi kerakligini aniqlaymiz." },
    { n: '02', name: 'Hikoya', body: "G'oyani bola sevib kuzatadigan tajribaga aylantiramiz." },
    { n: '03', name: 'Tasvir', body: 'Har bir detal bolaning tasavvurini boyitishi kerak.' },
    { n: '04', name: 'Tajriba', body: "O'qish, tinglash, tomosha qilish yoki o'ynash — format maqsadga xizmat qiladi." },
    { n: '05', name: 'Tekshirish', body: "Natijaga yana bolaning va ota-onaning ko'zi bilan qaraymiz." },
  ],
  plates: ["G'oya", 'Eskiz', 'Rasm', 'Tayyor tajriba', 'Bola, oila'],
  platesNote: "Ilk qaydlardan tayyor hikoyagacha.",
};

// Real proof assets, when they exist. Leave `src` undefined to render
// the composed empty frame instead of a broken image.
const PLATES: { src?: string }[] = [
  {}, {}, {}, {}, {},
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

      {/* Five steps — an editorial progression joined by one hairline */}
      <ol className="mt-16 grid gap-y-0 md:mt-20 md:grid-cols-5 md:gap-x-6">
        {t.steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
          {PLATES.map((p, i) => (
            <motion.figure
              key={i}
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              className={i === 4 ? 'col-span-2 sm:col-span-1' : ''}
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
