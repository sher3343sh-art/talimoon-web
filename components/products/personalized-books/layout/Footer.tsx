"use client";

/**
 * Footer — TALIMOON
 * ----------------------------------------------------------------
 * No local state/effects of its own, but now needs `useT` (a Context
 * hook) for translated copy, so it must be a Client Component — was
 * previously a plain server component, upgraded specifically for
 * this. Container, spacing, and color tokens match Hero / TrustStrip
 * / HowItWorks / BookShowcase / InsideBook / EmotionalBanner.
 */

import { useT } from "@/lib/i18n/LanguageContext";

const FOOTER_EN = {
  tagline: "Stories they'll remember forever.",
  createYourStory: "Create Your Story",
  exploreHeading: "Explore",
  resourcesHeading: "Resources",
  socialHeading: "Social",
  contactHeading: "Contact",
  about: "About",
  howItWorks: "How it Works",
  pricing: "Pricing",
  faq: "FAQ",
  privacyPolicy: "Privacy Policy",
  terms: "Terms",
  contact: "Contact",
  email: "Email",
  copyright: "© 2026 TALIMOON.",
  craftedWithCare: "Crafted with care for families.",
};

const FOOTER_UZ: typeof FOOTER_EN = {
  tagline: "Ular umrbod eslab qoladigan hikoyalar.",
  createYourStory: "Hikoyangizni yarating",
  exploreHeading: "Sahifalar",
  resourcesHeading: "Resurslar",
  socialHeading: "Ijtimoiy tarmoqlar",
  contactHeading: "Aloqa",
  about: "Biz haqimizda",
  howItWorks: "Qanday ishlaydi",
  pricing: "Narxlar",
  faq: "Savol-javob",
  privacyPolicy: "Maxfiylik siyosati",
  terms: "Foydalanish shartlari",
  contact: "Aloqa",
  email: "Email",
  copyright: "© 2026 TALIMOON.",
  craftedWithCare: "Oilalar uchun mehr bilan yaratilgan.",
};

const EXPLORE_LINKS = [
  { key: "about", href: "#about" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "pricing", href: "#pricing" },
  { key: "faq", href: "#faq" },
] as const satisfies readonly { key: keyof typeof FOOTER_EN; href: string }[];

const RESOURCES_LINKS = [
  { key: "privacyPolicy", href: "/privacy" },
  { key: "terms", href: "/terms" },
  { key: "contact", href: "/contact" },
] as const satisfies readonly { key: keyof typeof FOOTER_EN; href: string }[];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Telegram", href: "#" },
];

const CONTACT_LINKS = [
  { key: "email", value: "hello@talimoon.com", href: "mailto:hello@talimoon.com" },
  { label: "Telegram", value: "@talimoon", href: "#" },
  { label: "Instagram", value: "@talimoon", href: "#" },
] as const;

const columnHeadingClass =
  "font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--text-tertiary,#726C65)]";

const linkClass =
  "block font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)] hover:text-[var(--text-primary,#2A241D)]";

export function Footer() {
  const t = useT(FOOTER_EN, FOOTER_UZ);

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
              {t.tagline}
            </p>
          </div>

          <a
            href="#pricing"
            className="inline-flex h-14 w-full items-center justify-center rounded px-8 md:w-auto bg-[var(--accent-primary,#B8935B)] text-[15px] font-medium tracking-[0.02em] text-white hover:bg-[var(--accent-primary-hover,#9C7A47)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B8935B)]"
          >
            {t.createYourStory}
          </a>
        </div>

        {/* Middle: four columns */}
        <div className="grid grid-cols-1 gap-12 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <h3 className={columnHeadingClass}>{t.exploreHeading}</h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className={linkClass}>
                    {t[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClass}>{t.resourcesHeading}</h3>
            <ul className="mt-5 space-y-3">
              {RESOURCES_LINKS.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className={linkClass}>
                    {t[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={columnHeadingClass}>{t.socialHeading}</h3>
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
            <h3 className={columnHeadingClass}>{t.contactHeading}</h3>
            <ul className="mt-5 space-y-3">
              {CONTACT_LINKS.map((contact) => (
                <li key={"key" in contact ? contact.key : contact.label}>
                  <a href={contact.href} className={linkClass}>
                    <span className="text-[var(--text-tertiary,#726C65)]">
                      {"key" in contact ? t[contact.key] : contact.label}:{" "}
                    </span>
                    {contact.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom area */}
        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] py-8 font-sans text-[0.8125rem] text-[var(--text-tertiary,#726C65)] sm:flex-row sm:items-center sm:justify-between">
          <p>{t.copyright}</p>
          <p>{t.craftedWithCare}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
