"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";


// Desktop primary nav. "Product" renders as a dropdown trigger (see
// PRODUCT_MENU below) instead of a plain link — everything else is
// a direct link, same as before.
type NavItem = { label: string; href: string } | { label: string; dropdown: "product" };

const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", dropdown: "product" },
  { label: "News", href: "/news" },
  { label: "Story Library", href: "/story-library" },
  { label: "About", href: "#about" },
];

// Product dropdown contents — exactly the three entries in the spec,
// no icons/descriptions/badges. "Yusuf & Yasmina" carries a small
// secondary "Story Series" caption directly beneath it (lower
// emphasis, tighter line-height) rather than being its own row.
const PRODUCT_MENU = [
  { label: "Personalized Books", href: "/products/personalized-books" },
  {
    label: "Yusuf & Yasmina",
    href: "/products/yusuf-and-yasmina",
    caption: "Story Series",
  },
  { label: "Talimoon Toys", href: "/products/talimoon-toys" },
] as const;

const LANGUAGES = [
  { code: "UZ", name: "O'zbekcha" },
  { code: "EN", name: "English" },
  { code: "RU", name: "Русский" },
  { code: "AR", name: "العربية" },
] as const;

// Social links with brand-colored icon paths
const SOCIAL_LINKS = [
  { 
    name: "instagram" as const, 
    label: "Instagram", 
    href: "https://instagram.com/talimoon",
  },
  { 
    name: "telegram" as const, 
    label: "Telegram", 
    href: "https://t.me/talimoon",
  },
  { 
    name: "youtube" as const, 
    label: "YouTube", 
    href: "https://youtube.com/@talimoon",
  },
] as const;
const SOCIAL_ICON_PATHS = {
  instagram: "/icons/instagram.png",
  telegram: "/icons/telegram.png",
  youtube: "/icons/youtube.png",
} as const;
// Drawer now mirrors the desktop information architecture exactly
// (Home / Product / News / Story Library / About). "Product" opens
// as an inline accordion using PRODUCT_MENU's existing content
// rather than a separate hardcoded list, so desktop and mobile can
// never drift out of sync.
type MobileNavItem = { label: string; href: string } | { label: string; accordion: "product" };

const MOBILE_NAV_LINKS: MobileNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Product", accordion: "product" },
  { label: "News", href: "/news" },
  { label: "Story Library", href: "/story-library" },
  { label: "About", href: "#about" },
];

const SCROLL_THRESHOLD = 24;

// How long the drawer + backdrop's exit transition runs, in ms.
const MOBILE_MENU_EXIT_MS = 300;

// Premium "expo-out" easing — decelerates smoothly with no bounce,
// the same easing family used in Apple's own sheet/drawer motion.
const DRAWER_EASING = "ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * ---------------------------------------------------------------
 * COLOR CONTROLS — edit these to restyle the navbar by hand.
 * ---------------------------------------------------------------
 */
const REST_BG = "#1C2A3A";
const REST_BORDER = "rgba(255,255,255,0.10)";

const SCROLLED_BG = "rgba(247,242,234,0.55)";
const SCROLLED_BORDER = "rgba(42,36,29,0.10)";

/**
 * ---------------------------------------------------------------
 * GOLD DESIGN TOKEN SYSTEM
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
   * DESKTOP DROPDOWNS (Product, Language) — only one open at a time.
   * ---------------------------------------------------------------
   */
  const [openDropdown, setOpenDropdown] = useState<"product" | "language" | null>(null);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["code"]>("UZ");

  const productContainerRef = useRef<HTMLLIElement>(null);
  const languageContainerRef = useRef<HTMLDivElement>(null);
  const productTriggerRef = useRef<HTMLButtonElement>(null);
  const languageTriggerRef = useRef<HTMLButtonElement>(null);
  const productFirstItemRef = useRef<HTMLAnchorElement>(null);

  const toggleDropdown = (name: "product" | "language") =>
    setOpenDropdown((current) => (current === name ? null : name));

  const closeDropdowns = () => setOpenDropdown(null);

  // Focus the first menu item once the Product dropdown opens
  useEffect(() => {
    if (openDropdown === "product") {
      productFirstItemRef.current?.focus();
    }
  }, [openDropdown]);

  // Click outside either dropdown closes whichever is open
  useEffect(() => {
    if (!openDropdown) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const withinProduct = productContainerRef.current?.contains(target);
      const withinLanguage = languageContainerRef.current?.contains(target);
      if (!withinProduct && !withinLanguage) closeDropdowns();
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openDropdown]);

  // Escape closes the open dropdown and returns focus to its trigger
  useEffect(() => {
    if (!openDropdown) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const trigger = openDropdown === "product" ? productTriggerRef : languageTriggerRef;
      closeDropdowns();
      trigger.current?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDropdown]);

  /**
   * ---------------------------------------------------------------
   * MOBILE NAVIGATION (< lg only)
   * ---------------------------------------------------------------
   */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const closeMenu = () => setMobileOpen(false);

  // Collapse the Product accordion whenever the drawer itself closes
  useEffect(() => {
    if (!mobileOpen) setMobileProductOpen(false);
  }, [mobileOpen]);

  // Mount/animate the drawer in, or animate it out then unmount
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

  // Focus management: move focus into the drawer on open, back to hamburger on close
  useEffect(() => {
    if (mobileOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      toggleButtonRef.current?.focus();
    }
  }, [mobileOpen]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!mobileOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.setAttribute("data-tm-menu-open", "true");

    return () => {
      document.body.style.overflow = original;
      document.body.removeAttribute("data-tm-menu-open");
    };
  }, [mobileOpen]);

  // ESC closes the drawer; Tab/Shift+Tab is trapped inside it while open
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
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

  // Dropdown trigger (Product / Language)
  const dropdownTriggerClass = (isOpen: boolean) =>
    [
      "group relative inline-flex items-center gap-1.5 py-2",
      "whitespace-nowrap font-sans text-[14px] font-medium tracking-[0.01em]",
      "transition-colors duration-200",
      "focus-visible:outline focus-visible:outline-2",
      "focus-visible:outline-offset-2",
      "focus-visible:outline-[var(--accent-primary,#B5764B)]",
      scrolled
        ? "text-[var(--text-secondary,#49433C)] hover:text-[var(--text-primary,#2A241D)]"
        : "text-white/85 hover:text-white",
      isOpen ? (scrolled ? "text-[var(--text-primary,#2A241D)]" : "text-white") : "",
    ].join(" ");

  const dropdownPanelClass = (isOpen: boolean, align: "left" | "right" = "left") =>
    [
      "absolute top-full z-[60] mt-2",
      align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right",
      "rounded-[3px] backdrop-blur-[8px]",
      scrolled
        ? "bg-[var(--nav-scrolled-bg)] border border-[var(--nav-scrolled-border)]"
        : "bg-[var(--nav-rest-bg)]/[0.92] border border-[var(--nav-rest-border)]",
      "shadow-[0_10px_24px_-10px_rgba(0,0,0,0.28)]",
      "p-1.5",
      "transition-[opacity,transform] duration-[160ms] ease-out",
      isOpen
        ? "pointer-events-auto translate-y-0 opacity-100"
        : "pointer-events-none -translate-y-1 opacity-0",
    ].join(" ");

  const dropdownItemClass =
    [
      "block whitespace-nowrap rounded-[2px] px-4 py-2.5 font-sans text-[14px] font-medium leading-[1.3]",
      "transition-colors duration-150",
      scrolled
        ? "text-[var(--text-primary,#2A241D)] hover:bg-black/[0.05]"
        : "text-white/90 hover:bg-white/[0.08]",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-primary,#B5764B)]",
    ].join(" ");

  const dropdownCaptionClass = scrolled
    ? "text-[var(--text-tertiary,#726C65)]"
    : "text-white/50";

  const languageTriggerClass = (isOpen: boolean) =>
  [
    "group relative inline-flex h-10 shrink-0 items-center gap-1",
    "px-1.5",
    "whitespace-nowrap font-sans text-[12px] font-medium tracking-[0.01em]",
    "transition-colors duration-200",
    "focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--accent-primary,#B5764B)]",
    scrolled
      ? "text-[var(--text-secondary,#49433C)] hover:text-[var(--text-primary,#2A241D)]"
      : "text-white/85 hover:text-white",
    isOpen
      ? scrolled
        ? "text-[var(--text-primary,#2A241D)]"
        : "text-white"
      : "",
  ].join(" ");

  const chevronClass = (isOpen: boolean) =>
    [
      "h-3 w-3 shrink-0 transition-transform duration-200 ease-out",
      isOpen ? "rotate-180" : "rotate-0",
    ].join(" ");

  const ChevronIcon = () => (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-full w-full"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );

  // Flag icon component
  const FlagIcon = ({ code }: { code: (typeof LANGUAGES)[number]["code"] }) => (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden="true"
      className="shrink-0 overflow-hidden rounded-[4px] ring-1 ring-inset ring-black/10"
    >
      {code === "UZ" && (
        <>
          <rect width="20" height="20" fill="#0099B5" />
          <rect y="7.4" width="20" height="1" fill="#CE1126" />
          <rect y="8.4" width="20" height="3.2" fill="#FFFFFF" />
          <rect y="11.6" width="20" height="1" fill="#CE1126" />
          <rect y="12.6" width="20" height="7.4" fill="#1EB53A" />
          <circle cx="4.3" cy="3.7" r="2" fill="#FFFFFF" />
          <circle cx="5.1" cy="3.7" r="1.7" fill="#0099B5" />
        </>
      )}
      {code === "EN" && (
        <>
          <rect width="20" height="20" fill="#00247D" />
          <path d="M0 0 20 20M20 0 0 20" stroke="#FFFFFF" strokeWidth="3.6" />
          <path d="M0 0 20 20M20 0 0 20" stroke="#CF142B" strokeWidth="1.4" />
          <path d="M10 0V20M0 10H20" stroke="#FFFFFF" strokeWidth="5.6" />
          <path d="M10 0V20M0 10H20" stroke="#CF142B" strokeWidth="2.6" />
        </>
      )}
      {code === "RU" && (
        <>
          <rect width="20" height="6.67" fill="#FFFFFF" />
          <rect y="6.67" width="20" height="6.67" fill="#0039A6" />
          <rect y="13.33" width="20" height="6.67" fill="#D52B1E" />
        </>
      )}
      {code === "AR" && (
        <>
          <rect width="20" height="20" fill="#006C35" />
          <rect x="3.5" y="8.1" width="13" height="1.5" rx="0.75" fill="#FFFFFF" />
          <rect x="3.5" y="10.8" width="13" height="1.1" rx="0.55" fill="#FFFFFF" />
        </>
      )}
    </svg>
  );

  // Globe icon for language trigger
  const GlobeIcon = () => (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      aria-hidden="true"
      className="h-[15px] w-[15px] shrink-0"
    >
      <circle cx="8" cy="8" r="6.25" />
      <ellipse cx="8" cy="8" rx="2.5" ry="6.25" />
      <path d="M1.9 5.8h12.2M1.9 10.2h12.2" />
    </svg>
  );

  // Social icon component — outline when not scrolled, brand-colored when scrolled
  const SocialIcon = ({ 
    name, 
    scrolled 
  }: { 
    name: (typeof SOCIAL_LINKS)[number]["name"];
    scrolled: boolean;
  }) => {
    if (scrolled) {
      const iconPath = SOCIAL_ICON_PATHS[name];
      
      return (
       <img
  src={iconPath}
  alt=""
  aria-hidden
  draggable={false}
  className="h-full  w-full object-contain"
/>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-full w-full"
      >
        {name === "instagram" && (
          <>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
          </>
        )}
        {name === "telegram" && (
          <path d="M21 3 3 10.5l6 2 2 6 3-4.5 4.5 3L21 3ZM9 12.5 18 6" />
        )}
        {name === "youtube" && (
          <>
            <rect x="3" y="6" width="18" height="12" rx="4" />
            <path d="M10.5 9.7 15 12l-4.5 2.3V9.7Z" fill="currentColor" stroke="none" />
          </>
        )}
      </svg>
    );
  };

  const hamburgerBarColor = scrolled
    ? "bg-[var(--nav-rest-bg,#1C2A3A)]"
    : "bg-white";

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
      {/* Gold CTA surface system */}
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
            inset 0 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -1px 0 rgba(0, 0, 0, 0.14),
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
          DESKTOP NAV (lg and above)
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
          <img
            src="/logo/talimoon-logo-color.svg"
            alt="Talimoon"
            draggable={false}
            className="h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 1 : 0 }}
          />
          <img
            src="/logo/talimoon-logo-gold.svg"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
          <span
            aria-hidden="true"
            className="tm-logo-shine pointer-events-none absolute inset-0 h-[45px] w-auto transition-opacity duration-300"
            style={{ opacity: scrolled ? 0 : 1 }}
          />
        </Link>

        <ul className="flex shrink-0 items-center gap-11">
          {DESKTOP_NAV_ITEMS.map((item) => {
            if ("dropdown" in item) {
              const isOpen = openDropdown === "product";
              return (
                <li key={item.label} ref={productContainerRef} className="relative">
                  <button
                    ref={productTriggerRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls="tm-product-menu"
                    onClick={() => toggleDropdown("product")}
                    className={dropdownTriggerClass(isOpen)}
                  >
                    {item.label}
                    <span aria-hidden="true" className={underlineClass} />
                  </button>

                  <div
                    id="tm-product-menu"
                    role="menu"
                    aria-label="Product"
                    className={dropdownPanelClass(isOpen)}
                  >
                    {PRODUCT_MENU.map((product, index) => (
                      <a
                        key={product.href}
                        ref={index === 0 ? productFirstItemRef : undefined}
                        href={product.href}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        onClick={closeDropdowns}
                        className={dropdownItemClass}
                      >
                        {product.label}
                        {"caption" in product && (
                          <span
                            className={[
                              "mt-0.5 block font-sans text-[11px] font-normal uppercase tracking-[0.08em]",
                              dropdownCaptionClass,
                            ].join(" ")}
                          >
                            {product.caption}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </li>
              );
            }

            const isHashAnchor = item.href.startsWith("#");
            return (
              <li key={item.label}>
                {isHashAnchor ? (
                  <a href={item.href} className={linkClass}>
                    {item.label}
                    <span aria-hidden="true" className={underlineClass} />
                  </a>
                ) : (
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                    <span aria-hidden="true" className={underlineClass} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center justify-end gap-6 ">
          <span aria-hidden="true" className="w-1 shrink-0" />

          <Link href="/login" className={`${linkClass} ml-8`}>
            Log in
            <span aria-hidden="true" className={underlineClass} />
          </Link>

          <a
            href="#begin"
            style={GOLD_TOKENS}
            className={[
              "tm-cta-gold",
              "inline-flex h-11 shrink-0 items-center justify-center",
              "whitespace-nowrap px-4",
              "text-[13px] font-medium tracking-[0.015em]",
            ].join(" ")}
          >
            Begin the Story
          </a>

          <div ref={languageContainerRef} className="relative -ml-2">
            <button
              ref={languageTriggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={openDropdown === "language"}
              aria-controls="tm-language-menu"
              aria-label={`Language: ${LANGUAGES.find((l) => l.code === language)?.name ?? language}`}
              onClick={() => toggleDropdown("language")}
              className={languageTriggerClass(openDropdown === "language")}
            >
              <GlobeIcon />
              <span>{language}</span>
              <span className={chevronClass(openDropdown === "language")}>
                <ChevronIcon />
              </span>
            </button>

            <div
              id="tm-language-menu"
              role="menu"
              aria-label="Language"
              className={[
                dropdownPanelClass(openDropdown === "language", "left"),
                "flex w-max flex-col gap-0.5",
              ].join(" ")}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={language === lang.code}
                  aria-label={lang.name}
                  tabIndex={openDropdown === "language" ? 0 : -1}
                  onClick={() => {
                    setLanguage(lang.code);
                    closeDropdowns();
                    languageTriggerRef.current?.focus();
                  }}
                  className={[
                    "flex items-center gap-2 rounded px-2.5 py-2",
                    "font-sans text-[14px] font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline focus-visible:outline-2",
                    "focus-visible:outline-offset-[-2px]",
                    "focus-visible:outline-[var(--accent-primary,#B5764B)]",
                    scrolled ? "text-[var(--text-primary,#2A241D)]" : "text-white/90",
                    language === lang.code
                      ? scrolled
                        ? "bg-black/[0.05]"
                        : "bg-white/[0.08]"
                      : scrolled
                        ? "hover:bg-black/[0.05]"
                        : "hover:bg-white/[0.08]",
                  ].join(" ")}
                >
                  <FlagIcon code={lang.code} />
                  <span>{lang.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Social links — updated to pass scrolled prop */}
          <div className="ml-0 flex shrink-0 items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={[
                  social.name === "youtube"
                    ? "flex h-[30px] w-[30px] shrink-0 items-center justify-center"
                    : "flex h-[26px] w-[26px] shrink-0 items-center justify-center",
                  "transition-colors duration-200 ease-out",
                  scrolled
                    ? "text-[var(--text-tertiary,#726C65)] hover:text-[var(--text-primary,#2A241D)]"
                    : "text-white/70 hover:text-white",
                  "focus-visible:outline focus-visible:outline-2",
                  "focus-visible:outline-offset-2",
                  "focus-visible:outline-[var(--accent-primary,#B5764B)]",
                ].join(" ")}
              >
                <SocialIcon name={social.name} scrolled={scrolled} />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ============================================================
          MOBILE NAV (< lg only)
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
          aria-controls="tm-mobile-drawer"
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
                "h-[1.5px] w-6 rounded-full transition-transform duration-300 ease-out",
                hamburgerBarColor,
                mobileOpen ? "translate-y-[7px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-[1.5px] w-6 rounded-full transition-opacity duration-200 ease-out",
                hamburgerBarColor,
                mobileOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "h-[1.5px] w-6 rounded-full transition-transform duration-300 ease-out",
                hamburgerBarColor,
                mobileOpen ? "-translate-y-[7px] -rotate-45" : "",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      {/* ============================================================
          MOBILE DRAWER
      ============================================================ */}
      {menuMounted && (
        <>
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className={[
              "fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm lg:hidden",
              `transition-opacity duration-300 ${DRAWER_EASING}`,
              menuVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <div
            id="tm-mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={[
              "fixed left-3 right-3 top-[72px] z-[60] lg:hidden",
              "flex max-h-[60vh] flex-col overflow-hidden rounded-3xl",
              "bg-[var(--surface-warm-100,#F7F2EA)]",
              "shadow-[0_24px_60px_-12px_rgba(42,36,29,0.35)]",
              "ring-1 ring-[var(--border-subtle,rgba(42,36,29,0.12))]",
              `origin-top transition-[opacity,transform] duration-300 ${DRAWER_EASING}`,
              menuVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-[0.98]",
            ].join(" ")}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle,rgba(42,36,29,0.12))] px-5 py-3">
              <Link
                href="/"
                aria-label="Talimoon Home"
                onClick={closeMenu}
                className="flex h-7 w-auto items-center"
              >
                <img
                  src="/logo/talimoon-logo-color.svg"
                  alt="Talimoon"
                  draggable={false}
                  className="h-7 w-auto"
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
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto px-5">
              <ul className="flex flex-col divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))]">
                {MOBILE_NAV_LINKS.map((item) => {
                  if ("accordion" in item) {
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          aria-expanded={mobileProductOpen}
                          aria-controls="tm-mobile-product-panel"
                          onClick={() => setMobileProductOpen((open) => !open)}
                          className={[
                            "flex min-h-[52px] w-full items-center justify-between",
                            "py-4 text-left font-serif text-[1.0625rem] font-medium leading-[1.3]",
                            "text-[var(--text-primary,#2A241D)]",
                            "transition-colors duration-200 ease-out active:text-[var(--accent-primary,#B5764B)]",
                            "focus-visible:outline focus-visible:outline-2",
                            "focus-visible:outline-offset-2",
                            "focus-visible:outline-[var(--accent-primary,#B5764B)]",
                          ].join(" ")}
                        >
                          {item.label}
                          <span
                            className={[
                              "h-3 w-3 shrink-0 text-[var(--text-tertiary,#726C65)]",
                              "transition-transform duration-300 ease-out",
                              mobileProductOpen ? "rotate-180" : "rotate-0",
                            ].join(" ")}
                          >
                            <ChevronIcon />
                          </span>
                        </button>

                        <div
                          id="tm-mobile-product-panel"
                          className={[
                            "grid overflow-hidden",
                            `transition-[grid-template-rows] duration-300 ${DRAWER_EASING}`,
                            mobileProductOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                          ].join(" ")}
                        >
                          <ul className="min-h-0 flex flex-col gap-1 pb-4 pl-4">
                            {PRODUCT_MENU.map((product) => (
                              <li key={product.href}>
                                <a
                                  href={product.href}
                                  onClick={closeMenu}
                                  tabIndex={mobileProductOpen ? 0 : -1}
                                  className={[
                                    "flex min-h-[44px] flex-col justify-center rounded-lg px-2",
                                    "font-sans text-[15px] font-medium leading-[1.3]",
                                    "text-[var(--text-secondary,#49433C)]",
                                    "transition-colors duration-200 ease-out",
                                    "active:text-[var(--text-primary,#2A241D)]",
                                    "focus-visible:outline focus-visible:outline-2",
                                    "focus-visible:outline-offset-2",
                                    "focus-visible:outline-[var(--accent-primary,#B5764B)]",
                                  ].join(" ")}
                                >
                                  {product.label}
                                  {"caption" in product && (
                                    <span className="mt-0.5 font-sans text-[11px] font-normal uppercase tracking-[0.08em] text-[var(--text-tertiary,#726C65)]">
                                      {product.caption}
                                    </span>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={closeMenu}
                        className={[
                          "flex min-h-[52px] items-center py-4",
                          "font-serif text-[1.0625rem] font-medium leading-[1.3]",
                          "text-[var(--text-primary,#2A241D)]",
                          "transition-colors duration-200 ease-out active:text-[var(--accent-primary,#B5764B)]",
                          "focus-visible:outline focus-visible:outline-2",
                          "focus-visible:outline-offset-2",
                          "focus-visible:outline-[var(--accent-primary,#B5764B)]",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] px-5 py-4">
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
        </>
      )}
    </header>
  );
}