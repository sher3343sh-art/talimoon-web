/**
 * Examples — TALIMOON
 * ----------------------------------------------------------------
 * "Examples" section for the homepage, sitting after "How It Works".
 * Its one job: make a parent think "this could be my child's book" —
 * through one emotionally dominant featured story, not a gallery of
 * equal tiles.
 *
 * Server Component: no "use client", no hooks. All motion here is
 * plain CSS (:hover / :focus-visible + transition), so nothing
 * requires client-side JS — same philosophy as TrustStrip.tsx.
 *
 * Structure (unchanged since v2, per this pass's own instructions):
 *   1. Intro (eyebrow / headline / supporting copy)
 *   2. A one-line emotional hook, quieter than the headline
 *   3. FEATURED STORY — standalone block, ~60/40 image/caption split
 *      on desktop, its own CTA
 *   4. SECONDARY STORIES — three genuinely equal, quieter cards
 *   5. Closing bridge into "Inside the Book"
 *
 * v3 — premium polish pass (same structure, same tokens, same copy
 * *shape*, no new colors, no carousel/slider, nothing decorative):
 * - Book presentation: swapped the single hard-edged drop shadow for
 *   a two-layer shadow (a tight, soft near shadow + a large, faint
 *   ambient one). One shadow reads as "object sitting on a surface";
 *   two layered like this reads as "resting just above the surface"
 *   — the "soft floating" quality of a printed book on a light table,
 *   not a product photo. Radius eased in slightly (24px → 18px
 *   featured, 20px → 16px secondary) — less "app tile," more "printed
 *   cover."
 * - Rhythm: opened up the gaps that do the most work — before the
 *   featured block, between its image and caption, and between its
 *   description and CTA — while leaving tighter gaps (name→age,
 *   description→name) alone, so the spacing itself reads as a
 *   deliberate hierarchy rather than uniform padding.
 * - Typography: dropped the "•" between name and age (it read as a
 *   spec-sheet bullet, not editorial copy) in favor of plain spacing
 *   + a lighter weight/color on the age, and tightened the featured
 *   description's measure slightly for a calmer line length.
 * - CTA: was a plain text-plus-arrow link; now combines a scale-based
 *   underline reveal (smoother than animating width), a small
 *   letter-spacing increase, and an opacity lift on the arrow, all on
 *   the same 300ms ease-out as everything else — several very quiet
 *   signals together, rather than one louder one.
 * - Secondary stories: still exactly three, still equal in size —
 *   only the *middle* card is offset a few extra pixels lower on
 *   desktop. That one small asymmetry is enough to read as an
 *   editorial arrangement instead of a product grid, without
 *   rotating or dramatically staggering anything.
 * - Background: still --surface-warm-100, unchanged as a color — a
 *   very faint radial highlight (white at low opacity, fading out
 *   well before the fold) sits behind the content on a decorative,
 *   aria-hidden layer. It's a lighting cue, not a new surface color.
 * - Storytelling hook: one short, original line between the intro
 *   and the featured story, in a smaller italic serif so it never
 *   competes with the headline — sets a mood before the first book
 *   appears.
 * - Ending: rewritten (original copy, not a restatement of the
 *   brief's own examples) to pull toward the next section instead of
 *   just asking a question.
 *
 * Consistency with the existing system (Navbar.tsx, TrustStrip.tsx):
 * - Same 1440px / 64px-side-padding container as Navbar, Hero and
 *   TrustStrip.
 * - Headline in font-serif, eyebrow in the small-caps/tracked
 *   treatment already used above the Hero headline, body copy in
 *   font-sans + --text-secondary.
 * - Every focus ring and every CTA reuses
 *   var(--accent-primary,#B5764B) — the same token already used for
 *   Navbar's link focus state.
 * - Left-aligned throughout — the same "content is never centered"
 *   rule TrustStrip's own comments call out.
 *
 * Interaction:
 * - On hover/focus: the cover lifts a touch with a deeper two-layer
 *   shadow, and — separately — the photo itself zooms very subtly
 *   inside its fixed, rounded frame (700ms on the featured cover,
 *   500ms on secondary — slightly slower on the piece meant to carry
 *   the most weight). Hover and keyboard focus trigger the exact same
 *   state throughout.
 * - Each card (featured and secondary alike) is one focusable <a>
 *   wrapping the whole cover + caption — a single, honest hit
 *   target.
 * - Real routing isn't wired up yet — hrefs use a /examples/[slug]
 *   placeholder convention for the team to connect to real pages.
 *
 * Content:
 * - Names, ages and descriptions are placeholder sample data for the
 *   content team to replace with real examples/photography.
 */

import type { ReactNode } from "react";
import Image from "next/image";

interface FeaturedBook {
  slug: string;
  childName: string;
  age: number;
  description: string;
  cover: string;
  coverAlt: string;
}

interface SecondaryBook {
  slug: string;
  childName: string;
  age: number;
  sentence: string;
  cover: string;
  coverAlt: string;
}

// Placeholder sample data — content team to swap in real book covers,
// names and descriptions before launch.
const FEATURED_BOOK: FeaturedBook = {
  slug: "yusuf",
  childName: "Yusuf",
  age: 6,
  description:
    "A story about courage, kindness and discovering his own strengths.",
  cover: "/images/examples/yusuf-cover.webp",
  coverAlt:
    "Cover of a personalised TALIMOON storybook featuring Yusuf as the hero of his own adventure",
};

const SECONDARY_BOOKS: SecondaryBook[] = [
  {
    slug: "amira",
    childName: "Amira",
    age: 5,
    sentence: "A gentle tale of friendship, wonder and finding her voice.",
    cover: "/images/examples/amira-cover.webp",
    coverAlt:
      "Cover of a personalised TALIMOON storybook featuring Amira exploring a world of wonder",
  },
  {
    slug: "leo",
    childName: "Leo",
    age: 7,
    sentence:
      "An adventure of bravery, curiosity and a journey through the stars.",
    cover: "/images/examples/leo-cover.webp",
    coverAlt:
      "Cover of a personalised TALIMOON storybook featuring Leo on a starlit adventure",
  },
  {
    slug: "sofia",
    childName: "Sofia",
    age: 4,
    sentence:
      "A warm story about kindness, imagination and believing in herself.",
    cover: "/images/examples/sofia-cover.webp",
    coverAlt:
      "Cover of a personalised TALIMOON storybook featuring Sofia as the story's gentle-hearted hero",
  },
];

/**
 * Small text+arrow CTA, shared by the featured and secondary cards.
 * Expects to sit inside a `group` (the enclosing <a>) so its
 * underline, letter-spacing and arrow can all animate on hover/focus
 * without any state of its own.
 */
function StoryLink({
  children,
  size = "default",
}: {
  children: ReactNode;
  size?: "default" | "small";
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 font-sans font-medium tracking-normal text-[var(--accent-primary,#B5764B)]",
        "transition-[letter-spacing] duration-300 ease-out group-hover:tracking-[0.015em] group-focus-visible:tracking-[0.015em]",
        size === "small" ? "text-sm" : "text-base",
      ].join(" ")}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
      <span
        aria-hidden="true"
        className="opacity-70 transition-[transform,opacity] duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100"
      >
        →
      </span>
    </span>
  );
}

export function Examples() {
  return (
    <section
      aria-labelledby="examples-heading"
      className="relative w-full bg-[var(--surface-warm-100,#F7F2EA)] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32"
    >
      {/* Decorative lighting cue only — not a new surface color, just
          a very faint highlight on top of the existing warm tone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(255,255,255,0.5),transparent_60%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* Eyebrow + headline + supporting copy */}
        <div className="max-w-[640px]">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary,#49433C)]">
            Examples
          </p>
          <h2
            id="examples-heading"
            className="mt-4 font-serif text-4xl leading-[1.1] text-[var(--text-primary,#2A241D)] sm:text-5xl"
          >
            Every Child Has Their Own Story.
          </h2>
          <p className="mt-6 font-sans text-lg leading-relaxed text-[var(--text-secondary,#49433C)]">
            Explore a few personalised books created with the same love,
            craftsmanship and imagination that will go into your child&apos;s
            story.
          </p>
        </div>

        {/* Emotional hook — quieter than the headline, sets the mood
            before the first book appears. */}
        <p className="mt-14 max-w-[640px] font-serif text-xl italic leading-snug text-[var(--text-secondary,#49433C)] lg:mt-16">
          Every book begins the same way — with a name.
        </p>

        {/* Featured story — standalone, the emotional centre of the section */}
        <a
          href={`/examples/${FEATURED_BOOK.slug}`}
          aria-label={`Explore ${FEATURED_BOOK.childName}'s personalised TALIMOON story`}
          className="group mt-16 block rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary,#B5764B)] lg:mt-20 lg:grid lg:grid-cols-5 lg:items-center lg:gap-x-20"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-white shadow-[0_2px_10px_-4px_rgba(42,36,29,0.16),0_45px_70px_-32px_rgba(42,36,29,0.32)] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_4px_14px_-4px_rgba(42,36,29,0.2),0_55px_85px_-30px_rgba(42,36,29,0.38)] group-focus-visible:-translate-y-1 group-focus-visible:shadow-[0_4px_14px_-4px_rgba(42,36,29,0.2),0_55px_85px_-30px_rgba(42,36,29,0.38)] lg:col-span-3">
            <Image
              src={FEATURED_BOOK.cover}
              alt={FEATURED_BOOK.coverAlt}
              fill
              sizes="(min-width: 1024px) 760px, 90vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
            />
          </div>

          <div className="mt-10 lg:col-span-2 lg:mt-0">
            <h3 className="font-serif text-2xl text-[var(--text-primary,#2A241D)]">
              {FEATURED_BOOK.childName}
              <span className="ml-3 font-sans text-base font-normal text-[var(--text-secondary,#49433C)]">
                Age {FEATURED_BOOK.age}
              </span>
            </h3>
            <p className="mt-6 max-w-[38ch] font-sans text-lg leading-[1.7] text-[var(--text-secondary,#49433C)]">
              {FEATURED_BOOK.description}
            </p>
            <div className="mt-9">
              <StoryLink>Explore This Story</StoryLink>
            </div>
          </div>
        </a>

        {/* Secondary stories — genuinely equal, deliberately quieter.
            The middle card sits a little lower on desktop only — one
            small, restrained asymmetry, not a stagger. */}
        <ul className="mt-24 grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-3 lg:mt-28">
          {SECONDARY_BOOKS.map((book, index) => (
            <li key={book.slug} className={index === 1 ? "md:mt-10" : undefined}>
              <a
                href={`/examples/${book.slug}`}
                aria-label={`View ${book.childName}'s personalised TALIMOON story`}
                className="group block rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary,#B5764B)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px] bg-white shadow-[0_1px_6px_-2px_rgba(42,36,29,0.14),0_28px_44px_-24px_rgba(42,36,29,0.28)] transition-[transform,box-shadow] duration-400 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_2px_8px_-2px_rgba(42,36,29,0.18),0_34px_52px_-22px_rgba(42,36,29,0.32)] group-focus-visible:-translate-y-1 group-focus-visible:shadow-[0_2px_8px_-2px_rgba(42,36,29,0.18),0_34px_52px_-22px_rgba(42,36,29,0.32)]">
                  <Image
                    src={book.cover}
                    alt={book.coverAlt}
                    fill
                    sizes="(min-width: 768px) 340px, 90vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                  />
                </div>

                <div className="mt-6">
                  <h4 className="font-serif text-lg text-[var(--text-primary,#2A241D)]">
                    {book.childName}
                    <span className="ml-2.5 font-sans text-sm font-normal text-[var(--text-secondary,#49433C)]">
                      Age {book.age}
                    </span>
                  </h4>
                  <p className="mt-2.5 max-w-[32ch] font-sans text-sm leading-relaxed text-[var(--text-secondary,#49433C)]">
                    {book.sentence}
                  </p>
                  <div className="mt-3.5">
                    <StoryLink size="small">View Story</StoryLink>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Closing bridge into the next ("Inside the Book") section */}
        <div className="mt-24 lg:mt-32">
          <p className="font-serif text-2xl text-[var(--text-primary,#2A241D)]">
            The cover is just the beginning.
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mt-4 h-5 w-5 text-[var(--text-secondary,#49433C)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 8.25l7.5 7.5 7.5-7.5"
            />
          </svg>
          <p className="mt-4 font-sans text-sm text-[var(--text-secondary,#49433C)]">
            Step inside to see where the story goes.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Examples;
