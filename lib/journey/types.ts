/**
 * TALIMOON HAYOT (Journey) — content model (V1 foundation).
 * ----------------------------------------------------------------
 * HAYOT is a publishing product: entries change without a code
 * deploy. These types are the seam a future CMS drops into — the
 * page renderers only ever touch the accessors in `content.ts`,
 * never this shape directly, and never a hand-written entry in TSX.
 *
 * Rules baked in here, not just described:
 *
 *  • Engagement (views / opens / completions) is NEVER stored on an
 *    entry. It belongs to an append-only event log (added later),
 *    surfaced through a derived summary — same discipline as the
 *    Story Library model. There is deliberately no `views` field.
 *  • `featured` is an EDITORIAL pin to THE OPENING. It is never
 *    derived from recency. A stale pin is handled by the accessor
 *    (`getFeaturedEntry` reports `source: 'featured-stale'`), not by
 *    silently promoting the newest entry.
 *  • Language lives per-entry in `translations` (one `EntryContent`
 *    per locale). A missing translation falls back to
 *    `defaultLocale` — resolved by `resolveEntryContent`, which also
 *    reports `isFallback` so the UI can note "available in another
 *    language". Language-neutral facts (format, weight, dates, tags,
 *    media) stay on `JourneyEntry`.
 *  • Child / family privacy is architectural: `media.consent` gates
 *    whether renderers may show recognisable people. `'none'` (people
 *    present, no consent) must never render a face; `'not-applicable'`
 *    (no people) is safe. Removing an entry from `content.ts` (or the
 *    CMS) removes it completely — assets are plain referenced files,
 *    nothing is baked into a composite.
 *  • Campaign state (`upcoming` / `active` / `ended`) is DERIVED from
 *    the window vs. now (`campaignState()`), never stored, so
 *    "YAKUNLANDI" can't be forgotten.
 *  • Taxonomy (`tags`) exists from day one but is NOT surfaced as a
 *    filter/search UI in V1 — architected, not exposed.
 *
 * Locale codes here are lowercase ('uz'), matching the Story Library
 * model and URL/content conventions; the site LanguageContext uses
 * uppercase ('UZ'). `toLocale()` maps between them at the component
 * edge.
 */

// ── Locale / direction ─────────────────────────────────────────────
export type Locale = 'uz' | 'en' | 'ru' | 'ar';
export type Direction = 'ltr' | 'rtl';

const RTL_LOCALES: readonly Locale[] = ['ar'];

export function directionFor(locale: Locale): Direction {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

/** Site language ("UZ" | "EN" | "RU" | "AR") → content locale. */
export function toLocale(language: string): Locale {
  const l = language.toLowerCase();
  return l === 'uz' || l === 'en' || l === 'ru' || l === 'ar'
    ? (l as Locale)
    : 'en';
}

// ── Media ──────────────────────────────────────────────────────────
/**
 * A referenced image. Mirrors `ImageAsset` in the Story Library
 * model; kept local so the two content systems stay decoupled (a
 * shared media package would be over-engineering at this scale).
 * `src === ''` ⇒ the UI shows an on-brand placeholder, never a
 * broken image. `width`/`height` are required to reserve layout
 * space (no CLS). `alt` here is language-neutral / decorative;
 * meaningful, translated alt text lives per-locale (`coverAlt`, and
 * the `alt` on image blocks).
 */
export interface JourneyImage {
  id: string;
  src: string;
  width: number;
  height: number;
  /** Tiny base64 LQIP — prevents a blank frame. */
  blurDataURL?: string;
  alt?: string;
  /** Photographer / source line, e.g. "Foto: Aziza R." — a name, so
   *  language-neutral. Rendered small, near the image. */
  credit?: string;
}

/**
 * A referenced video. In the stream and the detail canvas only the
 * `poster` image loads until the visitor opts in — the media itself
 * is fetched on play (no autoplay, no preload). `captionsSrc` /
 * `transcript` are architected now even when empty.
 */
export interface JourneyVideo {
  poster: JourneyImage;
  provider: 'file' | 'youtube';
  /** File URL, or a YouTube video id. */
  src: string;
  durationSec: number;
  /** WebVTT captions track. Kept in the model even when empty so the
   *  accessibility path is ready before captions are produced. */
  captionsSrc?: string;
  /** Full text alternative, shown in a collapsible panel. */
  transcript?: string;
  credit?: string;
}

// ── Editorial world ────────────────────────────────────────────────
/**
 * The three editorial worlds inside Journey (V2). One shared
 * editorial engine — the world is a label + a filter, never a
 * separate component system or a colour theme.
 *
 *  • `talimoon-life`   — TALIMOON HAYOTI: what is happening in and
 *    around TALIMOON (news, visits, reportage, events, campaigns…).
 *    The YAQIN KUNLAR pulse belongs here.
 *  • `parents`         — OTA-ONALAR UCHUN: concise, trustworthy
 *    content that helps parents understand children and family life.
 *  • `wisdom-science`  — HIKMAT ORTIDAGI ILM: everyday habits
 *    explained through reliable modern evidence. EDITORIAL RULE —
 *    evidence first, conclusion second; never claim the evidence
 *    proves a predetermined (e.g. religious) conclusion it does not
 *    support. The public article begins from the evidence/question.
 */
export type JourneyWorld = 'talimoon-life' | 'parents' | 'wisdom-science';

export const JOURNEY_WORLDS: readonly JourneyWorld[] = [
  'talimoon-life',
  'parents',
  'wisdom-science',
];

/** URL slug ⇄ world. `/journey/talimoon`, `/journey/parents`,
 *  `/journey/wisdom` are architected; they render a minimal world
 *  landing (identity + that world's stream, or an empty state). */
export const WORLD_SLUG: Record<JourneyWorld, string> = {
  'talimoon-life': 'talimoon',
  parents: 'parents',
  'wisdom-science': 'wisdom',
};
export const WORLD_BY_SLUG: Record<string, JourneyWorld> = {
  talimoon: 'talimoon-life',
  parents: 'parents',
  wisdom: 'wisdom-science',
};

/** World display strings — plain data (no JSX) so server code
 *  (`generateMetadata`, sitemaps) can use it too. Components read it
 *  via `WORLD_NAME` in `components/journey/shared.tsx`. */
export const WORLD_NAME_KEYS: Record<
  JourneyWorld,
  { uz: string; en: string; blurbUz: string; blurbEn: string }
> = {
  'talimoon-life': {
    uz: 'TALIMOON HAYOTI',
    en: 'TALIMOON LIFE',
    blurbUz: 'TALIMOON atrofidagi haqiqiy hikoyalar, tashriflar va voqealar.',
    blurbEn: 'Real stories, visits and what is happening around TALIMOON.',
  },
  parents: {
    uz: 'OTA-ONALAR UCHUN',
    en: 'FOR PARENTS',
    blurbUz: 'Bolani va oila hayotini yaxshiroq tushunish uchun foydali g‘oyalar.',
    blurbEn: 'Useful ideas for understanding children and family life.',
  },
  'wisdom-science': {
    uz: 'HIKMAT ORTIDAGI ILM',
    en: 'THE SCIENCE BEHIND WISDOM',
    blurbUz: 'Kundalik foydali odatlarning zamonaviy dalillar asosida izohi.',
    blurbEn: 'Everyday habits explained through reliable modern evidence.',
  },
};

// ── Editorial format & weight ──────────────────────────────────────
/**
 * WHAT an entry is. The renderer picks a treatment per format; none
 * of them share a card container. Formats span all three worlds and
 * all use the shared Journey editorial engine.
 */
export type JourneyFormat =
  | 'news' // short reported item
  | 'reportage' // photo-led feature / visit
  | 'photo-story' // photo essay (renders like reportage)
  | 'video' // video story
  | 'thought' // "bir fikr" — type only, never an image
  | 'guide' // practical parent guidance
  | 'book-insight' // TALIMOON synthesis of a book, attributed
  | 'research-explainer' // evidence-based explanation of a habit
  | 'interview' // "suhbat" — quote-led, portrait secondary
  | 'event' // a visit / gathering
  | 'campaign' // "tanlov" — state-aware, stays as history
  | 'moment'; // micro: one photo + ~20 words

/**
 * HOW MUCH space an entry claims in the stream. Editorial; a sane
 * default is applied per format. The stream composition never places
 * two `feature`+ entries adjacent without a `quiet`/`thought` between
 * them — that constraint keeps asymmetry composed, not chaotic.
 */
export type JourneyWeight = 'lead' | 'feature' | 'standard' | 'quiet';

/**
 * Small state machine. `draft` → `scheduled` (has a future
 * `publishedAtISO`) → `published` → `archived` (kept as history,
 * still reachable at its URL, out of the active stream).
 */
export type EntryStatus = 'draft' | 'scheduled' | 'published' | 'archived';

/**
 * The child / family privacy gate. `granted` — consent on file,
 * people may be shown. `none` — people are present but there is no
 * consent; renderers MUST NOT show a recognisable face (crop / omit
 * / use a non-identifying frame). `not-applicable` — no people in
 * the media; safe to show.
 */
export type MediaConsent = 'granted' | 'none' | 'not-applicable';

// ── Campaign ("tanlov") ────────────────────────────────────────────
/** The window; state is derived by `campaignState()`, never stored. */
export interface CampaignWindow {
  startISO: string;
  endISO: string;
  participateHref?: string;
  /** Filled once the campaign has ended and results exist. */
  resultsHref?: string;
}

// ── Sources / references ───────────────────────────────────────────
/**
 * A first-class reference for `parents` and `wisdom-science` content.
 * Never fabricated. For copyrighted books the editorial approach is
 * original TALIMOON synthesis + short attributed quotation, not
 * reproduction of substantial passages.
 */
export type ReferenceKind = 'book' | 'research' | 'expert' | 'organization';

export interface Reference {
  kind: ReferenceKind;
  /** Author(s) — book / paper / expert. */
  author?: string;
  /** Book title, paper title, or organisation name. */
  title?: string;
  /** Book edition, e.g. "2nd ed.". */
  edition?: string;
  /** Page or chapter reference for a short attributed quotation. */
  pages?: string;
  /** Journal / publisher / institution. */
  publisher?: string;
  /** Publication year. */
  year?: number;
  url?: string;
  doi?: string;
  /** Expert role, e.g. "child psychologist". */
  role?: string;
  /** One short line of context (why this source, what it says). */
  note?: string;
}

// ── Editorial block canvas (detail page) ───────────────────────────
/**
 * The flexible per-entry content canvas. A visit becomes a photo
 * essay, an interview a Q&A, a thought a text-first essay — one
 * coherent system, no rigid article template. Rendered by the
 * detail route (a later increment); defined now so entries can carry
 * real body content from day one.
 */
export type Block =
  | { t: 'paragraph'; text: string }
  | { t: 'heading'; level: 2 | 3; text: string }
  | { t: 'image'; asset: JourneyImage; alt: string; caption?: string; full?: boolean }
  | {
      t: 'imagePair';
      a: JourneyImage;
      b: JourneyImage;
      altA: string;
      altB: string;
      caption?: string;
    }
  | { t: 'gallery'; items: { asset: JourneyImage; alt: string }[] }
  | { t: 'video'; video: JourneyVideo }
  | { t: 'quote'; text: string; attribution?: string; role?: string }
  | { t: 'note'; text: string }
  | { t: 'cta'; label: string; href: string }
  | { t: 'embed'; provider: string; url: string }
  | { t: 'spacer'; size: 'sm' | 'md' | 'lg' };

// ── Per-locale content ─────────────────────────────────────────────
export interface EntryContent {
  /** e.g. { label: 'TASHRIF', dateLabel: '29 AVGUST' }. `moment` and
   *  `thought` entries often have only a label, or none. */
  kicker?: { label: string; dateLabel?: string };
  /** `thought` / `moment` entries may omit a headline entirely. */
  title?: string;
  /** 1–2 sentence editorial intro shown in the stream / opening. */
  standfirst?: string;
  /** Meaningful, translated alt for `entry.cover`. */
  coverAlt?: string;
  /** Byline / photographer / source line for the whole story, e.g.
   *  "So'z: Aziza R. · Foto: Sardor K." Shown small, near the
   *  header. `JourneyImage.credit` handles per-image credits. */
  credit?: string;
  /** Editorial attribution — who wrote / prepared this. Localisable
   *  because the label around it is ("TALIMOON tahririyati"). */
  author?: string;
  /** The single "key idea" a `guide` / `research-explainer` turns on —
   *  pulled out in the detail header and the parent feature. */
  keyIdea?: string;
  /** Drives `interview` layout; also usable as a stream treatment. */
  pullQuote?: { text: string; attribution?: string; role?: string };
  /** The detail-page body. */
  blocks: Block[];
}

// ── Entry (language-independent) ───────────────────────────────────
export interface JourneyEntry {
  id: string;
  slug: string;
  /** Which of the three editorial worlds this belongs to. */
  world: JourneyWorld;
  format: JourneyFormat;
  weight: JourneyWeight;
  status: EntryStatus;

  /** Editorial pin to THE OPENING. Never derived. May be from any
   *  world. */
  featured: boolean;
  /** Editorial pin to the landing's PARENT FEATURE slot. Only
   *  meaningful when `world === 'parents'`. */
  parentFeature?: boolean;
  /** ISO. For `scheduled` entries this is in the future. */
  publishedAtISO: string;
  updatedAtISO?: string;

  /** Topics / taxonomy — not a filter UI yet, architected for later. */
  tags: string[];

  /** Sources — first-class for `parents` / `wisdom-science`. Rendered
   *  as a quiet "MANBALAR / SOURCES" section. Never fabricated. */
  references?: Reference[];

  defaultLocale: Locale;
  /** One `EntryContent` per available language. `defaultLocale` is
   *  expected to be present; `resolveEntryContent` degrades safely if
   *  not. */
  translations: Partial<Record<Locale, EntryContent>>;

  /** Atmospheric / lead image. Meaningful alt is `EntryContent.coverAlt`. */
  cover?: JourneyImage;
  /** Present for `format === 'video'`, or any entry with a film. */
  video?: JourneyVideo;
  /** Present for `format === 'campaign'`. */
  campaign?: CampaignWindow;

  /** Search-engine indexability — consent-scoped for entries with people. */
  indexable: boolean;
  media: { consent: MediaConsent };

  /** Editorial "read next" — resolved + filtered to still-public entries. */
  relatedSlugs?: string[];
  seo?: { ogImage?: JourneyImage; canonical?: string };
}

// ── YAQIN KUNLAR — the forward pulse ───────────────────────────────
/**
 * Some upcoming things (a scheduled episode, a planned visit) are
 * not yet a full entry, so the pulse has its own small seed shape.
 * `state` is derived from `dateISO` vs. now by `getPulse()`.
 */
export type PulseStrand =
  | 'episode'
  | 'visit'
  | 'campaign'
  | 'story'
  | 'announcement';

export type PulseState = 'upcoming' | 'today' | 'past';

export interface PulseSeed {
  id: string;
  /** The day it happens / opens. */
  dateISO: string;
  strand: PulseStrand;
  label: Partial<Record<Locale, string>>;
  title: Partial<Record<Locale, string>>;
  href?: string;
}

/** A pulse item resolved for one locale, with its derived state. */
export interface PulseItem {
  id: string;
  dateISO: string;
  strand: PulseStrand;
  label: string;
  title: string;
  href?: string;
  state: PulseState;
}
