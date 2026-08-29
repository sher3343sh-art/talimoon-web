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
    "Real TALIMOON family stories, shared with permission, alongside the continuing world of Yusuf & Yasmina.",
  cta: "Explore Story Library",
  // No engagement metrics here: the library is small and curated, and
  // the home page must not imply a scale it doesn't have. Two calm
  // lines about the two worlds do the work instead.
  worlds: [
    "Family stories",
    "Yusuf & Yasmina",
  ],
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Hikoyalar kutubxonasi",
  heading: "Har bir hikoya jonlanadigan joy.",
  description:
    "Haqiqiy TALIMOON oila hikoyalari — ruxsat bilan baham ko'rilgan — va Yusuf va Yasmina olamining davomi.",
  cta: "Hikoyalar kutubxonasini ko'rish",
  worlds: [
    "Oila hikoyalari",
    "Yusuf va Yasmina",
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
          <p className="text-[17px] font-sans font-semibold uppercase tracking-[0.22em] text-accent-primary">
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

          <ul className="mt-8 flex items-center gap-4 text-label text-text-muted">
            {t.worlds.map((world, i) => (
              <li key={world} className="flex items-center gap-4">
                {i > 0 && (
                  <span aria-hidden="true" className="h-4 w-px bg-border-subtle" />
                )}
                <span className="uppercase">{world}</span>
              </li>
            ))}
          </ul>

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
