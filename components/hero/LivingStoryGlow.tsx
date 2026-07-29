import type { CSSProperties } from "react";

interface LivingStoryGlowProps {
  /** Positions/sizes the glow for a specific breakpoint or image crop. */
  className?: string;
  style?: CSSProperties;
}

/**
 * LivingStoryGlow
 * ----------------------------------------------------------------
 * The single connective element between book → story → child, per
 * Hero High-Fidelity Specification v3.0, "Living Story Integration."
 *
 * Non-negotiable constraints carried over from the spec:
 * - Opacity ceiling: effective alpha must never exceed ~0.08. The
 *   resting state sits near 0.06; the one-time load pulse breathes
 *   up to ~0.08 and back, never higher.
 * - No hard edges, no particles, no color outside the image's own
 *   warm highlight range — this must read as ambient light, not an
 *   applied graphic effect.
 * - Purely decorative: excluded from the accessibility tree.
 * - The pulse runs once on load and is fully disabled under
 *   prefers-reduced-motion, leaving the glow at its static resting
 *   opacity with no animation.
 *
 * Extracted as its own component (rather than inlined in Hero.tsx)
 * because its scoped keyframes and opacity-safety logic are a
 * self-contained concern that a designer/reviewer may need to tune
 * in isolation once real photography replaces the placeholder.
 */
export function LivingStoryGlow({ className = "", style }: LivingStoryGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`living-story-glow pointer-events-none absolute ${className}`}
      style={style}
    >
      {/*
        Plain <style> tag (no animation library) so the component stays
        fully self-contained and requires no tailwind.config changes to
        render correctly out of the box.
      */}
      <style>{`
        .living-story-glow {
          width: 220px;
          height: 56px;
          border-radius: 9999px;
          background: radial-gradient(
            60% 100% at 30% 50%,
            rgba(213, 165, 116, 0.08) 0%,
            rgba(213, 165, 116, 0) 70%
          );
          filter: blur(8px);
          opacity: 0.75; /* effective alpha ~0.06 at rest (0.08 * 0.75) */
          animation: living-story-pulse 3s ease-in-out 1;
          animation-delay: 900ms; /* settles in after the entrance sequence resolves */
          animation-fill-mode: both;
        }

        @keyframes living-story-pulse {
          0%,
          100% {
            opacity: 0.75; /* ~0.06 effective */
          }
          50% {
            opacity: 1; /* ~0.08 effective — the spec's amplitude ceiling */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .living-story-glow {
            animation: none;
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}
