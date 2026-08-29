'use client';

/**
 * HAYOT — entry detail shell (Increment 1).
 * ----------------------------------------------------------------
 * The route (/journey/[slug]) and its guards exist now. The full
 * editorial block canvas — paragraph / image / gallery / video /
 * quote / note / cta / spacer — is built in Increment 5. Until
 * then this renders the entry's resolved header (kicker, title,
 * standfirst) and a quiet note, so the route is real and
 * navigable without pre-empting that design.
 *
 * With the V1 seed empty there is no entry to reach; this compiles
 * and stands ready for the first published entry.
 */

import Link from 'next/link';
import { useMemo } from 'react';
import { resolveEntryContent } from '@/lib/journey/content';
import { toLocale, type JourneyEntry } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import { Band, BODY, DISPLAY, GOLD, NAVY, NAVY_64 } from './shared';

const EN = {
  back: 'HAYOT',
  soon: 'The full story view is being prepared.',
  otherLang: 'Shown in another language for now.',
};

const UZ: typeof EN = {
  back: 'HAYOT',
  soon: "To'liq hikoya ko'rinishi tayyorlanmoqda.",
  otherLang: "Hozircha boshqa tilda ko'rsatilmoqda.",
};

export function JourneyEntryShell({ entry }: { entry: JourneyEntry }) {
  const { language } = useLanguage();
  const t = useT(EN, UZ);

  const resolved = useMemo(
    () => resolveEntryContent(entry, toLocale(language)),
    [entry, language],
  );
  const { content, isFallback, direction } = resolved;

  return (
    <Band
      labelledBy="journey-entry-heading"
      className="pt-28 pb-32 md:pt-36 md:pb-40"
      dir={direction}
    >
      <div className="mx-auto max-w-[720px]">
        <Link
          href="/journey"
          className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
          style={{ fontFamily: BODY, fontWeight: 600, color: NAVY_64 }}
        >
          <span aria-hidden="true">&larr;</span>
          <span>{t.back}</span>
        </Link>

        <article className="mt-10">
          {content.kicker && (
            <p
              className="text-[12px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: GOLD,
              }}
            >
              {content.kicker.label}
              {content.kicker.dateLabel ? (
                <>
                  <span aria-hidden="true"> · </span>
                  {content.kicker.dateLabel}
                </>
              ) : null}
            </p>
          )}

          {content.title && (
            <h1
              id="journey-entry-heading"
              className="mt-4 text-[30px] sm:text-[36px] md:text-[46px]"
              style={{
                fontFamily: DISPLAY,
                fontWeight: 600,
                color: NAVY,
                lineHeight: 1.14,
                letterSpacing: '-0.015em',
              }}
            >
              {content.title}
            </h1>
          )}

          {content.standfirst && (
            <p
              className="mt-5 text-[17px] md:text-[19px]"
              style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
            >
              {content.standfirst}
            </p>
          )}

          <p
            className="mt-12 text-[13px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.6 }}
          >
            {t.soon}
            {isFallback ? (
              <>
                {' '}
                <span style={{ color: GOLD }}>{t.otherLang}</span>
              </>
            ) : null}
          </p>
        </article>
      </div>
    </Band>
  );
}

export default JourneyEntryShell;
