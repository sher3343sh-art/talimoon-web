'use client';

/**
 * About 01 — HERO.  Emotional entry into TALIMOON's worldview.
 * Not a sales hero: no CTA. The right column carries the prepared
 * editorial artwork — "the inner world of a child" — rendered from
 * `about-hero-world.webp` (transparent PNG source, converted for the
 * web) so it melts into the cream page. It replaces the earlier
 * inline line-art SVG.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, NAVY, NAVY_64, Eyebrow, Section } from './shared';

const EN = {
  eyebrow: 'About TALIMOON',
  headline: 'A whole world lives inside every child.',
  body: 'TALIMOON is being built to make stories, books and experiences that leave a mark on a child’s imagination, knowledge and heart.',
  artAlt:
    'A child sits looking toward faint story fragments — a book, a distant arch, stars and a small world — rising and dissolving into light.',
};
const UZ: typeof EN = {
  eyebrow: 'TALIMOON HAQIDA',
  headline: 'Har bir bolaning ichida bir olam bor.',
  body: "TALIMOON bolalarning tasavvuri, bilimi va qalbida iz qoldiradigan hikoyalar, kitoblar va tajribalar yaratish uchun qurilmoqda.",
  artAlt:
    "Bola o'tirib, xayolidagi hikoya bo'laklariga — kitob, uzoqdagi ravoq, yulduzlar va kichik bir olamga qarab turibdi; ular yorug'lik ichida erib ketmoqda.",
};

export function AboutHero() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-hero-heading" className="pt-20 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16" railInset>
      <div className="grid items-center gap-10 md:gap-10 lg:grid-cols-[1fr_minmax(0,564px)] lg:gap-14 xl:grid-cols-[1fr_minmax(0,496px)] xl:gap-10">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[620px]"
        >
          <Eyebrow align="start">{t.eyebrow}</Eyebrow>
          <h1
            id="about-hero-heading"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
            className="mt-4 text-[34px] sm:text-[42px] md:text-[52px] lg:text-[56px] xl:text-[50px]"
          >
            {t.headline}
          </h1>
          <p
            style={{
              fontFamily: BODY,
              fontWeight: 400,
              color: NAVY_64,
              lineHeight: 1.7,
            }}
            className="mt-6 text-[16px] md:mt-7 md:text-[18px]"
          >
            {t.body}
          </p>
        </motion.div>

        {/* The hero artwork is the LCP element and must be visible on the
            first paint — it is intentionally NOT gated behind a JS mount
            animation (a stuck opacity:0 was hiding it in production). */}
        <div className="mx-auto w-full max-w-[600px] lg:mx-0 lg:max-w-none">
          <Image
            src="/images/about/about-hero-world.webp"
            alt={t.artAlt}
            width={1536}
            height={1024}
            quality={100}
            priority
            sizes="(max-width: 1024px) 92vw, (max-width: 1280px) 564px, 496px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </Section>
  );
}

export default AboutHero;
