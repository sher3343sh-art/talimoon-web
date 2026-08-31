"use client";

/**
 * FeedbackSubmissionCard — Parent Feedback section.
 * ----------------------------------------------------------------
 * Where a parent leaves a comment / opinion / impression / suggestion
 * about TALIMOON. Compact horizontal layout (unchanged): a circular
 * gold-outline pencil icon, an underlined write-in field that
 * auto-grows, and the gold CTA.
 *
 * Moderation is preserved and is NOT bypassed: a submission never
 * becomes public here. Conceptually submitted → pending moderation →
 * approved / rejected → only approved feedback appears in the
 * carousel. There is no submission endpoint in this static build, so
 * the send is simulated with a short delay; the card, loading state
 * and "received, pending review" confirmation are the real,
 * production-ready behaviour — only the network call is a stand-in
 * for a real moderation intake.
 */

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFeedbackCopy } from "@/lib/parent-feedback/copy";

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M16.5 3.5 20.5 7.5 8 20 4 20.5 4.5 16.5Z" />
      <path d="M14.5 5.5 18.5 9.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 rtl:-scale-x-100"
    >
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M10 1.7 16.5 4v5c0 4.4-2.8 7.7-6.5 9.3C6.3 16.7 3.5 13.4 3.5 9V4Z" opacity="0.16" />
      <path
        d="M10 1.7 16.5 4v5c0 4.4-2.8 7.7-6.5 9.3C6.3 16.7 3.5 13.4 3.5 9V4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 9.6 9.2 11.6 12.9 7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FeedbackSubmissionCard() {
  const { copy } = useFeedbackCopy();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim() || status === "submitting") return;
    setStatus("submitting");
    // Simulated moderation intake — the comment goes to "pending",
    // never straight to public.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] px-6 py-4 shadow-[0_2px_16px_rgba(42,36,29,0.04)] sm:px-8">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="py-6 text-center"
              role="status"
            >
              <p className="font-serif text-[1.25rem] font-medium text-[var(--text-primary,#2A241D)]">
                {copy.submittedTitle}
              </p>
              <p className="mx-auto mt-1.5 max-w-[46ch] font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                {copy.submittedBody}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSubmit}
              className="flex items-center gap-4 sm:gap-6"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold-500,#B8935B)] bg-[var(--paper-50,#FDFBF7)] text-[var(--gold-600,#9C7A47)]"
              >
                <PencilIcon />
              </span>

              <div className="min-w-0 flex-1">
                <label htmlFor="parent-feedback" className="sr-only">
                  {copy.inputLabel}
                </label>
                <textarea
                  ref={textareaRef}
                  id="parent-feedback"
                  name="feedback"
                  value={value}
                  onChange={handleInput}
                  placeholder={copy.inputPlaceholder}
                  rows={1}
                  disabled={status === "submitting"}
                  className="w-full resize-none overflow-hidden border-0 border-b border-[var(--border-default,rgba(42,36,29,0.14))] bg-transparent pb-2 font-sans text-[1.0625rem] leading-[1.5] text-[var(--text-primary,#2A241D)] placeholder:text-[var(--text-muted,#8B8578)] focus:border-[var(--accent-primary,#B5764B)] focus:outline-none disabled:opacity-70"
                />
              </div>

              <button
                type="submit"
                disabled={!value.trim() || status === "submitting"}
                className="tm-cta-gold inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-5 text-[13px] font-medium tracking-[0.015em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? copy.submitting : copy.submit}
                {status !== "submitting" && <ArrowIcon />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-sans text-[0.8125rem] text-[var(--text-muted,#8B8578)]">
        <ShieldIcon />
        {copy.moderationNote}
      </p>
    </div>
  );
}

export default FeedbackSubmissionCard;
