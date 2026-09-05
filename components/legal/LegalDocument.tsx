"use client";

/**
 * LegalDocument — shared layout for TALIMOON's public legal pages
 * (/privacy and /terms).
 * ----------------------------------------------------------------
 * Both legal pages are the same shape: a title, an effective-date
 * line, a short intro, then a run of numbered sections made of
 * paragraphs and the occasional bullet list. This component owns
 * that one layout so the two routes cannot drift apart.
 *
 * It is purely presentational and introduces NO new design system:
 * it consumes only the site-wide tokens already defined in
 * globals.css and used by the Navbar, Footer and the order flow —
 * `font-display` / `font-sans`, `surface-base`, the `text-*` colour
 * roles, `accent-primary`, `border-subtle`. Cream background,
 * existing typography, existing horizontal padding.
 *
 * i18n: the route passes `en` and `uz` copy objects of the same
 * shape and `useT` picks one, exactly like every other bilingual
 * surface on the site (RU/AR fall back to EN). Layout uses a centred
 * reading measure and logical flow, so it never depends on the
 * translated text length.
 *
 * No animation — a legal page should render and read instantly.
 */

import { useT } from "@/lib/i18n/LanguageContext";

export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalCopy {
  /** Document title, e.g. "Privacy Policy". */
  title: string;
  /** Label shown before the date, e.g. "Effective date". */
  effectiveLabel: string;
  /** Human-readable date, e.g. "4 September 2026". */
  effectiveDate: string;
  /** Lead paragraphs shown before the first numbered section. */
  intro: string[];
  sections: LegalSection[];
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.kind === "list" ? (
          <ul
            key={i}
            className="mt-4 list-disc space-y-2 ps-5 font-sans text-[15px] leading-[1.75] text-text-secondary marker:text-accent-primary md:text-[16px]"
          >
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p
            key={i}
            className="mt-4 font-sans text-[15px] leading-[1.75] text-text-secondary md:text-[16px]"
          >
            {block.text}
          </p>
        ),
      )}
    </>
  );
}

export function LegalDocument({ en, uz }: { en: LegalCopy; uz: LegalCopy }) {
  const t = useT(en, uz);

  return (
    <section className="w-full bg-surface-base px-6 pb-24 pt-24 md:px-10 md:pb-28 md:pt-28 lg:px-16 lg:pb-32 lg:pt-32">
      <article className="mx-auto w-full max-w-[680px]">
        <header className="border-b border-border-subtle pb-8">
          <h1 className="font-display text-[28px] leading-[1.15] text-text-primary md:text-[34px] lg:text-[40px]">
            {t.title}
          </h1>
          <p className="mt-4 font-sans text-[13.5px] text-text-muted">
            {t.effectiveLabel}: {t.effectiveDate}
          </p>
        </header>

        <div className="mt-8">
          {t.intro.map((para, i) => (
            <p
              key={i}
              className="mt-4 font-sans text-[15px] leading-[1.75] text-text-secondary first:mt-0 md:text-[16px]"
            >
              {para}
            </p>
          ))}
        </div>

        {t.sections.map((section, i) => (
          <section key={i} id={`s${i + 1}`} className="mt-12 scroll-mt-28 md:mt-14">
            <h2 className="font-display text-[20px] leading-[1.3] text-text-primary md:text-[24px]">
              {i + 1}. {section.heading}
            </h2>
            <Blocks blocks={section.blocks} />
          </section>
        ))}
      </article>
    </section>
  );
}

export default LegalDocument;
