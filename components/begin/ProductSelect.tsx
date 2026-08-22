"use client";

import { useState } from "react";
import { BookOpen, Sparkles, Blocks, ArrowRight } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import PersonalizedBookOrderForm from "./PersonalizedBookOrderForm";

type ProductId = "personalized-books" | "yusuf-yasmina" | "toys";

interface Product {
  id: ProductId;
  name: string;
  nameUz: string;
  tagline: string;
  taglineUz: string;
  icon: React.ElementType;
  active: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "personalized-books",
    name: "Personalized Books",
    nameUz: "Shaxsiylashtirilgan kitoblar",
    tagline: "Your child becomes the hero of a story created especially for them.",
    taglineUz: "Farzandingiz maxsus u uchun yaratilgan hikoyaning bosh qahramoniga aylanadi.",
    icon: BookOpen,
    active: true,
  },
  {
    id: "yusuf-yasmina",
    name: "Yusuf & Yasmina",
    nameUz: "Yusuf va Yasmina",
    tagline: "Faith-filled adventures that inspire kindness, courage, and character.",
    taglineUz: "Mehr-shafqat, jasorat va halollikni ilhomlantiruvchi imonli sarguzashtlar.",
    icon: Sparkles,
    active: false,
  },
  {
    id: "toys",
    name: "Talimoon Toys",
    nameUz: "Talimoon o'yinchoqlari",
    tagline: "Beautiful toys that transform everyday play into joyful learning.",
    taglineUz: "Kundalik o'yinni quvonchli bilim olishga aylantiruvchi go'zal o'yinchoqlar.",
    icon: Blocks,
    active: false,
  },
];

const CHROME_EN = {
  eyebrow: "Begin the story",
  heading: "Which world are you opening today?",
  stepInside: "Step inside",
  comingSoon: "Coming soon",
};

const CHROME_UZ: typeof CHROME_EN = {
  eyebrow: "Hikoyani boshlash",
  heading: "Bugun qaysi olamni ochmoqchisiz?",
  stepInside: "Ichkariga kiring",
  comingSoon: "Tez orada",
};

export default function ProductSelect() {
  const [selected, setSelected] = useState<ProductId | null>(null);
  const chrome = useT(CHROME_EN, CHROME_UZ);
  const { language } = useLanguage();

  if (selected === "personalized-books") {
    return <PersonalizedBookOrderForm onBack={() => setSelected(null)} />;
  }

  return (
    <section className="mx-auto w-full max-w-container-content bg-surface-base px-6 pb-16 pt-32 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-accent-primary">
          {chrome.eyebrow}
        </p>
        <h1 className="font-display text-[32px] font-medium leading-[1.15] tracking-tight text-text-primary sm:text-[40px]">
          {chrome.heading}
        </h1>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
        {PRODUCTS.map((product) => {
          const Icon = product.icon;
          const name = language === "UZ" ? product.nameUz : product.name;
          const tagline = language === "UZ" ? product.taglineUz : product.tagline;
          return (
            <button
              key={product.id}
              type="button"
              disabled={!product.active}
              onClick={() => product.active && setSelected(product.id)}
              className={[
                "group relative flex flex-col items-start rounded-md border border-border-default bg-surface-overlay p-6 text-left transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                "disabled:cursor-not-allowed",
                product.active ? "opacity-100" : "opacity-55",
              ].join(" ")}
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent-primary/[0.12]">
                <Icon size={20} strokeWidth={1.5} className="text-accent-primary" />
              </span>

              <h3 className="font-display text-[19px] font-medium text-text-primary">
                {name}
              </h3>
              <p className="mt-2 font-sans text-[13.5px] leading-[1.5] text-text-secondary">
                {tagline}
              </p>

              <span
                className={[
                  "mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] font-medium",
                  product.active ? "text-text-primary" : "text-text-secondary",
                ].join(" ")}
              >
                {product.active ? (
                  <>
                    {chrome.stepInside}
                    <ArrowRight
                      size={14}
                      strokeWidth={1.75}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                ) : (
                  chrome.comingSoon
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
