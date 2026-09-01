"use client";

/**
 * TALIMOON — ORDER — the check-row.
 * ----------------------------------------------------------------
 * The one consistent look for every "skip / none / I don't know"
 * affordance in the order flow (spec §16/§31): a real, keyboard- and
 * screen-reader-accessible checkbox, styled as a refined row so it
 * never reads as plain text or an ambiguous "next" link. Selected
 * state is never colour-only — the box itself fills and gets a check
 * mark.
 */

import { Check } from "lucide-react";

export function CheckRow({
  id,
  checked,
  onChange,
  label,
  support,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Optional short line under the row explaining what checking it does. */
  support?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={[
          "flex w-full cursor-pointer items-center gap-3 rounded-md border px-4 py-3.5 font-sans text-[15px] outline-none transition-colors",
          checked
            ? "border-accent-primary bg-accent-primary/[0.08]"
            : "border-border-default hover:border-border-strong",
        ].join(" ")}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={[
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-primary",
            checked
              ? "border-accent-primary bg-accent-primary text-white"
              : "border-border-strong bg-transparent",
          ].join(" ")}
        >
          {checked && <Check size={13} strokeWidth={3} />}
        </span>
        <span className={checked ? "font-semibold text-text-primary" : "text-text-secondary"}>
          {label}
        </span>
      </label>
      {support && (
        <p className="mt-2 ps-[calc(1.25rem+0.75rem+1px)] font-sans text-[12.5px] leading-[1.55] text-text-secondary">
          {support}
        </p>
      )}
    </div>
  );
}

export default CheckRow;
