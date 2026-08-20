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
import { useRef, useState } from "react";
import type { Moment } from "./RealTalimoonMoments";

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
}: {
  moment: Moment;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(moment.video);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
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
            className="absolute inset-0 h-full w-full object-contain object-top"
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
          aria-label={isPlaying ? `Pause ${moment.name}'s video` : `Play ${moment.name}'s video`}
          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-[var(--gold-500,#B8935B)]"
              style={{ width: `${(hasVideo ? progress : 0.35) * 100}%` }}
            />
          </div>
          <p className="font-sans text-[0.9375rem] font-semibold text-white">{moment.name}</p>
          {moment.childAge && (
            <p className="font-sans text-[0.8125rem] text-white/70">{moment.childAge}</p>
          )}
        </div>
      </div>

      {/* Transport bar — fixed height, dedicated to Prev/Mute/Play/Next.
          A flex sibling of the stage above, never an overlay on it.
          Its backdrop is the moment's own thumbnail, flipped and
          blurred into a soft reflection under a dark gradient. */}
      <div className="relative flex h-[52px] shrink-0 items-center overflow-hidden border-t border-white/10">
        <Image
          src={moment.thumbnail}
          alt=""
          aria-hidden="true"
          fill
          sizes="280px"
          className="scale-110 object-cover object-bottom opacity-80 blur-[3px] [transform:scaleY(-1)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/78 to-black/95" />

        <div className="relative z-10 flex w-full items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setIsMuted((m) => !m)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <SpeakerIcon muted={isMuted} />
          </button>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous moment"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? `Pause ${moment.name}'s video` : `Play ${moment.name}'s video`}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-[var(--ink-950,#211D18)] shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next moment"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          {/* Balances the mute button's width so the Prev/Play/Next
              cluster reads as truly centered, not offset by it. */}
          <div className="h-9 w-9" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

export function PhoneMockup({
  moment,
  onPrev,
  onNext,
}: {
  moment: Moment;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Outer bezel */}
      <div className="relative aspect-[9/17.12] w-full rounded-[2.75rem] bg-[var(--ink-950,#211D18)] p-[10px] shadow-[0_20px_50px_rgba(42,36,29,0.18)]">
        {/* Side buttons — decorative, reinforce device realism */}
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[104px] h-8 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[144px] h-14 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -right-[1.5px] top-[130px] h-16 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-[var(--ink-950,#211D18)]">
          <AnimatePresence initial={false}>
            <MomentScreen key={moment.id} moment={moment} onPrev={onPrev} onNext={onNext} />
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
