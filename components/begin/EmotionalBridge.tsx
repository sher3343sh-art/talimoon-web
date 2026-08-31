"use client";

/**
 * TALIMOON — ORDER — "Yuragingizda qolgan gaplar" (the emotional bridge).
 * ----------------------------------------------------------------------
 * Sits between "a personal touch" and the photo upload. Quieter and
 * more intimate than the selection-heavy phases: one narrow column,
 * generous whitespace, comfortable textareas, restrained motion, no
 * portrait card, no icons. Every field is optional and the whole
 * section can be walked straight through.
 *
 * The adult may privately describe a real, sometimes difficult
 * situation. TALIMOON keeps it as CONTEXT ONLY — never shown to the
 * child here, never copied into the story. The future story carries
 * only the safe emotional meaning: love, longing, reassurance, pride,
 * gratitude, hope, connection. Never blame, never sides. Stored per
 * child; one child's private context is never shown against another.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toLocale, directionFor } from "@/lib/journey/types";
import type { ChildProfile, EmotionalBridge as Bridge } from "@/lib/order/types";
import type { Honorific, RecipientRelationship } from "@/lib/order/relationship";
import {
  caregiverSelfRef,
  emotionalBridgeCopy,
  type Locale,
} from "@/lib/order/emotional-bridge-copy";
import { JourneyProgress } from "./JourneyProgress";

type Screen = "intro" | "situation" | "feeling" | "message" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EmotionalBridge({
  childrenIn,
  recipientRelationship,
  ordererHonorific,
  entry = "start",
  onPatchChild,
  onComplete,
  onBack,
}: {
  childrenIn: ChildProfile[];
  recipientRelationship: RecipientRelationship;
  ordererHonorific: Honorific | null;
  /** "start" for the normal forward entry; "end" when the customer
   *  steps back into the section from the photo upload, so they land
   *  on the last child's acknowledgement and can walk back to edit. */
  entry?: "start" | "end";
  onPatchChild: (id: string, patch: Partial<ChildProfile>) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const { language } = useLanguage();
  const locale: Locale = toLocale(language) === "uz" ? "uz" : "en";
  const dir = directionFor(toLocale(language));
  const c = emotionalBridgeCopy(locale);
  const reduced = useReducedMotion();

  const [idx, setIdx] = useState(entry === "end" ? childrenIn.length - 1 : 0);
  const [screen, setScreen] = useState<Screen>(entry === "end" ? "done" : "intro");

  const child = childrenIn[idx];
  const nextChild = childrenIn[idx + 1];
  const isLastChild = idx >= childrenIn.length - 1;
  const multi = childrenIn.length > 1;

  const bridge: Bridge = child.emotionalBridge ?? {};
  const setBridge = (p: Partial<Bridge>) =>
    onPatchChild(child.id, { emotionalBridge: { ...bridge, ...p } });

  const selfRef = caregiverSelfRef(recipientRelationship, ordererHonorific, locale);

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const t = window.setTimeout(
      () => headingRef.current?.focus({ preventScroll: true }),
      40,
    );
    return () => window.clearTimeout(t);
  }, [screen, idx]);

  function goNext() {
    switch (screen) {
      case "intro":
        setScreen("situation");
        break;
      case "situation":
        setScreen("feeling");
        break;
      case "feeling":
        setScreen("message");
        break;
      case "message":
        setBridge({ done: true });
        setScreen("done");
        break;
      case "done":
        if (isLastChild) onComplete();
        else {
          setIdx((i) => i + 1);
          setScreen("intro");
        }
        break;
    }
  }
  function goPrev() {
    switch (screen) {
      case "intro":
        if (idx === 0) onBack();
        else {
          setIdx((i) => i - 1);
          setScreen("done");
        }
        break;
      case "situation":
        setScreen("intro");
        break;
      case "feeling":
        setScreen("situation");
        break;
      case "message":
        setScreen("feeling");
        break;
      case "done":
        setScreen("message");
        break;
    }
  }

  const enter = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: EASE },
      };

  const ctaLabel =
    screen === "done" && !isLastChild ? c.nextChildCta(nextChild.name) : c.continue;
  const name = child.name;

  return (
    <section
      dir={dir}
      data-order-flow=""
      className="mx-auto w-full max-w-container-content bg-surface-base px-6 pb-20 pt-9 sm:px-8 md:pb-28 md:pt-12 lg:px-16"
    >
      <div className="mx-auto max-w-xl">
        <div className="mb-14 flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-secondary outline-none transition-opacity hover:opacity-70 focus-visible:underline"
          >
            <ArrowLeft size={14} strokeWidth={1.75} className="rtl:-scale-x-100" />
            {c.back}
          </button>
          <JourneyProgress locale={toLocale(language)} current={3} />
        </div>

        <p className="mb-5 font-sans text-[11.5px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
          {c.eyebrow}
        </p>

        <motion.div key={`${idx}-${screen}`} {...enter}>
          {screen === "intro" &&
            (idx === 0 ? (
              <div>
                <Heading headingRef={headingRef}>{c.introHeading}</Heading>
                <div className="mt-5 space-y-4">
                  {c.introBody.map((p, i) => (
                    <p
                      key={i}
                      className="max-w-[56ch] font-sans text-[15px] leading-[1.72] text-text-secondary"
                    >
                      {p}
                    </p>
                  ))}
                </div>
                <div className="mt-9 space-y-3 border-t border-border-subtle pt-6">
                  {c.trustNote.map((p, i) => (
                    <p
                      key={i}
                      className="max-w-[54ch] font-sans text-[12.5px] leading-[1.7] text-text-muted"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <Heading headingRef={headingRef}>{c.nextChildLead(name)}</Heading>
            ))}

          {screen === "situation" && (
            <div>
              <Heading headingRef={headingRef}>{c.q1(name, multi)}</Heading>
              <Help>{c.q1Help}</Help>
              <div className="mt-6">
                <textarea
                  rows={4}
                  value={bridge.privateContext ?? ""}
                  onChange={(e) => setBridge({ privateContext: e.target.value })}
                  placeholder={c.q1Placeholder}
                  className={box}
                />
              </div>
              <button type="button" onClick={() => setScreen("feeling")} className={skipClass}>
                {c.q1Skip}
                <ArrowRight size={13} strokeWidth={1.75} className="rtl:-scale-x-100" />
              </button>
            </div>
          )}

          {screen === "feeling" && (
            <div>
              <Heading headingRef={headingRef}>{c.q2(name, multi)}</Heading>
              <Help>{c.q2Help}</Help>
              <div className="mt-6">
                <textarea
                  rows={4}
                  value={bridge.intendedFeeling ?? ""}
                  onChange={(e) => setBridge({ intendedFeeling: e.target.value })}
                  placeholder={c.q2Placeholder}
                  className={box}
                />
              </div>
            </div>
          )}

          {screen === "message" && (
            <div>
              <Heading headingRef={headingRef}>{c.q3(name, multi)}</Heading>
              <Help>{c.q3Help}</Help>
              <ul className="mt-5 space-y-1.5">
                {c.q3Examples(selfRef).map((ex, i) => (
                  <li
                    key={i}
                    className="font-serif text-[14px] italic leading-[1.6] text-text-muted"
                  >
                    {"“"}
                    {ex}
                    {"”"}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <textarea
                  rows={3}
                  value={bridge.heartMessage ?? ""}
                  onChange={(e) => setBridge({ heartMessage: e.target.value })}
                  placeholder={c.q3Placeholder}
                  className={box}
                />
              </div>
            </div>
          )}

          {screen === "done" && (
            <div>
              <Heading headingRef={headingRef}>{c.ackHeading}</Heading>
              <p className="mt-5 max-w-[50ch] font-sans text-[15px] leading-[1.72] text-text-secondary">
                {c.ackBody}
              </p>
            </div>
          )}
        </motion.div>

        <div className="mt-12 flex items-center justify-end">
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-6 py-3 font-sans text-[14px] font-medium text-white outline-none transition-opacity duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {ctaLabel}
            <ArrowRight size={15} strokeWidth={1.75} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── shared pieces ────────────────────────────────────────────────

function Heading({
  children,
  headingRef,
}: {
  children: React.ReactNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <h2
      ref={headingRef}
      tabIndex={-1}
      style={{ outline: "none" }}
      className="font-display text-[22px] font-medium leading-[1.25] tracking-tight text-text-primary sm:text-[26px]"
    >
      {children}
    </h2>
  );
}

function Help({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-[54ch] font-sans text-[13px] leading-[1.6] text-text-secondary">
      {children}
    </p>
  );
}

const box =
  "w-full resize-none rounded-md border border-border-default bg-transparent px-4 py-3 font-sans text-[16px] leading-[1.6] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary";
const skipClass =
  "mt-3 inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:underline";
