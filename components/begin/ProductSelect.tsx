"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";

type ProductId = "personalized-books" | "yusuf-yasmina" | "toys";

interface Product {
  id: ProductId;
  name: string;
  nameUz: string;
  tagline: string;
  taglineUz: string;
  /**
   * Card artwork. One visual family — the same painted "world" images
   * as the home "Our Products" doors — so the three cards clearly read
   * as siblings, each opening a different world (spec §2). These are
   * ASSET SLOTS: swap the path for approved final order-flow art when
   * it lands; do not invent replacement artwork here.
   *   personalized-books → the open-book world the child steps into
   *   yusuf-yasmina      → the approved Yusuf & Yasmina world
   *   toys               → the TALIMOON toy / character world
   */
  image: string;
  active: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: "personalized-books",
    name: "Personalized Books",
    nameUz: "Shaxsiylashtirilgan kitoblar",
    tagline: "Your child becomes the hero of a story created especially for them.",
    taglineUz: "Farzandingiz maxsus u uchun yaratilgan hikoyaning bosh qahramoniga aylanadi.",
    image: "/images/home/OurProducts/books-world.webp",
    active: true,
  },
  {
    id: "yusuf-yasmina",
    name: "Yusuf & Yasmina",
    nameUz: "Yusuf va Yasmina",
    tagline: "Faith-filled adventures that inspire kindness, courage, and character.",
    taglineUz: "Mehr-shafqat, jasorat va halollikni ilhomlantiruvchi imonli sarguzashtlar.",
    image: "/images/home/OurProducts/yusuf.webp",
    active: false,
  },
  {
    id: "toys",
    name: "Talimoon Toys",
    nameUz: "Talimoon o'yinchoqlari",
    tagline: "Beautiful toys that transform everyday play into joyful learning.",
    taglineUz: "Kundalik o'yinni quvonchli bilim olishga aylantiruvchi go'zal o'yinchoqlar.",
    image: "/images/home/OurProducts/toys.webp",
    active: false,
  },
];

const CHROME_EN = {
  eyebrow: "Start your order",
  heading: "Which world are you opening today?",
  stepInside: "Start your order",
  comingSoon: "Coming soon",
};

const CHROME_UZ: typeof CHROME_EN = {
  eyebrow: "Buyurtmani boshlash",
  heading: "Bugun qaysi olamni ochmoqchisiz?",
  stepInside: "Buyurtmani boshlash",
  comingSoon: "Tez orada",
};

export default function ProductSelect() {
  const chrome = useT(CHROME_EN, CHROME_UZ);
  const { language } = useLanguage();
  const router = useRouter();

  // `/begin` has ONE job: product selection. Picking a product changes
  // the URL to that product's own order journey — the flow is never
  // rendered inline while the address bar still says `/begin`.
  function openProduct(id: ProductId) {
    if (id === "personalized-books") {
      router.push("/begin/personalized-book/price");
    }
    // Other products are not active yet (see PRODUCTS[].active); their
    // routes (/begin/yusuf-yasmina/…, /begin/toys/…) are added later.
  }

  return (
    <section className="mx-auto w-full max-w-container-content bg-surface-base px-6 py-16 sm:px-8 md:py-20 lg:px-16 lg:py-28">
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
          const name = language === "UZ" ? product.nameUz : product.name;
          const tagline = language === "UZ" ? product.taglineUz : product.tagline;
          return (
            <button
              key={product.id}
              type="button"
              disabled={!product.active}
              onClick={() => product.active && openProduct(product.id)}
              className={[
                "group relative flex flex-col items-start rounded-md border border-border-default bg-surface-overlay p-6 text-left transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                "disabled:cursor-not-allowed",
                product.active ? "opacity-100" : "opacity-55",
              ].join(" ")}
            >
              <span className="relative mb-5 block aspect-[4/3] w-full overflow-hidden rounded-md border border-border-subtle bg-surface-base">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 22rem, 90vw"
                  className="object-cover"
                />
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
