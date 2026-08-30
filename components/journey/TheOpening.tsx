'use client';

/**
 * HAYOT — THE OPENING (Increment 2).
 * ----------------------------------------------------------------
 * Not a page hero. There is no "HAYOT" title, no explanatory copy,
 * no brand graphic — the most important current TALIMOON entry
 * introduces the page by itself. The visitor lands inside a story.
 *
 * Source of truth: `getFeaturedEntry()` from the Increment 1
 * accessors. Its `source` is honoured:
 *   • 'featured' / 'newest'  — a genuinely current entry; the
 *      opening reads as immediate.
 *   • 'featured-stale'       — an editorially pinned but older
 *      entry. It still shows, with its REAL kicker + date; no
 *      freshness language is ever added, so an old story is never
 *      framed as if it happened today.
 * No entry at all ⇒ the honest empty state (`JourneyFoundation`) is
 * the fallback, unchanged.
 *
 * Two treatments, one component — both an editorial title spread
 * that owns the first viewport:
 *   • PHOTOGRAPHIC — when the entry has a showable `cover`
 *     (`mediaPolicy().showMedia`). The photograph holds the right
 *     of the composition and bleeds off the page edge; the
 *     coverline (kicker · rule · headline · standfirst · link) sits
 *     left. No dark scrim over the picture.
 *   • TYPE-LED — for a `thought`, or any entry whose media may not
 *     be shown (`consent: 'none'`), or which simply has no cover.
 *     The coverline sits left; the opening words of the piece sit
 *     right (desktop) / directly under the standfirst (mobile),
 *     quiet, as though the essay has already begun — real content
 *     carrying the composition, not decoration. This is the
 *     treatment HAYOT ships with today.
 *
 * Motion is a single restrained on-mount sequence (the opening is
 * above the fold, so it does not wait for scroll). Everything is
 * gated on `prefers-reduced-motion`; the composition holds — and
 * reads as deliberately art-directed — with all motion disabled.
 */

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  getFeaturedEntry,
  mediaPolicy,
  resolveEntryContent,
  type FeaturedResult,
} from '@/lib/journey/content';
import { toLocale, type JourneyFormat } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import { JourneyFoundation } from './JourneyFoundation';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_48, NAVY_64, WorldLabel } from './shared';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const EN = {
  story: 'Read the story',
  thought: 'Read the thought',
  conversation: 'Read the conversation',
  watch: 'Watch',
  more: 'Read more',
};
const UZ: typeof EN = {
  story: "Hikoyani ko'ring",
  thought: "Fikrni o'qish",
  conversation: "Suhbatni o'qish",
  watch: "Ko'rish",
  more: 'Batafsil',
};

function ctaLabel(format: JourneyFormat, t: typeof EN): string {
  switch (format) {
    case 'reportage':
    case 'moment':
      return t.story;
    case 'thought':
      return t.thought;
    case 'interview':
      return t.conversation;
    case 'video':
      return t.watch;
    default:
      return t.more;
  }
}

export function TheOpening() {
  const featured = useMemo(() => getFeaturedEntry(), []);
  if (!featured) return <JourneyFoundation />;
  return <Opening result={featured} />;
}

function Opening({ result }: { result: FeaturedResult }) {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  const { entry } = result;

  const { content, direction } = useMemo(
    () => resolveEntryContent(entry, toLocale(language)),
    [entry, language],
  );

  const policy = mediaPolicy(entry);
  const photo =
    policy.showMedia && entry.cover && entry.cover.src.trim() !== ''
      ? entry.cover
      : null;

  const kicker = content.kicker;
  const title = content.title ?? '';
  const standfirst = content.standfirst;
  const href = `/journey/${entry.slug}`;
  const cta = ctaLabel(entry.format, t);

  // The type-led side text: the first real paragraph of the piece,
  // so the visitor lands mid-thought rather than beside a void.
  const lede = !photo
    ? content.blocks.find(
        (b): b is Extract<typeof b, { t: 'paragraph' }> => b.t === 'paragraph',
      )?.text
    : undefined;

  // On-mount reveal (above the fold — no scroll trigger). A gentle
  // rise only, no opacity fade: the opening headline is the LCP
  // element and must paint immediately and legibly even if the
  // reveal never runs (JS slow, tab backgrounded on load). Under
  // reduced motion every prop is undefined — elements render at rest.
  const seq = (delay: number) => ({
    initial: reduced ? undefined : { y: 16 },
    animate: reduced ? undefined : { y: 0 },
    transition: reduced ? undefined : { duration: 0.75, delay, ease: EASE },
  });

  const coverText = (
    <>
      <motion.div {...seq(0.02)}>
        <WorldLabel
          world={entry.world}
          language={language}
          as="link"
          className="block"
        />
      </motion.div>
      {kicker ? (
        <>
          <motion.p
            {...seq(0.05)}
            className="mt-2 text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: GOLD,
            }}
          >
            {kicker.label}
            {kicker.dateLabel ? (
              <>
                <span aria-hidden="true" style={{ color: NAVY_48 }}>
                  {' · '}
                </span>
                {kicker.dateLabel}
              </>
            ) : null}
          </motion.p>
          <motion.span
            {...seq(0.12)}
            aria-hidden="true"
            className="mt-5 block"
            style={{ width: 40, height: 1, backgroundColor: GOLD }}
          />
        </>
      ) : null}

      <motion.h1
        id="journey-heading"
        {...seq(0.18)}
        className={
          photo
            ? 'mt-7 text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px]'
            : 'mt-7 text-[32px] sm:text-[40px] md:text-[44px] lg:text-[47px]'
        }
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          color: NAVY,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
        }}
      >
        {title}
      </motion.h1>

      {standfirst ? (
        <motion.p
          {...seq(0.28)}
          className="mt-6 text-[16px] md:text-[18px]"
          style={{
            fontFamily: BODY,
            color: NAVY_64,
            lineHeight: 1.7,
            maxWidth: '44ch',
          }}
        >
          {standfirst}
        </motion.p>
      ) : null}
    </>
  );

  const ctaLink = (
    <motion.div {...seq(0.42)}>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-[15px] transition-opacity duration-300 hover:opacity-70"
        style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
      >
        <span>{cta}</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: GOLD }}
        >
          &rarr;
        </span>
      </Link>
    </motion.div>
  );

  const ledeBlock = lede ? (
    <motion.div
      {...seq(0.5)}
      className="mt-2 lg:mt-0 lg:border-s lg:ps-10"
      style={{ borderColor: 'rgba(184,147,91,0.35)' }}
    >
      <p
        className="text-[16px] md:text-[17px]"
        style={{
          fontFamily: BODY,
          color: 'rgba(28,42,58,0.72)',
          lineHeight: 1.85,
          maxWidth: '42ch',
        }}
      >
        {lede}
      </p>
    </motion.div>
  ) : null;

  return (
    <section
      dir={direction}
      aria-labelledby="journey-heading"
      className="relative w-full overflow-hidden bg-surface-base"
      style={{ color: NAVY }}
    >
      {/* DESKTOP photograph — right-anchored, bleeds to the viewport
          edge, from just under the navbar to the fold. No scrim over
          the picture; only a hairline of cream at the very bottom so
          it settles into the page rather than ending on a hard edge. */}
      {photo ? (
        <motion.div
          className="pointer-events-none absolute right-0 top-[88px] bottom-0 hidden w-[54vw] max-w-[1200px] lg:block"
          initial={reduced ? undefined : { opacity: 0, scale: 1.04 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Image
            src={photo.src}
            alt={content.coverAlt ?? ''}
            fill
            priority
            sizes="54vw"
            placeholder={photo.blurDataURL ? 'blur' : undefined}
            blurDataURL={photo.blurDataURL}
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[9%]"
            style={{
              background:
                'linear-gradient(to bottom, transparent, var(--surface-base))',
            }}
          />
        </motion.div>
      ) : null}

      <div className="relative mx-auto flex min-h-[480px] max-w-[1400px] flex-col justify-center px-6 py-20 md:px-10 md:py-24 lg:min-h-[620px] lg:px-16 lg:py-28">
        {/* MOBILE / TABLET photograph — edge to edge, in flow, below the
            navbar, feathering into the cream so the coverline rises
            out of it. */}
        {photo ? (
          <motion.div
            className="relative -mx-6 mb-10 md:-mx-10 lg:hidden"
            initial={reduced ? undefined : { opacity: 0, scale: 1.04 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="relative aspect-[4/5] w-full sm:aspect-[3/2]">
              <Image
                src={photo.src}
                alt={content.coverAlt ?? ''}
                fill
                priority
                sizes="100vw"
                placeholder={photo.blurDataURL ? 'blur' : undefined}
                blurDataURL={photo.blurDataURL}
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[24%]"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent, var(--surface-base))',
                }}
              />
            </div>
          </motion.div>
        ) : null}

        {lede ? (
          // TYPE-LED spread. Desktop: coverline + link stacked left,
          // opening words right (spanning, optically centred). Mobile:
          // coverline, then opening words, then the link last — read
          // into the thought, then continue.
          <div className="grid gap-y-9 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:items-start lg:gap-x-16 xl:gap-x-24">
            <div className="max-w-[620px]">{coverText}</div>
            <div className="lg:row-span-2 lg:self-center">{ledeBlock}</div>
            <div>{ctaLink}</div>
          </div>
        ) : (
          <div
            className={
              photo ? 'relative z-10 lg:max-w-[46%]' : 'relative z-10 max-w-[640px]'
            }
          >
            {coverText}
            <div className="mt-9">{ctaLink}</div>
          </div>
        )}
      </div>
    </section>
  );
}

export default TheOpening;
