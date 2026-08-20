"use client";

/**
 * StoryLibraryIllustration — the Story Library preview's single visual.
 * ----------------------------------------------------------------
 * Production art (public/images/home/story-library-preview/storylibrary.png),
 * not a generated graphic — this component only places and animates it.
 * On scroll into view it settles in with one slow fade/rise/scale; no
 * looping motion, no particles, nothing competing with the CTA beside it.
 */

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

  return (
    <motion.div
      initial={reducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={reveal}
      className="relative mx-auto w-[85%] max-w-[560px] sm:w-full lg:max-w-[620px]"
    >
      <Image
        src="/images/home/story-library-preview/storylibrary.png"
        alt={alt}
        width={1536}
        height={1024}
        fill={false}
        priority
        quality={100}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="h-auto w-full object-contain"
      />
    </motion.div>
  );
}

export default StoryLibraryIllustration;
