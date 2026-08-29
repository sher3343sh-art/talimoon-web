/**
 * TALIMOON HAYOT (Journey) — content source (V1 foundation).
 * ----------------------------------------------------------------
 * There is NO real published content yet, and the brief forbids
 * fabricating visits, families, events, campaigns or statistics. So
 * the seed arrays below are intentionally empty. HAYOT ships with a
 * premium empty state — never invented volume.
 *
 * Adding the first real entry is a single object pushed to `ENTRIES`
 * (see the fully-worked example at the bottom of this file). No
 * component changes. When this grows past a handful of entries it
 * moves behind a data source (CMS / DB) exposing the exact same
 * accessors below — that is the only seam that matters.
 *
 * These accessors are pure functions over local data with no
 * server-only imports, so they are safe to call from Server and
 * Client Components alike (the same arrangement the Story Library
 * `content.ts` uses).
 */

import {
  directionFor,
  type Direction,
  type EntryContent,
  type JourneyEntry,
  type Locale,
  type PulseItem,
  type PulseSeed,
} from './types';

// ── Seed ───────────────────────────────────────────────────────────
/**
 * EDITORIAL SEED — three genuine TALIMOON "bir fikr" pieces.
 * ----------------------------------------------------------------
 * These are real editorial reflections on childhood in TALIMOON's
 * voice — the kind of writing the brief itself describes as a HAYOT
 * content format. They make NO claim about any real child, family,
 * visit, event, partnership or statistic, and need no photograph.
 * They are the honest content HAYOT ships with until reportage,
 * interviews and film arrive.
 *
 * Each is freely replaceable: swap the object, or drop it, without
 * touching a component. `featured: true` on the first pins it to THE
 * OPENING; the other two flow into the HAYOTDAN stream. When real
 * photographic content lands, a `reportage` / `moment` entry with a
 * `cover` and `media.consent: 'granted'` exercises the photographic
 * treatments already built into TheOpening and the stream.
 */
const SEED_THOUGHT_NEGA: JourneyEntry = {
  id: 'jrn_thought_nega',
  slug: 'bolaning-nega-si',
  format: 'thought',
  weight: 'lead',
  status: 'published',
  featured: true,
  publishedAtISO: '2026-08-27T09:00:00.000Z',
  tags: ['bir-fikr', 'tarbiya'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: 'BIR FIKR' },
      title: "Bolaning 'Nega?' degani ba'zan javobdan ham muhimroq.",
      standfirst:
        "Biz javob berishga shoshamiz. Lekin ba'zan eng qimmatlisi — bolaning savol berishdan to'xtamasligi.",
      blocks: [
        {
          t: 'paragraph',
          text: "Bola bir savol beradi. Biz unga to'g'ri, aniq javob beramiz — va shu bilan suhbat tugaydi. Savol esa bola uchun eshik edi; biz uni biroz tez yopdik.",
        },
        {
          t: 'paragraph',
          text: "Ba'zan javobni bir lahza ushlab turib, “O'zing qanday o'ylaysan?” deb so'rash — bolaning tasavvuriga qoldirilgan kichik bo'sh joy. O'sha joyda u mustaqil fikrlashni o'rganadi.",
        },
      ],
    },
    en: {
      kicker: { label: 'A THOUGHT' },
      title: 'A child’s "why?" can matter more than the answer.',
      standfirst:
        'We rush to answer. Sometimes what matters most is simply that the child keeps asking.',
      blocks: [
        {
          t: 'paragraph',
          text: 'A child asks a question. We give a clear, correct answer — and the conversation ends. But the question was a door, and we closed it a little too quickly.',
        },
        {
          t: 'paragraph',
          text: 'Sometimes holding the answer for a moment and asking “what do you think?” leaves a small open space for the child’s imagination. In that space, they learn to think for themselves.',
        },
      ],
    },
  },
};

const SEED_THOUGHT_TASAVVUR: JourneyEntry = {
  id: 'jrn_thought_tasavvur',
  slug: 'tasavvurga-vaqt',
  format: 'thought',
  weight: 'standard',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-20T09:00:00.000Z',
  tags: ['bir-fikr', 'tasavvur'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: 'BIR FIKR' },
      title: 'Farzandimizning tasavvuriga ham vaqt qoldiryapmizmi?',
      standfirst:
        "Bo'sh daqiqa — zerikish emas. Ko'pincha aynan o'sha yerda o'yin, hikoya va yangi fikr tug'iladi.",
      blocks: [
        {
          t: 'paragraph',
          text: "Bolaning kuni ba'zan to'liq belgilangan bo'ladi: dars, mashg'ulot, ekran. Har bir daqiqa foydali bo'lsin degan niyat — chiroyli. Lekin tasavvur bo'sh joyni talab qiladi.",
        },
        {
          t: 'paragraph',
          text: "Devor ortidagi soyani ajdarhoga aylantirish, tayoqdan qilich yasash, xayolan uzoq shaharga borish — bularning hammasi zerikish chegarasida boshlanadi. Biz shu chegarani saqlab qololsak, bola o'zi uchun butun bir olam yaratadi.",
        },
      ],
    },
    en: {
      kicker: { label: 'A THOUGHT' },
      title: 'Are we leaving room for our child’s imagination too?',
      standfirst:
        'An empty minute is not wasted time. It is often exactly where play, story and a new idea begin.',
      blocks: [
        {
          t: 'paragraph',
          text: 'A child’s day can be fully scheduled — lessons, activities, a screen. The wish to make every minute useful is a kind one. But imagination asks for empty space.',
        },
        {
          t: 'paragraph',
          text: 'Turning a shadow on the wall into a dragon, making a sword from a stick, travelling in the mind to a far city — these begin at the edge of boredom. If we can protect that edge, the child builds a whole world of their own.',
        },
      ],
    },
  },
};

const SEED_THOUGHT_HIKOYA: JourneyEntry = {
  id: 'jrn_thought_hikoya',
  slug: 'birga-oqilgan-hikoya',
  format: 'thought',
  weight: 'quiet',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-13T09:00:00.000Z',
  tags: ['bir-fikr', 'birga-oqish'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: 'BIR FIKR' },
      title: "Birga o'qilgan hikoya qayerda tugaydi?",
      standfirst:
        "Kitob yopiladi, lekin suhbat davom etadi — yo'lda, kechki ovqatda, uxlashdan oldin.",
      blocks: [
        {
          t: 'paragraph',
          text: "Ko'pincha eng qimmatli qism — oxirgi sahifadan keyin boshlanadi. “Nega u shunday qildi?”, “Sen bo'lsang-chi?” — hikoya bola bilan qoladi.",
        },
        {
          t: 'paragraph',
          text: "Shu bois biz hikoyani shunchaki o'qib berish uchun emas, birga o'ylash uchun yaratamiz. Yaxshi hikoya javob bermaydi — u savolni ochiq qoldiradi.",
        },
      ],
    },
    en: {
      kicker: { label: 'A THOUGHT' },
      title: 'Where does a story read together actually end?',
      standfirst:
        'The book closes, but the conversation goes on — on the way home, at dinner, before sleep.',
      blocks: [
        {
          t: 'paragraph',
          text: 'Often the most valuable part starts after the last page. “Why did they do that?”, “What would you have done?” — the story stays with the child.',
        },
        {
          t: 'paragraph',
          text: 'That is why we make stories to think about together, not only to read aloud. A good story does not hand over an answer — it leaves the question open.',
        },
      ],
    },
  },
};

/** Published / archived / scheduled / draft entries, in any order —
 *  the accessors sort. */
const ENTRIES: readonly JourneyEntry[] = [
  SEED_THOUGHT_NEGA,
  SEED_THOUGHT_TASAVVUR,
  SEED_THOUGHT_HIKOYA,
];

/**
 * YAQIN KUNLAR forward-pulse items not (yet) backed by a full entry.
 * Empty until there is something genuinely upcoming — the band is
 * hidden entirely while this is empty (never a placeholder).
 */
const PULSE: readonly PulseSeed[] = [];

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
 * A window into the active stream (published only, newest first),
 * excluding whichever entry is currently THE OPENING so it is not
 * shown twice.
 */
export function getStreamEntries(
  opts: { offset?: number; limit?: number } = {},
): StreamPage {
  const offset = Math.max(0, opts.offset ?? 0);
  const limit = Math.max(0, opts.limit ?? STREAM_PAGE_SIZE);

  const featuredId = getFeaturedEntry()?.entry.id;
  const all = ENTRIES.filter(isInStream)
    .filter((e) => e.id !== featuredId)
    .sort(byNewest);

  return {
    entries: all.slice(offset, offset + limit),
    total: all.length,
    hasMore: offset + limit < all.length,
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

/* ============================================================
 * WORKED EXAMPLE — shape reference only. NOT real content, NOT
 * exported, NOT rendered anywhere. Delete once the first real
 * entry lands in `ENTRIES`.
 *
 * const example: JourneyEntry = {
 *   id: 'jrn_0001',
 *   slug: 'bir-kitobdan-boshlangan-suhbat',
 *   format: 'reportage',
 *   weight: 'lead',
 *   status: 'published',
 *   featured: true,
 *   publishedAtISO: '2026-08-29T09:00:00.000Z',
 *   tags: ['tashrif', 'bogcha'],
 *   defaultLocale: 'uz',
 *   cover: {
 *     id: 'jrn_0001_cover',
 *     src: '/images/journey/0001/cover.jpg',
 *     width: 2000,
 *     height: 1333,
 *     blurDataURL: 'data:image/jpeg;base64,...',
 *   },
 *   indexable: true,
 *   media: { consent: 'granted' },
 *   relatedSlugs: [],
 *   translations: {
 *     uz: {
 *       kicker: { label: 'TASHRIF', dateLabel: '29 AVGUST' },
 *       title: 'Bir kitobdan boshlangan suhbat',
 *       standfirst: 'Bir bogchada, bitta kitob va oittizta savol.',
 *       coverAlt: 'Bolalar bir kitob atrofida oltirib, sahifaga qarab turibdi.',
 *       blocks: [
 *         { t: 'paragraph', text: '…' },
 *         { t: 'image', asset: { id: 'jrn_0001_p1', src: '/images/journey/0001/p1.jpg', width: 2000, height: 1333 }, alt: '…', full: true },
 *         { t: 'quote', text: '…', attribution: '…', role: 'murabbiy' },
 *       ],
 *     },
 *     en: {
 *       kicker: { label: 'A VISIT', dateLabel: 'AUGUST 29' },
 *       title: 'A conversation that began with one book',
 *       standfirst: 'One kindergarten, one book, thirty questions.',
 *       coverAlt: 'Children gathered around a book, looking at the page.',
 *       blocks: [{ t: 'paragraph', text: '…' }],
 *     },
 *   },
 * };
 * ============================================================ */
