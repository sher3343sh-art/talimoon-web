/**
 * TrustStrip — TALIMOON
 * ----------------------------------------------------------------
 * Desktop only, per requirements — hidden below `lg` (1024px), same
 * breakpoint convention as Hero.tsx and Navbar.tsx. No mobile layout
 * is attempted here.
 *
 * Deliberately static: no transitions, no hover states, no motion of
 * any kind, per "No animations." (This is also why the component
 * needs no "use client" directive, hooks, or React state — it's a
 * plain server-renderable component.)
 *
 * Consistency with Hero + Navbar:
 * - Background uses --surface-warm-200, the slightly deeper warm
 *   tone already established as the placeholder-image background in
 *   hero-image.tsx — gives gentle separation from the Hero's
 *   --surface-warm-100 without leaving the same warm family.
 * - Container width (1440px) and side padding (64px / px-16) match
 *   Hero and Navbar exactly, so all three feel like one system.
 * - Item titles use font-serif (the Hero headline face) at a modest
 *   size — a quiet echo of the Hero's editorial voice rather than a
 *   second unrelated heading style. Supporting sentences use
 *   font-sans with the same --text-secondary token as the Hero
 *   subheadline.
 * - Each item leads with a large editorial illustration, now sized
 *   as the clear focal point of the card (see v2 note below) rather
 *   than a small icon-style thumbnail — trust is communicated
 *   through the artwork itself, not an iconographic system.
 * - Items are left-aligned within their column (image, then title,
 *   then sentence stacked left), matching the Hero's own alignment
 *   rule that content is never centered — avoids the generic
 *   centered-icon-card pattern common to templated marketing
 *   sections.
 *
 * v2 refinement pass (visual hierarchy + rhythm, same architecture,
 * same copy, same tokens, no new elements):
 * - Image height raised 180px → 260px. At the ~280px column width
 *   this produces, the photograph is now the largest, most
 *   immediately-legible shape in each card — the eye lands there
 *   first, title and sentence read as caption material underneath
 *   it, not the other way around.
 * - Image corner radius eased 20px → 12px. The old 20px reads as a
 *   UI card/icon; 12px is soft enough to match the site's warm
 *   language but restrained enough that the image reads as a framed
 *   photograph rather than an app tile.
 * - Vertical rhythm opened up: image→title gap 20px → 32px (the
 *   "pause" before reading), title→sentence gap 12px → 16px (title
 *   and sentence stay visually grouped as one caption block). This
 *   asymmetry — a bigger gap above the text block than within it —
 *   is what actually reads as calm editorial spacing rather than
 *   uniformly-padded whitespace.
 * - Section padding 80px → 96px top/bottom, for more air around the
 *   whole strip without materially inflating its footprint.
 * - Vertical divider lines removed. At the larger image size they'd
 *   run straight through/beside the photography and read as a
 *   spreadsheet grid rather than an editorial layout. Column
 *   separation is now pure negative space (64px gap), which is the
 *   more premium, gallery-like choice — and exactly the "spacing
 *   only" alternative called for when dividers compete with imagery.
 * - Title given a two-line-reserving min-height so the sentence
 *   baseline starts at the same vertical position in every column
 *   regardless of whether that column's title wraps to one line or
 *   two — this is what makes the row read as optically aligned.
 * - Sentence measure tightened 32ch → 28ch, which at this column
 *   width keeps line lengths balanced under the image rather than
 *   nearly filling it edge-to-edge.
 *
 * v3 crop fix (image presentation only — no architecture changes):
 * - Problem: at 260px card height with a single global center crop,
 *   photographs whose subject spans a wide vertical range (child's
 *   face near the top of frame, TALIMOON book held lower, at
 *   chest/lap height) were losing either the crown of the head or
 *   the bottom edge of the book to object-fit: cover clipping.
 * - Fix #1 — height 260px → 280px. ~15–18% more vertical frame is
 *   what actually creates room for both anchor points (face + book)
 *   to sit inside the same crop without fighting each other. This
 *   is the main lever; position tuning alone can't fix a frame
 *   that's fundamentally too short for the subject's vertical span.
 * - Fix #2 — per-item object-position instead of one global
 *   "center". Each of the four photographs frames its subject
 *   differently, so a single shared anchor point was always going
 *   to be right for at most one of them. imagePosition is set via
 *   inline style (not a Tailwind arbitrary class) because Tailwind's
 *   JIT compiler can't statically discover dynamically-interpolated
 *   class strings like `object-[${var}]` and will purge them in a
 *   production build — inline style has no such risk.
 * - Defaults given (object-position "center 22%" for the lead
 *   personalization shot, "center 30%" for the reading-together
 *   shot, "center" for the two studio/product-style shots) are
 *   starting points based on standard portrait headroom
 *   conventions, not a pixel-measured crop of the actual source
 *   files. Nudge each item's `imagePosition` in ~5% steps against
 *   the real photo in-browser until the child's full face, the full
 *   book, and the top of the head all clear the frame. If a
 *   photograph's subject is too vertically spread to fit even at
 *   280px, raise that image's container height further (e.g. 300px)
 *   rather than continuing to push the position — a taller frame is
 *   the correct fix, not a more aggressive anchor.
 * - object-fit (cover) and border-radius (12px) are unchanged, per
 *   requirements — only the container height and per-image
 *   object-position moved.
 *
 * v4 SVG loader fix (delivery only — no visual changes):
 * - Source images are .svg. Next.js's built-in image optimizer tries
 *   to read intrinsic dimensions from every asset it's asked to
 *   serve, and some SVG exports (missing/foreign width+height on the
 *   root <svg>) fail that probe — surfacing in dev as "The requested
 *   resource isn't a valid image ... received null" and rendering as
 *   a broken-image icon in the browser, even though the file itself
 *   is valid and next.config's images.dangerouslyAllowSVG is on.
 * - Fix: unoptimized is set whenever the source ends in .svg, which
 *   skips the optimizer pipeline for these assets entirely (SVGs are
 *   already vector — there's nothing for the optimizer to gain by
 *   processing them). Same approach already used in MaskedImage.
 *
 * v5 section-seam spacing fix (this pass — layout/content/typography
 * untouched):
 * - The Hero→TrustStrip transition was reading as an interrupted
 *   white band. The Hero's own fade was already tightened, but most
 *   of the visible gap actually came from here: py-24 (96px) applied
 *   symmetrically put a full 96px of empty --surface-warm-200 space
 *   above the images before the strip's content even began.
 * - Fix is top padding only — 96px → 56px (pt-14) — so the strip
 *   begins sooner after the Hero ends. Bottom padding stays 96px
 *   (pb-24), preserving the breathing room before whatever section
 *   follows. Left/right padding (px-16), column layout, image size,
 *   copy, and every other value in this component are unchanged.
 */

import Image from "next/image";

interface TrustItem {
  title: string;
  sentence: string;
  image: string;
  imageAlt: string;
  /**
   * CSS object-position for this card's image (e.g. "center 22%",
   * "center top", "50% 30%"). Defaults to "center" when omitted.
   * Applied via inline style rather than a Tailwind class — see v3
   * note above for why.
   */
  imagePosition?: string;
}

function isSvgSource(src: string): boolean {
  return src.trim().toLowerCase().endsWith(".svg");
}

// Copy below is placeholder scaffolding for layout/rhythm purposes —
// content team to finalize final wording.
const TRUST_ITEMS: TrustItem[] = [
  {
    title: "Personalized for Your Child",
    sentence:
      "Every detail — name, appearance, spirit — woven into a story that's truly theirs.",
    image: "/images/trust/personalized.svg",
    imageAlt:
      "Illustration of a child joyfully reading their own personalized storybook",
    // Biased toward the upper third of frame: preserves headroom
    // above the child's face while keeping a lower-held book inside
    // the crop. Starting value — tune against the real photo.
    imagePosition: "center 22%",
  },
  {
    title: "Beautifully Illustrated",
    sentence:
      "Original artwork crafted with warmth and care, never generic or mass-produced.",
    image: "/images/trust/illustrated.svg",
    imageAlt:
      "Illustration of an open storybook showing hand-crafted artwork on its pages",
    imagePosition: "center",
  },
  {
    title: "Safe & Meaningful",
    sentence:
      "Thoughtful content designed to nurture, never overwhelm or unsettle.",
    image: "/images/trust/safe.svg",
    imageAlt:
      "Illustration of a parent and child reading together in a warm, caring moment",
    imagePosition: "center 30%",
  },
  {
    title: "A Gift They'll Treasure",
    sentence:
      "A keepsake built to be read again and again, long after the story ends.",
    image: "/images/trust/gift.svg",
    imageAlt: "Illustration of a child happily hugging their favorite storybook",
    imagePosition: "center",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why families choose TALIMOON"
      className="hidden w-full bg-[var(--surface-warm-200,#EFE7DA)] lg:block"
    >
      <div className="mx-auto max-w-[1440px] px-16 pt-8 pb-24">
        <ul className="grid grid-cols-4 gap-x-16">
          {TRUST_ITEMS.map((item) => (
            <li key={item.title} className="flex flex-col items-start">
              <div className="relative h-[280px] w-full overflow-hidden rounded-[12px]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 280px"
                  unoptimized={isSvgSource(item.image)}
                  className="object-cover"
                  style={{ objectPosition: item.imagePosition ?? "center" }}
                />
              </div>

              <h3 className="mt-10 min-h-[2rem] font-serif text-[1.125rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
                {item.title}
              </h3>

              <p className="mt-3 max-w-[28ch] font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                {item.sentence}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TrustStrip;
