'use client';

/**
 * About 08 — HOW WE CREATE.  Critical for trust — and for potential
 * partners specifically: it demonstrates execution ability without a
 * single business word. Seven stages set as one editorial timeline
 * (never the identical-cards look of an agency site). No invented
 * stats, awards, testimonials, partners, team size or credentials.
 *
 * This is deliberately NOT "Creative belief" (AboutCreativeBelief) —
 * that section is the PRINCIPLES guiding what gets made; this one is
 * the PROCESS that makes it. The process now opens with TANISHISH —
 * understanding who the work is for — because About covers ALL TALIMOON
 * products, and only the personalized ones start from one specific
 * child.
 *
 * No proof-plate strip: it was placeholder-only and simply restated
 * the step names. When real process photography exists it belongs
 * inside the relevant steps, not as a decorative row (spec §38/§44).
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, Eyebrow, Section, SPACE_COMPACT } from './shared';

const EASE = [0.22, 1, 0.36, 1] as const;

const EN = {
  eyebrow: 'From an idea to a family',
  headline: 'Every TALIMOON experience starts with a single thought.',
  statement: 'We don’t want to make things for children that are merely “good enough”.',
  steps: [
    { n: '01', name: 'Getting to know', body: 'First we understand who we are creating for. In personalized stories, that means the child themselves — their interests, dreams, character and what matters to their family.' },
    { n: '02', name: 'Meaning', body: 'Then we decide what the experience should carry to the child. It has to be more than enjoyable — it has to mean something to the child and their family.' },
    { n: '03', name: 'Story', body: 'Meaning becomes an adventure — a story a child wants to follow, and remembers.' },
    { n: '04', name: 'Image', body: 'Imagination becomes a world you can see. Every image should strengthen the story and enrich a child’s imagination.' },
    { n: '05', name: 'Experience', body: 'The format serves the purpose. Reading, listening, watching or playing — whichever form it takes, the child’s experience stays at the centre.' },
    { n: '06', name: 'Review', body: 'We look at the result again — through a child’s eyes and a parent’s. We re-check the meaning, the feeling and the experience.' },
    { n: '07', name: 'Coming to life', body: 'What we’ve made reaches a real family. Because for TALIMOON the work isn’t finished on a screen or in a mockup — it means something when a child holds it, reads it, listens to it or feels it.' },
  ],
};
const UZ: typeof EN = {
  eyebrow: 'G‘OYADAN OILAGACHA',
  headline: 'Har bir TALIMOON tajribasi bir fikrdan boshlanadi.',
  statement: 'Biz bolalar uchun “shunchaki yetarli” mahsulot yaratishni istamaymiz.',
  steps: [
    { n: '01', name: 'Tanishish', body: 'Avval kim uchun yaratayotganimizni tushunamiz. Shaxsiy hikoyalarda esa bu bolaning o‘zi — uning qiziqishlari, orzulari, xarakteri va oilasi uchun muhim bo‘lgan jihatlardan boshlanadi.' },
    { n: '02', name: 'Ma’no', body: 'Keyin bu tajriba bolaga nimani olib borishini aniqlaymiz. U faqat qiziqarli emas, bola va uning oilasi uchun mazmunli bo‘lishi kerak.' },
    { n: '03', name: 'Hikoya', body: 'Ma’no sarguzashtga aylanadi. Bola kuzatishni istaydigan, esda qoladigan voqea quriladi.' },
    { n: '04', name: 'Tasvir', body: 'Tasavvur ko‘rinadigan dunyoga aylanadi. Har bir tasvir hikoyani kuchaytirishi va bolaning tasavvurini boyitishi kerak.' },
    { n: '05', name: 'Tajriba', body: 'Format maqsadga xizmat qiladi. O‘qish, tinglash, tomosha qilish yoki o‘ynash — qaysi shakl bo‘lmasin, markazda bolaning tajribasi turadi.' },
    { n: '06', name: 'Tekshiruv', body: 'Natijaga yana bola va ota-onaning ko‘zi bilan qaraymiz. Ma’no, his va tajribani qayta tekshiramiz.' },
    { n: '07', name: 'Hayotga chiqish', body: 'Yaratilgan narsa haqiqiy oilaga yetib boradi. Chunki TALIMOON uchun ish ekranda yoki maketda emas — bola uni qo‘liga olganida, o‘qiganida, tinglaganida yoki his qilganida ma’no kasb etadi.' },
  ],
};

export function AboutHowWeCreate() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-create-heading" className={SPACE_COMPACT} tone="raised" railInset>
      <div className="max-w-[760px]">
        <Eyebrow align="start">{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-create-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
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
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-5 max-w-[560px] text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
        >
          {t.statement}
        </motion.p>
      </div>

      {/* Seven stages as one editorial timeline — big typographic
          numerals, a hairline per step, disciplined vertical spacing so
          seven steps never turn into a long scroll (spec §38). */}
      <ol className="mx-auto mt-12 max-w-[880px] md:mt-14">
        {t.steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.6, delay: 0.04 * i, ease: EASE }}
            className="grid grid-cols-[44px_1fr] gap-x-5 gap-y-1 py-5 md:grid-cols-[72px_220px_1fr] md:gap-x-8 md:py-6"
            style={{ borderTop: `1px solid ${i === 0 ? GOLD_SOFT : 'rgba(28,42,58,0.10)'}` }}
          >
            <span
              aria-hidden="true"
              className="row-span-2 text-[30px] md:row-span-1 md:text-[40px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: 'transparent',
                WebkitTextStroke: `1px ${GOLD}`,
                lineHeight: 1,
              }}
            >
              {s.n}
            </span>
            <h3
              className="self-baseline text-[18px] md:text-[21px]"
              style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}
            >
              {s.name}
            </h3>
            <p
              className="col-span-2 max-w-[520px] text-[14px] md:col-span-1 md:text-[15px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {s.body}
            </p>
          </motion.li>
        ))}
        <div style={{ borderTop: '1px solid rgba(28,42,58,0.10)' }} />
      </ol>
    </Section>
  );
}

export default AboutHowWeCreate;
