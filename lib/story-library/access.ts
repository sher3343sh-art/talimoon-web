/**
 * The single gate. Every Reader entry point and every "Begin" button
 * asks `canRead()` — nothing else decides visibility or access. In V1
 * it only checks that a story is actually published. When a paid tier
 * arrives it also checks `story.access` against the viewer's
 * entitlements, and the Story page renders a lock state from `reason`.
 * No routes or Reader code change.
 */

import type { Story } from './types';

export interface Viewer {
  actorId: string;
  /** V1: always empty. Future: which stories/tiers this viewer may read. */
  entitlements?: ReadonlySet<string>;
}

export type ReadDecision =
  | { allowed: true }
  | { allowed: false; reason: 'unpublished' | 'withdrawn' | 'premium' };

export function canRead(story: Story): ReadDecision {
  if (story.publicationState === 'withdrawn') {
    return { allowed: false, reason: 'withdrawn' };
  }
  if (story.publicationState !== 'published') {
    return { allowed: false, reason: 'unpublished' };
  }
  // V1: every published story is free to read. When a paid tier
  // arrives, `canRead` takes a `viewer: Viewer` and adds:
  //   if (story.access === 'premium' && !viewer.entitlements?.has(story.id))
  //     return { allowed: false, reason: 'premium' };
  return { allowed: true };
}

/** A story is publicly listable when it is published AND — for family
 *  stories — consent is active and scoped to the library. */
export function isPubliclyListed(story: Story): boolean {
  if (story.publicationState !== 'published') return false;
  if (story.kind === 'family') {
    const c = story.consent;
    if (!c || c.status !== 'active' || !c.scope.inLibrary) return false;
  }
  return true;
}
