// FILE: Hero.tsx
// To‘liq tuzatilgan Talimoon Hero komponenti — barcha muammolar tuzatilgan.

'use client';

import Image from 'next/image';
import { useState } from 'react';

// ============================================================
// HeroImage komponenti (to‘liq tuzatilgan)
// ============================================================

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

function HeroImage({
  src,
  alt,
  className = '',
  priority = false,
}: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        maskImage:
          'linear-gradient(to bottom, black 0%, black 95.5%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 95.5%, transparent 100%)',
      }}
    >
      {/* Placeholder */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--surface-warm-200,#EFE7DA)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_32%_36%,var(--accent-primary,#B5764B)_0%,transparent_55%)] opacity-[0.10]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-16 w-16 text-[var(--text-primary,#2A241D)] opacity-[0.10]"
        >
          <path d="M32 14c-6-5-15-6-22-3v34c7-3 16-2 22 3 6-5 15-6 22-3V11c-7-3-16-2-22 3z" />
          <path d="M32 14v34" />
        </svg>
      </div>

      {!errored && (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={100}
          sizes="(min-width:1024px) 55vw,100vw"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`object-cover object-[28%_center] transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: 'saturate(0.92) contrast(0.97)',
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// TalimoonHero komponenti (to‘liq tuzatilgan)
// ============================================================

export interface TalimoonHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  showNav?: boolean;
  logoText?: string;
  navLinks?: { label: string; href: string }[];
  kicker?: string;
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

const defaultNavLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Craftsmanship', href: '#craftsmanship' },
  { label: 'Collections', href: '#collections' },
  { label: 'Gifting', href: '#gifting' },
];

export default function TalimoonHero({
  imageSrc,
  imageAlt = 'A child reading, softly connected to the story in their hands',
  showNav = false,
  logoText = 'Talimoon',
  navLinks = defaultNavLinks,
  kicker = 'Personalized storybooks',
  headline = 'A story where your child is the hero.',
  subhead = 'Personalized books made with the care of a fine publisher - for families who want more than a name dropped into a template.',
  primaryCtaLabel = 'Begin the Story',
  primaryCtaHref = '#start',
  secondaryCtaLabel = 'See how it works',
  secondaryCtaHref = '#how-it-works',
}: TalimoonHeroProps) {
  return (
    <section className="tm-hero" aria-label="Hero">
      <style>{`
        .tm-hero {
          --surface-warm-100: #F7F2EA;
          --text-primary: #2A241D;
          --text-secondary: rgba(42,36,29,0.85);
          --text-tertiary: rgba(42,36,29,0.65);
          --text-on-image: #F7F2EA;
          --accent-primary: #BA8450;
          --accent-primary-hover: #A06F40;
          position: relative;
          min-height: min(92vh, 960px);
          height: 100vh;
          max-height: 820px;
          min-height: 680px;
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
        /* HeroImage o'zi mask va filterni boshqaradi, shuning uchun .tm-hero__photo uslubi bo'sh */
        .tm-hero__photo {
          /* barcha uslublar HeroImage ichida */
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
        .tm-hero__image-zone::after{
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to right,
            transparent 0%,
            transparent 60%,
            rgba(247,242,234,0.04) 70%,
            rgba(247,242,234,0.10) 76%,
            rgba(247,242,234,0.18) 81%,
            rgba(247,242,234,0.28) 85%,
            rgba(247,242,234,0.42) 88%,
            rgba(247,242,234,0.60) 90%,
            rgba(247,242,234,0.80) 92%,
            var(--surface-warm-100) 96%,
            var(--surface-warm-100) 100%
          );
        }
        .tm-hero__image-zone::before{
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            transparent 90%,
            rgba(247,242,234,0.10) 93%,
            rgba(247,242,234,0.35) 95%,
            rgba(247,242,234,0.68) 96.5%,
            var(--surface-warm-100) 98%,
            var(--surface-warm-100) 100%
          );
          pointer-events: none;
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
          font-size: clamp(2.75rem, 4vw, 4rem);
          line-height: 1.15;
          letter-spacing: -0.01em;
          max-width: 12ch;
          margin: 0 0 32px 0;
        }
        .tm-hero__subhead{
          font-size: 18px;
          line-height: 1.65;
          max-width: 38ch;
          color: var(--text-secondary);
          margin: 0 0 48px 0;
        }
        .tm-hero__cta-group{ display: flex; align-items: center; gap: 24px; }
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

        /* ---------- Navbar ---------- */
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
          /* HeroImage o'zi maskni boshqaradi, mobile uchun maskni o'zgartirish kerak bo'lsa, HeroImage ga prop qo'shish kerak, hozircha default ishlaydi */
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
        <HeroImage
          src={imageSrc || '/images/products/personalized-books/hero/hero-v13.png'}
          alt={imageAlt}
          priority={true}
          className="tm-hero__photo"
        />
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
        <p className="tm-hero__subhead tm-reveal tm-reveal--d3">{subhead}</p>
        <div className="tm-hero__cta-group tm-reveal tm-reveal--d4">
          <a className="tm-hero__cta-primary" href={primaryCtaHref}>
            {primaryCtaLabel}
          </a>
          <a className="tm-hero__cta-secondary" href={secondaryCtaHref}>
            {secondaryCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}