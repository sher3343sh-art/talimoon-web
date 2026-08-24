"use client";

/**
 * ReactionSummary — Families Wall
 * ----------------------------------------------------------------
 * Now a Client Component (was a server component before): needs
 * `useT` (a Context hook) for translated labels.
 *
 * A single horizontal card, four equal columns, thin separators.
 * This is aggregate/site-wide data (not a sum of the 3 visible
 * carousel cards — those are individual stories; this represents the
 * whole Families Wall), so it's a static display, not interactive.
 */

import { useT } from "@/lib/i18n/LanguageContext";

const SUMMARY_ITEMS_EN: { key: string; emoji: string; value: string; label: string }[] = [
  { key: "smiles", emoji: "😊", value: "2.4K", label: "Smiles" },
  { key: "love", emoji: "❤️", value: "1.6K", label: "Love" },
  { key: "touched", emoji: "🥹", value: "576", label: "Touched" },
  { key: "beautiful", emoji: "👏", value: "349", label: "Beautiful" },
];

const SUMMARY_ITEMS_UZ: { key: string; emoji: string; value: string; label: string }[] = [
  { key: "smiles", emoji: "😊", value: "2.4K", label: "Tabassum" },
  { key: "love", emoji: "❤️", value: "1.6K", label: "Sevgi" },
  { key: "touched", emoji: "🥹", value: "576", label: "Ta'sirlangan" },
  { key: "beautiful", emoji: "👏", value: "349", label: "Ajoyib" },
];

const ARIA_EN = "Overall reactions across all family stories";
const ARIA_UZ = "Barcha oila hikoyalari bo'yicha umumiy his-tuyg'ular";

export function ReactionSummary() {
  const items = useT(SUMMARY_ITEMS_EN, SUMMARY_ITEMS_UZ);
  const ariaLabel = useT(ARIA_EN, ARIA_UZ);

  return (
    <div
      className="mx-auto grid max-w-[900px] grid-cols-2 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.08))] rounded-[20px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] px-4 py-4 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-2"
      aria-label={ariaLabel}
    >
      {items.map(({ key, emoji, value, label }) => (
        <div key={key} className="flex flex-col items-center gap-1 px-4 py-4 text-center sm:py-0">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-[1.375rem] leading-none">
              {emoji}
            </span>
            <span className="font-serif text-[1.5rem] font-medium leading-none text-[var(--text-primary,#2A241D)]">
              {value}
            </span>
          </div>
          <span className="font-sans text-[0.8125rem] text-[var(--text-muted,#8B8578)]">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default ReactionSummary;
