/**
 * PartnerCard — Trusted Partners preview
 * ----------------------------------------------------------------
 * Renders either a real partner logo (once one exists — `logoSrc`
 * via next/image, optionally wrapped in a link if `href` is set) or
 * today's "Coming Soon" placeholder. Same card shell either way, so
 * swapping in a real partner later is a data change, not a layout
 * change.
 */

import Image from "next/image";

export type Partner = {
  id: string;
  name?: string;
  logoSrc?: string;
  href?: string;
};

export function PartnerCard({ partner }: { partner: Partner }) {
  const hasLogo = Boolean(partner.logoSrc);

  const card = (
    <div className="flex h-12 w-[140px] shrink-0 items-center justify-center rounded-[16px] border border-[var(--gold-500-a35,rgba(184,147,91,0.35))] bg-[var(--paper-50,#FDFBF7)] px-5 shadow-[0_1px_6px_rgba(42,36,29,0.03)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-[var(--gold-500,#B8935B)] hover:shadow-[0_4px_14px_-6px_rgba(42,36,29,0.10)] sm:w-auto sm:min-w-[150px] sm:px-6 lg:h-16">
      {hasLogo && partner.logoSrc ? (
        <Image
          src={partner.logoSrc}
          alt={partner.name ?? "Partner logo"}
          width={140}
          height={44}
          className="h-auto max-h-8 w-auto object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <span aria-hidden="true" className="font-serif text-[1.25rem] font-light leading-none text-[var(--gold-500,#B8935B)]">
            +
          </span>
          <span className="font-sans text-[0.625rem] font-medium uppercase tracking-[0.12em] text-[var(--text-muted,#8B8578)]">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );

  if (hasLogo && partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={partner.name}
        className="block shrink-0 rounded-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B5764B)]"
      >
        {card}
      </a>
    );
  }

  return card;
}

export default PartnerCard;
