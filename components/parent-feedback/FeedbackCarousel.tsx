"use client";

/**
 * FeedbackCarousel — the approved parent-feedback carousel.
 * ----------------------------------------------------------------
 * Centre-focused: one elevated centre card, flanked by up to two
 * tiers of smaller/more-faded side cards when there are enough
 * comments to fill them (near tier at ≥ 3, far tier at ≥ 5). With
 * fewer comments it degrades cleanly — 2 comments show just centre +
 * nav, 1 shows a single card with no nav.
 *
 * Each card owns its reaction state via the reaction store keyed by
 * the stable `feedback.id`, so moving through the carousel never
 * resets a selected reaction or a count. Cards are keyed by `id`.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FeedbackCard } from "./FeedbackCard";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";
import type { ParentFeedback } from "@/lib/parent-feedback/feedback";

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 rtl:rotate-180"
    >
      <path d={direction === "prev" ? "M15 5.5 8.5 12l6.5 6.5" : "M9 5.5 15.5 12 9 18.5"} />
    </svg>
  );
}

export function FeedbackCarousel({ feedback }: { feedback: ParentFeedback[] }) {
  const { copy } = useFeedbackCopy();
  const count = feedback.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const wrap = (index: number) => ((index % count) + count) % count;
  const active = feedback[wrap(activeIndex)];
  const showNear = count >= 3;
  const showFar = count >= 5;
  const showNav = count >= 2;

  const nearLeft = feedback[wrap(activeIndex - 1)];
  const nearRight = feedback[wrap(activeIndex + 1)];
  const farLeft = feedback[wrap(activeIndex - 2)];
  const farRight = feedback[wrap(activeIndex + 2)];

  function goTo(index: number) {
    setActiveIndex(wrap(index));
  }

  return (
    <div className="relative mx-auto max-w-[1320px]">
      {showNav ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={copy.prev}
            className="absolute start-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)] shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)] md:flex md:h-11 md:w-11 ltr:-translate-x-1/2 rtl:translate-x-1/2"
          >
            <ChevronIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={copy.next}
            className="absolute end-0 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)] shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)] md:flex md:h-11 md:w-11 ltr:translate-x-1/2 rtl:-translate-x-1/2"
          >
            <ChevronIcon direction="next" />
          </button>
        </>
      ) : null}

      <div className="flex items-center justify-center overflow-hidden">
        {showFar ? (
          <div className="hidden w-[168px] shrink-0 -mr-12 scale-[0.76] opacity-40 xl:block">
            <FeedbackCard feedback={farLeft} size="sm" />
          </div>
        ) : null}

        {showNear ? (
          <div className="hidden w-[220px] shrink-0 -mr-12 scale-[0.88] opacity-70 md:block">
            <FeedbackCard feedback={nearLeft} size="sm" />
          </div>
        ) : null}

        <div className="z-10 w-full max-w-[480px] shrink-0 px-4 md:px-0">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeedbackCard feedback={active} size="lg" />
            </motion.div>
          </AnimatePresence>
        </div>

        {showNear ? (
          <div className="hidden w-[220px] shrink-0 -ml-12 scale-[0.88] opacity-70 md:block">
            <FeedbackCard feedback={nearRight} size="sm" />
          </div>
        ) : null}

        {showFar ? (
          <div className="hidden w-[168px] shrink-0 -ml-12 scale-[0.76] opacity-40 xl:block">
            <FeedbackCard feedback={farRight} size="sm" />
          </div>
        ) : null}
      </div>

      {showNav ? (
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label={copy.carouselNav}
        >
          {feedback.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === wrap(activeIndex)}
              aria-label={copy.showFrom(item.displayName)}
              onClick={() => goTo(index)}
              className={[
                "h-2 w-2 rounded-full transition-[background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]",
                index === wrap(activeIndex)
                  ? "scale-125 bg-[var(--text-primary,#2A241D)]"
                  : "bg-[var(--border-default,rgba(42,36,29,0.14))] hover:bg-[var(--text-muted,#8B8578)]",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FeedbackCarousel;
