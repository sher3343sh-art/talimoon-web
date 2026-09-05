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
 *  empty cream on the left. Served through Next's image optimiser as a
 *  CSS background (see SKETCH_MERGE): `q=75` because `next.config.ts`
 *  only allows [75, 100]. */
const SKETCH_RAW =
  "/images/products/personalized-books/familiar-moments-child-memory-sketch.png";
const sketchOpt = (w: number) =>
  `/_next/image?url=${encodeURIComponent(SKETCH_RAW)}&w=${w}&q=75`;

/**
 * SEAMLESS MERGE, measured from the rendered page:
 *   section ground = #EFE7DA (239,231,218)
 *   sketch ground  = ~#FAF2E7 (250,242,231) — flat, a uniform ~+11/channel
 *                    lighter, which is why the raw PNG reads as a pale panel.
 *
 * `background-blend-mode: darken` blends the element's OWN two background
 * layers — the sketch over an #EFE7DA fill — so every pixel lighter than
 * #EFE7DA (i.e. the empty cream ground and any blown highlight) resolves
 * to exactly #EFE7DA, and every graphite line and the boy (all darker)
 * pass through untouched. It is NOT an opacity reduction — full contrast,
 * the child stays crisp — and because it blends background layers on one
 * element it is immune to stacking context / isolation / Reveal.
 */
const SKETCH_MERGE: React.CSSProperties = {
  backgroundColor: "#EFE7DA",
  backgroundBlendMode: "darken",
  backgroundRepeat: "no-repeat",
};

export default function Recognition() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="relative w-full overflow-hidden scroll-mt-24 bg-[#EFE7DA] md:scroll-mt-28"
    >
      {/* Desktop / tablet illustration — a background layer flush to the
          section's right edge, over the recognition block. No box, no
          border, no shadow: `background-blend-mode: darken` (see
          SKETCH_MERGE) merges the sketch's cream ground into the section
          exactly, so there is no visible rectangle. `inset-y-0` (not a
          fixed height) so it never adds section height. `background-size:
          contain` keeps the whole boy; `right center` puts him in the
          right-centre with the empty cream falling toward the text. */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] md:block lg:w-[50%] xl:w-[46%]",
          // POSITIONING ONLY. Scale the sketch up (~20 / 26 / 31% at
          // md / lg / xl) and nudge it in from the right edge
          // (~48 / 96 / 144px) so the boy sits nearer the centre with a
          // shorter empty gap after the text. The blend fill + mode
          // stay in `style` and are untouched.
          "[background-size:120%] [background-position:right_48px_center]",
          "lg:[background-size:126%] lg:[background-position:right_96px_center]",
          "xl:[background-size:131%] xl:[background-position:right_144px_center]",
        ].join(" ")}
        style={{
          ...SKETCH_MERGE,
          backgroundImage: `url("${sketchOpt(1200)}")`,
        }}
      />

      <div className="relative mx-auto max-w-[900px] px-5 py-10 sm:px-8 sm:py-12 md:py-16 lg:py-20">
        {/* Left narrative column — constrained from md up so the boy
            never collides with the text. */}
        <div className="md:max-w-[22rem] lg:max-w-[27rem]">
          <Reveal>
            <p className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              {t.eyebrow}
            </p>
            <h2
              id="recognition-heading"
              className="mt-3 max-w-[18ch] font-display text-[1.75rem] font-medium leading-[1.15] tracking-[-0.015em] text-text-primary sm:mt-4 sm:text-[2.125rem] md:text-[2.5rem]"
            >
              {t.question}
            </h2>
          </Reveal>

          <ul className="mt-6 space-y-0.5 sm:mt-8 sm:space-y-1.5 md:mt-11 md:space-y-2">
            {t.phrases.map((p, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 55}
                y={10}
                className="font-display text-[1.1875rem] font-normal italic leading-[1.4] text-text-primary/55 sm:text-[1.5rem] sm:leading-[1.5] md:text-[1.75rem]"
              >
                <span style={{ display: "inline-block", marginInlineStart: INDENT[i] }}>{p}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-6 sm:mt-8 md:mt-12">
            <p className="font-sans text-[1.0625rem] leading-[1.7] text-text-secondary md:text-[1.125rem]">
              {t.heard}
            </p>
          </Reveal>
        </div>

        {/* Mobile illustration — stacked under the text, wide and
            atmospheric. Same `background-blend-mode: darken` merge;
            `cover` biased right crops the empty cream on the left. */}
        <div
          aria-hidden="true"
          className="pointer-events-none -mx-5 mt-6 aspect-[16/10] w-[calc(100%+2.5rem)] sm:mx-0 sm:mt-8 sm:aspect-[16/9] sm:w-full md:hidden"
          style={{
            ...SKETCH_MERGE,
            backgroundImage: `url("${sketchOpt(828)}")`,
            backgroundPosition: "76% 54%",
            backgroundSize: "155%",
          }}
        />

        <Reveal delay={80} className="mt-6 sm:mt-8 md:mt-12">
          <p className="text-balance font-display text-[1.75rem] font-medium leading-[1.18] tracking-[-0.02em] text-text-primary sm:text-[2.5rem] sm:leading-[1.2] md:text-[3.125rem]">
            {t.turn[0]}
            <br />
            {t.turn[1]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
