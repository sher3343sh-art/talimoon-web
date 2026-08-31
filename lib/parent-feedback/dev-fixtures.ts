/**
 * TALIMOON — PARENT FEEDBACK — DEVELOPMENT FIXTURES.
 * ================================================================
 * NEVER part of the public dataset and NEVER rendered in production.
 * `feedback.ts` pulls these in via a `require()` gated on
 * `process.env.NODE_ENV === "development"`, which is dead-code
 * eliminated from a production build (same discipline as
 * `lib/journey/dev-fixtures`).
 *
 * Purpose: exercise the carousel, the card, the verified-badge gate
 * and the per-comment reaction system (five reactions incl. the
 * dislike, one active per visitor, switch / remove, long counts)
 * without inventing a claim about a real parent. Every name and every
 * line below is obviously placeholder ("FIXTURE"). Nothing here is a
 * statement about a real person, child, family or experience.
 */

import { ZERO_COUNTS, type ParentFeedback } from "./feedback";

export const DEV_FEEDBACK: ParentFeedback[] = [
  {
    id: "fixture-1",
    displayName: "FIXTURE — Dilnoza",
    content:
      "FIXTURE feedback: shaxsiylashtirilgan hikoya kichkinamizni juda xursand qildi. (placeholder — not a real parent comment)",
    status: "approved",
    verified: true,
    createdAtISO: "2026-01-01T00:00:00.000Z",
    publishedAtISO: "2026-01-02T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS },
  },
  {
    id: "fixture-2",
    displayName: "FIXTURE — Parent B",
    content:
      "FIXTURE feedback: placeholder impression used only for visual QA of the feedback carousel.",
    status: "approved",
    verified: false,
    createdAtISO: "2026-01-03T00:00:00.000Z",
    publishedAtISO: "2026-01-04T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS },
  },
  {
    id: "fixture-3",
    displayName: "FIXTURE — Parent C",
    content:
      "FIXTURE feedback: long-count check — presentation should stay intact whether a total is 0, 9, 99, 999 or 1K+.",
    status: "approved",
    verified: false,
    createdAtISO: "2026-01-05T00:00:00.000Z",
    publishedAtISO: "2026-01-06T00:00:00.000Z",
    reactions: { smile: 0, love: 1240, moved: 0, applause: 99, dislike: 3 },
  },
  {
    id: "fixture-4",
    displayName: "FIXTURE — Parent D",
    content:
      "FIXTURE feedback: a pending item also lives here to confirm only approved rows reach the public list.",
    status: "pending",
    verified: false,
    createdAtISO: "2026-01-07T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS },
  },
  {
    id: "fixture-5",
    displayName: "FIXTURE — Parent E",
    content:
      "FIXTURE feedback: fifth approved placeholder so the five-slot carousel composition can be checked.",
    status: "approved",
    verified: false,
    createdAtISO: "2026-01-08T00:00:00.000Z",
    publishedAtISO: "2026-01-09T00:00:00.000Z",
    reactions: { ...ZERO_COUNTS },
  },
];
