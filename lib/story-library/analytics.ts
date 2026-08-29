'use client';

/**
 * Product events — defined now so future ranking and product
 * decisions can use real behaviour, without invasive tracking.
 *
 * V1: `recordEvent()` is a no-op in production and a console line in
 * development. It is shaped for `navigator.sendBeacon` (fire-and-
 * forget, never blocks reading) so wiring a real sink later is a
 * one-line change inside this file.
 *
 * These events feed `ranking.ts` (loved / completions / opens) and,
 * eventually, the private "Your story's journey" view for families.
 */

import type { EngagementEvent, EngagementType, Locale } from './types';

const ENDPOINT = ''; // set later, e.g. '/api/story-library/events'

export interface RecordArgs {
  type: EngagementType;
  storyId: string;
  editionLocale: Locale;
  actorId: string;
  context?: Record<string, string | number | boolean>;
}

export function recordEvent(args: RecordArgs): void {
  const event: EngagementEvent = {
    actorId: args.actorId,
    storyId: args.storyId,
    editionLocale: args.editionLocale,
    type: args.type,
    atISO: new Date().toISOString(),
    context: args.context,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[story-library:event]', event.type, event);
  }

  if (!ENDPOINT || typeof navigator === 'undefined') return;
  try {
    const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
    navigator.sendBeacon(ENDPOINT, blob);
  } catch {
    /* analytics must never break the experience */
  }
}
