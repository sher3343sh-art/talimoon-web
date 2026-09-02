"use client";

/**
 * Reveal — the one entrance primitive for the Personalized Books sales
 * page (Sales V2). A short translate+fade that plays once as the
 * element scrolls into view, with a hard opt-out for
 * `prefers-reduced-motion` (no transform, no transition — content is
 * simply present).
 *
 * Robustness, in order:
 *  1. if the element is already within (or just below) the viewport at
 *     mount, it is shown immediately — covers above-the-fold content
 *     and a restored scroll position with no animation lag;
 *  2. otherwise an IntersectionObserver reveals it on scroll-in;
 *  3. a 2s timeout is a last-resort guarantee that content is never
 *     left invisible if the observer never fires.
 *
 * Deliberately CSS-only: the rest of this page's sections have always
 * animated with plain transitions rather than a motion library (see
 * the Hero's `tm-reveal`).
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

    const vh = window.innerHeight || 800;
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.95 && r.bottom > 0) {
      setShown(true);
      return;
    }

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setShown(true);
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(el);
    }

    const fallback = window.setTimeout(() => {
      setShown(true);
      io?.disconnect();
    }, 2000);

    return () => {
      io?.disconnect();
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
