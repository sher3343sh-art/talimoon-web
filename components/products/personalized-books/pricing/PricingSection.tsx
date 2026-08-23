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
import { Book, Clock, Copy, Image as ImageIcon, Users, User } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import PersonalizedBookOrderForm from "@/components/begin/PersonalizedBookOrderForm";
import { BookType, PRICING, formatSom } from "@/components/begin/orderFormData";

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

// Struck-through "was" price — a display-only anchor value, not a real
// prior price point tracked anywhere else, so it lives here rather than
// in orderFormData.ts alongside the real PRICING numbers.
const ORIGINAL_PRICE: Record<BookType, number> = {
  single: 600_000,
  multi: 850_000,
};

const CHROME_EN = {
  eyebrow: "Pricing",
  heading: "Simple, transparent pricing",
  subheading: "No hidden fees. Every book is made to order and ready in 5–7 business days.",
  pagesStory: (pages: string) => `${pages} page personalized story`,
  choosePlan: (label: string) => `Choose ${label}`,
  mostChosen: "Most chosen",
  extraCopies: (amount: string) => `Extra copies: +${amount} each`,
  readyIn: "Ready in 5–7 business days",
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
};

function formatUzs(amount: number): string {
  return amount.toLocaleString("en-US").replace(/,/g, " ");
}

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<BookType | null>(null);
  const { language } = useLanguage();
  const t = useT(CHROME_EN, CHROME_UZ);

  if (selectedPlan) {
    return <PersonalizedBookOrderForm initialBookType={selectedPlan} onBack={() => setSelectedPlan(null)} />;
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

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const info = PRICING[plan.type];
            const label = language === "UZ" ? info.labelUz : info.label;
            return (
              <div
                key={plan.type}
                className={[
                  "relative flex flex-col rounded-lg bg-surface-overlay p-7",
                  plan.featured ? "border-[1.5px] border-accent-primary" : "border border-border-default",
                ].join(" ")}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 whitespace-nowrap rounded-pill bg-accent-primary px-3 py-1 font-sans text-[10.5px] font-medium uppercase tracking-wide text-white">
                    {t.mostChosen}
                  </span>
                )}

                <span className="font-sans text-[12px] font-medium uppercase tracking-wide text-text-secondary">
                  {label}
                </span>

                <div className="mt-2.5 flex items-baseline gap-2.5">
                  <span className="font-sans text-[15px] text-text-secondary line-through">
                    {formatUzs(ORIGINAL_PRICE[plan.type])}
                  </span>
                  <span className="font-display text-[30px] font-medium text-text-primary">
                    {formatUzs(info.base)}
                    <span className="font-sans text-[14px] font-normal"> {"so'm"}</span>
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
                  className="mt-6 w-full rounded-md bg-accent-primary py-3 font-sans text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
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
              {t.extraCopies(formatSom(PRICING.extraCopy))}
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
