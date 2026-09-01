"use client";

/**
 * TALIMOON — ORDER — the selection tray.
 * ----------------------------------------------------------------
 * The single visible answer to "what have I chosen?" — reused across
 * every multi-select-or-write-your-own question (Phase 02 interests,
 * Phase 03 appreciated qualities and growth behaviours). Preset and
 * custom answers render identically: an editorial answer container,
 * never a shopping cart.
 *
 * Two modes:
 *   interactive (default) — a × on every chip, `onRemove` required.
 *   read-only (`onRemove` omitted) — a compact reminder of a PREVIOUS
 *     screen's selection, used on a follow-up screen (e.g. the growth
 *     context question shows the chosen behaviours, without letting
 *     the adult edit them here).
 */

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Quiet 180ms opacity settle only — NO `layout`, NO scale (spec §06/§37).
 * `layout` made chips physically slide/reflow when a sibling was removed;
 * a scale-in read as a "pop". Chips now just fade; the row re-flows
 * instantly with no travel.
 */

export interface TrayItem {
  id: string;
  label: string;
}

export function SelectionTray({
  title,
  items,
  onRemove,
  removeLabel,
  reduced,
}: {
  title: string;
  items: TrayItem[];
  onRemove?: (id: string) => void;
  removeLabel?: (label: string) => string;
  reduced?: boolean;
}) {
  if (items.length === 0) return null;
  const interactive = !!onRemove;

  return (
    <div
      className="mt-4 rounded-md border border-border-default bg-surface-raised/60 px-3.5 py-3"
      role={interactive ? "group" : undefined}
      aria-label={interactive ? title : undefined}
    >
      <p className="mb-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.span
              key={item.id}
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={[
                "inline-flex max-w-full items-center gap-1.5 rounded-md border border-accent-primary bg-accent-primary/[0.08] font-sans text-[14px] font-semibold text-text-primary",
                interactive ? "py-1.5 pe-1.5 ps-3" : "px-3 py-1.5",
              ].join(" ")}
            >
              <span className="truncate">{item.label}</span>
              {interactive && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={removeLabel ? removeLabel(item.label) : item.label}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SelectionTray;
