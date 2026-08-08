/**
 * ReactionSummary — Families Wall
 * ----------------------------------------------------------------
 * A single horizontal card, four equal columns, thin separators.
 * This is aggregate/site-wide data (not a sum of the 3 visible
 * carousel cards — those are individual stories; this represents the
 * whole Families Wall), so it's a static display, not interactive.
 */

const SUMMARY_ITEMS: { emoji: string; value: string; label: string }[] = [
  { emoji: "😊", value: "2.4K", label: "Smiles" },
  { emoji: "❤️", value: "1.6K", label: "Love" },
  { emoji: "🥹", value: "576", label: "Touched" },
  { emoji: "👏", value: "349", label: "Beautiful" },
];

export function ReactionSummary() {
  return (
    <div
      className="mx-auto grid max-w-[900px] grid-cols-2 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.08))] rounded-[20px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] px-4 py-6 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:px-2"
      aria-label="Overall reactions across all family stories"
    >
      {SUMMARY_ITEMS.map(({ emoji, value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1 px-4 py-4 text-center sm:py-0">
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
