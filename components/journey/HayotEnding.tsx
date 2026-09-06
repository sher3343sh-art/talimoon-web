'use client';

/**
 * HAYOT — the quiet ending.
 * ----------------------------------------------------------------
 * A calm editorial beat between the stream and the site Footer, so
 * the page does not fall straight from cream storytelling into the
 * Footer's darker, more commercial register. One line, generous
 * space, no CTA — the Footer's own "Order" affordance follows on
 * its own ground.
 */

import { useT } from '@/lib/i18n/LanguageContext';
import { Band, DISPLAY, GOLD, NAVY } from './shared';

const EN = { line: 'Life goes on.' };
const UZ: typeof EN = { line: 'Hayot davom etadi.' };
const RU: typeof EN = { line: 'Жизнь продолжается.' };

export function HayotEnding() {
  const t = useT(EN, UZ, RU);
  return (
    <Band className="border-t border-[#1c2a3a17] py-24 md:py-32">
      <div className="text-center">
        <span
          aria-hidden="true"
          className="mx-auto block"
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
          }}
        />
        <p
          className="mt-8 text-[24px] md:text-[30px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            letterSpacing: '-0.01em',
          }}
        >
          {t.line}
        </p>
      </div>
    </Band>
  );
}

export default HayotEnding;
