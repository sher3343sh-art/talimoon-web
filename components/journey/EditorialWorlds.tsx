'use client';

/**
 * HAYOT — the three editorial worlds (V2, landing section B).
 * ----------------------------------------------------------------
 * A magazine contents page, not three SaaS cards: a numbered list,
 * large faint numerals in gold, world names in Cormorant navy, one
 * quiet line each, a restrained link into the world's landing. When
 * a world has no content yet its link reads "tez orada" instead of
 * a count — the structure stays established, nothing is faked.
 *
 * The worlds are `talimoon-life` (TALIMOON HAYOTI), `parents`
 * (OTA-ONALAR UCHUN) and `wisdom-science` (HIKMAT ORTIDAGI ILM).
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { getWorldCounts } from '@/lib/journey/content';
import { JOURNEY_WORLDS } from '@/lib/journey/types';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';
import {
  Band,
  BODY,
  DISPLAY,
  GOLD,
  NAVY,
  NAVY_48,
  NAVY_64,
  Reveal,
  Rise,
  WORLD_NAME,
  worldPath,
} from './shared';

const EN = { eyebrow: 'Three worlds', open: 'Open', soon: 'Coming soon', count: (n: number) => `${n} ${n === 1 ? 'piece' : 'pieces'}` };
const UZ: typeof EN = {
  eyebrow: 'Uch olam',
  open: 'Ochish',
  soon: 'Tez orada',
  count: (n: number) => `${n} ta yozuv`,
};

export function EditorialWorlds() {
  const { language } = useLanguage();
  const t = useT(EN, UZ);
  const counts = useMemo(() => getWorldCounts(), []);

  return (
    <Band
      labelledBy="journey-worlds-heading"
      className="border-t border-[#1c2a3a17] py-16 md:py-24"
    >
      <Reveal amount={0.12}>
        <Rise>
          <h2
            id="journey-worlds-heading"
            className="text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.26em',
              color: GOLD,
            }}
          >
            {t.eyebrow}
          </h2>
        </Rise>

        <ol className="mt-10 md:mt-14">
          {JOURNEY_WORLDS.map((world, i) => {
            const n = counts[world];
            const name =
              language === 'UZ' ? WORLD_NAME[world].uz : WORLD_NAME[world].en;
            const blurb =
              language === 'UZ'
                ? WORLD_NAME[world].blurbUz
                : WORLD_NAME[world].blurbEn;
            return (
              <li
                key={world}
                className={
                  i === 0
                    ? ''
                    : 'mt-12 border-t border-[#1c2a3a14] pt-12 md:mt-16 md:pt-16'
                }
              >
                <Rise>
                  <Link
                    href={worldPath(world)}
                    className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-6 md:gap-x-12"
                  >
                    <span
                      aria-hidden="true"
                      className="text-[34px] md:text-[46px] lg:text-[52px]"
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 600,
                        color: GOLD,
                        opacity: 0.4,
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="max-w-[640px]">
                      <p
                        className="text-[24px] sm:text-[28px] md:text-[34px] lg:text-[38px]"
                        style={{
                          fontFamily: DISPLAY,
                          fontWeight: 600,
                          color: NAVY,
                          lineHeight: 1.12,
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {name}
                      </p>
                      <p
                        className="mt-3 text-[15px] md:text-[16px]"
                        style={{
                          fontFamily: BODY,
                          color: NAVY_64,
                          lineHeight: 1.7,
                        }}
                      >
                        {blurb}
                      </p>
                      <p
                        className="mt-5 inline-flex items-center gap-2 text-[13px] uppercase"
                        style={{
                          fontFamily: BODY,
                          fontWeight: 600,
                          letterSpacing: '0.16em',
                          color: n > 0 ? NAVY : NAVY_48,
                        }}
                      >
                        <span>{n > 0 ? t.open : t.soon}</span>
                        {n > 0 ? (
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            style={{ color: GOLD }}
                          >
                            &rarr;
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </Link>
                </Rise>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </Band>
  );
}

export default EditorialWorlds;
