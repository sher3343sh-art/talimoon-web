"use client";

/**
 * PricingSection — TALIMOON personalized-books product page
 * ----------------------------------------------------------------
 * Supersedes the old, unwired Pricing.tsx (single static card, no real
 * checkout path). This is the actual conversion point on the page: two
 * plan cards, and choosing one swaps this section in-place for the full
 * order wizard (PersonalizedBookOrderForm, shared with the /begin route
 * — see components/begin/) with that plan pre-selected. The price click
 * itself IS "Begin the Story" now, which is why every other CTA on this
 * page (navbar, hero, closing banner, footer) scroll-anchors to
 * `#pricing` below instead of navigating away — see page.tsx and the
 * CTA files for the reasoning per instance.
 *
 * Container/spacing matches every other section on this page exactly
 * (InsideBook, EmotionalBanner, etc: max-w-[1440px], px-5 md:px-10
 * lg:px-16, py-16 md:py-20 lg:py-28) — the two plan cards themselves
 * nest a narrower max-w-3xl inside that, the same "full-width section,
 * focused content" pattern ProductSelect already uses.
 */

import { useState } from "react";
import { Book, Clock, Copy, Globe, Image as ImageIcon, Users, User } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import PersonalizedBookOrderForm from "@/components/begin/PersonalizedBookOrderForm";
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
  subheading: "No hidden fees. Every book is made to order and ready in 5–7 business days.",
  pagesStory: (pages: string) => `${pages} page personalized story`,
  choosePlan: (label: string) => `Choose ${label}`,
  mostChosen: "Most chosen",
  extraCopies: (amount: string) => `Extra copies: +${amount} each`,
  readyIn: "Ready in 5–7 business days",
  marketUz: "Uzbekistan",
  marketIntl: "International",
  marketAria: "Order region",
  deliveryUz: "Tashkent city — free · other regions — 40 000 so‘m",
  deliveryIntl: "International postal delivery — $15 per order",
  sealTop: "Save",
  sealAmount: (pct: number) => `${pct}%`,
  sealSr: (pct: number, was: string) => `Save ${pct}% — was ${was}`,
};

const CHROME_UZ: typeof CHROME_EN = {
  eyebrow: "Narxlar",
  heading: "Sodda va shaffof narxlar",
  subheading: "Yashirin to'lovlar yo'q. Har bir kitob buyurtma asosida tayyorlanadi va 5–7 ish kunida tayyor bo'ladi.",
  pagesStory: (pages) => `${pages} betlik shaxsiylashtirilgan hikoya`,
  choosePlan: (label) => `${label} tanlash`,
  mostChosen: "Eng ko'p tanlanadi",
  extraCopies: (amount) => `Qo'shimcha nusxalar: har biri +${amount}`,
  readyIn: "5–7 ish kunida tayyor",
  marketUz: "O‘zbekiston",
  marketIntl: "Xalqaro",
  marketAria: "Buyurtma hududi",
  deliveryUz: "Toshkent shahri — bepul · boshqa viloyatlar — 40 000 so‘m",
  deliveryIntl: "Xalqaro pochta orqali yetkazib berish — buyurtmasiga $15",
  sealTop: "Chegirma",
  sealAmount: (pct) => `−${pct}%`,
  sealSr: (pct, was) => `${pct}% chegirma — avvalgi narx ${was}`,
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

/** Stamped-look starburst outline for the discount seal — an irregular
 *  14-point star. The per-point jitter is a fixed table, so the shape
 *  reads hand-cut but is byte-identical every render. Pure geometry. */
function starburstPath(spikes: number, cx: number, cy: number, outer: number, inner: number): string {
  const jitter = [1, 0.94, 1.04, 0.9, 1.06, 0.96, 1.01, 0.92, 1.05, 0.95, 1.02, 0.93, 1.03, 0.97];
  const step = Math.PI / spikes;
  let d = "";
  for (let i = 0; i < spikes * 2; i += 1) {
    const isOuter = i % 2 === 0;
    const r = isOuter ? outer * (jitter[(i / 2) % jitter.length] ?? 1) : inner;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

const SEAL_PATH = starburstPath(14, 50, 50, 47, 36);

/** Editorial discount medallion — navy stamp, dashed gold ring, cream
 *  lettering, set at a slight angle like a pressed wax seal. It sits
 *  BESIDE the live price, never over it. Decorative: aria-hidden, with
 *  the saving announced in an sr-only line next to the price. Entrance
 *  is one CSS scale/fade (see the <style> block), then fully static;
 *  prefers-reduced-motion drops the entrance entirely. */
function DiscountSeal({ topText, amount }: { topText: string; amount: string }) {
  return (
    <span
      aria-hidden="true"
      className="pb-seal pointer-events-none relative inline-flex h-[54px] w-[54px] shrink-0 select-none items-center justify-center sm:h-[62px] sm:w-[62px]"
    >
      <span
        className="relative inline-flex h-full w-full items-center justify-center"
        style={{ transform: "rotate(-7deg)" }}
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full drop-shadow-[0_2px_6px_rgba(33,29,24,0.25)]"
        >
          <path d={SEAL_PATH} fill="var(--surface-contrast)" />
          <circle
            cx="50"
            cy="50"
            r="33"
            fill="none"
            stroke="var(--gold-mid)"
            strokeWidth="1.6"
            strokeDasharray="1.8 2.8"
          />
        </svg>
        <span className="relative flex flex-col items-center leading-none text-[color:var(--surface-base)]">
          <span className="font-sans text-[7px] font-semibold uppercase tracking-[0.16em] sm:text-[7.5px]">
            {topText}
          </span>
          <span className="mt-[2px] font-display text-[13px] font-semibold sm:text-[15px]">{amount}</span>
        </span>
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
  const [selectedPlan, setSelectedPlan] = useState<BookType | null>(null);
  const { language } = useLanguage();
  const t = useT(CHROME_EN, CHROME_UZ);
  // Which MARKET the visitor is pricing for — not a currency picker.
  // Persisted so the choice carries across the page, and handed to the
  // order flow so "Order Now" opens in the same market the price shows
  // (spec §5, §8, §9, §31). Default to the home market.
  const { preference, setPreference } = useMarketPreference();
  const market: Market = preference ?? "UZ";

  if (selectedPlan) {
    return (
      <PersonalizedBookOrderForm
        initialBookType={selectedPlan}
        initialMarket={market}
        onBack={() => setSelectedPlan(null)}
      />
    );
  }

  return (
    <section id="pricing" className="w-full bg-surface-base py-16 md:py-20 lg:py-28">
      <style>{`
        .pb-seal { animation: pb-seal-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes pb-seal-in {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pb-seal { animation: none; }
        }
      `}</style>
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
                  plan.featured ? "border-[1.5px] border-transparent" : "border border-border-default bg-surface-overlay",
                ].join(" ")}
                style={
                  plan.featured
                    ? {
                        backgroundImage: `linear-gradient(var(--surface-overlay), var(--surface-overlay)), ${GOLD_GRADIENT}`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      }
                    : undefined
                }
              >
                {plan.featured && (
                  // .tm-cta-gold sets `position: relative` in an unlayered
                  // globals.css rule, which beats Tailwind's `absolute`
                  // utility regardless of source order (unlayered always
                  // wins over layered) — without this inline override the
                  // badge silently reverts to a normal-flow flex child and
                  // stretches to the card's full width. Inline style is the
                  // one thing with higher priority than an unlayered rule.
                  <span
                    className="tm-cta-gold left-7 -top-3 whitespace-nowrap px-3 py-1 font-sans text-[10.5px] font-medium uppercase tracking-wide"
                    style={{ position: "absolute", borderRadius: "999px" }}
                  >
                    {t.mostChosen}
                  </span>
                )}

                <span className="font-sans text-[12px] font-medium uppercase tracking-wide text-text-secondary">
                  {label}
                </span>

                {/* Price hierarchy: live selling price (dominant) → discount
                    seal → struck "was" price → the delivery/production row
                    below the grid. */}
                <div className="mt-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-display text-[30px] font-medium leading-none text-text-primary">
                      {priced.value}
                      {priced.unit && (
                        <span className="font-sans text-[14px] font-normal"> {priced.unit}</span>
                      )}
                    </span>
                    {hasDiscount && (
                      <div className="mt-1.5">
                        <span className="font-sans text-[14px] text-text-muted line-through">
                          {anchorText}
                        </span>
                        <span className="sr-only">{t.sealSr(savingPct, anchorText)}</span>
                      </div>
                    )}
                  </div>
                  {hasDiscount && <DiscountSeal topText={t.sealTop} amount={t.sealAmount(savingPct)} />}
                </div>

                <p className="mt-1 font-sans text-[12.5px] text-text-secondary">{t.pagesStory(info.pages)}</p>

                <div className="mt-5 flex-1">
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

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.type)}
                  className="tm-cta-gold mt-6 flex h-12 w-full items-center justify-center font-sans text-[13.5px] font-medium tracking-[0.015em]"
                >
                  {t.choosePlan(label)} →
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <Copy size={16} strokeWidth={1.5} className="text-text-secondary" />
            <span className="font-sans text-[13px] text-text-secondary">
              {t.extraCopies(
                (() => {
                  const p = priceParts(MARKET_PRICING[market].extraCopy, market);
                  return p.unit ? `${p.value} ${p.unit}` : p.value;
                })(),
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={16} strokeWidth={1.5} className="text-text-secondary" />
            <span className="font-sans text-[13px] text-text-secondary">
              {market === "UZ" ? t.deliveryUz : t.deliveryIntl}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} strokeWidth={1.5} className="text-text-secondary" />
            <span className="font-sans text-[13px] text-text-secondary">{t.readyIn}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
