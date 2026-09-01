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
  ANCHOR_PRICE,
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
                  "rounded-full px-4 py-1.5 font-sans text-[12.5px] font-medium transition-colors duration-200 motion-reduce:transition-none",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                  on
                    ? "bg-accent-primary/[0.12] text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
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
            const anchor = ANCHOR_PRICE[market][plan.type];
            const priced = priceParts(base, market);
            const anchorText = priceParts(anchor, market).value;
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

                <div className="mt-2.5 flex items-baseline gap-2.5">
                  <span className="font-sans text-[15px] text-text-secondary line-through">
                    {anchorText}
                  </span>
                  <span className="font-display text-[30px] font-medium text-text-primary">
                    {priced.value}
                    {priced.unit && (
                      <span className="font-sans text-[14px] font-normal"> {priced.unit}</span>
                    )}
                  </span>
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
