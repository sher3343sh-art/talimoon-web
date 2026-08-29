'use client';

/**
 * HAYOT — foundation placeholder (Increment 1).
 * ----------------------------------------------------------------
 * The route exists and the data layer is in place, but the opening
 * experience, the YAQIN KUNLAR pulse and the HAYOTDAN stream are
 * built in later increments. Until then this renders HAYOT's honest
 * empty state — no fabricated entries, no fake volume.
 *
 * It reads the real accessors so that the moment a genuine entry is
 * published, this stops being the empty state on its own; the full
 * composition still replaces this component in Increment 2+.
 */

import { useMemo } from 'react';
import { getFeaturedEntry, getStreamEntries } from '@/lib/journey/content';
import { useT } from '@/lib/i18n/LanguageContext';
import { Band, BODY, DISPLAY, Eyebrow, GoldRule, NAVY, NAVY_64 } from './shared';

const EN = {
  eyebrow: 'HAYOT',
  headline: 'The living side of TALIMOON is being written here.',
  body: 'Visits, small moments, conversations and what comes next — the real life around TALIMOON. The first pages are on their way.',
  soon: 'Opening soon',
};

const UZ: typeof EN = {
  eyebrow: 'HAYOT',
  headline: 'TALIMOON hayoti shu yerda yozila boshlaydi.',
  body: "Tashriflar, kichik lahzalar, suhbatlar va oldinda nima borligi — TALIMOON atrofidagi haqiqiy hayot. Ilk sahifalar tez orada.",
  soon: 'Tez orada ochiladi',
};

export function JourneyFoundation() {
  const t = useT(EN, UZ);

  // Wired to the real data layer now; still an empty seed in V1.
  const hasContent = useMemo(
    () => getFeaturedEntry() !== null || getStreamEntries().total > 0,
    [],
  );

  return (
    <Band
      labelledBy="journey-heading"
      className="pt-28 pb-32 md:pt-40 md:pb-44"
    >
      <div className="mx-auto max-w-[640px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <GoldRule className="mt-4" />

        <h1
          id="journey-heading"
          className="mt-8 text-[30px] sm:text-[36px] md:text-[44px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
          }}
        >
          {t.headline}
        </h1>

        <p
          className="mx-auto mt-6 max-w-[52ch] text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
        >
          {t.body}
        </p>

        {!hasContent && (
          <p
            className="mt-10 text-[12px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: NAVY_64,
            }}
          >
            {t.soon}
          </p>
        )}
      </div>
    </Band>
  );
}

export default JourneyFoundation;
