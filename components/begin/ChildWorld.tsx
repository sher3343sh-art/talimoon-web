"use client";

/**
 * "FAYZBEKNING DUNYOSI" — the evolving portrait of the child that
 * Phase 02 gradually writes. A tonal editorial canvas, never a
 * dashboard card: warm surface, one hairline, restrained gold micro-
 * labels, generous space. New details arrive with a quiet fade.
 *
 * variant:
 *   "aside"   — the sticky companion column on desktop
 *   "compact" — a slim panel under the interaction on mobile
 *   "full"    — the centre of the completion milestone (+ a summary)
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ChildProfile } from "@/lib/order/types";
import {
  composeSummary,
  interestsDisplay,
  phase02Copy,
  type Locale,
} from "@/lib/order/phase02-copy";

type Row = { key: string; label: string; value: string; sub?: string };

function rowsFor(child: ChildProfile, c: ReturnType<typeof phase02Copy>, locale: Locale): Row[] {
  const rows: Row[] = [];
  const interests = interestsDisplay(child.interests, locale);
  if (interests) {
    rows.push({
      key: "loves",
      label: c.pLoves,
      value: interests,
      sub: child.interestDetail?.trim() || undefined,
    });
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

export function ChildWorld({
  child,
  locale,
  variant,
}: {
  child: ChildProfile;
  locale: Locale;
  variant: "aside" | "compact" | "full";
}) {
  const c = phase02Copy(locale);
  const reduced = useReducedMotion();
  const rows = rowsFor(child, c, locale);
  const summary = variant === "full" ? composeSummary(child, locale) : "";

  const anim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: -4 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.24, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div
      className={[
        "rounded-[14px] border border-border-subtle bg-[color-mix(in_srgb,var(--surface-raised)_60%,transparent)]",
        variant === "full" ? "px-6 py-6 sm:px-8 sm:py-8" : "px-5 py-5",
      ].join(" ")}
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
        {c.worldLabel(child.name)}
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 font-serif text-[15px] italic text-text-secondary">
          {c.portraitEmpty}
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border-subtle">
          {rows.map((row, i) => (
            <motion.div key={row.key} {...anim(i)} className="py-3 first:pt-0 last:pb-0">
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
