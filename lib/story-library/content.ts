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
  type StoryPage,
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
    uz: "Mehr, do'stlik va jasoratni kashf etayotgan ikki qahramon. Har bir qism ularning olamini yanada kengaytiradi.",
    en: 'Two young heroes discovering kindness, friendship and courage. Each new chapter opens their world a little wider.',
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

// ── Sample published episode ───────────────────────────────────────
// SAMPLE ONLY — placeholder illustrated pages
// (public/story-library/sample/page-N.svg) and a placeholder narration
// bed (narration.wav, faint pad + a soft chime at each page turn), so
// the Reader — page↔audio sync, the two switches, continue-reading — is
// fully real and demonstrable. Replacing it with a real episode is a
// data edit: swap the assets, the timestamps and the copy.
const SAMPLE_PAGE_TEXT = [
  'Two friends set out at first light.',
  'A question opens like a door.',
  'The path climbs through a quiet garden.',
  'They help someone who cannot see the way.',
  'Under the first stars, they rest.',
  'And the story waits for tomorrow.',
];
// audioEnd[n] === audioStart[n+1]; total 72s (matches narration.wav)
const SAMPLE_BOUNDS = [0, 12, 25, 38, 50, 62, 72];

function samplePages(): StoryPage[] {
  return SAMPLE_PAGE_TEXT.map((text, i) => ({
    index: i,
    image: {
      id: `sample_p${i + 1}`,
      src: `/story-library/sample/page-${i + 1}.svg`,
      width: 1200,
      height: 800,
      alt: text,
    },
    text,
    audioStartSec: SAMPLE_BOUNDS[i],
    audioEndSec: SAMPLE_BOUNDS[i + 1],
  }));
}

function sampleEdition(storyId: string, locale: Locale): StoryEdition {
  const uz = locale === 'uz';
  return {
    id: `${storyId}_ed_${locale}`,
    storyId,
    locale,
    direction: directionFor(locale),
    title: uz ? 'Ilk yo‘l' : 'The First Path',
    subtitle: uz ? 'Namuna qism' : 'Sample part',
    description: uz
      ? 'Yusuf va Yasmina birga yo‘lga chiqadi va yo‘lda kichik bir yaxshilik qiladi. (Bu — Reader’ni sinash uchun namuna nusxa.)'
      : 'Yusuf and Yasmina set out together and do one small kindness along the way. (A sample edition, for trying the Reader.)',
    cover: emptyCover(`${storyId}_cover`),
    pages: samplePages(),
    audio: {
      id: `${storyId}_audio_${locale}`,
      src: '/story-library/sample/narration.wav',
      durationSec: 72,
    },
    status: 'ready',
  };
}

function sampleEpisode(): Story {
  const id = 'story_yy_01';
  return {
    id,
    slug: 'yusuf-yasmina-1',
    kind: 'series-episode',
    seriesId: YUSUF_YASMINA.id,
    episodeOrder: 1,
    defaultLocale: 'uz',
    publicationState: 'published',
    publishedAtISO: '2026-08-01T00:00:00.000Z',
    indexable: false, // sample content — not for search engines
    access: 'free',
    featured: false,
    recognition: null,
    commentsEnabled: true,
    editions: [sampleEdition(id, 'uz'), sampleEdition(id, 'en')],
  };
}

// ── Published family book ─────────────────────────────────────────
const UNUTILMAGAN_BASE =
  '/images/story-library/talimoon-books/source/unutilmagan-nasihatlar-uz';

function unutilmaganPages(): StoryPage[] {
  return Array.from({ length: 17 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      index,
      image: {
        id: `unutilmagan_p${number}`,
        src: `${UNUTILMAGAN_BASE}/optimized/page-${number}.webp`,
        width: 2560,
        height: 1298,
        alt: `Unutilmagan nasihatlar — ${index + 1}-sahifa`,
      },
      audioSrc: `${UNUTILMAGAN_BASE}/audio/page-${number}.mp3`,
    };
  });
}

function unutilmaganNasihatlar(): Story {
  const id = 'story_family_unutilmagan_nasihatlar_uz';
  return {
    id,
    slug: 'unutilmagan-nasihatlar',
    kind: 'family',
    dedication: 'Bir oila hikoyasi',
    defaultLocale: 'uz',
    publicationState: 'published',
    publishedAtISO: '2026-09-06T00:00:00.000Z',
    indexable: false,
    access: 'free',
    featured: false,
    recognition: null,
    commentsEnabled: false,
    consent: {
      storyId: id,
      familyRef: 'family_unutilmagan_nasihatlar',
      grantedAtISO: '2026-09-06T00:00:00.000Z',
      scope: {
        inLibrary: true,
        indexable: false,
        commentsEnabled: false,
        showAgeBand: false,
      },
      status: 'active',
    },
    editions: [
      {
        id: `${id}_ed_uz`,
        storyId: id,
        locale: 'uz',
        direction: 'ltr',
        title: 'Unutilmagan nasihatlar',
        subtitle: 'O‘rmonda adashib qoldik',
        description:
          'Fayzbek, Madinabonu va Muhammadsayyidning mehr, sog‘inch va otaning unutilmas nasihatlari bilan yo‘g‘rilgan oilaviy hikoyasi.',
        cover: {
          id: `${id}_library_cover`,
          src: `${UNUTILMAGAN_BASE}/optimized/cover-library.webp`,
          width: 1000,
          height: 951,
          alt: 'Unutilmagan nasihatlar kitobi muqovasi',
        },
        frontCover: {
          id: `${id}_front_cover`,
          src: `${UNUTILMAGAN_BASE}/optimized/cover-front.webp`,
          width: 2560,
          height: 1298,
          alt: 'Unutilmagan nasihatlar — old muqova',
        },
        backCover: {
          id: `${id}_back_cover`,
          src: `${UNUTILMAGAN_BASE}/optimized/cover-back.webp`,
          width: 2560,
          height: 1298,
          alt: 'Unutilmagan nasihatlar — orqa muqova',
        },
        pageTurnAudioSrc: `${UNUTILMAGAN_BASE}/audio/sound book page.wav`,
        pages: unutilmaganPages(),
        status: 'ready',
      },
    ],
  };
}

// ── Stories ────────────────────────────────────────────────────────
export const STORIES: readonly Story[] = [
  unutilmaganNasihatlar(),
  sampleEpisode(),
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

/** Every slug that should have a Story page — used by
 *  `generateStaticParams`. Scheduled placeholders included so the
 *  spine's "coming soon" nodes have a real antechamber to link to. */
export function allStorySlugs(): string[] {
  return STORIES.filter(
    (s) => s.publicationState !== 'draft' && s.publicationState !== 'withdrawn',
  ).map((s) => s.slug);
}

/** Slugs that have a Reader route — published only. */
export function readableStorySlugs(): string[] {
  return STORIES.filter((s) => s.publicationState === 'published').map(
    (s) => s.slug,
  );
}

/** Previous / next episode within the same series, in episode order. */
export function getAdjacentEpisodes(story: Story): {
  prev?: Story;
  next?: Story;
} {
  if (story.kind !== 'series-episode' || !story.seriesId) return {};
  const eps = getSeriesEpisodes(story.seriesId);
  const i = eps.findIndex((e) => e.id === story.id);
  if (i === -1) return {};
  return { prev: eps[i - 1], next: eps[i + 1] };
}

export interface ReaderData {
  story: Story;
  edition: StoryEdition;
  /** Next episode, if this is a series episode and one exists — for the
   *  "next part" offer at the end. Never auto-plays. */
  nextEpisode?: { slug: string; label: string };
}

/** Everything the Reader route needs for one slug + locale. Returns
 *  null when the slug is unknown or the edition has no pages. Access
 *  (`canRead`) is checked by the route, not here. */
export function getReaderData(slug: string, locale: Locale): ReaderData | null {
  const story = getStoryBySlug(slug);
  if (!story) return null;
  const edition = getEdition(story, locale);
  if (!edition || edition.pages.length === 0) return null;

  const { next } = getAdjacentEpisodes(story);
  const nextEpisode =
    next && next.publicationState === 'published'
      ? {
          slug: next.slug,
          label: `${String(next.episodeOrder ?? 0).padStart(2, '0')}-QISM`,
        }
      : undefined;

  return { story, edition, nextEpisode };
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
