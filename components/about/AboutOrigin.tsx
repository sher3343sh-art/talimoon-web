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
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, NAVY_48, Eyebrow, Section, SPACE_MAJOR } from './shared';

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
      'How do you make something important you want to tell a child stay with them a little longer?',
  },
  m2: {
    headline: 'Advice became a story.',
    body: [
      'Sherzodbek and his children had always enjoyed turning family photos into anime-style illustrations — a small, playful habit with no purpose behind it yet.',
      'Distance gave him a new thought: what if guidance didn’t arrive as advice, but lived inside a story where the child was the hero?',
      'He made his children the main characters of an adventure. Their real photographs were turned into anime-inspired story characters — they no longer watched the story from the outside; they lived inside it. His love, and the things he wanted to say, became part of what happened.',
    ],
    statement: ['The first book was not made to be sold.', 'It was made to carry a father’s love, and what he wanted to say, to his children.'],
    artifactCaption: 'The first TALIMOON book',
    artifactAlt: 'The first TALIMOON book, made for one family before TALIMOON existed.',
  },
  m3: {
    body: [
      'Once the first book was finished digitally, one problem remained: turning it into a real, printed book and getting it to the children. Sherzodbek was far away at the time.',
      'His close friend Oybek Ubaydullayev helped print the book and get it into the children’s hands.',
      'The children saw themselves inside the story, and they were proud of their father.',
      'When they missed him, they would read it again and look through the pictures — as if the story let them meet their father once more.',
    ],
    statement: 'A story made for one family raised a bigger question.',
    question: 'If one story could mean this much to one family, how many children could a meaningful story reach?',
    transition:
      'In time, Oybek became one of the first people to take the idea seriously. They exchanged thoughts and worked through its weak points together — and what began as one book slowly grew into something larger.',
    reveal: 'Eventually that world was given a name — and Oybek had a real hand in choosing it.',
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
      'Bolaga aytmoqchi bo‘lgan muhim gap uning qalbida qanday qilib uzoqroq yashab qoladi?',
  },
  m2: {
    headline: 'Nasihat hikoyaga aylandi.',
    body: [
      'Sherzodbek va farzandlari oilaviy suratlarini anime uslubidagi tasvirlarga aylantirishni yoqtirishardi — hali maqsadi bo‘lmagan kichik, quvnoq bir odat.',
      'Masofa unga yangi bir fikr berdi: agar nasihat shunchaki aytilmasa, balki bola o‘zi bosh qahramon bo‘lgan hikoyaning ichiga singdirilsa-chi?',
      'U farzandlarini bir sarguzashtning bosh qahramonlariga aylantirdi. Ularning haqiqiy suratlari anime uslubidagi ertak qahramonlariga aylantirildi — endi ular hikoyani chetdan kuzatmas, uning ichida yashardi. Otaning mehri va aytmoqchi bo‘lgan gaplari esa voqealarning bir qismiga aylandi.',
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
      'Birinchi kitob elektron shaklda tayyor bo‘lgach, uni haqiqiy kitobga aylantirib, farzandlariga yetkazish masalasi qoldi. Sherzodbek o‘sha paytda uzoqda edi.',
      'Uning yaqin do‘sti Oybek Ubaydullayev kitobni chop ettirish va bolalarga yetkazishda yordam berdi.',
      'Bolalar o‘zlarini hikoya ichida ko‘rishdi va otalaridan faxrlanishdi.',
      'Otalarini sog‘ingan paytlarida esa ular kitobni qayta o‘qib, rasmlarini tomosha qilishardi — hikoya ichida go‘yo otalari bilan yana uchrashgandek.',
    ],
    statement: 'Bir oilaga atalgan hikoya kattaroq savolni tug‘dirdi.',
    question: 'Agar bitta hikoya bir oilada shunday qiymat yarata olsa, yana qancha bola uchun mazmunli hikoyalar yaratish mumkin?',
    transition:
      'Keyinchalik aynan Oybek bu g‘oyani jiddiy qo‘llab-quvvatlagan ilk insonlardan biriga aylandi. Ular fikr almashdi, kamchiliklarni birga muhokama qildi — va bir kitob sifatida boshlangan g‘oya asta-sekin kattaroq dunyoga aylandi.',
    reveal: 'Keyinchalik bu dunyo o‘z nomini oldi — bu nomning tanlanishida ham Oybekning hissasi katta bo‘ldi.',
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

/** The first-story artifact — a real photo when `src` is set, otherwise
 *  a composed frame that never pretends the asset exists. `ratio` keeps
 *  the frame at the asset's native aspect so the prepared composition
 *  shows without any crop. */
function ArtifactFrame({
  src,
  alt,
  caption,
  ratio = '4 / 5',
}: {
  src?: string;
  alt: string;
  caption: string;
  ratio?: string;
}) {
  return (
    <figure>
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: src ? ratio : '4 / 5',
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
            quality={100}
            sizes="(max-width: 1024px) 90vw, 340px"
            className="object-cover"
          />
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

// The prepared photo of the first TALIMOON story (1088×1445).
const FIRST_BOOK = { src: '/images/about/about-origin-story.webp', ratio: '1088 / 1445' };

export function AboutOrigin() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <>
      {/* MOMENT 01 — DISTANCE ------------------------------------------------ */}
      <Section labelledBy="about-origin-heading" className={SPACE_MAJOR} railInset>
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

            <div className="mt-8 space-y-4 md:mt-10">
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
              className="mt-8 border-0 pl-5 md:mt-10"
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
      <Section tone="raised" className={SPACE_MAJOR} railInset>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 22 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto w-full max-w-[320px] lg:mx-0"
          >
            <ArtifactFrame
              src={FIRST_BOOK.src}
              ratio={FIRST_BOOK.ratio}
              alt={t.m2.artifactAlt}
              caption={t.m2.artifactCaption}
            />
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
          className="mx-auto mt-10 max-w-[760px] text-center md:mt-12"
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
      <Section className={SPACE_MAJOR} railInset>
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
          className="mx-auto mt-10 max-w-[760px] text-center md:mt-12"
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
          className="mx-auto mt-10 max-w-[560px] text-center text-[15px] md:mt-12 md:text-[16px]"
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
