"use client";

import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  heading: "Every Child Deserves a Story They Can Call Their Own.",
  paragraph:
    "A story written for one child alone — their name, their courage, their small victories, bound into a book they will keep for the rest of their life.",
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Har bir bola o'ziniki deb ataydigan hikoyaga loyiqdir.",
  paragraph:
    "Faqat bitta bola uchun yozilgan hikoya — uning ismi, jasorati, kichik g'alabalari — umr bo'yi saqlaydigan kitobga jamlangan.",
};

/**
 * EmotionalBanner — now a Client Component (was a server component
 * before): needs `useT` (a Context hook) for translated copy.
 *
 * Light, not dark navy (2026-08 revision): this section used to be a
 * full-bleed `--surface-contrast` dark moment — the page's own
 * "final CTA," the same role the home page's Footer eventually took
 * over entirely (see Footer.tsx's own history comment: the home page
 * removed its dark EmotionalBanner-style section outright once Footer
 * itself became the dark closing note, rather than running two dark
 * sections back to back). This product page still renders its own
 * Footer right after this section, and since that Footer was recently
 * unified with the home page's real (dark navy) one, keeping this
 * section dark too stacked two navy blocks directly on top of each
 * other with only a hairline between them — reading as one oversized,
 * unintentional blue mass, not two distinct moments. Matching
 * PricingSection/InsideBook's own `bg-surface-base` here instead lets
 * Footer alone own the page's one dark beat, exactly like home. The
 * asymmetric editorial grid (heading cols 2–10, copy cols 6–11) and
 * generous whitespace are untouched — those were never the problem,
 * only the color was. Padding brought down from the old dark
 * "dramatic full-bleed ending" scale (py-28/40/56) to the standard
 * site-wide section rhythm (py-16/20/28, matching every section above
 * it) — that oversized padding was sized for being THE page's single
 * biggest moment, which is Footer's job now, not this section's.
 * No CTA button of its own (2026-08, follow-up): this section sits
 * directly above Footer with nothing in between, and Footer already
 * asks "Begin the Story" right there — a second identical button one
 * scroll-length below the first read as redundant rather than a
 * deliberate repeat-the-ask moment (unlike Navbar/Hero/here, which
 * are spaced across real content). This section's job is purely the
 * emotional close; Footer alone makes the ask.
 */
export default function EmotionalBanner() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="emotional-banner-heading"
      className="relative bg-surface-base py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-9 lg:col-start-2">
            <div aria-hidden="true" className="mb-10 h-px w-14 bg-accent-primary/40 sm:mb-14 sm:w-16 lg:mb-16" />
            <h2
              id="emotional-banner-heading"
              className="text-balance font-serif text-[2.5rem] font-normal leading-[1.15] tracking-tight text-text-primary sm:text-6xl sm:leading-[1.1] lg:text-7xl lg:leading-[1.08]"
            >
              {t.heading}
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 lg:mt-20">
          <div className="lg:col-span-6 lg:col-start-6">
            <p className="text-pretty font-sans text-lg leading-relaxed text-text-secondary sm:text-xl sm:leading-relaxed">
              {t.paragraph}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
