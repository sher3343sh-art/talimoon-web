/**
 * TALIMOON Story Library — content model (V1).
 * ----------------------------------------------------------------
 * Production-shaped, deliberately not enterprise. The rules baked in
 * here, not just described:
 *
 *  • Engagement counts (views / loves / completions) are NEVER stored
 *    on a Story. They are derived from an append-only event log and
 *    surfaced through `StoryEngagementSummary`. Storing them invites
 *    drift and freezes the ranking model.
 *  • Language lives on `StoryEdition`, not `Story`. One Story can gain
 *    UZ / EN / RU / AR editions later — each with its own pages,
 *    audio, title and reading direction — without a rewrite.
 *  • Consent for a family story is a revocable, scoped record, not a
 *    boolean. It can say "in the library but not on Google", and it
 *    can be withdrawn.
 *  • `access` + `publicationState` are the only gates the Reader ever
 *    consults (via `canRead()`), so a future subscription slots in
 *    without touching routes or the Reader.
 *  • Assets are references with generated variants + a blur
 *    placeholder + intrinsic size — the seam for a future
 *    ingest/optimization pipeline and for layout stability.
 */

export type Locale = 'uz' | 'en' | 'ru' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const RTL_LOCALES: readonly Locale[] = ['ar'];
export function directionFor(locale: Locale): Direction {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

/** Two content natures, one Reader. */
export type StoryKind = 'family' | 'series-episode';

/** Small state machine. Family: draft → consent-pending → published →
 *  withdrawn. Series: draft → scheduled → published. */
export type PublicationState =
  | 'draft'
  | 'consent-pending'
  | 'scheduled'
  | 'published'
  | 'withdrawn';

/** V1: everything is `free`. The field exists so a future paid tier is
 *  a data change, not an architecture change. */
export type AccessTier = 'free' | 'premium';

// ── Assets ─────────────────────────────────────────────────────────
export interface AssetVariant {
  format: 'avif' | 'webp' | 'jpg' | 'png';
  width: number;
  url: string;
}

export interface ImageAsset {
  id: string;
  /** Primary renderable URL. Empty string ⇒ the UI shows an on-brand
   *  placeholder instead of a broken image. */
  src: string;
  width: number;
  height: number;
  /** Tiny base64 LQIP; prevents a blank frame and layout shift. */
  blurDataURL?: string;
  variants?: AssetVariant[];
  /** Meaningful description for screen readers. Empty ⇒ decorative. */
  alt?: string;
}

export interface AudioTrack {
  id: string;
  src: string;
  durationSec: number;
}

// ── Pages ──────────────────────────────────────────────────────────
export interface StoryPage {
  /** 0-based. */
  index: number;
  image: ImageAsset;
  /** The page's words as real text, when we have them. This is the
   *  seam that later gives accessibility, search and translation —
   *  keep it even if the words are currently baked into the artwork. */
  text?: string;
  /** Seconds into `edition.audio`. `audioEnd[n]` should equal
   *  `audioStart[n + 1]` (validated on ingest). Absent when the
   *  edition has no narration. */
  audioStartSec?: number;
  audioEndSec?: number;
  /** Optional narration dedicated to this illustrated spread. When
   * present, the Reader advances on this track's `ended` event. */
  audioSrc?: string;
}

// ── Series (Yusuf & Yasmina) ───────────────────────────────────────
export interface Series {
  id: string;
  /** Stable machine key, e.g. 'yusuf-yasmina'. */
  key: string;
  slug: string;
  title: Partial<Record<Locale, string>>;
  blurb: Partial<Record<Locale, string>>;
  lockup?: ImageAsset;
}

// ── Consent (family stories only) ──────────────────────────────────
export interface Consent {
  storyId: string;
  /** Opaque internal reference to the family. NEVER rendered. */
  familyRef: string;
  grantedAtISO: string;
  scope: {
    /** Visible in the library at all. */
    inLibrary: boolean;
    /** May be indexed by search engines. Defaults false. */
    indexable: boolean;
    /** Public comments allowed on this story. */
    commentsEnabled: boolean;
    /** The coarse age band may be shown. */
    showAgeBand: boolean;
  };
  status: 'active' | 'revoked';
  revokedAtISO?: string;
}

// ── Edition (one per language) ─────────────────────────────────────
export interface StoryEdition {
  id: string;
  storyId: string;
  locale: Locale;
  direction: Direction;
  title: string;
  subtitle?: string;
  /** TALIMOON-authored, warm, 1–2 sentences. Not written by families. */
  description: string;
  cover: ImageAsset;
  /** Flat front/back covers used by the immersive Reader. The regular
   * `cover` remains the library-card artwork. */
  frontCover?: ImageAsset;
  backCover?: ImageAsset;
  /** A restrained page-turn effect played between spreads. */
  pageTurnAudioSrc?: string;
  pages: StoryPage[];
  audio?: AudioTrack;
  status: 'ready' | 'in-review' | 'missing-audio';
}

// ── Story (language-independent) ───────────────────────────────────
export interface Story {
  id: string;
  slug: string;
  kind: StoryKind;

  /** series-episode only. Display number is derived from `episodeOrder`. */
  seriesId?: string;
  episodeOrder?: number;

  /** family only. */
  consent?: Consent;
  /** Family-chosen from safe templates: "Made for Amir", "For our
   *  daughter". No surname, no free text. */
  dedication?: string;

  defaultLocale: Locale;
  /** Coarse, opt-in: "4-6". Never a precise age tied to a named child. */
  ageBand?: string;

  publicationState: PublicationState;
  publishedAtISO?: string;
  /** Part of the consent scope for family stories; editorial for series. */
  indexable: boolean;
  access: AccessTier;

  /** Editorial overrides — never derived. */
  featured: boolean;
  recognition?: { kind: 'story-of-month'; periodISO: string } | null;
  commentsEnabled: boolean;

  editions: StoryEdition[];

  /** DEV MARKER — a scaffold entry with no real artwork or copy yet.
   *  The Hall renders these with a "coming soon" treatment and never
   *  shows engagement for them. Remove when real content lands. */
  __placeholder?: boolean;
}

// ── Engagement (append-only events → derived summaries) ─────────────
export type EngagementType =
  | 'story_opened'
  | 'reading_started'
  | 'narration_started'
  | 'page_reached'
  | 'story_completed'
  | 'loved'
  | 'unloved'
  | 'private_negative'
  | 'shared'
  | 'fullscreen_entered'
  | 'resumed';

export interface EngagementEvent {
  actorId: string;
  storyId: string;
  editionLocale: Locale;
  type: EngagementType;
  atISO: string;
  context?: Record<string, string | number | boolean>;
}

/** Derived, rebuildable projection of the event log. */
export interface StoryEngagementSummary {
  storyId: string;
  /** Distinct `story_opened`. Shown calmly, never as a rank. */
  views: number;
  loves: number;
  completions: number;
  /** Whether the current actor has loved this story. */
  lovedByActor?: boolean;
}

// ── Reader state (client) ──────────────────────────────────────────
/** The three states a reader can be in, produced by two switches
 *  (narration on/off · auto-advance on/off). There is no fourth. */
export type ReaderMode = 'storytime' | 'read-together' | 'self';

export interface ReadingProgress {
  slug: string;
  /** 0-based page index. */
  page: number;
  mode: ReaderMode;
  atISO: string;
}

// ── Identity seam ──────────────────────────────────────────────────
/** Today: an anonymous per-device token + an optional name. Later: an
 *  account. Every like / comment / progress / event references
 *  `actorId`, so accounts attach here and nowhere else. */
export interface Actor {
  id: string;
  displayName?: string;
}
