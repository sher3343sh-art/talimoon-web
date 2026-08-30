'use client';

/**
 * HOME — HAYOT / JOURNEY GATEWAY.
 * ----------------------------------------------------------------
 * A "living editorial window" on the Home page: while the rest of
 * Home introduces what TALIMOON *creates*, this section opens a
 * window into what TALIMOON is *doing, thinking and sharing with
 * parents* — the three worlds of HAYOT (/journey):
 *   · OTA-ONALAR UCHUN   — the human / emotional anchor (primary)
 *   · TALIMOON HAYOTI     — real moments (secondary)
 *   · ODATLAR VA ILM      — everyday habits + research (detail)
 *
 * It does NOT reproduce the Journey landing. One asymmetric
 * editorial spread: copy left, a cinematic three-fragment media
 * composition right. Editorial gateway, not a sales CTA.
 *
 * MEDIA: no fake TALIMOON photography is invented. Until real,
 * consent-cleared media is published in Journey, each fragment
 * renders a prepared editorial frame (warm paper, faint grain,
 * hairline gold inset, crop-mark ticks, a small navy mark). When
 * Journey has suitable media the frames fill themselves via the
 * Journey accessors — `getParentFeature()` (primary) and
 * `getWorldPreview()` (secondary / detail) — always through
 * `mediaPolicy()`, so unapproved child/family media is never shown.
 * No redesign is needed when media arrives.
 */

import { useMemo, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  getParentFeature,
  getWorldPreview,
  mediaPolicy,
  resolveEntryContent,
} from '@/lib/journey/content';
import {
  toLocale,
  worldName,
  type JourneyEntry,
  type Locale,
} from '@/lib/journey/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ── Palette (the HAYOT / Journey house tokens — existing TALIMOON
//    language, not a new one) ──────────────────────────────────────
const DISPLAY =
  "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif";
const BODY = "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif";
const CREAM_RAISED = '#FDFBF7';
const NAVY = '#1C2A3A';
const NAVY_64 = 'rgba(28,42,58,0.64)';
const NAVY_48 = 'rgba(28,42,58,0.48)';
const GOLD = '#B8935B';
const GOLD_FAINT = 'rgba(184,147,91,0.30)';
const FRAGMENT_SHADOW = '0 10px 28px -14px rgba(28,42,58,0.22)';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Copy — all four site languages authored ────────────────────────
type Copy = {
  eyebrow: string;
  headline: [string, string]; // two sentences, may sit on two lines
  body: string;
  link: string;
  latest: string;
};

const COPY: Record<Locale, Copy> = {
  uz: {
    eyebrow: 'HAYOT',
    headline: [
      'Bolalar uchun yaratilgan bir olam.',
      'Ota-onalar uchun davom etadigan suhbat.',
    ],
    body: 'TALIMOON hayotidan voqealar, farzand tarbiyasi haqida ishonchli manbalarga tayangan foydali fikrlar va kundalik odatlar ortidagi ilmiy tadqiqotlar.',
    link: 'Hayotni kashf eting',
    latest: "So‘nggi",
  },
  en: {
    eyebrow: 'HAYOT',
    headline: [
      'A world created for children.',
      'A conversation that continues with parents.',
    ],
    body: "Moments from TALIMOON's life, trustworthy thinking on raising children drawn from real sources, and the research behind our everyday habits.",
    link: 'Discover HAYOT',
    latest: 'Latest',
  },
  ru: {
    eyebrow: 'HAYOT',
    headline: [
      'Мир, созданный для детей.',
      'Разговор, который продолжается с родителями.',
    ],
    body: 'События из жизни TALIMOON, полезные мысли о воспитании детей с опорой на надёжные источники и исследования, стоящие за нашими повседневными привычками.',
    link: 'Открыть HAYOT',
    latest: 'Новое',
  },
  ar: {
    eyebrow: 'HAYOT',
    headline: ['عالمٌ صُنع للأطفال.', 'وحوارٌ يستمر مع الآباء.'],
    body: 'لحظات من حياة TALIMOON، وأفكار موثوقة حول تربية الأطفال مستندة إلى مصادر حقيقية، والأبحاث الكامنة وراء عاداتنا اليومية.',
    link: 'اكتشف HAYOT',
    latest: 'الأحدث',
  },
};

// ── entry → showable media (consent-respecting) ────────────────────
function slotMedia(entry: JourneyEntry | null, locale: Locale) {
  if (!entry) return null;
  if (!mediaPolicy(entry).showMedia) return null;
  const asset = entry.cover ?? entry.video?.poster ?? null;
  if (!asset || asset.src.trim() === '') return null;
  const { content } = resolveEntryContent(entry, locale);
  return { src: asset.src, alt: content.coverAlt ?? '' };
}

// ── prepared editorial frame ──────────────────────────────────────
function CornerTicks() {
  return (
    <>
      {(
        [
          'start-2 top-2 border-s border-t',
          'end-2 top-2 border-e border-t',
          'start-2 bottom-2 border-s border-b',
          'end-2 bottom-2 border-e border-b',
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute h-2.5 w-2.5 ${pos}`}
          style={{ borderColor: 'rgba(184,147,91,0.45)' }}
        />
      ))}
    </>
  );
}

function MediaFrame({
  media,
  ratioClass,
  sizes,
  markMuted,
}: {
  media: { src: string; alt: string } | null;
  ratioClass: string;
  sizes: string;
  markMuted?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${ratioClass}`}
      style={{ backgroundColor: CREAM_RAISED }}
    >
      {media ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          loading="lazy"
          sizes={sizes}
          className="object-cover motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(184,147,91,0.05) 0 1px, transparent 1px 9px)',
          }}
        >
          {/* small navy editorial mark */}
          <span className="relative block h-5 w-5">
            <span
              className="absolute start-0 top-1/2 h-px w-full -translate-y-1/2"
              style={{ backgroundColor: markMuted ? NAVY_48 : 'rgba(28,42,58,0.6)' }}
            />
            <span
              className="absolute start-1/2 top-0 h-full w-px -translate-x-1/2"
              style={{ backgroundColor: markMuted ? NAVY_48 : 'rgba(28,42,58,0.6)' }}
            />
          </span>
          <CornerTicks />
        </div>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: `inset 0 0 0 1px ${GOLD_FAINT}` }}
      />
    </div>
  );
}

function FragmentLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`mt-2 block text-[9px] uppercase ${className}`}
      style={{
        fontFamily: BODY,
        fontWeight: 600,
        letterSpacing: '0.2em',
        color: NAVY_48,
      }}
    >
      {children}
    </span>
  );
}

// ── section ───────────────────────────────────────────────────────
export function HayotGateway() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = toLocale(language);
  const isRTL = locale === 'ar';
  const c = COPY[locale] ?? COPY.en;

  const { primary, secondary, detail, hasReal } = useMemo(() => {
    const p = getParentFeature();
    const s = getWorldPreview('talimoon-life').primary;
    const d = getWorldPreview('wisdom-science').primary;
    return {
      primary: slotMedia(p, locale),
      secondary: slotMedia(s, locale),
      detail: slotMedia(d, locale),
      hasReal: Boolean(p || s || d),
    };
  }, [locale]);

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  const labels = {
    parents: worldName('parents', locale),
    life: worldName('talimoon-life', locale),
    wisdom: worldName('wisdom-science', locale),
  };

  return (
    <section
      dir={isRTL ? 'rtl' : undefined}
      aria-labelledby="hayot-gateway-heading"
      className="relative w-full overflow-hidden px-6 py-16 md:px-10 md:py-[72px] lg:px-16 lg:py-20"
      style={{ backgroundColor: CREAM_RAISED, color: NAVY }}
    >
      {/* seams — a whisper of flat raised-cream at both edges so the
          section meets the neighbouring cream sections as one field,
          not a hard band change */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16"
        style={{ background: `linear-gradient(to bottom, ${CREAM_RAISED}, transparent)` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
        style={{ background: `linear-gradient(to top, ${CREAM_RAISED}, transparent)` }}
      />

      <div className="group relative mx-auto grid w-full max-w-[1200px] items-center gap-y-10 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-x-16">
        {/* LEFT — editorial copy */}
        <div className="min-w-0">
          <motion.p
            {...rise(0)}
            className="text-[13px] uppercase"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              letterSpacing: '0.28em',
              color: GOLD,
            }}
          >
            {c.eyebrow}
          </motion.p>
          <motion.span
            {...rise(0.04)}
            aria-hidden="true"
            className="mt-5 block"
            style={{ width: 40, height: 1, backgroundColor: GOLD }}
          />

          <motion.h2
            id="hayot-gateway-heading"
            {...rise(0.08)}
            className="mt-7 text-[27px] sm:text-[31px] md:text-[35px] lg:text-[38px]"
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              color: NAVY,
              lineHeight: 1.16,
              letterSpacing: '-0.02em',
              textWrap: 'balance',
            }}
          >
            {c.headline[0]}
            <br />
            {c.headline[1]}
          </motion.h2>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-[46ch] text-[15px] md:text-[16px]"
            style={{ fontFamily: BODY, color: NAVY_64, lineHeight: 1.75 }}
          >
            {c.body}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex items-center gap-3">
            <Link
              href="/journey"
              className="group/link inline-flex items-center gap-2.5 rounded-[2px] py-1 text-[15px] outline-none transition-opacity duration-300 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#B8935B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FDFBF7]"
              style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
            >
              <span
                aria-hidden="true"
                className="block h-px w-7 motion-safe:transition-[width] motion-safe:duration-500 motion-safe:group-hover:w-11"
                style={{ backgroundColor: GOLD }}
              />
              <span>{c.link}</span>
              <span
                aria-hidden="true"
                className="rtl:-scale-x-100 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                style={{ color: GOLD }}
              >
                &rarr;
              </span>
            </Link>
            {hasReal ? (
              <span
                className="text-[10px] uppercase"
                style={{
                  fontFamily: BODY,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: NAVY_48,
                }}
              >
                <span aria-hidden="true" className="me-1.5" style={{ color: GOLD }}>
                  ·
                </span>
                {c.latest}
              </span>
            ) : null}
          </motion.div>
        </div>

        {/* RIGHT — three glimpses into one living world */}
        <motion.div {...rise(0.12)} className="relative min-w-0">
          <Link
            href="/journey"
            tabIndex={-1}
            aria-hidden="true"
            className="relative block"
          >
            {/* DOMINANT — the human moment (OTA-ONALAR UCHUN).
                Anchored to the RIGHT of the column so the two smaller
                fragments layer against it from the left / top and the
                whole spread leans away from the copy. */}
            <div className="w-full lg:ms-auto lg:w-[80%]">
              <MediaFrame
                media={primary}
                ratioClass="aspect-[1.35] lg:aspect-[1.62]"
                sizes="(max-width: 1024px) 92vw, 44vw"
              />
              <FragmentLabel className="lg:text-end">{labels.parents}</FragmentLabel>
            </div>

            {/* mobile: the two smaller fragments sit in a row below;
                desktop: they layer onto the dominant frame — one
                bottom-left (diagonal tension), one a thin strip top */}
            <div className="mt-3 grid grid-cols-2 gap-4 lg:mt-0 lg:block">
              {/* SECONDARY — a real TALIMOON moment (TALIMOON HAYOTI) */}
              <div className="lg:absolute lg:bottom-[-18px] lg:start-0 lg:z-10 lg:w-[33%]">
                <div className="p-[6px] lg:shadow-[var(--frag-shadow)]" style={{ backgroundColor: CREAM_RAISED, "--frag-shadow": FRAGMENT_SHADOW } as CSSProperties}>
                  <MediaFrame
                    media={secondary}
                    ratioClass="aspect-square lg:aspect-[0.8]"
                    sizes="(max-width: 1024px) 44vw, 15vw"
                    markMuted
                  />
                </div>
                <FragmentLabel className="lg:hidden">{labels.life}</FragmentLabel>
              </div>

              {/* DETAIL — a discovery fragment (ODATLAR VA ILM) */}
              <div className="lg:absolute lg:top-[-16px] lg:end-[11%] lg:z-10 lg:w-[15%]">
                <div className="p-[6px] lg:shadow-[var(--frag-shadow)]" style={{ backgroundColor: CREAM_RAISED, "--frag-shadow": FRAGMENT_SHADOW } as CSSProperties}>
                  <MediaFrame
                    media={detail}
                    ratioClass="aspect-square lg:aspect-[0.6]"
                    sizes="(max-width: 1024px) 44vw, 10vw"
                    markMuted
                  />
                </div>
                <FragmentLabel className="lg:hidden">{labels.wisdom}</FragmentLabel>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HayotGateway;
