'use client';

/**
 * HAYOT — YAQIN KUNLAR (the forward pulse).
 * ----------------------------------------------------------------
 * "What's near" — the next few real things, date-ordered, today
 * anchored. Not a calendar and not a row of event cards: a quiet
 * editorial ledger.
 *
 *   • Desktop — a horizontal ledger. A thin baseline runs across;
 *     each item hangs from a small node (filled gold for "today",
 *     faint for the rest). Past items sit dimmer.
 *   • Mobile — the same items as a touch-native scroll-snap row.
 *
 * Source: `getPulse(locale, now)` from the Increment 1 accessors.
 * When it returns nothing meaningful ahead, this component renders
 * `null` — the band disappears entirely, never a placeholder.
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { getPulse } from '@/lib/journey/content';
import { toLocale, type PulseStrand } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import { Band, BODY, GOLD, NAVY, NAVY_48, NAVY_64, Reveal, Rise, shortDate } from './shared';

const EN = {
  heading: "What's near",
  today: 'Today',
  empty: 'What is coming will appear here — new parts, visits, a competition.',
};
const UZ: typeof EN = {
  heading: 'Yaqin kunlar',
  today: 'Bugun',
  empty: "Oldinda nima borligi shu yerda ko'rinadi — yangi qismlar, tashriflar, tanlov.",
};

const STRAND_EN: Record<PulseStrand, string> = {
  episode: 'New part',
  visit: 'A visit',
  campaign: 'Competition',
  story: 'New story',
  announcement: 'Announcement',
};
const STRAND_UZ: Record<PulseStrand, string> = {
  episode: 'Yangi qism',
  visit: 'Tashrif',
  campaign: 'Tanlov',
  story: 'Yangi hikoya',
  announcement: "E'lon",
};

export function YaqinKunlar() {
  const { language } = useLanguage();
  const locale = toLocale(language);
  const t = useT(EN, UZ);
  const strand = language === 'UZ' ? STRAND_UZ : STRAND_EN;

  const items = useMemo(() => getPulse(locale), [locale]);

  return (
    <Band
      labelledBy="journey-pulse-heading"
      className="border-t border-[#1c2a3a17] py-14 md:py-[68px]"
    >
      <Reveal amount={0.15}>
        <Rise>
          <h2
            id="journey-pulse-heading"
            className="text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.26em',
              color: GOLD,
            }}
          >
            {t.heading}
          </h2>
        </Rise>

        {items.length === 0 ? (
          <Rise>
            {/* restrained empty state — the place is established, the
                hairline holds, one quiet line, a single faint node. */}
            <div className="relative mt-9 md:mt-10">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[7px] hidden h-px md:block"
                style={{ backgroundColor: 'rgba(28,42,58,0.12)' }}
              />
              <span
                aria-hidden="true"
                className="absolute start-0 top-[7px] hidden h-[13px] w-[13px] -translate-y-1/2 rounded-full md:block"
                style={{ backgroundColor: 'rgba(28,42,58,0.16)' }}
              />
              <p
                className="max-w-[46ch] text-[15px] md:pt-8 md:text-[16px]"
                style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
              >
                {t.empty}
              </p>
            </div>
          </Rise>
        ) : (
        <Rise>
          <ol
            className="mt-8 flex snap-x snap-mandatory gap-0 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 md:snap-none md:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {items.map((it) => {
              const dim = it.state === 'past';
              const today = it.state === 'today';
              return (
                <li
                  key={it.id}
                  className="relative min-w-[74vw] shrink-0 snap-start pe-8 sm:min-w-[50vw] md:min-w-0 md:flex-1 md:pe-6"
                >
                  {/* desktop baseline + node */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[7px] hidden h-px md:block"
                    style={{ backgroundColor: 'rgba(28,42,58,0.12)' }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute start-0 top-[7px] hidden h-[13px] w-[13px] -translate-y-1/2 rounded-full md:block"
                    style={{
                      backgroundColor: today ? GOLD : 'rgba(28,42,58,0.2)',
                    }}
                  />

                  <div className={dim ? 'opacity-45 md:pt-7' : 'md:pt-7'}>
                    <p
                      className="text-[12px] uppercase"
                      style={{
                        fontFamily: BODY,
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        color: today ? GOLD : NAVY_48,
                      }}
                    >
                      {today ? t.today : shortDate(it.dateISO, locale)}
                    </p>
                    <p
                      className="mt-2 text-[11px] uppercase"
                      style={{
                        fontFamily: BODY,
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        color: NAVY_64,
                      }}
                    >
                      {strand[it.strand]}
                    </p>
                    <p
                      className="mt-2 text-[16px] md:text-[17px]"
                      style={{
                        fontFamily: BODY,
                        color: NAVY,
                        lineHeight: 1.4,
                        fontWeight: today ? 600 : 400,
                      }}
                    >
                      {it.href ? (
                        <Link
                          href={it.href}
                          className="transition-opacity duration-300 hover:opacity-60"
                        >
                          {it.title}
                        </Link>
                      ) : (
                        it.title
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Rise>
        )}
      </Reveal>
    </Band>
  );
}

export default YaqinKunlar;
