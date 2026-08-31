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
 * Navigation: on desktop, two round arrows sit just outside the card;
 * on mobile (where the side cards are hidden) the same arrows sit
 * either side of the dot row so touch users can still move through.
 *
 * The centre card is a plain keyed `motion.div` (remounts + plays an
 * entrance on change) — deliberately NOT `AnimatePresence mode="wait"`,
 * whose exit-complete can stall and leave the carousel stuck on one
 * comment.
 *
 * Each card owns its reaction state via the reaction store keyed by
 * the stable `feedback.id`, so moving through the carousel never
 * resets a selected reaction or a count.
 *
 * "Read" counter: once the visitor has engaged with the carousel
 * (scrolled it into view or used a control) and dwelled ~0.8s, one
 * increment is sent to the shared counter (`lib/parent-feedback/views`
 * → `/api/feedback-views`). One per page load; a returning reader
 * counts again. That feeds the "N read" figure in the section meta
 * line.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FeedbackCard } from "./FeedbackCard";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";
import type { ParentFeedback } from "@/lib/parent-feedback/feedback";
import { reportRead } from "@/lib/parent-feedback/views";

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

const NAV_BUTTON =
  "flex shrink-0 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]";

export function FeedbackCarousel({ feedback }: { feedback: ParentFeedback[] }) {
  const { copy } = useFeedbackCopy();
  const reduced = useReducedMotion();
  const count = feedback.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const wrap = useCallback(
    (index: number) => ((index % count) + count) % count,
    [count],
  );
  const active = feedback[wrap(activeIndex)];
  const showNear = count >= 3;
  const showFar = count >= 5;
  const showNav = count >= 2;

  const nearLeft = feedback[wrap(activeIndex - 1)];
  const nearRight = feedback[wrap(activeIndex + 1)];
  const farLeft = feedback[wrap(activeIndex - 2)];
  const farRight = feedback[wrap(activeIndex + 2)];

  // "Read" tracking — starts only once the visitor has engaged with
  // the carousel (it scrolled into view, or they used a control), so
  // comments far below the fold are never counted as read.
  const rootRef = useRef<HTMLDivElement>(null);
  const [engaged, setEngaged] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setEngaged(true);
      setActiveIndex(wrap(index));
    },
    [wrap],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setEngaged(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEngaged(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!engaged) return;
    // One increment per page load, once the visitor has actually
    // paused on a comment. `reportRead` guards against repeats.
    const timer = window.setTimeout(() => void reportRead(), 800);
    return () => window.clearTimeout(timer);
  }, [engaged, active.id]);

  return (
    <div ref={rootRef} className="relative mx-auto max-w-[1320px]">
      {showNav ? (
        <>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={copy.prev}
            className={`${NAV_BUTTON} absolute start-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] md:flex ltr:-translate-x-1/2 rtl:translate-x-1/2`}
          >
            <ChevronIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={copy.next}
            className={`${NAV_BUTTON} absolute end-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] md:flex ltr:translate-x-1/2 rtl:-translate-x-1/2`}
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
          <motion.div
            key={active.id}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <FeedbackCard feedback={active} size="lg" />
          </motion.div>
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
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={copy.prev}
            className={`${NAV_BUTTON} h-9 w-9 md:hidden`}
          >
            <ChevronIcon direction="prev" />
          </button>

          <div
            className="flex items-center justify-center gap-2"
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

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={copy.next}
            className={`${NAV_BUTTON} h-9 w-9 md:hidden`}
          >
            <ChevronIcon direction="next" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default FeedbackCarousel;
