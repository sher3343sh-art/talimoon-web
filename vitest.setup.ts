import "@testing-library/jest-dom/vitest";

// jsdom has no object-URL implementation — PhotoUpload builds previews with
// URL.createObjectURL / revokeObjectURL. Stub them so the component renders.
const u = URL as unknown as {
  createObjectURL?: (obj: unknown) => string;
  revokeObjectURL?: (url: string) => void;
};
if (typeof u.createObjectURL !== "function") {
  u.createObjectURL = () => "blob:preview";
}
if (typeof u.revokeObjectURL !== "function") {
  u.revokeObjectURL = () => {};
}
