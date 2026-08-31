"use client";

/**
 * TALIMOON — ORDER — Phase 03: "The child's character".
 * ----------------------------------------------------------------
 * Never "what is wrong with this child". Per child: what the adult
 * appreciates → a real moment it shows → ONE behaviour they'd gently
 * like to support (or none) → when it usually appears → the values
 * the story should strengthen. A behaviour is described, the child is
 * never labelled; TALIMOON gathers observations, it does not diagnose.
 *
 * The portrait gains a "FAYZBEKNING XARAKTERI" layer. Child-centric,
 * UZ + EN. Later phases are NOT built here.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toLocale, directionFor } from "@/lib/journey/types";
import { reconcileGrowth, type ChildProfile } from "@/lib/order/types";
import {
  MAX_QUALITIES,
  MAX_VALUES,
  growthOptions,
  isQualityKey,
  phase03Copy,
  qualityLabel,
  qualityOptions,
  valueOptions,
  type Locale,
} from "@/lib/order/phase03-copy";
import { JourneyProgress } from "./JourneyProgress";
import { ChildWorld } from "./ChildWorld";

type Screen =
  | "intro"
  | "qualities"
  | "example"
  | "growth"
  | "context"
  | "values"
  | "child-done";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Phase03({
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
  const locale: Locale = toLocale(language) === "uz" ? "uz" : "en";
  const dir = directionFor(toLocale(language));
  const c = phase03Copy(locale);
  const reduced = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const [screen, setScreen] = useState<Screen>("intro");
  const [attempted, setAttempted] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customDraft, setCustomDraft] = useState("");
  const [growthCustomOpen, setGrowthCustomOpen] = useState(false);
  const [limitHint, setLimitHint] = useState(false);

  const child = childrenIn[idx];
  const nextChild = childrenIn[idx + 1];
  const isLastChild = idx >= childrenIn.length - 1;
  const patch = (p: Partial<ChildProfile>) => onPatchChild(child.id, p);

  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const t = window.setTimeout(
      () => headingRef.current?.focus({ preventScroll: true }),
      40,
    );
    return () => window.clearTimeout(t);
  }, [screen, idx]);

  // ── qualities ─────────────────────────────────────────────────
  const qualities = child.appreciatedQualities ?? [];
  const atQualityLimit = qualities.length >= MAX_QUALITIES;
  function toggleQuality(key: string) {
    if (qualities.includes(key)) {
      patch({ appreciatedQualities: qualities.filter((v) => v !== key) });
      setLimitHint(false);
      return;
    }
    if (atQualityLimit) {
      setLimitHint(true);
      return;
    }
    patch({ appreciatedQualities: [...qualities, key] });
    setAttempted(false);
  }
  function addCustomQuality() {
    const v = customDraft.trim();
    if (!v) return;
    if (atQualityLimit) {
      setLimitHint(true);
      return;
    }
    if (qualities.some((x) => x.toLocaleLowerCase() === v.toLocaleLowerCase())) {
      setCustomDraft("");
      return;
    }
    patch({ appreciatedQualities: [...qualities, v] });
    setCustomDraft("");
    setCustomOpen(false);
    setAttempted(false);
  }

  // ── values ────────────────────────────────────────────────────
  const values = child.desiredValues ?? [];
  const atValueLimit = values.length >= MAX_VALUES;
  function toggleValue(key: string) {
    if (values.includes(key)) {
      patch({ desiredValues: values.filter((v) => v !== key) });
      setLimitHint(false);
      return;
    }
    if (atValueLimit) {
      setLimitHint(true);
      return;
    }
    patch({ desiredValues: [...values, key] });
    setAttempted(false);
  }

  // ── growth ────────────────────────────────────────────────────
  function pickGrowth(key: string) {
    patch({ ...reconcileGrowth(true), growthBehavior: key });
    setGrowthCustomOpen(false);
    setAttempted(false);
  }
  function setGrowthCustom(text: string) {
    patch({ ...reconcileGrowth(true), growthBehavior: text });
  }
  function pickNoGrowth() {
    patch(reconcileGrowth(false));
    setGrowthCustomOpen(false);
    setAttempted(false);
  }
  const hasGrowth = !child.noGrowthArea && (child.growthBehavior ?? "").trim().length > 0;

  function validity(): { ok: boolean; error?: string } {
    switch (screen) {
      case "qualities":
        return qualities.length > 0
          ? { ok: true }
          : { ok: false, error: c.errQualities };
      case "growth":
        return child.noGrowthArea || (child.growthBehavior ?? "").trim().length > 0
          ? { ok: true }
          : { ok: false, error: c.errGrowth };
      case "values":
        return values.length > 0 ? { ok: true } : { ok: false, error: c.errValues };
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
        setScreen("qualities");
        break;
      case "qualities":
        setScreen("example");
        break;
      case "example":
        setScreen("growth");
        break;
      case "growth":
        setScreen(hasGrowth ? "context" : "values");
        break;
      case "context":
        setScreen("values");
        break;
      case "values":
        patch({ phase03Done: true });
        setScreen("child-done");
        break;
      case "child-done":
        if (isLastChild) onComplete();
        else {
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
      case "qualities":
        setScreen("intro");
        break;
      case "example":
        setScreen("qualities");
        break;
      case "growth":
        setScreen("example");
        break;
      case "context":
        setScreen("growth");
        break;
      case "values":
        setScreen(hasGrowth ? "context" : "growth");
        break;
      case "child-done":
        setScreen("values");
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

  const qualitiesText = useMemo(
    () =>
      (child.appreciatedQualities ?? [])
        .map((val) => {
          const l = qualityLabel(val, locale);
          return locale === "uz" ? l.toLocaleLowerCase("uz") : l.toLowerCase();
        })
        .reduce((acc, cur, i, arr) => {
          if (i === 0) return cur;
          const sep = i === arr.length - 1 ? (locale === "uz" ? " va " : " and ") : ", ";
          return acc + sep + cur;
        }, ""),
    [child.appreciatedQualities, locale],
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
          <JourneyProgress locale={toLocale(language)} current={2} />
        </div>

        <div
          className={
            worldOnly
              ? "mx-auto max-w-lg"
              : "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-14"
          }
        >
          {!worldOnly && (
            <div>
              <motion.div key={`${idx}-${screen}`} {...enter}>
                {screen === "intro" && (
                  <div>
                    <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
                      {c.charLabel(child.name)}
                    </p>
                    <Heading headingRef={headingRef}>{c.introLead(child.name)}</Heading>
                    <Supporting>{c.introSupport}</Supporting>
                  </div>
                )}

                {screen === "qualities" && (
                  <fieldset>
                    <legend className="contents">
                      <Heading headingRef={headingRef}>{c.q1(child.name)}</Heading>
                    </legend>
                    <Help>{c.q1Help}</Help>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {qualityOptions(locale).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={qualities.includes(opt.key)}
                          onClick={() => toggleQuality(opt.key)}
                          className={choiceClass(qualities.includes(opt.key))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {qualities.some((v2) => !isQualityKey(v2)) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {qualities
                          .filter((v2) => !isQualityKey(v2))
                          .map((v2) => (
                            <span key={v2} className={customChip}>
                              {v2}
                              <button
                                type="button"
                                onClick={() => toggleQuality(v2)}
                                aria-label={c.removeItem(v2)}
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
                          className={customToggleClass}
                        >
                          {c.customToggle}
                          <span aria-hidden="true" className="text-accent-primary">+</span>
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
                                addCustomQuality();
                              }
                            }}
                            placeholder={c.customPlaceholder}
                            className={underline + " w-full max-w-[16rem] sm:w-auto sm:flex-1"}
                          />
                          <button
                            type="button"
                            onClick={addCustomQuality}
                            className="rounded-md border border-border-strong px-3.5 py-2 font-sans text-[13.5px] font-medium text-text-primary hover:border-accent-primary"
                          >
                            {c.customAdd}
                          </button>
                        </div>
                      )}
                    </div>
                    {limitHint && <Help tone="hint">{c.limitNote(MAX_QUALITIES)}</Help>}
                    <ErrorLine>{showError}</ErrorLine>
                  </fieldset>
                )}

                {screen === "example" && (
                  <div>
                    {qualitiesText && (
                      <p className="mb-4 font-sans text-[15px] font-semibold text-text-primary">
                        {c.q2Ack(qualitiesText)}
                      </p>
                    )}
                    <Heading headingRef={headingRef}>{c.q2(child.name)}</Heading>
                    <Help>{c.q2Help}</Help>
                    <div className="mt-5">
                      <textarea
                        rows={2}
                        value={child.qualityExample ?? ""}
                        onChange={(e) => patch({ qualityExample: e.target.value })}
                        placeholder={c.q2Placeholder}
                        className={box}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreen("growth")}
                      className="mt-3 inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary hover:text-text-primary"
                    >
                      {c.q2Skip}
                      <ArrowRight size={13} strokeWidth={1.75} className="rtl:-scale-x-100" />
                    </button>
                  </div>
                )}

                {screen === "growth" && (
                  <fieldset>
                    <legend className="contents">
                      <Heading headingRef={headingRef}>{c.q3(child.name)}</Heading>
                    </legend>
                    <Help>{c.q3Help}</Help>
                    <div className="mt-6 flex flex-col gap-2">
                      {growthOptions(locale).map((opt) => {
                        const active = child.growthBehavior === opt.key && !child.noGrowthArea;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            aria-pressed={active}
                            onClick={() => pickGrowth(opt.key)}
                            className={rowChoiceClass(active)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        aria-pressed={!!child.noGrowthArea}
                        onClick={pickNoGrowth}
                        className={rowChoiceClass(!!child.noGrowthArea) + " italic"}
                      >
                        {c.q3None}
                      </button>
                    </div>

                    <div className="mt-4">
                      {!growthCustomOpen ? (
                        <button
                          type="button"
                          onClick={() => {
                            setGrowthCustomOpen(true);
                            patch({ noGrowthArea: false });
                          }}
                          className={customToggleClass}
                        >
                          {c.q3CustomToggle}
                          <span aria-hidden="true" className="text-accent-primary">+</span>
                        </button>
                      ) : (
                        <div>
                          <textarea
                            rows={2}
                            autoFocus
                            value={
                              child.growthBehavior && !child.noGrowthArea
                                ? child.growthBehavior
                                : ""
                            }
                            onChange={(e) => setGrowthCustom(e.target.value)}
                            placeholder={c.q3CustomPlaceholder}
                            className={box}
                          />
                          <p className="mt-1.5 font-sans text-[12px] text-text-muted">
                            {c.q3CustomHint}
                          </p>
                        </div>
                      )}
                    </div>
                    <ErrorLine>{showError}</ErrorLine>
                  </fieldset>
                )}

                {screen === "context" && (
                  <div>
                    <Heading headingRef={headingRef}>{c.q4(child.name)}</Heading>
                    <Help>{c.q4Help}</Help>
                    <div className="mt-5">
                      <textarea
                        rows={2}
                        value={child.growthContext ?? ""}
                        onChange={(e) => patch({ growthContext: e.target.value })}
                        placeholder={c.q4Placeholder}
                        className={box}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreen("values")}
                      className="mt-3 inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary hover:text-text-primary"
                    >
                      {c.q4Skip}
                      <ArrowRight size={13} strokeWidth={1.75} className="rtl:-scale-x-100" />
                    </button>
                  </div>
                )}

                {screen === "values" && (
                  <fieldset>
                    <legend className="contents">
                      <Heading headingRef={headingRef}>{c.q5(child.name)}</Heading>
                    </legend>
                    <Help>{c.q5Help}</Help>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {valueOptions(locale).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={values.includes(opt.key)}
                          onClick={() => toggleValue(opt.key)}
                          className={choiceClass(values.includes(opt.key))}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {limitHint && <Help tone="hint">{c.limitNote(MAX_VALUES)}</Help>}
                    <ErrorLine>{showError}</ErrorLine>
                  </fieldset>
                )}
              </motion.div>
            </div>
          )}

          {worldOnly ? (
            <motion.div key={`done-${idx}`} {...enter}>
              <Heading headingRef={headingRef} size="xl">
                {isLastChild ? c.milestoneHeading(child.name) : c.nextChildLead(child.name)}
              </Heading>
              <div className="mt-6">
                <ChildWorld child={child} locale={locale} variant="full" phase="character" />
              </div>
              <Supporting>
                {isLastChild ? c.milestoneBridge : c.nextChildBridge(nextChild.name)}
              </Supporting>
            </motion.div>
          ) : (
            <aside className="lg:sticky lg:top-[100px] lg:self-start">
              <ChildWorld child={child} locale={locale} variant="aside" phase="character" />
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

        {!worldOnly && (
          <div className="mt-8 lg:hidden">
            <ChildWorld child={child} locale={locale} variant="compact" phase="character" />
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
function Help({ children, tone = "help" }: { children: React.ReactNode; tone?: "help" | "hint" }) {
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
const customChip =
  "inline-flex items-center gap-1.5 rounded-md border border-accent-primary bg-accent-primary/[0.08] py-1.5 pe-1.5 ps-3 font-sans text-[14px] font-semibold text-text-primary";
const customToggleClass =
  "inline-flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-text-secondary underline decoration-border-strong underline-offset-4 hover:text-text-primary";

function choiceClass(active: boolean): string {
  return [
    "min-h-[44px] rounded-md border px-4 font-sans text-[14px] font-medium outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
    active
      ? "border-accent-primary bg-accent-primary/[0.08] font-semibold text-text-primary"
      : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
  ].join(" ");
}
function rowChoiceClass(active: boolean): string {
  return [
    "flex w-full items-center rounded-md border px-4 py-3 text-start font-sans text-[15px] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
    active
      ? "border-accent-primary bg-accent-primary/[0.08] font-semibold text-text-primary"
      : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
  ].join(" ");
}
