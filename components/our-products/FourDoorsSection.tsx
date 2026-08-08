/**
 * FourDoorsSection — TALIMOON
 * ----------------------------------------------------------------
 * The home "Our Products" scene: shared painted wall, heading, three
 * DoorPortals and trust strip. All rendering and interaction logic
 * for an individual door lives in DoorPortal.tsx — this file only
 * assembles the composition and owns the copy.
 *
 * Story Library was removed from this section only; it is left
 * untouched everywhere else (nav, routes, Hero).
 */

import Image from "next/image";
import { DoorPortal, type DoorVariant } from "./DoorPortal";
import { AmbientParticles } from "./AmbientParticles";

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
    label: "Safe & Child-Friendly",
    icon: (
      <path d="M10 1.5 L17.5 4.5 V9.5 C17.5 14 14.3 17.4 10 18.5 C5.7 17.4 2.5 14 2.5 9.5 V4.5 Z M6.5 10 L8.7 12.2 L13.5 7.4" />
    ),
  },
  {
    label: "Meaningful & Ethical",
    icon: (
      <path d="M10 17 C10 17 2.5 12.6 2.5 7.4 C2.5 4.7 4.6 2.7 7.1 2.7 C8.4 2.7 9.4 3.3 10 4.2 C10.6 3.3 11.6 2.7 12.9 2.7 C15.4 2.7 17.5 4.7 17.5 7.4 C17.5 12.6 10 17 10 17 Z" />
    ),
  },
  {
    label: "Made with Love",
    icon: (
      <path d="M10 1.5 L11.8 7.3 L17.8 7.3 L12.9 10.9 L14.7 16.7 L10 13 L5.3 16.7 L7.1 10.9 L2.2 7.3 L8.2 7.3 Z" />
    ),
  },
];

export function FourDoorsSection() {
  return (
    <section
      aria-labelledby="four-doors-heading"
      className="relative w-full overflow-hidden bg-[var(--surface-base)] px-6 py-[20px] sm:px-8 lg:px-16 lg:py-[30px]"
    >
      {/* Background — one shared painted environment behind all three
          doors, not a background per card. Single image, no tiling,
          object-cover to fill the section without distorting it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/home/OurProducts/background.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "top center" }}
        />
        {/* Very light wash — keeps the trust strip's small label text
            readable over the deeper lower portion of the artwork
            without flattening it. */}
        <div className="absolute inset-0 bg-[var(--paper-50)]/10" />
        <AmbientParticles />
      </div>

      {/* Heading — Creative Direction spec, 2026-08-07: exact copy,
          type, color and spacing values, Cormorant Garamond / Manrope,
          not the site's default type tokens. Scoped to this section. */}
      <div className="relative mx-auto max-w-[900px] text-center">
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#B88633]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Our Products
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
          Every Door Opens a World.
        </h2>
        <p
          className="mx-auto mt-[7px] max-w-[720px] text-[13px] font-normal leading-[1.15] text-[#6A645B] lg:text-[16px]"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Choose the journey that will inspire your child through
          unforgettable stories, meaningful adventures, and joyful play.
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
        {VARIANTS.map((variant) => (
          <DoorPortal key={variant.id} variant={variant} />
        ))}
      </div>

      {/* Trust strip */}
      <ul
        role="list"
        className="relative mx-auto mt-[28px] flex max-w-[720px] flex-col items-center gap-8 sm:flex-row sm:justify-between"
      >
        {TRUST_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
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
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FourDoorsSection;
