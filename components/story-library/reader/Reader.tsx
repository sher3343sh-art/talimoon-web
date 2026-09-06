'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ImageAsset, Locale } from '@/lib/story-library/types';
import { getReaderData } from '@/lib/story-library/content';
import { getProgress, saveProgress } from '@/lib/story-library/progress';
import { getActorId } from '@/lib/story-library/actor';
import { recordEvent } from '@/lib/story-library/analytics';

const CREAM = '#F7F3EC';
const GOLD = '#C5A15F';
const BODY = "var(--font-manrope), 'Manrope', system-ui, sans-serif";
const DISPLAY = "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif";
type Phase = 'front' | 'pages' | 'back' | 'end';

function toLocale(language: string): Locale {
  const value = language.toLowerCase();
  return value === 'uz' || value === 'en' || value === 'ru' || value === 'ar' ? value as Locale : 'uz';
}

function Icon({ name }: { name: 'play' | 'pause' | 'sound' | 'mute' | 'prev' | 'next' | 'full' | 'close' }) {
  const common = { width: 21, height: 21, viewBox: '0 0 24 24' };
  if (name === 'play') return <svg {...common} fill="currentColor"><path d="M8 5v14l11-7L8 5Z" /></svg>;
  if (name === 'pause') return <svg {...common} fill="currentColor"><path d="M7 5h4v14H7zM14 5h4v14h-4z" /></svg>;
  if (name === 'prev') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m15 5-7 7 7 7" /></svg>;
  if (name === 'next') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m9 5 7 7-7 7" /></svg>;
  if (name === 'close') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'full') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
  if (name === 'mute') return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9v6h4l5 4V5L8 9H4Zm12 0 5 6m0-6-5 6" /></svg>;
  return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9v6h4l5 4V5L8 9H4Zm13-.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" /></svg>;
}

function Control({ label, onClick, children, disabled = false }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-25">{children}</button>;
}

function ReaderImage({ asset }: { asset: ImageAsset }) {
  return <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6"><Image src={asset.src} alt={asset.alt || ''} width={asset.width} height={asset.height} sizes="100vw" priority className="max-h-full max-w-full object-contain" style={{ width: 'auto', height: 'auto' }} /></div>;
}

export function Reader({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const router = useRouter();
  const reduced = useReducedMotion();
  const data = useMemo(() => getReaderData(slug, toLocale(language)), [slug, language]);
  const pages = useMemo(() => data?.edition.pages ?? [], [data]);
  const total = pages.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const turnRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const actorId = useRef('anon');
  const saved = typeof window === 'undefined' ? null : getProgress(slug);
  const [page, setPage] = useState(() => Math.min(Math.max(saved?.page ?? 0, 0), Math.max(total - 1, 0)));
  const [phase, setPhase] = useState<Phase>('front');
  const [narration, setNarration] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [needsRotate, setNeedsRotate] = useState(false);
  const hasPageAudio = pages.some(item => !!item.audioSrc);
  const activeAsset = phase === 'front' ? data?.edition.frontCover ?? data?.edition.cover : phase === 'back' ? data?.edition.backCover ?? data?.edition.cover : pages[page]?.image;

  const clearTimer = useCallback(() => { if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = null; }, []);
  const playTurn = useCallback(() => { const sound = turnRef.current; if (!sound) return; sound.currentTime = 0; sound.volume = 0.32; sound.play().catch(() => undefined); }, []);
  const playCurrent = useCallback(() => { if (!narration || phase !== 'pages') return; narrationRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }, [narration, phase]);

  const changePage = useCallback((nextPage: number, keepPlaying = playing) => {
    if (!total || nextPage < 0 || nextPage >= total || nextPage === page) return;
    narrationRef.current?.pause(); playTurn(); setPlaying(false); clearTimer();
    timerRef.current = setTimeout(() => {
      setPage(nextPage);
      if (keepPlaying && narration) timerRef.current = setTimeout(() => narrationRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false)), 120);
    }, reduced ? 0 : 320);
  }, [clearTimer, narration, page, playTurn, playing, reduced, total]);

  const finishBook = useCallback(() => {
    narrationRef.current?.pause(); setPlaying(false); playTurn(); clearTimer();
    timerRef.current = setTimeout(() => { setPhase('back'); timerRef.current = setTimeout(() => setPhase('end'), 3000); }, reduced ? 0 : 360);
    if (data) recordEvent({ type: 'story_completed', storyId: data.story.id, editionLocale: data.edition.locale, actorId: actorId.current });
  }, [clearTimer, data, playTurn, reduced]);

  const next = useCallback(() => {
    if (phase !== 'pages') return;
    if (page === total - 1) finishBook();
    else changePage(page + 1);
  }, [changePage, finishBook, page, phase, total]);
  const prev = useCallback(() => {
    if (phase === 'back' || phase === 'end') { clearTimer(); setPhase('pages'); setPage(Math.max(total - 1, 0)); return; }
    if (phase === 'pages' && page > 0) changePage(page - 1);
  }, [changePage, clearTimer, page, phase, total]);

  const begin = useCallback(() => {
    setChrome(false); playTurn(); clearTimer();
    timerRef.current = setTimeout(() => {
      setPhase('pages');
      if (narration && hasPageAudio) timerRef.current = setTimeout(() => narrationRef.current?.play().then(() => setPlaying(true)).catch(() => { setPlaying(false); setChrome(true); }), 100);
    }, reduced ? 0 : 900);
    if (data) recordEvent({ type: 'reading_started', storyId: data.story.id, editionLocale: data.edition.locale, actorId: actorId.current });
  }, [clearTimer, data, hasPageAudio, narration, playTurn, reduced]);

  const onNarrationEnded = useCallback(() => {
    setPlaying(false);
    if (!narration || phase !== 'pages') return;
    if (page === total - 1) finishBook();
    else changePage(page + 1, true);
  }, [changePage, finishBook, narration, page, phase, total]);
  const togglePlay = useCallback(() => { const audio = narrationRef.current; if (!audio || !narration) return; if (audio.paused) playCurrent(); else { audio.pause(); setPlaying(false); } }, [narration, playCurrent]);
  const toggleNarration = useCallback(() => {
    if (narration) { narrationRef.current?.pause(); setPlaying(false); setNarration(false); }
    else { setNarration(true); setTimeout(() => narrationRef.current?.play().then(() => setPlaying(true)).catch(() => setPlaying(false)), 0); }
  }, [narration]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await rootRef.current?.requestFullscreen();
        const orientation = screen.orientation as ScreenOrientation & { lock?: (value: string) => Promise<void> };
        await orientation.lock?.('landscape');
      } else await document.exitFullscreen();
    } catch { setNeedsRotate(window.matchMedia('(orientation: portrait)').matches); }
  }, []);
  const exit = useCallback(() => { clearTimer(); narrationRef.current?.pause(); if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined); router.push(`/story-library/s/${slug}`); }, [clearTimer, router, slug]);

  useEffect(() => {
    if (!data) return;
    actorId.current = getActorId(); const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    recordEvent({ type: 'story_opened', storyId: data.story.id, editionLocale: data.edition.locale, actorId: actorId.current });
    return () => { document.body.style.overflow = overflow; clearTimer(); };
  }, [clearTimer, data]);
  useEffect(() => { if (data && phase === 'pages') saveProgress({ slug, page, mode: narration ? 'storytime' : 'self', atISO: new Date().toISOString() }); }, [data, narration, page, phase, slug]);
  useEffect(() => { if (phase === 'pages') narrationRef.current?.load(); }, [page, phase]);
  useEffect(() => {
    if (phase !== 'pages') return;
    const nextPage = pages[page + 1];
    if (nextPage) {
      const image = new window.Image();
      image.src = nextPage.image.src;
      if (nextPage.audioSrc) {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = nextPage.audioSrc;
      }
    }
  }, [page, pages, phase]);
  useEffect(() => {
    if (!playing || !chrome) return;
    const timer = window.setTimeout(() => setChrome(false), 2600);
    return () => window.clearTimeout(timer);
  }, [chrome, playing]);
  useEffect(() => {
    const update = () => { const full = !!document.fullscreenElement; setIsFullscreen(full); setNeedsRotate(full && window.matchMedia('(orientation: portrait)').matches); };
    document.addEventListener('fullscreenchange', update); window.addEventListener('orientationchange', update);
    return () => { document.removeEventListener('fullscreenchange', update); window.removeEventListener('orientationchange', update); };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { setChrome(true); if (event.key === 'ArrowRight') next(); if (event.key === 'ArrowLeft') prev(); if (event.key === ' ') { event.preventDefault(); if (phase === 'front') begin(); else togglePlay(); } if (event.key.toLowerCase() === 'f') toggleFullscreen(); if (event.key.toLowerCase() === 'm') toggleNarration(); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [begin, next, phase, prev, toggleFullscreen, toggleNarration, togglePlay]);

  if (!data || !activeAsset || total === 0) return <div className="fixed inset-0 z-[999] grid place-items-center bg-[#101A29] text-[#F7F3EC]"><Link href="/story-library">Kutubxonaga qaytish</Link></div>;
  const progress = phase === 'front' ? 0 : phase === 'pages' ? ((page + 1) / total) * 100 : 100;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[999] select-none overflow-hidden text-[#F7F3EC]" style={{ background: 'radial-gradient(circle at 50% 45%, #26354A 0%, #101A29 72%)', fontFamily: BODY }} onPointerDown={event => { touchStart.current = { x: event.clientX, y: event.clientY }; setChrome(true); }} onPointerUp={event => { const start = touchStart.current; touchStart.current = null; if (!start || phase !== 'pages') return; const dx = event.clientX - start.x, dy = event.clientY - start.y; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); } }} onMouseMove={() => setChrome(true)}>
      <audio ref={turnRef} src={data.edition.pageTurnAudioSrc} preload="auto" />
      {phase === 'pages' && pages[page]?.audioSrc ? <audio ref={narrationRef} src={pages[page].audioSrc} preload="metadata" onEnded={onNarrationEnded} /> : null}
      <ReaderImage asset={activeAsset} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
      <button type="button" onClick={exit} aria-label="Chiqish" className="absolute left-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"><Icon name="close" /></button>
      <div className="absolute left-1/2 top-5 -translate-x-1/2 text-center"><p className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 sm:block">{data.edition.title}</p>{phase === 'pages' ? <p className="mt-1 text-[12px] tabular-nums text-white/85">{page + 1} / {total}</p> : null}</div>
      <button type="button" onClick={toggleFullscreen} aria-label="Butun ekran" className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50"><Icon name="full" /></button>

      {phase === 'front' ? <div className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent pb-9 sm:pb-12"><button type="button" onClick={begin} className="group inline-flex items-center gap-3 rounded-full border border-[#D6B770]/70 bg-[#F7F3EC] px-7 py-3.5 font-semibold text-[#101A29] shadow-2xl transition-transform hover:scale-[1.025]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#101A29] text-[#F7F3EC]"><Icon name="play" /></span><span suppressHydrationWarning>{saved?.page ? `${saved.page + 1}-sahifadan davom ettirish` : 'Kitobni boshlash'}</span></button></div> : null}

      {phase === 'pages' ? <><button type="button" onClick={prev} disabled={page === 0} aria-label="Oldingi sahifa" className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/25 backdrop-blur-md transition-opacity hover:bg-black/45 disabled:opacity-0 sm:left-5"><Icon name="prev" /></button><button type="button" onClick={next} aria-label="Keyingi sahifa" className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/25 backdrop-blur-md transition-colors hover:bg-black/45 sm:right-5"><Icon name="next" /></button><div className={`absolute inset-x-0 bottom-5 z-20 flex justify-center px-3 transition-opacity ${chrome || !playing ? 'opacity-100' : 'opacity-0'}`}><div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0B1320]/80 px-2 py-1 shadow-2xl backdrop-blur-xl"><Control label={narration ? "Ovozni o‘chirish" : 'Ovozni yoqish'} onClick={toggleNarration}><Icon name={narration ? 'sound' : 'mute'} /></Control>{narration ? <Control label={playing ? 'To‘xtatish' : 'Davom ettirish'} onClick={togglePlay}><Icon name={playing ? 'pause' : 'play'} /></Control> : null}<Control label="Oldingi sahifa" onClick={prev} disabled={page === 0}><Icon name="prev" /></Control><span className="min-w-[66px] text-center text-[12px] tabular-nums text-white/80">{page + 1} / {total}</span><Control label="Keyingi sahifa" onClick={next}><Icon name="next" /></Control><Control label="Butun ekran" onClick={toggleFullscreen}><Icon name="full" /></Control></div></div></> : null}

      {phase === 'end' ? <div className="absolute inset-0 z-30 grid place-items-center bg-[#0B1320]/75 px-6 backdrop-blur-md"><div className="max-w-md text-center"><span className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: GOLD }}>TALIMOON</span><h2 className="mt-4 text-4xl sm:text-5xl" style={{ fontFamily: DISPLAY }}>Hikoya nihoyasiga yetdi</h2><p className="mt-3 text-sm leading-7 text-white/65">Birga tinglaganingiz uchun rahmat.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => { setPage(0); setPhase('front'); setPlaying(false); }} className="rounded-full border border-white/20 px-5 py-3 text-sm hover:bg-white/10">Boshidan o‘qish</button><button type="button" onClick={exit} className="rounded-full px-5 py-3 text-sm font-semibold text-[#101A29]" style={{ background: CREAM }}>Kutubxonaga qaytish</button></div></div></div> : null}
      {needsRotate && isFullscreen ? <div className="absolute inset-0 z-50 grid place-items-center bg-[#101A29]/95 px-8 text-center sm:hidden"><div><div className="mx-auto mb-5 h-14 w-9 rotate-90 rounded-md border-2 border-[#C5A15F]" /><p className="text-lg" style={{ fontFamily: DISPLAY }}>Telefonni gorizontal aylantiring</p><p className="mt-2 text-xs text-white/55">Kitob sahifalari shu holatda to‘liq va ravshan ko‘rinadi.</p></div></div> : null}
      <div className="absolute inset-x-0 bottom-0 z-40 h-[2px] bg-white/10"><div className="h-full transition-[width] duration-500" style={{ width: `${progress}%`, background: GOLD }} /></div>
      <p className="sr-only" aria-live="polite">{phase === 'pages' ? `${page + 1}-sahifa, jami ${total}` : phase === 'end' ? 'Hikoya tugadi' : ''}</p>
    </div>
  );
}

export default Reader;
