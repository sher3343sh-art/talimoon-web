// FILE: src/components/hero/Hero.tsx
// Enterprise-grade single-file implementation of TALIMOON Hero Slider

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

type ScrimType = 'ink' | 'cream';

interface HeroSlideData {
  readonly id: string;
  readonly name: string;
  readonly headline: string;
  readonly description: string;
  readonly image: {
    readonly src: string;
    readonly alt: string;
    readonly focalPoint: { readonly x: number; readonly y: number };
  };
  readonly scrim: ScrimType;
  readonly navColor: ScrimType;
}

interface HeroConfig {
  readonly dwellTime: number;
  readonly transitionDuration: number;
  readonly textDelay: number;
  readonly kenBurnsScale: number;
  readonly tickWidth: {
    readonly inactive: number;
    readonly active: number;
  };
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
    scrim: 'ink',
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
    scrim: 'cream',
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
    scrim: 'cream',
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
    scrim: 'ink',
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
    scrim: 'ink',
    navColor: 'cream',
  },
] as const;

const HERO_CONFIG: HeroConfig = {
  dwellTime: 7000,
  transitionDuration: 1000,
  textDelay: 200,
  kenBurnsScale: 1.03,
  tickWidth: {
    inactive: 24,
    active: 40,
  },
};

// ============================================================
// Animation Definitions
// ============================================================

const imageTransition: Transition = {
  duration: HERO_CONFIG.transitionDuration / 1000,
  ease: 'easeInOut',
};

const textTransition: Transition = {
  duration: 0.8,
  delay: HERO_CONFIG.textDelay / 1000,
  ease: [0.25, 0.1, 0.25, 1],
};

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
      duration: 10,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse',
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

const tickVariants: Variants = {
  inactive: {
    width: HERO_CONFIG.tickWidth.inactive,
    opacity: 0.3,
  },
  active: {
    width: HERO_CONFIG.tickWidth.active,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

// ============================================================
// Helper Functions
// ============================================================

const getTextColor = (scrim: ScrimType): string =>
  scrim === 'ink' ? 'text-ink' : 'text-cream';

const getScrimColor = (type: ScrimType): string =>
  type === 'ink'
    ? 'rgba(42, 36, 29, 0.28)'
    : 'rgba(247, 242, 234, 0.35)';

const getScrimGradient = (type: ScrimType, isMobile: boolean): string => {
  const color = getScrimColor(type);
  const direction = isMobile ? 'to bottom' : 'to right';
  return `linear-gradient(${direction}, transparent 0%, transparent 30%, ${color} 100%)`;
};

// ============================================================
// Hooks
// ============================================================

/**
 * Production‑safe media query hook that avoids hydration mismatches.
 * Uses `useState` with initial `false` and updates in `useEffect`.
 * Properly cleans up event listeners.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    // Update state immediately to avoid a flash of incorrect value
    setMatches(media.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Keyboard navigation hook for arrow keys.
 * Uses refs to avoid stale closures.
 */
function useKeyboardNavigation({
  onPrev,
  onNext,
  disabled = false,
}: {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}): void {
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  useEffect(() => {
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  }, [onPrev, onNext]);

  useEffect(() => {
    if (disabled) return;

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
  }, [disabled]);
}

/**
 * Autoplay hook with robust timer management.
 * Uses `setTimeout` chain to avoid overlapping timers.
 * Prevents race conditions and memory leaks.
 * Respects pause on hover.
 */
function useHeroAutoplay({
  enabled,
  delay,
  onTick,
  pauseOnHover = true,
}: {
  enabled: boolean;
  delay: number;
  onTick: () => void;
  pauseOnHover?: boolean;
}): {
  isPaused: boolean;
  togglePause: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
} {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringRef = useRef<boolean>(false);
  const onTickRef = useRef(onTick);

  // Keep onTick fresh without causing timer restarts
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((): void => {
    // Do not start if paused or disabled or hovering (if pauseOnHover)
    if (!enabled || isPaused || (pauseOnHover && isHoveringRef.current)) {
      return;
    }
    clearTimer();
    timerRef.current = setTimeout(() => {
      onTickRef.current();
      startTimer(); // chain the next tick
    }, delay);
  }, [enabled, isPaused, pauseOnHover, delay, clearTimer]);

  const pause = useCallback((): void => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback((): void => {
    setIsPaused(false);
    // Start immediately if not hovering (or pauseOnHover is false)
    if (!isHoveringRef.current || !pauseOnHover) {
      startTimer();
    }
  }, [pauseOnHover, startTimer]);

  const togglePause = useCallback((): void => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  }, [isPaused, pause, resume]);

  const handleMouseEnter = useCallback((): void => {
    if (!pauseOnHover) return;
    isHoveringRef.current = true;
    if (!isPaused) {
      pause();
    }
  }, [pauseOnHover, isPaused, pause]);

  const handleMouseLeave = useCallback((): void => {
    if (!pauseOnHover) return;
    isHoveringRef.current = false;
    if (!isPaused) {
      startTimer();
    }
  }, [pauseOnHover, isPaused, startTimer]);

  // Start/reset when enabled or delay changes
  useEffect(() => {
    if (enabled && !isPaused && !isHoveringRef.current) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [enabled, delay, isPaused, startTimer, clearTimer]);

  return {
    isPaused,
    togglePause,
    handleMouseEnter,
    handleMouseLeave,
  };
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
    <motion.div
      className={`absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={imageTransition}
    >
      <motion.div
        className="relative w-full h-full"
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
    </motion.div>
  );
});

// --- HeroScrim ---
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

// --- HeroTextBlock ---
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
  const topOffset = isMobile ? 'top-[60%]' : 'top-[55%]';

  return (
    <motion.div
      className={`
        absolute left-0 right-0 ${topOffset} transform -translate-y-1/2
        flex flex-col items-start
        ${isMobile ? 'px-6 text-center items-center' : 'px-16 items-start'}
        ${textColor}
        max-w-full md:max-w-[480px] lg:max-w-[480px]
      `}
      variants={textBlockVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={textTransition}
    >
      <motion.span
        className="text-xs uppercase tracking-widest font-sans font-medium mb-1"
        variants={textItemVariants}
      >
        {eyebrow}
      </motion.span>

      <motion.h1
        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-bold mb-4"
        variants={textItemVariants}
      >
        {headline}
      </motion.h1>

      <motion.p
        className="text-base sm:text-lg max-w-[34ch] leading-relaxed"
        variants={textItemVariants}
      >
        {description}
      </motion.p>
    </motion.div>
  );
});

// --- HeroIndicators ---
interface HeroIndicatorsProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  scrimType: ScrimType;
  panelId: string;
  className?: string;
}

const HeroIndicators = memo(function HeroIndicators({
  total,
  activeIndex,
  onSelect,
  scrimType,
  panelId,
  className = '',
}: HeroIndicatorsProps) {
  const isInk = scrimType === 'ink';

  return (
    <div className={`flex items-center gap-3 ${className}`} role="tablist">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={isActive ? panelId : undefined}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onSelect(index)}
            className={`
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isInk ? 'focus:ring-ink focus:ring-offset-cream' : 'focus:ring-cream focus:ring-offset-ink'}
              transition-opacity hover:opacity-80
            `}
          >
            <motion.span
              className={`
                block h-0.5 rounded-full transition-colors
                ${isInk ? 'bg-ink' : 'bg-cream'}
                ${isActive ? 'opacity-100' : 'opacity-30'}
              `}
              variants={tickVariants}
              initial="inactive"
              animate={isActive ? 'active' : 'inactive'}
            />
          </button>
        );
      })}
    </div>
  );
});

// --- HeroNavigation ---
interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}

const HeroNavigation = memo(function HeroNavigation({
  onPrev,
  onNext,
  disabled = false,
}: HeroNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        className={`
          p-2 rounded-full bg-black/20 backdrop-blur-sm text-white
          hover:bg-black/40 transition-colors
          focus:outline-none focus:ring-2 focus:ring-white/70
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        className={`
          p-2 rounded-full bg-black/20 backdrop-blur-sm text-white
          hover:bg-black/40 transition-colors
          focus:outline-none focus:ring-2 focus:ring-white/70
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
});

// --- HeroAutoplayControl ---
interface HeroAutoplayControlProps {
  isPaused: boolean;
  onToggle: () => void;
}

const HeroAutoplayControl = memo(function HeroAutoplayControl({
  isPaused,
  onToggle,
}: HeroAutoplayControlProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        p-2 rounded-full bg-black/20 backdrop-blur-sm text-white
        hover:bg-black/40 transition-colors
        focus:outline-none focus:ring-2 focus:ring-white/70
      `}
      aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
    >
      {isPaused ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      )}
    </button>
  );
});

// --- HeroSlide ---
interface HeroSlideProps {
  slide: HeroSlideData;
  isMobile: boolean;
  priority: boolean;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

const HeroSlide = memo(
  function HeroSlide({
    slide,
    isMobile,
    priority,
    onTransitionStart,
    onTransitionComplete,
  }: HeroSlideProps) {
    const { image, scrim, ...textData } = slide;

    return (
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={imageTransition}
        onAnimationStart={onTransitionStart}
        onAnimationComplete={onTransitionComplete}
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

        <div
          className={`
            absolute inset-0 z-10
            flex
            ${isMobile ? 'items-end justify-center' : 'items-center justify-end'}
          `}
        >
          <div
            className={`
              relative
              ${isMobile ? 'w-full h-[50%]' : 'w-[35%] h-full'}
            `}
          >
            <HeroScrim type={scrim} isMobile={isMobile} />
            <HeroTextBlock
              eyebrow={textData.name}
              headline={textData.headline}
              description={textData.description}
              isMobile={isMobile}
              scrimType={scrim}
            />
          </div>
        </div>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.slide.id === next.slide.id &&
    prev.isMobile === next.isMobile &&
    prev.priority === next.priority
);

// ============================================================
// Main Export: HeroSlider
// ============================================================

interface HeroSliderProps {
  onNavColorChange?: (color: 'ink' | 'cream') => void;
}

export function HeroSlider({ onNavColorChange }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[activeIndex];

  // Notify parent of nav color change
  useEffect(() => {
    if (onNavColorChange) {
      onNavColorChange(currentSlide.navColor);
    }
  }, [activeIndex, currentSlide.navColor, onNavColorChange]);

  // Preload next image for performance (React 19's preload is idempotent
  // and SSR-safe, so no manual dedup/DOM handling is needed here).


  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      let target = index;
      if (target < 0) target = totalSlides - 1;
      if (target >= totalSlides) target = 0;
      setActiveIndex(target);
    },
    [isTransitioning, totalSlides]
  );

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  const { isPaused, togglePause, handleMouseEnter, handleMouseLeave } =
    useHeroAutoplay({
      enabled: true,
      delay: HERO_CONFIG.dwellTime,
      onTick: goToNext,
      pauseOnHover: true,
    });

  useKeyboardNavigation({
    onPrev: goToPrev,
    onNext: goToNext,
    disabled: isTransitioning,
  });

  const handleTransitionStart = useCallback(() => setIsTransitioning(true), []);
  const handleTransitionComplete = useCallback(() => setIsTransitioning(false), []);

  // Only the first slide gets priority to improve LCP
  const isFirstSlide = activeIndex === 0;

  return (
    <section
      className="relative w-full h-[100vh] h-[100dvh] overflow-hidden"
      aria-label="Featured content carousel"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <HeroSlide
            key={activeIndex}
            slide={currentSlide}
            isMobile={isMobile}
            priority={isFirstSlide}
            onTransitionStart={handleTransitionStart}
            onTransitionComplete={handleTransitionComplete}
          />
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-6 pointer-events-none">
        <HeroIndicators
          total={totalSlides}
          activeIndex={activeIndex}
          onSelect={goToSlide}
          scrimType={currentSlide.scrim}
          panelId={`hero-slide-${currentSlide.id}`}
          className="pointer-events-auto"
        />

        <div className="flex items-center gap-4 pointer-events-auto">
          <HeroAutoplayControl isPaused={isPaused} onToggle={togglePause} />
          <HeroNavigation
            onPrev={goToPrev}
            onNext={goToNext}
            disabled={isTransitioning}
          />
        </div>
      </div>

      {/* Live region for screen readers – announces slide changes */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Current slide"
      >
        {`Slide ${activeIndex + 1} of ${totalSlides}: ${currentSlide.headline}`}
      </div>
    </section>
  );
}