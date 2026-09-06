'use client';

/**
 * The Story page — the calm room outside the Reader.
 * ----------------------------------------------------------------
 * Cover, title, a family-chosen dedication (or the NN-QISM label for
 * an episode), a TALIMOON-authored description, and one primary
 * action: Begin. A calm view count when there is one. Community lives
 * *below* this, after the reading experience — deferred to a later
 * increment; nothing fabricated in the meantime.
 *
 * For a scheduled / placeholder entry it degrades to a "being
 * prepared" state — same layout, no Begin.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT, useLanguage } from '@/lib/i18n/LanguageContext';
import type { Locale, Story } from '@/lib/story-library/types';
import { getEdition } from '@/lib/story-library/content';
import { canRead } from '@/lib/story-library/access';
import {
  BODY,
  DISPLAY,
  GOLD,
  NAVY,
  NAVY_48,
  NAVY_64,
  PlaceholderCover,
  SubNav,
} from './shared';

const EN = {
  backLibrary: 'Story Library',
  backSeries: 'Yusuf & Yasmina',
  siblingFamily: 'Family Stories',
  begin: 'Begin',
  comingSoon: 'Coming soon',
  preparing: 'This part of the story is being prepared.',
  titleSoon: 'Title coming soon',
};
const UZ: typeof EN = {
  backLibrary: 'Hikoyalar kutubxonasi',
  backSeries: 'Yusuf va Yasmina',
  siblingFamily: 'Oila hikoyalari',
  begin: 'Boshlash',
  comingSoon: 'Tez orada',
  preparing: "Hikoyaning bu qismi tayyorlanmoqda.",
  titleSoon: 'Sarlavha tez orada',
};
const RU: typeof EN = {
  backLibrary: 'Библиотека историй',
  backSeries: 'Юсуф и Ясмина',
  siblingFamily: 'Семейные истории',
  begin: 'Начать',
  comingSoon: 'Скоро',
  preparing: 'Эта часть истории сейчас готовится.',
  titleSoon: 'Название скоро появится',
};

function toLocale(lang: string): Locale {
  const l = lang.toLowerCase();
  return l === 'uz' || l === 'en' || l === 'ru' || l === 'ar' ? (l as Locale) : 'uz';
}

export function StoryAntechamber({ story }: { story: Story }) {
  const t = useT(EN, UZ, RU);
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = toLocale(language);
  const ed = getEdition(story, locale);

  const isEpisode = story.kind === 'series-episode';
  const readable = canRead(story).allowed;
  const episodeLabel = isEpisode
    ? `${String(story.episodeOrder ?? 0).padStart(2, '0')}-QISM`
    : undefined;
  const displayTitle = readable && ed?.title ? ed.title : t.titleSoon;
  const hasRealCover = !!ed?.cover?.src;

  return (
    <section className="relative w-full bg-surface-base px-6 pt-20 md:px-10 md:pt-24 lg:px-16">
      <div className="mx-auto w-full max-w-[1080px]">
        <SubNav
          backHref={isEpisode ? '/story-library/yusuf-yasmina' : '/story-library'}
          backLabel={isEpisode ? t.backSeries : t.backLibrary}
          siblingHref={isEpisode ? '/story-library/families' : '/story-library/yusuf-yasmina'}
          siblingLabel={isEpisode ? t.siblingFamily : t.backSeries}
        />

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 py-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14 md:py-16 lg:gap-20"
        >
          {/* cover */}
          <div className="mx-auto w-[62%] max-w-[300px] md:mx-0 md:w-full">
            <div
              className="w-full overflow-hidden"
              style={{
                borderRadius: 4,
                boxShadow: readable ? '0 20px 50px rgba(28,42,58,0.16)' : 'none',
                opacity: readable ? 1 : 0.82,
              }}
            >
              {hasRealCover && ed ? (
                <Image
                  src={ed.cover.src}
                  alt={ed.cover.alt || displayTitle}
                  width={ed.cover.width}
                  height={ed.cover.height}
                  sizes="(max-width: 768px) 62vw, 300px"
                  className="h-auto w-full"
                  priority
                />
              ) : (
                <PlaceholderCover label={episodeLabel} />
              )}
            </div>
          </div>

          {/* content */}
          <div className="max-w-[560px]">
            {episodeLabel ? (
              <span
                className="block text-[12px] uppercase"
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  color: GOLD,
                }}
              >
                {episodeLabel}
              </span>
            ) : story.dedication ? (
              <span
                className="block text-[12px] uppercase"
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: GOLD,
                }}
              >
                {story.dedication}
              </span>
            ) : null}

            <h1
              className="mt-3 text-[28px] sm:text-[34px] md:text-[40px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: readable ? NAVY : NAVY_48,
                lineHeight: 1.14,
                letterSpacing: '-0.015em',
              }}
            >
              {displayTitle}
            </h1>

            {readable && ed?.subtitle ? (
              <p
                className="mt-2 text-[16px] md:text-[18px]"
                style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY_64 }}
              >
                {ed.subtitle}
              </p>
            ) : null}

            {readable && ed?.description ? (
              <p
                className="mt-5 text-[15px] md:text-[16px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
              >
                {ed.description}
              </p>
            ) : (
              <p
                className="mt-5 text-[15px]"
                style={{ fontFamily: BODY, color: NAVY_48, lineHeight: 1.7 }}
              >
                {t.preparing}
              </p>
            )}

            <div className="mt-9">
              {readable ? (
                <Link
                  href={`/story-library/read/${story.slug}`}
                  className="tm-cta-gold inline-flex h-11 items-center justify-center whitespace-nowrap px-6 text-[13px] font-medium tracking-[0.015em]"
                >
                  {t.begin}
                </Link>
              ) : (
                <span
                  className="inline-flex h-11 items-center justify-center rounded-[3px] px-6 text-[12px] uppercase"
                  style={{
                    fontFamily: BODY,
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: NAVY_48,
                    border: '1px solid rgba(28,42,58,0.16)',
                  }}
                >
                  {t.comingSoon}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Community lives here, below the reading experience — built
            in a later increment. Nothing is shown until it exists. */}
        <div className="h-16" />
      </div>
    </section>
  );
}

export default StoryAntechamber;
