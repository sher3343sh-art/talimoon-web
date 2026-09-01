'use client';

/**
 * About — internal chapter navigation (orientation, not site nav).
 * ----------------------------------------------------------------
 * The About story is long by design; this gives the visitor a sense of
 * where they are and what remains, in FOUR chapters only:
 *
 *   1  Qanday boshlandi     → #ch-how-it-began   (Origin)
 *   2  Nimaga ishonamiz     → #ch-what-we-believe (Child persp. + Belief + Parent/child)
 *   3  Nimalar yaratamiz    → #ch-what-we-create  (Universe)
 *   4  Asoschi va jamoa     → #ch-people          (People + How we create)
 *
 * The Quiet Ending sits outside the navigation.
 *
 * Desktop (xl+): a sticky editorial rail in the leading margin — a hair-
 * line spine, muted inactive labels, a navy active label with a short
 * gold tick. `Section railInset` reserves the room so it never covers
 * the reading column.
 * Below xl: a slim fixed indicator under the global navbar — reading
 * position ("02 / 04"), the current chapter title, and four tappable
 * progress segments. No second menu, no hamburger.
 *
 * Active chapter is derived from element positions on scroll (via an
 * IntersectionObserver that re-measures), not hardcoded offsets. The
 * rail/indicator only shows between the start of the story and the
 * Quiet Ending. Respects reduced motion for anchor scrolls.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, GOLD, NAVY, NAVY_48 } from './shared';

const IDS = [
  'ch-how-it-began',
  'ch-what-we-believe',
  'ch-what-we-create',
  'ch-people',
] as const;

const EN = {
  navLabel: 'About page chapters',
  items: ['How it began', 'What we believe', 'What we create', 'People behind TALIMOON'],
};
const UZ = {
  navLabel: 'Sahifa boblari',
  items: ['Qanday boshlandi', 'Nimaga ishonamiz', 'Nimalar yaratamiz', 'Asoschi va jamoa'],
};

export function AboutChapterNav() {
  const t = useT(EN, UZ);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const activeRef = useRef(0);

  // Active chapter follows the last chapter wrapper whose top has passed
  // a trip line ~40% down the viewport — a viewport-relative ratio, not
  // a hardcoded pixel offset. It is recomputed from live element rects
  // on every scroll / resize (rAF-throttled) and from an
  // IntersectionObserver whose root is a thin band at that line, so a
  // chapter change registers the instant a boundary crosses it. The
  // rail/indicator only shows between the start of the story and the
  // Quiet Ending.
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
    // Thin trip-band at ~40% viewport height; toggles reliably as each
    // chapter boundary crosses it (standard scrollspy, no huge-element
    // ratio thresholds).
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
      el.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
      activeRef.current = i;
      setActive(i);
    },
    [reduced],
  );

  return (
    <>
      {/* Desktop — sticky editorial rail in the leading margin (xl+) */}
      <nav
        aria-label={t.navLabel}
        className={`fixed start-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        } transition-opacity duration-500`}
      >
        <ul
          className="flex flex-col gap-4 border-s"
          style={{ borderColor: 'rgba(28,42,58,0.14)' }}
        >
          {t.items.map((label, i) => {
            const on = i === active;
            return (
              <li key={IDS[i]} className="-ms-px">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={on ? 'step' : undefined}
                  className="flex items-center gap-3 py-0.5 text-start outline-none focus-visible:opacity-100"
                >
                  <span
                    aria-hidden="true"
                    className="block h-px shrink-0 transition-all duration-300"
                    style={{
                      width: on ? 24 : 10,
                      background: on ? GOLD : 'rgba(28,42,58,0.3)',
                    }}
                  />
                  <span
                    className="max-w-[132px] text-[11px] uppercase leading-[1.3] transition-colors duration-300"
                    style={{
                      fontFamily: BODY,
                      fontWeight: 600,
                      letterSpacing: '0.09em',
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

      {/* Below xl — slim fixed chapter indicator under the global navbar */}
      <nav
        aria-label={t.navLabel}
        className={`fixed inset-x-0 top-16 z-40 xl:hidden lg:top-[74px] ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        } transition-[opacity,transform] duration-300`}
        style={{
          background: 'rgba(247,243,236,0.94)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(28,42,58,0.08)',
        }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-6 py-2.5 md:px-10">
          <span
            className="shrink-0 text-[11px] tabular-nums"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: NAVY_48,
            }}
          >
            {String(active + 1).padStart(2, '0')} / 0{IDS.length}
          </span>
          <span
            className="min-w-0 flex-1 truncate text-[11px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: NAVY,
            }}
            aria-live="polite"
          >
            {t.items[active]}
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {t.items.map((label, i) => (
              <button
                key={IDS[i]}
                type="button"
                onClick={() => go(i)}
                aria-label={label}
                aria-current={i === active ? 'step' : undefined}
                className="flex h-6 w-7 items-center justify-center"
              >
                <span
                  className="block h-[3px] w-full rounded-full transition-colors duration-300"
                  style={{
                    background: i === active ? GOLD : 'rgba(28,42,58,0.18)',
                  }}
                />
              </button>
            ))}
          </span>
        </div>
      </nav>
    </>
  );
}

export default AboutChapterNav;
