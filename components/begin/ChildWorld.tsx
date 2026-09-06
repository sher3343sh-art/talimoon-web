"use client";

/**
 * "FAYZBEKNING DUNYOSI" / "FAYZBEKNING XARAKTERI" — the evolving
 * portrait of the child that Phase 02 and Phase 03 gradually write.
 * A tonal editorial canvas, never a dashboard card / report card:
 * warm surface, one hairline, restrained gold micro-labels, generous
 * space. New details arrive with a quiet fade; nothing else moves.
 *
 * variant:
 *   "aside"   — the sticky companion column on desktop
 *   "compact" — a slim panel under the interaction on mobile
 *   "full"    — the centre of a completion milestone (+ a summary)
 * phase:
 *   "world"     — show the Phase 02 layer only
 *   "character" — also show the Phase 03 layer; the "full" summary is
 *                 then the character summary
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ChildProfile } from "@/lib/order/types";
import {
  composeSummary,
  interestDetailsDisplay,
  interestsDisplay,
  phase02Copy,
  type Locale,
} from "@/lib/order/phase02-copy";
import {
  composeCharSummary,
  growthDisplay,
  phase03Copy,
  qualitiesDisplay,
  valuesDisplay,
} from "@/lib/order/phase03-copy";

type Row = { key: string; label: string; value: string; sub?: string };

function worldRows(child: ChildProfile, locale: Locale): Row[] {
  const c = phase02Copy(locale);
  const rows: Row[] = [];
  const interests = interestsDisplay(child.interests, locale);
  if (interests) {
    rows.push({ key: "loves", label: c.pLoves, value: interests });
  }
  const details = interestDetailsDisplay(child.interests);
  if (details) {
    rows.push({ key: "detail", label: c.pDetail, value: details });
  }
  if (child.favoriteActivity?.trim() && !child.noFavoriteActivity) {
    rows.push({ key: "absorbs", label: c.pAbsorbs, value: child.favoriteActivity.trim() });
  }
  if (child.dreamStatus === "has-dream" && child.childDream?.trim()) {
    rows.push({ key: "dreams", label: c.pDreams, value: child.childDream.trim() });
  }
  if (child.dreamStatus === "not-yet" && child.adultHope?.trim()) {
    rows.push({ key: "hope", label: c.pHope, value: child.adultHope.trim() });
  }
  return rows;
}

function charRows(child: ChildProfile, locale: Locale): Row[] {
  const characterLocale = locale === "uz" ? "uz" : "en";
  const c = phase03Copy(locale);
  const rows: Row[] = [];
  const qualities = qualitiesDisplay(child.appreciatedQualities, characterLocale);
  if (qualities) {
    // Each selected quality's own written detail (spec §4) — joined for
    // the portrait's one supporting line; "no example" items add nothing.
    const detail = (child.appreciatedQualities ?? [])
      .map((a) => (a.detail ?? "").trim())
      .filter(Boolean)
      .join(" · ");
    rows.push({
      key: "qualities",
      label: c.pQualities,
      value: qualities,
      sub: detail || undefined,
    });
  }
  const growth = !child.noGrowthArea ? growthDisplay(child.growthBehaviors, characterLocale) : "";
  if (growth) {
    // A prepared behaviour is shown as its dignified word; the adult's
    // own words are shown as written (never re-worded).
    rows.push({ key: "growth", label: c.pGrowth, value: growth });
  }
  const values = valuesDisplay(child.desiredValues, characterLocale);
  if (values) rows.push({ key: "values", label: c.pValues, value: values });
  return rows;
}

function Section({
  label,
  rows,
  reduced,
  startIndex,
}: {
  label: string;
  rows: Row[];
  reduced: boolean;
  startIndex: number;
}) {
  const anim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: -4 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.24, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] as const },
        };
  return (
    <>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
        {label}
      </p>
      <div className="mt-4 divide-y divide-border-subtle">
        {rows.map((row, i) => (
          <motion.div
            key={row.key}
            {...anim(startIndex + i)}
            className="py-3 first:pt-0 last:pb-0"
          >
            <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              {row.label}
            </p>
            <p className="mt-1 font-display text-[16px] leading-[1.4] text-text-primary">
              {row.value}
            </p>
            {row.sub && (
              <p className="mt-1 font-sans text-[13px] leading-[1.5] text-text-secondary">
                {row.sub}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}

export function ChildWorld({
  child,
  locale,
  variant,
  phase = "world",
}: {
  child: ChildProfile;
  locale: Locale;
  variant: "aside" | "compact" | "full";
  phase?: "world" | "character";
}) {
  const reduced = useReducedMotion();
  const wRows = worldRows(child, locale);
  const cRows = phase === "character" ? charRows(child, locale) : [];
  const empty = wRows.length === 0 && cRows.length === 0;

  const summary =
    variant !== "full"
      ? ""
      : phase === "character"
        ? composeCharSummary(child, child.name, locale === "uz" ? "uz" : "en")
        : composeSummary(child, locale);

  const worldLabel =
    phase === "character"
      ? phase03Copy(locale).charLabel(child.name)
      : phase02Copy(locale).worldLabel(child.name);

  return (
    <div
      className={[
        "rounded-[14px] border border-border-subtle bg-[color-mix(in_srgb,var(--surface-raised)_60%,transparent)]",
        variant === "full" ? "px-6 py-6 sm:px-8 sm:py-8" : "px-5 py-5",
      ].join(" ")}
    >
      {empty ? (
        <>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
            {worldLabel}
          </p>
          <p className="mt-4 font-serif text-[15px] italic text-text-secondary">
            {phase02Copy(locale).portraitEmpty}
          </p>
        </>
      ) : (
        <>
          {(wRows.length > 0 || phase === "world") && (
            <Section
              label={phase02Copy(locale).worldLabel(child.name)}
              rows={wRows}
              reduced={!!reduced}
              startIndex={0}
            />
          )}
          {cRows.length > 0 && (
            <div className={wRows.length > 0 ? "mt-6 border-t border-border-subtle pt-6" : ""}>
              <Section
                label={phase03Copy(locale).charLabel(child.name)}
                rows={cRows}
                reduced={!!reduced}
                startIndex={wRows.length}
              />
            </div>
          )}
        </>
      )}

      {summary && (
        <p className="mt-5 border-t border-border-subtle pt-5 font-serif text-[15.5px] leading-[1.6] text-text-secondary">
          {summary}
        </p>
      )}
    </div>
  );
}

export default ChildWorld;
