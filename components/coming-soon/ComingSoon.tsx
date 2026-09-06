"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/LanguageContext";

export interface ComingSoonProps {
  title: string;
  message: string;
}

const CHROME_EN = {
  comingSoon: "Coming Soon",
  backToHome: "Back to Home",
};

const CHROME_UZ: typeof CHROME_EN = {
  comingSoon: "Tez orada",
  backToHome: "Bosh sahifaga qaytish",
};

const CHROME_RU: typeof CHROME_EN = {
  comingSoon: "Скоро",
  backToHome: "Вернуться на главную",
};

export function ComingSoon({ title, message }: ComingSoonProps) {
  const t = useT(CHROME_EN, CHROME_UZ, CHROME_RU);

  return (
    <main className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[var(--surface-base)] px-6 py-32 text-center">
      <p className="font-sans text-label uppercase tracking-[0.18em] text-text-secondary">
        {t.comingSoon}
      </p>
      <h1 className="mt-4 font-serif text-display text-text-primary">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-[48ch] font-sans text-body text-text-secondary">
        {message}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center justify-center rounded px-8 font-sans text-sm font-medium tracking-[0.02em] text-white bg-accent-primary hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
      >
        {t.backToHome}
      </Link>
    </main>
  );
}
