'use client';

/**
 * The Hall — World II: Yusuf & Yasmina, as a SPINE.
 *
 * Not a row of covers: one continuous line with the episodes strung
 * along it in order — 01-QISM, 02-QISM… — so a child instantly reads
 * "one story, continuing" and (later) "here is where I stopped". The
 * line fills up to the reader's furthest saved position. Horizontal
 * on desktop, vertical on mobile.
 *
 * Scheduled episodes render as calm "coming soon" nodes so the saga
 * feels like it is about to begin rather than absent. No autoplay,
 * no countdown, nothing Netflix.
 */

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useT, useLanguage } from '@/lib/i18n/LanguageContext';
import type { Series, Story } from '@/lib/story-library/types';
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
} from './shared';

const EN = {
  eyebrow: 'A continuing story',
  qism: (n: number) => `${String(n).padStart(2, '0')}-QISM`,
  comingSoon: 'Coming soon',
  titleSoon: 'Coming soon',
  spineEnd: 'The story continues.',
  beginsSoon: 'The first part is being prepared.',
  viewAll: 'Enter Yusuf & Yasmina',
};
const UZ: typeof EN = {
  eyebrow: 'Davom etuvchi hikoya',
  qism: (n: number) => `${String(n).padStart(2, '0')}-QISM`,
  comingSoon: 'Tez orada',
  titleSoon: 'Tez orada',
  spineEnd: 'Hikoya davom etadi.',
  beginsSoon: 'Birinchi qism tayyorlanmoqda.',
  viewAll: "Yusuf va Yasmina olamiga kirish",
};

function EpisodeNode({
  story,
  label,
  title,
  comingSoon,
}: {
  story: Story;
  label: string;
  title: string;
  comingSoon: string;
}) {
  const published = story.publicationState === 'published';
  const body = (
    <div className="flex flex-col items-center text-center md:items-start md:text-left">
      <div
        className="w-[104px] overflow-hidden md:w-[128px]"
        style={{
          borderRadius: 3,
          boxShadow: published ? '0 10px 28px rgba(28,42,58,0.14)' : 'none',
          opacity: published ? 1 : 0.72,
        }}
      >
        <PlaceholderCover label={label} />
      </div>
      <span
        className="mt-4 text-[11px] uppercase"
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
        className="mt-1 text-[16px] md:text-[17px]"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          color: published ? NAVY : NAVY_48,
          lineHeight: 1.2,
        }}
      >
        {published ? title : comingSoon}
      </span>
    </div>
  );

  return (
    <li className="relative shrink-0 md:w-[200px]">
      <Link
        href={`/story-library/s/${story.slug}`}
        aria-label={published ? `${label} — ${title}` : `${label} — ${comingSoon}`}
        className="block outline-none transition-opacity duration-300 hover:opacity-80 focus-visible:opacity-80"
      >
        {body}
      </Link>
    </li>
  );
}

export function YusufYasminaSpine({
  series,
  episodes,
}: {
  series: Series;
  episodes: Story[];
}) {
  const t = useT(EN, UZ);
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = (language.toLowerCase() as 'uz' | 'en' | 'ru' | 'ar') ?? 'uz';

  const seriesTitle = series.title[locale] ?? series.title.uz ?? series.title.en ?? 'Yusuf & Yasmina';
  const seriesBlurb = series.blurb[locale] ?? series.blurb.uz ?? series.blurb.en ?? '';
  const anyPublished = episodes.some((e) => e.publicationState === 'published');

  return (
    <div>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 18 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[640px]"
      >
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <h2
          className="mt-4 text-[26px] sm:text-[32px] md:text-[40px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.14,
            letterSpacing: '-0.015em',
          }}
        >
          {seriesTitle}
        </h2>
        {seriesBlurb ? (
          <p
            className="mt-4 max-w-[520px] text-[15px] md:text-[17px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.72 }}
          >
            {seriesBlurb}
          </p>
        ) : null}
        {!anyPublished ? (
          <p
            className="mt-5 text-[13px]"
            style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.04em' }}
          >
            {t.beginsSoon}
          </p>
        ) : null}
        <Link
          href="/story-library/yusuf-yasmina"
          className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase transition-opacity duration-300 hover:opacity-60"
          style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.16em', color: NAVY }}
        >
          {t.viewAll}
          <span aria-hidden="true" style={{ color: GOLD }}>&rarr;</span>
        </Link>
      </motion.div>

      {/* the spine */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative mt-12 md:mt-16"
      >
        {/* connector — vertical on mobile, horizontal on md+ */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[52px] top-4 w-px md:hidden"
          style={{
            background: `linear-gradient(to bottom, transparent, ${GOLD_SOFT} 12%, ${GOLD_SOFT} 88%, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-6 right-6 top-[64px] hidden h-px md:block"
          style={{
            background: `linear-gradient(to right, transparent, ${GOLD_SOFT} 8%, ${GOLD_SOFT} 92%, transparent)`,
          }}
        />
        <ol className="relative flex flex-col gap-10 md:flex-row md:items-start md:gap-6 md:overflow-x-auto md:pb-4">
          {episodes.map((ep) => {
            const ed = getEdition(ep, locale);
            const n = ep.episodeOrder ?? 0;
            return (
              <EpisodeNode
                key={ep.id}
                story={ep}
                label={t.qism(n)}
                title={ed?.title ?? t.titleSoon}
                comingSoon={t.comingSoon}
              />
            );
          })}
        </ol>

        <p
          className="mt-10 text-[13px] md:mt-8"
          style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.06em' }}
        >
          {t.spineEnd}
        </p>
      </motion.div>
    </div>
  );
}

export default YusufYasminaSpine;
