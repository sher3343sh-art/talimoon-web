import type { ReactNode } from "react";
import Image from "next/image";

/**
 * BookShowcase — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 *
 * Consistency with the locked Hero / Navbar / Trust Strip / How It
 * Works system:
 * - Container: max-w-[1440px] with the same responsive side padding
 *   (px-5 / md:px-10 / lg:px-16) used by Hero and the refactored
 *   HowItWorks — replaces the previous one-off max-w-6xl/px-6.
 * - Colors: all text, background, ring and divider color utilities now use semantic design tokens.
 *   utility has been replaced with the semantic tokens already used
 *   elsewhere (--text-primary, --text-secondary, --text-tertiary,
 *   --border-default, --border-subtle). No new colors introduced —
 *   --border-default and --border-subtle are the same two tokens
 *   introduced in the HowItWorks refactor, reused here rather than
 *   duplicated.
 * - Typography: serif headings now use font-medium and -0.01em
 *   tracking, matching every other heading in the project (this file
 *   previously used font-normal / tracking-tight, which didn't match
 *   any sibling). Sizes are expressed as the same rem-bracket values
 *   used throughout Hero/TrustStrip/HowItWorks rather than Tailwind's
 *   default type scale, so the authoring convention is consistent
 *   project-wide. Two sizes were aligned to an equivalent content
 *   role elsewhere rather than left as unrelated one-off values —
 *   both are called out explicitly in the changelog.
 * - The icon + title + sentence list item is the same pattern Trust
 *   Strip already established; its typography now matches Trust
 *   Strip's exactly (icon color, sentence size/line-height) instead
 *   of using a second, slightly different treatment for the same UI
 *   pattern.
 *
 * Responsive: single column (mobile/tablet), two columns at `lg`
 * (1024px+) — preserves the desktop composition (mockup left,
 * content right) while collapsing gracefully below it, per "every
 * component must be fully responsive."
 *
 * Fix pass (this version):
 * - The left column previously rendered a hardcoded placeholder —
 *   two offset "stacked page" ghost boxes, a divider line, and a
 *   single serif "T" character standing in for the book cover. It's
 *   replaced here with the real photograph via next/image, filling
 *   the same aspect-[3/4] frame. The two ghost boxes are kept (they
 *   read as pages peeking out from behind the cover, a real part of
 *   the visual design) but the inner box now clips a real image
 *   instead of showing a divider + letter.
 * - unoptimized is set on the Image because the source is an
 *   Inkscape-exported SVG — same reasoning as the SVG fix already
 *   applied in TrustStrip.
 */

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "Beautiful Hardcover",
    description: "Crafted to become a keepsake for years.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M4 5.5C4 4.67 4.67 4 5.5 4H18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5.5a1.5 1.5 0 0 1-1.5-1.5v-13Z" />
        <path d="M4 18.5C4 17.67 4.67 17 5.5 17H19" />
      </svg>
    ),
  },
  {
    title: "Personalized Story",
    description: "Every page is written specifically for your child.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M4 20.5 14.5 10a1.5 1.5 0 0 0 0-2.12l-.38-.38a1.5 1.5 0 0 0-2.12 0L1.5 18l-1 3 3-1Z" />
        <path d="M12 5.5 16.5 10" />
      </svg>
    ),
  },
  {
    title: "Premium Illustrations",
    description: "Original artwork created for every adventure.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8.5v.01M15.5 12v.01M12 15.5v.01M8.5 12v.01" />
      </svg>
    ),
  },
  {
    title: "Made With Care",
    description: "Printed using carefully selected premium materials.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M12 20s-7.5-4.6-7.5-10.2C4.5 6.7 6.7 4.5 9.4 4.5c1.3 0 2.6.6 3.6 1.9 1-1.3 2.3-1.9 3.6-1.9 2.7 0 4.9 2.2 4.9 5.3C21.5 15.4 12 20 12 20Z" />
      </svg>
    ),
  },
];

export function BookShowcase() {
  return (
    <section
      aria-labelledby="book-showcase-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16">
        <div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
            <div className="relative h-full w-full overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(42,36,29,0.18)]">
              <Image
                src="/images/book-show-case/talimoon-show-book.svg"
                alt="The personalized TALIMOON storybook cover"
                fill
                unoptimized
                sizes="(min-width:1024px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <p className="mt-6 text-center font-sans text-[0.875rem] italic text-[var(--text-secondary,#49433C)]">
            Every story is uniquely created for one child.
          </p>
        </div>

        <div>
          <h2
            id="book-showcase-heading"
            className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            A Story Written Only For Them
          </h2>
          <p className="mt-5 font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            From the words on the page to the illustrations that bring them
            to life, every detail is created around your child alone.
          </p>

          <ul className="mt-12 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-5 py-6">
                <span className="mt-0.5 text-[var(--text-primary,#2A241D)]">
                  {feature.icon}
                </span>
                <div>
                  <h3 className="font-serif text-[1.125rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BookShowcase;
