import { describe, it, expect } from "vitest";
import { buildSubmitPayload, isBackendBookLanguage, planChildPhotoUploads } from "@/lib/order/api";

function fakeFile(name: string): File {
  return new File(["x"], name, { type: "image/jpeg" });
}

const BASE = {
  idempotencyKey: "test-key-0000000000000000",
  turnstileToken: "tok",
  market: "UZ" as const,
  bookType: "single" as const,
  copies: 1,
  deliveryRequired: false,
  orderer: { fullName: "Test Orderer", phone: "+998900000000" },
  children: [{ name: "Ali", age: 7 }],
  bookLanguage: "uz" as const,
};

describe("isBackendBookLanguage", () => {
  it("accepts every supported book language code", () => {
    expect(isBackendBookLanguage("uz")).toBe(true);
    expect(isBackendBookLanguage("ru")).toBe(true);
    expect(isBackendBookLanguage("en")).toBe(true);
    expect(isBackendBookLanguage("ar")).toBe(true);
    expect(isBackendBookLanguage("kk")).toBe(true);
    expect(isBackendBookLanguage("ky")).toBe(true);
    expect(isBackendBookLanguage("tg")).toBe(true);
  });
});

describe("buildSubmitPayload", () => {
  it("builds the minimal shape the backend expects, channel always W", () => {
    const payload = buildSubmitPayload({
      ...BASE,
      declaredArtifacts: { childPhotoCount: 0, wantsSpecialPhoto: false, characterPhotoCount: 0, hasReceipt: false },
    });
    expect(payload.channel).toBe("W");
    expect(payload.idempotencyKey).toBe(BASE.idempotencyKey);
    expect(payload.declaredArtifacts).toEqual([]);
    expect(payload.profile.bookLanguage).toBe("uz");
    expect(payload.profile.children).toEqual([{ name: "Ali", age: 7 }]);
  });

  it("only includes declaredArtifacts kinds with count > 0", () => {
    const payload = buildSubmitPayload({
      ...BASE,
      declaredArtifacts: {
        childPhotoCount: 3,
        wantsSpecialPhoto: true,
        characterPhotoCount: 0,
        hasReceipt: true,
      },
    });
    expect(payload.declaredArtifacts).toEqual([
      { kind: "child_photo", count: 3 },
      { kind: "special_photo", count: 1 },
      { kind: "receipt", count: 1 },
    ]);
  });

  it("omits a child's age when null rather than sending null", () => {
    const payload = buildSubmitPayload({
      ...BASE,
      children: [{ name: "Ali", age: null }],
      declaredArtifacts: { childPhotoCount: 0, wantsSpecialPhoto: false, characterPhotoCount: 0, hasReceipt: false },
    });
    expect(payload.profile.children[0]).toEqual({ name: "Ali", age: undefined });
  });
});

describe("planChildPhotoUploads", () => {
  it("1 child: all photos map to childSlots[0]'s childRef", () => {
    const photos = [fakeFile("a.jpg"), fakeFile("b.jpg"), fakeFile("c.jpg")];
    const tasks = planChildPhotoUploads(
      [{ photos }],
      [{ childRef: "child-ref-0" }],
      [[false, false, false]],
    );
    expect(tasks).toHaveLength(3);
    expect(tasks.every((t) => t.childRef === "child-ref-0" && t.childIndex === 0)).toBe(true);
    expect(tasks.map((t) => t.photoIndex)).toEqual([0, 1, 2]);
  });

  it("2+ children: each child's photos map ONLY to that child's own childRef, by index", () => {
    const childA = [fakeFile("a1.jpg"), fakeFile("a2.jpg")];
    const childB = [fakeFile("b1.jpg")];
    const tasks = planChildPhotoUploads(
      [{ photos: childA }, { photos: childB }],
      [{ childRef: "ref-A" }, { childRef: "ref-B" }],
      [
        [false, false],
        [false],
      ],
    );
    const forA = tasks.filter((t) => t.childIndex === 0);
    const forB = tasks.filter((t) => t.childIndex === 1);
    expect(forA).toHaveLength(2);
    expect(forA.every((t) => t.childRef === "ref-A")).toBe(true);
    expect(forA.map((t) => t.file)).toEqual(childA);
    expect(forB).toHaveLength(1);
    expect(forB[0].childRef).toBe("ref-B");
    expect(forB[0].file).toBe(childB[0]);
  });

  it("retry: skips already-uploaded photos for child A but still uploads child B's", () => {
    const childA = [fakeFile("a1.jpg"), fakeFile("a2.jpg")];
    const childB = [fakeFile("b1.jpg"), fakeFile("b2.jpg")];
    // Child A's first photo already succeeded in a prior attempt; nothing
    // else has, including all of child B's.
    const done = [
      [true, false],
      [false, false],
    ];
    const tasks = planChildPhotoUploads(
      [{ photos: childA }, { photos: childB }],
      [{ childRef: "ref-A" }, { childRef: "ref-B" }],
      done,
    );
    expect(tasks).toHaveLength(3);
    expect(tasks).not.toContainEqual(
      expect.objectContaining({ childIndex: 0, photoIndex: 0 }),
    );
    expect(tasks).toContainEqual(expect.objectContaining({ childIndex: 0, photoIndex: 1 }));
    expect(tasks.filter((t) => t.childIndex === 1)).toHaveLength(2);
  });

  it("never plans an upload for a child with no matching childRef", () => {
    const tasks = planChildPhotoUploads(
      [{ photos: [fakeFile("a.jpg")] }, { photos: [fakeFile("b.jpg")] }],
      // Only one slot came back — the second child has no childRef at all.
      [{ childRef: "ref-A" }],
      [[false], [false]],
    );
    expect(tasks).toHaveLength(1);
    expect(tasks[0].childIndex).toBe(0);
    expect(tasks.every((t) => typeof t.childRef === "string" && t.childRef.length > 0)).toBe(true);
  });
});
