'use client';

/**
 * HAYOT — the OPENING when there is no real featured entry yet.
 * ----------------------------------------------------------------
 * Not a marketing hero and not a "coming soon" apology: a calm
 * statement of what HAYOT is. It sits in the same place as the real
 * opening's coverline and owns the first viewport, so when a real
 * featured story is published `TheOpening` swaps it out with no
 * visible jump. It communicates the living-memory idea quietly and
 * never pretends something happened.
 */

import { useT } from '@/lib/i18n/LanguageContext';
import { Band, BODY, DISPLAY, GOLD, NAVY, NAVY_64 } from './shared';

const EN = {
  eyebrow: 'HAYOT',
  headline: 'Where TALIMOON’s life is written down, and kept.',
  body: 'Visits, small moments, conversations, films — and what comes next. The first pages, soon.',
};
const UZ: typeof EN = {
  eyebrow: 'HAYOT',
  headline: 'TALIMOON hayoti shu yerda yozib boriladi va saqlanadi.',
  body: "Tashriflar, kichik lahzalar, suhbatlar, videolar — va oldinda nima borligi. Ilk sahifalar tez orada.",
};

export function JourneyFoundation() {
  const t = useT(EN, UZ);

  return (
    <Band
      labelledBy="journey-heading"
      className="flex min-h-[480px] flex-col justify-center py-24 md:py-28 lg:min-h-[600px] lg:py-32"
    >
      <div className="max-w-[680px]">
        <p
          className="text-[13px] uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.24em',
            color: GOLD,
          }}
        >
          {t.eyebrow}
        </p>
        <span
          aria-hidden="true"
          className="mt-5 block"
          style={{ width: 40, height: 1, backgroundColor: GOLD }}
        />

        <h1
          id="journey-heading"
          className="mt-7 text-[30px] sm:text-[36px] md:text-[42px] lg:text-[46px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}
        >
          {t.headline}
        </h1>

        <p
          className="mt-6 max-w-[46ch] text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
        >
          {t.body}
        </p>
      </div>
    </Band>
  );
}

export default JourneyFoundation;
