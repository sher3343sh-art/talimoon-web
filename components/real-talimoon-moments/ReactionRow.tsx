"use client";

/**
 * ReactionRow — Real Talimoon Moments
 * ----------------------------------------------------------------
 * Three positive reaction counts only — no comments, shares, views,
 * or other engagement-style actions. This exists to build trust,
 * not to invite social-media-style interaction.
 */

import { useT } from "@/lib/i18n/LanguageContext";

const REACTIONS: { key: "smile" | "love" | "wow"; emoji: string }[] = [
  { key: "smile", emoji: "😊" },
  { key: "love", emoji: "❤️" },
  { key: "wow", emoji: "🤩" },
];

const CHROME_EN = {
  rowLabel: "Reactions from other families",
  labels: { smile: "Smile", love: "Love", wow: "Wow" },
  reactionsSuffix: "reactions",
};

const CHROME_UZ: typeof CHROME_EN = {
  rowLabel: "Boshqa oilalarning his-tuyg'ulari",
  labels: { smile: "Tabassum", love: "Sevgi", wow: "Hayrat" },
  reactionsSuffix: "ta reaksiya",
};

const CHROME_RU: typeof CHROME_EN = {
  rowLabel: "Отклики других семей",
  labels: { smile: "Улыбка", love: "Любовь", wow: "Восторг" },
  reactionsSuffix: "реакций",
};

export function ReactionRow({
  reactions,
}: {
  reactions: { smile: number; love: number; wow: number };
}) {
  const t = useT(CHROME_EN, CHROME_UZ, CHROME_RU);

  return (
    <div className="mt-6 flex items-center gap-6" aria-label={t.rowLabel}>
      {REACTIONS.map(({ key, emoji }) => (
        <span key={key} className="inline-flex items-center gap-1.5 font-sans text-[0.9375rem] text-[var(--text-secondary,#49433C)]">
          <span aria-hidden="true" className="text-[1.125rem] leading-none">
            {emoji}
          </span>
          <span className="font-semibold text-[var(--text-primary,#2A241D)]">{reactions[key]}</span>
          <span className="sr-only">{t.labels[key]} {t.reactionsSuffix}</span>
        </span>
      ))}
    </div>
  );
}

export default ReactionRow;
