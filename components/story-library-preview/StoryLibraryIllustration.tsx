"use client";

/**
 * StoryLibraryIllustration — the Story Library preview's single visual.
 * ----------------------------------------------------------------
 * Production art (public/images/home/story-library-preview/storylibrary.webp),
 * not a generated graphic — this component only places and animates it.
 * On scroll into view it settles in with one slow fade/rise/scale; no
 * looping motion, no particles, nothing competing with the CTA beside it.
 */

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useT } from "@/lib/i18n/LanguageContext";

const reveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const ALT_EN = "TALIMOON Story Library illustration representing reading, listening and watching stories.";
const ALT_UZ = "TALIMOON Hikoyalar kutubxonasi tasviri — o'qish, tinglash va tomosha qilish orqali hikoyalarni his qilish.";

export function StoryLibraryIllustration() {
  const reducedMotion = useReducedMotion();
  const alt = useT(ALT_EN, ALT_UZ);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.7 });
  const y = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.7 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
    rawY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 8);
  };

  const resetParallax = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={reveal}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
      className="relative -ms-[6%] w-[112%] max-w-none sm:-ms-[2%] sm:w-[104%] lg:-ms-[7.5%] lg:w-[115%] lg:max-w-[720px]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[18%_20%_12%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(218,177,86,0.22) 0%, rgba(218,177,86,0.08) 42%, transparent 72%)",
          filter: "blur(18px)",
        }}
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.48, 0.82, 0.48], scale: [0.98, 1.035, 0.98] }
        }
        transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div style={reducedMotion ? undefined : { x, y }}>
        <Image
          src="/images/home/story-library-preview/storylibrary.webp"
          alt={alt}
          width={1536}
          height={1024}
          fill={false}
          priority
          quality={100}
          sizes="(min-width: 1024px) 68vw, 112vw"
          className="h-auto w-full object-contain drop-shadow-[0_22px_28px_rgba(28,42,58,0.12)]"
        />
      </motion.div>
    </motion.div>
  );
}

export default StoryLibraryIllustration;
