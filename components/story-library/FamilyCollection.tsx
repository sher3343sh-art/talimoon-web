'use client';

/**
 * /story-library/families — the Family Stories collection.
 * ----------------------------------------------------------------
 * Published family stories as a warm, hand-placed cluster — cover +
 * title + a family-chosen dedication only. No surname, no location,
 * no age unless the family opted in. With none published yet, the
 * page carries the consent-driven growth story and a mantel of empty
 * frames — calm and intentional, never a "no results" message.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT, useLanguage } from '@/lib/i18n/LanguageContext';
import type { Locale, Story } from '@/lib/story-library/types';
import { getEdition } from '@/lib/story-library/content';
import {
  BODY,
  DISPLAY,
  Eyebrow,
  GOLD,
  GOLD_SOFT,
  NAVY,
  NAVY_48,
  NAVY_64,
  PlaceholderCover,
  SubNav,
} from './shared';

const EN = {
  back: 'Story Library',
  sibling: 'Yusuf & Yasmina',
  eyebrow: 'Family Stories',
  heading: 'Real books, made for one child, shared with permission.',
  lead: [
    'Every family who orders a personalized TALIMOON book is later asked, gently, whether they would like to share its digital version here.',
    'Nothing is published without a parent’s explicit permission. So this shelf fills, one real story at a time, with the families’ blessing.',
  ],
  empty: 'No family stories are published yet. The first are being prepared now.',
  consentNote: 'Shared with each family’s permission.',
};
const UZ: typeof EN = {
  back: 'Hikoyalar kutubxonasi',
  sibling: 'Yusuf va Yasmina',
  eyebrow: 'Oila hikoyalari',
  heading: "Bir bola uchun yaratilgan, ruxsat bilan baham ko'rilgan haqiqiy kitoblar.",
  lead: [
    "Shaxsiy TALIMOON kitobiga buyurtma bergan har bir oiladan keyinroq, ohista, uning raqamli nusxasini shu yerda baham ko'rishni istaydimi, deb so'raladi.",
    "Hech narsa ota-onaning aniq roziligisiz e'lon qilinmaydi. Shu bois bu javon oilalar rizoligi bilan, bittalab haqiqiy hikoyalar bilan to'ladi.",
  ],
  empty: "Hozircha oila hikoyalari e'lon qilinmagan. Dastlabkilari tayyorlanmoqda.",
  consentNote: "Har bir oilaning roziligi bilan baham ko'rilgan.",
};
const RU: typeof EN = {
  back: 'Библиотека историй',
  sibling: 'Юсуф и Ясмина',
  eyebrow: 'Семейные истории',
  heading: 'Настоящие книги, созданные для одного ребёнка и опубликованные с согласия семьи.',
  lead: [
    'Каждой семье, заказавшей именную книгу TALIMOON, позже деликатно предлагают поделиться её цифровой версией здесь.',
    'Ничто не публикуется без явного согласия родителей. Поэтому эта полка наполняется медленно, история за историей, с благословения самих семей.',
  ],
  empty: 'Пока ни одна семейная история не опубликована. Первые уже готовятся.',
  consentNote: 'Опубликовано с согласия каждой семьи.',
};

function toLocale(lang: string): Locale {
  const l = lang.toLowerCase();
  return l === 'uz' || l === 'en' || l === 'ru' || l === 'ar' ? (l as Locale) : 'uz';
}

const FRAMES = [-3, 2, -1.5, 3, -2, 1];

export function FamilyCollection({ stories }: { stories: Story[] }) {
  const t = useT(EN, UZ, RU);
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = toLocale(language);
  const isEmpty = stories.length === 0;

  return (
    <section className="relative w-full bg-surface-base px-6 pt-20 md:px-10 md:pt-24 lg:px-16">
      <div className="mx-auto w-full max-w-[1080px]">
        <SubNav
          backLabel={t.back}
          siblingHref="/story-library/yusuf-yasmina"
          siblingLabel={t.sibling}
        />

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[620px] pt-8 md:pt-12"
        >
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1
            className="mt-4 text-[28px] sm:text-[34px] md:text-[42px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.14,
              letterSpacing: '-0.015em',
            }}
          >
            {t.heading}
          </h1>
          <div className="mt-5 space-y-3">
            {t.lead.map((line, i) => (
              <p
                key={i}
                className="text-[15px] md:text-[16px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.72 }}
              >
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        {isEmpty ? (
          <div className="py-14 md:py-20">
            <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
              {FRAMES.map((rot, i) => (
                <div
                  key={i}
                  className="w-[40%] sm:w-[22%]"
                  style={{ transform: `rotate(${rot}deg)`, marginTop: (i % 3) * 12 }}
                >
                  <div
                    aria-hidden="true"
                    className="w-full"
                    style={{
                      aspectRatio: '4 / 5',
                      background: '#FDFBF7',
                      border: `1px solid ${GOLD_SOFT}`,
                      boxShadow: '0 10px 30px rgba(28,42,58,0.06)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              ))}
            </div>
            <p
              className="mt-10 text-center text-[13px]"
              style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}
            >
              {t.empty}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-6 py-14 sm:grid-cols-3 md:gap-8 md:py-20 lg:grid-cols-4">
            {stories.map((story) => {
              const ed = getEdition(story, locale);
              return (
                <li key={story.id}>
                  <Link href={`/story-library/s/${story.slug}`} className="group block">
                    <div
                      className="w-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1"
                      style={{
                        borderRadius: 3,
                        boxShadow: '0 12px 32px rgba(28,42,58,0.12)',
                      }}
                    >
                      {ed?.cover?.src ? (
                        <Image
                          src={ed.cover.src}
                          alt={ed.cover.alt || ed.title}
                          width={ed.cover.width}
                          height={ed.cover.height}
                          sizes="(max-width: 640px) 45vw, 22vw"
                          className="h-auto w-full"
                          loading="lazy"
                        />
                      ) : (
                        <PlaceholderCover title={ed?.title} />
                      )}
                    </div>
                    {story.dedication ? (
                      <span
                        className="mt-3 block text-[11px] uppercase"
                        style={{
                          fontFamily: BODY,
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          color: GOLD,
                        }}
                      >
                        {story.dedication}
                      </span>
                    ) : null}
                    <span
                      className="mt-1 block text-[16px]"
                      style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}
                    >
                      {ed?.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <p
          className="pb-16 text-[12px] uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.16em',
            color: NAVY_48,
          }}
        >
          {t.consentNote}
        </p>
      </div>
    </section>
  );
}

export default FamilyCollection;
