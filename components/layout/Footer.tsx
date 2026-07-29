/**
 * Footer — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 * Container, spacing, and color tokens match Hero / TrustStrip /
 * HowItWorks / BookShowcase / InsideBook / EmotionalBanner.
 */

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
  "font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary,#726C65)]";

const linkClass =
  "block font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)] hover:text-[var(--text-primary,#2A241D)]";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--surface-raised,#FDFBF7)]">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        {/* Top area */}
        <div className="flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="font-serif text-[1.5rem] font-medium tracking-[-0.01em] text-[var(--text-primary,#2A241D)]">
              TALIMOON
            </p>
            <p className="mt-2 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
              Stories they&rsquo;ll remember forever.
            </p>
          </div>

          <a
            href="#pricing"
            className="inline-flex h-14 w-full items-center justify-center rounded px-8 md:w-auto bg-[var(--accent-primary,#B8935B)] text-[15px] font-medium tracking-[0.02em] text-white hover:bg-[var(--accent-primary-hover,#9C7A47)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B8935B)]"
          >
            Create Your Story
          </a>
        </div>

        {/* Middle: four columns */}
        <div className="grid grid-cols-1 gap-12 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h3 className={columnHeadingClass}>Explore</h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
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
                    <span className="text-[var(--text-tertiary,#726C65)]">{contact.label}: </span>
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] py-8 font-sans text-[0.8125rem] text-[var(--text-tertiary,#726C65)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TALIMOON.</p>
          <p>Crafted with care for families.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
