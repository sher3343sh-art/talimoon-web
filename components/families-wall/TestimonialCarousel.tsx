"use client";

/**
 * TestimonialCarousel — Families Wall
 * ----------------------------------------------------------------
 * Center-focused 5-card carousel: a large, fully-opaque center card
 * flanked by two tiers of progressively smaller/more-faded side
 * cards on each side (near + far), all five visible at once — up
 * from the original 3-slot version (center + one near peek per
 * side). Circular gold-outline nav arrows and five dot indicators
 * below (the active dot always corresponds to whichever story is
 * currently centered).
 *
 * With exactly 5 stories, "next"/"previous" is a simple index
 * rotation — every story stays visible at all times, only which
 * position (center / near / far) each one occupies changes. The far
 * side cards are pulled partially behind the near ones with negative
 * margins inside an `overflow-hidden` row, same technique as the
 * original center/near pair.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FamilyCard, type FamilyStory } from "./FamilyCard";
import { useT } from "@/lib/i18n/LanguageContext";

const CHROME_EN = {
  prevStory: "Previous story",
  nextStory: "Next story",
  storyNav: "Story navigation",
  showStory: (name: string) => `Show ${name}'s story`,
};

const CHROME_UZ: typeof CHROME_EN = {
  prevStory: "Oldingi hikoya",
  nextStory: "Keyingi hikoya",
  storyNav: "Hikoyalar navigatsiyasi",
  showStory: (name: string) => `${name} hikoyasini ko'rsatish`,
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d={direction === "left" ? "M15 5.5 8.5 12l6.5 6.5" : "M9 5.5 15.5 12 9 18.5"} />
    </svg>
  );
}

export function TestimonialCarousel({ stories }: { stories: FamilyStory[] }) {
  const t = useT(CHROME_EN, CHROME_UZ);
  const [activeIndex, setActiveIndex] = useState(2);
  const count = stories.length;

  const wrap = (index: number) => ((index % count) + count) % count;
  const farLeftIndex = wrap(activeIndex - 2);
  const nearLeftIndex = wrap(activeIndex - 1);
  const nearRightIndex = wrap(activeIndex + 1);
  const farRightIndex = wrap(activeIndex + 2);

  function goTo(index: number) {
    setActiveIndex(wrap(index));
  }

  return (
    <div className="relative mx-auto max-w-[1320px]">
      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        aria-label={t.prevStory}
        className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)] shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)] md:flex md:h-11 md:w-11"
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        aria-label={t.nextStory}
        className="absolute right-0 top-1/2 z-20 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)] shadow-[0_4px_16px_-4px_rgba(42,36,29,0.14)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)] md:flex md:h-11 md:w-11"
      >
        <ChevronIcon direction="right" />
      </button>

      <div className="flex items-center justify-center overflow-hidden">
        <div className="hidden w-[168px] shrink-0 -mr-12 scale-[0.76] opacity-40 xl:block">
          <FamilyCard story={stories[farLeftIndex]} size="sm" />
        </div>

        <div className="hidden w-[220px] shrink-0 -mr-12 scale-[0.88] opacity-70 md:block">
          <FamilyCard story={stories[nearLeftIndex]} size="sm" />
        </div>

        <div className="z-10 w-full max-w-[480px] shrink-0 px-4 md:px-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={stories[activeIndex].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FamilyCard story={stories[activeIndex]} size="lg" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden w-[220px] shrink-0 -ml-12 scale-[0.88] opacity-70 md:block">
          <FamilyCard story={stories[nearRightIndex]} size="sm" />
        </div>

        <div className="hidden w-[168px] shrink-0 -ml-12 scale-[0.76] opacity-40 xl:block">
          <FamilyCard story={stories[farRightIndex]} size="sm" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label={t.storyNav}>
        {stories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={t.showStory(story.name)}
            onClick={() => goTo(index)}
            className={[
              "h-2 w-2 rounded-full transition-[background-color,transform] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]",
              index === activeIndex
                ? "scale-125 bg-[var(--text-primary,#2A241D)]"
                : "bg-[var(--border-default,rgba(42,36,29,0.14))] hover:bg-[var(--text-muted,#8B8578)]",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialCarousel;
