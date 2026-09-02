"use client";

/**
 * ACT 05 — TRUST · Process · Price
 * ----------------------------------------------------------------
 * The visitor already wants it — so this act is compressed: three
 * plain steps, one slim line of genuinely useful reassurance, and
 * then the real pricing/order component (unchanged) directly below.
 * No benefit-card grid, no long information block.
 *
 * `PricingSection` keeps `id="pricing"` and owns the market selector
 * + the swap into the shared order form — untouched here.
 */

import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";
import PricingSection from "../pricing/PricingSection";

const COPY_EN = {
  eyebrow: "How it comes together",
  steps: [
    { n: "01", t: "You tell us about your child", d: "A few simple questions about their world, their interests, and what matters to you." },
    { n: "02", t: "We create their story", d: "The story and the illustrations are built around your child — as the hero." },
    { n: "03", t: "Their book comes into the world", d: "You review it, it's printed with care, and it's delivered to your family." },
  ],
  trust: "Hardcover · anime-style illustration from your photos · built only from what you tell us · ready in 5–7 days",
  cta: "Begin their story →",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Qanday yakuniga yetadi",
  steps: [
    { n: "01", t: "Farzandingiz haqida aytib berasiz", d: "Uning dunyosi, qiziqishlari va Siz uchun muhim narsalar haqida bir necha oddiy savol." },
    { n: "02", t: "Biz uning hikoyasini yaratamiz", d: "Hikoya va rasmlar farzandingiz atrofida — uni bosh qahramon qilib — quriladi." },
    { n: "03", t: "Uning kitobi dunyoga keladi", d: "Siz ko‘rib chiqasiz, kitob ehtiyotkorlik bilan chop etiladi va oilangizga yetkaziladi." },
  ],
  trust: "Qattiq muqova · suratlardan anime uslubidagi illyustratsiya · faqat Siz aytgan ma’lumot asosida · 5–7 kunda tayyor",
  cta: "Uning hikoyasini boshlash →",
};

export default function ProcessPrice() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <>
      <section aria-labelledby="process-heading" className="w-full bg-[#EFE7DA]">
        <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 md:py-20 lg:py-24">
          <Reveal>
            <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t.eyebrow}
            </p>
            <h2 id="process-heading" className="sr-only">
              {t.eyebrow}
            </h2>
          </Reveal>

          <ol className="mt-8 grid gap-x-10 gap-y-8 md:mt-10 md:grid-cols-3">
            {t.steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70}>
                <span className="font-display text-[1.5rem] font-medium text-accent-primary">{s.n}</span>
                <p className="mt-2 font-display text-[1.1875rem] font-medium leading-[1.35] text-text-primary md:text-[1.3125rem]">
                  {s.t}
                </p>
                <p className="mt-2 font-sans text-[0.9375rem] leading-[1.7] text-text-secondary">{s.d}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={80} className="mt-10 border-t border-text-primary/10 pt-6 md:mt-12">
            <p className="font-sans text-[0.875rem] leading-[1.7] text-text-muted">{t.trust}</p>
            <a
              href="#pricing"
              className="mt-5 inline-flex min-h-[44px] items-center font-sans text-[0.9375rem] font-medium text-accent-primary underline decoration-accent-primary/40 decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            >
              {t.cta}
            </a>
          </Reveal>
        </div>
      </section>

      <PricingSection />
    </>
  );
}
