'use client';

/**
 * About — chapter index (orientation, not site nav).
 * ----------------------------------------------------------------
 * A long editorial story wants a contents index, not a menu. FOUR
 * chapters only:
 *
 *   01  Qanday boshlandi   → #ch-how-it-began    (Origin)
 *   02  Nimaga ishonamiz   → #ch-what-we-believe (Child persp. + Belief + Parent/child)
 *   03  Nimalar yaratamiz  → #ch-what-we-create  (Universe)
 *   04  Asoschi va jamoa   → #ch-people          (People + How we create)
 *
 * The Quiet Ending sits outside the index.
 *
 * Desktop (xl+): a quiet vertical index in the leading margin — a small
 * gold "Boblar" eyebrow, then `NN  Title` rows. Pure type + one short
 * gold marker on the active row. No boxes, no fills, no hover
 * rectangles. `Section railInset` reserves the room. It rides along
 * fixed while the story is on screen and fades out at the Quiet Ending
 * — the same "stops with its content" result sticky would give, which
 * true `position: sticky` can't here (the sections are full-bleed and
 * `overflow-hidden`).
 *
 * Below xl: ONE slim sticky strip under the global navbar — "01 / 04 ·
 * Title · ⌄". Tapping it opens a small cream chapter sheet (not a
 * modal, not a hamburger); picking a chapter scrolls there and closes.
 * A hairline under the strip carries a barely-there progress tint
 * through the current chapter.
 *
 * Active chapter comes from element rects on scroll (rAF-throttled) +
 * a thin trip-band IntersectionObserver — no hardcoded offsets.
 * Respects prefers-reduced-motion for the anchor scroll and the sheet.
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
  items: ['How it began', 'What we believe', 'What we create', 'People behind TALIMOON'],
};
const UZ = {
  navLabel: 'Sahifa boblari',
  eyebrow: 'Boblar',
  open: 'Boblar ro‘yxatini ochish',
  close: 'Boblar ro‘yxatini yopish',
  items: ['Qanday boshlandi', 'Nimaga ishonamiz', 'Nimalar yaratamiz', 'Asoschi va jamoa'],
};

const num = (i: number) => String(i + 1).padStart(2, '0');

export function AboutChapterNav() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
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

      const firstTop = els[0].getBoundingClientRect().top;
      const endTop = endEl.getBoundingClientRect().top;
      setVisible(firstTop < vh * 0.5 && endTop > 140);
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

  useEffect(() => {
    if (!visible) setSheetOpen(false);
  }, [visible]);

  return (
    <>
      {/* ── Desktop — the vertical chapter index (xl+) ───────────── */}
      <nav
        aria-label={t.navLabel}
        className={`fixed start-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        } transition-opacity duration-500`}
      >
        <p
          className="mb-4 ps-8 text-[10px] uppercase"
          style={{
            fontFamily: BODY,
            fontWeight: 600,
            letterSpacing: '0.24em',
            color: GOLD,
          }}
        >
          {t.eyebrow}
        </p>
        <ul className="flex flex-col gap-[18px]">
          {t.items.map((label, i) => {
            const on = i === active;
            return (
              <li key={IDS[i]}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={on ? 'true' : undefined}
                  className="group flex items-baseline gap-0 py-0.5 text-start outline-none"
                >
                  {/* the marker gutter — a short gold line only on the
                      active row; a fixed 32px cell so nothing shifts */}
                  <span aria-hidden="true" className="block w-8 shrink-0 self-center">
                    <span
                      className="block h-px transition-all duration-[220ms] ease-out"
                      style={{
                        width: on ? 26 : 0,
                        background: on ? GOLD : 'transparent',
                      }}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[11px] tabular-nums transition-colors duration-200"
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
                    className="ms-3 max-w-[150px] text-[12.5px] leading-[1.3] transition-colors duration-200"
                    style={{
                      fontFamily: BODY,
                      fontWeight: on ? 600 : 500,
                      color: on ? NAVY : NAVY_48,
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
        } transition-[opacity,transform] duration-[220ms]`}
      >
        <nav aria-label={t.navLabel} className="relative">
          <button
            ref={stripBtnRef}
            type="button"
            onClick={() => setSheetOpen((v) => !v)}
            aria-expanded={sheetOpen}
            aria-haspopup="true"
            className="flex h-[46px] w-full items-center gap-3 px-6 text-start outline-none focus-visible:bg-[rgba(28,42,58,0.03)] md:px-10"
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
              className="min-w-0 flex-1 truncate text-[12.5px]"
              style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
              aria-live="polite"
            >
              {t.items[active]}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                sheetOpen ? '-rotate-180' : ''
              }`}
              style={{ color: NAVY_48 }}
            >
              <path
                d="M4 6l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* hairline + barely-there progress through the current chapter */}
          <div className="relative h-px w-full" style={{ background: 'rgba(28,42,58,0.10)' }}>
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: 'rgba(184,147,91,0.55)',
              }}
            />
          </div>

          {/* the chapter sheet — a small cream panel, not a modal */}
          {sheetOpen && (
            <ul
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
                      className="flex w-full items-baseline gap-3 px-6 py-3 text-start outline-none focus-visible:bg-[rgba(28,42,58,0.04)] md:px-10"
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
                          fontWeight: on ? 600 : 500,
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
