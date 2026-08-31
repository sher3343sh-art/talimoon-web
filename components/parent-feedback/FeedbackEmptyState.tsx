"use client";

/**
 * FeedbackEmptyState — shown in the carousel area when there are no
 * approved parent comments yet.
 * ----------------------------------------------------------------
 * The honest-data rule: better to show nothing than invented social
 * proof. The section keeps its heading, supporting text, input and
 * moderation note; this one restrained panel stands in for the
 * carousel and says, quietly, that the first approved parent opinions
 * will appear here. No fake comments, no fake counts.
 */

import { SectionOrnament } from "./SectionOrnament";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";

export function FeedbackEmptyState() {
  const { copy } = useFeedbackCopy();

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="rounded-[24px] border border-dashed border-[var(--border-default,rgba(42,36,29,0.14))] bg-[var(--paper-50,#FDFBF7)] px-8 py-10 text-center">
        <SectionOrnament size="small" />
        <p className="mx-auto mt-3 max-w-[42ch] font-serif text-[1.0625rem] leading-[1.55] text-[var(--text-secondary,#49433C)]">
          {copy.emptyState}
        </p>
      </div>
    </div>
  );
}

export default FeedbackEmptyState;
