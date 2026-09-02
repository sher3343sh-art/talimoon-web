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

export default function Recognition() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="w-full scroll-mt-20 bg-[#EFE7DA] md:scroll-mt-24"
    >
      <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 md:py-20 lg:py-24">
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
