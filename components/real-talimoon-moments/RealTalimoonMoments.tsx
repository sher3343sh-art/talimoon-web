"use client";

/**
 * RealTalimoonMoments — TALIMOON home page
 * ----------------------------------------------------------------
 * Sits between Story Library and Examples. Purpose is trust, not
 * engagement: a fixed phone mockup plays one selected customer video
 * at a time; selecting a different card from the list only crossfades
 * the phone's content — nothing else on the page moves.
 *
 * Consistency with the locked Hero / BookShowcase / InsideBook /
 * Examples system (not the newer @theme-inline bridge classes used
 * by StoryLibraryPreview): container `max-w-[1440px]` with the same
 * `px-5 md:px-10 lg:px-16` / `py-16 md:py-20 lg:py-28` rhythm,
 * `font-serif`/`font-sans` + literal rem sizes, `var(--token,fallback)`
 * colors, and the `bg-[var(--surface-warm-100,#F7F2EA)]` background
 * already used by Examples/BookShowcase/InsideBook — chosen because
 * this section sits directly between Story Library and Examples, and
 * matching Examples' literal background exactly avoids reintroducing
 * the hairline seam bug already fixed once at that same boundary.
 *
 * Left/right split is 40/60 (`lg:grid-cols-5`, span 2/3) per this
 * section's explicit spec, not the 50/50 `lg:grid-cols-2` BookShowcase
 * and InsideBook use for their own mockup+content layout.
 *
 * "madinabonu" is the first real customer moment: an on-brand H.264
 * MP4 (transcoded from a 90MB/1072x1920/50fps source down to ~8.5MB
 * at 480px width/30fps — plenty for this mockup's max 300px display
 * width — via `public/video/madinabonu-1.mp4` + poster frame at
 * `public/images/home/real-talimoon-moments/madinabonu-poster.jpg`;
 * the untouched original lives in `media-source/video/`, gitignored,
 * not served). The other two entries remain placeholders — the
 * existing Hero family photographs (public/images/hero/{d,s}.webp)
 * with illustrative names/ages/reaction counts, not claims about
 * specific verified customers — until their own videos exist.
 */

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { MomentsList } from "./MomentsList";
import { ReactionRow } from "./ReactionRow";

export type Moment = {
  id: string;
  name: string;
  childAge: string;
  duration: string;
  thumbnail: string;
  /** Real video source, when available. Falls back to a static thumbnail when absent. */
  video?: string;
  reactions: { smile: number; love: number; wow: number };
};

const MOMENTS: Moment[] = [
  {
    id: "madinabonu",
    name: "Madinabonu",
    childAge: "Age 7",
    duration: "1:49",
    thumbnail: "/images/home/real-talimoon-moments/madinabonu-poster.jpg",
    video: "/video/madinabonu-1.mp4",
    reactions: { smile: 214, love: 189, wow: 76 },
  },
  {
    id: "yusuf",
    name: "Yusuf's Family",
    childAge: "Age 7",
    duration: "0:52",
    thumbnail: "/images/hero/d.webp",
    reactions: { smile: 176, love: 240, wow: 61 },
  },
  {
    id: "layla",
    name: "Layla's Family",
    childAge: "Age 4",
    duration: "0:45",
    thumbnail: "/images/hero/s.webp",
    reactions: { smile: 198, love: 205, wow: 84 },
  },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RealTalimoonMoments() {
  const [selectedId, setSelectedId] = useState(MOMENTS[0].id);
  const reducedMotion = useReducedMotion();
  const selectedIndex = MOMENTS.findIndex((m) => m.id === selectedId);
  const selected = MOMENTS[selectedIndex] ?? MOMENTS[0];

  const goToOffset = (offset: number) => {
    const nextIndex = (selectedIndex + offset + MOMENTS.length) % MOMENTS.length;
    setSelectedId(MOMENTS[nextIndex].id);
  };

  return (
    <motion.section
      aria-labelledby="real-moments-heading"
      className="w-full overflow-hidden bg-[var(--surface-warm-100,#F7F2EA)] py-16 md:py-20 lg:py-28"
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={reveal}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-5 lg:gap-20 lg:px-16">
        <div className="lg:col-span-2">
          <PhoneMockup
            moment={selected}
            onPrev={() => goToOffset(-1)}
            onNext={() => goToOffset(1)}
          />
        </div>

        <div className="lg:col-span-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            Real Talimoon Moments
          </p>
          <h2
            id="real-moments-heading"
            className="mt-3 font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            Real Families. Real Joy.
          </h2>
          <p className="mt-4 max-w-[46ch] font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            Watch genuine reactions from families experiencing their
            child&apos;s personalized story for the very first time.
          </p>

          <MomentsList moments={MOMENTS} selectedId={selectedId} onSelect={setSelectedId} />
          <ReactionRow reactions={selected.reactions} />
        </div>
      </div>
    </motion.section>
  );
}

export default RealTalimoonMoments;
