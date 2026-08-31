"use client";

/**
 * ParentFeedbackSection — TALIMOON home page.
 * ----------------------------------------------------------------
 * TALIMOON's parent / community feedback area. Parents leave
 * opinions, impressions, comments and suggestions ABOUT TALIMOON;
 * the carousel shows the ones moderation has APPROVED. This is not a
 * story-submission section (see [[home-ia-hayot-gateway]] for how the
 * home sections divide: Journey = TALIMOON speaks to parents · Parent
 * Feedback = parents respond · Story Library = families read stories).
 *
 * Visual direction is unchanged — centred editorial heading, feedback
 * input, moderation note, "OTA-ONALARDAN" label, selected-feedback
 * carousel, individual cards, warm cream / deep navy / restrained
 * gold. What changed in this pass: the meaning and copy (feedback,
 * not "stories"), real per-comment reactions with a dislike, and the
 * removal of the section-level aggregate reaction strip and every
 * fabricated engagement number. The carousel currently shows five
 * clearly-labelled "NAMUNA" example cards (see `PUBLISHED_FEEDBACK`)
 * so the section reads as designed; with no rows at all it falls back
 * to a restrained empty state. Neither path invents social proof.
 *
 * Same convention-2 typography/container as its neighbours
 * (font-serif/font-sans + literal rem sizes, max-w-[1440px],
 * var(--token,fallback) colours, `bg-surface-base`). Four site
 * languages authored via `useFeedbackCopy` (UZ · EN · RU · AR); RTL
 * for Arabic.
 */

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FeedbackSubmissionCard } from "./FeedbackSubmissionCard";
import { SectionOrnament } from "./SectionOrnament";
import { FeedbackCarousel } from "./FeedbackCarousel";
import { FeedbackEmptyState } from "./FeedbackEmptyState";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";
import { getPublishedFeedback } from "@/lib/parent-feedback/feedback";
import { getCount, subscribe as subscribeViews } from "@/lib/parent-feedback/views";

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Empty reserved slot for a future corner illustration — no content,
 *  no styling beyond size/position, per the original instruction. */
function DecorationSlot({
  corner,
}: {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
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

/** The quiet meta line under "OTA-ONALARDAN": the real comment count,
 *  and — once the shared counter answers — how many times the comments
 *  have been read (`/api/feedback-views`, backed by Redis). If that
 *  backend isn't configured the count stays null and only the comment
 *  total shows; never a fabricated figure. */
function FeedbackMeta({ total }: { total: number }) {
  const { copy } = useFeedbackCopy();
  const reads = useSyncExternalStore(subscribeViews, getCount, () => null);

  return (
    <p className="mt-2 font-sans text-[0.8125rem] text-[var(--text-muted,#8B8578)]">
      {copy.commentCount(total)}
      {typeof reads === "number" ? ` · ${copy.audienceCount(reads)}` : null}
    </p>
  );
}

export function ParentFeedbackSection() {
  const reducedMotion = useReducedMotion();
  const { copy, isRTL } = useFeedbackCopy();
  const feedback = getPublishedFeedback();

  return (
    <motion.section
      dir={isRTL ? "rtl" : undefined}
      aria-labelledby="parent-feedback-heading"
      className="relative w-full overflow-hidden bg-surface-base py-7 md:py-9 lg:py-10"
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
          <p className="font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            {copy.eyebrow}
          </p>
          <SectionOrnament />
          <h2
            id="parent-feedback-heading"
            className="mt-3 font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            {copy.headline}
          </h2>
          <p className="mx-auto mt-3 max-w-[46ch] font-sans text-[1.125rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
            <span className="text-[var(--accent-primary,#B5764B)]">{copy.brand}</span>
            {copy.supporting}
          </p>
        </div>

        <div className="mt-5 lg:mt-6">
          <FeedbackSubmissionCard />
        </div>

        <div className="mt-6 text-center lg:mt-7">
          <p className="font-sans text-[16px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            {copy.fromParents}
          </p>
          <SectionOrnament size="small" />
          {feedback.length > 0 ? <FeedbackMeta total={feedback.length} /> : null}
        </div>

        <div className="mt-5">
          {feedback.length > 0 ? (
            <FeedbackCarousel feedback={feedback} />
          ) : (
            <FeedbackEmptyState />
          )}
        </div>
      </div>
    </motion.section>
  );
}

export default ParentFeedbackSection;
