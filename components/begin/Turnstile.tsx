"use client";

// Minimal Cloudflare Turnstile integration — the OFFICIAL script directly,
// no npm wrapper package. Renders NO visible UI (invisible/managed mode):
// Cloudflare only shows an interactive challenge itself when its own risk
// signals require it, so this never changes the order flow's layout.
//
// One widget is created per `execute()` call and torn down immediately
// after resolving, so a token is never reused across submission attempts —
// bypassing/weakening the real backend Turnstile check is not possible from
// here; this only produces the token the backend independently verifies.

import Script from "next/script";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type TurnstileWidgetId = string;

interface TurnstileRenderOptions {
  sitekey: string;
  size?: "invisible" | "normal" | "compact";
  retry?: "auto" | "never";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
}

interface TurnstileWindowApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => TurnstileWidgetId;
  execute: (widgetId: TurnstileWidgetId) => void;
  remove: (widgetId: TurnstileWidgetId) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileWindowApi;
  }
}

export interface TurnstileHandle {
  /** Runs one challenge and resolves a fresh, single-use token, or rejects
   *  on failure/timeout. Callers must treat a rejection as retry-safe. */
  execute: () => Promise<string>;
}

const EXECUTE_TIMEOUT_MS = 30_000;

const Turnstile = forwardRef<TurnstileHandle, { siteKey: string | undefined }>(function Turnstile(
  { siteKey },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useImperativeHandle(ref, () => ({
    execute: () =>
      new Promise<string>((resolve, reject) => {
        if (!siteKey) {
          reject(new Error("Turnstile is not configured"));
          return;
        }
        const api = window.turnstile;
        const container = containerRef.current;
        if (!scriptReady || !api || !container) {
          reject(new Error("Turnstile is not ready yet"));
          return;
        }

        let widgetId: TurnstileWidgetId | null = null;
        const timeout = setTimeout(() => {
          if (widgetId) api.remove(widgetId);
          reject(new Error("Turnstile challenge timed out"));
        }, EXECUTE_TIMEOUT_MS);

        try {
          widgetId = api.render(container, {
            sitekey: siteKey,
            size: "invisible",
            retry: "never",
            callback: (token) => {
              clearTimeout(timeout);
              if (widgetId) api.remove(widgetId);
              resolve(token);
            },
            "error-callback": () => {
              clearTimeout(timeout);
              if (widgetId) api.remove(widgetId);
              reject(new Error("Turnstile challenge failed"));
            },
            "expired-callback": () => {
              clearTimeout(timeout);
              if (widgetId) api.remove(widgetId);
              reject(new Error("Turnstile challenge expired"));
            },
          });
          api.execute(widgetId);
        } catch (err) {
          clearTimeout(timeout);
          reject(err instanceof Error ? err : new Error("Turnstile render failed"));
        }
      }),
  }));

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={containerRef} aria-hidden="true" style={{ display: "none" }} />
    </>
  );
});

export default Turnstile;
