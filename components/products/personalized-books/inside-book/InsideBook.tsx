"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
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
 * - The image is now wrapped in the SAME two-layer structure as
 *   BookShowcase, not just a matching outer aspect box:
 *     outer:  relative mx-auto aspect-[3/4] w-full max-w-md
 *     inner:  relative h-full w-full overflow-hidden rounded-sm
 *             shadow-[0_20px_50px_rgba(42,36,29,0.18)]
 *   Matching only the outer box wasn't enough — BookShowcase also
 *   uses object-cover inside a clipped inner card, while this file
 *   used object-contain directly on the outer box. object-contain
 *   shrinks a landscape photo to fit inside a portrait frame with
 *   empty matting above/below, so even with identical outer
 *   dimensions the photo itself rendered visibly smaller than
 *   BookShowcase's cover. Switching to the same inner-card +
 *   object-cover pattern makes both photos fill their identical
 *   boxes edge-to-edge, so the two now read as the same size.
 * - Trade-off (by design, matches BookShowcase's own approach):
 *   object-cover on a landscape photo inside a portrait box crops
 *   the left/right edges of the room in the background; the book
 *   itself stays centered and fully visible. If the cropped edges
 *   are ever unwanted, object-contain is the fix, but then the two
 *   sections stop matching in visual size — the two can't both be
 *   true at once given the source photo's aspect ratio.
 * - sizes updated to 448px (matches BookShowcase's max-w-md at
 *   desktop) instead of a vw-based value.
 * - unoptimized kept: source is an Inkscape-exported SVG, same
 *   reasoning as Trust Strip / BookShowcase.
 */

interface StoryElement {
  key: string;
  title: string;
  description: string;
}

const STORY_ICONS: Record<string, ReactNode> = {
  hero: (
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
  values: (
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
  illustrations: (
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
  interactive: (
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
  ending: (
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
};

const STORY_ELEMENTS_EN: StoryElement[] = [
  {
    key: "hero",
    title: "Personalized Hero",
    description: "Your child becomes the main character of their own story.",
  },
  {
    key: "values",
    title: "Positive Values",
    description: "Gentle themes of kindness, courage and curiosity.",
  },
  {
    key: "illustrations",
    title: "Beautiful Illustrations",
    description: "Original artwork drawn to match your child's story.",
  },
  {
    key: "interactive",
    title: "Interactive Moments",
    description: "Small choices and prompts that invite them into the page.",
  },
  {
    key: "ending",
    title: "Meaningful Ending",
    description: "A closing page that leaves a lasting feeling behind.",
  },
];

const STORY_ELEMENTS_UZ: StoryElement[] = [
  {
    key: "hero",
    title: "Shaxsiylashtirilgan qahramon",
    description: "Farzandingiz o'z hikoyasining bosh qahramoniga aylanadi.",
  },
  {
    key: "values",
    title: "Ijobiy qadriyatlar",
    description: "Mehribonlik, jasorat va qiziquvchanlikning nozik mavzulari.",
  },
  {
    key: "illustrations",
    title: "Go'zal illyustratsiyalar",
    description: "Farzandingizning hikoyasiga mos original san'at asari.",
  },
  {
    key: "interactive",
    title: "Interaktiv lahzalar",
    description: "Ularni sahifaga taklif etuvchi kichik tanlovlar va ishoralar.",
  },
  {
    key: "ending",
    title: "Ma'noli yakun",
    description: "Uzoq vaqt his-tuyg'u qoldiradigan yakunlovchi sahifa.",
  },
];

const COPY_EN = {
  heading: "What Your Child Will Discover",
  description:
    "Each page invites them deeper into a world built entirely around who they are — playful, warm, and quietly meaningful.",
  imageAlt: "Open TALIMOON personalized storybook",
};

const COPY_UZ: typeof COPY_EN = {
  heading: "Farzandingiz nimalarni kashf etadi",
  description:
    "Har bir sahifa ularni butunlay o'zlariga mos qurilgan olamga chuqurroq taklif etadi — o'yinqaroq, iliq va sokin ma'noli.",
  imageAlt: "Ochiq TALIMOON shaxsiylashtirilgan hikoya kitobi",
};

export default function InsideBook() {
  const t = useT(COPY_EN, COPY_UZ);
  const storyElements = useT(STORY_ELEMENTS_EN, STORY_ELEMENTS_UZ);

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
            {t.heading}
          </h2>
          <p className="mt-5 font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            {t.description}
          </p>

          <ul className="mt-12 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
            {storyElements.map((element) => (
              <li key={element.key} className="flex items-start gap-5 py-6">
                <span className="mt-0.5 text-[var(--text-primary,#2A241D)]">
                  {STORY_ICONS[element.key]}
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

        <div>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
            <div className="relative h-full w-full overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(42,36,29,0.18)]">
              <Image
                src="/images/inside-book/talimoon-open-book.svg"
                alt={t.imageAlt}
                fill
                priority
                unoptimized
                sizes="(min-width:1024px) 448px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
