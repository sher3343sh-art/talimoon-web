"use client";

/**
 * Reveal — the one entrance primitive for the Personalized Books sales
 * page. A short translate+fade that plays once as the element scrolls
 * into view, with a hard opt-out for `prefers-reduced-motion` (content
 * is simply present, no transform/transition).
 *
 * Visibility is GUARANTEED. In order:
 *  1. if the element is in / near the viewport at mount, it shows at once;
 *  2. an IntersectionObserver reveals it on scroll-in;
 *  3. a passive scroll/resize listener re-checks the rect (covers a
 *     programmatic jump the observer can miss);
 *  4. a 900ms timeout is a last-resort guarantee — content is never left
 *     invisible.
 * CSS-only motion; no animation library.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** ms — stagger against sibling reveals. */
  delay?: number;
  /** px of initial downward offset. */
  y?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallback);
    };

    const inView = () => {
      const vh = window.innerHeight || 800;
      const r = el.getBoundingClientRect();
      // reveal once the element enters the lower ~92% of the viewport
      // (or is anywhere above it after a jump)
      return r.top < vh * 0.92 && r.bottom > 0;
    };

    if (inView()) {
      setShown(true);
      return;
    }

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    }

    const onScroll = () => {
      if (inView()) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const fallback = window.setTimeout(reveal, 900);

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(fallback);
    };
  }, []);

  const style: CSSProperties | undefined = reduced
    ? undefined
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 620ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

export default Reveal;
