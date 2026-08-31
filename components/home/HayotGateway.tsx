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

// ── The 3-panel editorial carousel — geometry lives in globals.css
//    (`[data-hg-carousel]` custom properties + the `hg-orbit` loop).
//    These transform strings are the three resting poses. They double
//    as the prefers-reduced-motion static composition AND as the loop's
//    exact t=0 pose for each panel, so enabling motion never jumps.
const POSE_LEFT =
  'translateX(-50%) translateX(calc(-1 * var(--hg-side-x))) translateZ(var(--hg-z-back)) rotateY(var(--hg-ry)) scale(var(--hg-side-scale))';
const POSE_RIGHT =
  'translateX(-50%) translateX(var(--hg-side-x)) translateZ(var(--hg-z-back)) rotateY(calc(-1 * var(--hg-ry))) scale(var(--hg-side-scale))';
const POSE_CENTER =
  'translateX(-50%) translateZ(var(--hg-z-front)) rotateY(0deg) scale(1)';

/** State 1 (spec): panel 0 → LEFT · panel 1 → RIGHT · panel 2 → CENTRE.
 *  Delays phase each panel by a third of the 18s loop so all three move
 *  together, one becoming the dominant centre in turn. */
const PANEL_POSE = [
  { transform: POSE_LEFT, opacity: 'var(--hg-side-op)', zIndex: 20 },
  { transform: POSE_RIGHT, opacity: 'var(--hg-side-op)', zIndex: 10 },
  { transform: POSE_CENTER, opacity: 1, zIndex: 30 },
] as const;
const PANEL_DELAY = ['0s', '-12s', '-6s'] as const;
const ORBIT_EASE = 'cubic-bezier(0.66, 0, 0.24, 1)';

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
  {
    src: "/images/home/hayot-gateway/ota-onalar-uchun.webp",
    alt: "Ota-onalar uchun materiallardan bir lavha",
  },
  {
    src: "/images/home/hayot-gateway/odatlar-va-ilm.webp",
    alt: "Odatlar va ilm bo‘limidan bir lavha",
  },
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

  // The editorial image area is a 3-panel 3D carousel: one dominant,
  // almost front-facing CENTRE panel, with two narrower, gently angled
  // side panels receded behind it. The camera never moves — the panels
  // themselves orbit LEFT → CENTRE → RIGHT → LEFT forever, each taking
  // its turn as the featured centre. Geometry + the slow loop live in
  // globals.css (`[data-hg-carousel]` vars + `hg-orbit`). Under
  // prefers-reduced-motion the loop is off and each panel holds its
  // inline base pose — a stable premium composition. Autoplay pauses
  // on a genuine hover/focus.
  const centerAtRest = 2; // panel 2 (ODATLAR VA ILM) is the resting centre

  const imageFrame = (
    <motion.div
      {...rise(0.1)}
      data-hg-carousel
      className="relative min-w-0"
    >
      <Link
        href="/journey"
        tabIndex={-1}
        aria-hidden="true"
        className="relative block [perspective:1450px] [perspective-origin:50%_45%]"
      >
        {/* layout box — fixed footprint, no CLS */}
        <div className="relative aspect-[4/5] w-full [transform-style:preserve-3d] sm:aspect-[3/2] lg:aspect-auto lg:h-[420px]">
          {/* one very soft, diffused shadow beneath the composition */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[10%] bottom-[-10px] h-9"
            style={{
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(28,42,58,0.13), transparent 72%)',
              filter: 'blur(11px)',
            }}
          />

          {/* the three panels, in a shared 3D space */}
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {HAYOT_FACES.map((img, k) => {
              const num = String(k + 1).padStart(2, '0');
              const label = worldName(WORLD_KEYS[k], locale);
              const pose = PANEL_POSE[k];
              return (
                <div
                  key={k}
                  data-hg-panel
                  className="absolute inset-y-0 left-1/2 overflow-hidden rounded-[2px] will-change-transform [backface-visibility:hidden]"
                  style={{
                    width: 'var(--hg-panel-w)',
                    backgroundColor: PAPER,
                    transformOrigin: '50% 50%',
                    transform: pose.transform,
                    opacity: pose.opacity,
                    zIndex: pose.zIndex,
                    animation: `hg-orbit 18s ${ORBIT_EASE} ${PANEL_DELAY[k]} infinite`,
                  }}
                >
                  {img ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 34vw, (min-width: 640px) 56vw, 80vw"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ backgroundImage: GRAIN }}
                    />
                  )}

                  {/* soft top light so each panel has a surface */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(155deg, rgba(255,255,255,0.30), rgba(255,255,255,0) 32%, rgba(28,42,58,0) 66%, rgba(28,42,58,0.10))',
                    }}
                  />
                  {/* a restrained bottom tone, only when an image is set */}
                  {img ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(18,26,36,0.55), transparent)',
                      }}
                    />
                  ) : null}

                  {/* ghosted folio numeral */}
                  <span
                    aria-hidden="true"
                    className="absolute start-5 top-3 select-none text-[70px] leading-none sm:text-[96px] lg:top-4 lg:text-[112px]"
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 600,
                      color: img
                        ? 'rgba(255,255,255,0.22)'
                        : 'rgba(184,147,91,0.18)',
                    }}
                  >
                    {num}
                  </span>

                  {/* world name, lower-left */}
                  <span
                    className="absolute bottom-5 start-5 end-5 block text-[17px] sm:text-[21px] lg:text-[24px]"
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
                  {/* the subtle ~1px warm gold-tinted frame */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[2px]"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(184,147,91,0.30)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* the tiny sideways editorial note — a fixed anchor beside the
            gallery. LTR / md+ only. */}
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

      {/* three extremely subtle indicator dots, beneath the gallery */}
      <div
        aria-hidden="true"
        className="mt-6 flex items-center justify-center gap-[7px] lg:mt-7"
      >
        {HAYOT_FACES.map((_, k) => (
          <span
            key={k}
            data-hg-dot
            className="h-[5px] w-[5px] rounded-full"
            style={{
              backgroundColor:
                k === centerAtRest ? GOLD : 'rgba(28,42,58,0.22)',
              animation: `hg-dot 18s ${ORBIT_EASE} ${PANEL_DELAY[k]} infinite`,
            }}
          />
        ))}
      </div>
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
