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
 *   RIGHT (~56%) — ONE dominant photographic frame (a warm, real
 *                  parent–child moment) with a tiny vertical
 *                  editorial note along its edge.
 *
 * MEDIA: no fake TALIMOON event is invented and no Journey content
 * is pulled in (this pass is not dynamic). The frame is a refined,
 * production-ready placeholder — warm paper, subtle texture, an
 * editorial crop frame with a hairline — until a licensed lifestyle
 * image is supplied, at which point it just fills `HAYOT_IMAGE`.
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

/**
 * The one editorial image slot. Set this (a licensed parent–child
 * lifestyle image, with meaningful alt) and the frame fills — no
 * other change needed. `null` → the prepared editorial placeholder.
 */
const HAYOT_IMAGE = null as { src: string; alt: string } | null;

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

  const imageFrame = (
    <motion.div {...rise(0.1)} className="relative min-w-0">
      <Link
        href="/journey"
        tabIndex={-1}
        aria-hidden="true"
        className="group/img relative block"
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[3/2] lg:aspect-auto lg:h-[420px]"
          style={{ backgroundColor: PAPER }}
        >
          {HAYOT_IMAGE ? (
            <Image
              src={HAYOT_IMAGE.src}
              alt={HAYOT_IMAGE.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 92vw, 52vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.015]"
            />
          ) : (
            /* prepared editorial placeholder — warm paper + a whisper
               of grain + an inset crop frame. Never a grey/skeleton box. */
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgba(28,42,58,0.022) 0 1px, transparent 1px 8px), radial-gradient(120% 90% at 78% 18%, rgba(184,147,91,0.06), transparent 60%)',
              }}
            >
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
            </div>
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(184,147,91,0.22)' }}
          />
        </div>

        {/* the one memorable detail — a tiny vertical editorial note
            along the frame's leading edge. LTR / md+ only; kept out of
            the way so the section stays minimal. */}
        {!isRTL ? (
          <span
            aria-hidden="true"
            className="absolute start-3.5 top-7 hidden select-none md:block"
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
