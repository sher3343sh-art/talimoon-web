"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n/LanguageContext";

export type DoorId = "personalized-books" | "yusuf-yasmina" | "talimoon-toys";

export interface DoorAssets {
  /** Painted stone archway + wall surround. Transparent doorway opening. */
  frame: string;
  /** Painted door leaf. Hinge drawn on its left edge, handle on its right. */
  door: string;
  /** White-on-transparent silhouette of the true opening cut into `frame`. */
  mask: string;
  /**
   * Exact position of the door's painted hinge edge within `door`'s own
   * canvas, as a percentage (0–100) of image width/height — measured
   * from the actual opaque pixel bounds of each door.png, not
   * eyeballed. The door art is NOT flush with its canvas edge (there's
   * transparent padding on every side), so `transform-origin: 0% 50%`
   * (the CSS default for "left") rotates around empty space well to
   * the left of the visible door — this is what that measurement
   * fixes. Re-measure per product if the door art is ever re-exported.
   */
  hingeOriginX: number;
  hingeOriginY: number;
  /**
   * X position (percent of door.png's own width) of the door's free
   * (right, handle-side) edge — same measured-bounds approach as the
   * hinge, used to anchor the edge-shading strip that sells the
   * door's physical thickness as it swings open. The strip's vertical
   * extent doesn't need separate measuring: it's masked to `door`'s
   * own alpha channel, so it's automatically trimmed to the door's
   * real silhouette (arched top included) with no extra data.
   */
  freeEdgeX: number;
  /**
   * Warm light spilling from the gap as the door swings open. Falls back
   * to a procedural glow until the painted asset exists for this door.
   */
  gapLight?: string;
  /**
   * The scene revealed behind the door. Falls back to a procedural
   * abstract scene until the painted asset exists for this door.
   */
  world?: string;
  /**
   * Corrective translate for the masked "hidden world" layer, as CSS
   * length/percent strings (% is of the card box). Only needed when a
   * `frame` PNG was exported with its doorway opening not quite
   * registered to that door's `mask` / `world` — the scene then reads
   * as shifted inside the stone opening (clipped one side, backing
   * colour showing on the other). Measured by comparing the
   * transparent opening in `<id>-frame.png` against `<id>-mask.png`.
   * Books & toys frames are registered — omitted there (defaults 0).
   */
  worldNudgeX?: string;
  worldNudgeY?: string;
}

export interface DoorVariant {
  id: DoorId;
  title: string;
  tagline: string;
  href: string;
  assets: DoorAssets;
}

interface DoorPortalProps {
  variant: DoorVariant;
}

function maskStyle(mask: string): CSSProperties {
  return {
    WebkitMaskImage: `url(${mask})`,
    maskImage: `url(${mask})`,
    // "100% 100%" (stretch), not "contain": the card box is no longer
    // the same aspect ratio as the source PNGs (see the +10%/+20%
    // note on the aspect-ratio box below) and door/frame now render
    // with object-fill to match — the mask has to stretch the same
    // way or it stops lining up with the doorway it's supposed to cut.
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
}

/**
 * Procedural placeholder for the interior scene — ported from the
 * previous implementation, kept only until a painted `world` asset
 * exists per door. Abstract only, 2–3 quiet motion elements, warm
 * brass/glow palette, matches DoorAssets["world"] when that lands.
 */
function FallbackWorld({
  id,
  reducedMotion,
}: {
  id: DoorId;
  reducedMotion: boolean;
}) {
  switch (id) {
    case "personalized-books":
      return (
        <motion.div
          className="absolute left-[36%] top-[30%] h-[24%] w-[26%] rounded-[2px] bg-[var(--paper-50)]/85 shadow-[0_6px_16px_rgba(20,14,10,0.35)]"
          style={{ transformOrigin: "left center" }}
          animate={reducedMotion ? undefined : { rotate: [-3, 2, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    case "yusuf-yasmina":
      return (
        <motion.div
          className="absolute left-[58%] top-[32%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--brass-600-a35) 0%, transparent 70%)",
          }}
          animate={
            reducedMotion
              ? undefined
              : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.1, 1] }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    case "talimoon-toys":
      return (
        <motion.div
          className="absolute right-[20%] top-[32%] h-5 w-5 rounded-[3px] bg-[var(--brass-600)]/45"
          animate={reducedMotion ? undefined : { rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
      );
  }
}

/**
 * DoorPortal — a single painted archway. Frame, door and opening mask
 * are per-product assets (see DoorAssets); "hidden world" and "gap
 * light" fall back to the previous procedural treatment until their
 * painted assets exist.
 *
 * Interaction technique is carried over from the previous
 * implementation verbatim: a plain CSS transform driven by
 * :hover/:focus-visible (not JS state
 * + Framer Motion `animate`), rotateY + perspective co-located in the
 * transform value, cubic-bezier(0.22,1,0.36,1) easing over 750ms —
 * that exact combination is the one confirmed to actually repaint
 * live in this project. Only the geometry changed: the previous
 * split double-leaf (half-width panel, origin-right) was a
 * workaround for having no door art; the painted `door` asset is one
 * full leaf hinged on its left edge, so the whole leaf now rotates
 * from origin-left instead.
 */
// CTA renders on two lines inside the arch — line 1 above, line 2 below.
const DOOR_CHROME_EN = { discover: "Discover", ctaLine1: "Step Into", ctaLine2: "the World" };
const DOOR_CHROME_UZ: typeof DOOR_CHROME_EN = {
  discover: "Kashf eting",
  ctaLine1: "OLAMGA",
  ctaLine2: "QADAM QO'YING",
};
const DOOR_CHROME_RU: typeof DOOR_CHROME_EN = {
  discover: "Узнать",
  ctaLine1: "ШАГНИТЕ",
  ctaLine2: "В ЭТОТ МИР",
};

export function DoorPortal({ variant }: DoorPortalProps) {
  const reducedMotion = useReducedMotion();
  const chrome = useT(DOOR_CHROME_EN, DOOR_CHROME_UZ, DOOR_CHROME_RU);
  const { id, title, tagline, href, assets } = variant;

  // Optical centre of this door's opening (midpoint between the painted
  // hinge edge and the free/handle edge), as a % of the card box. The
  // in-arch CTA text and the step chevrons align to this, not the
  // column's geometric 50%, so they read as centred on the doorway the
  // visitor is actually looking into.
  const openingCenterX = (assets.hingeOriginX + assets.freeEdgeX) / 2;
  // The toys door's interior is the brightest, so its half-moon
  // backdrop runs 2% wider than the other two for the text to hold up.
  const ctaCueWidthPct = id === "talimoon-toys" ? 34 : 32;

  // Corrective translate for every layer that's clipped to this door's
  // opening via mask.png — the hidden world AND the gap-light shaft.
  // Both share the same mask, so both need the same shift when a
  // frame.png's painted opening isn't quite registered to it (see
  // DoorAssets.worldNudgeX/Y). Translating each masked wrapper as a
  // unit moves its mask and its content together, so the layer stays
  // registered to itself while sliding under the stone opening —
  // without it the gap light gets sheared off on a hard mask edge in
  // open space instead of fading out behind the jamb like the other
  // doors.
  const openingNudge: CSSProperties | undefined =
    assets.worldNudgeX || assets.worldNudgeY
      ? {
          transform: `translate(${assets.worldNudgeX ?? "0"}, ${
            assets.worldNudgeY ?? "0"
          })`,
        }
      : undefined;

  // Touch devices have no real `:hover` to drive the door open — the
  // whole animation above is built on `group-hover`/`group-focus-
  // visible`. On a phone the door opens itself, but ONLY the one the
  // visitor has actually scrolled to: an IntersectionObserver with a
  // centre-band `rootMargin` treats a door as "in focus" solely while
  // it crosses the middle ~20% of the viewport. In focus → closed 2s →
  // open → hold 5s → close → repeat. The moment it leaves that band
  // (the visitor scrolls on to the next door) the cycle stops and the
  // door shuts; a door that's never brought to the centre never moves.
  // Coming back re-arms it. A tap still navigates immediately. Gated
  // behind `(hover: hover) and (pointer: fine)` so mouse/trackpad
  // users are untouched — hover already drives them.
  const [touchOpen, setTouchOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) return;

    const node = linkRef.current;
    if (!node) return;

    let cycleTimeout: ReturnType<typeof setTimeout> | null = null;
    let inFocus = false;

    const runCycle = (open: boolean) => {
      setTouchOpen(open);
      cycleTimeout = setTimeout(() => runCycle(!open), open ? 5000 : 2000);
    };

    const startCycle = () => {
      if (cycleTimeout) return;
      // Reduced-motion visitors get a single static open while the door
      // is in focus — no perpetually swinging leaf.
      if (reducedMotion) {
        setTouchOpen(true);
        return;
      }
      cycleTimeout = setTimeout(() => runCycle(true), 2000);
    };

    const stopCycle = () => {
      if (cycleTimeout) {
        clearTimeout(cycleTimeout);
        cycleTimeout = null;
      }
      setTouchOpen(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowInFocus = entry.isIntersecting;
        if (nowInFocus === inFocus) return;
        inFocus = nowInFocus;
        if (nowInFocus) startCycle();
        else stopCycle();
      },
      // Root shrunk to the middle ~20% of the viewport: a door only
      // counts as "in focus" while it's crossing the screen centre, so
      // exactly one of the three stacked doors animates at a time.
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.01 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (cycleTimeout) clearTimeout(cycleTimeout);
    };
  }, [reducedMotion]);

  return (
    <Link
      ref={linkRef}
      href={href}
      aria-label={`${chrome.discover} ${title}`}
      className="group relative block w-full max-w-[428px] shrink-0 focus-visible:outline-none md:max-w-[242px] lg:max-w-[308px] xl:max-w-[391px] 2xl:max-w-[482px]"
    >
      <div
        className="relative w-full rounded-[2px] filter drop-shadow-[0_20px_38px_rgba(58,42,30,0.22)] transition-[transform,filter] duration-500 ease-standard group-focus-visible:ring-2 group-focus-visible:ring-[var(--material-brass)] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-[var(--surface-base)]"
        style={{
          // Frame+door "complex" is +10% width / +20% height vs. the
          // source art's native 1500:1335 ratio — expressed as a
          // scaled equivalent canvas (1500*1.10 / 1335*1.20) so the
          // math is traceable back to those two percentages. Combined
          // with `object-fill` below (not `object-contain`), the box
          // no longer matches the image's own ratio, so it stretches
          // to fill it — frame and door share this exact box and
          // scale identically, so they stay registered to each other.
          aspectRatio: "1650 / 1602",
          containerType: "inline-size",
        }}
      >
        {/* Hidden world — masked to the painted opening (mask.png),
            since this layer has no natural edges of its own. The gap
            light is a separate mask-clipped layer *after* the door
            (further down) so it can also bleed onto the ajar leaf's
            own edge. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ ...maskStyle(assets.mask), ...openingNudge }}
        >
          <div className="absolute inset-0">
            {assets.world ? (
              // The painted `world` PNG isn't full-bleed — it has its
              // own transparent margin around the photo itself (an
              // export artifact, untouched here per instruction: the
              // file stays exactly as supplied, not cropped/rescaled).
              // Since the door's own opening is close to square while
              // the photo is a tall portrait, object-cover's height-
              // match leaves that margin visible at the very top/
              // bottom, mostly right at the arch's own curved peak —
              // the single most visually prominent spot in the whole
              // door. A first attempt backed it with the same bright-
              // centered gradient FallbackWorld uses below, but that
              // gradient's own light gold center (#E3C288) lands
              // almost exactly at the arch peak, reading as its own
              // pale patch against the photo's dark room — swapped
              // for a flat, uniformly dark tone instead (no bright
              // center anywhere), so the margin reads as "shadow" and
              // blends with the photo's own dark ambiance rather than
              // standing out as a separate lit patch.
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "var(--material-walnut-deep, #3A2A1E)" }}
              >
                <Image src={assets.world} alt="" fill className="object-cover" />
              </div>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 85% 75% at 50% 42%, #E3C288 0%, #AD7F49 26%, #63452C 54%, var(--material-walnut-deep) 80%)",
                }}
              >
                <FallbackWorld id={id} reducedMotion={!!reducedMotion} />
              </div>
            )}
          </div>
        </div>

        {/* CTA — "OLAMGA QADAM QO'YING". Not a button/pill: plain white
            two-line text sitting in the upper inside of the archway,
            above the open leaf, so it reads as part of the interior
            scene rather than a chip on the step. Deliberately a sibling
            of (not a child of) the mask.png-clipped world layer above:
            hard-clipping it to the arch silhouette sheared letters off
            at this height where the opening narrows. Instead it's
            placed over the opening and the stone `frame` (rendered
            after this, opaque everywhere except the true opening)
            occludes any bleed past the doorway edges. It sits before
            THE DOOR in source order, so the shut leaf covers it
            (spec §5) and it only surfaces as the door swings. Invisible
            until then; fades in 900ms after the leaf starts moving so
            it arrives as a *result* of the door opening (§6). Wrapper
            owns the centering transform + the arch backdrop; the inner
            span owns the barely-there breathe scale. */}
        <div
          className={`pointer-events-none absolute top-[3%] h-[21%] -translate-x-1/2 transition-opacity duration-[600ms] ease-out group-hover:opacity-100 group-hover:delay-[900ms] group-focus-visible:opacity-100 group-focus-visible:delay-[900ms] motion-reduce:delay-0 ${touchOpen ? "opacity-100 delay-[900ms]" : "opacity-0"}`}
          style={{ left: `${openingCenterX}%`, width: `${ctaCueWidthPct}%` }}
        >
          {/* Dark backdrop shaped like the top of the arch — a half-moon
              that drops from the arch crown, domed to follow the curve.
              No hard edge anywhere: the gradient runs all the way to
              transparent and a 5px blur lets every side melt into the
              interior image rather than ending on a line. Kept inside
              the opening width so it never touches the stone frame. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.52)_40%,rgba(0,0,0,0.26)_68%,rgba(0,0,0,0.08)_88%,transparent_100%)] blur-[5px]"
            style={{ borderRadius: "50% 50% 42% 42% / 60% 60% 18% 18%" }}
          />
          <span
            data-door-cta
            className="absolute inset-x-0 bottom-[4%] block text-center text-[8px] font-semibold uppercase leading-[1.25] tracking-[0.16em] text-white [text-shadow:0_0_2px_rgba(255,255,255,0.85),0_0_8px_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.5)] motion-safe:animate-[tm-door-cta-breathe_3.4s_ease-in-out_infinite] lg:text-[10px] lg:tracking-[0.2em]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {chrome.ctaLine1}
            <br />
            {chrome.ctaLine2}
          </span>
        </div>

        {/* THE DOOR — deliberately NOT run through the opening mask.
            This asset was cut from the same source painting as the
            frame, so its silhouette is already registered to the
            opening; re-clipping it with the (slightly smaller,
            hand-traced) mask was cropping real pixels off the door —
            e.g. the top of its own arch. The frame renders on top and
            is opaque everywhere except the true opening, so it
            occludes anything here that strays outside the doorway —
            the same job the mask was doing, but pixel-accurate to the
            actual artwork instead of an approximation. The rotation
            wrapper below is intentionally NOT `overflow-hidden`: at
            the near-full -81deg hover angle the foreshortened leaf's
            projected quad genuinely extends past its own box (worst
            at the bottom, since hingeOriginY sits at ~48% rather than
            exactly 50%) — clipping the wrapper to its own rect was
            cutting the door's bottom corner off mid-swing instead of
            letting the frame do the occluding it's already meant to
            do.

            Hinge: `transformOrigin` uses this door's measured painted
            hinge position (see DoorAssets.hingeOriginX/Y) rather than
            the CSS default 0% ("left"), which would rotate around
            empty canvas padding well to the left of the visible door.

            Perspective is a separate `perspective`/`perspectiveOrigin`
            pair on this wrapper (in `cqw` — percent of this card's own
            rendered width, via `containerType: inline-size` on the
            ancestor above — so the door reads equally "open" on a
            phone-width card and a full desktop card), not the
            `perspective()` *function* folded into the child's own
            `transform`. Those two are not equivalent with an
            off-center transform-origin: the function form has no
            independent origin of its own (the spec ties it to the
            same transform-origin as the rotation), and with this
            door's hinge sitting at ~34% instead of dead-center that
            produced a real bug — the leaf visually sheared, hanging
            diagonally off its lower-right corner with the bottom edge
            lifting off the threshold as it opened. Giving perspective
            its own `perspectiveOrigin` — pinned to the same hinge
            point as `transformOrigin` — makes the "camera" look
            straight down the hinge axis instead of straight down the
            card's center, which is what removes the shear. Don't
            fold perspective back into the child's `transform` without
            re-testing the full open angle against the threshold —
            this is a real, confirmed browser behavior, not a stylistic
            preference.

            2026-08-09: rest/hover angles moved to -18deg/-81deg (20%
            and 90% of a full -90deg swing) and perspective distance
            increased from 205cqw to 420cqw specifically to reach
            -81deg without the corner-collapse artifact described
            above — a flatter (further-away) perspective camera
            reduces the foreshortening that was causing it, confirmed
            by live-testing -81deg at both distances before landing
            here. Re-test at the exact target angle (not a nearby
            value) if either number changes again — this project has
            twice previously hit real, confirmed-in-browser collapse
            bugs in this exact zone that eyeballing a mid-range value
            would not have caught.

            2026-08-17: rest angle raised -18deg → -30deg. At -18deg
            the door art's own oversize margin (it's cut ~10-20%
            larger than the true opening, see the aspect-ratio note
            above) fully absorbed that little foreshortening, so the
            "ajar" state read as flush shut with no visible crack —
            -30deg is the point that first reads as visibly open.
            Hover duration also raised 1320ms → 1716ms (+30%) for a
            calmer swing, then 1716ms → 2100ms (2026-08-27) so the door
            opens slower and the gap-light shaft has room to bloom and
            dissolve in lockstep with it.

            Hover angle pulled back -81deg → -72deg (80% instead of
            90% of the full -90deg swing) and perspective distance
            doubled 420cqw → 800cqw, together: the frame's stone sill
            is painted assuming the doorway's opening ends at a fixed
            floor line, but the open leaf's foreshortened bottom
            corner doesn't recede downward toward that line — it gets
            pulled UP toward the perspective vanishing point (pinned
            at hingeOriginY, ~48%) the same way its top corner does,
            since a pure Y-axis rotation moves a point's apparent
            screen Y toward the vanishing point in proportion to how
            far that point's Z has receded, and the leaf's far
            (bottom-right) corner has the most Z-depth of any point on
            it. At -81deg that corner had receded enough to visibly
            surface above the sill, i.e. below the leaf, reading as a
            chunk of the door "missing." Doubling the perspective
            distance reduces how much any given Z-depth bends the
            projection (flatter/further camera), and -72deg keeps the
            corner's Z-depth further from the point where that bend
            becomes visible — live-tested corner-by-corner (72/78/81deg
            at both 420 and 800cqw) before landing here. Re-test
            against the sill line the same way if either number moves
            again.

            2026-08-27: hover angle opened further, -72deg → -85deg
            (still at 800cqw). The books-mask.png/books-world.png
            asset split earlier this same day gave this door its first
            real photographic "hidden world" backdrop — against a real
            photo the door not swinging fully open read as more
            noticeably "stuck," and the fully-open sill/corner collapse
            this whole comment block is about was worth re-testing
            against, not assuming still applied. Live-tested -78/-80/
            -85deg, corner-by-corner, against all three doors (the two
            without a `world` photo too) — clean at every angle up to
            and including -85deg, no reappearance of the -81deg
            collapse. -85deg reads as "fully open" without quite
            reaching the mathematically exact -90deg some browsers can
            render with visible z-fighting at the hinge edge. */}
        <div
          className="absolute inset-0"
          style={{
            perspective: "800cqw",
            perspectiveOrigin: `${assets.hingeOriginX}% ${assets.hingeOriginY}%`,
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-[2100ms] delay-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(var(--door-angle,-30deg))] group-hover:[--door-angle:-85deg] group-hover:delay-0 group-focus-visible:[--door-angle:-85deg] group-focus-visible:delay-0 motion-reduce:delay-0"
            style={{
              transformOrigin: `${assets.hingeOriginX}% ${assets.hingeOriginY}%`,
              // Touch has no real `:hover` to drive `--door-angle` via
              // the classes above, so a tap sets it directly here —
              // inline styles always win the cascade over a class
              // selector for the same property, and only ever get set
              // once `touchOpen` is true, so real-hover devices (where
              // this stays unset) are completely unaffected.
              //
              // `delay-[380ms]` above holds the leaf still for 380ms
              // when it's *closing* so the CTA text + chevrons can fade
              // out first (spec §9); `group-hover:delay-0` /
              // `group-focus-visible:delay-0` cancel that on the way
              // open, and on touch the same cancel is done inline here
              // (`transitionDelay: 0ms`) since there's no :hover state
              // to carry it.
              ...(touchOpen
                ? ({ "--door-angle": "-85deg", transitionDelay: "0ms" } as CSSProperties)
                : {}),
            }}
          >
            <Image
              src={assets.door}
              alt=""
              fill
              className="object-fill"
              sizes="(min-width: 1024px) 340px, 45vw"
            />
            {/* Edge shading — a shadow hugging the door's own free
                (handle-side) edge, reading as the leaf's physical
                thickness turning away from the viewer. Masked to the
                door's own alpha channel (same image, reused as its
                own mask) rather than a plain rectangle: a rectangle
                can't follow the arched top, so it read as a straight
                line floating past the door's edge instead of shading
                on the door itself. Anchored so its *outer* edge sits
                on the measured free edge (freeEdgeX) and the gradient
                extends inward onto the door surface, not outward past
                it — the mask then trims it to only the real door
                pixels, arch curve included, automatically. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={maskStyle(assets.door)}
            >
              <div
                className="absolute inset-y-0 w-[5%]"
                style={{
                  left: `${assets.freeEdgeX - 5}%`,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(20,14,10,0.55) 75%, rgba(20,14,10,0.75) 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Gap light — a golden shaft leaking from the ajar door's free
            edge at rest. Its own mask-clipped layer, *after* the door
            (so the glow spills onto the visible leaf edge too) but
            *before* the frame (so the stone still occludes anything
            outside the opening). Two stacked light layers, both
            `screen`-blended so they add like real light: a soft warm
            spill (the glow pooling out of the gap — sells "from inside
            the room") and the sharp `light.png` shaft on top, which
            also carries a slow shimmer (`tm-door-gaplight`).

            The reveal is tied to the door leaf: the strip transitions
            `transform` + `opacity` on the same cubic-bezier(0.22,1,
            0.36,1) and the same close-side `delay-[380ms]` (cancelled
            on the way open). Asymmetric duration on purpose: it spreads
            + dissolves in 2600ms (a touch longer than the 2100ms
            swing) as the door opens, but *gathers + fades back in over
            4800ms* on the way home — so the light settles back into the
            gap far more gently than the solid leaf swings shut, never
            popping back ahead of it. */}
        {assets.gapLight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ ...maskStyle(assets.mask), ...openingNudge }}
          >
            <div
              className="absolute left-[50%] top-[4%] h-[92%] w-[34%] origin-center opacity-100 transition-[transform,opacity] duration-[4800ms] delay-[380ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0 group-hover:delay-0 group-hover:duration-[2600ms] group-hover:[transform:scaleX(2)] group-focus-visible:opacity-0 group-focus-visible:delay-0 group-focus-visible:duration-[2600ms] group-focus-visible:[transform:scaleX(2)] motion-reduce:delay-0"
              style={
                touchOpen
                  ? ({
                      transform: "scaleX(2)",
                      opacity: 0,
                      transitionDelay: "0ms",
                      transitionDuration: "2600ms",
                    } as CSSProperties)
                  : undefined
              }
            >
              {/* soft warm spill — the light pooling out of the gap */}
              <div
                className="absolute left-1/2 top-1/2 h-[82%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[9px] [mix-blend-mode:screen]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,206,138,0.55) 0%, rgba(255,183,99,0.22) 42%, transparent 74%)",
                }}
              />
              {/* the shaft itself */}
              <Image
                src={assets.gapLight}
                alt=""
                fill
                className="object-cover [mix-blend-mode:screen] motion-safe:animate-[tm-door-gaplight_3800ms_ease-in-out_infinite]"
                sizes="(min-width: 1024px) 120px, 28vw"
              />
            </div>
          </div>
        )}

        {/* Frame — the fixed stone archway, always on top of the door. */}
        <Image
          src={assets.frame}
          alt=""
          fill
          className="pointer-events-none object-fill"
          sizes="(min-width: 1024px) 340px, 45vw"
        />

        {/* Directional cue — exactly two upward chevrons resting on the
            painted step, pointing from the threshold up into the
            opening (user -> step -> door -> inner world). Hidden while
            the door is shut; revealed 1100ms after hover — after the
            CTA text, per the reveal order in §6 — then, motion
            permitting, they pulse in sequence (lower chevron first,
            upper one ~0.45s later, `tm-door-arrow-cue`) so the glow
            travels step -> doorway -> interior, never both at once.
            Pure CSS keyframe, transform/opacity/filter only; its
            translateY is a 3px drift, not travel, so the chevrons keep
            their step position. Under prefers-reduced-motion §29 drops
            the keyframe and they simply sit visible while the door is
            open. Exactly two — no third. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[8%] flex -translate-x-1/2 flex-col items-center gap-[3px] text-[color:#FFFFFF] transition-opacity duration-[400ms] ease-out group-hover:opacity-100 group-hover:delay-[1100ms] group-focus-visible:opacity-100 group-focus-visible:delay-[1100ms] motion-reduce:delay-0 ${touchOpen ? "opacity-100 delay-[1100ms]" : "opacity-0"}`}
          style={{ left: `${openingCenterX}%` }}
        >
          {/* upper chevron — second in the sequence (0.45s later; the
              delay is folded into the animation shorthand so the
              `animate-*` reset can't wipe a separate animation-delay) */}
          <svg
            data-door-arrow
            viewBox="0 0 16 10"
            className="h-[15px] w-[25px] motion-safe:animate-[tm-door-arrow-cue_2.6s_ease-in-out_0.45s_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8 L8 2 L14 8" />
          </svg>
          {/* lower chevron — first in the sequence */}
          <svg
            data-door-arrow
            viewBox="0 0 16 10"
            className="h-[15px] w-[25px] motion-safe:animate-[tm-door-arrow-cue_2.6s_ease-in-out_infinite]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8 L8 2 L14 8" />
          </svg>
        </div>
      </div>

      {/* Floor shadow — grounds the portal as a physical object. */}
      <div
        aria-hidden="true"
        className="mx-auto -mt-3 h-2 max-w-[70%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(74,52,38,0.3) 0%, transparent 75%)",
        }}
      />

      {/* CTA is no longer a pill below the portal — 2026-08-27 it moved
          *inside* the archway ("OLAMGA QADAM QO'YING" gold text + two
          step chevrons, both above) so the portal itself is the
          call-to-action. Nothing replaces it in the flow here; the
          product name + tagline sit directly under the floor shadow. */}
      <h3
        className="mt-0 text-center text-[22px] font-semibold text-[#252A35] lg:text-[28px]"
        style={{ fontFamily: "var(--font-cormorant-garamond)" }}
      >
        {title}
      </h3>
      <p
        className="mx-auto mt-[6px] max-w-[300px] text-center text-[15px] font-normal leading-[1.5] text-[#7B7368]"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        {tagline}
      </p>
    </Link>
  );
}

export default DoorPortal;
