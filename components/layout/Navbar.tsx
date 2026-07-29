"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

// Mobile menu shows a shorter, deliberately curated list (no FAQ) per
// the mobile nav spec — kept as its own array rather than filtering
// NAV_LINKS so the desktop list can change independently in future
// without silently affecting mobile.
const MOBILE_NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
] as const;

const SCROLL_THRESHOLD = 24;

// How long the mobile menu's exit transition runs, in ms. Kept as a
// constant because it's referenced in two places: the Tailwind
// duration-300 classes on the overlay, and the setTimeout that
// unmounts the overlay after that transition finishes.
const MOBILE_MENU_EXIT_MS = 300;

/**
 * ---------------------------------------------------------------
 * COLOR CONTROLS — edit these to restyle the navbar by hand.
 * ---------------------------------------------------------------
 */
// Matches the site's --surface-contrast / --navy-900 token, same
// navy used at the bottom of the page (EmotionalBanner), so the top
// and bottom of the page read as the same deliberate dark tone.
const REST_BG = "#1C2A3A";
const REST_BORDER = "rgba(255,255,255,0.10)";

const SCROLLED_BG = "rgba(247,242,234,0.55)";
const SCROLLED_BORDER = "rgba(42,36,29,0.10)";

/**
 * ---------------------------------------------------------------
 * GOLD DESIGN TOKEN SYSTEM — reusable across the site wherever a
 * premium metallic-gold surface is needed (CTA buttons, badges,
 * dividers, etc). Defined once, scoped to .tm-gold-scope so they
 * don't leak into global CSS.
 *
 * Palette logic (brushed anodized gold, not glossy yellow plastic):
 *  --gold-shadow     deep warm bronze — the metal's core shadow tone
 *  --gold-base       muted bronze — the resting, unlit metal tone
 *  --gold-mid        the "body" gold — most of the surface reads as this
 *  --gold-highlight  champagne — a light catch, kept warm and soft,
 *                     never white, never a hard specular dot. Widened
 *                     from a single knife-edge point to a short
 *                     plateau (47%–53%) so the beam itself reads as
 *                     a streak of light rather than a thin line.
 *  --gold-border     hairline edge tone — barely-there, defines the
 *                     shape without drawing attention to itself
 *  --gold-text       ink used on top of the gold (kept from original)
 * ---------------------------------------------------------------
 */
const GOLD_TOKENS = {
  "--gold-shadow": "#5E4620",
  "--gold-base": "#8A6A35",
  "--gold-mid": "#C79A4B",
  "--gold-highlight": "#F0DDA6",
  "--gold-border": "rgba(255, 244, 219, 0.28)",
  "--gold-text": "#2A241D",
} as React.CSSProperties;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * ---------------------------------------------------------------
   * MOBILE NAVIGATION (< lg only) — everything below this comment
   * block and inside the "MOBILE NAV" JSX section is new. Nothing
   * above this point, and nothing in the desktop <nav> further down,
   * was changed to support it.
   *
   * mobileOpen    — the logical target state (open or closed), used
   *                 for aria-expanded, the hamburger icon animation,
   *                 and body scroll locking.
   * menuMounted   — whether the full-screen overlay exists in the
   *                 DOM at all. Kept separate from mobileOpen so the
   *                 overlay can play its closing transition (opacity/
   *                 translate) before being removed, instead of
   *                 disappearing instantly.
   * menuVisible   — the animation-state class toggle. Flipped a
   *                 frame after mount (via requestAnimationFrame) so
   *                 the browser has a "closed" frame to transition
   *                 away from, giving a real enter animation instead
   *                 of appearing already-open.
   * ---------------------------------------------------------------
   */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const closeMenu = () => setMobileOpen(false);

  // Mount/animate the overlay in, or animate it out then unmount.
  useEffect(() => {
    if (mobileOpen) {
      setMenuMounted(true);
      const raf = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setMenuVisible(false);
    const timeout = setTimeout(() => setMenuMounted(false), MOBILE_MENU_EXIT_MS);
    return () => clearTimeout(timeout);
  }, [mobileOpen]);

  // Focus management: move focus into the menu on open, and back to
  // the hamburger trigger on close (but not on initial mount, when
  // the menu was never open in the first place).
  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      toggleButtonRef.current?.focus();
    }
  }, [mobileOpen]);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  // ESC closes the menu; Tab/Shift+Tab is trapped inside it while open.
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const linkClass = [
    "group relative inline-flex items-center py-2",
    "whitespace-nowrap font-sans text-[14px] font-medium tracking-[0.01em]",
    "transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--accent-primary,#B5764B)]",
    scrolled
      ? "text-[var(--text-secondary,#49433C)] hover:text-[var(--text-primary,#2A241D)]"
      : "text-white/85 hover:text-white",
  ].join(" ");

  const underlineClass = [
    "pointer-events-none absolute bottom-0 left-0",
    "h-px w-0",
    "transition-all duration-300 ease-out",
    "group-hover:w-full",
    scrolled ? "bg-[var(--text-primary,#2A241D)]" : "bg-white",
  ].join(" ");

  // Hamburger bar color follows the same scrolled/rest logic as the
  // desktop nav links, so it stays legible over both the dark hero
  // and the translucent scrolled background.
  const hamburgerBarColor = scrolled ? "bg-[var(--text-primary,#2A241D)]" : "bg-white";

  return (
    <header
      style={
        {
          "--nav-rest-bg": REST_BG,
          "--nav-rest-border": REST_BORDER,
          "--nav-scrolled-bg": SCROLLED_BG,
          "--nav-scrolled-border": SCROLLED_BORDER,
        } as React.CSSProperties
      }
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,backdrop-filter,border-color,box-shadow]",
        "duration-300",
        scrolled
          ? "border-b border-[var(--nav-scrolled-border)] bg-[var(--nav-scrolled-bg)] backdrop-blur-md shadow-elevated"
          : "border-b border-[var(--nav-rest-border)] bg-[var(--nav-rest-bg)]",
      ].join(" ")}
    >
      {/*
        Gold CTA surface system. Scoped styles rather than Tailwind
        arbitrary-value strings because the brushed-metal look needs
        precise multi-stop gradients + layered inset/outer shadows
        that are impractical to express cleanly as utility classes.
        Layout (size, spacing, radius footprint) stays driven by the
        Tailwind classes on the <a> itself — this block only owns the
        *surface* (fill, border, shadow, hover/active behavior).
      */}
      <style jsx>{`
        .tm-cta-gold {
          position: relative;
          border-radius: 10px;
          border: 1px solid var(--gold-border);
          color: var(--gold-text);

          background-image: linear-gradient(
            135deg,
            var(--gold-shadow) 0%,
            var(--gold-base) 20%,
            var(--gold-mid) 38%,
            var(--gold-highlight) 50%,
            var(--gold-mid) 62%,
            var(--gold-base) 80%,
            var(--gold-shadow) 100%
          );
          background-size: 220% 100%;
          background-position: 15% 0%;

          box-shadow:
            /* inner top sheen — a hairline catch of light, not a glow */
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            /* inner bottom edge — gives the surface a subtle bevel/depth */
            inset 0 -1px 0 rgba(0, 0, 0, 0.14),
            /* outer elevation — warm-tinted, soft, low offset */
            0 1px 2px rgba(60, 45, 20, 0.18),
            0 8px 20px -10px rgba(120, 90, 40, 0.45);

          transition:
            background-position 500ms ease-out,
            box-shadow 250ms ease-out,
            transform 150ms ease-out,
            filter 250ms ease-out;
        }

        .tm-cta-gold:hover {
          background-position: 85% 0%;
          filter: brightness(1.04);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.28),
            inset 0 -1px 0 rgba(0, 0, 0, 0.16),
            0 2px 4px rgba(60, 45, 20, 0.2),
            0 12px 26px -10px rgba(120, 90, 40, 0.55);
        }

        .tm-cta-gold:active {
          transform: translateY(1px);
          filter: brightness(0.99);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            inset 0 -1px 0 rgba(0, 0, 0, 0.16),
            0 1px 2px rgba(60, 45, 20, 0.18),
            0 4px 10px -6px rgba(120, 90, 40, 0.4);
        }

        .tm-cta-gold:focus-visible {
          outline: 2px solid var(--gold-shadow);
          outline-offset: 2px;
        }

        /*
          Logo shimmer — a slow, narrow pale-gold light sweep clipped
          to the logo's own silhouette. Uses a light champagne-gold
          tone rather than white, so it reads as "the gold itself
          catching light" instead of a white wash sitting on top of
          it. The loop has no held/paused frame — background-position
          moves the full distance every cycle, so motion never stops.
        */
        .tm-logo-shine {
          -webkit-mask-image: url("/logo/talimoon-logo-gold.svg");
          mask-image: url("/logo/talimoon-logo-gold.svg");
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: left center;
          mask-position: left center;

          background-image: linear-gradient(
            100deg,
            transparent 46%,
            rgba(255, 240, 196, 0.85) 50%,
            transparent 54%
          );
          background-size: 240% 100%;
          background-position: -70% 0%;
          mix-blend-mode: screen;
          animation: tm-logo-shine-sweep 6s linear infinite;
        }

        @keyframes tm-logo-shine-sweep {
          0% {
            background-position: -70% 0%;
          }
          100% {
            background-position: 170% 0%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tm-logo-shine {
            animation: none;
            background-position: 50% 0%;
          }
        }
      `}</style>

      {/* ============================================================
          DESKTOP NAV (lg and above) — UNCHANGED except for the single
          "hidden ... lg:grid" swap in place of the old bare "grid",
          so this nav renders only at lg+ and the new mobile bar takes
          over below it. Every other class, all children, and all
          logic in this block are untouched.
      ============================================================ */}
      <nav
        aria-label="Primary"
        className="relative mx-auto hidden h-[74px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-5 md:px-10 lg:grid lg:px-16"
      >
        <Link
          href="/"
          aria-label="Talimoon Home"
          className="relative flex h-[45px] w-auto shrink-0 items-center"
        >
          {/* Full-color logo — fades in once the navbar reaches its solid, scrolled background. */}
          <img
            src="/logo/talimoon-logo-color.svg"
            alt="Talimoon"
            draggable={false}
            className="h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
          {/* Gold logo — visible at rest, over the dark navy bar / hero photo. */}
          <img
            src="/logo/talimoon-logo-gold.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
          {/*
            Continuous white light sweep, masked to the gold logo's
            silhouette — fades in/out together with the gold logo
            itself, so it never shows over the color logo.
          */}
          <span
            aria-hidden="true"
            className="tm-logo-shine pointer-events-none absolute inset-0 h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
        </Link>

        <ul className="flex shrink-0 items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass}>
                {link.label}
                <span aria-hidden="true" className={underlineClass} />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center justify-end gap-6">
          <Link href="/login" className={linkClass}>
            Log in
            <span aria-hidden="true" className={underlineClass} />
          </Link>

          <a
            href="#begin"
            style={GOLD_TOKENS}
            className={[
              "tm-cta-gold",
              "inline-flex h-12 shrink-0 items-center justify-center",
              "whitespace-nowrap px-8",
              "text-[14px] font-medium tracking-[0.02em]",
            ].join(" ")}
          >
            Begin the Story
          </a>
        </div>
      </nav>

      {/* ============================================================
          MOBILE NAV (< lg only) — new. Logo left, hamburger right,
          64px bar height, 20px horizontal padding, reusing the same
          scrolled/rest background+blur+border the header already
          applies (no separate background system introduced).
      ============================================================ */}
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:hidden">
        <Link
          href="/"
          aria-label="Talimoon Home"
          className="relative flex h-8 w-auto shrink-0 items-center"
        >
          <img
            src="/logo/talimoon-logo-color.svg"
            alt="Talimoon"
            draggable={false}
            className="h-8 w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
          <img
            src="/logo/talimoon-logo-gold.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-8 w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
          <span
            aria-hidden="true"
            className="tm-logo-shine pointer-events-none absolute inset-0 h-8 w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
        </Link>

        <button
          ref={toggleButtonRef}
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="tm-mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
          className={[
            "relative flex h-6 w-6 shrink-0 items-center justify-center",
            "focus-visible:outline focus-visible:outline-2",
            "focus-visible:outline-offset-2",
            "focus-visible:outline-[var(--accent-primary,#B5764B)]",
          ].join(" ")}
        >
          <span aria-hidden="true" className="relative flex h-4 w-6 flex-col justify-between">
            <span
              className={[
                "h-[2px] w-6 rounded-full transition-transform duration-300 ease-out",
                hamburgerBarColor,
                mobileOpen ? "translate-y-[7px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-[2px] w-6 rounded-full transition-opacity duration-200 ease-out",
                hamburgerBarColor,
                mobileOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "h-[2px] w-6 rounded-full transition-transform duration-300 ease-out",
                hamburgerBarColor,
                mobileOpen ? "-translate-y-[7px] -rotate-45" : "",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      {/* ============================================================
          MOBILE MENU OVERLAY — full-screen, only mounted while
          mobileOpen (plus its short closing-transition window).
      ============================================================ */}
      {menuMounted && (
        <div
          id="tm-mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={[
            "fixed inset-0 z-[60] flex flex-col",
            "bg-[var(--surface-warm-100,#F7F2EA)]",
            "transition-all duration-300 ease-out lg:hidden",
            menuVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
          ].join(" ")}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <Link
              href="/"
              aria-label="Talimoon Home"
              onClick={closeMenu}
              className="flex h-8 w-auto items-center"
            >
              <img
                src="/logo/talimoon-logo-color.svg"
                alt="Talimoon"
                draggable={false}
                className="h-8 w-auto"
              />
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className={[
                "flex h-6 w-6 items-center justify-center",
                "text-[var(--text-primary,#2A241D)]",
                "focus-visible:outline focus-visible:outline-2",
                "focus-visible:outline-offset-2",
                "focus-visible:outline-[var(--accent-primary,#B5764B)]",
              ].join(" ")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                aria-hidden="true"
                className="h-6 w-6"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-6">
            <ul className="flex flex-col divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
              {MOBILE_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block py-5 font-serif text-[1.5rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 px-5 pb-8 pt-4">
            <a
              href="#begin"
              onClick={closeMenu}
              style={GOLD_TOKENS}
              className={[
                "tm-cta-gold",
                "flex h-12 w-full items-center justify-center",
                "text-[14px] font-medium tracking-[0.02em]",
              ].join(" ")}
            >
              Begin the Story
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
