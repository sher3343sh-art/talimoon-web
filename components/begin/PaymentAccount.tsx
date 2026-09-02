"use client";

/**
 * TALIMOON — ORDER — one card-to-card transfer account.
 * ----------------------------------------------------------------
 * Reusable across markets (spec §11): the UZ local card and each
 * international card render through this same primitive. Shows the
 * number in readable four-digit groups, the cardholder, the brand
 * mark(s) that belong to THIS card, and a per-card copy action that
 * copies digits only. The number is never logged or put in a URL.
 */

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  CARD_BRAND_LABEL,
  cardDigits,
  type PaymentAccount as Account,
} from "./orderFormData";

export function PaymentAccount({
  account,
  numberLabel,
  holderLabel,
  copyLabel,
  copiedLabel,
}: {
  account: Account;
  numberLabel: string;
  holderLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    const digits = cardDigits(account.number);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(digits);
      } else {
        const el = document.createElement("textarea");
        el.value = digits;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the number is on screen to type by hand */
    }
  }

  return (
    <div className="rounded-lg border border-border-default p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
            {numberLabel}
          </p>
          <p className="mt-1 break-all font-sans text-[16px] font-medium tabular-nums tracking-[0.04em] text-text-primary">
            {account.number}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {account.brands.map((b) => (
            <span
              key={b}
              className="rounded border border-border-strong px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-text-secondary"
            >
              {CARD_BRAND_LABEL[b]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="min-w-0 font-sans text-[13px] text-text-secondary">
          <span className="text-text-muted">{holderLabel}: </span>
          <span className="text-text-primary">{account.holder}</span>
        </p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-md border border-border-strong px-3.5 py-2 font-sans text-[12.5px] font-medium text-text-primary outline-none transition-colors hover:border-accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          aria-live="polite"
        >
          {copied ? (
            <Check size={13} strokeWidth={2.25} className="text-accent-primary" />
          ) : (
            <Copy size={13} strokeWidth={1.75} />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
    </div>
  );
}

export default PaymentAccount;
