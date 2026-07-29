import Image, { type ImageProps } from "next/image";

type ImageSource = ImageProps["src"];

export interface MaskedImageProps
  extends Omit<ImageProps, "fill" | "sizes" | "src" | "style"> {
  /** Accepts a URL, a StaticImport, null, or undefined. Anything not renderable falls back to the placeholder. */
  src?: ImageSource | null;
  alt: string;
  /** Controls the box size (e.g. "h-[106px] w-[150px] md:h-[120px] md:w-[170px]"). This component owns the mask, not layout dimensions. */
  className?: string;
  sizes?: string;
}

function hasRenderableSrc(
  src: MaskedImageProps["src"]
): src is ImageSource {
  if (src == null) return false;
  if (typeof src === "string") return src.trim().length > 0;
  return true;
}

/**
 * Next.js's image optimizer can fail to read dimensions from some
 * Inkscape-exported SVGs (missing width/height on the root <svg>),
 * which surfaces as "isn't a valid image ... received null". SVGs
 * are already vector, so optimization buys nothing anyway — skip
 * the optimizer entirely for .svg sources.
 */
function isSvgSource(src: MaskedImageProps["src"]): boolean {
  if (typeof src !== "string") return false;
  return src.trim().toLowerCase().endsWith(".svg");
}

/**
 * TALIMOON's signature squircle image mask — the shared shape,
 * shadow, and hover treatment for every photographic image on the
 * site (How It Works, Trust Strip, Book Showcase, Testimonials, and
 * future editorial placements).
 *
 * Requires <MaskDefs /> to be mounted once higher up the tree (see
 * components/ui/MaskDefs.tsx).
 */
export function MaskedImage({
  src,
  alt,
  className,
  sizes = "192px",
  ...imageProps
}: MaskedImageProps) {
  return (
    <div
      className={[
        "relative [clip-path:url(#talimoon-squircle-mask)]",
        "[filter:drop-shadow(0_1px_2px_rgba(42,36,29,0.06))_drop-shadow(0_6px_16px_rgba(42,36,29,0.10))]",
        "transition-transform duration-[250ms] ease-out will-change-transform hover:scale-[1.015]",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasRenderableSrc(src) ? (
        <Image
          {...imageProps}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          unoptimized={isSvgSource(src)}
          className="object-cover"
        />
      ) : (
        // role="img" + alt keeps this equivalent to a real photo for
        // assistive tech; the icon itself stays aria-hidden.
        <div
          role="img"
          aria-label={alt}
          className="flex h-full w-full items-center justify-center bg-[var(--surface-warm-200,#EFE8DB)]"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-[var(--text-tertiary,#726C65)]"
          >
            <path
              d="M4 16.5 8.5 12a1.5 1.5 0 0 1 2.12 0L15 16.38M13.5 14.9l1.65-1.65a1.5 1.5 0 0 1 2.12 0L20 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="9" r="1.25" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default MaskedImage;
