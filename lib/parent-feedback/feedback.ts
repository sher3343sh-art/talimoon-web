/**
 * TALIMOON — PARENT / COMMUNITY FEEDBACK — content model.
 * ================================================================
 * This is TALIMOON's parent feedback area, NOT a place where families
 * submit "stories". Parents leave opinions, impressions, comments and
 * suggestions about TALIMOON; the public carousel shows the ones that
 * have been APPROVED by moderation.
 *
 * The word "hikoya" may still appear INSIDE a real comment when a
 * parent is talking about a TALIMOON story/book — that is the PRODUCT,
 * not the comment. The comment itself is a `ParentFeedback`.
 *
 * Honest-data rule (see AGENTS.md / the Journey + Story Library
 * models): nothing is passed off as a genuine parent testimonial.
 * `PUBLISHED_FEEDBACK` currently holds a small set of clearly-labelled
 * EXAMPLE entries (`isExample: true`) so parents can see the finished
 * section; every one renders a visible "NAMUNA" tag and none is shown
 * as a verified family. They are a placeholder for layout, not social
 * proof — delete them the moment real, moderated feedback exists.
 * Zero approved comments is still a valid state (the section then
 * renders its empty state).
 *
 * This module is the seam a real moderation backend / CMS drops into:
 * the section only ever reads `getPublishedFeedback()`, never a
 * hand-written comment in TSX. When a backend exists, that function
 * returns rows where `status === "approved"`, with `reactions` being
 * server-aggregated counts; nothing else in the UI has to change.
 */

/** The five reaction types. Order is the display order in the card. */
export const REACTION_TYPES = [
  "smile",
  "love",
  "moved",
  "applause",
  "dislike",
] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export type ReactionCounts = Record<ReactionType, number>;

export const ZERO_COUNTS: ReactionCounts = {
  smile: 0,
  love: 0,
  moved: 0,
  applause: 0,
  dislike: 0,
};

export function isReactionType(value: unknown): value is ReactionType {
  return (
    typeof value === "string" &&
    (REACTION_TYPES as readonly string[]).includes(value)
  );
}

/** Emoji per reaction — presentation only; meaning is carried by the
 *  localized accessible label, never by the emoji alone. */
export const REACTION_EMOJI: Record<ReactionType, string> = {
  smile: "😊",
  love: "❤️",
  moved: "🥹",
  applause: "👏",
  dislike: "👎",
};

/**
 * Moderation state machine:
 *   submitted → pending → approved | rejected
 * Only `approved` feedback is ever returned to the public UI. If an
 * approved comment is later unpublished, it stops being returned here
 * and its reactions stop appearing publicly.
 */
export type FeedbackStatus = "pending" | "approved" | "rejected";

export interface ParentFeedback {
  /** Stable id — used as the carousel key and the reaction scope, so
   *  reaction state survives the card moving through the carousel. */
  id: string;
  /** Approved public display name (a first name, or "<Child>'s mother"
   *  style). Never a full family name unless the parent chose it. */
  displayName: string;
  /** The parent's own words. */
  content: string;
  /** Moderation state. The public accessor only returns `approved`. */
  status: FeedbackStatus;
  /**
   * TRUE only when TALIMOON has genuinely verified this is a real
   * customer/family through moderation. Never inferred, never
   * defaulted to true. Gates the "TASDIQLANGAN TALIMOON OILASI" badge.
   */
  verified: boolean;
  /**
   * TRUE for the temporary, clearly-labelled EXAMPLE entries that
   * currently populate the section so parents can see what it will
   * look like. Such a card always renders a visible "NAMUNA" tag and
   * is never shown as a genuine verified family. Remove these the
   * moment real approved feedback exists — placeholder, not proof.
   */
  isExample?: boolean;
  createdAtISO: string;
  /** Set when moderation approved it. */
  publishedAtISO?: string;
  /**
   * Server-aggregated reaction totals for this comment. With no
   * backend yet these are all zero; the reaction store adds this
   * visitor's own active reaction on top at render time.
   */
  reactions: ReactionCounts;
}

/**
 * PRODUCTION list. Real approved parent comments (or a CMS / back-office
 * feed) replace this later — a real one is just one more object with
 * `isExample` omitted.
 *
 * For now it holds five TEMPORARY, clearly-labelled EXAMPLE entries so
 * the section reads as designed instead of sitting empty. Each renders
 * a "NAMUNA" tag, none is `verified`, and the illustrative reaction
 * counts are deliberately tiny (no 😊 seeding) — not social proof.
 * DELETE all five as soon as genuine moderated feedback exists.
 */
const PUBLISHED_FEEDBACK: ParentFeedback[] = [
  {
    id: "example-1",
    displayName: "Dilnoza",
    content:
      "Farzandim o‘z ismini kitob qahramoni sifatida ko‘rganda hayratdan qotib qoldi. Endi har oqshom aynan o‘sha kitobni o‘qib berishimni so‘raydi.",
    status: "approved",
    verified: false,
    isExample: true,
    createdAtISO: "2026-08-01T00:00:00.000Z",
    publishedAtISO: "2026-08-02T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS, love: 2 },
  },
  {
    id: "example-2",
    displayName: "Aziza",
    content:
      "Kitobning sifati zo‘r, rasmlari juda chiroyli chiqibdi. Yetkazib berish ham va’da qilinganidan tezroq bo‘ldi.",
    status: "approved",
    verified: false,
    isExample: true,
    createdAtISO: "2026-08-03T00:00:00.000Z",
    publishedAtISO: "2026-08-04T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS, applause: 1 },
  },
  {
    id: "example-3",
    displayName: "Munira",
    content:
      "Nabiramga sovg‘a qildim. Oilada birga o‘tirib o‘qidik — bolaning ko‘zlari chaqnab ketdi, biz uchun ham unutilmas oqshom bo‘ldi.",
    status: "approved",
    verified: false,
    isExample: true,
    createdAtISO: "2026-08-05T00:00:00.000Z",
    publishedAtISO: "2026-08-06T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS, moved: 1 },
  },
  {
    id: "example-4",
    displayName: "Shahnoza",
    content:
      "Mahsulot yoqdi. Kelajakda kattaroq yoshdagi bolalar uchun ham shunday kitoblar chiqsa, albatta yana buyurtma beramiz.",
    status: "approved",
    verified: false,
    isExample: true,
    createdAtISO: "2026-08-07T00:00:00.000Z",
    publishedAtISO: "2026-08-08T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS },
  },
  {
    id: "example-5",
    displayName: "Kamola",
    content:
      "Bolam kitobdagi voqealarni o‘z hayoti bilan solishtira boshladi. Tarbiyaviy ta’siri sezilarli — ayniqsa mehr va halollik haqidagi qismlar.",
    status: "approved",
    verified: false,
    isExample: true,
    createdAtISO: "2026-08-09T00:00:00.000Z",
    publishedAtISO: "2026-08-10T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS, love: 1, dislike: 1 },
  },
];

/**
 * The public feedback list. In production this is `PUBLISHED_FEEDBACK`
 * (empty until real data). In development it also includes the
 * isolated fixtures so the carousel / cards / reactions can be
 * regression-checked — dead-code-eliminated from a production build,
 * same discipline as `lib/journey/dev-fixtures`.
 */
export function getPublishedFeedback(): ParentFeedback[] {
  const rows = [...PUBLISHED_FEEDBACK];

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DEV_FEEDBACK } = require("./dev-fixtures") as {
      DEV_FEEDBACK: ParentFeedback[];
    };
    rows.push(...DEV_FEEDBACK);
  }

  return rows.filter((row) => row.status === "approved");
}

/**
 * Presentation-level count formatting. Storage always keeps the exact
 * integer; only the rendered string is abbreviated so a long-running
 * count never breaks the card layout.
 *   0 → "0"   9 → "9"   999 → "999"   1500 → "1.5K"   24000 → "24K"
 */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  const rounded = k < 10 ? Math.round(k * 10) / 10 : Math.round(k);
  return `${rounded}K`;
}
