"use client";

import Image from "next/image";
import { useState } from "react";

interface HeroImageProps {
  className?: string;
}

const HERO_IMAGE_SRC = "/images/hero/hero-v13.png";

const HERO_IMAGE_ALT =
  "A child reading a magical storybook in a warm premium library";

export function HeroImage({ className = "" }: HeroImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      {/* Placeholder */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--surface-warm-200,#EFE7DA)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_32%_36%,var(--accent-primary,#B5764B)_0%,transparent_55%)] opacity-[0.10]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-16 w-16 text-[var(--text-primary,#2A241D)] opacity-[0.10]"
        >
          <path d="M32 14c-6-5-15-6-22-3v34c7-3 16-2 22 3 6-5 15-6 22-3V11c-7-3-16-2-22 3z" />
          <path d="M32 14v34" />
        </svg>
      </div>

      {!errored && (
        <Image
          src={HERO_IMAGE_SRC}
          alt={HERO_IMAGE_ALT}
          fill
          priority
          quality={100}
          sizes="(min-width:1024px) 55vw,100vw"
          className={`object-contain object-left transition-opacity duration-700 ${
           loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}