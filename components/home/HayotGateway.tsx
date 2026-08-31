'use client';

/**
 * HOME — HAYOT / JOURNEY GATEWAY  ("the parent page").
 * ----------------------------------------------------------------
 * Sits immediately after OUR PRODUCTS. Where the product sections
 * speak to (and about) the child, this one changes register: a
 * premium adult editorial spread that tells the parent, quietly,
 * "there is a page here for you too", and invites them to READ and
 * EXPLORE — never a commercial CTA.
 *
 * One sophisticated spread, not three cards:
 *   LEFT  (~44%) — HAYOT eyebrow · a mature serif headline · a
 *                  supporting paragraph · a magazine-style contents
 *                  index of the three worlds (plain text, hairlines,
 *                  small gold numerals — NOT buttons) · one editorial
 *                  link into /journey.
 *   RIGHT (~56%) — a slow-turning triangular prism: three faces, one
 *                  per Journey world, each a warm real moment. It
 *                  holds on a face, turns, holds on the next — an
 *                  editorial display, not a spin. A tiny sideways note
 *                  anchors its leading edge.
 *
 * MEDIA: no fake TALIMOON event is invented and no Journey content
 * is pulled in (this pass is not dynamic). Each face is a refined,
 * production-ready placeholder — warm paper, subtle texture, an
 * editorial crop frame with a hairline — until licensed lifestyle
 * images are supplied via the `HAYOT_FACES` slots.
 */

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { toLocale, worldName, type Locale } from '@/lib/journey/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ── House tokens (existing TALIMOON language) ──────────────────────
const DISPLAY =
  "var(--font-cormorant-garamond), 'Cormorant Garamond', Georgia, serif";
const BODY = "var(--font-manrope), 'Manrope', system-ui, -apple-system, sans-serif";
const PAPER = '#F7F2EA'; // warm editorial paper — a subtle shift from the cream sections
const NAVY = '#1C2A3A';
const NAVY_70 = 'rgba(28,42,58,0.70)';
const GOLD = '#B8935B';
const HAIRLINE = 'rgba(28,42,58,0.14)';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FaceImage = { src: string; alt: string } | null;

/**
 * The three editorial image slots — one per face of the slowly
 * turning triangular prism, in the same order as the contents index:
 *   [0] TALIMOON HAYOTI   [1] OTA-ONALAR UCHUN   [2] ODATLAR VA ILM
 * Set a slot (a licensed lifestyle image, meaningful alt) and that
 * face fills — no other change. `null` → the prepared editorial
 * placeholder on that face.
 */
const HAYOT_FACES: [FaceImage, FaceImage, FaceImage] = [
  {
    src: "/images/home/hayot-gateway/talimoon-hayoti.webp",
    alt: "TALIMOON hayotidan bir lavha",
  },
  null,
  null,
];

// ── Copy — all four site languages authored ────────────────────────
type Copy = {
  eyebrow: string;
  headline: string;
  body: string;
  link: string;
  note: string; // the tiny vertical editorial note
};

const COPY: Record<Locale, Copy> = {
  uz: {
    eyebrow: 'HAYOT',
    headline: 'Siz uchun ham bir sahifa bor.',
    body: 'TALIMOON hayotidan yangiliklar, farzand tarbiyasi va bola psixologiyasi haqida ishonchli manbalarga tayangan foydali fikrlar, shuningdek kundalik odatlar ortidagi ilm va tadqiqotlar.',
    link: 'Hayotga kirish',
    note: 'O‘qing · O‘ylang · Kashf eting',
  },
  en: {
    eyebrow: 'HAYOT',
    headline: 'A page for you, too.',
    body: 'TALIMOON news, useful ideas on parenting and child psychology grounded in trustworthy sources, and explorations of the science and research behind everyday habits.',
    link: 'Enter Journey',
    note: 'Read · Think · Discover',
  },
  ru: {
    eyebrow: 'HAYOT',
    headline: 'Страница и для вас.',
    body: 'Новости из жизни TALIMOON, полезные мысли о воспитании и детской психологии с опорой на надёжные источники, а также разборы науки и исследований, стоящих за повседневными привычками.',
    link: 'Войти в Journey',
    note: 'Читайте · Думайте · Открывайте',
  },
  ar: {
    eyebrow: 'HAYOT',
    headline: 'صفحةٌ لك أنت أيضًا.',
    body: 'أخبار من حياة TALIMOON، وأفكار مفيدة حول التربية وعلم نفس الطفل مستندة إلى مصادر موثوقة، إضافةً إلى استكشاف العلم والأبحاث وراء عاداتنا اليومية.',
    link: 'ادخل إلى Journey',
    note: 'اقرأ · تأمّل · اكتشف',
  },
};

const WORLD_KEYS = ['talimoon-life', 'parents', 'wisdom-science'] as const;

/** The shared editorial crop marks — an inset hairline + four gold
 *  corner ticks. Used on the card's placeholder front and its back. */
function CropFrame() {
  return (
    <>
      <span
        className="absolute inset-5 md:inset-7"
        style={{ boxShadow: `inset 0 0 0 1px ${HAIRLINE}` }}
      />
      {(
        [
          'left-5 top-5 border-l border-t',
          'right-5 top-5 border-r border-t',
          'left-5 bottom-5 border-l border-b',
          'right-5 bottom-5 border-r border-b',
        ] as const
      ).map((p) => (
        <span
          key={p}
          className={`absolute h-3 w-3 md:h-3.5 md:w-3.5 ${p}`}
          style={{ borderColor: 'rgba(184,147,91,0.5)' }}
        />
      ))}
    </>
  );
}

const GRAIN =
  'repeating-linear-gradient(135deg, rgba(28,42,58,0.022) 0 1px, transparent 1px 8px), radial-gradient(120% 90% at 78% 18%, rgba(184,147,91,0.06), transparent 60%)';

// ── section ───────────────────────────────────────────────────────
export function HayotGateway() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const locale = toLocale(language);
  const isRTL = locale === 'ar';
  const c = COPY[locale] ?? COPY.en;

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.35 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  const leftTop = (
    <div className="min-w-0">
      <motion.p
        {...rise(0)}
        className="text-[12px] uppercase"
        style={{
          fontFamily: BODY,
          fontWeight: 600,
          letterSpacing: '0.32em',
          color: GOLD,
        }}
      >
        {c.eyebrow}
      </motion.p>

      <motion.h2
        id="hayot-gateway-heading"
        {...rise(0.06)}
        className="mt-6 text-[30px] sm:text-[34px] md:text-[38px] lg:text-[42px]"
        style={{
          fontFamily: DISPLAY,
          fontWeight: 600,
          color: NAVY,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
        }}
      >
        {c.headline}
      </motion.h2>

      <motion.p
        {...rise(0.14)}
        className="mt-5 max-w-[44ch] text-[15px] md:text-[16px]"
        style={{ fontFamily: BODY, color: NAVY_70, lineHeight: 1.75 }}
      >
        {c.body}
      </motion.p>
    </div>
  );

  const indexList = (
    <motion.ul
      {...rise(0.2)}
      className="border-t"
      style={{ borderColor: HAIRLINE }}
    >
      {WORLD_KEYS.map((w, i) => (
        <li key={w} className="border-b" style={{ borderColor: HAIRLINE }}>
          <span className="flex items-baseline gap-4 py-3.5">
            <span
              aria-hidden="true"
              className="text-[12px]"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: GOLD,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="text-[13px] uppercase"
              style={{
                fontFamily: BODY,
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: NAVY,
              }}
            >
              {worldName(w, locale)}
            </span>
          </span>
        </li>
      ))}
    </motion.ul>
  );

  const enterLink = (
    <motion.div {...rise(0.28)} className="mt-8">
      <Link
        href="/journey"
        className="group inline-flex items-center gap-3 rounded-[2px] py-1 text-[15px] outline-none transition-opacity duration-300 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#B8935B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F2EA]"
        style={{ fontFamily: BODY, fontWeight: 600, color: NAVY }}
      >
        <span
          aria-hidden="true"
          className="block h-px w-8 motion-safe:transition-[width] motion-safe:duration-500 motion-safe:group-hover:w-12"
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
    </motion.div>
  );

  // The editorial image is a slow, continuously-turning triangular
  // prism — three designed faces, one per Journey world (a large
  // ghosted folio numeral + the world name, over the photo once one
  // is supplied). It always reads as a solid object turning in space:
  // strong-ish perspective, a grounding floor shadow, a soft top
  // light on each face. Frozen on the first face under
  // prefers-reduced-motion. Inset from the column edge so a full turn
  // never overflows.
  const faceBase =
    'absolute inset-0 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]';

  const imageFrame = (
    <motion.div {...rise(0.1)} className="relative min-w-0">
      <Link
        href="/journey"
        tabIndex={-1}
        aria-hidden="true"
        className="relative block [perspective:1500px] [perspective-origin:50%_40%]"
      >
        {/* layout box — fixed footprint, no CLS */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[3/2] lg:aspect-auto lg:h-[420px]">
          {/* grounding floor shadow — gives the prism weight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-14px] left-1/2 h-7 w-[62%] -translate-x-1/2 lg:left-[57%]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(28,42,58,0.20), transparent 72%)',
              filter: 'blur(7px)',
            }}
          />

          {/* the rotating prism, inset from the right edge on desktop */}
          <div
            data-hg-card
            className={`absolute inset-0 [--hg-r:112px] [transform-style:preserve-3d] md:[--hg-r:152px] lg:left-auto lg:w-[86%] ${
              reduced
                ? ''
                : 'motion-safe:animate-[hg-prism-turn_20s_linear_infinite]'
            }`}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
            {HAYOT_FACES.map((img, k) => {
              const num = String(k + 1).padStart(2, '0');
              const label = worldName(WORLD_KEYS[k], locale);
              return (
                <div
                  key={k}
                  className={faceBase}
                  style={{
                    backgroundColor: PAPER,
                    transform: `rotateY(${k * 120}deg) translateZ(var(--hg-r))`,
                  }}
                >
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ backgroundImage: GRAIN }}
                    />
                  )}

                  {/* soft directional light so each face has a surface */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(155deg, rgba(255,255,255,0.34), rgba(255,255,255,0) 34%, rgba(28,42,58,0) 68%, rgba(28,42,58,0.10))',
                    }}
                  />
                  {img ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(18,26,36,0.62), transparent)',
                      }}
                    />
                  ) : null}

                  {/* big ghosted folio numeral */}
                  <span
                    aria-hidden="true"
                    className="absolute start-6 top-4 select-none text-[86px] leading-none sm:text-[118px] lg:top-6 lg:text-[130px]"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      color: img
                        ? 'rgba(255,255,255,0.24)'
                        : 'rgba(184,147,91,0.18)',
                    }}
                  >
                    {num}
                  </span>

                  {/* world name, lower-left */}
                  <span
                    className="absolute bottom-6 start-6 end-6 block text-[20px] sm:text-[24px] lg:text-[26px]"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      lineHeight: 1.14,
                      letterSpacing: '-0.01em',
                      color: img ? '#FBF7EF' : NAVY,
                      textShadow: img ? '0 1px 12px rgba(18,26,36,0.5)' : 'none',
                    }}
                  >
                    {label}
                  </span>

                  <CropFrame />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(184,147,91,0.28)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* the tiny sideways editorial note — a fixed anchor beside the
            turning prism. LTR / md+ only. */}
        {!isRTL ? (
          <span
            aria-hidden="true"
            className="absolute start-3.5 top-7 z-10 hidden select-none md:block"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'sideways',
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(184,147,91,0.9)',
              textShadow: '0 1px 10px rgba(247,242,234,0.65)',
            }}
          >
            {c.note}
          </span>
        ) : null}
      </Link>
    </motion.div>
  );

  return (
    <section
      dir={isRTL ? 'rtl' : undefined}
      aria-labelledby="hayot-gateway-heading"
      className="relative w-full overflow-hidden px-6 py-16 md:px-10 md:py-[72px] lg:px-16 lg:py-[60px]"
      style={{ backgroundColor: PAPER, color: NAVY }}
    >
      {/* the transition from OUR PRODUCTS — a soft dissolve from the
          cream sections into this warmer paper, plus a faint gold
          section rule. An intentional visual pause, not a hard cut. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            'linear-gradient(to bottom, var(--surface-base,#F7F3EC), transparent)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 md:inset-x-10 lg:inset-x-16"
        style={{ height: 1, backgroundColor: 'rgba(184,147,91,0.28)' }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
        style={{
          background:
            'linear-gradient(to top, var(--surface-base,#F7F3EC), transparent)',
        }}
      />

      <div className="group relative mx-auto grid w-full max-w-[1200px] gap-y-8 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-x-14 xl:gap-x-20">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">{leftTop}</div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          {imageFrame}
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          {indexList}
          {enterLink}
        </div>
      </div>
    </section>
  );
}

export default HayotGateway;
