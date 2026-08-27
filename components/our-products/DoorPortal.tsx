"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useState } from "react";
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
const DOOR_CHROME_EN = { discover: "Discover", stepInside: "Step Inside" };
const DOOR_CHROME_UZ: typeof DOOR_CHROME_EN = { discover: "Kashf eting", stepInside: "Ichkariga kiring" };

export function DoorPortal({ variant }: DoorPortalProps) {
  const reducedMotion = useReducedMotion();
  const chrome = useT(DOOR_CHROME_EN, DOOR_CHROME_UZ);
  const { id, title, tagline, href, assets } = variant;

  // Touch devices have no real `:hover` to drive the door open — the
  // whole animation above is built on `group-hover`/`group-focus-
  // visible`, so on a phone the door just sat frozen shut and the
  // very first tap immediately navigated away before anyone could see
  // it open. Fix, per owner spec: first tap opens the door (and does
  // NOT navigate), a second tap follows the link. Gated behind a
  // `(hover: hover) and (pointer: fine)` check so real mouse/trackpad
  // users keep the original single-click-navigates behavior — hover
  // already shows them the open door before they ever click.
  const [touchOpen, setTouchOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const canHover =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) return;
    if (!touchOpen) {
      e.preventDefault();
      setTouchOpen(true);
    }
  };

  return (
    <Link
      href={href}
      aria-label={`${chrome.discover} ${title}`}
      onClick={handleClick}
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
        {/* Hidden world + gap light — masked to the painted opening
            (mask.png), since this layer has no natural edges of its
            own. */}
        <div className="absolute inset-0 overflow-hidden" style={maskStyle(assets.mask)}>
          {/* Hidden world */}
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

          {/* Gap light — a crack of light at rest, since the door is
              only ajar; fades out as the door opens and the room
              itself becomes the light source. */}
          {assets.gapLight ? (
            <Image
              src={assets.gapLight}
              alt=""
              fill
              className={`pointer-events-none object-cover transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0 ${touchOpen ? "opacity-0" : "opacity-100"}`}
            />
          ) : (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full blur-[26px] transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0 ${touchOpen ? "opacity-0" : "opacity-90"}`}
              style={{
                background:
                  "radial-gradient(circle, rgba(227,194,136,0.6) 0%, transparent 70%)",
              }}
            />
          )}
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
            calmer swing.

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
            className="absolute inset-0 transition-transform duration-[1716ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(var(--door-angle,-30deg))] group-hover:[--door-angle:-85deg] group-focus-visible:[--door-angle:-85deg]"
            style={{
              transformOrigin: `${assets.hingeOriginX}% ${assets.hingeOriginY}%`,
              // Touch has no real `:hover` to drive `--door-angle` via
              // the classes above, so a tap sets it directly here —
              // inline styles always win the cascade over a class
              // selector for the same property, and only ever get set
              // once `touchOpen` is true, so real-hover devices (where
              // this stays unset) are completely unaffected.
              ...(touchOpen ? ({ "--door-angle": "-85deg" } as CSSProperties) : {}),
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

        {/* Frame — the fixed stone archway, always on top of the door. */}
        <Image
          src={assets.frame}
          alt=""
          fill
          className="pointer-events-none object-fill"
          sizes="(min-width: 1024px) 340px, 45vw"
        />
      </div>

      {/* Floor shadow — grounds the portal as a physical object. */}
      <div
        aria-hidden="true"
        className="mx-auto -mt-2 h-3 max-w-[70%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(74,52,38,0.3) 0%, transparent 75%)",
        }}
      />

      {/* CTA — "Step Inside". 2026-08-09: replaced the section-local
          "our-products-cta" pill (58px tall, idle-breathing, its own
          bespoke gold gradient) with the exact shared `.tm-cta-gold`
          class every other CTA on the site uses (Navbar, Story
          Library, Families Wall) — same gold, same 44px height, same
          hover/active/focus behavior, nothing bespoke left here. No
          idle-breathe animation: none of the other `.tm-cta-gold`
          instances site-wide have one, so keeping it only on this
          button would itself be the inconsistency. */}
      <div className="mt-[10px] flex justify-center">
        <span className="tm-cta-gold inline-flex h-[31px] shrink-0 items-center justify-center gap-1 whitespace-nowrap px-3.5 text-[12px] font-medium tracking-[0.015em]">
          {chrome.stepInside}
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`h-2.5 w-2.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 ${touchOpen ? "translate-x-0.5" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>

      <h3
        className="mt-[5px] text-center text-[22px] font-semibold text-[#252A35] lg:text-[28px]"
        style={{ fontFamily: "var(--font-cormorant-garamond)" }}
      >
        {title}
      </h3>
      <p
        className="mx-auto mt-[4px] max-w-[310px] text-center text-[15px] font-normal leading-[1.15] text-[#7B7368]"
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        {tagline}
      </p>
    </Link>
  );
}

export default DoorPortal;
