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
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
  Transition,
} from 'framer-motion';
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

const imageTransition: Transition = {
  duration: HERO_CONFIG.transitionDuration / 1000,
  ease: [0.22, 1, 0.36, 1],
};

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
  className?: string;
}

const HeroImage = memo(function HeroImage({
  src,
  alt,
  focalPoint,
  priority = false,
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
        initial="initial"
        animate="animate"
        exit="exit"
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
}

const HeroTextBlock = memo(function HeroTextBlock({
  eyebrow,
  headline,
  description,
  isMobile,
  scrimType,
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
      initial="hidden"
      animate="visible"
      exit="exit"
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
}

const MobileHeroText = memo(function MobileHeroText({
  eyebrow,
  headline,
  description,
}: MobileHeroTextProps) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-10 px-6 text-left"
      style={{
        paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
        color: '#F7F2EA',
      }}
      variants={textBlockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
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
}

const HeroSlide = memo(
  function HeroSlide({
    slide,
    isMobile,
    priority,
  }: HeroSlideProps) {
    const { image, scrim, ...textData } = slide;
    const slideWord = useT('slide', 'slayd');

    // v3: mobile gets its own tuned focal point when the slide has one;
    // desktop's `focalPoint` is untouched either way.
    const activeFocalPoint =
      isMobile && image.mobileFocalPoint ? image.mobileFocalPoint : image.focalPoint;

    // v3.2 — the WHITE FLASH fix.
    //
    // Desktop: byte-for-byte the v2/v3 crossfade — opacity + `filter`
    // blur, in and out.
    //
    // Mobile: `filter` is dropped from the transition entirely. Every
    // slide swap mounts a fresh wrapper with `filter: blur(10px)`,
    // which forces the browser to spin up a new filtered compositing
    // layer — on mobile GPUs the first frame of that layer paints
    // white, which is the flash. A plain opacity crossfade needs no
    // such layer. The "hiralanish"/defocus look is instead carried by
    // the STATIC backdrop-filter layer in HeroSlider (rendered once,
    // never inside an animating wrapper). The outgoing slide also holds
    // fully opaque for the whole fade so no translucent-on-translucent
    // midpoint can let anything punch through.
    const enter = isMobile
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, filter: `blur(${HERO_CONFIG.crossfadeBlur}px)` },
          animate: { opacity: 1, filter: 'blur(0px)' },
        };
    const exitAnim = isMobile
      ? {
          opacity: 0,
          transition: {
            duration: 0.3,
            delay: HERO_CONFIG.transitionDuration / 1000,
          },
        }
      : { opacity: 0, filter: `blur(${HERO_CONFIG.crossfadeBlur}px)` };

    return (
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ willChange: isMobile ? 'opacity' : 'opacity, filter' }}
        initial={enter.initial}
        animate={enter.animate}
        exit={exitAnim}
        transition={imageTransition}
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
        />

        {isMobile ? (
          // v3.2: on mobile this per-slide wrapper carries ONLY the
          // image. The defocus layer, the gradient and the text are all
          // rendered once in HeroSlider, outside this crossfading
          // wrapper, so nothing that could white-flash lives here.
          null
        ) : (
          // Desktop: unchanged from v2 — same wrapper, same HeroScrim,
          // same HeroTextBlock, same props.
          <div className="absolute inset-0 z-10 flex items-center justify-end">
            <div className="relative w-[35%] h-full">
              <HeroScrim type={scrim} isMobile={false} />
              <HeroTextBlock
                eyebrow={textData.name}
                headline={textData.headline}
                description={textData.description}
                isMobile={false}
                scrimType={scrim}
              />
            </div>
          </div>
        )}
      </motion.div>
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
    prev.priority === next.priority
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const isMobile = useMediaQuery('(max-width: 767px)');
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
  const currentSlide = slides[activeIndex];

  useEffect(() => {
    if (onNavColorChange) {
      onNavColorChange(currentSlide.navColor);
    }
  }, [activeIndex, currentSlide.navColor, onNavColorChange]);

  useEffect(() => {
    const nextIndex = (activeIndex + 1) % totalSlides;
    const nextImageSrc = SLIDES[nextIndex].image.src;
    const cleanup = preloadImage(nextImageSrc);
    return cleanup;
  }, [activeIndex, totalSlides]);

  const goToSlide = useCallback(
    (index: number) => {
      // Modulo orqali cheksiz aylanish: oxirgi slayddan keyin avtomatik 0-indeksga qaytadi
      let target = index;
      if (target < 0) target = totalSlides - 1;
      if (target >= totalSlides) target = 0;
      setActiveIndex(target);
    },
    [totalSlides]
  );

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

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

  const isFirstSlide = activeIndex === 0;

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
        {/* v3.1 — opaque backing behind every slide (mobile only). Even
            with the crossfade fixed so an opaque slide always backs the
            incoming one, this guarantees that if a frame ever slips
            through it dips toward the hero's own navy, never white.
            Desktop is untouched. */}
        {isMobile && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ backgroundColor: '#1C2A3A' }}
          />
        )}
        {/* Slaydlar bir-birining ustida (absolute inset-0) joylashadi va
            opacity + blur orqali hiralashib bir-biriga kirib boradi –
            hech qanday oq fon ko'rinmaydi */}
        <AnimatePresence initial={false}>
          <HeroSlide
            key={activeIndex}
            slide={currentSlide}
            isMobile={isMobile}
            priority={isFirstSlide}
          />
        </AnimatePresence>

        {/* v3.2 — mobile: the defocus + gradient + text, rendered ONCE
            here as STATIC layers on top of the crossfading images
            instead of inside each slide. The backdrop-filter now blurs
            whatever image is currently showing (or the blend of two
            mid-transition) from a wrapper whose own opacity/filter
            never animate — so it can no longer white-flash. Only the
            text gets its own keyed crossfade. Desktop path unchanged. */}
        {isMobile && (
          <>
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5]"
              style={{ backgroundImage: MOBILE_GRADIENT }}
            />
            <AnimatePresence initial={false}>
              <MobileHeroText
                key={activeIndex}
                eyebrow={currentSlide.name}
                headline={currentSlide.headline}
                description={currentSlide.description}
              />
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Trust bo'limiga o'tish gradienti – 50% qisqartirildi (h-24 -> h-12).
          v3: desktop-only. On mobile this cream fade would sit directly
          on top of MobileHeroText's bottom-anchored zone and wash out
          the dark navy gradient exactly where the text needs contrast
          — mobile's own MOBILE_GRADIENT already grounds the bottom
          edge, so this strip is skipped there rather than fighting it. */}
      {!isMobile && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-12 bg-gradient-to-b from-transparent via-[#F8F5EF]/35 to-[#F8F5EF]"
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
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-4 bg-gradient-to-b from-transparent to-[#F8F5EF]"
        />
      )}

      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        aria-label={chrome.currentSlideLabel}
      >
        {chrome.slideOf(activeIndex + 1, totalSlides, currentSlide.headline)}
      </div>
    </section>
  );
}
