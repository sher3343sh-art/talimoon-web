"use client";

/**
 * MomentsList — Real Talimoon Moments
 * ----------------------------------------------------------------
 * A vertically scrollable list of customer moments (~3 visible at a
 * time). Selecting a card changes only the phone's content — the
 * list itself never reorders or resizes.
 */

import Image from "next/image";
import type { Moment } from "./RealTalimoonMoments";
import { useT } from "@/lib/i18n/LanguageContext";

const CHROME_EN = {
  listLabel: "Customer story videos",
  sharingAlt: (name: string) => `${name} sharing their TALIMOON story`,
};

const CHROME_UZ: typeof CHROME_EN = {
  listLabel: "Mijozlar hikoya videolari",
  sharingAlt: (name: string) => `${name} o'zining TALIMOON hikoyasini baham ko'rmoqda`,
};

const CHROME_RU: typeof CHROME_EN = {
  listLabel: "Видео с историями наших клиентов",
  sharingAlt: (name: string) => `${name} делится своей историей TALIMOON`,
};

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

export function MomentsList({
  moments,
  selectedId,
  onSelect,
}: {
  moments: Moment[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const t = useT(CHROME_EN, CHROME_UZ, CHROME_RU);

  return (
    <div
      role="list"
      aria-label={t.listLabel}
      className="mt-8 max-h-[276px] space-y-3 overflow-y-auto pr-1"
    >
      {moments.map((moment) => {
        const selected = moment.id === selectedId;
        return (
          <div key={moment.id} role="listitem">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(moment.id)}
              className={[
                "flex w-full items-center gap-4 rounded-[14px] border p-3 text-left",
                "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]",
                selected
                  ? "border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] shadow-[0_0_0_4px_var(--gold-500-a35,rgba(184,147,91,0.35))]"
                  : "border-transparent bg-transparent hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(42,36,29,0.14)]",
              ].join(" ")}
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px]">
                <Image
                  src={moment.thumbnail}
                  alt={t.sharingAlt(moment.name)}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-sans text-[0.9375rem] font-semibold text-[var(--text-primary,#2A241D)]">
                  {moment.name}
                </span>
                <span className="block font-sans text-[0.8125rem] text-[var(--text-secondary,#49433C)]">
                  {moment.childAge}
                </span>
              </span>

              <span className="shrink-0 font-sans text-[0.8125rem] text-[var(--text-muted,#8B8578)]">
                {moment.duration}
              </span>

              <span
                aria-hidden="true"
                className={[
                  "shrink-0 transition-colors duration-200",
                  selected ? "text-[var(--gold-500,#B8935B)]" : "text-[var(--text-muted,#8B8578)]",
                ].join(" ")}
              >
                <ArrowIcon />
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default MomentsList;
