/**
 * Story Library content — V1 seed.
 * ----------------------------------------------------------------
 * There is no real published content yet, and the brief forbids
 * inventing stories, covers, engagement or reviews. So this module
 * holds:
 *
 *  • the real Yusuf & Yasmina SERIES identity, and
 *  • three SCHEDULED (not published) placeholder episodes, each
 *    flagged `__placeholder`, with no artwork and no engagement — so
 *    the "spine" can be seen and felt while the saga is prepared.
 *
 * Family stories: none. The Hall shows an honest, anticipatory empty
 * state, never a fake family.
 *
 * Replacing a placeholder with a real episode is a local edit here:
 * drop `__placeholder`, set `publicationState: 'published'`, fill the
 * edition's `title` / `cover` / `pages` / `audio`. No component
 * changes.
 *
 * When this grows past a handful of entries it moves behind a data
 * source (CMS / DB) exposing the same accessors below.
 */

import {
  directionFor,
  type Locale,
  type Series,
  type Story,
  type StoryEdition,
} from './types';
import { isPubliclyListed } from './access';

// ── Series ─────────────────────────────────────────────────────────
export const YUSUF_YASMINA: Series = {
  id: 'series_yy',
  key: 'yusuf-yasmina',
  slug: 'yusuf-yasmina',
  title: {
    uz: 'Yusuf va Yasmina',
    en: 'Yusuf & Yasmina',
  },
  blurb: {
    uz: "Ezgulik, do'stlik va jasoratni kashf etadigan bolalar — bir hikoya, qism-qism davom etadi.",
    en: 'Two children discovering kindness, friendship and courage — one story, told part by part.',
  },
};

export const SERIES: readonly Series[] = [YUSUF_YASMINA];

// ── Helpers for placeholder scaffolding ────────────────────────────
const emptyCover = (id: string) => ({
  id,
  src: '',
  width: 1200,
  height: 1500,
  alt: '',
});

function placeholderEdition(
  storyId: string,
  locale: Locale,
  title: string,
): StoryEdition {
  return {
    id: `${storyId}_ed_${locale}`,
    storyId,
    locale,
    direction: directionFor(locale),
    title,
    description: '',
    cover: emptyCover(`${storyId}_cover`),
    pages: [],
    status: 'in-review',
  };
}

function placeholderEpisode(order: number): Story {
  const id = `story_yy_${String(order).padStart(2, '0')}`;
  return {
    id,
    slug: `yusuf-yasmina-${order}`,
    kind: 'series-episode',
    seriesId: YUSUF_YASMINA.id,
    episodeOrder: order,
    defaultLocale: 'uz',
    publicationState: 'scheduled',
    indexable: false,
    access: 'free',
    featured: false,
    recognition: null,
    commentsEnabled: true,
    editions: [
      placeholderEdition(id, 'uz', 'Sarlavha tez orada'),
      placeholderEdition(id, 'en', 'Title coming soon'),
    ],
    __placeholder: true,
  };
}

// ── Stories ────────────────────────────────────────────────────────
export const STORIES: readonly Story[] = [
  placeholderEpisode(1),
  placeholderEpisode(2),
  placeholderEpisode(3),
];

// ── Accessors ──────────────────────────────────────────────────────
export function getSeries(key: string): Series | undefined {
  return SERIES.find((s) => s.key === key);
}

/** All non-draft episodes of a series, in order — published AND
 *  scheduled. The spine renders scheduled ones as "coming soon". */
export function getSeriesEpisodes(seriesId: string): Story[] {
  return STORIES.filter(
    (s) =>
      s.kind === 'series-episode' &&
      s.seriesId === seriesId &&
      s.publicationState !== 'draft' &&
      s.publicationState !== 'withdrawn',
  ).sort((a, b) => (a.episodeOrder ?? 0) - (b.episodeOrder ?? 0));
}

/** Publicly listed family stories (published + active consent scoped
 *  to the library). Currently none. */
export function getFamilyStories(): Story[] {
  return STORIES.filter((s) => s.kind === 'family' && isPubliclyListed(s));
}

/** The curated hero of the Hall, if one is set. Falls back to null,
 *  in which case the Hall shows an editorial intro instead of a book. */
export function getFeaturedStory(): Story | null {
  return STORIES.find((s) => s.featured && isPubliclyListed(s)) ?? null;
}

export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

/** The edition for a locale, falling back to the story's default
 *  locale, then to whatever edition exists. */
export function getEdition(
  story: Story,
  locale: Locale,
): StoryEdition | undefined {
  return (
    story.editions.find((e) => e.locale === locale) ??
    story.editions.find((e) => e.locale === story.defaultLocale) ??
    story.editions[0]
  );
}

export interface HallData {
  featured: Story | null;
  family: Story[];
  series: { series: Series; episodes: Story[] } | null;
  /** Populated only once real engagement exists (see ranking.ts). */
  mostLoved: Story[];
}

/** The Hall's structure is locale-independent in V1 — components pull
 *  their own copy via `useT`. A `locale` argument returns when
 *  featured/most-loved selection needs per-language editions. */
export function getHallData(): HallData {
  const yy = getSeries('yusuf-yasmina');
  return {
    featured: getFeaturedStory(),
    family: getFamilyStories(),
    series: yy ? { series: yy, episodes: getSeriesEpisodes(yy.id) } : null,
    mostLoved: [], // no engagement in V1
  };
}
