// FILE: src/components/hero/Hero.tsx
// Enterprise-grade Hero Slider — buttonless continuous autoplay, cinematic
// crossfade, premium bottom-anchored typography.
//
// v4 — unifies desktop and mobile onto ONE render path. Previous versions
// (v2/v3) branched on `isMobile`: desktop showed a right-side 35%-width
// text panel with a per-slide ink/cream scrim, mobile showed a bottom-
// anchored navy-gradient band. This version replaces both with a single
// bottom-anchored layout used at every breakpoint — a deliberate,
// explicitly-requested change, not a stray redesign: the brand's actual
// visual language (serif headline, gold eyebrow + gold divider line,
// ink/cream token family, font stack) is fully preserved; only the
// text's *position* and the mechanism that guarantees its contrast
// changed, because a single photo now has to work identically across
// every screen size with zero per-device art direction.
//
// What this fixes / simplifies vs v3:
// 1. One image, one focal point, per slide — no `mobileFocalPoint`
//    override, no separate mobile crop. `object-position` is expressed
//    as a plain percentage from that single focal point, which is
//    inherently responsive (a percentage anchor holds the same relative
//    position at any container size) rather than needing a second
//    hand-tuned value.
// 2. No more `useMediaQuery` / `isMobile` state. Every remaining
//    difference between screen sizes (hero height, type scale, padding)
//    is expressed in Tailwind responsive classes, resolved by the
//    browser at paint time. This removes a whole class of bugs the old
//    JS-driven branch had for free: no hydration flash (matchMedia
//    starts at `false` on the server, so v3 briefly rendered the
//    desktop layout on every mobile load until the effect ran), no
//    resize-triggered re-render, one fewer state subscription alive for
//    the life of the page.
// 3. `HeroScrim` / `HeroTextBlock` / `MobileHeroText` and their five
//    supporting color-helper functions (getScrimColor, getScrimGradient,
//    getTextColor, getDescriptionColor, getTextBlockBackdrop) are gone.
//    They existed to solve "text sits on an unpredictable patch of
//    photo, so contrast must be computed per slide" for the old
//    right-panel layout. The new bottom band uses one fixed dark
//    gradient for every slide instead (see HERO_GRADIENT) — simpler,
//    and reliably legible regardless of what's under it, so the whole
//    per-slide scrim system is dead code once the layout no longer
//    needs it.
// 4. `scrim` is removed from HeroSlideData (nothing reads it anymore).
//    `navColor` stays — the navbar sits transparently over the *top* of
//    the hero, which the bottom gradient never reaches, so the navbar's
//    own contrast still genuinely depends on each photo's top-region
//    tone and still needs a per-slide answer.
// 5. Pagination dots were never present in this component and still
//    aren't — confirmed, not re-added. Keyboard arrow-key navigation
//    remains the one non-visual affordance.
// 6. Autoplay now pauses on hover/focus-within (new — small, invisible
//    behavior change, not a UI element) so the rotation is at least
//    interruptible without adding any visible control. A fully visible,
//    always-available pause toggle is still the correct WCAG 2.2.2 fix
//    long-term and remains an open item — flagged here rather than
//    silently added, since the brief calls for the Hero to stay
//    chrome-free and a persistent pause button is a real UI decision
//    that should be made deliberately, not slipped in.

'use client';

import React, {
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

// ============================================================
// Types
// ============================================================

interface HeroSlideData {
  readonly id: string;
  readonly name: string;
  readonly headline: string;
  readonly description: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    // Left-biased on purpose for every current slide (subject sits in
    // the left ~65-70% of frame, per the brand's illustration brief) —
    // a single percentage anchor, not a per-breakpoint override, since
    // object-position holds its relative position at any container
    // size on its own.
    readonly focalPoint: { readonly x: number; readonly y: number };
  };
  // Drives the navbar's ink/cream color for this slide (see
  // `onNavColorChange`) — independent of the text layer below, which
  // no longer varies per slide.
  readonly navColor: 'ink' | 'cream';
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
    image: {
      src: '/images/hero/slide-personalized-books.webp',
      alt: 'A child reading a personalized book in warm bedroom light',
      focalPoint: { x: 0.35, y: 0.5 },
    },
    navColor: 'cream',
  },
  {
    id: 'yusuf-yasmina',
    name: 'Yusuf & Yasmina',
    headline: 'Meet the family behind the stories',
    description:
      'Yusuf and Yasmina bring warmth, curiosity, and a touch of mischief to every page.',
    image: {
      src: '/images/hero/slide-yusuf-yasmina.webp',
      alt: 'Yusuf and Yasmina characters with playful expressions',
      focalPoint: { x: 0.3, y: 0.5 },
    },
    navColor: 'ink',
  },
  {
    id: 'story-library',
    name: 'Story Library',
    headline: 'A world of stories at your fingertips',
    description:
      'From fairy tales to science adventures – an ever‑growing library for every curious mind.',
    image: {
      src: '/images/hero/slide-story-library.webp',
      alt: 'A glowing library shelf with diverse books',
      focalPoint: { x: 0.4, y: 0.5 },
    },
    navColor: 'ink',
  },
  {
    id: 'talimoon-toys',
    name: 'Talimoon Toys',
    headline: 'Toys that spark imagination',
    description:
      'Soft, tactile companions designed to complement the stories and inspire play.',
    image: {
      src: '/images/hero/slide-talimoon-toys.webp',
      alt: 'Studio shot of Talimoon toys with soft shadows',
      focalPoint: { x: 0.45, y: 0.5 },
    },
    navColor: 'cream',
  },
  {
    id: 'ecosystem',
    name: 'TALIMOON Ecosystem',
    headline: 'Books, toys, and characters – one connected world',
    description:
      'Every piece of the ecosystem works together to nurture creativity and a love for learning.',
    image: {
      src: '/images/hero/slide-ecosystem.webp',
      alt: 'Abstract connected world of books, toys, and characters',
      focalPoint: { x: 0.3, y: 0.5 },
    },
    navColor: 'cream',
  },
] as const;

const HERO_CONFIG: HeroConfig = {
  dwellTime: 9000, // 9s dwell — mid-range of the 8-10s Ken Burns window
  transitionDuration: 1000, // 1s crossfade
  crossfadeBlur: 8, // px — kept light; "elegant, minimal," not flashy
  textDelay: 200,
  kenBurnsScale: 1.07, // mid-range of the requested 1.06-1.08
};

// One fixed gradient, used at every breakpoint. Bottom-up, so it darkens
// only the lower band the text sits in — the top ~55-75% of every photo
// stays untouched, bright, and vibrant, exactly as specified. Same navy
// already used by this site's Navbar tokens (#1C2A3A), not a new color.
const HERO_GRADIENT =
  'linear-gradient(to top, rgba(28,42,58,0.90) 0%, rgba(28,42,58,0.62) 30%, rgba(28,42,58,0.20) 56%, transparent 74%)';

// A mask, not a second gradient — reused to feather the backdrop-blur
// layer below so the blur itself fades out with the gradient instead of
// ending in a hard, visible seam partway up the photo.
const HERO_BLUR_MASK =
  'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 74%)';

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

// Ken Burns — forward-only, restarts fresh every time a slide mounts
// (keyed remount in HeroSlider), runs the full dwell duration linearly.
const kenBurnsVariants = (focalPoint: { x: number; y: number }): Variants => ({
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
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
// Preload next image (with cleanup)
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

// useHeroAutoplay — continuous, closure-safe, and now pausable (hover/
// focus) via `enabled` rather than ever fully stopping on its own.
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
      startTimer();
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
}

const HeroImage = memo(function HeroImage({
  src,
  alt,
  focalPoint,
  priority = false,
}: HeroImageProps) {
  const reducedMotion = useReducedMotion();

  const variants = useMemo(() => {
    if (reducedMotion) return undefined;
    return kenBurnsVariants(focalPoint);
  }, [reducedMotion, focalPoint]);

  return (
    <div className="absolute inset-0 overflow-hidden">
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

// --- HeroText — the single, universal bottom-anchored text layer.
// Same component at every breakpoint; only Tailwind responsive classes
// change between them (type scale, padding). Left-aligned throughout,
// consistent with how every other section on the site treats text.
interface HeroTextProps {
  eyebrow: string;
  headline: string;
  description: string;
}

const HeroText = memo(function HeroText({
  eyebrow,
  headline,
  description,
}: HeroTextProps) {
  return (
    <motion.div
      className={[
        'absolute inset-x-0 bottom-0 z-10',
        'px-5 md:px-10 lg:px-16',
        'pb-[calc(2.5rem+env(safe-area-inset-bottom))]',
        'md:pb-14 lg:pb-16',
        'text-left text-[#F7F2EA]',
        'max-w-[92%] sm:max-w-[560px] md:max-w-[620px] lg:max-w-[680px]',
      ].join(' ')}
      variants={textBlockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={textTransition}
    >
      {/* Gold eyebrow — same brand gold family used across the site,
          not a new color. */}
      <motion.span
        className="mb-2 block text-[13px] font-sans font-medium uppercase tracking-[0.18em] md:mb-3 md:text-[14px]"
        style={{ color: 'rgb(224, 194, 130)', textShadow: '0 1px 2px rgba(0,0,0,0.18)' }}
        variants={textItemVariants}
      >
        {eyebrow}
      </motion.span>

      {/* Gold divider — same lyxury-brand detail carried over unchanged. */}
      <motion.span
        className="mb-4 block h-[1.5px] w-10 bg-[#C9A227] md:mb-5"
        variants={textItemVariants}
      />

      <motion.h1
        className="mb-3 font-serif text-[30px] font-medium leading-[1.14] tracking-tight md:mb-4 md:text-[46px] lg:text-[54px] xl:text-[60px]"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.28)' }}
        variants={textItemVariants}
      >
        {headline}
      </motion.h1>

      <motion.p
        className="max-w-[34ch] text-[14px] font-normal leading-relaxed md:max-w-[40ch] md:text-[16px]"
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
  priority: boolean;
}

const HeroSlide = memo(
  function HeroSlide({ slide, priority }: HeroSlideProps) {
    const { image } = slide;

    return (
      <motion.div
        className="absolute inset-0 h-full w-full"
        style={{ willChange: 'opacity, filter' }}
        initial={{ opacity: 0, filter: `blur(${HERO_CONFIG.crossfadeBlur}px)` }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, filter: `blur(${HERO_CONFIG.crossfadeBlur}px)` }}
        transition={imageTransition}
        id={`hero-slide-${slide.id}`}
        role="group"
        aria-roledescription="slide"
        aria-label={`${slide.name} slide`}
      >
        <HeroImage
          src={image.src}
          alt={image.alt}
          focalPoint={image.focalPoint}
          priority={priority}
        />

        {/* Seamless bottom layer: gradient darkens only the lower band;
            the blur sits behind the gradient, masked to the same shape,
            so it feathers out with it instead of ending in a hard edge.
            No box, no border, no visible "card" — just the photo
            getting quietly quieter right where the text sits. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4]"
          style={{
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            WebkitMaskImage: HERO_BLUR_MASK,
            maskImage: HERO_BLUR_MASK,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{ backgroundImage: HERO_GRADIENT }}
        />

        <HeroText
          eyebrow={slide.name}
          headline={slide.headline}
          description={slide.description}
        />
      </motion.div>
    );
  },
  (prev, next) => prev.slide.id === next.slide.id && prev.priority === next.priority
);

// ============================================================
// Main Export: HeroSlider — buttonless, continuously rotating
// ============================================================

interface HeroSliderProps {
  onNavColorChange?: (color: 'ink' | 'cream') => void;
}

export function HeroSlider({ onNavColorChange }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[activeIndex];

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

  // Continuous by default; pauses only while a pointer or keyboard focus
  // is actually within the hero — an invisible affordance, not a new UI
  // element (see file header, point 6, for why a visible pause control
  // is intentionally out of scope for this pass).
  useHeroAutoplay({
    enabled: !paused,
    delay: HERO_CONFIG.dwellTime,
    onTick: goToNext,
  });

  useKeyboardNavigation({
    onPrev: goToPrev,
    onNext: goToNext,
  });

  const isFirstSlide = activeIndex === 0;

  return (
    <section
      className="relative w-full flex-shrink-0 overflow-hidden h-[80svh] lg:h-[100svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label="Featured content carousel"
      aria-roledescription="carousel"
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <HeroSlide key={activeIndex} slide={currentSlide} priority={isFirstSlide} />
        </AnimatePresence>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true" aria-label="Current slide">
        {`Slide ${activeIndex + 1} of ${totalSlides}: ${currentSlide.headline}`}
      </div>
    </section>
  );
}
