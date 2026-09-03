"use client";

/**
 * PricingSection — TALIMOON personalized-books pricing step
 * ----------------------------------------------------------------
 * Two plan cards + the market/currency selector + the reassurance row.
 * This is the ONE pricing implementation and it is reused in two
 * places, unchanged:
 *   • `/products/personalized-books` at `#pricing` (product-page section)
 *   • `/begin/personalized-book/price` (the order journey's pricing step)
 * There is no second pricing source of truth — all values, calculations,
 * market/currency/delivery logic and package definitions live in
 * `@/components/begin/orderFormData`.
 *
 * The "Choose …" buttons navigate to `/begin/personalized-book/form` —
 * the only route that renders the actual order form. This section never
 * renders the form itself, and package selection is NOT transferred
 * (chosen again inside the form's Phase 01).
 *
 * Container/spacing matches every other section on the product page
 * exactly (max-w-[1440px], px-5 md:px-10 lg:px-16, py-16 md:py-20
 * lg:py-28); the two plan cards nest a narrower max-w-3xl inside.
 */

import Link from "next/link";
import { Book, Clock, Copy, Truck, Image as ImageIcon, Users, User } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import {
  BookType,
  MARKET_PRICING,
  PRICING,
  formatMoney,
  type Market,
} from "@/components/begin/orderFormData";
import { useMarketPreference } from "@/lib/order/market";

const PLANS: Array<{
  type: BookType;
  featured?: boolean;
  features: { icon: React.ElementType; text: string; textUz: string }[];
}> = [
  {
    type: "single",
    features: [
      { icon: User, text: "Your child as the story's hero", textUz: "Farzandingiz hikoyaning bosh qahramoni" },
      {
        icon: ImageIcon,
        text: "Custom illustrations from their photos",
        textUz: "Ularning suratlaridan yaratilgan maxsus illyustratsiyalar",
      },
      { icon: Book, text: "Hardcover keepsake edition", textUz: "Qattiq muqovali, umrbod saqlanadigan nashr" },
    ],
  },
  {
    type: "multi",
    featured: true,
    features: [
      { icon: Users, text: "All siblings woven into one story", textUz: "Barcha farzandlar bitta hikoyada birlashadi" },
      {
        icon: ImageIcon,
        text: "Custom illustrations from their photos",
        textUz: "Ularning suratlaridan yaratilgan maxsus illyustratsiyalar",
      },
      { icon: Book, text: "Hardcover keepsake edition", textUz: "Qattiq muqovali, umrbod saqlanadigan nashr" },
    ],
  },
];

const CHROME_EN = {
  eyebrow: "Pricing",
  heading: "Simple, transparent pricing",
  subheading: "No hidden fees. Every book is made to order.",
  pagesStory: (pages: string) => `${pages} page personalized story`,
  choosePlan: (label: string) => `Choose ${label}`,
  mostChosen: "Most chosen",
  extraCopies: (amount: string) => `Extra copies: +${amount} each`,
  extraCopiesIntl: (amount: string) => `Additional copy — +${amount} each`,
  readyInUz: "Preparation time — 7–10 days",
  readyInIntl: "Preparation time — 15–25 days",
  marketUz: "Uzbekistan",
  marketIntl: "International",
  marketAria: "Order region",
  deliveryUz: "Delivery — free within Tashkent, 40 000 so‘m to other regions",
  deliveryIntl: "International delivery service — $15",
  badgeUrgency: "NOW ONLY",
  badgePercent: (pct: number) => `−${pct}%`,
  badgeSr: (pct: number, was: string) => `${pct}% off, now only — was ${was}`,
};

const CHROME_UZ: typeof CHROME_EN = {
  eyebrow: "Narxlar",
  heading: "Sodda va Shaffof narxlar",
  subheading: "Yashirin to'lovlar yo'q. Har bir kitob buyurtma asosida tayyorlanadi.",
  pagesStory: (pages) => `${pages} betlik shaxsiylashtirilgan hikoya`,
  choosePlan: (label) => `${label} tanlash`,
  mostChosen: "Eng ko'p tanlanadi",
  extraCopies: (amount) => `Qo'shimcha nusxalar: har biri +${amount}`,
  extraCopiesIntl: (amount) => `Qo‘shimcha nusxa — har biri +${amount}`,
  readyInUz: "Tayyorlash muddati — 7–10 kun",
  readyInIntl: "Tayyorlash muddati — 15–25 kun",
  marketUz: "O‘zbekiston",
  marketIntl: "Xalqaro",
  marketAria: "Buyurtma hududi",
  deliveryUz: "Yetkazib berish — Toshkent bo‘yicha bepul, boshqa viloyatlarga 40 000 so‘m",
  deliveryIntl: "Xalqaro yetkazib berish xizmati — $15",
  badgeUrgency: "FAQAT HOZIR",
  badgePercent: (pct) => `−${pct}%`,
  badgeSr: (pct, was) => `Faqat hozir ${pct}% chegirma — avvalgi narx ${was}`,
};

/** "499 000" — the bare number; the currency word is rendered
 *  separately so it can sit smaller. USD prices carry their own "$" and
 *  need no suffix. */
function priceParts(amount: number, market: Market): { value: string; unit: string } {
  if (market === "INTERNATIONAL") {
    return { value: formatMoney(amount, "USD"), unit: "" };
  }
  return { value: amount.toLocaleString("en-US").replace(/,/g, " "), unit: "so'm" };
}

/** Display-only "was" prices for the sales page's discount seal. NOT a
 *  real prior price point tracked in orderFormData.ts — the /begin flow
 *  always bills the live MARKET_PRICING. These are the exact values this
 *  page originally shipped with: they agree across commit 11afe7a
 *  (ORIGINAL_PRICE) and 7e4387f (ANCHOR_PRICE). The saving % shown on
 *  the seal is derived from these, never hardcoded. */
const ANCHOR_PRICE: Record<Market, Record<BookType, number>> = {
  UZ: { single: 600_000, multi: 850_000 },
  INTERNATIONAL: { single: 59, multi: 84 },
};

/** Discount seal — a compact vertical marker beside the live price that
 *  says the offer is active RIGHT NOW: a small "FAQAT HOZIR" over a
 *  dominant "−17%". Deep-navy base, one thin gold hairline, warm
 *  cream/gold type, a whisper of depth. No starburst, no red, no
 *  supermarket-sticker energy, no animation. Decorative: aria-hidden,
 *  with the saving spoken in an sr-only line beside the price. */
function SavingsBadge({ urgency, percent }: { urgency: string; percent: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 select-none flex-col items-center justify-center rounded-md border border-[color:var(--gold-mid)] bg-[color:var(--surface-contrast)] px-2.5 py-1.5 text-center leading-none shadow-[0_2px_8px_-2px_rgba(28,42,58,0.4)]"
    >
      <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-[color:var(--gold-highlight)]">
        {urgency}
      </span>
      <span className="mt-1 font-display text-[17px] font-semibold tracking-[-0.01em] text-[color:var(--surface-base)]">
        {percent}
      </span>
    </span>
  );
}

// The exact same gold recipe as .tm-cta-gold (globals.css §27), so the
// featured card's border reads as the same "gold effect" as the CTA
// buttons, not just a color from the same family. Duplicated as a
// literal here rather than shared: .tm-cta-gold's background-image is a
// flat button fill, while this is a gradient BORDER via the standard
// two-layer background-origin/background-clip technique (border-image
// would ignore rounded-lg's corner radius entirely) — different enough
// mechanisms that reusing one declaration between them isn't practical.
const GOLD_GRADIENT =
  "linear-gradient(135deg, var(--gold-shadow) 0%, var(--gold-base) 20%, var(--gold-mid) 38%, var(--gold-highlight) 50%, var(--gold-mid) 62%, var(--gold-base) 80%, var(--gold-shadow) 100%)";

export default function PricingSection() {
  const { language } = useLanguage();
  const t = useT(CHROME_EN, CHROME_UZ);
  // Which MARKET the visitor is pricing for — not a currency picker.
  // Persisted (useMarketPreference) so the choice carries across the
  // page AND into the order form, which reads the same preference — no
  // extra state is passed to the form route.
  const { preference, setPreference } = useMarketPreference();
  const market: Market = preference ?? "UZ";

  return (
    <section id="pricing" className="w-full bg-surface-base pb-14 pt-16 md:pb-16 md:pt-20 lg:pb-16 lg:pt-20">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-accent-primary">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[30px] font-medium leading-[1.15] tracking-tight text-text-primary sm:text-[36px]">
            {t.heading}
          </h2>
          <p className="mt-3 font-sans text-[14px] leading-[1.6] text-text-secondary">{t.subheading}</p>
        </div>

        {/* Market selector — small, editorial, obviously a choice of
            where the order is for, not a currency toggle (spec §5). */}
        <div
          role="radiogroup"
          aria-label={t.marketAria}
          className="mx-auto mt-7 flex w-fit items-center gap-1 rounded-full border border-border-default p-1"
        >
          {(["UZ", "INTERNATIONAL"] as const).map((m) => {
            const on = market === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPreference(m)}
                className={[
                  "rounded-full px-4 py-1.5 font-sans text-[12.5px] transition-colors duration-200 motion-reduce:transition-none",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                  on
                    ? "bg-accent-primary/[0.16] font-semibold text-text-primary"
                    : "font-medium text-text-secondary hover:text-text-primary",
                ].join(" ")}
              >
                {m === "UZ" ? t.marketUz : t.marketIntl}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const info = PRICING[plan.type];
            const label = language === "UZ" ? info.labelUz : info.label;
            const base = MARKET_PRICING[market][plan.type];
            const priced = priceParts(base, market);
            const anchor = ANCHOR_PRICE[market][plan.type];
            const savingPct = anchor > base ? Math.round(((anchor - base) / anchor) * 100) : 0;
            const hasDiscount = savingPct > 0;
            const anchorPriced = priceParts(anchor, market);
            const anchorText = anchorPriced.unit
              ? `${anchorPriced.value} ${anchorPriced.unit}`
              : anchorPriced.value;
            return (
              <div
                key={plan.type}
                className={[
                  "relative flex flex-col rounded-lg p-7",
                  plan.featured
                    ? "border-[1.5px] border-transparent shadow-[0_16px_40px_-26px_rgba(28,42,58,0.22)]"
                    : "border border-border-default bg-surface-overlay",
                ].join(" ")}
                style={
                  plan.featured
                    ? {
                        // warm tint (a 4% gold wash over the white card fill)
                        // + the same gold gradient BORDER as .tm-cta-gold.
                        backgroundImage: `linear-gradient(rgba(199,154,75,0.045), rgba(199,154,75,0.045)), linear-gradient(var(--surface-overlay), var(--surface-overlay)), ${GOLD_GRADIENT}`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, padding-box, border-box",
                      }
                    : undefined
                }
              >
                {/* Plan label + (featured) an integrated "most chosen"
                    micro-chip — part of the card's header row, not a
                    sticker pinned over the border. */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sans text-[12px] font-medium uppercase tracking-wide text-text-secondary">
                    {label}
                  </span>
                  {plan.featured && (
                    <span className="shrink-0 rounded-full border border-[color:var(--gold-mid)]/40 bg-[color:var(--gold-mid)]/[0.08] px-2 py-0.5 font-sans text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--gold-base)]">
                      {t.mostChosen}
                    </span>
                  )}
                </div>

                {/* Price hierarchy (identical in both cards):
                    live price + savings badge on one line → struck "was"
                    price → short descriptor → hairline → features → CTA.
                    flex-wrap lets the badge drop under the price on a very
                    narrow card instead of overflowing. */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-display text-[30px] font-medium leading-none text-text-primary">
                    {priced.value}
                    {priced.unit && (
                      <span className="font-sans text-[14px] font-normal"> {priced.unit}</span>
                    )}
                  </span>
                  {hasDiscount && (
                    <>
                      <SavingsBadge
                        urgency={t.badgeUrgency}
                        percent={t.badgePercent(savingPct)}
                      />
                      <span className="sr-only">{t.badgeSr(savingPct, anchorText)}</span>
                    </>
                  )}
                </div>

                {hasDiscount && (
                  <div className="mt-2">
                    <span className="font-sans text-[18px] text-text-muted line-through md:text-[19px]">
                      {anchorText}
                    </span>
                  </div>
                )}

                <p className={`${hasDiscount ? "mt-2.5" : "mt-2"} font-sans text-[12.5px] text-text-secondary`}>
                  {t.pagesStory(info.pages)}
                </p>

                <div className="mt-5 flex-1 border-t border-border-subtle pt-4">
                  {plan.features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={i}
                        className={["flex items-start gap-2.5 py-2", i === 0 ? "" : "border-t border-border-subtle"].join(
                          " "
                        )}
                      >
                        <Icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-accent-primary" />
                        <span className="font-sans text-[13px] text-text-primary">
                          {language === "UZ" ? f.textUz : f.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/begin/personalized-book/form"
                  className="tm-cta-gold mt-6 flex h-12 w-full items-center justify-center font-sans text-[13.5px] font-medium tracking-[0.015em]"
                >
                  {t.choosePlan(label)} →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Purchase reassurance — a calm strip, not footnotes and not
            cards. One hairline sets it apart from the plan grid. */}
        <div className="mx-auto mt-10 max-w-3xl border-t border-border-subtle pt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <div className="flex items-center gap-2.5">
              <Copy size={18} strokeWidth={1.75} className="shrink-0 text-accent-primary" />
              <span className="font-sans text-[14.5px] leading-snug text-text-secondary md:text-[15px]">
                {(market === "UZ" ? t.extraCopies : t.extraCopiesIntl)(
                  (() => {
                    const p = priceParts(MARKET_PRICING[market].extraCopy, market);
                    return p.unit ? `${p.value} ${p.unit}` : p.value;
                  })(),
                )}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck size={18} strokeWidth={1.75} className="shrink-0 text-accent-primary" />
              <span className="font-sans text-[14.5px] leading-snug text-text-secondary md:text-[15px]">
                {market === "UZ" ? t.deliveryUz : t.deliveryIntl}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={18} strokeWidth={1.75} className="shrink-0 text-accent-primary" />
              <span className="font-sans text-[14.5px] leading-snug text-text-secondary md:text-[15px]">
                {market === "UZ" ? t.readyInUz : t.readyInIntl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
