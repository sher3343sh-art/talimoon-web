"use client";

/**
 * A quiet chapter indicator for the ordering experience — the
 * current chapter's name plus a hairline of segments. Deliberately
 * NOT "Step 3 of 7": the customer should feel they are moving through
 * a short journey, not filling a long form. Scales to the whole
 * experience (Phase 01 is chapter 0). RTL- and reduced-motion-safe
 * (the only motion is a CSS width/colour transition).
 */

import type { Locale } from "@/lib/journey/types";
import { JOURNEY_CHAPTERS } from "@/lib/order/phase01-copy";

export function JourneyProgress({
  locale,
  current,
}: {
  locale: Locale;
  /** 0-based index into JOURNEY_CHAPTERS. */
  current: number;
}) {
  const total = JOURNEY_CHAPTERS.length;
  const idx = Math.min(Math.max(current, 0), total - 1);
  const chapter = JOURNEY_CHAPTERS[idx];

  return (
    <div className="flex flex-col items-end gap-1.5" aria-hidden="true">
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
        {chapter.label[locale] ?? chapter.label.en}
      </span>
      <span className="flex gap-1">
        {JOURNEY_CHAPTERS.map((ch, i) => (
          <span
            key={ch.key}
            className={[
              "h-[3px] w-5 rounded-full transition-colors duration-500 motion-reduce:transition-none",
              i <= idx ? "bg-accent-primary" : "bg-border-subtle",
            ].join(" ")}
          />
        ))}
      </span>
    </div>
  );
}

export default JourneyProgress;
