"use client";

/**
 * ACT 02 — RECOGNITION · "Necha marta?"
 * ----------------------------------------------------------------
 * Not cards. An editorial sequence: one question, then the familiar
 * phrases surface one by one with restrained scroll choreography,
 * the noise resolves into a quiet moment, and the act lands on the
 * line the whole page turns on. Short by design — this is a tension
 * beat, not an information section.
 *
 * Motion is the shared CSS `Reveal` primitive only (no library),
 * with a hard opt-out for prefers-reduced-motion.
 */

import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
import { Reveal } from "../_shared/Reveal";

const COPY_EN = {
  eyebrow: "Familiar moments",
  question: "How many times have you said the same thing?",
  phrases: [
    "Stop crying…",
    "Don't be difficult…",
    "Don't fight…",
    "Be kind to your brother…",
    "Do well at school…",
    "Don't tell lies…",
  ],
  heard: "They have heard all of it.",
  turn: ["Maybe it isn't about saying it again.", "Maybe it needs to reach them differently."],
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Tanish lahzalar",
  question: "Bir gapni necha marta takrorlagansiz?",
  phrases: [
    "Yig‘layverma…",
    "Injiqlik qilma…",
    "Urishaverma…",
    "Ukangga mehribon bo‘l…",
    "Yaxshi o‘qi…",
    "Yolg‘on gapirma…",
  ],
  heard: "U bu gaplarni eshitgan.",
  turn: ["Balki yana aytish emas,", "boshqacha yetkazish kerakdir."],
};

/** Gentle left indent variation so the phrases read as scattered, not a list. */
const INDENT = ["0", "1.5rem", "0.5rem", "2.25rem", "0.75rem", "1.75rem"];

/** Approved pencil illustration — 1536×1024, boy on the right, large
 *  empty cream on the left (created to match this section's ground). */
const SKETCH_SRC =
  "/images/products/personalized-books/familiar-moments-child-memory-sketch.png";

/** Soft, wide left-edge fade: the sketch's cream ground already matches
 *  the section, this only guarantees no rectangular seam near the text.
 *  Alpha only — it never darkens the drawing, and the ramp is wide
 *  enough that there is no visible fade band. */
const SKETCH_LEFT_FADE =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 20%, #000 40%, #000 100%)";
/** Mobile: the sketch stacks under the text, so soften top + bottom
 *  instead so it emerges from / melts back into the page. */
const SKETCH_VERTICAL_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 86%, transparent 100%)";

export default function Recognition() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="relative w-full overflow-hidden scroll-mt-20 bg-[#EFE7DA] md:scroll-mt-24"
    >
      {/* Desktop / tablet illustration — absolutely placed against the
          section's right edge, over the recognition block. No box, no
          border, no shadow, no wrapper background: the sketch's own
          pale-cream ground is the same family as the section, and the
          soft left-edge mask lets its faint pencil work dissolve toward
          the text. `inset-y-0` (not a fixed height) so it never adds
          section height. */}
      <Reveal
        y={0}
        delay={140}
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[52%] md:block lg:w-[50%] xl:w-[46%]"
      >
        <Image
          src={SKETCH_SRC}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1280px) 46vw, (min-width: 768px) 52vw, 1px"
          quality={90}
          className="object-contain object-right"
          style={{ WebkitMaskImage: SKETCH_LEFT_FADE, maskImage: SKETCH_LEFT_FADE }}
        />
      </Reveal>

      <div className="relative z-10 mx-auto max-w-[900px] px-5 py-14 sm:px-8 md:py-20 lg:py-24">
        {/* Left narrative column — constrained from md up so the boy
            never collides with the text. */}
        <div className="md:max-w-[22rem] lg:max-w-[27rem]">
          <Reveal>
            <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t.eyebrow}
            </p>
            <h2
              id="recognition-heading"
              className="mt-4 max-w-[18ch] font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] text-text-primary sm:text-[2.125rem] md:text-[2.5rem]"
            >
              {t.question}
            </h2>
          </Reveal>

          <ul className="mt-9 space-y-1.5 md:mt-11 md:space-y-2">
            {t.phrases.map((p, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 55}
                y={10}
                className="font-display text-[1.25rem] font-normal italic leading-[1.5] text-text-primary/55 sm:text-[1.5rem] md:text-[1.75rem]"
              >
                <span style={{ display: "inline-block", marginInlineStart: INDENT[i] }}>{p}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-11 md:mt-14">
            <p className="font-sans text-[1.0625rem] leading-[1.7] text-text-secondary md:text-[1.125rem]">
              {t.heard}
            </p>
          </Reveal>
        </div>

        {/* Mobile illustration — stacked under the text, wide and
            atmospheric; the empty cream on the sketch's left is cropped
            by object-position, and a top/bottom fade keeps it edgeless. */}
        <Reveal
          y={12}
          delay={60}
          className="pointer-events-none relative mt-10 aspect-[16/10] w-full md:hidden"
        >
          <Image
            src={SKETCH_SRC}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 1px, 100vw"
            quality={90}
            className="object-cover object-[78%_center]"
            style={{ WebkitMaskImage: SKETCH_VERTICAL_FADE, maskImage: SKETCH_VERTICAL_FADE }}
          />
        </Reveal>

        <Reveal delay={80} className="mt-10 md:mt-14">
          <p className="text-balance font-display text-[1.875rem] font-medium leading-[1.2] tracking-[-0.02em] text-text-primary sm:text-[2.5rem] md:text-[3.125rem]">
            {t.turn[0]}
            <br />
            {t.turn[1]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
