/**
 * TALIMOON HAYOT (Journey) — content source.
 * ----------------------------------------------------------------
 * `PRODUCTION_ENTRIES` / `PRODUCTION_PULSE` are the real public
 * dataset. They are intentionally EMPTY until real photos, video
 * and text are supplied — HAYOT shows elegant, intentional empty
 * states, never invented volume, never a fabricated event, story,
 * date, family, statistic, partnership or achievement.
 *
 * Adding the first real entry is a single object appended to
 * `PRODUCTION_ENTRIES` — see `dev-fixtures.ts` for the exact shape
 * of every format (photo reportage, video, thought, moment, update,
 * campaign) and every block type. No component changes.
 *
 * Development fixtures (`dev-fixtures.ts`) are merged in ONLY when
 * `process.env.NODE_ENV === 'development'`. They never reach a
 * production build.
 *
 * These accessors are pure functions over local data with no
 * server-only imports, so they are safe to call from Server and
 * Client Components alike.
 */

import {
  directionFor,
  type Direction,
  type EntryContent,
  type JourneyEntry,
  type JourneyWorld,
  type Locale,
  type PulseItem,
  type PulseSeed,
} from './types';

// ── Dataset ────────────────────────────────────────────────────────
/**
 * The real public dataset. EMPTY until real content is supplied.
 * Append a `JourneyEntry` here to publish it — the page composes
 * itself. `featured: true` pins one entry to THE OPENING.
 */
const PRODUCTION_ENTRIES: readonly JourneyEntry[] = [];

/**
 * Real YAQIN KUNLAR pulse items not (yet) backed by a full entry.
 * EMPTY until there is something genuinely upcoming — never a
 * fabricated date.
 */
const PRODUCTION_PULSE: readonly PulseSeed[] = [];

/**
 * Dev fixtures are merged ONLY in development. `process.env.NODE_ENV`
 * is statically replaced with `'production'` in a production build,
 * so the `require('./dev-fixtures')` call below is dead code the
 * bundler eliminates entirely — the fixture module and its strings
 * never reach the production bundle, and `ENTRIES` / `PULSE` are
 * exactly the (empty) production arrays.
 */
const DEV = (() => {
  if (process.env.NODE_ENV !== 'development') {
    return { entries: [] as JourneyEntry[], pulse: [] as PulseSeed[] };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const f = require('./dev-fixtures') as typeof import('./dev-fixtures');
  return { entries: [...f.DEV_FIXTURE_ENTRIES], pulse: [...f.DEV_FIXTURE_PULSE] };
})();

const ENTRIES: readonly JourneyEntry[] = [
  ...PRODUCTION_ENTRIES,
  ...DEV.entries,
];

const PULSE: readonly PulseSeed[] = [...PRODUCTION_PULSE, ...DEV.pulse];

// ── Config ─────────────────────────────────────────────────────────
/**
 * A `featured` entry older than this many days is still returned, but
 * flagged `source: 'featured-stale'` so THE OPENING can reframe it
 * ("Yaqinda…") or the caller can fall back to the newest entry. A
 * stale "NOW" is worse than an honest "recently".
 */
export const FEATURED_MAX_AGE_DAYS = 35;

/** How many stream entries the page renders before "Ko'proq ko'rish". */
export const STREAM_PAGE_SIZE = 8;

/** Pulse items more than this many days in the past are dropped. */
const PULSE_PAST_GRACE_DAYS = 2;

// ── Small helpers ──────────────────────────────────────────────────
const DAY_MS = 86_400_000;

function ageInDays(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / DAY_MS;
}

function byNewest(a: JourneyEntry, b: JourneyEntry): number {
  return (
    new Date(b.publishedAtISO).getTime() - new Date(a.publishedAtISO).getTime()
  );
}

/** Live on the site: real to visitors now, or kept as history. */
function isPublic(entry: JourneyEntry): boolean {
  return entry.status === 'published' || entry.status === 'archived';
}

/** In the active reverse-chronological stream (history is not). */
function isInStream(entry: JourneyEntry): boolean {
  return entry.status === 'published';
}

// ── Content resolution (multilingual + RTL ready) ──────────────────
export interface ResolvedContent {
  content: EntryContent;
  /** The locale actually used (may differ from the one requested). */
  locale: Locale;
  /** True when the requested locale was missing and we fell back. */
  isFallback: boolean;
  direction: Direction;
}

/**
 * The entry's content for a locale, falling back to its
 * `defaultLocale`, then to any translation that exists, then to an
 * empty body. Never throws — a live page must render something.
 */
export function resolveEntryContent(
  entry: JourneyEntry,
  locale: Locale,
): ResolvedContent {
  const exact = entry.translations[locale];
  if (exact) {
    return { content: exact, locale, isFallback: false, direction: directionFor(locale) };
  }
  const fallbackLocale = entry.defaultLocale;
  const fallback =
    entry.translations[fallbackLocale] ??
    Object.values(entry.translations)[0];
  if (fallback) {
    return {
      content: fallback,
      locale: fallbackLocale,
      isFallback: true,
      direction: directionFor(fallbackLocale),
    };
  }
  return {
    content: { blocks: [] },
    locale: entry.defaultLocale,
    isFallback: true,
    direction: directionFor(entry.defaultLocale),
  };
}

// ── Accessors — THE CMS SEAM ───────────────────────────────────────

/** Every public entry (published + archived), newest first. */
export function getJourneyIndex(): JourneyEntry[] {
  return ENTRIES.filter(isPublic).slice().sort(byNewest);
}

export interface StreamPage {
  entries: JourneyEntry[];
  total: number;
  hasMore: boolean;
}

/**
 * A window into the active stream (published only, newest first).
 * By default it MIXES all three worlds and excludes the current
 * OPENING + PARENT FEATURE entries so nothing shows twice. Pass
 * `world` to scope it (used by the `/journey/<world>` landings) —
 * scoped views do NOT exclude the opening/feature.
 */
export function getStreamEntries(
  opts: {
    offset?: number;
    limit?: number;
    world?: JourneyWorld;
  } = {},
): StreamPage {
  const offset = Math.max(0, opts.offset ?? 0);
  const limit = Math.max(0, opts.limit ?? STREAM_PAGE_SIZE);

  let all = ENTRIES.filter(isInStream);

  if (opts.world) {
    all = all.filter((e) => e.world === opts.world);
  } else {
    const excluded = new Set<string>();
    const f = getFeaturedEntry()?.entry.id;
    if (f) excluded.add(f);
    const p = getParentFeature()?.id;
    if (p) excluded.add(p);
    all = all.filter((e) => !excluded.has(e.id));
  }

  all = all.slice().sort(byNewest);

  return {
    entries: all.slice(offset, offset + limit),
    total: all.length,
    hasMore: offset + limit < all.length,
  };
}

/**
 * The one `parents` entry for the landing's PARENT FEATURE slot.
 * Editorial pin (`parentFeature: true`) wins, else the newest
 * `parents` entry. `null` when there is no parents content yet.
 */
export function getParentFeature(now: Date = new Date()): JourneyEntry | null {
  const parents = ENTRIES.filter(
    (e) => isInStream(e) && e.world === 'parents',
  ).sort(byNewest);
  if (parents.length === 0) return null;
  void now;
  return parents.find((e) => e.parentFeature) ?? parents[0];
}

/** Entries for one world (public: published + archived), newest first. */
export function getWorldEntries(world: JourneyWorld): JourneyEntry[] {
  return ENTRIES.filter((e) => isPublic(e) && e.world === world).sort(byNewest);
}

/** Per-world count of public entries — for the editorial gateways. */
export function getWorldCounts(): Record<JourneyWorld, number> {
  return {
    'talimoon-life': getWorldEntries('talimoon-life').length,
    parents: getWorldEntries('parents').length,
    'wisdom-science': getWorldEntries('wisdom-science').length,
  };
}

export type FeaturedSource = 'featured' | 'featured-stale' | 'newest';

export interface FeaturedResult {
  entry: JourneyEntry;
  source: FeaturedSource;
}

/**
 * THE OPENING entry. An editorial `featured` pin wins; if that pin
 * is older than `FEATURED_MAX_AGE_DAYS` it is still returned but
 * flagged `featured-stale`. With no pin at all, the newest published
 * entry stands in. `null` only when nothing is published.
 */
export function getFeaturedEntry(now: Date = new Date()): FeaturedResult | null {
  const published = ENTRIES.filter(isInStream).sort(byNewest);
  if (published.length === 0) return null;

  const pinned = published.filter((e) => e.featured);
  if (pinned.length > 0) {
    const entry = pinned[0];
    const stale = ageInDays(entry.publishedAtISO, now) > FEATURED_MAX_AGE_DAYS;
    return { entry, source: stale ? 'featured-stale' : 'featured' };
  }
  return { entry: published[0], source: 'newest' };
}

/** One entry by slug — public or not (route guards decide visibility). */
export function getEntryBySlug(slug: string): JourneyEntry | undefined {
  return ENTRIES.find((e) => e.slug === slug);
}

/**
 * Slugs that get a stable detail page — published and archived only
 * (`generateStaticParams`). Draft / scheduled entries have no route.
 */
export function publishedJourneySlugs(): string[] {
  return ENTRIES.filter(isPublic).map((e) => e.slug);
}

/**
 * "HAYOT DAVOM ETADI" — genuinely related entries for the end of a
 * detail page. Editorial `relatedSlugs` first (still-public only),
 * then entries sharing a tag, then most-recent; never the entry
 * itself, capped at `limit`.
 */
export function getRelatedEntries(
  entry: JourneyEntry,
  limit = 3,
): JourneyEntry[] {
  const pool = getJourneyIndex().filter((e) => e.id !== entry.id);
  const picked: JourneyEntry[] = [];
  const take = (e: JourneyEntry) => {
    if (picked.length < limit && !picked.some((p) => p.id === e.id)) picked.push(e);
  };

  for (const slug of entry.relatedSlugs ?? []) {
    const match = pool.find((e) => e.slug === slug);
    if (match) take(match);
  }
  if (picked.length < limit) {
    for (const e of pool) {
      if (e.tags.some((t) => entry.tags.includes(t))) take(e);
    }
  }
  if (picked.length < limit) {
    for (const e of pool) take(e);
  }
  return picked;
}

export type CampaignState = 'upcoming' | 'active' | 'ended';

/**
 * A campaign's state, derived from its window vs. now — never
 * stored, so an ended campaign can't keep claiming to be open.
 * `null` for entries that are not campaigns.
 */
export function campaignState(
  entry: JourneyEntry,
  now: Date = new Date(),
): CampaignState | null {
  const c = entry.campaign;
  if (!c) return null;
  const t = now.getTime();
  if (t < new Date(c.startISO).getTime()) return 'upcoming';
  if (t > new Date(c.endISO).getTime()) return 'ended';
  return 'active';
}

// ── YAQIN KUNLAR ───────────────────────────────────────────────────
function pulseText(
  map: Partial<Record<Locale, string>>,
  locale: Locale,
): string {
  return map[locale] ?? map.uz ?? map.en ?? Object.values(map)[0] ?? '';
}

/**
 * The forward pulse for a locale: upcoming + today items, plus any
 * item from the last couple of days for context, oldest→newest.
 * Returns `[]` when there is nothing meaningful ahead — the YAQIN
 * KUNLAR band renders nothing in that case (never a placeholder).
 */
export function getPulse(
  locale: Locale = 'uz',
  now: Date = new Date(),
): PulseItem[] {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return PULSE.map((seed) => {
    const when = new Date(seed.dateISO);
    const daysFromToday = (when.getTime() - startOfToday.getTime()) / DAY_MS;
    const state: PulseItem['state'] =
      daysFromToday >= 1 ? 'upcoming' : daysFromToday > -1 ? 'today' : 'past';
    return {
      id: seed.id,
      dateISO: seed.dateISO,
      strand: seed.strand,
      label: pulseText(seed.label, locale),
      title: pulseText(seed.title, locale),
      href: seed.href,
      state,
    };
  })
    .filter(
      (item) =>
        item.state !== 'past' ||
        ageInDays(item.dateISO, now) <= PULSE_PAST_GRACE_DAYS,
    )
    .sort(
      (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
    );
}

// ── Privacy policy helper ──────────────────────────────────────────
/**
 * What a renderer may do with this entry's media.
 *
 *  • `showMedia`  — may the `cover` / gallery images be rendered at
 *    all? `false` for `consent: 'none'` (people present, no consent):
 *    the renderer must fall back to a non-photographic treatment.
 *  • `showPeople` — may recognisable faces be shown? Only ever `true`
 *    for `consent: 'granted'`. For `'not-applicable'` (no people in
 *    the frame) the media is shown but this stays `false` because
 *    there is nothing to permit.
 *
 * Consult this before rendering any photograph in HAYOT. Do not
 * weaken it for visual polish.
 */
export function mediaPolicy(entry: JourneyEntry): {
  showMedia: boolean;
  showPeople: boolean;
} {
  switch (entry.media.consent) {
    case 'granted':
      return { showMedia: true, showPeople: true };
    case 'not-applicable':
      return { showMedia: true, showPeople: false };
    case 'none':
    default:
      return { showMedia: false, showPeople: false };
  }
}

/**
 * Whether HAYOT currently has ANY public content (entries or pulse).
 * The page still renders its full structure when this is false — the
 * movements show intentional empty states, not a broken page.
 */
export function hasJourneyContent(): boolean {
  return getJourneyIndex().length > 0 || getPulse().length > 0;
}

/* The exact shape of every format and block type is in
 * `dev-fixtures.ts` — use it as the reference when adding real
 * entries to `PRODUCTION_ENTRIES`. */
