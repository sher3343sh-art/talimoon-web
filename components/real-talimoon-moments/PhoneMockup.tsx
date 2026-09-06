"use client";

/**
 * PhoneMockup — Real Talimoon Moments
 * ----------------------------------------------------------------
 * A realistic, minimal device frame (thin bezel, rounded corners, a
 * faint glass reflection) presenting one customer video at a time.
 * The frame itself never moves or resizes — only the video pane
 * inside it crossfades when a different moment is selected.
 *
 * The outer bezel radius is the one deliberate departure from the
 * site's literal `rounded-sm` card radius: no token in the existing
 * radius scale (2/6/12px) reads as a phone at any plausible mockup
 * size, so — same precedent as Examples.tsx's own `rounded-[16px]`
 * card treatment and the Our Products door geometry — this uses an
 * arbitrary value sized for a believable device silhouette. Every
 * color and the shadow are existing tokens.
 *
 * The bezel's `aspect-[9/17.12]` starts from the real customer
 * videos' native aspect ratio (source footage is ~1072x1920, i.e.
 * 9:16), then stretches height +7% (width fixed) per an explicit
 * owner request for a taller silhouette. The screen is split into
 * two flex rows so the extra height never fights the video: a
 * `flex-1` stage holds the `<video>` at `object-contain object-top`
 * (true frame, zero crop/zoom, flush with the screen's top edge —
 * all per explicit owner request), and a fixed-height transport bar
 * below it owns Prev/Mute/Play/Next. Because the bar's height is a
 * fixed flex sibling rather than an overlay on top of the video, it
 * can never cover the video's pixels regardless of any moment's
 * aspect ratio — the two only ever compete for space, never overlap.
 *
 * The notch is a deliberately small pill (iPhone-Pro-Dynamic-Island
 * proportioned, not the earlier oversized placeholder) — the source
 * footage's own "Talimoon" brand mark is burned into the top-right
 * of the video itself (owner-supplied, not something this component
 * renders), so a smaller notch is the only lever available here to
 * avoid sitting on top of it; it can't be guaranteed pixel-perfect
 * against every future customer video's own watermark placement.
 *
 * The transport bar's background is a softened, darkened mirror of
 * the current moment's own thumbnail (flipped vertically, blurred,
 * then a black gradient laid over it) rather than a flat fill — reads
 * as a glass/water reflection under the screen instead of a physical
 * hardware button row. Deliberately built from the static thumbnail,
 * not a second live `<video>`: a synced second decode would double
 * playback cost for a purely decorative, heavily-obscured backdrop
 * that gets a real photograph's worth of readability, not a video's.
 *
 * Renders a real `<video>` (click-to-play, `preload="none"` so it
 * never loads until requested) when `moment.video` is set, else
 * falls back to the static thumbnail `Image` used by moments that
 * don't have a video yet.
 */

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Moment, ReactionKey } from "./RealTalimoonMoments";
import { useT } from "@/lib/i18n/LanguageContext";

// iOS Safari's non-standard native-video-fullscreen API — not in the
// standard DOM lib types, so declared here rather than sprinkling
// `as any` at every call site.
interface IOSVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
}

const CHROME_EN = {
  play: (name: string) => `Play ${name}'s video`,
  pause: (name: string) => `Pause ${name}'s video`,
  prevMoment: "Previous moment",
  nextMoment: "Next moment",
  mute: "Mute",
  unmute: "Unmute",
  enterFullscreen: "Enter fullscreen",
  exitFullscreen: "Exit fullscreen",
  reactionLabels: { smile: "Smile", love: "Love", wow: "Wow" } as Record<ReactionKey, string>,
  reactWith: (label: string, active: boolean) =>
    `React with ${label}${active ? " — already reacted" : ""}`,
};

const CHROME_UZ: typeof CHROME_EN = {
  play: (name: string) => `${name} videosini ijro etish`,
  pause: (name: string) => `${name} videosini pauza qilish`,
  prevMoment: "Oldingi lahza",
  nextMoment: "Keyingi lahza",
  mute: "Ovozni o'chirish",
  unmute: "Ovozni yoqish",
  enterFullscreen: "To'liq ekran",
  exitFullscreen: "To'liq ekrandan chiqish",
  reactionLabels: { smile: "Tabassum", love: "Sevgi", wow: "Hayrat" } as Record<ReactionKey, string>,
  reactWith: (label: string, active: boolean) =>
    `${label} bilan munosabat bildirish${active ? " — allaqachon bildirilgan" : ""}`,
};

const CHROME_RU: typeof CHROME_EN = {
  play: (name: string) => `Воспроизвести видео от ${name}`,
  pause: (name: string) => `Поставить на паузу видео от ${name}`,
  prevMoment: "Предыдущий момент",
  nextMoment: "Следующий момент",
  mute: "Выключить звук",
  unmute: "Включить звук",
  enterFullscreen: "Во весь экран",
  exitFullscreen: "Выйти из полноэкранного режима",
  reactionLabels: { smile: "Улыбка", love: "Любовь", wow: "Восторг" } as Record<ReactionKey, string>,
  reactWith: (label: string, active: boolean) =>
    `Реакция «${label}»${active ? ", уже отмечено" : ""}`,
};

function PlayIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`ml-0.5 ${className}`}>
      <path d="M7 5.5c0-1.1 1.2-1.8 2.2-1.2l10 6.5c.9.6.9 2 0 2.6l-10 6.5c-1 .6-2.2-.1-2.2-1.2v-13Z" />
    </svg>
  );
}

function PauseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="6.5" y="4.5" width="4" height="15" rx="1" />
      <rect x="13.5" y="4.5" width="4" height="15" rx="1" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
      <path d={direction === "left" ? "M14.5 5.5 8 12l6.5 6.5" : "M9.5 5.5 16 12l-6.5 6.5"} />
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[17px] w-[17px]"
    >
      {active ? (
        <path d="M9 4.5v3A1.5 1.5 0 0 1 7.5 9h-3M15 4.5v3A1.5 1.5 0 0 0 16.5 9h3M9 19.5v-3A1.5 1.5 0 0 0 7.5 15h-3M15 19.5v-3a1.5 1.5 0 0 1 1.5-1.5h3" />
      ) : (
        <path d="M4.5 9V6A1.5 1.5 0 0 1 6 4.5h3M19.5 9V6A1.5 1.5 0 0 0 18 4.5h-3M4.5 15v3A1.5 1.5 0 0 0 6 19.5h3M19.5 15v3a1.5 1.5 0 0 1-1.5 1.5h-3" />
      )}
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
      <path
        d="M4 9.5v5h3.2L12 18.3V5.7L7.2 9.5H4Z"
        fill="currentColor"
      />
      {muted ? (
        <path d="M16 9.5 20.5 14M20.5 9.5 16 14" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      ) : (
        <path
          d="M15.8 8.3a5 5 0 0 1 0 7.4M18.3 6a8.5 8.5 0 0 1 0 12"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}

const REACTION_EMOJIS: { key: ReactionKey; emoji: string }[] = [
  { key: "smile", emoji: "😊" },
  { key: "love", emoji: "❤️" },
  { key: "wow", emoji: "🤩" },
];

// Small on-screen counterpart to ReactionRow below the phone — real,
// not decorative: tapping one actually increments that moment's count
// (via `onReact`, owned by the parent so ReactionRow can show the
// exact same live number). `active` reflects `reacted` from the
// parent, not local state, since "which reaction (if any) have I
// already cast" has to survive this component remounting on every
// moment switch. One choice per moment, ever — once `reacted` is set
// (to any key), every button in the cluster locks, including the
// chosen one itself; there's no "pick again" or "switch emoji".
function ReactionButton({
  emoji,
  count,
  active,
  locked,
  label,
  onClick,
}: {
  emoji: string;
  count: number;
  active: boolean;
  locked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      aria-label={label}
      aria-pressed={active}
      className={[
        "flex items-center gap-0.5 rounded-full px-1 py-0.5 text-[12.5px] font-semibold leading-none transition-colors disabled:cursor-default",
        active
          ? "text-[var(--gold-500,#B8935B)]"
          : locked
            ? "text-white/40"
            : "text-white/80 hover:text-white",
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-[15px] leading-none">
        {emoji}
      </span>
      <span>{count}</span>
    </button>
  );
}

// Owns isPlaying/progress/isMuted itself and is mounted with
// `key={moment.id}` by its AnimatePresence parent below, so switching
// moments naturally resets all three to their initial values via
// unmount/remount — no effect needed to sync them back to a fresh
// state. The transport bar lives in here too (not lifted to
// PhoneMockup) so its Play/Mute buttons can share that same
// per-moment state without re-introducing a parent effect just to
// sync it back down.
function MomentScreen({
  moment,
  onPrev,
  onNext,
  onReact,
  reacted,
}: {
  moment: Moment;
  onPrev: () => void;
  onNext: () => void;
  onReact: (key: ReactionKey) => void;
  reacted: ReactionKey | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasVideo = Boolean(moment.video);
  const chrome = useT(CHROME_EN, CHROME_UZ, CHROME_RU);

  const togglePlay = () => {
    if (!hasVideo) {
      setIsPlaying((v) => !v);
      return;
    }
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.ended) el.currentTime = 0;
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  // True browser fullscreen (like YouTube), not just an enlarged view
  // inside the phone frame — requestFullscreen on this screen's own
  // container takes it out of the bezel's clipping/max-width entirely
  // (the Fullscreen API renders it in the browser's top layer), so no
  // extra sizing CSS is needed beyond what's already here for the
  // normal phone-mockup layout. Synced via the fullscreenchange event
  // rather than only in the click handler, since fullscreen can also
  // exit via Escape or the browser's own UI.
  //
  // iOS Safari never implemented `Element.requestFullscreen()` for
  // arbitrary containers — only a `<video>` element can go fullscreen
  // there, via the non-standard `webkitEnterFullscreen()`, which hands
  // control to the OS's own native video player (our custom bar isn't
  // visible during that, same trade-off every custom web video player
  // on iOS makes). `webkitbeginfullscreen`/`webkitendfullscreen` fire
  // on the video element itself in that case, not `fullscreenchange`
  // on `document`, so both are listened for to keep the button's own
  // icon state correct either way.
  useEffect(() => {
    const video = videoRef.current as IOSVideoElement | null;

    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    const onIOSBegin = () => setIsFullscreen(true);
    const onIOSEnd = () => setIsFullscreen(false);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    video?.addEventListener("webkitbeginfullscreen", onIOSBegin);
    video?.addEventListener("webkitendfullscreen", onIOSEnd);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      video?.removeEventListener("webkitbeginfullscreen", onIOSBegin);
      video?.removeEventListener("webkitendfullscreen", onIOSEnd);
    };
  }, []);

  const toggleFullscreen = () => {
    const video = videoRef.current as IOSVideoElement | null;

    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (video?.webkitDisplayingFullscreen) {
      video.webkitExitFullscreen?.();
      return;
    }
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {
        video?.webkitEnterFullscreen?.();
      });
    } else {
      video?.webkitEnterFullscreen?.();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col bg-[var(--ink-950,#211D18)]"
    >
      {/* Stage — the video/photo pane. Everything here only ever
          competes with the transport bar below for height, never
          gets drawn over by it. */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={moment.video}
            poster={moment.thumbnail}
            playsInline
            preload="none"
            muted={isMuted}
            className={[
              "absolute inset-0 h-full w-full object-contain",
              isFullscreen ? "object-center" : "object-top",
            ].join(" ")}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration) setProgress(el.currentTime / el.duration);
            }}
          />
        ) : (
          <Image
            src={moment.thumbnail}
            alt={`${moment.name} watching their child's personalized TALIMOON story together`}
            fill
            sizes="300px"
            className="object-cover"
          />
        )}
        {/* Legibility scrim for the name/age/progress overlay — a
            functional necessity for readable white text on a
            photo, not a decorative background effect. */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? chrome.pause(moment.name) : chrome.play(moment.name)}
          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        />
      </div>

      {/* Transport bar — the clickable row (Prev/Mute/Play/Next) is a
          fixed 52px flex sibling of the stage above, same as always.
          Its backdrop is deliberately taller than that and bleeds
          upward into the stage: two earlier attempts tried to patch
          the letterbox gap from the STAGE side (a blurred copy of the
          thumbnail sitting behind the video) and kept failing on real
          mobile devices — the stage's own name/age text scrim already
          darkens that exact region (`bg-gradient-to-t from-black/70`
          below), so a bright blurred patch there read as a mismatched
          bright island against darker surroundings, not a fix. Owner
          feedback: raise the bar's own reflection/shadow up instead.
          That's what this does — one continuous dark backdrop that's
          already the right darkness (it's the same treatment the
          stage's own scrim uses), covering the gap from below/on top
          rather than trying to match it from behind. No `overflow-
          hidden` on this outer row — that's what lets the taller
          backdrop actually bleed upward past the 52px box instead of
          being clipped to it; the backdrop has its own inner
          `overflow-hidden` so the flipped image itself still gets
          clean edges. */}
      <div className="relative flex h-[52px] shrink-0 items-center">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[96px] overflow-hidden">
          <Image
            src={moment.thumbnail}
            alt=""
            aria-hidden="true"
            fill
            sizes="280px"
            className="scale-110 object-cover object-bottom blur-md [transform:scaleY(-1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/55 to-black/95" />
        </div>

        {/* Progress bar + name/age (left) + reactions (right) — moved
            down from the stage into this bled-up blur zone (owner
            request), instead of sitting right at the stage's own
            bottom edge. Reactions sit in the space the name row used
            to leave empty on the right — real buttons (see
            `ReactionButton` above), vertically centered against the
            name/age block via `items-center` — not bottom-aligned
            with the age line (owner feedback: that put them right on
            top of the transport bar's icon row below, reading as
            squished together) and not top-aligned with the name line
            either (owner feedback: that glued them to the name text
            instead of sitting between the two lines). This row alone
            gets `pointer-events-auto` despite the wrapper around it
            being `pointer-events-none` (a CSS descendant can always
            re-enable pointer events an ancestor turned off). Locked to
            one choice per moment — once `reacted` is set, every button
            disables, including the chosen one; there's no re-picking
            or switching emoji. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[52px] px-4">
          <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-[var(--gold-500,#B8935B)]"
              style={{ width: `${(hasVideo ? progress : 0.35) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <p className="truncate font-sans text-[0.9375rem] font-semibold text-white">{moment.name}</p>
              {moment.childAge && (
                <p className="font-sans text-[0.8125rem] text-white/70">{moment.childAge}</p>
              )}
            </div>

            <div className="pointer-events-auto flex shrink-0 items-center gap-px">
              {REACTION_EMOJIS.map(({ key, emoji }) => (
                <ReactionButton
                  key={key}
                  emoji={emoji}
                  count={moment.reactions[key]}
                  active={reacted === key}
                  locked={reacted !== null}
                  label={chrome.reactWith(chrome.reactionLabels[key], reacted === key)}
                  onClick={() => onReact(key)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? chrome.unmute : chrome.mute}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <SpeakerIcon muted={isMuted} />
          </button>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onPrev}
              aria-label={chrome.prevMoment}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? chrome.pause(moment.name) : chrome.play(moment.name)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[var(--ink-950,#211D18)] shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label={chrome.nextMoment}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          {/* Mirrors the mute button on the opposite side, both so the
              Prev/Play/Next cluster reads as truly centered and so the
              bar has a real, functional fullscreen control — like
              YouTube's, this takes over the whole device screen, not
              just a bigger box inside the phone frame (see the
              `containerRef`/`requestFullscreen` note above). Only
              offered for real video; a static placeholder photo has
              nothing fullscreen would add, so that case keeps the
              plain balancing spacer it always had. */}
          {hasVideo ? (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? chrome.exitFullscreen : chrome.enterFullscreen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <FullscreenIcon active={isFullscreen} />
            </button>
          ) : (
            <div className="h-9 w-9" aria-hidden="true" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PhoneMockup({
  moment,
  onPrev,
  onNext,
  onReact,
  reacted,
}: {
  moment: Moment;
  onPrev: () => void;
  onNext: () => void;
  onReact: (key: ReactionKey) => void;
  reacted: ReactionKey | null;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Outer bezel */}
      <div className="relative aspect-[9/17.12] w-full rounded-[2.75rem] bg-[var(--ink-950,#211D18)] p-[10px] shadow-[var(--shadow-media)]">
        {/* Side buttons — decorative, reinforce device realism */}
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[104px] h-8 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[144px] h-14 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -right-[1.5px] top-[130px] h-16 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-[var(--ink-950,#211D18)]">
          <AnimatePresence initial={false}>
            <MomentScreen
              key={moment.id}
              moment={moment}
              onPrev={onPrev}
              onNext={onNext}
              onReact={onReact}
              reacted={reacted}
            />
          </AnimatePresence>

          {/* Dynamic-island-style notch — small, iPhone-Pro-proportioned */}
          <div aria-hidden="true" className="absolute left-1/2 top-[6px] z-20 h-[14px] w-[54px] -translate-x-1/2 rounded-full bg-[var(--ink-950,#211D18)]" />

          {/* Faint glass reflection — subtle, static, no floating effect */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-white/12 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;
