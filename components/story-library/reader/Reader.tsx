'use client';

/**
 * TALIMOON Story Reader.
 * ----------------------------------------------------------------
 * One reader, one book. The illustrated page is the hero; the site is
 * gone. Two switches produce the three states the brief describes:
 *
 *   narration on  + auto-advance on   → "Storytime"  (lean back)
 *   narration on  + auto-advance off  → "Read together"
 *   narration off                     → "Read it yourself"
 *
 * There is no fourth combination and no mode picker — you press Begin
 * and, inside, one speaker toggle flips narration. Controls fade away
 * while you listen and return on any touch or key.
 *
 * Sync: one <audio> element. On `timeupdate`, when the clock passes
 * the current page's `audioEndSec` we advance (never seeking). On a
 * manual page change we set `currentTime` to that page's
 * `audioStartSec`. Only the previous / current / next page images are
 * ever in the DOM.
 *
 * Progress is saved per-device (localStorage) so the next visit
 * resumes. Reduced motion → hard page cuts. RTL editions flip the
 * turn direction. Nothing here assumes an account, a network fetch,
 * or that a page's words live only inside its artwork.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { useT, useLanguage } from '@/lib/i18n/LanguageContext';
import type { Locale } from '@/lib/story-library/types';
import { getReaderData } from '@/lib/story-library/content';
import { getProgress, saveProgress } from '@/lib/story-library/progress';
import { getActorId } from '@/lib/story-library/actor';
import { recordEvent } from '@/lib/story-library/analytics';

const GROUND = '#141C26';
const GOLD = '#B8935B';
const CREAM = '#F7F3EC';
const BODY =
  "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif";
const DISPLAY =
  "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif";

const EN = {
  begin: 'Begin the story',
  exit: 'Exit',
  narrationOn: 'Turn narration off',
  narrationOff: 'Turn narration on',
  play: 'Play',
  pause: 'Pause',
  prev: 'Previous page',
  next: 'Next page',
  fs: 'Fullscreen',
  fsExit: 'Exit fullscreen',
  autoTurn: 'Turn pages automatically',
  page: (a: number, b: number) => `Page ${a} of ${b}`,
  theEnd: 'The end.',
  nextPart: 'Next part',
  readAgain: 'Read again',
  notAvailable: 'This story isn’t available to read right now.',
  back: 'Back to Story Library',
};
const UZ: typeof EN = {
  begin: 'Hikoyani boshlash',
  exit: 'Chiqish',
  narrationOn: "Ovozni o'chirish",
  narrationOff: 'Ovozni yoqish',
  play: 'Davom ettirish',
  pause: 'To‘xtatish',
  prev: 'Oldingi sahifa',
  next: 'Keyingi sahifa',
  fs: 'Butun ekran',
  fsExit: 'Butun ekrandan chiqish',
  autoTurn: 'Sahifalar avtomatik ochilsin',
  page: (a: number, b: number) => `${a}-sahifa, jami ${b}`,
  theEnd: 'Tamom.',
  nextPart: 'Keyingi qism',
  readAgain: 'Qaytadan o‘qish',
  notAvailable: 'Bu hikoyani hozir o‘qib bo‘lmaydi.',
  back: 'Hikoyalar kutubxonasiga',
};
const RU: typeof EN = {
  begin: 'Начать историю',
  exit: 'Выйти',
  narrationOn: 'Выключить озвучку',
  narrationOff: 'Включить озвучку',
  play: 'Воспроизвести',
  pause: 'Пауза',
  prev: 'Предыдущая страница',
  next: 'Следующая страница',
  fs: 'Во весь экран',
  fsExit: 'Выйти из полноэкранного режима',
  autoTurn: 'Автоматически переворачивать страницы',
  page: (a: number, b: number) => `Страница ${a} из ${b}`,
  theEnd: 'Конец.',
  nextPart: 'Следующая часть',
  readAgain: 'Прочитать снова',
  notAvailable: 'Эта история сейчас недоступна для чтения.',
  back: 'Назад в Библиотеку историй',
};

function toLocale(lang: string): Locale {
  const l = lang.toLowerCase();
  return l === 'uz' || l === 'en' || l === 'ru' || l === 'ar' ? (l as Locale) : 'uz';
}

function readHashPage(): number | null {
  if (typeof window === 'undefined') return null;
  const m = window.location.hash.match(/^#p(\d+)$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) && n >= 1 ? n - 1 : null;
}

// ── controls ───────────────────────────────────────────────────────
function CtlButton({
  label,
  onClick,
  children,
  pressed,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="grid h-11 w-11 place-items-center rounded-full outline-none transition-colors duration-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
      style={{ color: CREAM }}
    >
      {children}
    </button>
  );
}

const Icon = {
  speakerOn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  ),
  speakerOff: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>
  ),
  pause: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
  ),
  prev: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
  ),
  next: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
  ),
  fs: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
  ),
  fsExit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
};

export function Reader({ slug }: { slug: string }) {
  const t = useT(EN, UZ, RU);
  const { language } = useLanguage();
  const router = useRouter();
  const reduced = useReducedMotion();
  const locale = toLocale(language);

  const data = useMemo(() => getReaderData(slug, locale), [slug, locale]);
  const pages = useMemo(() => data?.edition.pages ?? [], [data]);
  const total = pages.length;
  const hasAudio = !!data?.edition.audio;
  const rtl = data?.edition.direction === 'rtl';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chromeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actorId = useRef<string>('anon');

  // Initial state reads localStorage / the URL hash in a lazy
  // initializer (guarded for SSR — returns the default there), so we
  // don't set state from an effect. A one-frame correction on
  // hydration is hidden behind the first-tap curtain and this route
  // is noindex.
  const [page, setPage] = useState<number>(() => {
    const hp = readHashPage();
    const raw = hp ?? getProgress(slug)?.page ?? 0;
    return Math.max(0, Math.min(Math.max(total - 1, 0), raw));
  });
  const [started, setStarted] = useState(!hasAudio); // no audio ⇒ nothing to "start"
  const [narration, setNarration] = useState<boolean>(
    () => getProgress(slug)?.mode !== 'self' && hasAudio,
  );
  const [autoAdvance, setAutoAdvance] = useState<boolean>(
    () => getProgress(slug)?.mode !== 'read-together',
  );
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [awake, setAwake] = useState(false);
  const [isFs, setIsFs] = useState(false);

  const mode: 'storytime' | 'read-together' | 'self' = !narration
    ? 'self'
    : autoAdvance
      ? 'storytime'
      : 'read-together';

  // Controls are visible whenever the story isn't actively playing
  // (curtain up, ended, or paused) OR the reader just interacted.
  // `awake` is only ever set from event handlers / a timeout, so this
  // needs no chrome-syncing effect.
  const showChrome = !started || ended || !playing || awake;

  // ── mount: actor id, scroll lock, first event ──────────────────
  useEffect(() => {
    if (!data) return;
    actorId.current = getActorId();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    recordEvent({
      type: 'story_opened',
      storyId: data.story.id,
      editionLocale: data.edition.locale,
      actorId: actorId.current,
    });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [data]);

  // ── persist progress + page event ───────────────────────────────
  useEffect(() => {
    if (!data || total === 0) return;
    saveProgress({ slug, page, mode, atISO: new Date().toISOString() });
    recordEvent({
      type: 'page_reached',
      storyId: data.story.id,
      editionLocale: data.edition.locale,
      actorId: actorId.current,
      context: { page: page + 1 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, mode]);

  // ── wake the controls, then let them fade ──────────────────────
  const wakeChrome = useCallback(() => {
    setAwake(true);
    if (chromeTimer.current) clearTimeout(chromeTimer.current);
    chromeTimer.current = setTimeout(() => setAwake(false), 3200);
  }, []);
  useEffect(
    () => () => {
      if (chromeTimer.current) clearTimeout(chromeTimer.current);
    },
    [],
  );

  // ── page navigation ────────────────────────────────────────────
  const goTo = useCallback(
    (next: number, method: 'auto' | 'manual') => {
      if (total === 0) return;
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === page) return;
      setPage(clamped);
      setEnded(false);
      if (method === 'manual' && narration && audioRef.current) {
        const s = pages[clamped].audioStartSec;
        if (typeof s === 'number') audioRef.current.currentTime = s;
      }
    },
    [page, total, narration, pages],
  );
  const stepForward = useCallback(() => {
    if (page >= total - 1) {
      setEnded(true);
      return;
    }
    goTo(page + 1, 'manual');
  }, [page, total, goTo]);
  const stepBack = useCallback(() => goTo(page - 1, 'manual'), [page, goTo]);

  // ── audio: attach sync + reflect play state ────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !hasAudio) return;
    const onTime = () => {
      if (!narration || !autoAdvance) return;
      const end = pages[page]?.audioEndSec;
      if (typeof end === 'number' && el.currentTime >= end - 0.05) {
        if (page < total - 1) goTo(page + 1, 'auto');
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      if (data)
        recordEvent({
          type: 'story_completed',
          storyId: data.story.id,
          editionLocale: data.edition.locale,
          actorId: actorId.current,
        });
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [hasAudio, narration, autoAdvance, page, total, pages, data, goTo]);

  // ── start / play / pause / narration ───────────────────────────
  const startStory = useCallback(() => {
    setStarted(true);
    setEnded(false);
    const el = audioRef.current;
    if (el && narration) {
      const s = pages[page]?.audioStartSec ?? 0;
      el.currentTime = s;
      el.play().catch(() => setPlaying(false));
      if (data)
        recordEvent({
          type: 'narration_started',
          storyId: data.story.id,
          editionLocale: data.edition.locale,
          actorId: actorId.current,
        });
    }
    if (data)
      recordEvent({
        type: 'reading_started',
        storyId: data.story.id,
        editionLocale: data.edition.locale,
        actorId: actorId.current,
      });
  }, [narration, page, pages, data]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || !narration) return;
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [narration]);

  const toggleNarration = useCallback(() => {
    setNarration((on) => {
      const nextOn = !on;
      const el = audioRef.current;
      if (el) {
        if (!nextOn) el.pause();
        else {
          const s = pages[page]?.audioStartSec ?? el.currentTime;
          if (typeof s === 'number' && el.currentTime < s) el.currentTime = s;
          if (started) el.play().catch(() => setPlaying(false));
        }
      }
      return nextOn;
    });
  }, [page, pages, started]);

  // ── fullscreen ─────────────────────────────────────────────────
  const toggleFs = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (!document.fullscreenElement) {
      node.requestFullscreen?.().catch(() => {});
      if (data)
        recordEvent({
          type: 'fullscreen_entered',
          storyId: data.story.id,
          editionLocale: data.edition.locale,
          actorId: actorId.current,
        });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [data]);
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    router.push(`/story-library/s/${slug}`);
  }, [router, slug]);

  // ── keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return exit();
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        return toggleFs();
      }
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        return toggleNarration();
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (!started) return startStory();
        return togglePlay();
      }
      const fwd = e.key === 'ArrowRight';
      const back = e.key === 'ArrowLeft';
      if (fwd || back) {
        e.preventDefault();
        wakeChrome();
        const goNext = rtl ? back : fwd;
        return goNext ? stepForward() : stepBack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    exit,
    toggleFs,
    toggleNarration,
    togglePlay,
    startStory,
    started,
    rtl,
    stepForward,
    stepBack,
    wakeChrome,
  ]);

  // ── unavailable / empty ────────────────────────────────────────
  if (!data || total === 0) {
    return (
      <div
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: GROUND, color: CREAM }}
      >
        <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22 }}>
          {t.notAvailable}
        </p>
        <Link
          href="/story-library"
          className="text-[13px] uppercase tracking-[0.16em]"
          style={{ fontFamily: BODY, color: GOLD }}
        >
          {t.back}
        </Link>
      </div>
    );
  }

  const windowPages = [page - 1, page, page + 1].filter(
    (i) => i >= 0 && i < total,
  );
  const progressPct = ((page + 1) / total) * 100;

  return (
    <div
      ref={rootRef}
      dir={rtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[999] select-none overflow-hidden"
      style={{ background: GROUND }}
      onMouseMove={wakeChrome}
    >
      {hasAudio ? (
        <audio
          ref={audioRef}
          src={data.edition.audio?.src}
          preload="metadata"
        />
      ) : null}

      {/* page stack — only prev / current / next are in the DOM */}
      <div className="absolute inset-0">
        {windowPages.map((i) => {
          const p = pages[i];
          const active = i === page;
          return (
            <div
              key={p.image.id}
              className="absolute inset-0 flex items-center justify-center p-4 sm:p-10"
              style={{
                opacity: active ? 1 : 0,
                transition: reduced
                  ? 'none'
                  : 'opacity 420ms cubic-bezier(0.22,1,0.36,1)',
                pointerEvents: 'none',
              }}
            >
              <Image
                src={p.image.src}
                alt={active ? p.text || p.image.alt || t.page(i + 1, total) : ''}
                width={p.image.width}
                height={p.image.height}
                sizes="100vw"
                priority={active}
                className="max-h-full max-w-full object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          );
        })}
      </div>

      {/* invisible tap zones — start/end thirds turn pages, centre toggles chrome */}
      {started && !ended ? (
        <div className="absolute inset-0 flex">
          <button
            type="button"
            aria-label={rtl ? t.next : t.prev}
            className="h-full w-1/3 cursor-default outline-none"
            onClick={() => (rtl ? stepForward() : stepBack())}
          />
          <button
            type="button"
            aria-label={t.exit}
            tabIndex={-1}
            className="h-full w-1/3 cursor-default outline-none"
            onClick={wakeChrome}
          />
          <button
            type="button"
            aria-label={rtl ? t.prev : t.next}
            className="h-full w-1/3 cursor-default outline-none"
            onClick={() => (rtl ? stepBack() : stepForward())}
          />
        </div>
      ) : null}

      {/* position hairline — always present */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          width: `${progressPct}%`,
          background: GOLD,
          transition: reduced ? 'none' : 'width 420ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* exit — always reachable, dims with the chrome */}
      <button
        type="button"
        onClick={exit}
        aria-label={t.exit}
        className="absolute start-3 top-3 grid h-10 w-10 place-items-center rounded-full outline-none transition-opacity duration-300 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ color: CREAM, opacity: showChrome ? 0.9 : 0.28 }}
      >
        {Icon.close}
      </button>

      {/* first-tap curtain */}
      {!started ? (
        <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[1px]">
          <button
            type="button"
            onClick={startStory}
            className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[15px] outline-none focus-visible:ring-2"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: GROUND,
              background: CREAM,
            }}
          >
            <span aria-hidden="true">▶</span>
            {t.begin}
          </button>
        </div>
      ) : null}

      {/* end card */}
      {ended ? (
        <div className="absolute inset-0 grid place-items-center bg-black/45 px-6">
          <div className="flex flex-col items-center gap-6 text-center">
            <p style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 30, color: CREAM }}>
              {t.theEnd}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {data.nextEpisode ? (
                <Link
                  href={`/story-library/read/${data.nextEpisode.slug}`}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px]"
                  style={{ fontFamily: BODY, fontWeight: 600, color: GROUND, background: CREAM }}
                >
                  {data.nextEpisode.label} · {t.nextPart}
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setEnded(false);
                  goTo(0, 'manual');
                  if (audioRef.current && narration) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(() => {});
                  }
                }}
                className="text-[13px] uppercase tracking-[0.14em]"
                style={{ fontFamily: BODY, color: CREAM, opacity: 0.8 }}
              >
                {t.readAgain}
              </button>
              <button
                type="button"
                onClick={exit}
                className="text-[13px] uppercase tracking-[0.14em]"
                style={{ fontFamily: BODY, color: GOLD }}
              >
                {t.exit}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* controls bar */}
      {started && !ended ? (
        <div
          className="absolute inset-x-0 bottom-4 flex justify-center px-4 transition-opacity duration-300"
          style={{ opacity: showChrome ? 1 : 0, pointerEvents: showChrome ? 'auto' : 'none' }}
        >
          <div
            className="flex items-center gap-1 rounded-full px-2 py-1"
            style={{ background: 'rgba(10,15,22,0.72)' }}
          >
            <CtlButton
              label={narration ? t.narrationOn : t.narrationOff}
              onClick={toggleNarration}
              pressed={narration}
            >
              {narration ? Icon.speakerOn : Icon.speakerOff}
            </CtlButton>
            {narration ? (
              <CtlButton
                label={playing ? t.pause : t.play}
                onClick={togglePlay}
                pressed={playing}
              >
                {playing ? Icon.pause : Icon.play}
              </CtlButton>
            ) : null}
            <CtlButton label={t.prev} onClick={stepBack}>
              {Icon.prev}
            </CtlButton>
            <span
              className="min-w-[64px] px-1 text-center text-[12px] tabular-nums"
              style={{ fontFamily: BODY, color: 'rgba(247,243,236,0.8)' }}
              aria-hidden="true"
            >
              {page + 1} / {total}
            </span>
            <CtlButton label={t.next} onClick={stepForward}>
              {Icon.next}
            </CtlButton>
            <CtlButton label={isFs ? t.fsExit : t.fs} onClick={toggleFs}>
              {isFs ? Icon.fsExit : Icon.fs}
            </CtlButton>
          </div>
        </div>
      ) : null}

      {/* the auto-turn switch — only when narration is on and paused */}
      {started && !ended && narration && !playing ? (
        <label
          className="absolute inset-x-0 bottom-[76px] mx-auto flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12px] transition-opacity duration-300"
          style={{
            background: 'rgba(10,15,22,0.72)',
            color: 'rgba(247,243,236,0.85)',
            fontFamily: BODY,
            opacity: showChrome ? 1 : 0,
            pointerEvents: showChrome ? 'auto' : 'none',
          }}
        >
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="h-3.5 w-3.5"
            style={{ accentColor: GOLD }}
          />
          {t.autoTurn}
        </label>
      ) : null}

      {/* screen-reader page announcer */}
      <p className="sr-only" aria-live="polite">
        {t.page(page + 1, total)}
        {pages[page]?.text ? ` — ${pages[page].text}` : ''}
      </p>
    </div>
  );
}

export default Reader;
