'use client';

/**
 * About 07 — THE PEOPLE BEHIND TALIMOON.
 * ----------------------------------------------------------------
 * Not a corporate "Our Team" page — TALIMOON is a founder-led, closely
 * built creative company, and this section says so through composition
 * rather than a caption. Sherzodbek gets the larger, primary editorial
 * treatment (his portrait and words lead); Oybek gets a real, dignified
 * secondary treatment — smaller, never diminished. No skill tags, no
 * social badges, no fake stats, no org-chart aesthetic.
 *
 * The two real portraits live at
 * `/public/images/about/sherzodbek-yunusov-founder.webp` (founder,
 * native ~2:3) and `/public/images/about/oybek-ubaydullayev-operations.webp`
 * (partner, native ~4:5). `PersonFrame` renders each at its native
 * aspect ratio so nothing is cropped; without a `src` it falls back to
 * an honest composed frame that never stands in for a real likeness.
 */

import React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY, GOLD, GOLD_SOFT, NAVY, NAVY_64, NAVY_48, Eyebrow, Section, SPACE_MAJOR } from './shared';

const EASE = [0.22, 1, 0.36, 1] as const;

const EN = {
  eyebrow: 'The people behind TALIMOON',
  headline: 'Now, meet the people building it.',
  founder: {
    name: 'Sherzodbek Yunusov',
    title: 'Founder of TALIMOON',
    body: 'He shapes TALIMOON’s core concept, story world, product direction, design and digital experience as one coherent vision, and leads the project’s creative and technical development.',
    reflection:
      'He thinks less about what a story should tell a child, and more about what a child feels — and which values they carry away in their heart.',
    alt: 'Sherzodbek Yunusov, founder of TALIMOON.',
  },
  partner: {
    name: 'Oybek Ubaydullayev',
    role: 'Operations & Customer Experience',
    body: 'Part of TALIMOON since its earliest days — he helped the first book reach the children as a printed copy, and played an important role in choosing the TALIMOON name. Today he coordinates printing, orders, customer communication, sales and delivery.',
    alt: 'Oybek Ubaydullayev.',
  },
  today:
    'Today TALIMOON is still small, built by a team close to it. Sherzodbek leads the creative, product and digital direction; Oybek coordinates the practical side, from printing to customer communication and delivery.',
};

const UZ: typeof EN = {
  eyebrow: 'TALIMOON ORTIDAGI INSONLAR',
  headline: 'Endi uning ortidagi insonlar bilan tanishing.',
  founder: {
    name: 'Sherzodbek Yunusov',
    title: 'TALIMOON asoschisi',
    body: "TALIMOONning asosiy konsepsiyasi, hikoya dunyosi, mahsulot yo'nalishlari, dizayni va raqamli tajribasini bir butun qarash atrofida shakllantiradi. Loyihaning ijodiy va texnologik rivojlanishini boshqaradi.",
    reflection:
      "U faqat bolaga nima aytish kerakligini emas, bola hikoyadan nimani his qilib, qanday qadriyatni qalbida olib ketishini ko'proq o'ylaydi.",
    alt: 'Sherzodbek Yunusov, TALIMOON asoschisi.',
  },
  partner: {
    name: 'Oybek Ubaydullayev',
    role: 'Operatsion boshqaruv va mijozlar tajribasi',
    body: "TALIMOONning ilk kunlaridan beri loyiha yonida. Birinchi kitobning chop etilib bolalarga yetib borishida yordam bergan va TALIMOON nomining tanlanishida muhim rol o'ynagan. Bugun chop etish jarayonlari, buyurtmalar, mijozlar bilan aloqa, sotuv va yetkazib berish ishlarini muvofiqlashtiradi.",
    alt: 'Oybek Ubaydullayev.',
  },
  today:
    "Bugun TALIMOON hali kichik va unga juda yaqin jamoa tomonidan qurilmoqda. Sherzodbek ijodiy, mahsulot va raqamli yo'nalishni boshqaradi; Oybek esa chop etishdan tortib mijoz bilan muloqot va yetkazib berishgacha bo'lgan amaliy jarayonlarni muvofiqlashtiradi.",
};

/** Honest portrait slot — a real photo when `src` is set (rendered at
 *  its native `ratio` so the prepared composition never crops),
 *  otherwise a composed frame that never stands in for a real likeness. */
function PersonFrame({
  src,
  alt,
  size = 'large',
  ratio,
}: {
  src?: string;
  alt: string;
  size?: 'large' | 'medium';
  ratio?: string;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: src && ratio ? ratio : size === 'large' ? '4 / 5' : '1 / 1',
        background: '#FDFBF7',
        border: `1px solid ${GOLD_SOFT}`,
        borderRadius: 2,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={100}
          sizes={size === 'large' ? '(max-width: 1024px) 88vw, 340px' : '(max-width: 1024px) 82vw, 340px'}
          className="object-cover"
        />
      ) : (
        <>
          <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5" style={{ borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}` }} />
          <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5" style={{ borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}` }} />
        </>
      )}
    </div>
  );
}

// The real portraits (native aspect ratios kept so nothing crops):
//   founder — sherzodbek-yunusov-founder.webp  1023 × 1537 (~2:3)
//   partner — oybek-ubaydullayev-operations.webp 1122 × 1402 (~4:5)
const PORTRAITS = {
  founder: '/images/about/sherzodbek-yunusov-founder.webp',
  partner: '/images/about/oybek-ubaydullayev-operations.webp',
} as const;
const FOUNDER_RATIO = '1023 / 1537';
const PARTNER_RATIO = '1122 / 1402';

const RU: typeof EN = {
  eyebrow: 'Люди, стоящие за TALIMOON',
  headline: 'А теперь познакомьтесь с людьми, которые его создают.',
  founder: {
    name: 'Шерзодбек Юнусов',
    title: 'Основатель TALIMOON',
    body: 'Он формирует ключевую концепцию TALIMOON, мир историй, направление продуктов, дизайн и цифровой опыт как единое целостное видение, а также руководит творческим и техническим развитием проекта.',
    reflection:
      'Его больше волнует не то, что история должна сказать ребёнку, а то, что ребёнок при этом чувствует и какие ценности остаются в его сердце.',
    alt: 'Шерзодбек Юнусов, основатель TALIMOON.',
  },
  partner: {
    name: 'Ойбек Убайдуллаев',
    role: 'Операционное управление и работа с клиентами',
    body: 'Он рядом с TALIMOON с самых первых дней: помог напечатать первую книгу и передать её детям, а также сыграл важную роль в выборе названия TALIMOON. Сегодня он координирует печать, заказы, общение с клиентами, продажи и доставку.',
    alt: 'Ойбек Убайдуллаев.',
  },
  today:
    'Сегодня TALIMOON остаётся небольшой командой людей, которые по-настоящему близки к проекту. Шерзодбек отвечает за творческое, продуктовое и цифровое направление, а Ойбек координирует практическую сторону: от печати до общения с клиентами и доставки.',
};

export function AboutPeople() {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();

  return (
    <Section labelledBy="about-people-heading" className={SPACE_MAJOR} tone="raised" railInset>
      <div className="mx-auto max-w-[640px] text-center">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <motion.h2
          id="about-people-heading"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-4 text-[26px] sm:text-[32px] md:text-[38px]"
          style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.18, letterSpacing: '-0.015em' }}
        >
          {t.headline}
        </motion.h2>
      </div>

      {/* Founder — the larger, primary editorial treatment */}
      <div className="mt-10 grid items-center gap-10 md:mt-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 22 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto w-full max-w-[340px] lg:mx-0"
        >
          <PersonFrame src={PORTRAITS.founder} alt={t.founder.alt} size="large" ratio={FOUNDER_RATIO} />
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="max-w-[560px]"
        >
          <h3 className="text-[24px] md:text-[30px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>
            {t.founder.name}
          </h3>
          <p className="mt-1.5 text-[13px] uppercase" style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.14em', color: GOLD }}>
            {t.founder.title}
          </p>
          <p className="mt-6 text-[16px] md:text-[17px]" style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}>
            {t.founder.body}
          </p>
          <p
            className="mt-5 text-[15px] italic md:text-[16px]"
            style={{ fontFamily: DISPLAY, fontWeight: 500, color: NAVY_48, lineHeight: 1.6 }}
          >
            {t.founder.reflection}
          </p>
        </motion.div>
      </div>

      {/* A quiet hairline between the two — different weight, same respect */}
      <div className="mx-auto my-10 h-px w-full max-w-[1000px] md:my-12" style={{ background: 'rgba(28,42,58,0.10)' }} />

      {/* Partner — a real, dignified secondary treatment. The portrait
          footprint grew again here so Oybek reads as a real person with
          presence — still clearly secondary to the founder's taller lead
          portrait (2:3 vs. 4:5, so the founder stays visually dominant). */}
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:mx-0 lg:max-w-[340px]"
        >
          <PersonFrame src={PORTRAITS.partner} alt={t.partner.alt} size="medium" ratio={PARTNER_RATIO} />
        </motion.div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          className="max-w-[560px]"
        >
          <h3 className="text-[20px] md:text-[24px]" style={{ fontFamily: DISPLAY, fontWeight: 600, color: NAVY, lineHeight: 1.2 }}>
            {t.partner.name}
          </h3>
          <p className="mt-1.5 text-[13px] uppercase" style={{ fontFamily: BODY, fontWeight: 600, letterSpacing: '0.14em', color: GOLD }}>
            {t.partner.role}
          </p>
          <p className="mt-5 text-[15.5px] md:text-[16.5px]" style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}>
            {t.partner.body}
          </p>
        </motion.div>
      </div>

      {/* Today's TALIMOON — small, direct, no apology for being small */}
      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 14 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto mt-10 max-w-[620px] text-center text-[14.5px] md:mt-12 md:text-[15px]"
        style={{ fontFamily: BODY, color: NAVY_48, lineHeight: 1.75 }}
      >
        {t.today}
      </motion.p>
    </Section>
  );
}

export default AboutPeople;
