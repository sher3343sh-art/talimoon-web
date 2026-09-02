"use client";

/**
 * ParentRecognition — Personalized Books Sales V2, chapter 02.
 * ----------------------------------------------------------------
 * Replaces the old desktop-only TrustStrip (four abstract value
 * cards: "Personalized / Beautifully Illustrated / Safe / A Gift").
 * Parents don't experience parenting as category labels — they
 * experience the same specific situations, on repeat, at home. This
 * section names those situations so the visitor thinks "ha, bizda
 * ham aynan shunday" — without ever labelling the child (no "lazy",
 * "selfish", "spoiled"): every line describes a BEHAVIOUR IN A
 * SITUATION, never the child's identity.
 *
 * Fully responsive (the strip it replaces had no mobile layout):
 * one column on mobile, two on lg. Calm editorial rhythm — a quoted
 * observation, then a quieter supporting question beneath it — not a
 * grid of identical cards. This is the intimate beat of the page.
 */

import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

interface Situation {
  /** What a parent might catch themselves saying or noticing. */
  said: string;
  /** A quieter question that widens it — never a diagnosis. */
  support: string;
}

const COPY_EN = {
  eyebrow: "Familiar moments",
  heading: "Sometimes saying it once — or many times — isn't enough.",
  support:
    "You explain what's right. You remind them. Sometimes you explain again. They hear you. And still, in certain moments, it all comes back around.",
  situations: [
    {
      said: "They hear me, and then do the same thing anyway.",
      support:
        "They know what they were told — but in the moment, acting on it is hard?",
    },
    {
      said: "If it doesn't go their way, everything falls apart.",
      support:
        "Waiting, hearing “no”, or holding a big feeling is still hard for them?",
    },
    {
      said: "They decide they can't, and stop before trying.",
      support:
        "Afraid of getting it wrong, they back away from something new — or from trying again?",
    },
    {
      said: "It only happens if I ask.",
      support:
        "Tidying up, homework, finishing what they started — does it always need your reminder?",
    },
    {
      said: "What they want comes before everyone else.",
      support:
        "Sharing, waiting for a turn, noticing how someone else feels — still hard?",
    },
    {
      said: "They know right from wrong. In the moment, they forget it.",
      support:
        "You'd like the manners, honesty, gratitude and kindness you're passing on to show up in their everyday choices too?",
    },
  ] satisfies Situation[],
  closing:
    "None of this makes a child “a problem.” It's ordinary. It's also the part of raising them that repeats — and the part a story can meet differently.",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Tanish lahzalar",
  heading: "Ba’zan bir gapni qayta-qayta aytishning o‘zi yetmaydi.",
  support:
    "Farzandingizga yaxshilikni tushuntirasiz. Eslatasiz. Ba’zan yana tushuntirasiz. U ham eshitadi. Lekin ayrim vaziyatlarda hammasi yana takrorlanadi.",
  situations: [
    {
      said: "Gapimni eshitadi, lekin yana o‘sha ishni qiladi.",
      support:
        "Aytilgan narsani bilsa ham, vaziyat kelganda unga amal qilish qiyin bo‘ladimi?",
    },
    {
      said: "Xohlagani bo‘lmasa, hammasi buziladi.",
      support:
        "Kutish, rad javobini qabul qilish yoki hissiyotini boshqarish unga qiyin tushadimi?",
    },
    {
      said: "Qila olmayman, deb urinmasdan qo‘yadi.",
      support:
        "Xato qilishdan qo‘rqib, yangi narsaga kirishishdan yoki yana urinib ko‘rishdan chekinadimi?",
    },
    {
      said: "Faqat aytsam qiladi.",
      support:
        "Yig‘ishtirish, vazifasini bajarish yoki boshlagan ishini tugatishda doim Sizning eslatishingiz kerakmi?",
    },
    {
      said: "O‘zi xohlagan narsani boshqalardan ustun qo‘yadi.",
      support:
        "Bo‘lishish, navbat kutish yoki boshqalarning hislarini hisobga olish hali qiyinmi?",
    },
    {
      said: "Yaxshi-yomonni biladi. Lekin tanlov paytida unutib qo‘yadi.",
      support:
        "Siz singdirmoqchi bo‘lgan odob, rostgo‘ylik, shukr yoki mehr uning kundalik tanlovlarida ham ko‘rinishini istaysizmi?",
    },
  ] satisfies Situation[],
  closing:
    "Bularning hech biri bolani “muammoli” qilmaydi. Bu oddiy hol. Shu bilan birga, bu tarbiyaning takrorlanadigan qismi — va hikoya uni boshqacha yo‘l bilan yeta oladigan qismi.",
};

export default function ParentRecognition() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="w-full bg-[var(--surface-warm-200,#EFE7DA)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-28">
        <Reveal className="max-w-[560px]">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
            {t.eyebrow}
          </p>
          <h2
            id="recognition-heading"
            className="mt-3 font-serif text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.125rem] md:text-[2.5rem]"
          >
            {t.heading}
          </h2>
          <p className="mt-5 max-w-[46ch] font-sans text-[1.0625rem] leading-[1.7] text-[var(--text-secondary,#49433C)] md:text-[1.125rem]">
            {t.support}
          </p>
        </Reveal>

        <ul className="mt-11 grid grid-cols-1 gap-x-14 gap-y-0 md:mt-14 lg:grid-cols-2">
          {t.situations.map((s, i) => (
            <Reveal
              as="li"
              key={i}
              delay={(i % 2) * 70}
              className="border-t border-[var(--text-primary,#2A241D)]/[0.10] py-6 first:border-t-0 md:py-7 lg:[&:nth-child(2)]:border-t-0"
            >
              <p className="font-serif text-[1.1875rem] font-medium leading-[1.4] text-[var(--text-primary,#2A241D)] md:text-[1.3125rem]">
                &ldquo;{s.said}&rdquo;
              </p>
              <p className="mt-2.5 max-w-[42ch] font-sans text-[0.9375rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
                {s.support}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 max-w-[52ch] md:mt-16">
          <p className="font-sans text-[0.9375rem] leading-[1.7] text-[var(--text-tertiary,#726C65)]">
            {t.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
