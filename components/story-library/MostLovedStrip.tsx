'use client';

/**
 * The Hall — "Most loved this month".
 *
 * A quiet strip of a few stories with meaningful, recent engagement.
 * UNNUMBERED — no "#1", no chart, no rank. It only exists when the
 * ranking model (see lib/story-library/ranking.ts) actually returns
 * stories; with no engagement in V1 it renders nothing.
 */

import type { Story } from '@/lib/story-library/types';

export function MostLovedStrip({ stories }: { stories: Story[] }) {
  if (!stories || stories.length === 0) return null;

  // Real strip is built in a later increment (needs the Story card +
  // the "loved" heart component). Guarded so it can never show an
  // empty or fabricated state.
  return null;
}

export default MostLovedStrip;
