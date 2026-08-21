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

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { MomentsList } from "./MomentsList";
import { ReactionRow } from "./ReactionRow";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";

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

export type ReactionKey = keyof Moment["reactions"];
const REACTION_KEYS: ReactionKey[] = ["smile", "love", "wow"];

function reactionStorageKey(momentId: string, key: ReactionKey) {
  return `talimoon:moment-reaction:${momentId}:${key}`;
}

// name/childAge translations, keyed by moment id — kept parallel to
// MOMENTS (English base) rather than restructuring every field into
// {en,uz} pairs, same pattern as Hero.tsx's `copyUz`.
const MOMENT_COPY_UZ: Record<string, { name: string; childAge: string }> = {
  madinabonu: { name: "Madinabonu", childAge: "7 yosh" },
  yusuf: { name: "Yusufning oilasi", childAge: "7 yosh" },
  layla: { name: "Laylaning oilasi", childAge: "4 yosh" },
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

const SECTION_COPY_EN = {
  eyebrow: "Real Talimoon Moments",
  heading: "Real Families. Real Joy.",
  description:
    "Watch genuine reactions from families experiencing their child's personalized story for the very first time.",
};

const SECTION_COPY_UZ: typeof SECTION_COPY_EN = {
  eyebrow: "Haqiqiy Talimoon lahzalari",
  heading: "Haqiqiy oilalar. Haqiqiy quvonch.",
  description:
    "Farzandlari o'zlarining shaxsiylashtirilgan hikoyasini birinchi marta ko'rayotgan oilalarning samimiy his-tuyg'ularini tomosha qiling.",
};

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
  const { language } = useLanguage();
  const t = useT(SECTION_COPY_EN, SECTION_COPY_UZ);

  const moments =
    language === "UZ"
      ? MOMENTS.map((m) => ({ ...m, ...MOMENT_COPY_UZ[m.id] }))
      : MOMENTS;

  const selectedIndex = moments.findIndex((m) => m.id === selectedId);
  const selected = moments[selectedIndex] ?? moments[0];

  const goToOffset = (offset: number) => {
    const nextIndex = (selectedIndex + offset + moments.length) % moments.length;
    setSelectedId(moments[nextIndex].id);
  };

  // Which (moment, reaction) pairs this browser has already tapped —
  // the phone's own reaction buttons are real, not decorative: a tap
  // increments the count for good, once per visitor, same "once per
  // browser via localStorage" honesty already established by
  // FamiliesWall's ReactionBar (no backend to track it more precisely
  // than that). Hydrated post-mount, not via a lazy initializer:
  // localStorage doesn't exist during SSR, so reading it up front
  // would mismatch the server-rendered HTML.
  const [reactedMap, setReactedMap] = useState<Record<string, Partial<Record<ReactionKey, boolean>>>>({});

  // Deliberately an effect, not a lazy useState initializer — same
  // documented exception as FamiliesWall's ReactionBar: reading
  // localStorage during the initializer would run on the client's
  // first (hydration) render and mismatch the server-rendered HTML,
  // which always renders "nothing reacted yet" since localStorage
  // isn't available server-side. Applying it post-hydration, here, is
  // the correct SSR-safe pattern, not the "should have used a lazy
  // initializer" case react-hooks/set-state-in-effect is checking
  // for. Runs once on mount only.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const map: Record<string, Partial<Record<ReactionKey, boolean>>> = {};
    for (const m of MOMENTS) {
      map[m.id] = {};
      for (const key of REACTION_KEYS) {
        if (window.localStorage.getItem(reactionStorageKey(m.id, key)) === "1") {
          map[m.id][key] = true;
        }
      }
    }
    setReactedMap(map);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const reactToMoment = (momentId: string, key: ReactionKey) => {
    if (reactedMap[momentId]?.[key]) return;
    window.localStorage.setItem(reactionStorageKey(momentId, key), "1");
    setReactedMap((prev) => ({
      ...prev,
      [momentId]: { ...prev[momentId], [key]: true },
    }));
  };

  // The live count the phone's buttons and the ReactionRow below both
  // display — same source, so they can never drift out of sync. Only
  // the phone's own buttons can ever change it (ReactionRow is
  // display-only, per spec); this is just where both read it from.
  const selectedReacted = reactedMap[selected.id] ?? {};
  const liveReactions = {
    smile: selected.reactions.smile + (selectedReacted.smile ? 1 : 0),
    love: selected.reactions.love + (selectedReacted.love ? 1 : 0),
    wow: selected.reactions.wow + (selectedReacted.wow ? 1 : 0),
  };
  const liveSelected: Moment = { ...selected, reactions: liveReactions };

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
            moment={liveSelected}
            onPrev={() => goToOffset(-1)}
            onNext={() => goToOffset(1)}
            onReact={(key) => reactToMoment(selected.id, key)}
            reacted={selectedReacted}
          />
        </div>

        <div className="lg:col-span-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary,#B5764B)]">
            {t.eyebrow}
          </p>
          <h2
            id="real-moments-heading"
            className="mt-3 font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            {t.heading}
          </h2>
          <p className="mt-4 max-w-[46ch] font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            {t.description}
          </p>

          <MomentsList moments={moments} selectedId={selectedId} onSelect={setSelectedId} />
          <ReactionRow reactions={liveReactions} />
        </div>
      </div>
    </motion.section>
  );
}

export default RealTalimoonMoments;
