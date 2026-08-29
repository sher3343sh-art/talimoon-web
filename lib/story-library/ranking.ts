/**
 * "Most loved" ranking — decaying, completion-weighted, never lifetime
 * views, never exposed to users.
 *
 * The score runs over a rolling ~30-day window so a new story can
 * climb and an old one falls off. `completions` are weighted above
 * `loves` above `opens`; a private-negative signal subtracts. Every
 * term is time-decayed. Weights live here and are tunable; the
 * algorithm is deliberately not surfaced anywhere in the UI.
 *
 * V1 has no engagement, so `mostLoved()` returns [] and the Hall's
 * "Most loved this month" strip stays hidden. The shape is ready for
 * the day real events exist.
 */

import type { Story, StoryEngagementSummary } from './types';

export interface WindowedSignals {
  storyId: string;
  /** Within the ranking window, already time-decayed by the caller /
   *  the aggregation job. */
  recentOpens: number;
  recentLoves: number;
  recentCompletions: number;
  recentPrivateNegative: number;
}

const WEIGHTS = {
  completion: 5,
  love: 3,
  open: 1,
  privateNegative: -4,
} as const;

/** Minimum total activity before a story is eligible — stops a
 *  2-view story topping the list. */
const ELIGIBILITY_FLOOR = 12;

export function lovedScore(s: WindowedSignals): number {
  const total = s.recentOpens + s.recentLoves + s.recentCompletions;
  if (total < ELIGIBILITY_FLOOR) return 0;
  return (
    WEIGHTS.completion * s.recentCompletions +
    WEIGHTS.love * s.recentLoves +
    WEIGHTS.open * s.recentOpens +
    WEIGHTS.privateNegative * s.recentPrivateNegative
  );
}

/** Returns the stories to surface in the "Most loved this month"
 *  strip, most-loved first, UNNUMBERED. Empty until there is real
 *  engagement. */
export function mostLoved(
  stories: readonly Story[],
  signals: ReadonlyMap<string, WindowedSignals>,
  limit = 4,
): Story[] {
  return stories
    .map((story) => {
      const sig = signals.get(story.id);
      return { story, score: sig ? lovedScore(sig) : 0 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.story);
}

/** Calm public number for a Story page: "Read 214 times", rounded at
 *  scale. Never framed comparatively. */
export function formatViews(summary: StoryEngagementSummary | undefined): string | null {
  const n = summary?.views ?? 0;
  if (n <= 0) return null;
  if (n < 1000) return String(n);
  if (n < 100_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${Math.round(n / 1000)}k`;
}
