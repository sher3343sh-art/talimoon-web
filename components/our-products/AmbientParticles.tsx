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

/**
 * Slow-drifting motes across the wall behind the doors — decorative
 * only. Isolated in its own client component so FourDoorsSection can
 * stay a server component.
 */
export function AmbientParticles() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <>
      {PARTICLES.map((particle, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute bottom-[10%] h-1 w-1 rounded-full bg-[var(--paper-50)]"
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
