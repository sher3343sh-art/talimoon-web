"use client";

/**
 * Site-wide language switch — client-only, no route/URL changes.
 * The Navbar's language dropdown used to hold its own local
 * `useState`, so picking a language did nothing outside that one
 * component; this lifts it to a single Context at the root layout so
 * every component can read the current language and re-render its
 * own text. Persisted to localStorage so it survives navigation
 * between pages (a plain in-memory Context would silently reset to
 * English on every route change, defeating the point).
 *
 * The persisted value is read through `useSyncExternalStore`, not a
 * `useState` + `useEffect(() => setState(...), [])` pair — that
 * pattern (a) trips `react-hooks/set-state-in-effect`, and (b) still
 * has to render the English default for one frame regardless, since
 * `window.localStorage` isn't available during SSR. `useSyncExternalStore`
 * is React's purpose-built API for exactly this "read a value the
 * server can't see, without a hydration mismatch" case: it renders
 * `getServerSnapshot`'s value ("EN") for the first (SSR-matching)
 * client pass, then immediately re-renders with the real stored
 * value — no manual effect, no extra intermediate render caused by
 * an effect body calling setState.
 *
 * Only English and Uzbek have real translated content. Russian and
 * Arabic stay selectable in the menu (unchanged) but fall back to
 * English content via `useT` below — the same no-op behavior they
 * already had before this feature existed, not a regression.
 */

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type Language = "UZ" | "EN" | "RU" | "AR";

const STORAGE_KEY = "talimoon-language";
const VALID_LANGUAGES: readonly Language[] = ["UZ", "EN", "RU", "AR"];

type Listener = () => void;
let listeners: Listener[] = [];
let currentLanguage: Language = readStoredLanguage();

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "EN";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && (VALID_LANGUAGES as string[]).includes(stored) ? (stored as Language) : "EN";
}

function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Language {
  return currentLanguage;
}

function getServerSnapshot(): Language {
  return "EN";
}

function setStoredLanguage(next: Language): void {
  currentLanguage = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setStoredLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/**
 * Per-component translation picker: `const t = useT(EN_COPY, UZ_COPY)`
 * then read `t.heading`, `t.body`, etc. Only UZ has a real second
 * copy today; every other language reads the English object.
 */
export function useT<T>(en: T, uz: T): T {
  const { language } = useLanguage();
  return language === "UZ" ? uz : en;
}
