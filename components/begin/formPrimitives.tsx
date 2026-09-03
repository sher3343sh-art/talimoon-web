"use client";

// Shared field / upload primitives for the /begin order flow.
//
// Extracted verbatim from PersonalizedBookOrderForm so the dynamic
// additional-character UI (AdditionalCharacters.tsx) can reuse the exact
// same PhotoUpload without a circular import back into the form. Behaviour
// is unchanged — this is a move, not a redesign.

import { useEffect, useMemo, useState } from "react";
import { Upload, X } from "lucide-react";

/** Client-side upload ceiling (spec §35) — one number for every file
 *  control in the order flow. */
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[13px] font-medium text-text-primary">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block font-sans text-[12px] text-text-secondary">
          {hint}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-border-default bg-transparent px-3.5 py-2.5 font-sans text-[14px] text-text-primary outline-none transition-colors focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-accent-primary";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} rows={props.rows ?? 3} className={inputClass + " resize-none"} />
  );
}

export function PhotoUpload({
  label,
  hint,
  removeLabel,
  atLeastLabel,
  enoughLabel,
  moreNeededLabel,
  tooLargeLabel,
  notImageLabel,
  brokenLabel,
  files,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  removeLabel: string;
  atLeastLabel: (min: number) => string;
  /** Shown once `files.length >= min` — the positive "you have enough"
   *  state (spec §7). Only supplied where a minimum applies. */
  enoughLabel?: (count: number) => string;
  /** Shown while below `min` — how many more are needed. */
  moreNeededLabel?: (remaining: number) => string;
  tooLargeLabel?: string;
  notImageLabel?: string;
  brokenLabel?: string;
  files: File[];
  min?: number;
  max: number;
  onChange: (files: File[]) => void;
}) {
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  // Client-side guards (spec §35): image type, a sane size ceiling, and
  // a "couldn't read this file" state for a corrupt image.
  const [notice, setNotice] = useState<string | null>(null);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  function accept(incoming: File[]) {
    setNotice(null);
    const ok: File[] = [];
    for (const f of incoming) {
      if (!f.type.startsWith("image/")) {
        setNotice(notImageLabel ?? "Please choose an image file.");
        continue;
      }
      if (f.size > MAX_PHOTO_BYTES) {
        setNotice(tooLargeLabel ?? "That photo is too large.");
        continue;
      }
      ok.push(f);
    }
    if (ok.length) {
      setBroken({});
      onChange([...files, ...ok].slice(0, max));
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2.5">
        {previews.map(({ url }, i) => (
          <div
            key={i}
            className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-border-default"
          >
            {broken[i] ? (
              <span className="px-1 text-center font-sans text-[10px] leading-[1.2] text-state-error">
                {brokenLabel ?? "Couldn't read this image"}
              </span>
            ) : (
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(files.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60"
              aria-label={removeLabel}
            >
              <X size={12} strokeWidth={2} color="#fff" />
            </button>
          </div>
        ))}
        {files.length < max && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border-strong transition-colors hover:border-solid">
            <Upload size={16} strokeWidth={1.5} className="text-text-secondary" />
            <input
              type="file"
              accept="image/*"
              multiple={max > 1}
              className="hidden"
              onChange={(e) => {
                accept(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {notice && (
        <span role="alert" className="mt-1.5 block font-sans text-[12px] text-state-error">
          {notice}
        </span>
      )}
      {/* Progress toward the minimum (spec §7). Only files actually
          accepted into `files` are counted — a rejected upload never
          lands here. Neutral until the count is short, positive once
          it's met; never a pre-interaction red error. */}
      {min != null &&
        (files.length >= min
          ? enoughLabel && (
              <span className="mt-1.5 block font-sans text-[12px] font-medium text-accent-primary">
                {enoughLabel(files.length)}
              </span>
            )
          : moreNeededLabel
            ? (
                <span className="mt-1.5 block font-sans text-[12px] text-text-secondary">
                  {moreNeededLabel(min - files.length)}
                </span>
              )
            : (
                <span className="mt-1.5 block font-sans text-[12px] text-text-secondary">
                  {atLeastLabel(min)}
                </span>
              ))}
    </Field>
  );
}
