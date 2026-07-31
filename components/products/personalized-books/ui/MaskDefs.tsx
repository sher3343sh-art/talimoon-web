import { readFileSync } from "node:fs";
import { join } from "node:path";

const maskSvg = readFileSync(
  join(process.cwd(), "public/masks/talimoon-mask.svg"),
  "utf-8"
);

/**
 * Mounts the TALIMOON squircle clipPath once per page (e.g. in
 * app/layout.tsx, above <body>'s children). Every <MaskedImage>
 * instance references it by id via CSS `clip-path: url(#...)`, so
 * the mask geometry exists exactly once in the DOM no matter how
 * many images use it.
 *
 * Local id references (as opposed to `url("file.svg#id")`) are what
 * make this work reliably in Safari — WebKit does not support
 * clip-path pointing at an external SVG file, only same-document
 * fragments. Reading the file at render time keeps the SVG itself
 * as the single source of truth for the shape while still producing
 * a same-document reference in the browser.
 */
export function MaskDefs() {
  return (
    <div
      aria-hidden="true"
      className="absolute h-0 w-0 overflow-hidden"
      dangerouslySetInnerHTML={{ __html: maskSvg }}
    />
  );
}
