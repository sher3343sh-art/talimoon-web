"use client";

/**
 * ReactionBar — Families Wall testimonial cards
 * ----------------------------------------------------------------
 * Exactly three reactions per card (😊 ❤️ 🥹), matching the reference
 * design — the fourth reaction ("Beautiful" 👏) only appears in the
 * aggregate ReactionSummary card, not on individual testimonials.
 * Each visitor may react once per emoji per story — enforced via
 * localStorage (the honest scope available without a backend/auth
 * system: "once per browser," not "once per verified identity").
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type ReactionCounts = {
  smile: number;
  love: number;
  touched: number;
};

const REACTIONS: { key: keyof ReactionCounts; emoji: string; label: string }[] = [
  { key: "smile", emoji: "😊", label: "Smile" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "touched", emoji: "🥹", label: "Touched" },
];

function storageKey(storyId: string, reactionKey: string) {
  return `talimoon:reaction:${storyId}:${reactionKey}`;
}

function ReactionButton({
  storyId,
  reactionKey,
  emoji,
  label,
  initialCount,
}: {
  storyId: string;
  reactionKey: keyof ReactionCounts;
  emoji: string;
  label: string;
  initialCount: number;
}) {
  const [reacted, setReacted] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pulses, setPulses] = useState(0);

  // Deliberately an effect, not a lazy useState initializer: reading
  // localStorage during the initializer would run on the client's
  // first (hydration) render and mismatch the server-rendered HTML,
  // which always renders `reacted: false` since localStorage isn't
  // available server-side. Applying it post-hydration, here, is the
  // correct SSR-safe pattern — not the "should have used a lazy
  // initializer" case react-hooks/set-state-in-effect is checking for.
  // Runs once on mount only, to restore this visitor's prior reaction
  // for this one story+emoji pair.
  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.localStorage.getItem(storageKey(storyId, reactionKey)) === "1") {
      setReacted(true);
      setCount(initialCount + 1);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  function handleClick() {
    if (reacted) return;
    setReacted(true);
    setCount((c) => c + 1);
    setPulses((p) => p + 1);
    window.localStorage.setItem(storageKey(storyId, reactionKey), "1");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={reacted}
      aria-pressed={reacted}
      aria-label={`React with ${label}${reacted ? " — already reacted" : ""}`}
      className="inline-flex items-center gap-1.5 rounded-full font-sans text-[0.9375rem] text-[var(--text-secondary,#49433C)] transition-opacity duration-200 hover:opacity-80 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]"
    >
      <motion.span
        aria-hidden="true"
        animate={pulses === 0 ? { scale: 1 } : { scale: [1, 1.15, 1] }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="text-[1.125rem] leading-none"
      >
        {emoji}
      </motion.span>
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={reacted ? "font-semibold text-[var(--gold-600,#9C7A47)]" : "font-medium"}
      >
        {count}
      </motion.span>
    </button>
  );
}

export function ReactionBar({ storyId, reactions }: { storyId: string; reactions: ReactionCounts }) {
  return (
    <div className="flex items-center gap-5" aria-label="React to this story">
      {REACTIONS.map(({ key, emoji, label }) => (
        <ReactionButton
          key={key}
          storyId={storyId}
          reactionKey={key}
          emoji={emoji}
          label={label}
          initialCount={reactions[key]}
        />
      ))}
    </div>
  );
}

export default ReactionBar;
