'use client';

/**
 * /story-library/yusuf-yasmina — the series hub.
 * ----------------------------------------------------------------
 * Series identity first; episodes are subordinate to it. The full
 * spine (numbered, in order), with "Start from the beginning" and
 * "Continue" shown only when they mean something (a published first
 * episode / saved progress on this device). Scheduled episodes are
 * calm "coming soon" nodes. No autoplay, no countdown.
 */

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useT, useLanguage } from '@/lib/i18n/LanguageContext';
import type { Locale, Series, Story } from '@/lib/story-library/types';
import { getEdition } from '@/lib/story-library/content';
import { furthestProgress } from '@/lib/story-library/progress';
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
  sibling: 'Family Stories',
  eyebrow: 'A continuing story',
  start: 'Start from the beginning',
  cont: 'Continue',
  comingSoon: 'Coming soon',
  qism: (n: number) => `${String(n).padStart(2, '0')}-QISM`,
  end: 'The story continues.',
  preparing: 'The first part is being prepared.',
};
const UZ: typeof EN = {
  back: 'Hikoyalar kutubxonasi',
  sibling: 'Oila hikoyalari',
  eyebrow: 'Davom etuvchi hikoya',
  start: 'Boshidan boshlash',
  cont: 'Davom etish',
  comingSoon: 'Tez orada',
  qism: (n: number) => `${String(n).padStart(2, '0')}-QISM`,
  end: 'Hikoya davom etadi.',
  preparing: 'Birinchi qism tayyorlanmoqda.',
};

function toLocale(lang: string): Locale {
  const l = lang.toLowerCase();
  return l === 'uz' || l === 'en' || l === 'ru' || l === 'ar' ? (l as Locale) : 'uz';
}

export function SeriesHub({
  series,
  episodes,
}: {
  series: Series;
  episodes: Story[];
}) {
  const t = useT(EN, UZ);
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = toLocale(language);

  const title = series.title[locale] ?? series.title.uz ?? 'Yusuf & Yasmina';
  const blurb = series.blurb[locale] ?? series.blurb.uz ?? '';

  const firstPublished = episodes.find((e) => e.publicationState === 'published');
  const resume = furthestProgress(episodes.map((e) => e.slug));

  return (
    <section className="relative w-full bg-surface-base px-6 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1080px]">
        <SubNav
          backLabel={t.back}
          siblingHref="/story-library/families"
          siblingLabel={t.sibling}
        />

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[640px] pt-8 md:pt-12"
        >
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h1
            className="mt-4 text-[32px] sm:text-[40px] md:text-[52px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {blurb ? (
            <p
              className="mt-5 max-w-[520px] text-[16px] md:text-[18px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.72 }}
            >
              {blurb}
            </p>
          ) : null}

          {firstPublished || resume ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {firstPublished ? (
                <Link
                  href={`/story-library/read/${firstPublished.slug}`}
                  className="tm-cta-gold inline-flex h-11 items-center justify-center px-6 text-[13px] font-medium tracking-[0.015em]"
                >
                  {t.start}
                </Link>
              ) : null}
              {resume ? (
                <Link
                  href={`/story-library/read/${resume.slug}/${resume.progress.page}`}
                  className="inline-flex h-11 items-center gap-2 text-[13px]"
                  style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
                >
                  {t.cont}
                  <span aria-hidden="true" style={{ color: GOLD }}>&rarr;</span>
                </Link>
              ) : null}
            </div>
          ) : (
            <p
              className="mt-6 text-[13px]"
              style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}
            >
              {t.preparing}
            </p>
          )}
        </motion.div>

        {/* the spine — vertical list, one continuous line down the start edge */}
        <ol className="relative mt-14 pb-16 md:mt-20">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[63px] top-8 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${GOLD_SOFT} 8%, ${GOLD_SOFT} 92%, transparent)`,
            }}
          />
          {episodes.map((ep, i) => {
            const ed = getEdition(ep, locale);
            const n = ep.episodeOrder ?? i + 1;
            const published = ep.publicationState === 'published';
            const label = t.qism(n);
            const node = (
              <div className="flex items-center gap-6">
                <div
                  className="w-[96px] shrink-0 overflow-hidden md:w-[112px]"
                  style={{
                    borderRadius: 3,
                    boxShadow: published ? '0 10px 26px rgba(28,42,58,0.16)' : 'none',
                    opacity: published ? 1 : 0.72,
                  }}
                >
                  <PlaceholderCover label={label} />
                </div>
                <div>
                  <span
                    className="block text-[11px] uppercase"
                    style={{
                      fontFamily: BODY,
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: GOLD,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="mt-1 block text-[18px] md:text-[20px]"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      color: published ? NAVY : NAVY_48,
                      lineHeight: 1.2,
                    }}
                  >
                    {published && ed?.title ? ed.title : t.comingSoon}
                  </span>
                </div>
              </div>
            );
            return (
              <motion.li
                key={ep.id}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative py-6"
              >
                {published ? (
                  <Link
                    href={`/story-library/s/${ep.slug}`}
                    className="block outline-none focus-visible:opacity-70"
                  >
                    {node}
                  </Link>
                ) : (
                  node
                )}
              </motion.li>
            );
          })}
          <li
            className="py-6 pl-[142px] text-[13px] md:pl-[158px]"
            style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.06em' }}
          >
            {t.end}
          </li>
        </ol>
      </div>
    </section>
  );
}

export default SeriesHub;
