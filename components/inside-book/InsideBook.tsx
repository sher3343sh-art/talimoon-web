import type { ReactNode } from "react";
import Image from "next/image";
/**
 * InsideBook — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 *
 * Consistency with the locked Hero / Navbar / Trust Strip / How It
 * Works / BookShowcase system:
 * - Container: max-w-[1440px] with the same responsive side padding
 *   (px-5 / md:px-10 / lg:px-16) and section padding
 *   (py-16 / md:py-20 / lg:py-28) as BookShowcase — replaces the
 *   previous one-off max-w-6xl/px-6/py-28.
 * - Colors: all stone-based text, background, ring and divider utilities
 *   utility replaced with the existing semantic tokens
 *   (--text-primary, --text-secondary, --text-tertiary,
 *   --border-default, --border-subtle). Each original shade's
 *   relative weight is preserved exactly — stone-200 instances map
 *   to --border-subtle, stone-300 instances (the stronger tone: main
 *   mockup outline, center spine divider) map to --border-default —
 *   so the mockup's internal visual hierarchy is untouched, only the
 *   literal color values are now tokens instead of hardcoded stone.
 * - The story-element list (icon + title + description, repeated)
 *   is the same pattern BookShowcase already established for its
 *   feature list; typography here now matches it exactly (icon
 *   color, title size/weight, description size/line-height) rather
 *   than using a second, slightly different treatment for the same
 *   UI pattern.
 * - The text-first / mockup-second column order is preserved as-is
 *   (the reverse of BookShowcase's mockup-first order) — this is an
 *   intentional alternating left/right rhythm between the two
 *   sections, not something to "fix" into matching column order.
 *
 * Responsive: single column on mobile and tablet, two columns at
 * `lg` (1024px+) — same breakpoint as BookShowcase, preserving the
 * desktop composition while collapsing gracefully below it.
 *
 * Right column now renders the real photograph (previously a
 * skeleton/placeholder mockup) via next/image, replacing the old
 * grid-skeleton + icon placeholder entirely.
 *
 * Size-parity fix (this version):
 * - The image container previously used its own bespoke sizing
 *   (max-w-[900px] lg:max-w-[1000px] aspect-[16/10], plus a
 *   scale-110 crop hack) that had nothing in common with
 *   BookShowcase's box. That meant the two sections could never
 *   read as the same system, and depending on viewport the two
 *   images landed at very different rendered sizes.
 * - Container classes are now IDENTICAL to BookShowcase's:
 *   `relative mx-auto w-full max-w-md aspect-[3/4]`. Same width cap,
 *   same aspect ratio, same centering — so at every breakpoint this
 *   box is pixel-for-pixel the same size as BookShowcase's.
 * - scale-110 removed — it was cropping the image against its own
 *   frame to fake a tighter fit; not needed now that the box itself
 *   is sized deliberately rather than being backed into.
 * - object-contain kept (not object-cover): the source photo is
 *   landscape while the shared box is portrait, so contain keeps the
 *   whole photograph visible, uncropped and undistorted, centered in
 *   the box with matting above/below rather than losing its left/
 *   right edges. Switch to object-cover only if a full-bleed fill is
 *   preferred over showing the complete photo.
 * - sizes updated to 50vw (matches BookShowcase, since the box is
 *   now the same max-width) so the browser requests the right
 *   resolution at each breakpoint.
 * - unoptimized kept: source is an Inkscape-exported SVG, same
 *   reasoning as Trust Strip / BookShowcase.
 */

interface StoryElement {
  title: string;
  description: string;
  icon: ReactNode;
}

const STORY_ELEMENTS: StoryElement[] = [
  {
    title: "Personalized Hero",
    description: "Your child becomes the main character of their own story.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      </svg>
    ),
  },
  {
    title: "Positive Values",
    description: "Gentle themes of kindness, courage and curiosity.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M12 19.5S3.5 14.6 3.5 8.9C3.5 6.2 5.6 4 8.3 4c1.4 0 2.7.6 3.7 1.9C13 4.6 14.3 4 15.7 4c2.7 0 4.8 2.2 4.8 4.9 0 5.7-8.5 10.6-8.5 10.6Z" />
      </svg>
    ),
  },
  {
    title: "Beautiful Illustrations",
    description: "Original artwork drawn to match your child's story.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <rect x="3.5" y="4.5" width="17" height="15" rx="1" />
        <circle cx="9" cy="9.5" r="1.5" />
        <path d="M4 17.5 9 12l3 3 3.5-4 4.5 6.5" />
      </svg>
    ),
  },
  {
    title: "Interactive Moments",
    description: "Small choices and prompts that invite them into the page.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M9 4.5v9.2M9 4.5 6.5 7M9 4.5 11.5 7" />
        <path d="M9 13.7c0 3.2 2.6 5.8 5.8 5.8h.2a3.5 3.5 0 0 0 3.5-3.5v-3a1.7 1.7 0 0 0-3.4 0" />
      </svg>
    ),
  },
  {
    title: "Meaningful Ending",
    description: "A closing page that leaves a lasting feeling behind.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1Z" />
      </svg>
    ),
  },
];

export default function InsideBook() {
  return (
    <section
      aria-labelledby="inside-book-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16">
        <div>
          <h2
            id="inside-book-heading"
            className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            What Your Child Will Discover
          </h2>
          <p className="mt-5 font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            Each page invites them deeper into a world built entirely around
            who they are — playful, warm, and quietly meaningful.
          </p>

          <ul className="mt-12 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
            {STORY_ELEMENTS.map((element) => (
              <li key={element.title} className="flex items-start gap-5 py-6">
                <span className="mt-0.5 text-[var(--text-primary,#2A241D)]">
                  {element.icon}
                </span>
                <div>
                  <h3 className="font-serif text-[1.125rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
                    {element.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                    {element.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md aspect-[3/4]">
          <Image
            src="/images/inside-book/talimoon-open-book.svg"
            alt="Open TALIMOON personalized storybook"
            fill
            priority
            unoptimized
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.18)]"
          />
        </div>
      </div>
    </section>
  );
}
