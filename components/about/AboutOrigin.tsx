'use client';

/**
 * About 02 — ORIGIN STORY.  The emotional heart of the page.
 * ----------------------------------------------------------------
 * Not one long text wall — an editorial narrative in three moments,
 * each with its own layout grammar (spec §07, §20):
 *
 *   MOMENT 01 — DISTANCE      editorial text + atmosphere (the golden
 *                             thread rail carries over from the old
 *                             single-question Origin section)
 *   MOMENT 02 — THE FIRST STORY   a real artifact slot (the first
 *                             book) beside the short account of how a
 *                             piece of advice became an adventure
 *   MOMENT 03 — THE RESPONSE  large isolated statements — the
 *                             emotional turning point, then the
 *                             TALIMOON name emerging
 *
 * REALITY OVER ARTIFICIAL PERFECTION (spec §16, §29, §37): no first-book
 * photo exists in the repo yet, so `FIRST_BOOK.src` stays undefined and
 * `ArtifactFrame` renders an honest composed placeholder — never a
 * fabricated historical image. Drop the real photo at
 * `/public/images/about/first-book.jpg` and set `src` below to replace
 * it; nothing else needs to change.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, NAVY_48, Eyebrow, Section } from './shared';

const EASE = [0.22, 1, 0.36, 1] as const;

const EN = {
  m1: {
    eyebrow: 'Where it all began',
    headline: 'It began with a father who missed his children.',
    body: [
      'TALIMOON did not begin as a business idea.',
      'Sherzodbek Yunusov had long cared about children’s upbringing and about the values a child forms early in life. While he was living far from his own children, that interest became personal.',
      'He had love, guidance and things he wanted them to understand — but ordinary conversation didn’t feel like enough.',
    ],
    question:
      'How do you make something important you want to tell a child live in their heart a little longer?',
  },
  m2: {
    headline: 'Advice became a story.',
    body: [
      'Sherzodbek and his children had always enjoyed turning their photos into illustrated, animated-style pictures — a small, playful idea with no purpose behind it yet.',
      'Distance gave it one: what if his children weren’t just being told something — what if they became the heroes who lived it?',
      'He made his children the main characters of an adventure. Their photographs became illustrated versions of themselves, and his guidance and affection became part of what happened in the story.',
    ],
    statement: ['The first book was not made to be sold.', 'It was made to carry a father’s love, and what he wanted to say, to his children.'],
    artifactCaption: 'The first TALIMOON book',
    artifactAlt: 'The first TALIMOON book, made for one family before TALIMOON existed.',
  },
  m3: {
    body: [
      'The first book was printed and reached the children with the help of Sherzodbek’s close friend, Oybek Ubaydullayev.',
      'The children saw themselves inside the story. They were proud of their father.',
      'Later, when they missed him, they went back to the book and looked through it again.',
    ],
    statement: 'A story made for one family raised a bigger question.',
    question: 'If one story could mean this much to one family, how many children could a meaningful story reach?',
    transition:
      'Sherzodbek shared the idea with Oybek. Oybek believed in it from the start — and helped it find its name.',
    reveal: 'And slowly, the idea found a name.',
    afterReveal: 'What began with one book is becoming a whole world for children.',
  },
};

const UZ: typeof EN = {
  m1: {
    eyebrow: 'HAMMASI QAYERDAN BOSHLANDI',
    headline: 'Hammasi farzandlarini sog‘ingan bir otaning izlanishidan boshlandi.',
    body: [
      'TALIMOON tijorat g‘oyasi sifatida boshlanmagan.',
      'Sherzodbek Yunusov bolalar tarbiyasi va ularda erta yoshdan shakllanadigan qadriyatlarga doimo qiziqqan. Farzandlaridan uzoqda yashagan davrida bu qiziqish unga juda shaxsiy tuyula boshladi.',
      'Ularga aytmoqchi bo‘lgan mehri va nasihati bor edi — lekin oddiy muloqot bunga yetarli tuyulmadi.',
    ],
    question:
      'Bolaga aytmoqchi bo‘lgan muhim gaplaringni qanday qilib uning qalbida uzoqroq yashaydigan qilish mumkin?',
  },
  m2: {
    headline: 'Nasihat hikoyaga aylandi.',
    body: [
      'Sherzodbek va farzandlari oilaviy suratlarini rasm/anime uslubidagi tasvirlarga aylantirishni yaxshi ko‘rishardi — hali maqsadi bo‘lmagan kichik, quvnoq bir g‘oya.',
      'Masofa unga maqsad berdi: agar farzandlari shunchaki nasihat eshitmasdan, uni yashaydigan qahramonga aylansachi?',
      'U farzandlarini bir sarguzashtning bosh qahramonlariga aylantirdi. Ularning suratlari o‘zlarining rasmiy qiyofasiga aylandi, otaning mehri va aytmoqchi bo‘lgan gaplari esa hikoya voqealarining bir qismiga aylandi.',
    ],
    statement: [
      'Birinchi kitob sotish uchun yaratilmagan edi.',
      'U farzandlariga otasining mehrini va aytmoqchi bo‘lgan gaplarini yetkazish uchun yaratilgan edi.',
    ],
    artifactCaption: 'Birinchi TALIMOON kitobi',
    artifactAlt: 'TALIMOON hali mavjud bo‘lmagan paytda, bitta oila uchun yaratilgan birinchi kitob.',
  },
  m3: {
    body: [
      'Birinchi kitob Sherzodbekning yaqin do‘sti Oybek Ubaydullayev yordamida chop etilib, farzandlariga yetib bordi.',
      'Bolalar o‘zlarini hikoya ichida ko‘rishdi. Ular otalaridan faxrlanishdi.',
      'Keyinchalik, otalarini sog‘ingan paytlarida, ular yana kitobni ochib qarab chiqishardi.',
    ],
    statement: 'Bir oilaga atalgan hikoya kattaroq savolni tug‘dirdi.',
    question: 'Agar bitta hikoya bir oilada shunday qiymat yarata olsa, yana qancha bola uchun mazmunli hikoyalar yaratish mumkin?',
    transition:
      'Sherzodbek bu g‘oyani yaqin do‘sti Oybek bilan bo‘lishdi. Oybek uni boshidanoq qo‘llab-quvvatladi — va nomini topishga yordam berdi.',
    reveal: 'Va asta-sekin bu fikr o‘z nomini topdi.',
    afterReveal: 'Bir kitobdan boshlangan fikr endi butun bir bolalar olamiga aylanmoqda.',
  },
};

/** The evolving golden line beside Moment 1 — one point growing into a
 *  path, unchanged from the section's earlier single-question form. */
function GoldenThread() {
  const reduced = useReducedMotion();
  const draw = { pathLength: 1, opacity: 0.9 };
  return (
    <svg viewBox="0 0 60 420" preserveAspectRatio="none" aria-hidden="true" className="h-full w-[60px]">
      <circle cx="30" cy="14" r="3.4" fill={GOLD} />
      <circle cx="30" cy="14" r="8" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="1" />
      <motion.path
        d="M30 22 V150 C30 210 8 250 30 300 C46 332 46 364 30 392"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={reduced ? draw : { pathLength: 0, opacity: 0.5 }}
        whileInView={draw}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2, ease: EASE }}
      />
    </svg>
  );
}

/** Honest artifact slot — a real photo when `src` is set, otherwise a
 *  composed frame that never pretends the asset exists (spec §16/§37). */
function ArtifactFrame({ src, alt, caption }: { src?: string; alt: string; caption: string }) {
  return (
    <figure>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          background: '#FDFBF7',
          border: `1px solid ${GOLD_SOFT}`,
          borderRadius: 2,
        }}
      >
        {src ? (
          <Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 40vw" className="object-cover" />
        ) : (
          <>
            <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5" style={{ borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
            <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5" style={{ borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
          </>
        )}
      </div>
      <figcaption className="mt-3 text-center text-[13px]" style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

// Real asset, when it exists — drop the file and set `src`.
const FIRST_BOOK: { src?: string } = {};

export function AboutOrigin() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <>
      {/* MOMENT 01 — DISTANCE ------------------------------------------------ */}
      <Section labelledBy="about-origin-heading" className="py-24 md:py-32 lg:py-40">
        <div className="grid gap-10 md:grid-cols-[60px_1fr] md:gap-12 lg:gap-16">
          <div className="hidden md:block" aria-hidden="true">
            <div className="sticky top-24 h-[420px]">
              <GoldenThread />
            </div>
          </div>

          <div className="max-w-[680px]">
            <span aria-hidden="true" className="mb-8 flex items-center gap-3 md:hidden">
              <span style={{ width: 8, height: 8, borderRadius: 999, background: GOLD }} />
              <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
            </span>

            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Eyebrow align="start">{t.m1.eyebrow}</Eyebrow>
              <h2
                id="about-origin-heading"
                className="mt-4 text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px]"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.16, letterSpacing: '-0.015em' }}
              >
                {t.m1.headline}
              </h2>
            </motion.div>

            <div className="mt-10 space-y-4 md:mt-12">
              {t.m1.body.map((line, i) => (
                <motion.p
                  key={i}
                  initial={reduced ? undefined : { opacity: 0, y: 16 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: EASE }}
                  className="max-w-[560px] text-[16px] md:text-[17px]"
                  style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            <motion.blockquote
              initial={reduced ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-10 border-0 pl-5 md:mt-12"
              style={{ borderLeft: `2px solid ${GOLD}` }}
            >
              <p
                className="text-[21px] sm:text-[25px] md:text-[28px]"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.3, fontStyle: 'italic' }}
              >
                {t.m1.question}
              </p>
            </motion.blockquote>
          </div>
        </div>
      </Section>

      {/* MOMENT 02 — THE FIRST STORY ------------------------------------------ */}
      <Section tone="raised" className="py-24 md:py-32 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto w-full max-w-[320px] lg:mx-0"
          >
            <ArtifactFrame src={FIRST_BOOK.src} alt={t.m2.artifactAlt} caption={t.m2.artifactCaption} />
          </motion.div>

          <div className="max-w-[600px]">
            <motion.h2
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-[26px] sm:text-[32px] md:text-[38px]"
              style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.18, letterSpacing: '-0.015em' }}
            >
              {t.m2.headline}
            </motion.h2>

            <div className="mt-8 space-y-4">
              {t.m2.body.map((line, i) => (
                <motion.p
                  key={i}
                  initial={reduced ? undefined : { opacity: 0, y: 14 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
                  className="text-[15.5px] md:text-[16.5px]"
                  style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto mt-20 max-w-[760px] text-center md:mt-24"
        >
          <p className="text-[24px] sm:text-[28px] md:text-[34px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.32 }}>
            {t.m2.statement[0]}
          </p>
          <p className="mt-4 text-[17px] md:text-[19px]" style={{ fontFamily: DISPLAY, fontWeight: 500, fontStyle: 'italic', color: GOLD, lineHeight: 1.4 }}>
            {t.m2.statement[1]}
          </p>
        </motion.div>
      </Section>

      {/* MOMENT 03 — THE RESPONSE + the TALIMOON name -------------------------- */}
      <Section className="py-24 md:py-32 lg:py-40">
        <div className="mx-auto max-w-[600px]">
          <div className="space-y-4">
            {t.m3.body.map((line, i) => (
              <motion.p
                key={i}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.06 * i, ease: EASE }}
                className="text-[16px] md:text-[17px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mx-auto mt-16 max-w-[760px] text-center md:mt-20"
        >
          <p className="text-[24px] sm:text-[28px] md:text-[34px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.32 }}>
            {t.m3.statement}
          </p>
          <p className="mx-auto mt-5 max-w-[520px] text-[16px] italic md:text-[18px]" style={{ fontFamily: DISPLAY, fontWeight: 500, color: GOLD, lineHeight: 1.5 }}>
            {t.m3.question}
          </p>
        </motion.div>

        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mt-16 max-w-[560px] text-center text-[15px] md:mt-20 md:text-[16px]"
          style={{ fontFamily: BODY, color: NAVY_48, lineHeight: 1.7 }}
        >
          {t.m3.transition}
        </motion.p>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mx-auto mt-10 max-w-[520px] text-center"
        >
          <p className="text-[15px] md:text-[16px]" style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}>
            {t.m3.reveal}
          </p>
          <p
            className="mt-6 text-[15px] uppercase"
            style={{ fontFamily: BODY, fontWeight: 700, letterSpacing: '0.5em', color: GOLD }}
          >
            TALIMOON
          </p>
          <p className="mx-auto mt-8 max-w-[480px] text-[16px] md:text-[18px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.5 }}>
            {t.m3.afterReveal}
          </p>
        </motion.div>
      </Section>
    </>
  );
}

export default AboutOrigin;
