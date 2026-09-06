'use client';

/**
 * About 10 — QUIET ENDING.
 * Restraint and negative space. A small brand mark, one line, one
 * supporting line, and two quiet text actions. No sales banner. Then
 * the page falls naturally into the existing Footer.
 */

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, NAVY, NAVY_64, Section } from './shared';

const EN = {
  mark: 'TALIMOON',
  headline: 'A good future begins in childhood.',
  support: 'We would like to be a part of it.',
  explore: 'Explore the TALIMOON world',
  contact: 'Get in touch',
};
const UZ: typeof EN = {
  mark: 'TALIMOON',
  headline: 'Yaxshi kelajak bolalikdan boshlanadi.',
  support: "Biz esa uning bir qismiga aylanishni istaymiz.",
  explore: 'TALIMOON dunyosini kashf eting',
  contact: "Biz bilan bog'laning",
};

function QuietLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls =
    'group inline-flex items-center gap-2 text-[15px] transition-opacity duration-300 hover:opacity-70';
  const style = { fontFamily: BODY, fontWeight: 600, color: NAVY, letterSpacing: '0.01em' } as const;
  const inner = (
    <>
      <span>{children}</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: GOLD }}>
        →
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} style={style}>
      {inner}
    </Link>
  );
}

const RU: typeof EN = {
  mark: 'TALIMOON',
  headline: 'Хорошее будущее начинается в детстве.',
  support: 'Мы хотели бы стать его частью.',
  explore: 'Исследовать мир TALIMOON',
  contact: 'Связаться с нами',
};

export function AboutQuietEnding() {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();

  return (
    <Section id="about-quiet-ending" labelledBy="about-end-heading" className="pt-16 pb-24 md:pt-20 md:pb-28">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[620px] text-center"
      >
        <span
          className="block text-[12px] uppercase"
          style={{ fontFamily: BODY, fontWeight: 700, letterSpacing: '0.42em', color: GOLD }}
        >
          {t.mark}
        </span>

        <h2
          id="about-end-heading"
          className="mt-10 text-[26px] sm:text-[32px] md:text-[40px]"
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            color: NAVY,
            lineHeight: 1.22,
            letterSpacing: '-0.01em',
          }}
        >
          {t.headline}
        </h2>
        <p
          className="mt-4 text-[16px] md:text-[18px]"
          style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.7 }}
        >
          {t.support}
        </p>

        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
          <QuietLink href="/#our-products">{t.explore}</QuietLink>
          <QuietLink href="https://t.me/talimoon" external>
            {t.contact}
          </QuietLink>
        </div>
      </motion.div>
    </Section>
  );
}

export default AboutQuietEnding;
