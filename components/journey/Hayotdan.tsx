'use client';

/**
 * HAYOT — HAYOTDAN (the living editorial stream).
 * ----------------------------------------------------------------
 * One stream, reverse-chronological, NOT a card grid. Content
 * importance drives visual weight: a `thought` is a centred
 * type-only pull-piece, a `reportage` is photo-led and wide, a
 * `moment` is small and offset, an `update` is a compact line, a
 * `campaign` is state-aware. The rhythm alternates big → intimate →
 * text → visual so the visitor never feels a component repeat, but
 * it is composed, not random masonry.
 *
 * Source: `getStreamEntries({ limit })` from the Increment 1
 * accessors — published only, newest first, with the current
 * OPENING entry excluded so it is never shown twice. "Ko'proq
 * ko'rish" reveals the next batch client-side. Renders `null` when
 * the stream is empty (the page is then just THE OPENING).
 */

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  STREAM_PAGE_SIZE,
  campaignState,
  getStreamEntries,
  mediaPolicy,
  resolveEntryContent,
} from '@/lib/journey/content';
import {
  JOURNEY_WORLDS,
  toLocale,
  worldName,
  type JourneyEntry,
  type JourneyFormat,
  type JourneyWorld,
} from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import {
  Band,
  BODY,
  clock,
  DISPLAY,
  GOLD,
  Kicker,
  NAVY,
  NAVY_48,
  NAVY_64,
  QuietLink,
  Reveal,
  Rise,
  WorldLabel,
} from './shared';

const EN = {
  heading: 'Journey journal',
  intro: 'Stories, films, useful ideas and discoveries — gathered in one living editorial stream.',
  filterLabel: 'Filter the journal',
  all: 'All stories',
  more: 'See more',
  story: 'Read the story',
  thought: 'Read the thought',
  conversation: 'Read the conversation',
  watch: 'Watch',
  take_part: 'Take part',
  results: 'See the results',
  ended: 'Ended',
  detail: 'More',
  read: 'Read',
  emptyTitle: 'This space is for stories.',
  emptyBody:
    'Reportage, film, a small moment, a thought — from TALIMOON’s life. The first ones, soon.',
};
const UZ: typeof EN = {
  heading: 'Journey jurnali',
  intro: 'Hikoyalar, videolar, foydali fikrlar va kashfiyotlar — barchasi bitta jonli jurnal oqimida.',
  filterLabel: 'Jurnalni saralash',
  all: 'Barchasi',
  more: "Ko'proq ko'rish",
  story: "Hikoyani ko'ring",
  thought: "Fikrni o'qish",
  conversation: "Suhbatni o'qish",
  watch: "Ko'rish",
  take_part: 'Ishtirok etish',
  results: "Natijalarni ko'rish",
  ended: 'Yakunlandi',
  detail: 'Batafsil',
  emptyTitle: 'Bu yer hikoyalar uchun.',
  emptyBody:
    "Reportaj, video, kichik lahza, bir fikr — TALIMOON hayotidan. Ilklari tez orada.",
  read: "O'qish",
};

function cta(format: JourneyFormat, t: typeof EN): string {
  switch (format) {
    case 'reportage':
    case 'photo-story':
    case 'moment':
    case 'event':
      return t.story;
    case 'thought':
      return t.thought;
    case 'guide':
    case 'book-insight':
    case 'research-explainer':
      return t.read;
    case 'interview':
      return t.conversation;
    case 'video':
      return t.watch;
    default:
      return t.detail;
  }
}

// ── One entry ──────────────────────────────────────────────────────
export function StreamEntry({
  entry,
  index,
}: {
  entry: JourneyEntry;
  index: number;
}) {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const { content, direction } = resolveEntryContent(entry, toLocale(language));
  const policy = mediaPolicy(entry);
  const photo =
    policy.showMedia && entry.cover && entry.cover.src.trim() !== ''
      ? entry.cover
      : null;
  const href = `/journey/${entry.slug}`;
  const title = content.title ?? '';
  const kickerLabel = content.kicker?.label;
  const kickerDate = content.kicker?.dateLabel;
  const flip = index % 2 === 1;

  const headingLink = (
    <Link href={href} className="transition-opacity duration-300 hover:opacity-70">
      {title}
    </Link>
  );

  // The restrained world tag every stream entry carries — above the
  // kicker. `block` so it inherits the parent's text alignment
  // (centred for thought, left otherwise).
  const worldTag = (
    <WorldLabel
      world={entry.world}
      language={language}
      className="mb-2.5 block"
    />
  );

  // ── knowledge — guide / book-insight / research-explainer.
  //    Left-aligned, question headline, key idea pulled out. The
  //    "value for parents" treatment. Optional cover. ──
  if (
    entry.format === 'guide' ||
    entry.format === 'book-insight' ||
    entry.format === 'research-explainer'
  ) {
    return (
      <article dir={direction} className="mx-auto max-w-[820px]">
        {photo ? (
          <Link href={href} className="mb-6 block md:mb-8">
            <div className="tm-media-float tm-media-float-interactive relative aspect-[16/9] w-full">
              <Image
                src={photo.src}
                alt={content.coverAlt ?? ''}
                fill
                sizes="(min-width:1024px) 820px, 100vw"
                loading="lazy"
                placeholder={photo.blurDataURL ? 'blur' : undefined}
                blurDataURL={photo.blurDataURL}
                className="object-cover"
              />
            </div>
          </Link>
        ) : null}
        {worldTag}
        {kickerLabel ? <Kicker label={kickerLabel} date={kickerDate} /> : null}
        <h3
          className="mt-3 text-[24px] sm:text-[28px] md:text-[33px] lg:text-[36px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.16,
            letterSpacing: '-0.015em',
            textWrap: 'balance',
          }}
        >
          {headingLink}
        </h3>
        {content.standfirst ? (
          <p
            className="mt-4 max-w-[54ch] text-[15px] md:text-[17px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
          >
            {content.standfirst}
          </p>
        ) : null}
        {content.keyIdea ? (
          <div
            className="mt-5 border-s ps-5"
            style={{ borderColor: 'rgba(184,147,91,0.4)' }}
          >
            <p
              className="text-[15px] md:text-[17px]"
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
        <div className="mt-6">
          <QuietLink href={href}>{cta(entry.format, t)}</QuietLink>
        </div>
      </article>
    );
  }

  // ── thought — centred, type only, never an image ──
  if (entry.format === 'thought') {
    const big = entry.weight === 'lead' || entry.weight === 'standard';
    return (
      <article dir={direction} className="mx-auto max-w-[760px] text-center">
        {worldTag}
        {kickerLabel ? (
          <div className="flex justify-center">
            <Kicker label={kickerLabel} />
          </div>
        ) : null}
        <h3
          className={
            big
              ? 'mt-5 text-[25px] sm:text-[29px] md:text-[34px] lg:text-[38px]'
              : 'mt-5 text-[22px] sm:text-[25px] md:text-[28px] lg:text-[30px]'
          }
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.16,
            letterSpacing: '-0.01em',
            textWrap: 'balance',
          }}
        >
          {headingLink}
        </h3>
        {content.standfirst ? (
          <p
            className="mx-auto mt-4 max-w-[54ch] text-[15px] md:text-[16px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
          >
            {content.standfirst}
          </p>
        ) : null}
        <div className="mt-6 flex justify-center">
          <QuietLink href={href}>{cta(entry.format, t)}</QuietLink>
        </div>
      </article>
    );
  }

  // ── moment — one photo + ~20 words, small and offset ──
  if (entry.format === 'moment') {
    return (
      <article
        dir={direction}
        className={`grid items-center gap-6 md:grid-cols-2 md:gap-12 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}
      >
        {photo ? (
          <div className="tm-media-float-soft relative aspect-[4/3] w-full">
            <Image
              src={photo.src}
              alt={content.coverAlt ?? ''}
              fill
              sizes="(min-width:768px) 46vw, 100vw"
              loading="lazy"
              placeholder={photo.blurDataURL ? 'blur' : undefined}
              blurDataURL={photo.blurDataURL}
              className="object-cover"
            />
          </div>
        ) : null}
        <div className={photo ? '' : 'md:col-span-2 md:mx-auto md:max-w-[600px] md:text-center'}>
          {worldTag}
          <Kicker label={kickerLabel ?? 'LAHZA'} date={kickerDate} />
          <p
            className="mt-3 text-[19px] md:text-[22px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.3,
            }}
          >
            <Link href={href} className="transition-opacity hover:opacity-70">
              {content.standfirst || title}
            </Link>
          </p>
        </div>
      </article>
    );
  }

  // ── interview — quote-led, portrait secondary ──
  if (entry.format === 'interview' && content.pullQuote) {
    return (
      <article dir={direction} className="mx-auto max-w-[820px]">
        {worldTag}
        <Kicker label={kickerLabel ?? 'SUHBAT'} />
        <blockquote className="mt-5">
          <p
            className="text-[24px] md:text-[30px] lg:text-[34px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.24,
              letterSpacing: '-0.01em',
            }}
          >
            <Link href={href} className="transition-opacity hover:opacity-70">
              “{content.pullQuote.text}”
            </Link>
          </p>
          <footer
            className="mt-5 text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: NAVY_48,
            }}
          >
            {content.pullQuote.attribution}
            {content.pullQuote.role ? ` · ${content.pullQuote.role}` : ''}
          </footer>
        </blockquote>
      </article>
    );
  }

  // ── video — cinematic poster + a quiet play cue (never a YouTube
  //    chrome), linking into the detail player ──
  if (entry.format === 'video' && (photo || entry.video)) {
    const poster = photo ?? entry.video?.poster;
    const dur = entry.video ? clock(entry.video.durationSec) : kickerDate;
    return (
      <article dir={direction} className="mx-auto max-w-[1000px]">
        <Link href={href} className="group block">
          <div className="tm-media-float tm-media-float-interactive relative aspect-[16/9] w-full">
            {poster ? (
              <Image
                src={poster.src}
                alt={content.coverAlt ?? ''}
                fill
                sizes="(min-width:1024px) 1000px, 100vw"
                loading="lazy"
                placeholder={poster.blurDataURL ? 'blur' : undefined}
                blurDataURL={poster.blurDataURL}
                className="object-cover"
              />
            ) : null}
            {/* a soft foot so a light poster still holds the cue + label */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  'linear-gradient(to top, rgba(12,17,22,0.42), transparent)',
              }}
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: 'rgba(247,243,236,0.94)',
                boxShadow: '0 6px 24px rgba(12,17,22,0.28)',
              }}
            >
              <span
                className="ms-1 block h-0 w-0"
                style={{
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderInlineStart: `13px solid ${NAVY}`,
                }}
              />
            </span>
            {dur ? (
              <span
                className="absolute bottom-3 end-3 text-[11px] uppercase"
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#F7F3EC',
                }}
              >
                {dur}
              </span>
            ) : null}
          </div>
        </Link>
        <div className="mt-5 md:max-w-[720px]">
          {worldTag}
          <Kicker label={kickerLabel ?? 'VIDEO'} date={kickerDate} />
          <h3
            className="mt-3 text-[24px] md:text-[30px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.2,
            }}
          >
            {headingLink}
          </h3>
          {content.standfirst ? (
            <p
              className="mt-3 max-w-[52ch] text-[15px] md:text-[16px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {content.standfirst}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  // ── news / campaign — compact ──
  if (entry.format === 'news' || entry.format === 'campaign') {
    const state = entry.format === 'campaign' ? campaignState(entry) : null;
    const campaignCta =
      state === 'ended'
        ? entry.campaign?.resultsHref
          ? { href: entry.campaign.resultsHref, label: t.results }
          : null
        : entry.campaign?.participateHref
          ? { href: entry.campaign.participateHref, label: t.take_part }
          : null;
    return (
      <article
        dir={direction}
        className="mx-auto max-w-[680px] border-t border-[#1c2a3a14] pt-7"
      >
        {worldTag}
        <Kicker label={kickerLabel ?? ''} date={kickerDate} />
        <div className="mt-3">
          <p
            className="text-[19px] md:text-[21px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.3,
            }}
          >
            {headingLink}
          </p>
          {content.standfirst ? (
            <p
              className="mt-1.5 text-[14px] md:text-[15px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.65 }}
            >
              {content.standfirst}
            </p>
          ) : null}
          {state === 'ended' ? (
            <p
              className="mt-3 text-[11px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: NAVY_48,
              }}
            >
              {t.ended}
            </p>
          ) : null}
          {campaignCta ? (
            <div className="mt-3">
              <QuietLink href={campaignCta.href}>{campaignCta.label}</QuietLink>
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  // ── reportage (default) — photo-led feature ──
  return (
    <article dir={direction}>
      {photo ? (
        <div className="tm-media-float relative -mx-6 aspect-[16/10] w-[calc(100%+3rem)] sm:mx-0 sm:aspect-[2/1] sm:w-full">
          <Image
            src={photo.src}
            alt={content.coverAlt ?? ''}
            fill
            sizes="(min-width:1200px) 1200px, 100vw"
            loading="lazy"
            placeholder={photo.blurDataURL ? 'blur' : undefined}
            blurDataURL={photo.blurDataURL}
            className="object-cover"
          />
        </div>
      ) : null}
      <div className={`${photo ? 'mt-6 md:mt-8' : ''} md:max-w-[780px]`}>
        {worldTag}
        <Kicker label={kickerLabel ?? ''} date={kickerDate} />
        <h3
          className="mt-3 text-[26px] sm:text-[30px] md:text-[36px] lg:text-[40px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.12,
            letterSpacing: '-0.015em',
            textWrap: 'balance',
          }}
        >
          {headingLink}
        </h3>
        {content.standfirst ? (
          <p
            className="mt-4 max-w-[52ch] text-[16px] md:text-[18px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
          >
            {content.standfirst}
          </p>
        ) : null}
        <div className="mt-5">
          <QuietLink href={href}>{cta(entry.format, t)}</QuietLink>
        </div>
      </div>
    </article>
  );
}

// ── The stream ─────────────────────────────────────────────────────
export function Hayotdan() {
  const t = useT(EN, UZ);
  const { language } = useLanguage();
  const locale = toLocale(language);
  const [world, setWorld] = useState<JourneyWorld | null>(null);
  const [limit, setLimit] = useState(STREAM_PAGE_SIZE);
  const page = useMemo(
    () =>
      getStreamEntries({
        limit,
        world: world ?? undefined,
        excludePromoted: false,
      }),
    [limit, world],
  );
  const empty = page.total === 0;

  return (
    <Band
      labelledBy="journey-stream-heading"
      className="border-t border-[#1c2a3a17] py-16 md:py-24"
    >
      <Reveal amount={0.12}>
        <Rise>
          <h2
            id="journey-stream-heading"
            className="text-center text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.26em',
              color: GOLD,
            }}
          >
            {t.heading}
          </h2>
          <p
            className="mx-auto mt-5 max-w-[56ch] text-center text-[16px] leading-[1.75] md:text-[17px]"
            style={{ fontFamily: BODY, color: NAVY_64 }}
          >
            {t.intro}
          </p>

          <div
            className="mt-8 flex flex-wrap justify-center gap-2 md:mt-10"
            role="group"
            aria-label={t.filterLabel}
          >
            <button
              type="button"
              onClick={() => {
                setWorld(null);
                setLimit(STREAM_PAGE_SIZE);
              }}
              aria-pressed={world === null}
              className={`min-h-11 rounded-full border px-5 text-[13px] font-semibold transition-colors ${
                world === null
                  ? 'border-[var(--surface-contrast)] bg-[var(--surface-contrast)] text-[var(--text-inverse)]'
                  : 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]'
              }`}
              style={{ fontFamily: BODY }}
            >
              {t.all}
            </button>
            {JOURNEY_WORLDS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setWorld(item);
                  setLimit(STREAM_PAGE_SIZE);
                }}
                aria-pressed={world === item}
                className={`min-h-11 rounded-full border px-5 text-[13px] font-semibold transition-colors ${
                  world === item
                    ? 'border-[var(--surface-contrast)] bg-[var(--surface-contrast)] text-[var(--text-inverse)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]'
                }`}
                style={{ fontFamily: BODY }}
              >
                {worldName(item, locale)}
              </button>
            ))}
          </div>
        </Rise>

        {empty ? (
          <Rise>
            <div className="mx-auto mt-12 max-w-[560px] text-center md:mt-16">
              <p
                className="text-[24px] md:text-[30px]"
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  color: NAVY,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                {t.emptyTitle}
              </p>
              <p
                className="mx-auto mt-4 max-w-[46ch] text-[15px] md:text-[16px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
              >
                {t.emptyBody}
              </p>
            </div>
          </Rise>
        ) : (
          <>
            {/* editorial choreography: heavier entries get more air
                around them, lighter ones sit closer — the rhythm is
                driven by format + weight, never a uniform grid. */}
            <ol className="mt-12 md:mt-16">
              {page.entries.map((entry, i) => {
                const heavy =
                  entry.weight === 'lead' || entry.weight === 'feature';
                const light = entry.weight === 'quiet';
                const gap =
                  i === 0
                    ? ''
                    : heavy
                      ? 'mt-24 md:mt-36'
                      : light
                        ? 'mt-14 md:mt-20'
                        : 'mt-20 md:mt-28';
                return (
                  <li key={entry.id} className={gap}>
                    <Rise>
                      <StreamEntry entry={entry} index={i} />
                    </Rise>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {!empty && page.hasMore ? (
          <div className="mt-20 flex justify-center md:mt-24">
            <button
              type="button"
              onClick={() => setLimit((l) => l + STREAM_PAGE_SIZE)}
              className="group inline-flex items-center gap-2 text-[13px] uppercase transition-opacity duration-300 hover:opacity-70"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: NAVY,
              }}
            >
              <span>{t.more}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
                style={{ color: GOLD }}
              >
                &darr;
              </span>
            </button>
          </div>
        ) : null}
      </Reveal>
    </Band>
  );
}

export default Hayotdan;
