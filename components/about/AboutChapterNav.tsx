'use client';

/**
 * About — chapter index (orientation, not site nav).
 * ----------------------------------------------------------------
 * A long editorial story wants a contents index, not a menu. FOUR
 * chapters only:
 *
 *   01  QANDAY YARALDI    → #ch-how-it-began    (Origin)
 *   02  QARASHIMIZ        → #ch-what-we-believe (Child persp. + Belief + Parent/child)
 *   03  TALIMOON DUNYOSI  → #ch-what-we-create  (Universe)
 *   04  BIZ KIMMIZ        → #ch-people          (People + How we create)
 *
 * The Quiet Ending sits outside the index.
 *
 * Desktop (xl+): a quiet vertical index that reads as part of the
 * editorial layout — it sits in the leading gutter of the centred
 * 1200px measure (never glued to the browser edge), a small gold
 * "Boblar" eyebrow, then `NN  TITLE` rows. Pure type + one short gold
 * marker on the active row. It is present from the first paint (no
 * scroll-threshold reveal) and only fades once the story ends at the
 * Quiet Ending — the "stops with its content" result true
 * `position: sticky` can't give here (the sections are full-bleed and
 * `overflow-hidden`). `Section railInset` reserves the room.
 *
 * Below xl: ONE slim chapter strip under the global navbar — "01 / 04 ·
 * TITLE · ⌄", present from the start. Tapping the whole row opens a
 * small cream chapter sheet (not a modal, not a hamburger); picking a
 * chapter scrolls there and closes. A hairline under the strip carries
 * a barely-there progress tint through the current chapter.
 *
 * Active chapter comes from element rects on scroll (rAF-throttled) +
 * a thin trip-band IntersectionObserver — no hardcoded offsets.
 * Respects prefers-reduced-motion for the anchor scroll, the sheet and
 * the chevron.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, GOLD, NAVY, NAVY_48, NAVY_64 } from './shared';

const IDS = [
  'ch-how-it-began',
  'ch-what-we-believe',
  'ch-what-we-create',
  'ch-people',
] as const;

const EN = {
  navLabel: 'About page chapters',
  eyebrow: 'Contents',
  open: 'Open the chapter list',
  close: 'Close the chapter list',
  items: ['HOW IT BEGAN', 'HOW WE SEE IT', 'TALIMOON WORLD', 'WHO WE ARE'],
};
const UZ = {
  navLabel: 'Sahifa boblari',
  eyebrow: 'Boblar',
  open: 'Boblar ro‘yxatini ochish',
  close: 'Boblar ro‘yxatini yopish',
  items: ['QANDAY YARALDI', 'QARASHIMIZ', 'TALIMOON DUNYOSI', 'BIZ KIMMIZ'],
};
const RU: typeof EN = {
  navLabel: 'Главы страницы «О нас»',
  eyebrow: 'Содержание',
  open: 'Открыть список глав',
  close: 'Закрыть список глав',
  items: ['С ЧЕГО ВСЁ НАЧАЛОСЬ', 'НАШ ВЗГЛЯД', 'МИР TALIMOON', 'КТО МЫ'],
};

const num = (i: number) => String(i + 1).padStart(2, '0');

export function AboutChapterNav() {
  const t = useT(EN, UZ, RU);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  // Present from the first paint — it only turns off once the story has
  // scrolled past into the Quiet Ending (see recompute).
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1 through the active chapter
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeRef = useRef(0);
  const stripBtnRef = useRef<HTMLButtonElement>(null);
  const firstSheetItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const els = IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    const endEl = document.getElementById('about-quiet-ending');
    if (els.length < IDS.length || !endEl) return;

    const recompute = () => {
      const vh = window.innerHeight;
      const line = vh * 0.4;
      let idx = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) idx = i;
      });
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      // progress through the current chapter (for the mobile hairline)
      const curTop = els[idx].getBoundingClientRect().top;
      const nextTop =
        idx + 1 < els.length
          ? els[idx + 1].getBoundingClientRect().top
          : endEl.getBoundingClientRect().top;
      const span = nextTop - curTop;
      const p = span > 0 ? (line - curTop) / span : 0;
      setProgress(p < 0 ? 0 : p > 1 ? 1 : p);

      // Visible for the whole story, from the first paint; it only
      // retires once the Quiet Ending has risen near the top.
      const endTop = endEl.getBoundingClientRect().top;
      setVisible(endTop > 140);
    };

    let raf = 0;
    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          recompute();
        });
    };

    recompute();
    const bandIO = new IntersectionObserver(schedule, {
      rootMargin: '-40% 0px -59% 0px',
      threshold: [0, 1],
    });
    els.forEach((el) => bandIO.observe(el));
    const endIO = new IntersectionObserver(schedule, {
      rootMargin: '0px 0px -40% 0px',
      threshold: [0, 1],
    });
    endIO.observe(endEl);
    endIO.observe(els[0]);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      bandIO.disconnect();
      endIO.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = useCallback(
    (i: number) => {
      const el = document.getElementById(IDS[i]);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      activeRef.current = i;
      setActive(i);
    },
    [reduced],
  );

  // Sheet: focus in on open, back to the strip button on close, Esc closes.
  useEffect(() => {
    if (sheetOpen) {
      const id = window.setTimeout(() => firstSheetItemRef.current?.focus(), 10);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSheetOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.clearTimeout(id);
        window.removeEventListener('keydown', onKey);
      };
    }
    stripBtnRef.current?.focus();
  }, [sheetOpen]);

  // The sheet can only be open while the strip itself is on screen — no
  // effect needed, just gate the rendered state.
  const showSheet = sheetOpen && visible;

  return (
    <>
      {/* ── Desktop — the vertical chapter index (xl+) ───────────────
          Positioned inside the leading gutter of the centred 1200px
          measure, not against the viewport edge. */}
      <nav
        aria-label={t.navLabel}
        className={`fixed top-1/2 z-40 hidden -translate-y-1/2 xl:block ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        } transition-opacity duration-500 motion-reduce:transition-none`}
        style={{ left: 'max(1rem, calc(50vw - 600px - 0.25rem))' }}
      >
        <p
          className="mb-6 ps-9 text-[11px] uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.24em',
            color: GOLD,
          }}
        >
          {t.eyebrow}
        </p>
        <ul className="flex flex-col gap-[24px]">
          {t.items.map((label, i) => {
            const on = i === active;
            return (
              <li key={IDS[i]}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={on ? 'true' : undefined}
                  className="group flex items-baseline gap-0 rounded-[3px] py-0.5 text-start outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[6px] focus-visible:outline-[rgba(184,147,91,0.55)]"
                >
                  {/* the marker gutter — a short gold line only on the
                      active row; a fixed 36px cell so nothing shifts */}
                  <span aria-hidden="true" className="block w-9 shrink-0 self-center">
                    <span
                      className="block h-[1.5px] transition-all duration-[220ms] ease-out motion-reduce:transition-none"
                      style={{
                        width: on ? 30 : 0,
                        background: on ? GOLD : 'transparent',
                      }}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[12.5px] tabular-nums transition-colors duration-200 motion-reduce:transition-none"
                    style={{
                      fontFamily: BODY,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      color: on ? GOLD : NAVY_48,
                    }}
                  >
                    {num(i)}
                  </span>
                  <span
                    className="ms-2.5 max-w-[172px] text-[15px] leading-[1.4] transition-colors duration-200 motion-reduce:transition-none"
                    style={{
                      fontFamily: BODY,
                      fontWeight: on ? 600 : 500,
                      letterSpacing: '0.04em',
                      color: on ? NAVY : NAVY_64,
                    }}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Below xl — the sticky chapter strip + sheet ──────────── */}
      <div
        className={`fixed inset-x-0 top-16 z-40 xl:hidden lg:top-[74px] ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1.5 opacity-0'
        } transition-[opacity,transform] duration-[220ms] motion-reduce:transition-none`}
      >
        <nav aria-label={t.navLabel} className="relative">
          <button
            ref={stripBtnRef}
            type="button"
            onClick={() => setSheetOpen((v) => !v)}
            aria-expanded={showSheet}
            aria-controls="about-chapter-sheet"
            aria-label={showSheet ? t.close : t.open}
            className="flex h-[48px] w-full items-center gap-3 px-6 text-start outline-none focus-visible:bg-[rgba(28,42,58,0.05)] md:px-10"
            style={{
              background: 'rgba(247,243,236,0.96)',
              backdropFilter: 'saturate(180%) blur(6px)',
              WebkitBackdropFilter: 'saturate(180%) blur(6px)',
            }}
          >
            <span
              className="shrink-0 text-[11px] tabular-nums"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: GOLD,
              }}
            >
              {num(active)} <span style={{ color: NAVY_48 }}>/ {num(IDS.length - 1)}</span>
            </span>
            <span
              className="min-w-0 flex-1 truncate text-[13.5px]"
              style={{
                fontFamily: BODY,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: NAVY,
              }}
              aria-live="polite"
            >
              {t.items[active]}
            </span>
            {/* Chevron — sits in a faint round affordance so it reads
                clearly as "this opens". Rotates on open. */}
            <span
              aria-hidden="true"
              className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full"
              style={{ background: 'rgba(28,42,58,0.06)' }}
            >
              <svg
                viewBox="0 0 16 16"
                className={`h-[21px] w-[21px] transition-transform duration-200 ease-out motion-reduce:transition-none ${
                  showSheet ? '-rotate-180' : ''
                }`}
                style={{ color: NAVY }}
              >
                <path
                  d="M4 6l4 4 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {/* hairline + barely-there progress through the current chapter */}
          <div className="relative h-px w-full" style={{ background: 'rgba(28,42,58,0.10)' }}>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: 'rgba(184,147,91,0.55)',
              }}
            />
          </div>

          {/* the chapter sheet — a small cream panel, not a modal */}
          {showSheet && (
            <ul
              id="about-chapter-sheet"
              className="absolute inset-x-0 top-full"
              style={{
                background: 'rgba(247,243,236,0.99)',
                boxShadow: '0 12px 28px -18px rgba(28,42,58,0.28)',
                borderBottom: '1px solid rgba(28,42,58,0.10)',
                animation: reduced ? undefined : 'aboutChapterSheet 200ms ease-out both',
              }}
            >
              {t.items.map((label, i) => {
                const on = i === active;
                return (
                  <li key={IDS[i]} style={{ borderTop: '1px solid rgba(28,42,58,0.07)' }}>
                    <button
                      ref={i === 0 ? firstSheetItemRef : undefined}
                      type="button"
                      aria-current={on ? 'true' : undefined}
                      onClick={() => {
                        setSheetOpen(false);
                        go(i);
                      }}
                      className="flex w-full items-baseline gap-3 px-6 py-3.5 text-start outline-none focus-visible:bg-[rgba(28,42,58,0.05)] md:px-10"
                    >
                      <span
                        className="shrink-0 text-[11px] tabular-nums"
                        style={{
                          fontFamily: BODY,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          color: on ? GOLD : NAVY_48,
                        }}
                      >
                        {num(i)}
                      </span>
                      <span
                        className="text-[13.5px]"
                        style={{
                          fontFamily: BODY,
                          fontWeight: on ? 700 : 500,
                          letterSpacing: '0.04em',
                          color: on ? NAVY : NAVY_64,
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>

      <style>{`
        @keyframes aboutChapterSheet {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default AboutChapterNav;
