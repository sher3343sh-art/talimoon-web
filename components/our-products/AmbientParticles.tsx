"use client";

import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = [
  { left: "12%", delay: 0 },
  { left: "27%", delay: 1.4 },
  { left: "46%", delay: 0.6 },
  { left: "63%", delay: 2.1 },
  { left: "78%", delay: 0.9 },
  { left: "90%", delay: 1.8 },
];

type AmbientParticlesProps = {
  /** Tailwind classes for the dot's own color/size. Defaults match the Our Products wall (light dots for a dark backdrop). */
  dotClassName?: string;
  /** Tailwind class for the dots' starting vertical position. */
  originClassName?: string;
};

/**
 * Slow-drifting motes — decorative only. Isolated in its own client
 * component so callers (FourDoorsSection, StoryLibraryPreview) can
 * stay server components. Color/origin are overridable so a light
 * backdrop can use dark dots instead of the default light-on-dark set.
 */
export function AmbientParticles({
  dotClassName = "h-1 w-1 rounded-full bg-[var(--paper-50)]",
  originClassName = "bottom-[10%]",
}: AmbientParticlesProps = {}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <>
      {PARTICLES.map((particle, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className={["absolute", originClassName, dotClassName].join(" ")}
          style={{ left: particle.left }}
          animate={{ y: [0, -140, -260], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </>
  );
}

export default AmbientParticles;
