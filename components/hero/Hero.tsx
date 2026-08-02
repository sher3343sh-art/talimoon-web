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
//
// v5 — targeted production fixes only, no architecture or desktop
// layout changes:
// 1. Mobile headline contrast fixed via a more graduated HERO_GRADIENT
//    (six stops instead of four, with a flatter near-bottom plateau
//    exactly where text sits), a two-layer text-shadow (tight + soft —
//    still an ordinary shadow, never a stroke/outline), and a
//    mobile-only font-weight bump (font-semibold, reverting to the
//    original font-medium at md: so desktop is unchanged).
// 2. HERO_BLUR_MASK's stops now mirror HERO_GRADIENT's exactly, so the
//    backdrop-blur fades in lockstep with the darkening instead of
//    ending at a visibly different point — this is the actual fix for
//    "looks like a flat gradient sitting on the photo" rather than the
//    photo itself going quietly soft toward the bottom.
// 3. New HERO_SECTION_TRANSITION — a short band at the Hero's true
//    bottom edge (well inside HeroText's padding reserve, never
//    touching a glyph) fading into the exact cream token "How It
//    Works" opens with, so the two sections no longer meet at a hard
//    edge.
// 4. Ken Burns no longer animates x/y translate. That, combined with
//    the default (center) transform-origin it used before, was the
//    actual cause of the reported "zoom drifts back toward center" —
//    scaling from the box's center fights a left-biased object-position
//    over time. Fix: scale only, with transform-origin pinned to the
//    same focal-point percentage object-position already uses, so the
//    subject stays visually stationary through the entire zoom.

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

// A graduated, six-stop curve rather than a blunt 4-stop one — the
// point isn't just "get darker," it's an eased falloff so the darkening
// itself feels like part of the photo's own tonal range instead of a
// panel dropped on top. The plateau near the bottom (0-18%, staying
// above 0.8 alpha) is what actually fixed mobile headline contrast —
// previously that same zone had already started thinning out this high
// up, which is exactly where the text sits. Same navy as the Navbar
// tokens (#1C2A3A) throughout, no new color introduced.
const HERO_GRADIENT =
  'linear-gradient(to top, ' +
  'rgba(28,42,58,0.94) 0%, ' +
  'rgba(28,42,58,0.82) 18%, ' +
  'rgba(28,42,58,0.55) 38%, ' +
  'rgba(28,42,58,0.28) 56%, ' +
  'rgba(28,42,58,0.08) 70%, ' +
  'transparent 84%)';

// Mirrors HERO_GRADIENT's exact stops (not just its endpoints) so the
// blur's intensity ramps down in lockstep with the darkness — this is
// what makes the blur read as "the image itself going slightly soft
// toward the bottom" rather than a separate hard-edged blurred rectangle
// sitting on top of a separately-edged dark rectangle.
const HERO_BLUR_MASK =
  'linear-gradient(to top, ' +
  'rgba(0,0,0,1) 0%, ' +
  'rgba(0,0,0,0.9) 18%, ' +
  'rgba(0,0,0,0.6) 38%, ' +
  'rgba(0,0,0,0.3) 56%, ' +
  'rgba(0,0,0,0.09) 70%, ' +
  'rgba(0,0,0,0) 84%)';

// A short, separate handoff at the true bottom edge — fades the Hero's
// last ~40-56px into the exact cream token the next section
// (--surface-warm-100, #F7F2EA) opens with, so the seam between the two
// sections disappears instead of cutting hard from photo to flat cream.
// Sits within HeroText's own bottom padding reserve, so it never
// crosses into the text itself.
const HERO_SECTION_TRANSITION =
  'linear-gradient(to top, #F7F2EA 0%, rgba(247,242,234,0) 100%)';

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
//
// Scale only now — no x/y translate. The previous version animated a
// translate alongside the scale using the element's default (50% 50%)
// transform-origin, which is what caused the reported "drift back
// toward center": scaling from the geometric center while the visible
// crop was already left-biased (via object-position) meant growth
// pulled the frame toward showing more of what's right of center over
// time, fighting the static focal point instead of respecting it. The
// fix lives in HeroImage below — transform-origin is now set to the
// same focal-point percentage object-position already uses, so scale
// grows outward *from* the subject instead of from the box's center,
// and the subject's on-screen position never moves.
const kenBurnsVariants = (): Variants => ({
  initial: {
    scale: 1,
  },
  animate: {
    scale: HERO_CONFIG.kenBurnsScale,
    transition: {
      duration: HERO_CONFIG.dwellTime / 1000,
      ease: 'linear',
    },
  },
  exit: {
    scale: 1,
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
    return kenBurnsVariants();
  }, [reducedMotion]);

  // Same anchor object-position uses below, applied as the scale's
  // transform-origin — this is what keeps the focal subject visually
  // stationary while the image grows around it (see the note on
  // kenBurnsVariants above for why this replaces the old x/y drift).
  const focalOrigin = `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          transformOrigin: focalOrigin,
          ...(reducedMotion ? { transform: 'none' } : null),
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: focalOrigin,
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
          not a new color. Two shadow layers (tight + soft) rather than
          one, for the same reason as the headline below. */}
      <motion.span
        className="mb-2 block text-[13px] font-sans font-medium uppercase tracking-[0.18em] md:mb-3 md:text-[14px]"
        style={{
          color: 'rgb(224, 194, 130)',
          textShadow: '0 1px 2px rgba(0,0,0,0.35), 0 1px 6px rgba(0,0,0,0.2)',
        }}
        variants={textItemVariants}
      >
        {eyebrow}
      </motion.span>

      {/* Gold divider — same lyxury-brand detail carried over unchanged. */}
      <motion.span
        className="mb-4 block h-[1.5px] w-10 bg-[#C9A227] md:mb-5"
        variants={textItemVariants}
      />

      {/* font-semibold on mobile only (md: reverts to the original
          font-medium, so desktop is unchanged) — a small, deliberate
          weight increase that reads as crisper against a photo at
          small sizes without looking like a different typeface. Paired
          with a two-layer shadow: a tight, higher-alpha pass for edge
          definition against busy image detail, plus the original soft
          pass for depth — neither is a stroke/outline, both are
          ordinary text-shadow. */}
      <motion.h1
        className="mb-3 font-serif text-[30px] font-semibold leading-[1.14] tracking-tight md:mb-4 md:text-[46px] md:font-medium lg:text-[54px] xl:text-[60px]"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.3)' }}
        variants={textItemVariants}
      >
        {headline}
      </motion.h1>

      <motion.p
        className="max-w-[34ch] text-[14px] font-normal leading-relaxed md:max-w-[40ch] md:text-[16px]"
        style={{
          color: 'rgba(247, 242, 234, 0.92)',
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
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

        {/* Section-transition handoff: a short band at the true bottom
            edge only (well inside HeroText's own bottom padding, so it
            never overlaps a glyph), fading into the exact cream token
            "How It Works" opens with. This is what removes the hard
            seam between the two sections — see HERO_SECTION_TRANSITION. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-8 md:h-12 lg:h-14"
          style={{ backgroundImage: HERO_SECTION_TRANSITION }}
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
