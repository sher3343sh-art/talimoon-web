"use client";

import { MaskedImage } from "@/components/ui/MaskedImage";
import { useT } from "@/lib/i18n/LanguageContext";

interface Step {
  key: string;
  title: string;
  sentence: string;
  alt: string;
  /** Populate once the photography is ready; MaskedImage renders its placeholder until then. */
  image?: string;
}

const STEPS_EN: Step[] = [
  {
    key: "introduce",
    title: "You introduce them to us",
    sentence: "Their name, age, interests, dreams, personality — and photos.",
    alt: "A parent filling in details and photos about their child",
    image: "/images/how-it-works/step-1-family-details.svg",
  },
  {
    key: "what-to-support",
    title: "You tell us what you want to support",
    sentence:
      "For example: patience, courage, responsibility, kindness, confidence, manners, gratitude.",
    alt: "A parent choosing which quality a story should quietly support",
    // ASSET SLOT — no illustration for "choosing a value to support" yet;
    // MaskedImage renders its placeholder until one is supplied.
  },
  {
    key: "into-story",
    title: "We turn it into a story",
    sentence:
      "Not as direct commands — through the hero's own experience, choices, challenges and their consequences.",
    alt: "An illustrator shaping a personalized story around a child",
    image: "/images/how-it-works/step-2-create-story.svg",
  },
  {
    key: "own-book",
    title: "Their own book comes into the world",
    sentence:
      "The personalized story becomes a real, printed book and reaches your family.",
    alt: "A finished personalized storybook, printed and ready for the family",
    image: "/images/how-it-works/step-3-printed-with-care.svg",
  },
];

const STEPS_UZ: Step[] = [
  {
    key: "introduce",
    title: "Siz bizga uni tanishtirasiz",
    sentence: "Uning ismi, yoshi, qiziqishlari, orzulari, xarakteri — va suratlari.",
    alt: "Ota-ona farzandi haqida ma'lumot va suratlarni to'ldirmoqda",
    image: "/images/how-it-works/step-1-family-details.svg",
  },
  {
    key: "what-to-support",
    title: "Siz nimani qo‘llab-quvvatlamoqchi ekaningizni aytasiz",
    sentence:
      "Masalan: sabr, jasorat, mas’uliyat, mehribonlik, o‘ziga ishonch, odob, shukr.",
    alt: "Ota-ona hikoya qo‘llab-quvvatlaydigan jihatni tanlamoqda",
  },
  {
    key: "into-story",
    title: "Biz bularni hikoyaga aylantiramiz",
    sentence:
      "To‘g‘ridan-to‘g‘ri buyruq shaklida emas — qahramonning o‘z tajribasi, tanlovlari, sinovlari va ularning oqibatlari orqali.",
    alt: "Rassom bola atrofida shaxsiylashtirilgan hikoyani shakllantirmoqda",
    image: "/images/how-it-works/step-2-create-story.svg",
  },
  {
    key: "own-book",
    title: "Uning o‘z kitobi dunyoga keladi",
    sentence:
      "Shaxsiylashtirilgan hikoya haqiqiy, chop etilgan kitobga aylanadi va oilangizga yetib keladi.",
    alt: "Tayyor shaxsiylashtirilgan hikoya kitobi, chop etilgan va oilaga tayyor",
    image: "/images/how-it-works/step-3-printed-with-care.svg",
  },
];

const COPY_EN = {
  eyebrow: "The Process",
  heading: "You know them. We build their story.",
  description:
    "How does a book actually become specific to one child? Four steps — you supply the child and the intent, we do the storytelling.",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}: `,
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Jarayon",
  heading: "Siz uni taniysiz. Biz uning hikoyasini yaratamiz.",
  description:
    "Kitob qanday qilib aynan bitta bolaga xos bo‘ladi? To‘rt qadam — Siz bolani va maqsadni berasiz, hikoya qismini biz bajaramiz.",
  stepOf: (n: number, total: number) => `${n}-qadam, jami ${total}: `,
};

export function HowItWorks() {
  const t = useT(COPY_EN, COPY_UZ);
  const STEPS = useT(STEPS_EN, STEPS_UZ);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
            {t.eyebrow}
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-serif text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[2.75rem]"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[1.0625rem] leading-[1.65] text-[var(--text-secondary,#49433C)] md:text-[1.125rem]">
            {t.description}
          </p>
        </div>

        <div className="relative mt-10 md:mt-12 lg:mt-16">
          {/* Atmosphere, not decoration: a single hairline, barely
              there, felt more than seen. Positioned in the gap below
              the illustrations (lg:h-[216px] tall) rather than
              crossing through them — it reads as continuity between
              the photos, never as a mark on top of one. Confined to
              lg: where the row is a single line and a connector reads
              correctly; on narrower layouts the stacked cards already
              imply sequence on their own. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[172px] hidden h-px bg-[var(--text-primary,#2A241D)]/[0.06] lg:block"
          />

          <ol className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-x-10">
            {STEPS.map((step, idx) => (
              <li
                key={step.key}
                className="flex flex-col items-center text-center"
              >
                <span className="sr-only">
                  {t.stepOf(idx + 1, STEPS.length)}
                </span>

                <MaskedImage
                  src={step.image}
                  alt={step.alt}
                  sizes="(min-width: 1024px) 216px, (min-width: 768px) 192px, 168px"
                  className="h-[118px] w-[168px] md:h-[136px] md:w-[192px] lg:h-[152px] lg:w-[216px]"
                />

                <h3 className="mt-8 font-serif text-[1.375rem] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--text-primary,#2A241D)] md:mt-9 lg:mt-10">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-[26ch] font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                  {step.sentence}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
