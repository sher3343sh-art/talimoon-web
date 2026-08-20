"use client";

/**
 * PartnersPreview — TALIMOON home page ("Trusted Partners")
 * ----------------------------------------------------------------
 * Now a Client Component (was a server component before): needs
 * `useT` (a Context hook) for translated copy.
 * ----------------------------------------------------------------
 * A compact, deliberately unfinished-feeling-NOT reserved space
 * before the Footer — not a real partners page, just three "Coming
 * Soon" placeholder cards so the section reads as intentional rather
 * than empty. Server component: no state, no motion, matching the
 * BookShowcase/InsideBook/Examples convention (see
 * [[project-real-talimoon-moments]] for why that's the more
 * established pattern in this codebase) — this section's own brief
 * also explicitly asks for "no unnecessary animation," so skipping
 * the whileInView entrance treatment other sections use is
 * intentional here, not an oversight.
 *
 * Height budget is tight by design (180–220px desktop / 160–190
 * tablet / 140–170 mobile per the brief) — every size/spacing value
 * below was chosen and measured against that, not the more generous
 * rhythm used by the flagship sections above it.
 */

import { PartnerCard, type Partner } from "./PartnerCard";
import { useT } from "@/lib/i18n/LanguageContext";

const PARTNERS: Partner[] = [
  { id: "partner-1" },
  { id: "partner-2" },
  { id: "partner-3" },
];

const COPY_EN = {
  eyebrow: "Trusted Partners",
  heading: "Growing Together",
  description:
    "Future collaborations with educational institutions, publishers and family-focused organizations will appear here.",
  reservedSlots: "Reserved partner slots",
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Ishonchli hamkorlar",
  heading: "Birgalikda o'sib boramiz",
  description:
    "Bu yerda ta'lim muassasalari, nashriyotlar va oilaviy tashkilotlar bilan kelajakdagi hamkorliklar joylashadi.",
  reservedSlots: "Zaxiradagi hamkor o'rinlari",
};

export function PartnersPreview() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="partners-heading"
      className="relative w-full overflow-hidden bg-[var(--surface-warm-100,#F7F2EA)] py-4 md:py-5 lg:py-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="text-center">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            {t.eyebrow}
          </p>
          <h2
            id="partners-heading"
            className="mt-1.5 font-serif text-[1.125rem] font-medium leading-[1.2] tracking-[-0.005em] text-[var(--text-primary,#2A241D)] lg:text-[1.375rem]"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-1.5 max-w-[340px] font-sans text-[0.6875rem] leading-[1.35] text-[var(--text-secondary,#49433C)] md:max-w-[720px] md:text-[0.75rem] lg:max-w-[900px] lg:text-[0.8125rem]">
            {t.description}
          </p>
        </div>

        <ul
          className="mx-auto mt-2 flex max-w-[720px] list-none items-center justify-start gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:gap-4 sm:overflow-visible lg:mt-4"
          aria-label={t.reservedSlots}
        >
          {PARTNERS.map((partner) => (
            <li key={partner.id}>
              <PartnerCard partner={partner} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PartnersPreview;
