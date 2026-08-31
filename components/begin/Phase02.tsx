"use client";

/**
 * TALIMOON — ORDER — Phase 02: "The child's world".
 * ----------------------------------------------------------------
 * A short, warm conversation about each child in turn — what makes
 * their eyes light up, one telling detail, what absorbs them, and a
 * dream (told by the child, or hoped by the adult). Alongside it a
 * quiet portrait — "FAYZBEKNING DUNYOSI" — fills in as the adult
 * answers. Ends with a bridge toward the child's character.
 *
 * Child-centric: every answer is written straight onto the child by
 * stable id, so back-navigation and multi-child order never lose a
 * thing. Phase 03 (character) is NOT built here.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toLocale, directionFor } from "@/lib/journey/types";
import {
  reconcileDream,
  type ChildProfile,
  type DreamStatus,
} from "@/lib/order/types";
import {
  MAX_PRIMARY_INTERESTS,
  interestLabel,
  interestOptions,
  isInterestKey,
  phase02Copy,
  type Locale,
} from "@/lib/order/phase02-copy";
import { JourneyProgress } from "./JourneyProgress";
import { ChildWorld } from "./ChildWorld";

type Screen =
  | "intro"
  | "interests"
  | "deepen"
  | "activity"
  | "dream-route"
  | "child-dream"
  | "adult-hope"
  | "child-done";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Phase02({
  childrenIn,
  onPatchChild,
  onComplete,
  onBack,
}: {
  childrenIn: ChildProfile[];
  onPatchChild: (id: string, patch: Partial<ChildProfile>) => void;
  onComplete: () => void;
  onBack: () => void;
}) {
  const { language } = useLanguage();
  const locale = toLocale(language) === "uz" ? "uz" : ("en" as Locale);
  const dir = directionFor(toLocale(language));
  const c = phase02Copy(locale);
  const reduced = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const [screen, setScreen] = useState<Screen>("intro");
  const [attempted, setAttempted] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customDraft, setCustomDraft] = useState("");
  const [limitHint, setLimitHint] = useState(false);

  const child = childrenIn[idx];
  const nextChild = childrenIn[idx + 1];
  const isLastChild = idx >= childrenIn.length - 1;

  const patch = (p: Partial<ChildProfile>) => onPatchChild(child.id, p);

  // ── focus the new question on every scene ──────────────────────
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const t = window.setTimeout(
      () => headingRef.current?.focus({ preventScroll: true }),
      40,
    );
    return () => window.clearTimeout(t);
  }, [screen, idx]);

  // ── interests ─────────────────────────────────────────────────
  const interests = child.interests ?? [];
  const atLimit = interests.length >= MAX_PRIMARY_INTERESTS;

  function toggleInterest(key: string) {
    if (interests.includes(key)) {
      patch({ interests: interests.filter((v) => v !== key) });
      setLimitHint(false);
      return;
    }
    if (atLimit) {
      setLimitHint(true);
      return;
    }
    patch({ interests: [...interests, key] });
    setAttempted(false);
  }
  function addCustom() {
    const v = customDraft.trim();
    if (!v) return;
    if (atLimit) {
      setLimitHint(true);
      return;
    }
    if (interests.some((x) => x.toLocaleLowerCase() === v.toLocaleLowerCase())) {
      setCustomDraft("");
      return;
    }
    patch({ interests: [...interests, v] });
    setCustomDraft("");
    setCustomOpen(false);
    setAttempted(false);
  }

  // ── validity per scene ────────────────────────────────────────
  function validity(): { ok: boolean; error?: string } {
    switch (screen) {
      case "interests":
        return interests.length > 0
          ? { ok: true }
          : { ok: false, error: c.errInterests };
      case "activity":
        return child.noFavoriteActivity || (child.favoriteActivity ?? "").trim().length > 0
          ? { ok: true }
          : { ok: false, error: c.errActivity };
      case "dream-route":
        return child.dreamStatus
          ? { ok: true }
          : { ok: false, error: c.errDreamRoute };
      case "child-dream":
        return (child.childDream ?? "").trim().length > 0
          ? { ok: true }
          : { ok: false, error: c.errChildDream };
      case "adult-hope":
        return (child.adultHope ?? "").trim().length > 0
          ? { ok: true }
          : { ok: false, error: c.errAdultHope };
      default:
        return { ok: true };
    }
  }
  const v = validity();
  const showError = attempted && !v.ok ? v.error : undefined;

  function goNext() {
    if (!v.ok) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setLimitHint(false);
    switch (screen) {
      case "intro":
        setScreen("interests");
        break;
      case "interests":
        setScreen("deepen");
        break;
      case "deepen":
        setScreen("activity");
        break;
      case "activity":
        setScreen("dream-route");
        break;
      case "dream-route":
        setScreen(child.dreamStatus === "has-dream" ? "child-dream" : "adult-hope");
        break;
      case "child-dream":
      case "adult-hope":
        patch({ phase02Done: true });
        setScreen("child-done");
        break;
      case "child-done":
        if (isLastChild) {
          onComplete();
        } else {
          setIdx((i) => i + 1);
          setScreen("intro");
        }
        break;
    }
  }

  function goPrev() {
    setAttempted(false);
    setLimitHint(false);
    switch (screen) {
      case "intro":
        if (idx === 0) onBack();
        else {
          setIdx((i) => i - 1);
          setScreen("child-done");
        }
        break;
      case "interests":
        setScreen("intro");
        break;
      case "deepen":
        setScreen("interests");
        break;
      case "activity":
        setScreen("deepen");
        break;
      case "dream-route":
        setScreen("activity");
        break;
      case "child-dream":
      case "adult-hope":
        setScreen("dream-route");
        break;
      case "child-done":
        setScreen(child.dreamStatus === "has-dream" ? "child-dream" : "adult-hope");
        break;
    }
  }

  const enter = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.26, ease: EASE },
      };

  const worldOnly = screen === "child-done";
  const ctaLabel =
    screen === "child-done"
      ? isLastChild
        ? c.continue
        : c.nextChildCta(nextChild.name)
      : c.continue;

  // helper: answer-aware interests text for the deepen ack
  const interestsText = useMemo(
    () =>
      (child.interests ?? [])
        .map((val) => {
          const l = interestLabel(val, locale);
          return locale === "uz" ? l.toLocaleLowerCase("uz") : l.toLowerCase();
        })
        .reduce((acc, cur, i, arr) => {
          if (i === 0) return cur;
          const sep = i === arr.length - 1 ? (locale === "uz" ? " va " : " and ") : ", ";
          return acc + sep + cur;
        }, ""),
    [child.interests, locale],
  );

  return (
    <section
      dir={dir}
      data-order-flow=""
      className="mx-auto w-full max-w-container-content bg-surface-base px-6 pb-16 pt-9 sm:px-8 md:pb-24 md:pt-12 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-secondary outline-none transition-opacity hover:opacity-70 focus-visible:underline"
          >
            <ArrowLeft size={14} strokeWidth={1.75} className="rtl:-scale-x-100" />
            {c.back}
          </button>
          <JourneyProgress locale={toLocale(language)} current={1} />
        </div>

        <div
          className={
            worldOnly
              ? "mx-auto max-w-lg"
              : "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14"
          }
        >
          {/* Conversation */}
          {!worldOnly && (
            <div>
              <motion.div key={`${idx}-${screen}`} {...enter}>
                {screen === "intro" && (
                  <div>
                    <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
                      {c.worldLabel(child.name)}
                    </p>
                    <Heading headingRef={headingRef}>{c.introLead(child.name)}</Heading>
                    <Supporting>{c.introSupport}</Supporting>
                  </div>
                )}

                {screen === "interests" && (
                  <fieldset>
                    <legend className="contents">
                      <Heading headingRef={headingRef}>{c.q1(child.name)}</Heading>
                    </legend>
                    <Help>{c.q1Help}</Help>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {interestOptions(locale).map((opt) => {
                        const active = interests.includes(opt.key);
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleInterest(opt.key)}
                            className={choiceClass(active)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* custom interests already added */}
                    {interests.some((v) => !isInterestKey(v)) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {interests
                          .filter((v) => !isInterestKey(v))
                          .map((v) => (
                            <span
                              key={v}
                              className="inline-flex items-center gap-1.5 rounded-md border border-accent-primary bg-accent-primary/[0.08] py-1.5 pe-1.5 ps-3 font-sans text-[14px] font-semibold text-text-primary"
                            >
                              {v}
                              <button
                                type="button"
                                onClick={() => toggleInterest(v)}
                                aria-label={c.removeInterest(v)}
                                className="flex h-5 w-5 items-center justify-center rounded-full text-text-secondary hover:text-text-primary"
                              >
                                <X size={13} strokeWidth={2} />
                              </button>
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mt-4">
                      {!customOpen ? (
                        <button
                          type="button"
                          onClick={() => setCustomOpen(true)}
                          className="inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary underline decoration-border-strong underline-offset-4 hover:text-text-primary"
                        >
                          {c.customToggle}
                          <span aria-hidden="true" className="text-accent-primary">
                            +
                          </span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-end gap-2">
                          <input
                            type="text"
                            autoFocus
                            value={customDraft}
                            onChange={(e) => setCustomDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCustom();
                              }
                            }}
                            placeholder={c.customPlaceholder}
                            className={
                              underline + " w-full max-w-[16rem] sm:w-auto sm:flex-1"
                            }
                          />
                          <button
                            type="button"
                            onClick={addCustom}
                            className="rounded-md border border-border-strong px-3.5 py-2 font-sans text-[13.5px] font-medium text-text-primary hover:border-accent-primary"
                          >
                            {c.customAdd}
                          </button>
                        </div>
                      )}
                    </div>

                    {limitHint && <Help tone="hint">{c.interestLimitNote}</Help>}
                    <ErrorLine>{showError}</ErrorLine>
                  </fieldset>
                )}

                {screen === "deepen" && (
                  <div>
                    {interestsText && (
                      <p className="mb-4 font-sans text-[15px] font-semibold text-text-primary">
                        {c.q2Ack(interestsText)}
                      </p>
                    )}
                    <Heading headingRef={headingRef}>{c.q2(child.name)}</Heading>
                    <div className="mt-6">
                      <textarea
                        rows={2}
                        value={child.interestDetail ?? ""}
                        onChange={(e) => patch({ interestDetail: e.target.value })}
                        placeholder={c.q2Placeholder}
                        className={box}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreen("activity")}
                      className="mt-3 inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary hover:text-text-primary"
                    >
                      {c.q2Skip}
                      <ArrowRight size={13} strokeWidth={1.75} className="rtl:-scale-x-100" />
                    </button>
                  </div>
                )}

                {screen === "activity" && (
                  <div>
                    <Heading headingRef={headingRef}>{c.q3(child.name)}</Heading>
                    <Help>{c.q3Help}</Help>
                    <div className="mt-6">
                      <textarea
                        rows={2}
                        value={child.favoriteActivity ?? ""}
                        onChange={(e) =>
                          patch({
                            favoriteActivity: e.target.value,
                            noFavoriteActivity: false,
                          })
                        }
                        placeholder={c.q3Placeholder}
                        className={box}
                        aria-invalid={showError ? true : undefined}
                      />
                    </div>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 font-sans text-[13.5px] text-text-secondary">
                      <input
                        type="checkbox"
                        checked={!!child.noFavoriteActivity}
                        onChange={(e) =>
                          patch({
                            noFavoriteActivity: e.target.checked,
                            ...(e.target.checked ? { favoriteActivity: "" } : {}),
                          })
                        }
                        className="h-4 w-4 accent-[var(--accent-primary)]"
                      />
                      {c.q3None}
                    </label>
                    <ErrorLine>{showError}</ErrorLine>
                  </div>
                )}

                {screen === "dream-route" && (
                  <fieldset>
                    <p className="mb-3 font-sans text-[15px] text-text-secondary">
                      {c.q4Lead(child.name)}
                    </p>
                    <legend className="contents">
                      <Heading headingRef={headingRef}>{c.q4(child.name)}</Heading>
                    </legend>
                    <div className="mt-7 flex flex-col gap-2.5">
                      {(
                        [
                          ["has-dream", c.q4HasDream],
                          ["not-yet", c.q4NotYet],
                        ] as [DreamStatus, string][]
                      ).map(([status, label]) => {
                        const active = child.dreamStatus === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            aria-pressed={active}
                            onClick={() => {
                              patch(reconcileDream(status));
                              setAttempted(false);
                            }}
                            className={[
                              "flex w-full items-center rounded-md border px-4 py-3.5 text-start font-sans text-[15px] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                              active
                                ? "border-accent-primary bg-accent-primary/[0.08] font-semibold text-text-primary"
                                : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
                            ].join(" ")}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <ErrorLine>{showError}</ErrorLine>
                  </fieldset>
                )}

                {screen === "child-dream" && (
                  <div>
                    <Heading headingRef={headingRef}>{c.q4a(child.name)}</Heading>
                    <Help>{c.q4aHelp}</Help>
                    <div className="mt-6">
                      <textarea
                        rows={2}
                        value={child.childDream ?? ""}
                        onChange={(e) => patch({ childDream: e.target.value })}
                        placeholder={c.q4aPlaceholder}
                        className={box}
                        aria-invalid={showError ? true : undefined}
                      />
                    </div>
                    <ErrorLine>{showError}</ErrorLine>
                  </div>
                )}

                {screen === "adult-hope" && (
                  <div>
                    <p className="mb-3 font-sans text-[15px] text-text-secondary">
                      {c.q4bTransition}
                    </p>
                    <p className="mb-4 font-display text-[17px] font-medium text-text-primary">
                      {c.q4bLead}
                    </p>
                    <Heading headingRef={headingRef}>{c.q4b(child.name)}</Heading>
                    <Help>{c.q4bHelp}</Help>
                    <p className="mt-2 font-serif text-[13.5px] italic leading-[1.55] text-text-muted">
                      {c.q4bExample}
                    </p>
                    <div className="mt-5">
                      <textarea
                        rows={3}
                        value={child.adultHope ?? ""}
                        onChange={(e) => patch({ adultHope: e.target.value })}
                        placeholder={c.q4bPlaceholder}
                        className={box}
                        aria-invalid={showError ? true : undefined}
                      />
                    </div>
                    <ErrorLine>{showError}</ErrorLine>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* The portrait */}
          {worldOnly ? (
            <motion.div key={`done-${idx}`} {...enter}>
              <Heading headingRef={headingRef} size="xl">
                {isLastChild
                  ? c.milestoneHeading(child.name)
                  : c.nextChildLead(child.name)}
              </Heading>
              <div className="mt-6">
                <ChildWorld child={child} locale={locale} variant="full" />
              </div>
              <Supporting>
                {isLastChild
                  ? c.milestoneBridge(child.name)
                  : c.nextChildBridge(nextChild.name)}
              </Supporting>
            </motion.div>
          ) : (
            <aside className="lg:sticky lg:top-[100px] lg:self-start">
              <ChildWorld
                child={child}
                locale={locale}
                variant={"aside"}
              />
            </aside>
          )}
        </div>

        <div
          className={[
            "mx-auto flex max-w-5xl items-center justify-end",
            worldOnly ? "mt-12" : "mt-10",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={goNext}
            aria-disabled={!v.ok || undefined}
            className={[
              "inline-flex items-center gap-2 rounded-md bg-accent-primary px-6 py-3 font-sans text-[14px] font-medium text-white outline-none transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
              v.ok ? "opacity-100 hover:opacity-90" : "opacity-40",
            ].join(" ")}
          >
            {ctaLabel}
            <ArrowRight size={15} strokeWidth={1.75} className="rtl:-scale-x-100" />
          </button>
        </div>

        {/* compact portrait on mobile, under the interaction */}
        {!worldOnly && (
          <div className="mt-8 lg:hidden">
            <ChildWorld child={child} locale={locale} variant="compact" />
          </div>
        )}
      </div>
    </section>
  );
}

// ── shared pieces ────────────────────────────────────────────────

function Heading({
  children,
  headingRef,
  size = "lg",
}: {
  children: React.ReactNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  size?: "lg" | "xl";
}) {
  return (
    <h2
      ref={headingRef}
      tabIndex={-1}
      style={{ outline: "none" }}
      className={[
        "font-display font-medium leading-[1.18] tracking-tight text-text-primary",
        size === "xl" ? "text-[27px] sm:text-[32px]" : "text-[23px] sm:text-[27px]",
      ].join(" ")}
    >
      {children}
    </h2>
  );
}

function Supporting({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-[46ch] font-sans text-[14.5px] leading-[1.65] text-text-secondary">
      {children}
    </p>
  );
}

function Help({
  children,
  tone = "help",
}: {
  children: React.ReactNode;
  tone?: "help" | "hint";
}) {
  return (
    <p
      className={[
        "mt-3 max-w-[52ch] font-sans text-[13px] leading-[1.55]",
        tone === "hint" ? "text-accent-primary" : "text-text-secondary",
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function ErrorLine({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-3 font-sans text-[13px] text-state-error">
      {children}
    </p>
  );
}

const underline =
  "border-0 border-b border-border-strong bg-transparent px-0 py-2 font-sans text-[16px] text-text-primary outline-none placeholder:text-text-muted";

const box =
  "w-full resize-none rounded-md border border-border-default bg-transparent px-3.5 py-2.5 font-sans text-[16px] leading-[1.55] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary";

function choiceClass(active: boolean): string {
  return [
    "min-h-[44px] rounded-md border px-4 font-sans text-[14px] font-medium outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
    active
      ? "border-accent-primary bg-accent-primary/[0.08] font-semibold text-text-primary"
      : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
  ].join(" ");
}
