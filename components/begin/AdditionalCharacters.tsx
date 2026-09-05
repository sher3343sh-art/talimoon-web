"use client";

// Additional (non-main) story characters — a relative or friend the
// customer wants drawn in. Two pieces of one feature:
//
//   AdditionalCharacterFields  — the repeatable "Kimligi / Ismi" editor
//                                (on the "a personal touch" step)
//   AdditionalCharacterPhotos  — the photo-upload blocks, generated ONE
//                                PER NAMED CHARACTER directly from the
//                                structured list (on the photos step)
//
// The photo section derives entirely from `characters`: no named
// characters ⇒ it renders nothing; N named characters ⇒ exactly N blocks,
// each bound to its character's stable `id` so a photo is never
// reattributed by a reorder or an earlier removal.

import { Plus, X } from "lucide-react";
import {
  additionalCharacterLabel,
  additionalCharacterNamed,
  MAX_ADDITIONAL_CHARACTERS,
  MAX_CHARACTER_PHOTOS,
  MIN_CHARACTER_PHOTOS,
  type AdditionalCharacter,
} from "@/lib/order/types";
import { Field, PhotoUpload, TextInput } from "./formPrimitives";

/** Bilingual copy the wizard passes down — keeps this component free of
 *  the LanguageContext so it stays trivially testable. */
export interface AdditionalCharacterCopy {
  relationLabel: string;
  relationPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  addLabel: string;
  removeLabel: string;
  /** Heading above the generated photo blocks. */
  photosSectionLabel: string;
  /** Per-block hint — e.g. "Kamida 2 ta surat yuklang". */
  minPhotosHint: string;
  removePhotoLabel: string;
  atLeastPhotos: (min: number) => string;
  photosEnough: (n: number) => string;
  photosMoreNeeded: (n: number) => string;
  photoTooLarge: string;
  photoNotImage: string;
  photoBroken: string;
}

export function AdditionalCharacterFields({
  characters,
  copy,
  onPatch,
  onAdd,
  onRemove,
}: {
  characters: AdditionalCharacter[];
  copy: AdditionalCharacterCopy;
  onPatch: (id: string, patch: Partial<AdditionalCharacter>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {characters.map((c, i) => (
        <div
          key={c.id}
          className="space-y-3 rounded-md border border-border-subtle p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onRemove(c.id)}
              className="inline-flex min-h-[32px] items-center gap-1 font-sans text-[12.5px] font-medium text-text-secondary underline underline-offset-4 hover:text-text-primary"
            >
              <X size={13} strokeWidth={2} />
              {copy.removeLabel}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={copy.relationLabel}>
              <TextInput
                value={c.relation}
                onChange={(e) => onPatch(c.id, { relation: e.target.value })}
                placeholder={copy.relationPlaceholder}
              />
            </Field>
            <Field label={copy.nameLabel}>
              <TextInput
                value={c.name}
                onChange={(e) => onPatch(c.id, { name: e.target.value })}
                placeholder={copy.namePlaceholder}
              />
            </Field>
          </div>
        </div>
      ))}
      {characters.length < MAX_ADDITIONAL_CHARACTERS && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-dashed border-border-strong px-4 py-2.5 font-sans text-[13px] font-medium text-text-primary transition-colors hover:border-solid hover:border-accent-primary"
        >
          <Plus size={15} strokeWidth={1.75} className="text-accent-primary" />
          {copy.addLabel}
        </button>
      )}
    </div>
  );
}

export function AdditionalCharacterPhotos({
  characters,
  copy,
  onPatchPhotos,
}: {
  characters: AdditionalCharacter[];
  copy: AdditionalCharacterCopy;
  onPatchPhotos: (id: string, photos: File[]) => void;
}) {
  // The upload UI is derived DIRECTLY from the structured list — one block
  // per named character, in list order. Zero named characters ⇒ nothing
  // renders (the caller hides the whole section too).
  const named = characters.filter(additionalCharacterNamed);
  if (named.length === 0) return null;

  return (
    <div className="space-y-5" data-testid="additional-character-photos">
      <p className="font-sans text-[13px] font-medium text-text-primary">
        {copy.photosSectionLabel}
      </p>
      {named.map((c) => (
        <PhotoUpload
          key={c.id}
          label={additionalCharacterLabel(c)}
          hint={copy.minPhotosHint}
          removeLabel={copy.removePhotoLabel}
          atLeastLabel={copy.atLeastPhotos}
          enoughLabel={copy.photosEnough}
          moreNeededLabel={copy.photosMoreNeeded}
          tooLargeLabel={copy.photoTooLarge}
          notImageLabel={copy.photoNotImage}
          brokenLabel={copy.photoBroken}
          files={c.photos}
          min={MIN_CHARACTER_PHOTOS}
          max={MAX_CHARACTER_PHOTOS}
          onChange={(files) => onPatchPhotos(c.id, files)}
        />
      ))}
    </div>
  );
}
