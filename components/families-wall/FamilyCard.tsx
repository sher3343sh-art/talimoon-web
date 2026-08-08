"use client";

/**
 * FamilyCard — Families Wall testimonial carousel card
 * ----------------------------------------------------------------
 * Matches the reference 1:1: large gold quote mark, editorial quote,
 * thin divider, name + verified badge grouped together (no date row
 * — the reference doesn't show one), reaction row. No avatar.
 *
 * `size` controls the center-vs-side carousel treatment: "lg" is the
 * fully-opaque, elevated, primary card; "sm" is the smaller, slightly
 * muted card partially peeking in from the left/right.
 */

import { ReactionBar, type ReactionCounts } from "./ReactionBar";

export type FamilyStory = {
  id: string;
  quote: string;
  name: string;
  reactions: ReactionCounts;
};

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path d="M6 10.2 8.8 13 14 7.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function FamilyCard({ story, size = "lg" }: { story: FamilyStory; size?: "lg" | "sm" }) {
  const isLarge = size === "lg";

  return (
    <article
      className={[
        "rounded-[24px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] transition-shadow duration-300 ease-out",
        isLarge
          ? "p-8 shadow-[0_16px_40px_-16px_rgba(42,36,29,0.16)]"
          : "p-6 shadow-[0_4px_16px_-6px_rgba(42,36,29,0.08)]",
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
          "font-serif font-medium leading-[1.35] text-[var(--text-primary,#2A241D)]",
          isLarge ? "mt-1 text-[1.375rem]" : "mt-1 text-[1.125rem]",
        ].join(" ")}
      >
        {story.quote}
      </p>

      <div className={["border-t border-[var(--border-subtle,rgba(42,36,29,0.08))]", isLarge ? "mt-5 pt-4" : "mt-4 pt-3"].join(" ")}>
        <p className="font-serif text-[0.9375rem] font-medium text-[var(--text-primary,#2A241D)]">
          — {story.name}
        </p>
        <div className="mt-1 inline-flex items-center gap-1.5 text-[var(--gold-600,#9C7A47)]">
          <VerifiedIcon />
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em]">
            Verified Talimoon Family
          </span>
        </div>
      </div>

      <div className={isLarge ? "mt-5" : "mt-4"}>
        <ReactionBar storyId={story.id} reactions={story.reactions} />
      </div>
    </article>
  );
}

export default FamilyCard;
