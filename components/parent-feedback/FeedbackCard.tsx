"use client";

/**
 * FeedbackCard — one approved parent/community comment in the
 * Parent Feedback carousel.
 * ----------------------------------------------------------------
 * Hierarchy, top to bottom: the comment TEXT (the hero of the card),
 * then the parent's display name, then a verification badge ONLY when
 * the comment is genuinely verified through moderation
 * (`feedback.verified === true` — never inferred, never defaulted),
 * then the per-comment reaction row (secondary, kept visually quiet so
 * the emojis never overpower the words).
 *
 * `size` is the carousel treatment: "lg" is the elevated centre card,
 * "sm" the smaller, slightly muted card peeking in from a side.
 */

import { ReactionBar } from "./ReactionBar";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";
import type { ParentFeedback } from "@/lib/parent-feedback/feedback";

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6 10.2 8.8 13 14 7.2"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function FeedbackCard({
  feedback,
  size = "lg",
}: {
  feedback: ParentFeedback;
  size?: "lg" | "sm";
}) {
  const isLarge = size === "lg";
  const { copy } = useFeedbackCopy();

  return (
    <article
      className={[
        "rounded-[24px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] transition-shadow duration-300 ease-out",
        isLarge
          ? "p-6 shadow-[0_16px_40px_-16px_rgba(42,36,29,0.16)]"
          : "p-5 shadow-[0_4px_16px_-6px_rgba(42,36,29,0.08)]",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "block font-serif leading-none text-[var(--gold-500,#B8935B)]",
          isLarge ? "text-[2.75rem]" : "text-[2.25rem]",
        ].join(" ")}
      >
        &#8220;
      </span>

      <p
        className={[
          "line-clamp-4 font-serif font-medium leading-[1.35] text-[var(--text-primary,#2A241D)]",
          isLarge ? "mt-1 text-[1.375rem]" : "mt-1 text-[1.0625rem]",
        ].join(" ")}
      >
        {feedback.content}
      </p>

      <div
        className={[
          "border-t border-[var(--border-subtle,rgba(42,36,29,0.08))]",
          isLarge ? "mt-4 pt-3" : "mt-3 pt-2.5",
        ].join(" ")}
      >
        <p className="font-serif text-[0.9375rem] font-medium text-[var(--text-primary,#2A241D)]">
          — {feedback.displayName}
        </p>

        {feedback.verified ? (
          <div className="mt-1 inline-flex items-center gap-1.5 text-[var(--gold-600,#9C7A47)]">
            <VerifiedIcon />
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em]">
              {copy.verifiedBadge}
            </span>
          </div>
        ) : null}
      </div>

      <div className={isLarge ? "mt-3" : "mt-2.5"}>
        <ReactionBar feedbackId={feedback.id} reactions={feedback.reactions} />
      </div>
    </article>
  );
}

export default FeedbackCard;
