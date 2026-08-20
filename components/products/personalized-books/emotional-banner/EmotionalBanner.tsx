"use client";

import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  heading: "Every Child Deserves a Story They Can Call Their Own.",
  paragraph:
    "A story written for one child alone — their name, their courage, their small victories, bound into a book they will keep for the rest of their life.",
  cta: "Begin the Story",
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Har bir bola o'ziniki deb ataydigan hikoyaga loyiqdir.",
  paragraph:
    "Faqat bitta bola uchun yozilgan hikoya — uning ismi, jasorati, kichik g'alabalari — umr bo'yi saqlaydigan kitobga jamlangan.",
  cta: "Hikoyani boshlash",
};

/**
 * EmotionalBanner — now a Client Component (was a server component
 * before): needs `useT` (a Context hook) for translated copy.
 */
export default function EmotionalBanner() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="emotional-banner-heading"
      className="relative bg-[var(--surface-contrast,#1C2A3A)] py-28 sm:py-40 lg:py-56"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-9 lg:col-start-2">
            <div
              aria-hidden="true"
              className="mb-10 h-px w-14 bg-[var(--accent-primary,#B8935B)]/40 sm:mb-14 sm:w-16 lg:mb-16"
            />
            <h2
              id="emotional-banner-heading"
              className="text-balance font-serif text-[2.5rem] font-normal leading-[1.15] tracking-tight text-[var(--text-inverse,#F7F3EC)] sm:text-6xl sm:leading-[1.1] lg:text-7xl lg:leading-[1.08]"
            >
              {t.heading}
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 lg:mt-20">
          <div className="lg:col-span-6 lg:col-start-6">
            <p className="text-pretty font-sans text-lg leading-relaxed text-[var(--text-inverse-muted,rgba(247,243,236,0.7))] sm:text-xl sm:leading-relaxed">
              {t.paragraph}
            </p>

            <div className="mt-10 sm:mt-12">
              <a href="#pricing" className="inline-block border-b border-transparent pb-1 font-sans text-sm uppercase tracking-[0.25em] text-[var(--text-inverse,#F7F3EC)]/90 transition-colors duration-300 hover:border-[var(--accent-primary,#B8935B)]/60 hover:text-[var(--accent-primary,#B8935B)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary,#B8935B)]">
                {t.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
