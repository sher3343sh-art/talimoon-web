"use client";

import { useState } from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";

/**
 * TALIMOON — "The Open Page" Hero
 * Implements: Hero UX Strategy, Hero UI Strategy, "The Living Story" Creative
 * Direction, Hero Refinement Spec v2.0, and High-Fidelity Spec v3.0.
 *
 * v3.4 — Hero + HeroImage merge (this pass):
 *  - The photo is no longer a plain CSS `background-image`. It is now a
 *    real `next/image` (`fill`, `priority`, `quality`), so we get proper
 *    responsive srcset/optimization, plus a loading fade-in and a graceful
 *    fallback if the file fails to load — logic that used to live in a
 *    separate HeroImage.tsx, now consolidated into this single file.
 *  - Default image path is locked to the verified, on-disk location:
 *      /images/products/personalized-books/hero/hero-v13.png
 *    (public/images/products/personalized-books/hero/hero-v13.png)
 *    so the Hero renders correctly even if a caller forgets to pass
 *    `imageSrc`.
 *  - All masking/dissolve gradients, filters, typography, CTAs, nav, and
 *    responsive rules are UNCHANGED — only the photo-rendering mechanism
 *    changed, from a CSS background box to a real <Image> inside the same
 *    `.tm-hero__photo` box (mask-image/filter apply the same way to a
 *    container as they did to a background, so the visual result is
 *    identical once the image is loaded).
 *
 * Key structural decisions (do not "simplify" these away without re-reading
 * the specs above):
 *  - The navbar has NO flat background box. It is fully transparent except
 *    for a soft, localized radial glow confined to the image-zone side,
 *    which fades to nothing before reaching the content zone.
 *  - The image has no hard rectangular edge. Its bottom and interior/right
 *    edges dissolve into the shared background over a wide, multi-stop
 *    gradient — never a short, line-like fade.
 *  - The photo itself stays fully opaque behind the navbar (no top fade) so
 *    the navbar's scrim has real photographic tone to darken.
 */

export interface TalimoonHeroProps {
  /** Real photograph URL. Defaults to the verified on-disk hero image. */
  imageSrc?: string;
  /** Descriptive alt text — scene + emotional intent, not literal pixel description. */
  imageAlt?: string;
  /**
   * Renders this component's own transparent overlay nav.
   * Default `false` — most sites already have their own header/navbar
   * component, and rendering both at once causes the two to overlap.
   */
  showNav?: boolean;
  logoText?: string;
  navLinks?: { label: string; href: string }[];
  kicker?: string;
  headline?: string;
  /** One short line directly under the headline — "the turn". */
  follow?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Compact practical/trust line beneath the CTAs (e.g. "499 000 so'mdan · 7–10 kun"). */
  trailerLabel?: string;
}

const defaultNavLinksEn = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Collections", href: "#collections" },
  { label: "Gifting", href: "#gifting" },
];

const defaultNavLinksUz = [
  { label: "Qanday ishlaydi", href: "#how-it-works" },
  { label: "Ustalik", href: "#craftsmanship" },
  { label: "To'plamlar", href: "#collections" },
  { label: "Sovg'a qilish", href: "#gifting" },
];

const defaultNavLinksRu = [
  { label: "Как это работает", href: "#how-it-works" },
  { label: "Мастерство", href: "#craftsmanship" },
  { label: "Коллекции", href: "#collections" },
  { label: "Подарки", href: "#gifting" },
];

// Verified location: public/images/products/personalized-books/hero/hero-v13.png
const DEFAULT_HERO_IMAGE_SRC =
  "/images/products/personalized-books/hero/hero-v13.webp";

const DEFAULT_COPY_EN = {
  imageAlt: "A child reading, softly connected to the story in their hands",
  logoText: "Talimoon",
  kicker: "A PERSONAL STORY",
  headline: "This isn't just a book with your child's name in it.",
  follow: "It's a story they live inside.",
  subhead:
    "Your child's likeness, their character, their interests — and the meaning you want to reach their heart — held inside a story made for them alone.",
  primaryCtaLabel: "Create my child's story →",
  secondaryCtaLabel: "How it works ↓",
  trailerLabel: "From 499 000 so‘m · 7–10 days",
};

const DEFAULT_COPY_UZ: typeof DEFAULT_COPY_EN = {
  imageAlt: "Bola hikoyaga chin qalbdan bog‘langan holda o‘qimoqda",
  logoText: "Talimoon",
  kicker: "SHAXSIY HIKOYA",
  headline: "Bu shunchaki uning ismi yozilgan kitob emas.",
  follow: "Bu — uning o‘zi yashaydigan hikoya.",
  subhead:
    "Farzandingizning qiyofasi, xarakteri, qiziqishlari va Siz uning qalbiga yetkazmoqchi bo‘lgan ma’no — faqat u uchun yaratilgan hikoyada.",
  primaryCtaLabel: "Farzandimning hikoyasini yaratish →",
  secondaryCtaLabel: "Qanday ishlaydi ↓",
  trailerLabel: "499 000 so‘mdan · 7–10 kun",
};

const DEFAULT_COPY_RU: typeof DEFAULT_COPY_EN = {
  imageAlt: "Ребёнок читает, погружённый в историю, которую держит в руках",
  logoText: "Talimoon",
  kicker: "ИМЕННАЯ ИСТОРИЯ",
  headline: "Это не просто книга с именем Вашего ребёнка на обложке.",
  follow: "Это история, в которой он живёт.",
  subhead:
    "Облик Вашего ребёнка, его характер, увлечения и тот смысл, который Вы хотите донести до его сердца: всё это заключено в истории, созданной только для него.",
  primaryCtaLabel: "Создать историю моего ребёнка →",
  secondaryCtaLabel: "Как это работает ↓",
  trailerLabel: "От 499 000 сум · 7–10 дней",
};

export default function TalimoonHero({
  imageSrc = DEFAULT_HERO_IMAGE_SRC,
  imageAlt,
  showNav = false,
  logoText,
  navLinks,
  kicker,
  headline,
  follow,
  subhead,
  primaryCtaLabel,
  primaryCtaHref = "#pricing",
  secondaryCtaLabel,
  secondaryCtaHref = "#how-it-works",
  trailerLabel,
}: TalimoonHeroProps) {
  const [errored, setErrored] = useState(false);
  const t = useT(DEFAULT_COPY_EN, DEFAULT_COPY_UZ, DEFAULT_COPY_RU);
  const defaultNavLinks = useT(defaultNavLinksEn, defaultNavLinksUz, defaultNavLinksRu);
  const sectionLabel = useT("Hero", "Bosh banner", "Главный баннер");

  imageAlt ??= t.imageAlt;
  logoText ??= t.logoText;
  navLinks ??= defaultNavLinks;
  kicker ??= t.kicker;
  headline ??= t.headline;
  follow ??= t.follow;
  subhead ??= t.subhead;
  primaryCtaLabel ??= t.primaryCtaLabel;
  secondaryCtaLabel ??= t.secondaryCtaLabel;
  trailerLabel ??= t.trailerLabel;

  return (
    <section className="tm-hero" aria-label={sectionLabel}>
      <style>{`
        .tm-hero {
          --surface-warm-100: #F7F2EA;
          --surface-warm-200: #EFE7DA;
          --text-primary: #2A241D;
          --text-secondary: rgba(42,36,29,0.85);
          --text-tertiary: rgba(42,36,29,0.65);
          --text-on-image: #F7F2EA;
          --accent-primary: #BA8450;
          --accent-primary-hover: #9C7A47;
          position: relative;
          height: calc(100svh - 80px);
          max-height: 760px;
          min-height: 620px;
          width: 100%;
          overflow: hidden;
          background: var(--surface-warm-100);
          display: flex;
          align-items: center;
          font-family: 'Work Sans', system-ui, sans-serif;
          color: var(--text-primary);
        }
        .tm-hero *{ box-sizing: border-box; }
        .tm-hero a{ color: inherit; text-decoration: none; }

        /* ---------- Image zone ---------- */
        .tm-hero__image-zone{
          position: absolute;
          left: 0;
          top: 0;
          width: 55%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
        }
        /* This box now CONTAINS a real <Image> instead of being a CSS
           background box. Position/size/mask/filter behave identically
           whether they're painting a background-image or a child <img>. */
        .tm-hero__photo{
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: saturate(0.92) contrast(0.97);
          /* Keep the photograph solid to the lower edge. A bottom mask
             created a pale band that looked like unused hero space. */
        }
        /* Warm placeholder — visible while loading, and as the graceful
           fallback if the image fails to load. */
        .tm-hero__photo-fallback{
          position: absolute;
          inset: 0;
          background: var(--surface-warm-200);
        }
        .tm-hero__photo-glow{
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 32% 36%, var(--accent-primary) 0%, transparent 55%);
          opacity: 0.10;
        }
        .tm-hero__photo-icon{
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          opacity: 0.10;
        }
        /* The actual photo — visible by default, with a soft CSS fade-in.
           (No JS onLoad opacity gate: it can miss for a cached image and
           leave the hero blank.) */
        .tm-hero__photo-img{
          opacity: 1;
          animation: tm-hero-photo-in 700ms ease both;
        }
        @keyframes tm-hero-photo-in{ from{ opacity: 0; } to{ opacity: 1; } }
        @media (prefers-reduced-motion: reduce){
          .tm-hero__photo-img{ animation: none; }
        }
        .tm-hero__living-story{
          position: absolute;
          width: 220px;
          height: 60px;
          left: 38%;
          top: 47%;
          background: radial-gradient(ellipse 100% 100% at 30% 50%,
            rgba(247, 214, 165, 0.16) 0%,
            rgba(247, 214, 165, 0.09) 35%,
            transparent 72%);
          transform: rotate(-8deg);
          pointer-events: none;
          z-index: 3;
          filter: blur(6px);
        }
        /* Right / interior edge — narrow, soft, multi-stop transition into
           the shared background. */
        .tm-hero__image-zone::after{
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to right,
            transparent 0%,
            transparent 72%,
            rgba(247,242,234,0.05) 78%,
            rgba(247,242,234,0.14) 83%,
            rgba(247,242,234,0.30) 87%,
            rgba(247,242,234,0.52) 91%,
            rgba(247,242,234,0.76) 94%,
            rgba(247,242,234,0.94) 97%,
            var(--surface-warm-100) 100%
          );
        }

        /* ---------- Content zone ---------- */
        .tm-hero__content{
          position: relative;
          z-index: 4;
          margin-left: 55%;
          width: 45%;
          padding: 0 64px 0 40px;
        }
        .tm-hero__kicker{
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin: 0 0 12px 0;
        }
        .tm-hero__headline{
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 500;
          font-size: clamp(2rem, 2.9vw, 2.9rem);
          line-height: 1.16;
          letter-spacing: -0.015em;
          max-width: 18ch;
          margin: 0 0 18px 0;
        }
        .tm-hero__follow{
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 500;
          font-size: clamp(1.15rem, 1.5vw, 1.45rem);
          line-height: 1.3;
          color: var(--text-primary);
          margin: 0 0 20px 0;
          max-width: 22ch;
        }
        .tm-hero__subhead{
          font-size: 16px;
          line-height: 1.62;
          max-width: 42ch;
          color: var(--text-secondary);
          margin: 0 0 30px 0;
        }
        .tm-hero__cta-group{ display: flex; align-items: center; gap: 24px; }
        .tm-hero__trailer{
          margin: 20px 0 0 0;
          font-size: 13px;
          letter-spacing: 0.02em;
          color: var(--text-tertiary);
        }
        .tm-hero__cta-primary{
          display: inline-flex;
          align-items: center;
          height: 56px;
          padding: 16px 32px;
          border-radius: 4px;
          background: var(--accent-primary);
          color: #FBF6EE;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: background-color 200ms ease-out;
        }
        .tm-hero__cta-primary:hover{ background: var(--accent-primary-hover); }
        .tm-hero__cta-primary:focus-visible{ outline: 2px solid var(--text-primary); outline-offset: 2px; }
        .tm-hero__cta-secondary{
          font-size: 15px;
          color: rgba(42,36,29,0.8);
          border-bottom: 1px solid rgba(42,36,29,0.35);
          padding-bottom: 2px;
        }
        .tm-hero__cta-secondary:focus-visible{ outline: 2px solid var(--text-primary); outline-offset: 2px; }

        /* ---------- Navbar — no flat box; a soft, localized glow only where needed ---------- */
        .tm-hero__nav{
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 80px;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
        }
        .tm-hero__nav::before{
          content: "";
          position: absolute;
          inset: 0;
          height: 150px;
          background: radial-gradient(
            ellipse 62% 100% at 14% 0%,
            rgba(24,17,10,0.34) 0%,
            rgba(24,17,10,0.22) 32%,
            rgba(24,17,10,0.10) 55%,
            transparent 78%
          );
          pointer-events: none;
          z-index: -1;
        }
        .tm-hero__logo{
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 500;
          font-size: 20px;
          color: var(--text-on-image);
        }
        .tm-hero__nav-links{ display: flex; gap: 36px; font-size: 14px; font-weight: 500; }
        .tm-hero__nav-links a{ opacity: 0.82; transition: opacity 150ms ease-out; }
        .tm-hero__nav-links a:hover{ opacity: 1; }
        .tm-hero__nav-links a:focus-visible{ outline: 2px solid var(--text-primary); outline-offset: 3px; }

        /* ---------- Motion ---------- */
        .tm-reveal{
          opacity: 0;
          transform: translateY(8px);
          animation: tm-reveal 500ms cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .tm-reveal--d1{ animation-delay: 80ms; }
        .tm-reveal--d2{ animation-delay: 160ms; }
        .tm-reveal--d3{ animation-delay: 240ms; }
        .tm-reveal--d4{ animation-delay: 320ms; }
        @keyframes tm-reveal{ to{ opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce){
          .tm-reveal{ animation: none; opacity: 1; transform: none; }
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 1439px) and (min-width: 1024px){
          .tm-hero__image-zone{ width: 58%; }
          .tm-hero__content{ margin-left: 58%; width: 42%; }
        }
        @media (max-width: 1023px){
          .tm-hero{ flex-direction: column; height: auto; min-height: 0; max-height: none; padding-top: 64px; }
          .tm-hero__nav{ position: relative; height: 64px; }
          .tm-hero__nav::before{ background: none; }
          .tm-hero__logo{ color: var(--text-primary); }
          .tm-hero__image-zone{ position: relative; width: 100%; height: 60vh; top: 0; left: 0; }
          .tm-hero__image-zone::after{ background: none; }
          .tm-hero__content{ margin-left: 0; width: 100%; padding: 48px 24px 64px; }
          .tm-hero__headline{ max-width: 16ch; }
          .tm-hero__subhead{ max-width: none; }
        }
        @media (max-width: 640px){
          .tm-hero__headline{ font-size: clamp(1.75rem, 7vw, 2.25rem); }
          .tm-hero__cta-group{ flex-direction: column; align-items: flex-start; gap: 16px; }
          .tm-hero__cta-primary{ width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="tm-hero__image-zone" aria-hidden="true">
        <div className="tm-hero__photo">
          {/* Warm placeholder + glow + icon — visible during load and as
              the fallback if the image errors. */}
          <div className="tm-hero__photo-fallback" />
          <div className="tm-hero__photo-glow" />
          <div className="tm-hero__photo-icon">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="64"
              height="64"
            >
              <path d="M32 14c-6-5-15-6-22-3v34c7-3 16-2 22 3 6-5 15-6 22-3V11c-7-3-16-2-22 3z" />
              <path d="M32 14v34" />
            </svg>
          </div>

          {!errored && (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="tm-hero__photo-img"
              style={{ objectFit: "cover", objectPosition: "28% center" }}
              onError={() => setErrored(true)}
            />
          )}
        </div>
        <div className="tm-hero__living-story" />
      </div>

      {showNav && (
        <nav className="tm-hero__nav" aria-label="Primary">
          <div className="tm-hero__logo">{logoText}</div>
          <div className="tm-hero__nav-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="tm-hero__content">
        <p className="tm-hero__kicker tm-reveal tm-reveal--d1">{kicker}</p>
        <h1 className="tm-hero__headline tm-reveal tm-reveal--d2">{headline}</h1>
        {follow && <p className="tm-hero__follow tm-reveal tm-reveal--d2">{follow}</p>}
        <p className="tm-hero__subhead tm-reveal tm-reveal--d3">{subhead}</p>
        <div className="tm-hero__cta-group tm-reveal tm-reveal--d4">
          <a className="tm-hero__cta-primary" href={primaryCtaHref}>
            {primaryCtaLabel}
          </a>
          <a className="tm-hero__cta-secondary" href={secondaryCtaHref}>
            {secondaryCtaLabel}
          </a>
        </div>
        {trailerLabel && <p className="tm-hero__trailer tm-reveal tm-reveal--d4">{trailerLabel}</p>}
      </div>
    </section>
  );
}
