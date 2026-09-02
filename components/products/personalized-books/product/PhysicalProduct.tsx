"use client";

/**
 * PhysicalProduct — Personalized Books Sales V2, chapter 07.
 * ----------------------------------------------------------------
 * The one place the page states what a buyer physically receives.
 * Gathers the product facts that used to be scattered and repeated
 * across BookShowcase ("Beautiful Hardcover / Personalized Story /
 * Premium Illustrations / Made With Care") and InsideBook
 * ("Personalized Hero / Positive Values / …") into a single spec
 * list — after the emotional and personalization chapters have done
 * their work, so it reads as "here's the object", not another
 * feature pitch.
 *
 * Every figure here is real and comes from the centralized pricing/
 * product source (page ranges from PRICING in orderFormData), the
 * order flow's actual capabilities (multi-child, a personal message),
 * and the published 5–7 day production window. Nothing is invented.
 *
 * Imagery: the existing TALIMOON book illustration. Real hardcover
 * photography would strengthen this frame — see the completion
 * report's asset spec.
 */

import Image from "next/image";
import { useT } from "@/lib/i18n/LanguageContext";
import { PRICING } from "@/components/begin/orderFormData";
import { Reveal } from "../_shared/Reveal";

interface Spec {
  title: string;
  detail: string;
}

const COPY_EN = {
  eyebrow: "The book itself",
  heading: "Their story. In a real book.",
  lead: "What you're paying for, in plain terms.",
  imageAlt: "The TALIMOON personalized hardcover book",
  specs: [
    {
      title: "Your child is the hero",
      detail: "Every page is written around them — not a template with a name dropped in.",
    },
    {
      title: "Custom illustrations from their photos",
      detail: "Their likeness drawn into the artwork of the story.",
    },
    {
      title: "Hardcover keepsake edition",
      detail: "Made to be kept on the shelf and re-read for years.",
    },
    {
      title: `${PRICING.single.pages} pages for one child · ${PRICING.multi.pages} for siblings`,
      detail: "A full personalized story, not a short booklet.",
    },
    {
      title: "More than one child in one story",
      detail: "Siblings can be woven into the same book, each as themselves.",
    },
    {
      title: "A personal message from you",
      detail: "A few words of your own, printed at the end of the book.",
    },
    {
      title: "Ready in 5–7 days after confirmation",
      detail: "Each book is made to order once your details are confirmed.",
    },
  ] satisfies Spec[],
};

const COPY_UZ: typeof COPY_EN = {
  eyebrow: "Kitobning o‘zi",
  heading: "Uning hikoyasi. Haqiqiy kitobda.",
  lead: "Siz nima uchun to‘layotganingiz — sodda qilib.",
  imageAlt: "TALIMOON shaxsiylashtirilgan qattiq muqovali kitobi",
  specs: [
    {
      title: "Farzandingiz — bosh qahramon",
      detail: "Har bir sahifa andozaga ism qo‘shish emas, uning atrofida yoziladi.",
    },
    {
      title: "Suratlaridan yaratilgan maxsus illyustratsiyalar",
      detail: "Uning qiyofasi hikoya rasmlariga chizib kiritiladi.",
    },
    {
      title: "Qattiq muqovali, umrbod saqlanadigan nashr",
      detail: "Javonda saqlab, yillar davomida qayta o‘qish uchun.",
    },
    {
      title: `Bitta farzand uchun ${PRICING.single.pages} bet · bir nechta farzand uchun ${PRICING.multi.pages} bet`,
      detail: "Qisqa buklet emas, to‘liq shaxsiylashtirilgan hikoya.",
    },
    {
      title: "Bitta hikoyada bir nechta farzand",
      detail: "Aka-uka va opa-singillar bitta kitobda, har biri o‘zi bo‘lib qatnashadi.",
    },
    {
      title: "Sizdan shaxsiy xabar",
      detail: "O‘zingizdan bir necha so‘z kitob oxirida chop etiladi.",
    },
    {
      title: "Tasdiqlangach, 5–7 kunda tayyor",
      detail: "Har bir kitob ma’lumotlaringiz tasdiqlangandan so‘ng buyurtma asosida tayyorlanadi.",
    },
  ] satisfies Spec[],
};

export default function PhysicalProduct() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <section
      aria-labelledby="physical-product-heading"
      className="w-full bg-[var(--surface-warm-200,#EFE7DA)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-16">
        <Reveal className="lg:sticky lg:top-24">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            <div className="relative h-full w-full overflow-hidden rounded-sm shadow-[0_20px_50px_rgba(42,36,29,0.18)]">
              <Image
                src="/images/book-show-case/talimoon-show-book.svg"
                alt={t.imageAlt}
                fill
                unoptimized
                sizes="(min-width:1024px) 384px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
              {t.eyebrow}
            </p>
            <h2
              id="physical-product-heading"
              className="mt-3 font-serif text-[1.875rem] font-medium leading-[1.15] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.25rem] md:text-[2.5rem]"
            >
              {t.heading}
            </h2>
            <p className="mt-4 font-sans text-[1rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
              {t.lead}
            </p>
          </Reveal>

          <ul className="mt-8 divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))] border-t border-[var(--border-subtle,rgba(42,36,29,0.12))]">
            {t.specs.map((spec, i) => (
              <Reveal as="li" key={i} delay={(i % 3) * 60} className="py-4">
                <p className="font-serif text-[1.0625rem] font-medium leading-[1.35] text-[var(--text-primary,#2A241D)]">
                  {spec.title}
                </p>
                <p className="mt-1 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                  {spec.detail}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
