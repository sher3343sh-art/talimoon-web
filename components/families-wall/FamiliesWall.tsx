"use client";

/**
 * FamiliesWall — TALIMOON home page ("TALIMOON Families Wall")
 * ----------------------------------------------------------------
 * Rebuilt 2026-08-08 to reproduce a supplied reference design 1:1
 * (public/images/home/mmm.png) — this is an implementation task, not
 * a redesign: layout, proportions, copy, and exact reaction numbers
 * all come directly from that reference, not invented. Section order:
 * eyebrow → heading → description → submission card → approval note
 * → "Featured Stories" label → 3-card carousel → reaction summary →
 * "View all family stories" link.
 *
 * The reference has large sepia family-illustration decorations in
 * all four corners. Per explicit instruction those are NOT built yet
 * — `DecorationSlot` below reserves the exact empty containers for
 * when real image assets are supplied, with no gradient/illustration
 * placeholder of any kind in the meantime.
 *
 * Same convention-2 typography/container as RealTalimoonMoments and
 * Examples (font-serif/font-sans + literal rem sizes, max-w-[1440px],
 * var(--token,fallback) colors, `#F7F2EA` background) — see
 * [[project-real-talimoon-moments]] and [[project-story-library-preview]]
 * for why this codebase has two coexisting typography conventions and
 * why sections in this cluster follow the more established one, and
 * why the background hex must match neighboring sections exactly.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { StorySubmissionCard } from "./StorySubmissionCard";
import { SectionOrnament } from "./SectionOrnament";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { ReactionSummary } from "./ReactionSummary";
import type { FamilyStory } from "./FamilyCard";

const STORIES: FamilyStory[] = [
  {
    id: "azizbek",
    quote: "He finally enjoyed reading.",
    name: "Azizbek's Father",
    reactions: { smile: 512, love: 301, touched: 74 },
  },
  {
    id: "madina",
    quote: "My daughter asked me to read it three times before sleeping.",
    name: "Madina's Mother",
    reactions: { smile: 428, love: 192, touched: 66 },
  },
  {
    id: "dilnoza",
    quote: "The personalized story made our little one so happy.",
    name: "Dilnoza",
    reactions: { smile: 387, love: 156, touched: 49 },
  },
];

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Empty reserved slot for a future corner illustration — no content, no styling beyond size/position, per explicit instruction. */
function DecorationSlot({ corner }: { corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const position = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0",
    "bottom-left": "left-0 bottom-0",
    "bottom-right": "right-0 bottom-0",
  }[corner];

  return (
    <div
      aria-hidden="true"
      data-decoration={corner}
      className={["pointer-events-none absolute hidden h-[320px] w-[360px] xl:block", position].join(" ")}
    />
  );
}

export function FamiliesWall() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="families-wall-heading"
      className="relative w-full overflow-hidden bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionReveal}
    >
      <DecorationSlot corner="top-left" />
      <DecorationSlot corner="top-right" />
      <DecorationSlot corner="bottom-left" />
      <DecorationSlot corner="bottom-right" />

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            What Families Are Saying
          </p>
          <SectionOrnament />
          <h2
            id="families-wall-heading"
            className="mt-4 font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            Every Story Leaves a Smile.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            Real moments shared by families who created memories with{" "}
            <span className="text-[var(--accent-primary,#B5764B)]">TALIMOON</span>.
          </p>
        </div>

        <div className="mt-12 lg:mt-14">
          <StorySubmissionCard />
        </div>

        <div className="mt-16 text-center lg:mt-20">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            Featured Stories
          </p>
          <SectionOrnament size="small" />
        </div>

        <div className="mt-10">
          <TestimonialCarousel stories={STORIES} />
        </div>

        <div className="mt-12 lg:mt-14">
          <ReactionSummary />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/story-library"
            className="inline-flex items-center gap-1.5 font-sans text-[0.9375rem] font-semibold text-[var(--accent-primary,#B5764B)] transition-opacity duration-200 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary,#B5764B)]"
          >
            View all family stories
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}

export default FamiliesWall;
