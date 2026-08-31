"use client";

/**
 * TALIMOON — ORDER — Phase 01: "Siz bilan tanishamiz".
 * ----------------------------------------------------------------
 * The opening chapter of the conversational ordering experience. Not
 * a form: one thought per screen, warm and respectful ("Siz"), the
 * customer is never assumed to be a parent.
 *
 * Screens: name → acknowledgement → relationship → child count →
 * one screen per child (name + age) → a quiet transition into the
 * first child's deeper profile.
 *
 * Emits `Phase01Result` on completion; `onBack` is called from the
 * very first screen (returns to the product picker). Logistics
 * (phone / region / city) are NOT collected here — they belong to
 * order finalization.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toLocale, directionFor } from "@/lib/journey/types";
import {
  AGE_MAX,
  AGE_MIN,
  MAX_MAIN_CHILDREN,
  QUICK_AGES,
  emptyChild,
  isValidAge,
  type ChildProfile,
  type Phase01Result,
} from "@/lib/order/types";
import {
  relationshipOptions,
  type RecipientRelationship,
  type RelationshipType,
} from "@/lib/order/relationship";
import { phase01Copy } from "@/lib/order/phase01-copy";
import { JourneyProgress } from "./JourneyProgress";

type Screen =
  | { kind: "name" }
  | { kind: "ack" }
  | { kind: "relationship" }
  | { kind: "count" }
  | { kind: "child"; index: number }
  | { kind: "transition" };

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Phase01({
  onBack,
  onComplete,
  initialChildCount,
  initial,
}: {
  onBack: () => void;
  onComplete: (result: Phase01Result) => void;
  initialChildCount?: number;
  /** Rehydration when the customer steps back into Phase 01 from a
   *  later chapter — every prior answer is restored and the flow
   *  resumes at the closing transition, still fully navigable. */
  initial?: {
    ordererName?: string;
    recipientRelationship?: RecipientRelationship;
    children?: ChildProfile[];
  };
}) {
  const { language } = useLanguage();
  const locale = toLocale(language);
  const dir = directionFor(locale);
  const c = phase01Copy(locale);
  const reduced = useReducedMotion();

  const resuming = Boolean(initial?.children && initial.children.length > 0);
  const seedCount = Math.min(
    Math.max(initial?.children?.length ?? initialChildCount ?? 1, 1),
    MAX_MAIN_CHILDREN,
  );

  const [screen, setScreen] = useState<Screen>(
    resuming ? { kind: "transition" } : { kind: "name" },
  );
  const [attempted, setAttempted] = useState(false);

  const [ordererName, setOrdererName] = useState(initial?.ordererName ?? "");
  const [relType, setRelType] = useState<RelationshipType | null>(
    initial?.recipientRelationship?.type ?? null,
  );
  const [customLabel, setCustomLabel] = useState(
    initial?.recipientRelationship?.customLabel ?? "",
  );
  const [count, setCount] = useState(seedCount);
  // A pool that only grows, so toggling the count never loses a name.
  const [pool, setPool] = useState<ChildProfile[]>(() =>
    initial?.children && initial.children.length > 0
      ? initial.children.slice(0, MAX_MAIN_CHILDREN)
      : Array.from({ length: seedCount }, emptyChild),
  );

  const children = useMemo(() => pool.slice(0, count), [pool, count]);
  const rel: RecipientRelationship = useMemo(
    () => ({ type: relType ?? "parent", customLabel: customLabel.trim() || undefined }),
    [relType, customLabel],
  );

  function ensurePool(n: number) {
    setPool((prev) =>
      prev.length >= n ? prev : [...prev, ...Array.from({ length: n - prev.length }, emptyChild)],
    );
  }

  function patchChild(index: number, patch: Partial<ChildProfile>) {
    setPool((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], ...patch };
      return next;
    });
  }

  // ── Move focus to the new question on every screen change ──────
  const headingRef = useRef<HTMLHeadingElement>(null);
  const childIdx = screen.kind === "child" ? screen.index : -1;
  useEffect(() => {
    const id = window.setTimeout(() => headingRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [screen.kind, childIdx]);

  // ── Per-screen validity ───────────────────────────────────────
  function validity(): { ok: boolean; error?: string } {
    switch (screen.kind) {
      case "name":
        return ordererName.trim().length >= 2
          ? { ok: true }
          : { ok: false, error: c.errName };
      case "ack":
        return { ok: true };
      case "relationship":
        if (!relType) return { ok: false, error: c.errRelationship };
        if (relType === "other" && customLabel.trim().length < 2)
          return { ok: false, error: c.errCustomLabel };
        return { ok: true };
      case "count":
        return { ok: count >= 1 && count <= MAX_MAIN_CHILDREN };
      case "child": {
        const child = children[screen.index];
        if (!child || child.name.trim().length < 1)
          return { ok: false, error: c.errChildName };
        if (child.age == null) return { ok: false, error: c.errAge };
        if (!isValidAge(child.age)) return { ok: false, error: c.errAgeRange };
        return { ok: true };
      }
      case "transition":
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
    switch (screen.kind) {
      case "name":
        setScreen({ kind: "ack" });
        break;
      case "ack":
        setScreen({ kind: "relationship" });
        break;
      case "relationship":
        setScreen({ kind: "count" });
        break;
      case "count":
        ensurePool(count);
        setScreen({ kind: "child", index: 0 });
        break;
      case "child":
        if (screen.index + 1 < count) {
          setScreen({ kind: "child", index: screen.index + 1 });
        } else {
          setScreen({ kind: "transition" });
        }
        break;
      case "transition":
        onComplete({
          ordererName: ordererName.trim().replace(/\s+/g, " "),
          recipientRelationship: {
            type: relType ?? "parent",
            ...(relType === "other" && customLabel.trim()
              ? { customLabel: customLabel.trim().replace(/\s+/g, " ") }
              : {}),
          },
          children: children.map((ch) => ({ ...ch, name: ch.name.trim().replace(/\s+/g, " ") })),
        });
        break;
    }
  }

  function goPrev() {
    setAttempted(false);
    switch (screen.kind) {
      case "name":
        onBack();
        break;
      case "ack":
        setScreen({ kind: "name" });
        break;
      case "relationship":
        setScreen({ kind: "ack" });
        break;
      case "count":
        setScreen({ kind: "relationship" });
        break;
      case "child":
        setScreen(
          screen.index === 0
            ? { kind: "count" }
            : { kind: "child", index: screen.index - 1 },
        );
        break;
      case "transition":
        setScreen({ kind: "child", index: count - 1 });
        break;
    }
  }

  const name = ordererName.trim() || "";
  const enterAnim = reduced
    ? {}
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: EASE } };
  const screenKey =
    screen.kind === "child" ? `child-${screen.index}` : screen.kind;

  return (
    <section
      dir={dir}
      className="mx-auto w-full max-w-container-content bg-surface-base px-6 pb-16 pt-8 sm:px-8 md:pb-20 md:pt-10 lg:px-16 lg:pb-24"
    >
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-text-secondary outline-none transition-opacity hover:opacity-70 focus-visible:underline"
          >
            <ArrowLeft size={14} strokeWidth={1.75} className="rtl:-scale-x-100" />
            {c.back}
          </button>
          <JourneyProgress locale={locale} current={0} />
        </div>

        <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-accent-primary">
          {c.eyebrow}
        </p>

        <motion.div key={screenKey} {...enterAnim}>
          {screen.kind === "name" && (
            <ScreenName
              c={c}
              value={ordererName}
              onChange={setOrdererName}
              onEnter={goNext}
              headingRef={headingRef}
              error={showError}
            />
          )}

          {screen.kind === "ack" && (
            <ScreenAck c={c} name={name} headingRef={headingRef} />
          )}

          {screen.kind === "relationship" && (
            <ScreenRelationship
              c={c}
              locale={locale}
              name={name}
              value={relType}
              onSelect={(t) => {
                setRelType(t);
                setAttempted(false);
              }}
              customLabel={customLabel}
              onCustomLabel={setCustomLabel}
              headingRef={headingRef}
              error={showError}
            />
          )}

          {screen.kind === "count" && (
            <ScreenCount
              c={c}
              rel={rel}
              value={count}
              onSelect={(n) => {
                setCount(n);
                ensurePool(n);
              }}
              headingRef={headingRef}
            />
          )}

          {screen.kind === "child" && (
            <ScreenChild
              key={screen.index}
              c={c}
              rel={rel}
              index={screen.index}
              total={count}
              child={children[screen.index]}
              onName={(nm) => patchChild(screen.index, { name: nm })}
              onAge={(age) => patchChild(screen.index, { age })}
              onEnter={goNext}
              headingRef={headingRef}
              error={showError}
            />
          )}

          {screen.kind === "transition" && (
            <ScreenTransition c={c} count={count} kids={children} headingRef={headingRef} />
          )}
        </motion.div>

        <div className="mt-10 flex items-center justify-end">
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-6 py-3 font-sans text-[14px] font-medium text-white outline-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          >
            {screen.kind === "transition"
              ? c.transitionCta(children[0]?.name.trim() || "")
              : c.continue}
            <ArrowRight size={15} strokeWidth={1.75} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Shared pieces ────────────────────────────────────────────────

function Question({
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
      // Focused programmatically on every screen change so a screen
      // reader announces the new question; it is not a tab stop, so
      // the visible focus ring is suppressed.
      className="font-display text-[26px] font-medium leading-[1.2] tracking-tight text-text-primary outline-none focus:outline-none focus-visible:outline-none sm:text-[30px]"
    >
      {children}
    </h2>
  );
}

function Supporting({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-sans text-[14.5px] leading-[1.65] text-text-secondary">
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

const textInputClass =
  "w-full rounded-md border border-border-default bg-transparent px-4 py-3 font-sans text-[16px] text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-accent-primary";

// ── Screen: name ─────────────────────────────────────────────────

function ScreenName({
  c,
  value,
  onChange,
  onEnter,
  headingRef,
  error,
}: {
  c: ReturnType<typeof phase01Copy>;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  error?: string;
}) {
  return (
    <div>
      <Question headingRef={headingRef}>{c.namePrimary}</Question>
      <Supporting>{c.nameSupporting}</Supporting>
      <div className="mt-8">
        <label htmlFor="p1-name" className="mb-2 block font-sans text-[13px] font-medium text-text-primary">
          {c.nameQuestion}
        </label>
        <input
          id="p1-name"
          type="text"
          autoComplete="name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onEnter();
            }
          }}
          placeholder={c.namePlaceholder}
          className={textInputClass}
          aria-invalid={error ? true : undefined}
        />
        <ErrorLine>{error}</ErrorLine>
      </div>
    </div>
  );
}

// ── Screen: acknowledgement ──────────────────────────────────────

function ScreenAck({
  c,
  name,
  headingRef,
}: {
  c: ReturnType<typeof phase01Copy>;
  name: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <Question headingRef={headingRef}>{c.ackGreeting(name)}</Question>
      <Supporting>{c.ackNext}</Supporting>
    </div>
  );
}

// ── Screen: relationship ─────────────────────────────────────────

function ScreenRelationship({
  c,
  locale,
  name,
  value,
  onSelect,
  customLabel,
  onCustomLabel,
  headingRef,
  error,
}: {
  c: ReturnType<typeof phase01Copy>;
  locale: ReturnType<typeof toLocale>;
  name: string;
  value: RelationshipType | null;
  onSelect: (t: RelationshipType) => void;
  customLabel: string;
  onCustomLabel: (v: string) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  error?: string;
}) {
  const options = relationshipOptions(locale);
  return (
    <fieldset>
      <legend className="contents">
        <Question headingRef={headingRef}>{c.relationshipQuestion(name)}</Question>
      </legend>
      <div className="mt-7 divide-y divide-border-subtle border-y border-border-subtle">
        {options.map((opt) => {
          const active = value === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt.type)}
              className={[
                "flex w-full items-center justify-between gap-3 py-3.5 text-start font-sans outline-none transition-colors focus-visible:bg-accent-primary/[0.06]",
                active ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[15.5px]",
                  active ? "font-semibold" : "font-medium",
                ].join(" ")}
              >
                {opt.label}
              </span>
              <span
                aria-hidden="true"
                className={[
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                  active ? "bg-accent-primary" : "bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      {value === "other" && (
        <div className="mt-5">
          <label htmlFor="p1-custom" className="mb-2 block font-sans text-[13px] font-medium text-text-primary">
            {c.customLabelQuestion}
          </label>
          <input
            id="p1-custom"
            type="text"
            value={customLabel}
            onChange={(e) => onCustomLabel(e.target.value)}
            placeholder={c.customLabelPlaceholder}
            className={textInputClass}
          />
        </div>
      )}
      <ErrorLine>{error}</ErrorLine>
    </fieldset>
  );
}

// ── Screen: child count ──────────────────────────────────────────

function ScreenCount({
  c,
  rel,
  value,
  onSelect,
  headingRef,
}: {
  c: ReturnType<typeof phase01Copy>;
  rel: RecipientRelationship;
  value: number;
  onSelect: (n: number) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <fieldset>
      <legend className="contents">
        <Question headingRef={headingRef}>{c.countQuestion(rel)}</Question>
      </legend>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {Array.from({ length: MAX_MAIN_CHILDREN }, (_, i) => i + 1).map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(n)}
              className={[
                "min-h-[44px] min-w-[56px] rounded-md border px-4 font-sans text-[15px] font-medium outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                active
                  ? "border-accent-primary bg-accent-primary/[0.08] text-text-primary"
                  : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
              ].join(" ")}
            >
              {c.countUnit(n)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Screen: child (name + age) ───────────────────────────────────

function ScreenChild({
  c,
  rel,
  index,
  total,
  child,
  onName,
  onAge,
  onEnter,
  headingRef,
  error,
}: {
  c: ReturnType<typeof phase01Copy>;
  rel: RecipientRelationship;
  index: number;
  total: number;
  child: ChildProfile | undefined;
  onName: (v: string) => void;
  onAge: (age: number | null) => void;
  onEnter: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  error?: string;
}) {
  const name = child?.name ?? "";
  const age = child?.age ?? null;
  const isCustomAge = age != null && !QUICK_AGES.includes(age);
  const [otherOpen, setOtherOpen] = useState(isCustomAge);

  const nameError = error === c.errChildName ? error : undefined;
  const ageError = error === c.errAge || error === c.errAgeRange ? error : undefined;

  return (
    <div>
      <Question headingRef={headingRef}>{c.childMoment(index, total)}</Question>

      <div className="mt-7">
        <label
          htmlFor={`p1-child-name-${index}`}
          className="mb-2 block font-sans text-[13px] font-medium text-text-primary"
        >
          {c.childNamePrompt(index, total, rel)}
        </label>
        <input
          id={`p1-child-name-${index}`}
          type="text"
          value={name}
          onChange={(e) => onName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (document.getElementById(`p1-age-group-${index}`)?.querySelector("button") as HTMLButtonElement | null)?.focus();
            }
          }}
          placeholder={c.childNamePlaceholder}
          className={textInputClass}
          aria-invalid={nameError ? true : undefined}
          autoFocus={total > 1 && index > 0}
        />
        <ErrorLine>{nameError}</ErrorLine>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 block font-sans text-[13px] font-medium text-text-primary">
          {c.childAgeQuestion(name)}
        </legend>
        <div id={`p1-age-group-${index}`} className="flex flex-wrap gap-2">
          {QUICK_AGES.map((a) => {
            const active = age === a && !otherOpen;
            return (
              <button
                key={a}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  onAge(a);
                  setOtherOpen(false);
                }}
                className={[
                  "min-h-[44px] min-w-[44px] rounded-md border px-3 font-sans text-[14.5px] font-medium outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                  active
                    ? "border-accent-primary bg-accent-primary/[0.08] text-text-primary"
                    : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
                ].join(" ")}
              >
                {a}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={otherOpen}
            onClick={() => {
              setOtherOpen(true);
              if (!isCustomAge) onAge(null);
            }}
            className={[
              "min-h-[44px] rounded-md border px-4 font-sans text-[13.5px] font-medium outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
              otherOpen
                ? "border-accent-primary bg-accent-primary/[0.08] text-text-primary"
                : "border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary",
            ].join(" ")}
          >
            {c.otherAge}
          </button>
        </div>

        {otherOpen && (
          <div className="mt-3">
            <input
              type="number"
              inputMode="numeric"
              min={AGE_MIN}
              max={AGE_MAX}
              value={age ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim();
                onAge(raw === "" ? null : Math.trunc(Number(raw)));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onEnter();
                }
              }}
              placeholder={`${AGE_MIN}–${AGE_MAX}`}
              className={textInputClass + " max-w-[140px]"}
              aria-invalid={ageError ? true : undefined}
              autoFocus
            />
          </div>
        )}
        <ErrorLine>{ageError}</ErrorLine>
      </fieldset>
    </div>
  );
}

// ── Screen: transition ───────────────────────────────────────────

function ScreenTransition({
  c,
  count,
  kids,
  headingRef,
}: {
  c: ReturnType<typeof phase01Copy>;
  count: number;
  kids: ChildProfile[];
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  if (count === 1) {
    const ch = kids[0];
    const nm = ch?.name.trim() || "";
    const age = ch?.age ?? 0;
    return (
      <div>
        <Question headingRef={headingRef}>{c.transitionOneChild(nm, age)}</Question>
        <Supporting>{c.transitionOneChildSupport(nm)}</Supporting>
      </div>
    );
  }
  const names = kids.map((ch) => ch.name.trim()).filter(Boolean);
  return (
    <div>
      <Question headingRef={headingRef}>{c.transitionManyChildren}</Question>
      <p className="mt-3 font-display text-[18px] font-medium text-text-primary">
        {c.transitionManyChildrenNames(names)}
      </p>
      <Supporting>{c.transitionManyChildrenSupport}</Supporting>
    </div>
  );
}
