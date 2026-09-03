import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  additionalCharacterComplete,
  additionalCharacterLabel,
  additionalCharacterNamed,
  emptyAdditionalCharacter,
  MIN_CHARACTER_PHOTOS,
  type AdditionalCharacter,
} from "@/lib/order/types";
import {
  AdditionalCharacterFields,
  AdditionalCharacterPhotos,
  type AdditionalCharacterCopy,
} from "../AdditionalCharacters";

const COPY: AdditionalCharacterCopy = {
  relationLabel: "Kimligi",
  relationPlaceholder: "masalan: Ona",
  nameLabel: "Ismi",
  namePlaceholder: "masalan: Dilnoza",
  addLabel: "+ Qo‘shimcha qahramon qo‘shish",
  removeLabel: "O‘chirish",
  photosSectionLabel: "Qo‘shimcha qahramonlar suratlari",
  minPhotosHint: "Kamida 2 ta surat yuklang",
  removePhotoLabel: "Suratni o‘chirish",
  atLeastPhotos: (n) => `Kamida ${n} ta surat kerak`,
  photosEnough: (n) => `${n} ta surat — yetarli`,
  photosMoreNeeded: (n) => `Yana ${n} ta rasm yuklang`,
  photoTooLarge: "Juda katta",
  photoNotImage: "Rasm tanlang",
  photoBroken: "O‘qib bo‘lmadi",
};

function char(
  id: string,
  relation: string,
  name: string,
  photos: File[] = [],
): AdditionalCharacter {
  return { id, relation, name, photos };
}

function img(n = 1): File {
  return new File(["x".repeat(64)], `p${n}.png`, { type: "image/png" });
}

/** Count the generated upload blocks: one <input type=file> per block
 *  while the block is below its max. */
function blockCount(container: HTMLElement): number {
  return container.querySelectorAll(
    '[data-testid="additional-character-photos"] input[type="file"]',
  ).length;
}

describe("additional-character model helpers", () => {
  it("named/complete gates", () => {
    expect(additionalCharacterNamed(char("a", "", ""))).toBe(false);
    expect(additionalCharacterNamed(char("a", "Ona", ""))).toBe(false);
    expect(additionalCharacterNamed(char("a", "Ona", "Dilnoza"))).toBe(true);

    // TEST E — each character needs at least MIN_CHARACTER_PHOTOS
    expect(
      additionalCharacterComplete(char("a", "Ona", "Dilnoza", [img(1)])),
    ).toBe(false);
    expect(
      additionalCharacterComplete(
        char("a", "Ona", "Dilnoza", [img(1), img(2)]),
      ),
    ).toBe(true);
    expect(MIN_CHARACTER_PHOTOS).toBe(2);
  });

  it("label is relation — name, never the id", () => {
    expect(additionalCharacterLabel(char("char_xyz", " Ona ", " Dilnoza "))).toBe(
      "Ona — Dilnoza",
    );
  });

  it("emptyAdditionalCharacter has a stable, non-index id and no photos", () => {
    const a = emptyAdditionalCharacter();
    const b = emptyAdditionalCharacter();
    expect(a.id).toMatch(/^char_/);
    expect(a.id).not.toBe(b.id);
    expect(a.photos).toEqual([]);
  });
});

describe("AdditionalCharacterPhotos — dynamic generation", () => {
  it("TEST A: zero additional characters ⇒ no photo section at all", () => {
    const { container } = render(
      <AdditionalCharacterPhotos
        characters={[]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(
      screen.queryByTestId("additional-character-photos"),
    ).not.toBeInTheDocument();
    expect(blockCount(container)).toBe(0);
  });

  it("TEST A (variant): entries with no name ⇒ still nothing", () => {
    render(
      <AdditionalCharacterPhotos
        characters={[char("a", "", ""), char("b", "Ona", "")]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(
      screen.queryByTestId("additional-character-photos"),
    ).not.toBeInTheDocument();
  });

  it("TEST B: one additional character ⇒ exactly one upload block", () => {
    const { container } = render(
      <AdditionalCharacterPhotos
        characters={[char("a", "Ona", "Dilnoza")]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(blockCount(container)).toBe(1);
    expect(screen.getByText("Ona — Dilnoza")).toBeInTheDocument();
  });

  it("TEST C: three additional characters ⇒ exactly three labelled blocks", () => {
    const { container } = render(
      <AdditionalCharacterPhotos
        characters={[
          char("a", "Ona", "Dilnoza"),
          char("b", "Bobo", "Anvar"),
          char("c", "Opa", "Madina"),
        ]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(blockCount(container)).toBe(3);
    expect(screen.getByText("Ona — Dilnoza")).toBeInTheDocument();
    expect(screen.getByText("Bobo — Anvar")).toBeInTheDocument();
    expect(screen.getByText("Opa — Madina")).toBeInTheDocument();
  });

  it("TEST D: the block set follows the list as entries are added / removed", () => {
    const { container, rerender } = render(
      <AdditionalCharacterPhotos
        characters={[char("a", "Ona", "Dilnoza")]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(blockCount(container)).toBe(1);

    rerender(
      <AdditionalCharacterPhotos
        characters={[
          char("a", "Ona", "Dilnoza"),
          char("b", "Bobo", "Anvar"),
        ]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(blockCount(container)).toBe(2);
    expect(screen.getByText("Bobo — Anvar")).toBeInTheDocument();

    rerender(
      <AdditionalCharacterPhotos
        characters={[char("b", "Bobo", "Anvar")]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    expect(blockCount(container)).toBe(1);
    expect(screen.queryByText("Ona — Dilnoza")).not.toBeInTheDocument();
  });

  it("TEST E: a block below the minimum shows the 'need more' state", () => {
    render(
      <AdditionalCharacterPhotos
        characters={[char("a", "Ona", "Dilnoza", [img(1)])]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    // 1 of 2 uploaded → "need 1 more", never the positive "enough" line.
    expect(screen.getByText("Yana 1 ta rasm yuklang")).toBeInTheDocument();
    expect(screen.queryByText(/yetarli/)).not.toBeInTheDocument();
  });

  it("TEST F: an upload is bound to the character's id, not its position", async () => {
    const user = userEvent.setup();
    const onPatchPhotos = vi.fn();
    const chars = [
      char("a", "Ona", "Dilnoza"),
      char("b", "Bobo", "Anvar"),
    ];
    const { container, rerender } = render(
      <AdditionalCharacterPhotos
        characters={chars}
        copy={COPY}
        onPatchPhotos={onPatchPhotos}
      />,
    );

    const inputs = () =>
      container.querySelectorAll<HTMLInputElement>(
        '[data-testid="additional-character-photos"] input[type="file"]',
      );

    // Second block == "Bobo — Anvar" == id "b"
    await user.upload(inputs()[1]!, img(9));
    expect(onPatchPhotos).toHaveBeenCalledWith("b", [expect.any(File)]);

    onPatchPhotos.mockClear();

    // Reorder the list — "Bobo — Anvar" is now FIRST. Uploading to the
    // first block must still resolve to id "b".
    rerender(
      <AdditionalCharacterPhotos
        characters={[chars[1]!, chars[0]!]}
        copy={COPY}
        onPatchPhotos={onPatchPhotos}
      />,
    );
    await user.upload(inputs()[0]!, img(10));
    expect(onPatchPhotos).toHaveBeenCalledWith("b", [expect.any(File)]);
  });

  it("TEST F (isolation): photos already held stay with their own character", () => {
    render(
      <AdditionalCharacterPhotos
        characters={[
          char("a", "Ona", "Dilnoza", [img(1), img(2)]),
          char("b", "Bobo", "Anvar", [img(3)]),
        ]}
        copy={COPY}
        onPatchPhotos={vi.fn()}
      />,
    );
    // Dilnoza's block reads "2 ta surat — yetarli"; Anvar's still needs 1.
    expect(screen.getByText("2 ta surat — yetarli")).toBeInTheDocument();
    expect(screen.getByText("Yana 1 ta rasm yuklang")).toBeInTheDocument();
  });
});

describe("AdditionalCharacterFields — repeatable entry editor", () => {
  it("renders a Kimligi + Ismi pair per entry and an add button", () => {
    render(
      <AdditionalCharacterFields
        characters={[char("a", "Ona", "Dilnoza")]}
        copy={COPY}
        onPatch={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.getByText("Kimligi")).toBeInTheDocument();
    expect(screen.getByText("Ismi")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: COPY.addLabel }),
    ).toBeInTheDocument();
  });

  it("add / remove / patch call back with the right id", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const onRemove = vi.fn();
    const onPatch = vi.fn();

    // Small stateful harness so typing is observable through onPatch.
    function Harness() {
      const [list, setList] = useState<AdditionalCharacter[]>([
        char("a", "", ""),
      ]);
      return (
        <AdditionalCharacterFields
          characters={list}
          copy={COPY}
          onAdd={() => {
            onAdd();
            setList((l) => [...l, char(`x${l.length}`, "", "")]);
          }}
          onRemove={(id) => {
            onRemove(id);
            setList((l) => l.filter((c) => c.id !== id));
          }}
          onPatch={(id, p) => {
            onPatch(id, p);
            setList((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c)));
          }}
        />
      );
    }
    render(<Harness />);

    await user.type(screen.getAllByRole("textbox")[0]!, "Ona");
    expect(onPatch).toHaveBeenCalledWith("a", { relation: "O" });

    await user.click(screen.getByRole("button", { name: COPY.addLabel }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(screen.getAllByText("Kimligi")).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: COPY.removeLabel })[0]!);
    expect(onRemove).toHaveBeenCalledWith("a");
  });
});
