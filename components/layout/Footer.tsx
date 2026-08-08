/**
 * Footer — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 * Container and spacing are untouched from the original light-surface
 * version — only color tokens changed.
 *
 * 2026-08-08: the Final CTA section (EmotionalBanner, dark navy
 * `--surface-contrast`) was removed from the home page entirely, and
 * the Footer took over that exact same background token so the page
 * still ends on a dark note instead of cutting straight from cream
 * to cream-again. Every text/border color below is the existing
 * "inverse" (light-on-dark) tier already established by
 * EmotionalBanner (`--text-inverse`, `--text-inverse-muted`) and the
 * design system's own `--border-inverse` token — nothing new was
 * introduced.
 *
 * 2026-08-08 (same day, follow-up): the text wordmark and the old
 * "Create Your Story" button were replaced with the exact Navbar
 * logo (gold variant + `.tm-logo-shine`) and the exact Navbar CTA
 * (`.tm-cta-gold`, "Begin the Story", `#begin`) — both classes now
 * live in globals.css (§27/§28), extracted from Navbar's own local
 * `<style jsx>` specifically so Footer could reuse them verbatim
 * instead of duplicating ~70 lines of CSS.
 */

import Link from "next/link";

const EXPLORE_LINKS = [
  { label: "About", href: "#about" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const RESOURCES_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Telegram", href: "#" },
];

const CONTACT_LINKS = [
  { label: "Email", value: "hello@talimoon.com", href: "mailto:hello@talimoon.com" },
  { label: "Telegram", value: "@talimoon", href: "#" },
  { label: "Instagram", value: "@talimoon", href: "#" },
];

const columnHeadingClass =
  "font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-inverse-muted,rgba(247,243,236,0.7))]";

const linkClass =
  "block font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-inverse,#F7F3EC)] hover:text-[var(--accent-primary,#B8935B)]";

export interface FooterProps {
  /** Whether the Explore column links to the #how-it-works anchor. Set
   * false on pages that don't render a HowItWorks section, so Footer
   * never renders a link to an anchor that doesn't exist. */
  showHowItWorksLink?: boolean;
}

export function Footer({ showHowItWorksLink = true }: FooterProps) {
  const exploreLinks = showHowItWorksLink
    ? EXPLORE_LINKS
    : EXPLORE_LINKS.filter((link) => link.href !== "#how-it-works");

  return (
    <footer className="w-full bg-[var(--surface-contrast,#1C2A3A)]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        {/* Top area */}
        <div className="flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <Link href="/" aria-label="Talimoon Home" className="relative flex h-9 w-auto items-center">
              <img
                src="/logo/talimoon-logo-gold.svg"
                alt="Talimoon"
                draggable={false}
                className="h-9 w-auto"
              />
              <span aria-hidden="true" className="tm-logo-shine pointer-events-none absolute inset-0 h-9 w-auto" />
            </Link>
            <p className="mt-3 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-inverse-muted,rgba(247,243,236,0.7))]">
              Stories they&rsquo;ll remember forever.
            </p>
          </div>

          <a
            href="#begin"
            className="tm-cta-gold inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap px-4 text-[13px] font-medium tracking-[0.015em]"
          >
            Begin the Story
          </a>
        </div>

        {/* Middle: four columns */}
        <div className="grid grid-cols-1 gap-12 border-t border-[var(--border-inverse,rgba(247,243,236,0.18))] py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h3 className={columnHeadingClass}>Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClass}>Resources</h3>
            <ul className="mt-5 space-y-3">
              {RESOURCES_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClass}>Social</h3>
            <ul className="mt-5 space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClass}>Contact</h3>
            <ul className="mt-5 space-y-3">
              {CONTACT_LINKS.map((contact) => (
                <li key={contact.label}>
                  <a href={contact.href} className={linkClass}>
                    <span className="text-[var(--text-inverse-muted,rgba(247,243,236,0.7))]">{contact.label}: </span>
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col gap-3 border-t border-[var(--border-inverse,rgba(247,243,236,0.18))] py-8 font-sans text-[0.8125rem] text-[var(--text-inverse-muted,rgba(247,243,236,0.7))] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TALIMOON.</p>
          <p>Crafted with care for families.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
