"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed-navbar clearance (mirrors app/begin/page.tsx's
 * `pt-16 lg:pt-[74px]`): 64px below `lg`, 74px at `lg`+.
 */
function navbarOffset(): number {
  if (typeof window === "undefined") return 64;
  return window.matchMedia("(min-width: 1024px)").matches ? 74 : 64;
}

/**
 * Return the order-flow section to a consistent entry position whenever
 * the LOGICAL step changes (spec §8) — including when a new phase
 * component mounts, so a step never opens halfway down the page because
 * the previous one left the scroll there.
 *
 * `key` MUST change only on a real Next / Back step transition — never
 * on typing, selection, validation changes, textarea growth, upload
 * progress or a plain re-render — because that is this hook's sole
 * dependency.
 *
 * The section top is placed just below the fixed navbar. On desktop
 * that reads as "comfortably below the bar"; on mobile the same anchor
 * keeps the heading in the upper part of the viewport rather than
 * vertically centered, and never fights the keyboard. A position that
 * is already essentially right is left alone (no nudge on first load),
 * the very first correction is instant rather than animated, and
 * `prefers-reduced-motion` disables the smooth scroll entirely.
 */
export function useFlowScroll(key: string | number): void {
  const first = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const wasFirst = first.current;
    first.current = false;

    const el =
      document.querySelector<HTMLElement>("[data-order-flow]") ??
      document.querySelector<HTMLElement>("main");
    if (!el) return;

    const target = Math.max(
      0,
      el.getBoundingClientRect().top + window.scrollY - navbarOffset() - 12,
    );
    // Already in place (e.g. the very first mount at the top of /begin)
    // — don't fire a pointless scroll.
    if (Math.abs(window.scrollY - target) < 4) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: target,
      behavior: wasFirst || reduce ? "auto" : "smooth",
    });
  }, [key]);
}
