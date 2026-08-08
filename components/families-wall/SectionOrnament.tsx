/**
 * SectionOrnament — small gold line–diamond–line flourish used under
 * both the section eyebrow and the "Featured Stories" label in the
 * reference design. Purely decorative (aria-hidden); size is the
 * only thing that varies between the two call sites.
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
