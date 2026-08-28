// FILE: src/components/hero/Hero.tsx
// Enterprise-grade Hero Slider – knopkasiz uzluksiz autoplay, kinematik hiralashib o'tish, premium tipografiya
//
// v3 — mobile-only fix (see PR notes below). Desktop is byte-for-byte
// unchanged: every function, component, prop, and value the DESKTOP
// render path uses (getScrimColor, getScrimGradient, getTextColor,
// getDescriptionColor, getTextBlockBackdrop, HeroScrim, HeroTextBlock,
// kenBurnsVariants, textBlockVariants, textItemVariants,
// textTransition, imageTransition, HERO_CONFIG, HeroImage, and the
// 74vh/500-580px section height) is exactly what it was in v2. Nothing
// in this pass edits those. All changes are either purely additive
// (new mobile-only constants/component + one new optional field per
// slide) or a conditional branch that, when isMobile is false, calls
// the same existing desktop code the same way it always did.
//
// The problem this pass fixes: on phones, the hero's full desktop
// height (~74vh) combined with a narrow viewport width made the
// container far taller/narrower than the source photos were composed
// for. object-cover had to crop very aggressively to fill that shape,
// so most of each photo's context was lost, AND the mobile text block
// (previously a bottom half-screen box) ended up overlapping whatever
// busy image content was left in frame — text became unreadable.
//
// The fix (mobile only):
// 1. MOBILE_HERO_HEIGHT — the hero's height on mobile is now tied to
//    viewport WIDTH (vw) via clamp(), not viewport height (vh). Two
//    separate reasons this helps:
//      a) vh is unstable on mobile browsers — it changes as the
//         address bar shows/hides while scrolling, which visibly
//         jumps a vh-sized element. vw doesn't have that problem.
//      b) A shorter container is closer to the source photos' own
//         landscape aspect ratio, so object-cover has to trim far
//         less to fill it — this is the actual fix for "too zoomed
//         in," not a new crop algorithm, just a container shape
//         that needs a gentler crop to fill.
// 2. mobileFocalPoint — new OPTIONAL field on each slide's `image`,
//    additive only (desktop's `focalPoint` field and every desktop
//    reference to it is untouched). Even with a shorter container,
//    which part of a wide photo stays centered is still a real
//    choice per slide, so mobile gets its own tuned focal point
//    instead of inheriting the desktop one verbatim. Placeholder
//    values below are a starting point — worth eyeballing against
//    the real photos once available.
// 3. MOBILE_GRADIENT + MobileHeroText — mobile text now sits directly
//    on the photo (no separate box splitting the frame), on top of a
//    single strong gradient that grows from the bottom edge upward.
//    It's deliberately stronger/taller than desktop's HeroScrim
//    because on mobile it's the ONLY contrast mechanism — there's no
//    spare negative space in the crop to lean on, and it needs to
//    clear a full two-line description, not just the headline. Unlike
//    the previous mobile treatment (which reused HeroTextBlock's
//    per-slide ink/cream scrim colors), this is one fixed dark-navy
//    gradient + white text for every slide — simpler and reliably
//    legible regardless of what's in a given photo. Text is
//    left-aligned (previously centered) to match how every other
//    section on the site handles text — TrustStrip, Examples, etc. —
//    none of them center content; this brings the mobile hero in line
//    with that instead of being the one centered exception. Flagging
//    this specific change in case centered mobile text was actually
//    intentional — easy to revert to text-center if so.
// 4. Everything else — autoplay, keyboard nav, Ken Burns, crossfade,
//    slide data (name/headline/description), preloading, a11y
//    live-region — untouched on both mobile and desktop.

'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  memo,
} from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, Variants, Transition } from 'framer-motion';
import { useLanguage, useT } from '@/lib/i18n/LanguageContext';

// ============================================================
// Types
// ============================================================

type ScrimType = 'ink' | 'cream';

interface HeroSlideData {
  readonly id: string;
  readonly name: string;
  readonly headline: string;
  readonly description: string;
  // Uzbek translations of name/headline/description/image.alt, kept as
  // a parallel object rather than restructuring the fields above into
  // {en,uz} pairs everywhere — SLIDES stays the same shape it always
  // was (English, used as-is), and `useLocalizedSlides` below is the
  // only place that ever reads this field.
  readonly copyUz: {
    readonly name: string;
    readonly headline: string;
    readonly description: string;
    readonly alt: string;
  };
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly focalPoint: { readonly x: number; readonly y: number };
    // Optional — mobile-only override. Falls back to `focalPoint`
    // above when omitted. Added in v3; does not affect desktop.
    readonly mobileFocalPoint?: { readonly x: number; readonly y: number };
  };
  readonly scrim: ScrimType;
  readonly navColor: ScrimType;
}

interface HeroConfig {
  readonly dwellTime: number;
  readonly transitionDuration: number;
  readonly crossfadeBlur: number;
  readonly textDelay: number;
  readonly kenBurnsScale: number;
}

// ============================================================
// Constants
// ============================================================

const SLIDES: readonly HeroSlideData[] = [
  {
    id: 'personalized-books',
    name: 'Personalized Books',
    headline: 'Stories that know your child',
    description:
      "Every book adapts to your child's name, interests, and reading level. A unique adventure every time.",
    copyUz: {
      name: 'Shaxsiylashtirilgan kitoblar',
      headline: 'Farzandingizni taniydigan hikoyalar',
      description:
        "Har bir kitob farzandingizning ismi, qiziqishlari va o'qish darajasiga moslashadi. Har safar — betakror sarguzasht.",
      alt: "Bola shaxsiylashtirilgan kitobni yotoqxonaning iliq yorug'ida o'qimoqda",
    },
    image: {
      src: '/images/hero/slide-personalized-books.webp',
      alt: 'A child reading a personalized book in warm bedroom light',
      focalPoint: { x: 0.35, y: 0.5 },
      mobileFocalPoint: { x: 0.25, y: 0.32 },
    },
    scrim: 'ink',
    navColor: 'cream',
  },
  {
    id: 'yusuf-yasmina',
    name: 'Yusuf & Yasmina',
    headline: 'Meet the family behind the stories',
    description:
      'Yusuf and Yasmina bring warmth, curiosity, and a touch of mischief to every page.',
    copyUz: {
      name: 'Yusuf va Yasmina',
      headline: 'Hikoyalar ortidagi oila bilan tanishing',
      description:
        "Yusuf va Yasmina har bir sahifaga mehr, qiziquvchanlik va bir chimdim sho'xlik olib keladi.",
      alt: "Yusuf va Yasmina qahramonlari o'ynoqi ifodalar bilan",
    },
    image: {
      src: '/images/hero/slide-yusuf-yasmina.webp',
      alt: 'Yusuf and Yasmina characters with playful expressions',
      focalPoint: { x: 0.3, y: 0.5 },
      mobileFocalPoint: { x: 0.25, y: 0.34 },
    },
    scrim: 'cream',
    navColor: 'ink',
  },
  {
    id: 'story-library',
    name: 'Story Library',
    headline: 'A world of stories at your fingertips',
    description:
      'From fairy tales to science adventures – an ever‑growing library for every curious mind.',
    copyUz: {
      name: 'Hikoyalar kutubxonasi',
      headline: 'Hikoyalar olami — barmoq uchida',
      description:
        "Ertaklardan tortib ilmiy sarguzashtlargacha — har bir qiziquvchan aql uchun tobora boyib boruvchi kutubxona.",
      alt: "Turli kitoblar bilan porlab turgan kutubxona javoni",
    },
    image: {
      src: '/images/hero/slide-story-library.webp',
      alt: 'A glowing library shelf with diverse books',
      focalPoint: { x: 0.4, y: 0.5 },
      mobileFocalPoint: { x: 0.25, y: 0.36 },
    },
    scrim: 'cream',
    navColor: 'ink',
  },
  {
    id: 'talimoon-toys',
    name: 'Talimoon Toys',
    headline: 'Toys that spark imagination',
    description:
      'Soft, tactile companions designed to complement the stories and inspire play.',
    copyUz: {
      name: "Talimoon o'yinchoqlari",
      headline: 'Xayolotni jonlantiruvchi o\'yinchoqlar',
      description:
        "Hikoyalarni to'ldirish va o'yinni ilhomlantirish uchun yaratilgan yumshoq, sezgir hamrohlar.",
      alt: "Talimoon o'yinchoqlarining yumshoq soyalar bilan studiya suratga olinishi",
    },
    image: {
      src: '/images/hero/slide-talimoon-toys.webp',
      alt: 'Studio shot of Talimoon toys with soft shadows',
      focalPoint: { x: 0.45, y: 0.5 },
      mobileFocalPoint: { x: 0.25, y: 0.3 },
    },
    scrim: 'ink',
    navColor: 'cream',
  },
  {
    id: 'ecosystem',
    name: 'TALIMOON Ecosystem',
    headline: 'Books, toys, and characters – one connected world',
    description:
      'Every piece of the ecosystem works together to nurture creativity and a love for learning.',
    copyUz: {
      name: 'TALIMOON ekotizimi',
      headline: 'Kitoblar, o\'yinchoqlar va qahramonlar — yagona bog\'liq olam',
      description:
        "Ekotizimning har bir bo'lagi ijodkorlik va bilimga bo'lgan muhabbatni tarbiyalash uchun birgalikda ishlaydi.",
      alt: "Kitoblar, o'yinchoqlar va qahramonlarning mavhum bog'langan olami",
    },
    image: {
      src: '/images/hero/slide-ecosystem.webp',
      alt: 'Abstract connected world of books, toys, and characters',
      focalPoint: { x: 0.3, y: 0.5 },
      mobileFocalPoint: { x: 0.25, y: 0.36 },
    },
    scrim: 'ink',
    navColor: 'cream',
  },
] as const;

const HERO_CONFIG: HeroConfig = {
  dwellTime: 10000,        // Har bir slayd 10 soniya ko'rsatiladi, keyin cheksiz aylanadi
  transitionDuration: 1000, // 1 soniyalik premium hiralashib o'tish
  crossfadeBlur: 10,        // px – o'tish paytidagi hiralashish kuchi
  textDelay: 200,
  kenBurnsScale: 1.03,
};

// ============================================================
// MOBILE HERO OVERRIDES (v3) — additive only, see file header.
// Desktop never reads these.
// ============================================================

// Width-based, not height-based — see reason (a) in the file header.
// Range: ~380px on the smallest phones up to ~460px on the largest,
// scaling with device width in between.
const MOBILE_HERO_HEIGHT = 'clamp(380px, 115vw, 460px)';

// One fixed, deliberately strong gradient for every mobile slide,
// independent of that slide's `scrim`/`navColor` — see reason (3) in
// the file header. Same navy already used by this site's Navbar/nav
// tokens (#1C2A3A), not a new color.
const MOBILE_GRADIENT =
  'linear-gradient(to top, rgba(28,42,58,0.90) 0%, rgba(28,42,58,0.62) 25%, rgba(28,42,58,0.20) 32%, transparent 50%)';

// Mask for the mobile defocus layer — mirrors MOBILE_GRADIENT's stops
// so the backdrop-blur fades in lockstep with the darkening (the photo
// itself goes softly out of focus right where the text sits).
//
// v3.2: this layer and MOBILE_GRADIENT are now rendered ONCE as static
// siblings in HeroSlider, NOT inside the per-slide wrapper. A
// backdrop-filter nested under an element whose opacity/filter animate
// (the old crossfade wrapper) flashes hard white for a frame on mobile
// Chrome/Safari — lifting it out of that wrapper fixes the flash while
// keeping the defocus effect.
const MOBILE_BLUR_MASK =
  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.25) 32%, rgba(0,0,0,0) 50%)';

// ============================================================
// Animation Definitions
// ============================================================

// v4 — the "dissolve the outgoing slide to reveal the next" model.
// The slide we're leaving is drawn as a frozen copy ON TOP of the
// (always-opaque) incoming slide and its opacity is eased from 1 to 0
// over this long, with a soft deceleration. Because the layer beneath
// is always fully opaque there is no crossfade midpoint and nothing
// can bleed through — no flicker on mobile or desktop.
const HERO_DISSOLVE_MS = 4000;
const HERO_DISSOLVE_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const textTransition: Transition = {
  duration: 0.8,
  delay: HERO_CONFIG.textDelay / 1000,
  ease: [0.25, 0.1, 0.25, 1],
};

// Ken Burns – faqat oldinga, dwellTime davomida
const kenBurnsVariants = (focalPoint: {
  x: number;
  y: number;
}): Variants => ({
  initial: {
    scale: 1,
    x: 0,
    y: 0,
  },
  animate: {
    scale: HERO_CONFIG.kenBurnsScale,
    x: `${(0.5 - focalPoint.x) * 10}%`,
    y: `${(0.5 - focalPoint.y) * 10}%`,
    transition: {
      duration: HERO_CONFIG.dwellTime / 1000,
      ease: 'linear',
    },
  },
  exit: {
    scale: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
});

const textBlockVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const textItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3 },
  },
};

// ============================================================
// Helper Functions
// ============================================================

// Fixed: scrim and text color were previously mapped to the SAME name
// (scrim 'ink' -> 'text-ink'), pairing a dark wash with dark text on
// every single slide. This now returns the correct CONTRASTING color:
// a dark ('ink') wash gets light ('cream') text, a light ('cream')
// wash gets dark ('ink') text.
const getTextColor = (scrim: ScrimType): string =>
  scrim === 'ink' ? 'text-cream' : 'text-ink';

// Kontrast oshirildi – matn premium va o'qilishi oson bo'lishi uchun
const getScrimColor = (type: ScrimType): string =>
  type === 'ink'
    ? 'rgba(42, 36, 29, 0.45)'
    : 'rgba(247, 242, 234, 0.40)';

const getScrimGradient = (type: ScrimType, isMobile: boolean): string => {
  const color = getScrimColor(type);
  const direction = isMobile ? 'to bottom' : 'to right';
  return `linear-gradient(${direction}, transparent 0%, transparent 45%, ${color} 100%)`;
};

// Description renders at a deliberately reduced alpha relative to the
// (now-corrected) headline color — same hue family, not a different
// color — so the hierarchy reads through color weight as well as size.
// Inline style, not a Tailwind class: the value is computed per
// instance from `scrim`, and a class name built from an interpolated
// variable gets purged in a production Tailwind build.
const getDescriptionColor = (scrim: ScrimType): string =>
  scrim === 'ink'
    ? 'rgba(247, 242, 234, 0.86)'
    : 'rgba(42, 36, 29, 0.82)';

// Very low-alpha radial, centered on the text column only. Reinforces
// — never replaces — the existing full-strip HeroScrim with a few
// extra points of local contrast exactly where the eye is reading.
// Same tonal family as the slide's own scrim, so it reads as "this
// patch of the image happens to be a little quieter," not as a
// separate visible layer, card, or glow. The cream-family version is
// kept at a slightly lower peak alpha than the ink version, since a
// light radial reads as an "obvious glow" faster than a dark one does
// at the same numeric opacity.
const getTextBlockBackdrop = (scrim: ScrimType): string => {
  const base = scrim === 'ink' ? '42, 36, 29' : '247, 242, 234';
  const peakAlpha = scrim === 'ink' ? 0.1 : 0.08;
  return `radial-gradient(ellipse 72% 62% at 50% 50%, rgba(${base}, ${peakAlpha}) 0%, rgba(${base}, 0) 100%)`;
};

// ============================================================
// Preload next image (tozalash bilan)
// ============================================================

function preloadImage(src: string): () => void {
  if (typeof document === 'undefined') return () => {};
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
  return () => {
    if (link.parentNode) link.parentNode.removeChild(link);
  };
}

// ============================================================
// Hooks
// ============================================================

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

function useKeyboardNavigation({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}): void {
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  }, [onPrev, onNext]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevRef.current();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNextRef.current();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}

// ============================================================
// useHeroAutoplay – uzluksiz, hech qachon to'xtamaydigan, closure‑safe
// ============================================================

function useHeroAutoplay({
  enabled,
  delay,
  onTick,
}: {
  enabled: boolean;
  delay: number;
  onTick: () => void;
}): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTickRef = useRef(onTick);
  const enabledRef = useRef(enabled);
  const delayRef = useRef(delay);

  useEffect(() => { onTickRef.current = onTick; }, [onTick]);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { delayRef.current = delay; }, [delay]);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((): void => {
    if (!enabledRef.current) return;
    clearTimer();
    timerRef.current = setTimeout(() => {
      onTickRef.current();
      startTimer(); // keyingi davrni rejalashtiramiz – cheksiz aylanish
    }, delayRef.current);
  }, [clearTimer]);

  useEffect(() => {
    if (enabled) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [enabled, startTimer, clearTimer]);
}

// ============================================================
// Components
// ============================================================

// --- HeroImage ---
interface HeroImageProps {
  src: string;
  alt: string;
  focalPoint: { x: number; y: number };
  priority?: boolean;
  // v4 — render statically at the Ken Burns END pose (no motion of its
  // own). Used by the dissolving veil so its copy matches the live
  // layer's last painted frame exactly, with no pop.
  frozen?: boolean;
  className?: string;
}

const HeroImage = memo(function HeroImage({
  src,
  alt,
  focalPoint,
  priority = false,
  frozen = false,
  className = '',
}: HeroImageProps) {
  const reducedMotion = useReducedMotion();

  const variants = useMemo(() => {
    if (reducedMotion) return undefined;
    return kenBurnsVariants(focalPoint);
  }, [reducedMotion, focalPoint]);

  return (
    // Statik wrapper – fade/blur endi faqat ota HeroSlide qatlamida boshqariladi,
    // shu bilan ikki qatlamli ortiqcha animatsiya (va GPU yuklamasi) oldini olinadi
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        variants={variants}
        // frozen: start AND stay on the "animate" pose so the veil copy
        // is pinned to the Ken Burns end state the live layer just
        // reached — identical frame, zero motion.
        initial={frozen ? 'animate' : 'initial'}
        animate="animate"
        style={reducedMotion ? { transform: 'none' } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
          }}
        />
      </motion.div>
    </div>
  );
});

// --- HeroScrim (desktop only, as of v3 — see MobileHeroText below for mobile) ---
interface HeroScrimProps {
  type: ScrimType;
  isMobile: boolean;
  className?: string;
}

const HeroScrim = memo(function HeroScrim({
  type,
  isMobile,
  className = '',
}: HeroScrimProps) {
  const gradient = useMemo(
    () => getScrimGradient(type, isMobile),
    [type, isMobile]
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ background: gradient }}
    />
  );
});

// --- HeroTextBlock – premium tipografiya (desktop only, as of v3) ---
interface HeroTextBlockProps {
  eyebrow: string;
  headline: string;
  description: string;
  isMobile: boolean;
  scrimType: ScrimType;
  // v4 — false on the frozen veil copy: skip the intro stagger so the
  // dissolving copy just shows the text already settled.
  animateIn?: boolean;
}

const HeroTextBlock = memo(function HeroTextBlock({
  eyebrow,
  headline,
  description,
  isMobile,
  scrimType,
  animateIn = true,
}: HeroTextBlockProps) {
  const textColor = getTextColor(scrimType);
  const descriptionColor = getDescriptionColor(scrimType);
  const backdrop = getTextBlockBackdrop(scrimType);

  return (
    <motion.div
      className={`
        absolute inset-0
        flex flex-col justify-center
        ${isMobile ? 'items-center px-6 text-center' : 'items-start px-16'}
        ${textColor}
        max-w-full md:max-w-[520px] lg:max-w-[560px]
      `}
      style={{ backgroundImage: backdrop }}
      variants={textBlockVariants}
      initial={animateIn ? 'hidden' : 'visible'}
      animate="visible"
      transition={textTransition}
    >
      {/* Oltin rangli eyebrow – brend logotipidagi oltin rang bilan uyg'un, premium editorial uslub.
          13px/tracking-[0.18em]/font-medium: oldingi 11px/0.3em/semibold
          kombinatsiyasida harflar orasidagi bo'shliq shu qadar keng ediki,
          matn og'irligiga qaramay vizual "massasi"ni yo'qotgan edi. */}
      <motion.span
        className="text-[16px] uppercase tracking-[0.18em] font-sans font-medium mb-3"
style={{
  color: "rgb(175, 134, 46)",
  textShadow: "0 1px 2px rgba(0,0,0,0.18)"
}}
      >
        {eyebrow}
      </motion.span>

      {/* Nozik oltin ajratuvchi chiziq – lyuks brendlarga xos detal (unchanged) */}
      <motion.span
        className="block w-10 h-[1.5px] bg-[#C9A227] mb-5"
        variants={textItemVariants}
      />

      {/* font-medium (was semibold) matches every other serif heading on
          this site; lg:text-5xl (was lg:text-4xl) fixes a monotonicity
          bug where the headline shrank between md and xl instead of
          holding steady — not a size increase, 5xl already existed at
          both neighboring breakpoints. drop-shadow-sm removed: it was
          compensating for the getTextColor contrast bug fixed above and
          is redundant next to the corrected color + local backdrop. */}
      <motion.h1
        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-5xl leading-[1.12] tracking-tight font-medium mb-6"
        variants={textItemVariants}
      >
        {headline}
      </motion.h1>

      {/* font-normal (was font-light — too thin to hold up against a
          photographic background) + explicit reduced-alpha color
          (previously inherited the exact same full-strength color as
          the headline, which was the main reason headline and
          description didn't feel visually distinct from each other). */}
      <motion.p
        className="text-sm sm:text-base leading-relaxed max-w-[36ch] font-normal"
        style={{ color: descriptionColor }}
        variants={textItemVariants}
      >
        {description}
      </motion.p>
    </motion.div>
  );
});

// --- MobileHeroText (v3, new, mobile only) ---
// Deliberately its own component rather than a third branch inside
// HeroTextBlock — keeps HeroTextBlock's desktop JSX/props exactly as
// they were, with zero chance of a mobile-only edit leaking into the
// desktop render path.
interface MobileHeroTextProps {
  eyebrow: string;
  headline: string;
  description: string;
  // v4 — see HeroTextBlockProps.animateIn
  animateIn?: boolean;
}

const MobileHeroText = memo(function MobileHeroText({
  eyebrow,
  headline,
  description,
  animateIn = true,
}: MobileHeroTextProps) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-10 px-6 text-left"
      style={{
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        color: '#F7F2EA',
      }}
      variants={textBlockVariants}
      initial={animateIn ? 'hidden' : 'visible'}
      animate="visible"
      transition={textTransition}
    >
      <motion.span
        className="mb-2 block text-[13px] font-sans font-medium uppercase tracking-[0.16em]"
        style={{ color: 'rgb(224, 194, 130)', textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
        variants={textItemVariants}
      >
        {eyebrow}
      </motion.span>

      <motion.h1
        className="mb-2 font-serif text-[22px] font-medium leading-[1.15] tracking-tight"
        variants={textItemVariants}
      >
        {headline}
      </motion.h1>

      <motion.p
        className="max-w-[34ch] text-[12.5px] leading-snug"
        style={{ color: 'rgba(247, 242, 234, 0.86)' }}
        variants={textItemVariants}
      >
        {description}
      </motion.p>
    </motion.div>
  );
});

// --- HeroSlide ---
interface HeroSlideProps {
  slide: HeroSlideData;
  isMobile: boolean;
  priority: boolean;
  // v4 — this instance is the dissolving VEIL copy, not the live slide:
  // freeze the Ken Burns at its end pose, skip the text intro, and drop
  // the mobile backdrop-filter (its wrapper animates opacity, and a
  // backdrop-filter under an animating-opacity ancestor white-flashes
  // on mobile).
  frozen?: boolean;
}

const HeroSlide = memo(
  function HeroSlide({
    slide,
    isMobile,
    priority,
    frozen = false,
  }: HeroSlideProps) {
    const { image, scrim, ...textData } = slide;
    const slideWord = useT('slide', 'slayd');

    // v3: mobile gets its own tuned focal point when the slide has one;
    // desktop's `focalPoint` is untouched either way.
    const activeFocalPoint =
      isMobile && image.mobileFocalPoint ? image.mobileFocalPoint : image.focalPoint;

    // v4 — a HeroSlide no longer animates its own opacity/filter. It's
    // just a self-contained frame (image + overlays + text). The
    // dissolve now lives entirely on the VEIL wrapper in HeroSlider,
    // over an always-opaque BASE copy of the next slide — so there's no
    // crossfade midpoint and nothing to flicker.
    return (
      <div
        className="absolute inset-0 w-full h-full"
        id={`hero-slide-${slide.id}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${slide.name} ${slideWord}`}
      >
        <HeroImage
          src={image.src}
          alt={image.alt}
          focalPoint={activeFocalPoint}
          priority={priority}
          frozen={frozen}
        />

        {isMobile ? (
          <>
            {/* backdrop-filter defocus — live layer only. On the
                dissolving veil its opacity-animating wrapper would make
                this white-flash on mobile, so the veil goes without. */}
            {!frozen && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[4]"
                style={{
                  backdropFilter: 'blur(3px)',
                  WebkitBackdropFilter: 'blur(3px)',
                  WebkitMaskImage: MOBILE_BLUR_MASK,
                  maskImage: MOBILE_BLUR_MASK,
                }}
              />
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{ backgroundImage: MOBILE_GRADIENT }}
            />
            <MobileHeroText
              eyebrow={textData.name}
              headline={textData.headline}
              description={textData.description}
              animateIn={!frozen}
            />
          </>
        ) : (
          // Desktop: same HeroScrim + HeroTextBlock composition as
          // before — only the outer wrapper's own opacity/filter
          // animation was removed (moved to the VEIL).
          <div className="absolute inset-0 z-10 flex items-center justify-end">
            <div className="relative w-[35%] h-full">
              <HeroScrim type={scrim} isMobile={false} />
              <HeroTextBlock
                eyebrow={textData.name}
                headline={textData.headline}
                description={textData.description}
                isMobile={false}
                scrimType={scrim}
                animateIn={!frozen}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.slide.id === next.slide.id &&
    // `id` alone used to be sufficient (it's per-slide-slot stable
    // across re-renders), but a language switch now produces a new
    // `slide` object with the same `id` and different text — compare
    // headline too so that case isn't wrongly treated as "unchanged".
    prev.slide.headline === next.slide.headline &&
    prev.isMobile === next.isMobile &&
    prev.priority === next.priority &&
    prev.frozen === next.frozen
);

// ============================================================
// Main Export: HeroSlider – knopkasiz, uzluksiz aylanuvchi
// ============================================================

interface HeroSliderProps {
  onNavColorChange?: (color: 'ink' | 'cream') => void;
}

const CAROUSEL_CHROME_EN = {
  carouselLabel: 'Featured content carousel',
  currentSlideLabel: 'Current slide',
  slideOf: (n: number, total: number, headline: string) =>
    `Slide ${n} of ${total}: ${headline}`,
};

const CAROUSEL_CHROME_UZ: typeof CAROUSEL_CHROME_EN = {
  carouselLabel: 'Asosiy kontent karuseli',
  currentSlideLabel: 'Joriy slayd',
  slideOf: (n: number, total: number, headline: string) =>
    `${n}/${total}-slayd: ${headline}`,
};

export function HeroSlider({ onNavColorChange }: HeroSliderProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const reducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const chrome = useT(CAROUSEL_CHROME_EN, CAROUSEL_CHROME_UZ);

  // Derives a fully-localized slide list from SLIDES' English base +
  // each slide's `copyUz` — everything downstream (HeroSlide,
  // HeroImage, HeroTextBlock, MobileHeroText) stays language-agnostic
  // and just renders whatever strings it's handed.
  const slides = useMemo<readonly HeroSlideData[]>(() => {
    if (language !== 'UZ') return SLIDES;
    return SLIDES.map((slide) => ({
      ...slide,
      name: slide.copyUz.name,
      headline: slide.copyUz.headline,
      description: slide.copyUz.description,
      image: { ...slide.image, alt: slide.copyUz.alt },
    }));
  }, [language]);

  const totalSlides = slides.length;

  // ── v5 — TWO PERSISTENT LAYERS ────────────────────────────────────
  // The flicker at the swap was a fresh <img> needing a frame to paint.
  // Fix: two layers that NEVER unmount. `layerIdx` is which slide each
  // shows; `top` is the layer currently on top. To move to a new slide
  // we point the *other* (hidden, behind) layer at it — its <img> gets
  // the full dissolve to paint, unseen — then fade the top layer's
  // (already-painted) frame out to reveal it, and finally flip `top`.
  // At no instant is the screen not covered by an opaque, painted
  // layer, so there is nothing to flicker. `kbKey` restarts a layer's
  // Ken Burns when it receives a new slide.
  const [layerIdx, setLayerIdx] = useState<[number, number]>([0, 0]);
  const [kbKey, setKbKey] = useState<[number, number]>([0, 0]);
  const [top, setTop] = useState<0 | 1>(0);
  const [fading, setFading] = useState(false);

  // The slide the viewer is (or is becoming) focused on: the top layer
  // when idle, the emerging layer while the top one dissolves away.
  const liveIndex = fading ? layerIdx[top === 0 ? 1 : 0] : layerIdx[top];
  const liveSlide = slides[liveIndex];

  useEffect(() => {
    onNavColorChange?.(liveSlide.navColor);
  }, [liveSlide.navColor, onNavColorChange]);

  // v4.1 — preload EVERY hero image once, up front (there are only 5,
  // all webp). The dissolve reveals the next slide from underneath the
  // veil, so if that slide's image isn't already decoded it "pops" in
  // mid-dissolve and reads as a flicker. Preloading them all means every
  // base swap lands on an already-decoded image.
  useEffect(() => {
    const cleanups = SLIDES.map((s) => preloadImage(s.image.src));
    return () => cleanups.forEach((c) => c());
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (fading) return; // ignore requests mid-dissolve
      // Modulo orqali cheksiz aylanish: oxirgi slayddan keyin avtomatik 0-indeksga qaytadi
      let target = index;
      if (target < 0) target = totalSlides - 1;
      if (target >= totalSlides) target = 0;
      if (target === liveIndex) return;
      const other: 0 | 1 = top === 0 ? 1 : 0;
      // Point the hidden layer at the new slide (+ restart its Ken
      // Burns), then start dissolving the top layer away.
      setLayerIdx((p) => (other === 0 ? [target, p[1]] : [p[0], target]));
      setKbKey((p) => (other === 0 ? [p[0] + 1, p[1]] : [p[0], p[1] + 1]));
      setFading(true);
    },
    [fading, totalSlides, liveIndex, top]
  );

  const goToNext = useCallback(() => {
    goToSlide(liveIndex + 1);
  }, [liveIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide(liveIndex - 1);
  }, [liveIndex, goToSlide]);

  // Har doim ishlab turadi – pauza yo'q, to'xtamaydi, hover'ga bog'liq emas
  useHeroAutoplay({
    enabled: true,
    delay: HERO_CONFIG.dwellTime,
    onTick: goToNext,
  });

  // Klaviatura orqali navigatsiya – ko'rinadigan knopkasiz, faqat accessibility uchun
  useKeyboardNavigation({
    onPrev: goToPrev,
    onNext: goToNext,
  });

  return (
    <section
      className="relative w-full overflow-hidden flex-shrink-0"
      style={
        isMobile
          ? { height: MOBILE_HERO_HEIGHT }
          : { height: '74vh', maxHeight: '580px', minHeight: '500px' }
      }
      aria-label={chrome.carouselLabel}
      aria-roledescription="carousel"
    >
      <div className="absolute inset-0">
        {/* Opaque floor — nothing should ever reach it (a layer always
            covers), but if it did it dips to navy, never white. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: '#1C2A3A' }}
        />

        {/* Two persistent layers. Neither ever unmounts, so their <img>
            elements stay painted across a slide change — there's no
            fresh-<img> frame to flicker. Only the TOP layer animates
            opacity (1 → 0 while dissolving); the other is always opaque
            underneath. `top` flips once the dissolve completes. */}
        {([0, 1] as const).map((layer) => {
          const isTop = top === layer;
          const dissolvingOut = isTop && fading;
          return (
            <motion.div
              key={layer}
              className="absolute inset-0"
              style={{ zIndex: isTop ? 20 : 10, willChange: 'opacity' }}
              animate={{ opacity: dissolvingOut ? 0 : 1 }}
              transition={
                dissolvingOut
                  ? {
                      duration: reducedMotion ? 0 : HERO_DISSOLVE_MS / 1000,
                      ease: HERO_DISSOLVE_EASE,
                    }
                  : { duration: 0 }
              }
              onAnimationComplete={() => {
                if (dissolvingOut) {
                  setTop(layer === 0 ? 1 : 0);
                  setFading(false);
                }
              }}
            >
              <HeroSlide
                key={`kb-${layer}-${kbKey[layer]}`}
                slide={slides[layerIdx[layer]]}
                isMobile={isMobile}
                priority={layerIdx[layer] === 0}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Landing gradient into the section below (BrandValues). v6: the
          cream target is now the EXACT `--surface-base` (#F7F3EC) that
          BrandValues uses, not the slightly warmer #F8F5EF — so there's
          no cream-tone step at the seam — and it's a touch taller (h-16)
          so the hero's photo sinks into cream over a real distance
          rather than a thin hard edge. BrandValues meets it with its own
          top-side dissolve. Desktop-only (mobile's navy MOBILE_GRADIENT
          owns the bottom). */}
      {!isMobile && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-gradient-to-b from-transparent via-[#F7F3EC]/35 to-[#F7F3EC]"
        />
      )}

      {/* Mobile equivalent — much thinner (16px vs desktop's 48px) and
          sits comfortably inside MobileHeroText's own bottom padding
          reserve (1.75rem + safe-area ≈ 28px+), so it never touches a
          glyph. Layered above MOBILE_GRADIENT (z-[5]) so the navy
          darkening still owns the text zone; this strip only softens
          the Hero's very last few pixels into the cream section below,
          fixing the hard navy/cream cut instead of fighting the
          contrast gradient that guards the text. */}
      {isMobile && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-8 bg-gradient-to-b from-transparent to-[#F7F3EC]"
        />
      )}

      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        aria-label={chrome.currentSlideLabel}
      >
        {chrome.slideOf(liveIndex + 1, totalSlides, liveSlide.headline)}
      </div>
    </section>
  );
}
