"use client";

/**
 * StorySubmissionCard — Families Wall
 * ----------------------------------------------------------------
 * Matches the reference's compact horizontal layout exactly: a
 * circular gold-outline pencil icon on the left, a single-line-look
 * write-in field in the middle (underlined, not boxed), and the
 * existing gold CTA on the right. Underneath it, it's a `<textarea
 * rows={1}>` that auto-grows on input rather than a true single-line
 * `<input>` — visually identical to the reference at rest/while
 * short, but doesn't hard-block someone actually writing a real
 * story. That's an implementation detail, not a layout change.
 *
 * Submitting has no backend to send to yet — there is no API route
 * for story submissions in this codebase — so the request is
 * simulated with a short delay. The card, loading state, and success
 * transition are all real and production-ready; only the network
 * call is a stand-in for when a real endpoint exists.
 */

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  thankYou: "Thank you.",
  received: "Your story has been received and will appear after approval.",
  shareLabel: "Share your family's Talimoon story",
  placeholder: "Write your family's story...",
  sharing: "Sharing…",
  shareYourStory: "Share Your Story",
  reviewedNote: "Every story is reviewed before appearing publicly.",
};

const COPY_UZ: typeof COPY_EN = {
  thankYou: "Rahmat.",
  received: "Hikoyangiz qabul qilindi va tasdiqlangandan so'ng ko'rinadi.",
  shareLabel: "Oilangizning Talimoon hikoyasini baham ko'ring",
  placeholder: "Oilangiz hikoyasini yozing...",
  sharing: "Yuborilmoqda…",
  shareYourStory: "Hikoyangizni ulashing",
  reviewedNote: "Har bir hikoya ommaga ko'rsatishdan oldin ko'rib chiqiladi.",
};

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
      className="h-3.5 w-3.5"
    >
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M10 1.7 16.5 4v5c0 4.4-2.8 7.7-6.5 9.3C6.3 16.7 3.5 13.4 3.5 9V4Z" opacity="0.16" />
      <path d="M10 1.7 16.5 4v5c0 4.4-2.8 7.7-6.5 9.3C6.3 16.7 3.5 13.4 3.5 9V4Z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.2 9.6 9.2 11.6 12.9 7.6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StorySubmissionCard() {
  const t = useT(COPY_EN, COPY_UZ);
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
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-subtle,rgba(42,36,29,0.08))] bg-[var(--paper-50,#FDFBF7)] px-6 py-5 shadow-[0_2px_16px_rgba(42,36,29,0.04)] sm:px-8">
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
                {t.thankYou}
              </p>
              <p className="mx-auto mt-1.5 max-w-[46ch] font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                {t.received}
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
                <label htmlFor="family-story" className="sr-only">
                  {t.shareLabel}
                </label>
                <textarea
                  ref={textareaRef}
                  id="family-story"
                  name="story"
                  value={value}
                  onChange={handleInput}
                  placeholder={t.placeholder}
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
                {status === "submitting" ? t.sharing : t.shareYourStory}
                {status !== "submitting" && <ArrowIcon />}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-sans text-[0.8125rem] text-[var(--text-muted,#8B8578)]">
        <ShieldIcon />
        {t.reviewedNote}
      </p>
    </div>
  );
}

export default StorySubmissionCard;
