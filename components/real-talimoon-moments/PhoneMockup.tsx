"use client";

/**
 * PhoneMockup — Real Talimoon Moments
 * ----------------------------------------------------------------
 * A realistic, minimal device frame (thin bezel, rounded corners, a
 * faint glass reflection) presenting one customer video at a time.
 * The frame itself never moves or resizes — only the video pane
 * inside it crossfades when a different moment is selected.
 *
 * The outer bezel radius/proportions are the one deliberate
 * departure from the site's literal `rounded-sm` card radius: no
 * token in the existing radius scale (2/6/12px) reads as a phone at
 * any plausible mockup size, so — same precedent as Examples.tsx's
 * own `rounded-[16px]` card treatment and the Our Products door
 * geometry — this uses an arbitrary value sized for a believable
 * device silhouette. Every color and the shadow are existing tokens.
 */

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Moment } from "./RealTalimoonMoments";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-0.5 h-6 w-6">
      <path d="M7 5.5c0-1.1 1.2-1.8 2.2-1.2l10 6.5c.9.6.9 2 0 2.6l-10 6.5c-1 .6-2.2-.1-2.2-1.2v-13Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-6 w-6">
      <rect x="6.5" y="4.5" width="4" height="15" rx="1" />
      <rect x="13.5" y="4.5" width="4" height="15" rx="1" />
    </svg>
  );
}

export function PhoneMockup({ moment }: { moment: Moment }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Outer bezel */}
      <div className="relative aspect-[9/19.5] w-full rounded-[2.75rem] bg-[var(--ink-950,#211D18)] p-[10px] shadow-[0_20px_50px_rgba(42,36,29,0.18)]">
        {/* Side buttons — decorative, reinforce device realism */}
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[104px] h-8 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -left-[1.5px] top-[144px] h-14 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />
        <span aria-hidden="true" className="absolute -right-[1.5px] top-[130px] h-16 w-[3px] rounded-full bg-[var(--ink-950,#211D18)]" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-[var(--ink-950,#211D18)]">
          <AnimatePresence initial={false}>
            <motion.div
              key={moment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={moment.thumbnail}
                alt={`${moment.name} watching their child's personalized TALIMOON story together`}
                fill
                sizes="300px"
                className="object-cover"
              />
              {/* Legibility scrim for the name/age/progress overlay — a
                  functional necessity for readable white text on a
                  photo, not a decorative background effect. */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => setIsPlaying((v) => !v)}
                aria-label={isPlaying ? `Pause ${moment.name}'s video` : `Play ${moment.name}'s video`}
                className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[var(--ink-950,#211D18)] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-105">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </span>
              </button>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                <div className="mb-2 h-[3px] w-full overflow-hidden rounded-full bg-white/25">
                  <div className="h-full w-[35%] rounded-full bg-[var(--gold-500,#B8935B)]" />
                </div>
                <p className="font-sans text-[0.9375rem] font-semibold text-white">{moment.name}</p>
                <p className="font-sans text-[0.8125rem] text-white/70">{moment.childAge}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dynamic-island-style notch */}
          <div aria-hidden="true" className="absolute left-1/2 top-2 z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[var(--ink-950,#211D18)]" />

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
