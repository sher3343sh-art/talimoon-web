'use client';

/**
 * HAYOT — one editorial world's landing (V2).
 * ----------------------------------------------------------------
 * `/journey/talimoon`, `/journey/parents`, `/journey/wisdom`.
 * Deliberately minimal: the world's identity + its own stream (via
 * the shared `StreamEntry` renderer), or a restrained empty state.
 * The architecture is ready; there is no elaborate separate page
 * design and nothing is faked to fill it.
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { STREAM_PAGE_SIZE, getWorldEntries } from '@/lib/journey/content';
import { toLocale, worldBlurb, worldName, type JourneyWorld } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import { StreamEntry } from './Hayotdan';
import {
  Band,
  BODY,
  DISPLAY,
  GOLD,
  NAVY,
  NAVY_64,
  Reveal,
  Rise,
} from './shared';

const EN = {
  back: 'HAYOT',
  more: 'See more',
  empty: 'The first pieces for this world are on the way.',
};
const UZ: typeof EN = {
  back: 'HAYOT',
  more: "Ko'proq ko'rish",
  empty: 'Bu olam uchun ilk yozuvlar tez orada.',
};

export function WorldLanding({ world }: { world: JourneyWorld }) {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const [limit, setLimit] = useState(STREAM_PAGE_SIZE);

  const all = useMemo(() => getWorldEntries(world), [world]);
  const shown = all.slice(0, limit);
  const locale = toLocale(language);
  const name = worldName(world, locale);
  const blurb = worldBlurb(world, locale);

  return (
    <Band
      labelledBy="journey-world-heading"
      className="pt-24 pb-24 md:pt-32 md:pb-32"
    >
      <Reveal amount={0.15}>
        <Rise>
          <Link
            href="/journey"
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
            style={{ fontFamily: BODY, fontWeight: 600, color: NAVY_64 }}
          >
            <span aria-hidden="true">&larr;</span>
            <span>{t.back}</span>
          </Link>
        </Rise>

        <Rise>
          <h1
            id="journey-world-heading"
            className="mt-10 text-[30px] sm:text-[36px] md:text-[44px] lg:text-[50px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
            }}
          >
            {name}
          </h1>
          <p
            className="mt-4 max-w-[52ch] text-[16px] md:text-[18px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
          >
            {blurb}
          </p>
        </Rise>

        {all.length === 0 ? (
          <Rise>
            <p
              className="mt-12 max-w-[46ch] text-[15px] md:text-[16px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
            >
              {t.empty}
            </p>
          </Rise>
        ) : (
          <>
            <ol className="mt-14 md:mt-16">
              {shown.map((entry, i) => {
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
            {shown.length < all.length ? (
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
          </>
        )}
      </Reveal>
    </Band>
  );
}

export default WorldLanding;
