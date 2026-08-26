"use client";

/**
 * StoryLibraryPreview — TALIMOON home page
 * ----------------------------------------------------------------
 * Now a Client Component (was a server component before): needs
 * `useT` (a Context hook) for translated copy.
 * ----------------------------------------------------------------
 * A preview, not the library: this section exists only to make a
 * visitor curious enough to click through to /story-library. It
 * must never grow bookshelves, book grids, filters, or search — that
 * interface belongs to the dedicated page. See
 * components/story-library-preview/StoryLibraryIllustration.tsx for
 * the production artwork and its scroll-triggered animation.
 *
 * Design system: no new colors, fonts, radii, or shadows — every
 * token here already exists in globals.css.
 *
 * Background color note (2026-08-08): originally the brief's exact
 * #F8F5EF. Changed to #F7F2EA — the same literal Examples.tsx already
 * uses for its section background (`--surface-warm-100`, itself
 * undefined as a real token, just a Tailwind arbitrary-value fallback)
 * — because the 1–3‑unit RGB gap between the two was rendering as a
 * crisp, full-width horizontal seam at the section boundary (a Mach-
 * band effect: adjacent near-identical flat colors read as a hard
 * edge even though neither color alone looks like a line). Matching
 * Examples exactly removes the seam. If Examples' color ever changes,
 * this one should follow it.
 */

import Link from "next/link";
import { StoryLibraryIllustration } from "./StoryLibraryIllustration";
import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  eyebrow: "Story Library",
  heading: "Where Every Story Comes Alive.",
  description:
    "Step into a growing collection of gentle, meaningful tales — each one crafted to spark imagination and nurture character, one page at a time.",
  cta: "Explore Story Library",
  stats: [
    { value: "250+", label: "Stories" },
    { value: "6", label: "Categories" },
    { value: "Updated", label: "Weekly" },
  ],
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Hikoyalar kutubxonasi",
  heading: "Har bir hikoya jonlanadigan joy.",
  description:
    "Nozik va ma'noli hikoyalarning tobora boyib boruvchi to'plamiga qadam qo'ying — har biri xayolotni uyg'otish va xarakterni tarbiyalash uchun, sahifama-sahifa yaratilgan.",
  cta: "Hikoyalar kutubxonasini ko'rish",
  stats: [
    { value: "250+", label: "Hikoyalar" },
    { value: "6", label: "Toifalar" },
    { value: "Yangilanadi", label: "har hafta" },
  ],
};

export function StoryLibraryPreview() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="story-library-preview-heading"
      className="relative w-full overflow-hidden bg-surface-base px-6 py-16 sm:px-8 lg:px-16 lg:py-20"
    >
      {/* Background atmosphere — paper grain only. The shelf-silhouette
          lines from the first pass were dropped: against the new
          photographic-style artwork they read as a stray leftover
          pattern rather than atmosphere, and the brief for this pass is
          explicit that the background must never compete with the PNG. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto grid max-w-[var(--container-content)] grid-cols-1 items-center gap-y-12 lg:grid-cols-5 lg:gap-x-16">
        {/* Text column — ≈40% on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-2">
          <p className="text-label font-sans font-semibold uppercase text-accent-primary">
            {t.eyebrow}
          </p>
          <h2
            id="story-library-preview-heading"
            className="mt-3 font-display text-heading text-text-primary"
          >
            {t.heading}
          </h2>
          <p className="mt-4 max-w-[42ch] text-body text-text-secondary">
            {t.description}
          </p>

          <dl className="mt-8 flex items-center gap-6 sm:gap-8">
            {t.stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
                {i > 0 && (
                  <span aria-hidden="true" className="h-8 w-px bg-border-subtle" />
                )}
                <div className="flex flex-col">
                  <dt className="order-2 mt-1 text-label text-text-muted">
                    {stat.label}
                  </dt>
                  <dd className="order-1 font-display text-title text-text-primary">
                    {stat.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <Link
            href="/story-library"
            className="tm-cta-gold mt-12 inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap px-4 text-[13px] font-medium tracking-[0.015em]"
          >
            {t.cta}
          </Link>
        </div>

        {/* Illustration column — ≈60% on desktop, first on mobile/tablet.
            A small top offset (lg only) settles the artwork slightly below
            center so its visual weight lines up with the heading/CTA
            cluster rather than the eyebrow at the very top of the column. */}
        <div className="order-1 lg:order-2 lg:col-span-3 lg:pt-8">
          <StoryLibraryIllustration />
        </div>
      </div>
    </section>
  );
}

export default StoryLibraryPreview;
