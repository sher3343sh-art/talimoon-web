"use client";

/**
 * FourDoorsSection — TALIMOON
 * ----------------------------------------------------------------
 * Now a Client Component (was a server component before): needs
 * `useT` (a Context hook) for translated copy.
 *
 * The home "Our Products" scene: heading, three DoorPortals and trust
 * strip. All rendering and interaction logic for an individual door
 * lives in DoorPortal.tsx — this file only assembles the composition
 * and owns the copy.
 *
 * 2026-08-24: this section used to be the one outlier on the page —
 * every other section sits on a flat cream background, but this one
 * had a full painted wall-scene photo (background.png) behind the
 * doors. Replaced with the shared flat `bg-surface-base` plus a CSS
 * brick-line texture behind the doors.
 *
 * 2026-08-27 (follow-up): the brick texture didn't fit Talimoon's own
 * visual language, and BrandValues (the section directly above this
 * one) already has a much better match — the same delicate sepia
 * line-art illustration (`/images/values/book.png`: leaf branches in
 * the corners, minaret silhouettes, flowing lines converging into
 * root-like linework at the bottom) already used for its own
 * background. `<HeritageBackdrop />` reuses that exact same image
 * here too — full-strength at the top (where it visually continues
 * BrandValues' bottom edge, corner-leaf motif meeting corner-leaf
 * motif) fading down through the doors so the artwork's own linework
 * still shows faintly behind them, rather than a fresh, unrelated
 * texture. One shared asset now bridges both sections into a single
 * visual "moment," instead of each being its own disconnected block.
 *
 * Story Library was removed from this section only; it is left
 * untouched everywhere else (nav, routes, Hero).
 */

import Image from "next/image";
import { DoorPortal, type DoorVariant } from "./DoorPortal";
import { useT } from "@/lib/i18n/LanguageContext";

function HeritageBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // Opaque at the very top (where BrandValues' own corner-leaf
        // motif ends, right above this section) fading down to a
        // faint-but-still-visible level by the doors — never fully
        // transparent, so the linework doubles as their "chiziqli
        // fon" (line background) too, per spec.
        maskImage:
          "linear-gradient(to bottom, black 0%, black 20%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.22) 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 20%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.22) 100%)",
      }}
    >
      <Image
        src="/images/values/book.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "top center" }}
      />
    </div>
  );
}

const VARIANT_COPY_EN = {
  "personalized-books": {
    title: "Personalized Books",
    tagline: "Your child becomes the hero of a story created especially for them.",
  },
  "yusuf-yasmina": {
    title: "Yusuf & Yasmina",
    tagline: "Faith-filled adventures that inspire kindness, courage, and beautiful character.",
  },
  "talimoon-toys": {
    title: "Talimoon Toys",
    tagline: "Beautiful toys that transform everyday play into joyful learning.",
  },
};

const VARIANT_COPY_UZ: typeof VARIANT_COPY_EN = {
  "personalized-books": {
    title: "Shaxsiylashtirilgan Kitoblar",
    tagline: "Farzandingiz uchun yaratilgan, uni o'z hikoyasining bosh qahramoniga aylantiradigan betakror kitob.",
  },
  "yusuf-yasmina": {
    title: "Yusuf va Yasmina",
    tagline: "Yusuf va Yasmina bilan ezgulik, do'stlik va jasoratni kashf etishga chorlaydigan ilhomli hikoyalar.",
  },
  "talimoon-toys": {
    title: "Talimoon O'yinchoqlari",
    tagline: "Bolaning qiziqishi, tasavvuri va tafakkurini o'yin orqali rivojlantirish uchun yaratilgan o'yinchoqlar.",
  },
};

const VARIANTS: DoorVariant[] = [
  {
    id: "personalized-books",
    title: "Personalized Books",
    tagline: "Your child becomes the hero of a story created especially for them.",
    href: "/products/personalized-books",
    assets: {
      frame: "/images/home/OurProducts/books-frame.png",
      door: "/images/home/OurProducts/books-door.png",
      mask: "/images/home/OurProducts/books-mask.png",
      // 2026-08-27: the painted "hidden world" scene behind this
      // door — a child reading by lamplight. Separate file from
      // `mask` on purpose: `mask` must stay a plain white-on-
      // transparent silhouette (DoorPortal's maskStyle() only ever
      // reads its alpha channel via CSS mask-image, so any color
      // data in that file is invisible on the live site and just
      // bloats the download) while `world` is a real image rendered
      // with next/image, where the actual pixels matter.
      world: "/images/home/OurProducts/books-world.png",
      // Vertical golden light shaft that leaks from the ajar door's
      // free edge at rest; DoorPortal positions it as a strip and fades
      // it out as the door swings open. Shared file across all 3 doors.
      gapLight: "/images/home/OurProducts/light.png",
      // Measured from books-door.png's actual opaque pixel bounds
      // (minX=513, maxX=1047, minY=141, maxY=1134 on a 1500×1335
      // canvas) — not eyeballed. Re-measure if re-exported.
      hingeOriginX: 34.2,
      hingeOriginY: 47.75,
      freeEdgeX: 69.8,
    },
  },
  {
    id: "yusuf-yasmina",
    title: "Yusuf & Yasmina",
    tagline: "Faith-filled adventures that inspire kindness, courage, and beautiful character.",
    href: "/products/yusuf-and-yasmina",
    assets: {
      frame: "/images/home/OurProducts/yusuf-frame.png",
      door: "/images/home/OurProducts/yusuf-door.png",
      mask: "/images/home/OurProducts/yusuf-mask.png",
      // 2026-08-27: same treatment as books-world.png — a painted
      // "hidden world" scene, pre-shaped to the arch with its own
      // transparent margin, revealed behind the door via the existing
      // mask.png-masked world container (DoorPortal has no per-door
      // branching for this; assigning `world` is the only change
      // needed).
      world: "/images/home/OurProducts/yusuf.png",
      gapLight: "/images/home/OurProducts/light.png",
      // Measured from yusuf-door.png (minX=528, maxX=1050, minY=156,
      // maxY=1152).
      hingeOriginX: 35.2,
      hingeOriginY: 48.99,
      freeEdgeX: 70,
    },
  },
  {
    id: "talimoon-toys",
    title: "Talimoon Toys",
    tagline: "Beautiful toys that transform everyday play into joyful learning.",
    href: "/products/talimoon-toys",
    assets: {
      frame: "/images/home/OurProducts/toys-frame.png",
      door: "/images/home/OurProducts/toys-door.png",
      mask: "/images/home/OurProducts/toys-mask.png",
      // 2026-08-27: same treatment as books-world.png/yusuf.png above.
      world: "/images/home/OurProducts/toys.png",
      gapLight: "/images/home/OurProducts/light.png",
      // Measured from toys-door.png (minX=513, maxX=1038, minY=135,
      // maxY=1158).
      hingeOriginX: 34.2,
      hingeOriginY: 48.43,
      freeEdgeX: 69.2,
    },
  },
];

const TRUST_ITEMS = [
  {
    key: "safe" as const,
    icon: (
      <path d="M10 1.5 L17.5 4.5 V9.5 C17.5 14 14.3 17.4 10 18.5 C5.7 17.4 2.5 14 2.5 9.5 V4.5 Z M6.5 10 L8.7 12.2 L13.5 7.4" />
    ),
  },
  {
    key: "meaningful" as const,
    icon: (
      <path d="M10 17 C10 17 2.5 12.6 2.5 7.4 C2.5 4.7 4.6 2.7 7.1 2.7 C8.4 2.7 9.4 3.3 10 4.2 C10.6 3.3 11.6 2.7 12.9 2.7 C15.4 2.7 17.5 4.7 17.5 7.4 C17.5 12.6 10 17 10 17 Z" />
    ),
  },
  {
    key: "madeWithLove" as const,
    icon: (
      <path d="M10 1.5 L11.8 7.3 L17.8 7.3 L12.9 10.9 L14.7 16.7 L10 13 L5.3 16.7 L7.1 10.9 L2.2 7.3 L8.2 7.3 Z" />
    ),
  },
];

const SECTION_COPY_EN = {
  eyebrow: "Our Products",
  heading: "Every Door Opens a World.",
  description:
    "Choose the journey that will inspire your child through unforgettable stories, meaningful adventures, and joyful play.",
  safe: "Safe & Child-Friendly",
  meaningful: "Meaningful & Ethical",
  madeWithLove: "Made with Love",
};

const SECTION_COPY_UZ: typeof SECTION_COPY_EN = {
  eyebrow: "TALIMOON DUNYOSI",
  heading: "Har bir eshik ortida yangi bir olam.",
  description:
    "Farzandingiz uchun unutilmas hikoyalar, ma'noli sarguzashtlar va quvonchli o'yinlar olamini kashf eting.",
  safe: "Xavfsiz va bolalarga qulay",
  meaningful: "Ma'noli va axloqiy",
  madeWithLove: "Sevgi bilan yaratilgan",
};

export function FourDoorsSection() {
  const t = useT(SECTION_COPY_EN, SECTION_COPY_UZ);
  const variantCopy = useT(VARIANT_COPY_EN, VARIANT_COPY_UZ);
  const localizedVariants = VARIANTS.map((variant) => ({
    ...variant,
    title: variantCopy[variant.id as keyof typeof VARIANT_COPY_EN].title,
    tagline: variantCopy[variant.id as keyof typeof VARIANT_COPY_EN].tagline,
  }));

  return (
    <section
      aria-labelledby="four-doors-heading"
      className="relative w-full overflow-hidden bg-surface-base px-6 py-[20px] sm:px-8 lg:px-16 lg:py-[30px]"
    >
      <HeritageBackdrop />

      {/* Heading — Creative Direction spec, 2026-08-07: exact copy,
          type, color and spacing values, Cormorant Garamond / Manrope,
          not the site's default type tokens. Scoped to this section. */}
      <div className="relative mx-auto max-w-[900px] text-center">
        <p
          className="text-[16px] font-semibold uppercase tracking-[0.28em] text-[#B88633]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {t.eyebrow}
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-[5px] h-px w-8 bg-[#B88633]"
        />
        <h2
          id="four-doors-heading"
          className="mt-[7px] text-[30px] font-semibold leading-[0.95] tracking-[-0.02em] text-[#1D2433] md:text-[41px] lg:text-[52px]"
          style={{ fontFamily: "var(--font-cormorant-garamond)" }}
        >
          {t.heading}
        </h2>
        <p
          className="mx-auto mt-[7px] max-w-[720px] text-[13px] font-normal leading-[1.15] text-[#6A645B] lg:text-[16px]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          {t.description}
        </p>
      </div>

      {/* Door stage — `items-start` (not `items-end`) is deliberate:
          the three descriptions wrap to different numbers of lines,
          so bottom-aligning the columns pushed whichever door had the
          shortest caption down and the longest caption's door up,
          reading as one door "further back" than the others. All
          three doors are identical height, so top-aligning the row
          keeps them level regardless of how the caption text below
          them wraps. */}
      <div className="relative mx-auto mt-[26px] flex max-w-[1450px] flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8">
        {localizedVariants.map((variant) => (
          <DoorPortal key={variant.id} variant={variant} />
        ))}
      </div>

      {/* Trust strip */}
      <ul
        role="list"
        className="relative mx-auto mt-[28px] flex max-w-[720px] flex-col items-center gap-8 sm:flex-row sm:justify-between"
      >
        {TRUST_ITEMS.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5 shrink-0 text-[#B88633]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              {item.icon}
            </svg>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7B7368]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {t[item.key]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FourDoorsSection;
