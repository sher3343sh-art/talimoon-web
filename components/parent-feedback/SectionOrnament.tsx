/**
 * SectionOrnament — small gold line–diamond–line flourish used under
 * the section eyebrow, the "OTA-ONALARDAN" feedback label, and the
 * empty state. Purely decorative (aria-hidden); size is the only
 * thing that varies between call sites.
 */

export function SectionOrnament({ size = "default" }: { size?: "default" | "small" }) {
  const lineWidth = size === "small" ? "w-4" : "w-6";
  const gap = size === "small" ? "gap-1.5" : "gap-2";

  return (
    <div aria-hidden="true" className={["mt-2 flex items-center justify-center", gap].join(" ")}>
      <span className={["h-px bg-[var(--gold-500,#B8935B)]", lineWidth].join(" ")} />
      <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold-500,#B8935B)]" />
      <span className={["h-px bg-[var(--gold-500,#B8935B)]", lineWidth].join(" ")} />
    </div>
  );
}

export default SectionOrnament;
