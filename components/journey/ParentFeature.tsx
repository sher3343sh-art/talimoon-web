'use client';

/**
 * HAYOT — the PARENT FEATURE (V2, landing section D).
 * ----------------------------------------------------------------
 * One selected OTA-ONALAR UCHUN piece, given a strong editorial
 * slot so Journey visibly carries genuine value for parents — not
 * only brand news. `getParentFeature()` returns the editorial pick
 * (`parentFeature: true`) or the newest `parents` entry; `null`
 * when there is no parents content yet, in which case this renders
 * a restrained intentional state (never a fake article).
 *
 * The title is set as a question; the piece's `keyIdea` (when
 * present) is pulled out beneath it. Poster-first media, links into
 * the full `/journey/[slug]`.
 */

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getParentFeature,
  mediaPolicy,
  resolveEntryContent,
} from '@/lib/journey/content';
import { toLocale, type EntryContent } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import {
  Band,
  BODY,
  DISPLAY,
  GOLD,
  NAVY,
  NAVY_64,
  Reveal,
  Rise,
  WorldLabel,
} from './shared';

const EN = {
  read: 'Read',
  emptyTitle: 'Something useful for parents is on the way.',
  emptyBody:
    'Concise, trustworthy pieces on children, emotions, play, reading and everyday family life.',
};
const UZ: typeof EN = {
  read: "O'qish",
  emptyTitle: 'Ota-onalar uchun foydali material tez orada.',
  emptyBody:
    "Bolalar, hissiyot, o'yin, o'qish va kundalik oila hayoti haqida qisqa, ishonchli yozuvlar.",
};

export function ParentFeature() {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const entry = useMemo(() => getParentFeature(), []);

  const resolved = useMemo(
    () => (entry ? resolveEntryContent(entry, toLocale(language)) : null),
    [entry, language],
  );

  return (
    <Band
      tone="raised"
      labelledBy="journey-parent-heading"
      className="border-t border-[#1c2a3a17] py-16 md:py-24"
    >
      <Reveal amount={0.15}>
        {!entry || !resolved ? (
          <Rise>
            <WorldLabel world="parents" language={language} as="link" />
            <h2
              id="journey-parent-heading"
              className="mt-5 max-w-[620px] text-[24px] md:text-[30px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              {t.emptyTitle}
            </h2>
            <p
              className="mt-4 max-w-[52ch] text-[15px] md:text-[16px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
            >
              {t.emptyBody}
            </p>
          </Rise>
        ) : (
          <ParentFeatureCard
            slug={entry.slug}
            hasVideo={!!entry.video}
            cover={
              mediaPolicy(entry).showMedia && entry.cover?.src.trim()
                ? entry.cover
                : null
            }
            content={resolved.content}
            direction={resolved.direction}
            language={language}
            readLabel={t.read}
          />
        )}
      </Reveal>
    </Band>
  );
}

function ParentFeatureCard({
  slug,
  hasVideo,
  cover,
  content,
  direction,
  language,
  readLabel,
}: {
  slug: string;
  hasVideo: boolean;
  cover: { src: string; blurDataURL?: string } | null;
  content: EntryContent;
  direction: 'ltr' | 'rtl';
  language: string;
  readLabel: string;
}) {
  const href = `/journey/${slug}`;
  return (
    <article
      dir={direction}
      className="grid gap-8 lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] lg:items-center lg:gap-14"
    >
      {cover ? (
        <Link href={href} className="group relative block">
          <div className="tm-media-float tm-media-float-interactive relative aspect-[4/3] w-full">
            <Image
              src={cover.src}
              alt={content.coverAlt ?? ''}
              fill
              sizes="(min-width:1024px) 46vw, 100vw"
              loading="lazy"
              placeholder={cover.blurDataURL ? 'blur' : undefined}
              blurDataURL={cover.blurDataURL}
              className="object-cover"
            />
            {hasVideo ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: 'rgba(247,243,236,0.94)',
                  boxShadow: '0 6px 22px rgba(12,17,22,0.26)',
                }}
              >
                <span
                  className="ms-1 block h-0 w-0"
                  style={{
                    borderTop: '7px solid transparent',
                    borderBottom: '7px solid transparent',
                    borderInlineStart: `12px solid ${NAVY}`,
                  }}
                />
              </span>
            ) : null}
          </div>
        </Link>
      ) : null}

      <div className={cover ? '' : 'max-w-[680px]'}>
        <WorldLabel world="parents" language={language} as="link" />
        <h2
          id="journey-parent-heading"
          className="mt-4 text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.14,
            letterSpacing: '-0.015em',
            textWrap: 'balance',
          }}
        >
          <Link href={href} className="transition-opacity duration-300 hover:opacity-70">
            {content.title}
          </Link>
        </h2>

        {content.standfirst ? (
          <p
            className="mt-4 max-w-[46ch] text-[15px] md:text-[17px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
          >
            {content.standfirst}
          </p>
        ) : null}

        {content.keyIdea ? (
          <div className="mt-6 border-s ps-5" style={{ borderColor: 'rgba(184,147,91,0.4)' }}>
            <p
              className="text-[16px] md:text-[18px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.4,
              }}
            >
              {content.keyIdea}
            </p>
          </div>
        ) : null}

        <div className="mt-7">
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-[15px] transition-opacity duration-300 hover:opacity-70"
            style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
          >
            <span>{readLabel}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: GOLD }}
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ParentFeature;
