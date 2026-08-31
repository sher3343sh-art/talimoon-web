"use client";

/**
 * ReactionBar — one row of reactions that belongs to ONE approved
 * parent-feedback comment.
 * ----------------------------------------------------------------
 * Five reactions, in this order: 😊 Tabassum · ❤️ Sevgi · 🥹 Ta’sirlandi
 * · 👏 Ajoyib · 👎 Yoqmadi. The fifth is intentionally negative — the
 * point is honest community feedback, not a positive-only wall. It
 * functions exactly like the others (select / remove / switch) and is
 * styled just as quietly: no red, no menu, no confirmation.
 *
 * Rules (see `lib/parent-feedback/reactions.ts` for the data layer):
 *   • counts start at 0 and 0 is a real, shown state — never hidden,
 *     never seeded;
 *   • one visitor has at most ONE active reaction per comment;
 *   • clicking another reaction MOVES it (old −1, new +1);
 *   • clicking the active reaction again REMOVES it;
 *   • the click sends the intended reaction, never a count — the
 *     store returns the canonical state and the UI reconciles;
 *   • optimistic update, rolled back on failure with a quiet,
 *     non-modal error;
 *   • real <button>s: `aria-pressed`, localized labels, visible focus,
 *     ~44px targets, keyboard-native, count changes announced.
 *
 * Same house typography/tokens as the rest of this section.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  REACTION_EMOJI,
  REACTION_TYPES,
  formatCount,
  type ReactionCounts,
  type ReactionType,
} from "@/lib/parent-feedback/feedback";
import {
  deriveCounts,
  getReaction,
  setReaction,
  subscribe,
} from "@/lib/parent-feedback/reactions";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";

function useReactions(feedbackId: string, base: ReactionCounts) {
  const [mine, setMine] = useState<ReactionType | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const pendingRef = useRef(false);

  // Hydrate this visitor's stored reaction AFTER mount — localStorage
  // isn't available during SSR, so the first client render must match
  // the server ("nothing selected"), then settle to the real value.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMine(getReaction(feedbackId));
    return subscribe(() => setMine(getReaction(feedbackId)));
  }, [feedbackId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function react(type: ReactionType) {
    if (pendingRef.current) return; // no double-fire while a write is in flight
    const previous = mine;
    const next = mine === type ? null : type; // same → remove, other → switch

    setError(false);
    setMine(next); // optimistic
    setPending(true);
    pendingRef.current = true;

    setReaction(feedbackId, next)
      .then((canonical) => setMine(canonical))
      .catch(() => {
        setMine(previous); // roll back — never leave a fake local count
        setError(true);
      })
      .finally(() => {
        setPending(false);
        pendingRef.current = false;
      });
  }

  return { mine, counts: deriveCounts(base, mine), pending, error, react };
}

function ReactionButton({
  type,
  count,
  active,
  disabled,
  onSelect,
}: {
  type: ReactionType;
  count: number;
  active: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const { copy } = useFeedbackCopy();
  const reduced = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  const label = copy.reactionLabel[type];

  return (
    <button
      type="button"
      onClick={() => {
        setPulse((p) => p + 1);
        onSelect();
      }}
      disabled={disabled}
      aria-pressed={active}
      aria-label={copy.reactionAria(label, count, active)}
      title={label}
      className={[
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border px-2.5 font-sans text-[0.9375rem] leading-none transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]",
        "disabled:cursor-default",
        active
          ? "border-[var(--gold-500,#B8935B)] bg-[rgba(184,147,91,0.12)] text-[var(--gold-600,#9C7A47)]"
          : "border-transparent text-[var(--text-secondary,#49433C)] hover:bg-[rgba(42,36,29,0.04)]",
      ].join(" ")}
    >
      <motion.span
        aria-hidden="true"
        className="text-[1.125rem] leading-none"
        animate={reduced || pulse === 0 ? { scale: 1 } : { scale: [1, 1.18, 1] }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        {REACTION_EMOJI[type]}
      </motion.span>
      <span
        aria-hidden="true"
        className={active ? "font-semibold tabular-nums" : "font-medium tabular-nums"}
      >
        {formatCount(count)}
      </span>
    </button>
  );
}

export function ReactionBar({
  feedbackId,
  reactions,
}: {
  feedbackId: string;
  reactions: ReactionCounts;
}) {
  const { copy } = useFeedbackCopy();
  const { mine, counts, pending, error, react } = useReactions(feedbackId, reactions);

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-1"
        role="group"
        aria-label={copy.reactRowLabel}
      >
        {REACTION_TYPES.map((type) => (
          <ReactionButton
            key={type}
            type={type}
            count={counts[type]}
            active={mine === type}
            disabled={pending}
            onSelect={() => react(type)}
          />
        ))}
      </div>

      {/* SR-only running state so a reaction change is announced. */}
      <span className="sr-only" role="status" aria-live="polite">
        {mine
          ? copy.reactionAria(copy.reactionLabel[mine], counts[mine], true)
          : ""}
      </span>

      {error ? (
        <p
          role="status"
          className="mt-1.5 font-sans text-[0.8125rem] text-[var(--text-secondary,#49433C)]"
        >
          {copy.reactionError}
        </p>
      ) : null}
    </div>
  );
}

export default ReactionBar;
