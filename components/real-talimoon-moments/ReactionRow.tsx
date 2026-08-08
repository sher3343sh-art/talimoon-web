/**
 * ReactionRow — Real Talimoon Moments
 * ----------------------------------------------------------------
 * Three positive reaction counts only — no comments, shares, views,
 * or other engagement-style actions. This exists to build trust,
 * not to invite social-media-style interaction.
 */

const REACTIONS: { key: "smile" | "love" | "wow"; emoji: string; label: string }[] = [
  { key: "smile", emoji: "😊", label: "Smile" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "wow", emoji: "🤩", label: "Wow" },
];

export function ReactionRow({
  reactions,
}: {
  reactions: { smile: number; love: number; wow: number };
}) {
  return (
    <div className="mt-6 flex items-center gap-6" aria-label="Reactions from other families">
      {REACTIONS.map(({ key, emoji, label }) => (
        <span key={key} className="inline-flex items-center gap-1.5 font-sans text-[0.9375rem] text-[var(--text-secondary,#49433C)]">
          <span aria-hidden="true" className="text-[1.125rem] leading-none">
            {emoji}
          </span>
          <span className="font-semibold text-[var(--text-primary,#2A241D)]">{reactions[key]}</span>
          <span className="sr-only">{label} reactions</span>
        </span>
      ))}
    </div>
  );
}

export default ReactionRow;
