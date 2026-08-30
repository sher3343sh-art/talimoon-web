'use client';

/**
 * HAYOT — entry detail (the flexible editorial canvas).
 * ----------------------------------------------------------------
 * Not one rigid article template. The entry's `blocks` drive the
 * page: a thought is a text essay, a visit is a photo essay, an
 * interview is a Q&A — one coherent system, no fixed shape.
 *
 * Header adapts: a showable `cover` (per `mediaPolicy`) leads the
 * page; otherwise it opens type-first. Ends with "HAYOT DAVOM
 * ETADI" and 2–3 genuinely related entries (`getRelatedEntries`) —
 * quiet links, not cards. A restrained "Ulashish ↗" uses the native
 * share sheet where available, else copies the link.
 *
 * All copy is real HTML text (nothing baked into images); `dir` is
 * set from the resolved edition for RTL readiness.
 */

import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getRelatedEntries,
  mediaPolicy,
  resolveEntryContent,
} from '@/lib/journey/content';
import {
  toLocale,
  type Block,
  type JourneyEntry,
  type Reference,
} from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import {
  Band,
  BODY,
  DISPLAY,
  GOLD,
  Kicker,
  NAVY,
  NAVY_48,
  NAVY_64,
  VideoPlayer,
  WorldLabel,
} from './shared';

const EN = {
  back: 'HAYOT',
  share: 'Share',
  copied: 'Link copied',
  more: 'HAYOT continues',
  otherLang: 'Shown in another language for now.',
  transcript: 'Transcript',
  sources: 'Sources',
  link: 'Link',
};
const UZ: typeof EN = {
  back: 'HAYOT',
  share: 'Ulashish',
  copied: 'Havola nusxalandi',
  more: 'HAYOT DAVOM ETADI',
  otherLang: "Hozircha boshqa tilda ko'rsatilmoqda.",
  transcript: 'Matn (transkript)',
  sources: 'Manbalar',
  link: 'Havola',
};

/** One reference → a quiet bibliographic line (no URL — that is a
 *  separate <a> so it wraps cleanly). Never fabricated. */
function formatReference(ref: Reference): string {
  const parts: string[] = [];
  if (ref.author) parts.push(ref.author);
  if (ref.title) parts.push(`“${ref.title}”`);
  const tail: string[] = [];
  if (ref.edition) tail.push(ref.edition);
  if (ref.pages) tail.push(ref.pages);
  if (ref.publisher) tail.push(ref.publisher);
  if (ref.year) tail.push(String(ref.year));
  if (ref.role) tail.push(ref.role);
  let line = parts.join(', ');
  if (tail.length) line += (line ? ' · ' : '') + tail.join(', ');
  if (ref.note) line += (line ? ' — ' : '') + ref.note;
  return line;
}

/** caption + optional credit, on one figcaption. */
function FigMeta({ caption, credit }: { caption?: string; credit?: string }) {
  if (!caption && !credit) return null;
  return (
    <figcaption
      className="mt-3 text-[13px]"
      style={{ fontFamily: BODY, color: NAVY_48, lineHeight: 1.6 }}
    >
      {caption}
      {caption && credit ? '  ·  ' : null}
      {credit ? <span style={{ letterSpacing: '0.02em' }}>{credit}</span> : null}
    </figcaption>
  );
}

const READING = 'mx-auto w-full max-w-[680px]';

// ── One block ──────────────────────────────────────────────────────
function BlockView({
  block,
  transcriptLabel,
}: {
  block: Block;
  transcriptLabel: string;
}) {
  switch (block.t) {
    case 'paragraph':
      return (
        <p
          className={`${READING} text-[17px] md:text-[19px]`}
          style={{ fontFamily: BODY, color: 'rgba(28,42,58,0.82)', lineHeight: 1.8 }}
        >
          {block.text}
        </p>
      );
    case 'heading':
      return block.level === 3 ? (
        <h3
          className={`${READING} pt-4 text-[20px] md:text-[24px]`}
          style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.3 }}
        >
          {block.text}
        </h3>
      ) : (
        <h2
          className={`${READING} pt-6 text-[24px] md:text-[30px]`}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {block.text}
        </h2>
      );
    case 'image':
      return (
        <figure className={block.full ? 'mx-auto w-full max-w-[1000px]' : READING}>
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Image
              src={block.asset.src}
              alt={block.alt}
              fill
              sizes="(min-width:1000px) 1000px, 100vw"
              loading="lazy"
              placeholder={block.asset.blurDataURL ? 'blur' : undefined}
              blurDataURL={block.asset.blurDataURL}
              className="object-cover"
            />
          </div>
          <FigMeta caption={block.caption} credit={block.asset.credit} />
        </figure>
      );
    case 'imagePair':
      return (
        <figure className="mx-auto w-full max-w-[1000px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { a: block.a, alt: block.altA },
              { a: block.b, alt: block.altB },
            ].map((it, i) => (
              <div key={i} className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={it.a.src}
                  alt={it.alt}
                  fill
                  sizes="(min-width:640px) 50vw, 100vw"
                  loading="lazy"
                  placeholder={it.a.blurDataURL ? 'blur' : undefined}
                  blurDataURL={it.a.blurDataURL}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <FigMeta caption={block.caption} />
        </figure>
      );
    case 'gallery':
      return (
        <div className="mx-auto grid w-full max-w-[1000px] gap-3 sm:grid-cols-2">
          {block.items.map((it, i) => (
            <div key={i} className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={it.asset.src}
                alt={it.alt}
                fill
                sizes="(min-width:640px) 50vw, 100vw"
                loading="lazy"
                placeholder={it.asset.blurDataURL ? 'blur' : undefined}
                blurDataURL={it.asset.blurDataURL}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      );
    case 'video':
      return (
        <VideoPlayer
          video={block.video}
          className="mx-auto w-full max-w-[1000px]"
          transcriptLabel={transcriptLabel}
        />
      );
    case 'quote':
      return (
        <blockquote className={`${READING} border-s py-1 ps-6`} style={{ borderColor: 'rgba(184,147,91,0.4)' }}>
          <p
            className="text-[21px] md:text-[25px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.35,
            }}
          >
            “{block.text}”
          </p>
          {block.attribution ? (
            <footer
              className="mt-3 text-[13px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: NAVY_48,
              }}
            >
              {block.attribution}
              {block.role ? ` · ${block.role}` : ''}
            </footer>
          ) : null}
        </blockquote>
      );
    case 'note':
      return (
        <p
          className={`${READING} text-[14px] md:text-[15px]`}
          style={{
            fontFamily: BODY,
            color: NAVY_48,
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          {block.text}
        </p>
      );
    case 'cta':
      return (
        <div className={READING}>
          <Link
            href={block.href}
            className="group inline-flex items-center gap-2 text-[15px] transition-opacity duration-300 hover:opacity-70"
            style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
          >
            <span>{block.label}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: GOLD }}
            >
              &rarr;
            </span>
          </Link>
        </div>
      );
    case 'embed':
      return (
        <div className={READING}>
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] underline"
            style={{ fontFamily: BODY, color: NAVY_64 }}
          >
            {block.url}
          </a>
        </div>
      );
    case 'spacer':
      return (
        <div
          aria-hidden="true"
          className={
            block.size === 'lg' ? 'h-16' : block.size === 'sm' ? 'h-4' : 'h-9'
          }
        />
      );
  }
}

// ── The page ───────────────────────────────────────────────────────
export function EntryDetail({ entry }: { entry: JourneyEntry }) {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const { content, direction, isFallback } = useMemo(
    () => resolveEntryContent(entry, toLocale(language)),
    [entry, language],
  );
  const related = useMemo(() => getRelatedEntries(entry, 3), [entry]);
  const relatedResolved = useMemo(
    () =>
      related.map((r) => ({
        entry: r,
        content: resolveEntryContent(r, toLocale(language)).content,
      })),
    [related, language],
  );

  const policy = mediaPolicy(entry);
  const photo =
    policy.showMedia && entry.cover && entry.cover.src.trim() !== ''
      ? entry.cover
      : null;
  // A video entry leads with the player (poster-first), not a still.
  const leadVideo =
    entry.format === 'video' && policy.showMedia && entry.video
      ? entry.video
      : null;
  const coverCredit = content.credit ?? entry.cover?.credit;

  const [shared, setShared] = useState(false);
  const onShare = useCallback(async () => {
    const url =
      typeof window !== 'undefined' ? window.location.href : `/journey/${entry.slug}`;
    const title = content.title ?? 'HAYOT — TALIMOON';
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShared(true);
        window.setTimeout(() => setShared(false), 2400);
      }
    } catch {
      /* user dismissed the share sheet — nothing to do */
    }
  }, [content.title, entry.slug]);

  return (
    <article dir={direction}>
      <Band className="pt-24 pb-10 md:pt-32 md:pb-12">
        <div className={READING}>
          <Link
            href="/journey"
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
            style={{ fontFamily: BODY, fontWeight: 600, color: NAVY_64 }}
          >
            <span aria-hidden="true">&larr;</span>
            <span>{t.back}</span>
          </Link>
        </div>

        <div className={`${READING} mt-10`}>
          <WorldLabel
            world={entry.world}
            language={language}
            as="link"
            className="block"
          />
          {content.kicker ? (
            <Kicker
              label={content.kicker.label}
              date={content.kicker.dateLabel}
              className="mt-2.5"
            />
          ) : null}
          {content.title ? (
            <h1
              className="mt-4 text-[30px] sm:text-[36px] md:text-[44px] lg:text-[50px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textWrap: 'balance',
              }}
            >
              {content.title}
            </h1>
          ) : null}
          {content.standfirst ? (
            <p
              className="mt-5 max-w-[46ch] text-[17px] md:text-[19px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {content.standfirst}
            </p>
          ) : null}
          {content.keyIdea ? (
            <div
              className="mt-6 border-s ps-5"
              style={{ borderColor: 'rgba(184,147,91,0.4)' }}
            >
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
          {content.author ? (
            <p
              className="mt-6 text-[12px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: NAVY_48,
              }}
            >
              {content.author}
            </p>
          ) : null}
          {isFallback ? (
            <p
              className="mt-4 text-[12px]"
              style={{ fontFamily: BODY, color: GOLD }}
            >
              {t.otherLang}
            </p>
          ) : null}
        </div>
      </Band>

      {leadVideo ? (
        <div className="w-full bg-surface-base">
          <div className="mx-auto w-full max-w-[1200px]">
            <VideoPlayer video={leadVideo} transcriptLabel={t.transcript} />
          </div>
        </div>
      ) : photo ? (
        <div className="w-full overflow-hidden bg-surface-base">
          <figure className="mx-auto w-full max-w-[1200px]">
            <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
              <Image
                src={photo.src}
                alt={content.coverAlt ?? ''}
                fill
                priority
                sizes="(min-width:1200px) 1200px, 100vw"
                placeholder={photo.blurDataURL ? 'blur' : undefined}
                blurDataURL={photo.blurDataURL}
                className="object-cover"
              />
            </div>
            {coverCredit ? (
              <figcaption
                className="mt-3 text-[12px]"
                style={{
                  fontFamily: BODY,
                  color: NAVY_48,
                  letterSpacing: '0.02em',
                }}
              >
                {coverCredit}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : coverCredit ? (
        <div className={`${READING} pb-2`}>
          <p
            className="text-[12px]"
            style={{ fontFamily: BODY, color: NAVY_48, letterSpacing: '0.02em' }}
          >
            {coverCredit}
          </p>
        </div>
      ) : null}

      <Band className="py-14 md:py-20">
        <div className="space-y-7 md:space-y-8">
          {content.blocks.map((block, i) => (
            <BlockView key={i} block={block} transcriptLabel={t.transcript} />
          ))}
        </div>

        {entry.references && entry.references.length > 0 ? (
          <div className={`${READING} mt-14 border-t border-[#1c2a3a17] pt-8`}>
            <h2
              className="text-[12px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: NAVY_48,
              }}
            >
              {t.sources}
            </h2>
            <ul className="mt-4 space-y-3">
              {entry.references.map((ref, i) => (
                <li
                  key={i}
                  className="text-[14px]"
                  style={{
                    fontFamily: BODY,
                    color: 'rgba(28,42,58,0.7)',
                    lineHeight: 1.7,
                  }}
                >
                  {formatReference(ref)}
                  {ref.url || ref.doi ? (
                    <>
                      {'  '}
                      <a
                        href={ref.url ?? `https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: NAVY_64 }}
                      >
                        {ref.doi ? `doi:${ref.doi}` : t.link}
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={`${READING} mt-14 border-t border-[#1c2a3a17] pt-6`}>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
            style={{ fontFamily: BODY, fontWeight: 600, color: NAVY_64 }}
          >
            <span>{shared ? t.copied : t.share}</span>
            <span aria-hidden="true" style={{ color: GOLD }}>
              &#8599;
            </span>
          </button>
        </div>
      </Band>

      {relatedResolved.length > 0 ? (
        <Band className="border-t border-[#1c2a3a17] py-16 md:py-24">
          <div className={READING}>
            <h2
              className="text-[13px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.26em',
                color: GOLD,
              }}
            >
              {t.more}
            </h2>
            <ul className="mt-10 space-y-8 md:space-y-10">
              {relatedResolved.map(({ entry: r, content: rc }) => (
                <li key={r.id}>
                  <Link
                    href={`/journey/${r.slug}`}
                    className="group block transition-opacity duration-300 hover:opacity-70"
                  >
                  {rc.kicker ? (
                    <Kicker label={rc.kicker.label} date={rc.kicker.dateLabel} />
                  ) : null}
                    <p
                      className="mt-2 text-[21px] md:text-[25px]"
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 600,
                        color: NAVY,
                        lineHeight: 1.2,
                      }}
                    >
                      {rc.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Band>
      ) : null}
    </article>
  );
}

export default EntryDetail;
