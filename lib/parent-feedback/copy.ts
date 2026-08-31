/**
 * TALIMOON — PARENT / COMMUNITY FEEDBACK — localized copy.
 * ================================================================
 * All four site languages are authored (UZ · EN · RU · AR) — nothing
 * falls back to English. Uses the same `Record<Locale, …>` +
 * `toLocale(language)` pattern as the sibling home section
 * `HayotGateway`, not the two-language `useT(EN, UZ)` helper, because
 * this section must read correctly in RU and AR too.
 *
 * SEMANTICS: this is where parents/community members share their
 * feedback, impressions and thoughts ABOUT TALIMOON. It is not a
 * story-submission area — no "hikoya", "your story", "family story"
 * wording for the comment itself. ("hikoya" may still appear inside a
 * real parent's comment when they mean a TALIMOON story/book — that's
 * the product, and it's fine.)
 *
 * Arabic strings are RTL; the section sets `dir="rtl"` for `ar` and
 * uses logical properties / `rtl:` variants for anything directional.
 */

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toLocale, type Locale } from "@/lib/journey/types";
import type { ReactionType } from "./feedback";

export interface SectionCopy {
  eyebrow: string;
  headline: string;
  supporting: string;
  /** Brand token inside `supporting`, highlighted in the accent colour. */
  brand: string;

  /** Submission field. */
  inputLabel: string;
  inputPlaceholder: string;
  submit: string;
  submitting: string;
  moderationNote: string;
  submittedTitle: string;
  submittedBody: string;

  /** Approved-feedback carousel. */
  fromParents: string;
  emptyState: string;
  verifiedBadge: string;

  /** Carousel navigation. */
  prev: string;
  next: string;
  carouselNav: string;
  showFrom: (name: string) => string;

  /** Reactions. */
  reactRowLabel: string;
  reactionLabel: Record<ReactionType, string>;
  /** e.g. "Sevgi reaksiyasini tanlash — 3 ta" (+ ", tanlangan" when active). */
  reactionAria: (label: string, count: number, active: boolean) => string;
  reactionError: string;
}

const COPY: Record<Locale, SectionCopy> = {
  uz: {
    eyebrow: "OTA-ONALAR FIKRI",
    headline: "TALIMOON haqida siz nima deysiz?",
    supporting:
      " bilan bog‘liq fikrlaringiz, taassurotlaringiz va takliflaringizni biz bilan bo‘lishing.",
    brand: "TALIMOON",
    inputLabel: "TALIMOON haqidagi fikringiz",
    inputPlaceholder: "Fikringizni yozib qoldiring...",
    submit: "Fikrni yuborish",
    submitting: "Yuborilmoqda…",
    moderationNote:
      "Har bir fikr ommaga ko‘rsatilishidan oldin ko‘rib chiqiladi.",
    submittedTitle: "Rahmat.",
    submittedBody:
      "Fikringiz qabul qilindi va ko‘rib chiqilgach shu yerda ko‘rinadi.",
    fromParents: "OTA-ONALARDAN",
    emptyState:
      "Birinchi tasdiqlangan ota-ona fikrlari tez orada shu yerda paydo bo‘ladi.",
    verifiedBadge: "TASDIQLANGAN TALIMOON OILASI",
    prev: "Oldingi fikr",
    next: "Keyingi fikr",
    carouselNav: "Fikrlar navigatsiyasi",
    showFrom: (name) => `${name} fikrini ko‘rsatish`,
    reactRowLabel: "Bu fikrga munosabat bildiring",
    reactionLabel: {
      smile: "Tabassum",
      love: "Sevgi",
      moved: "Ta’sirlandi",
      applause: "Ajoyib",
      dislike: "Yoqmadi",
    },
    reactionAria: (label, count, active) =>
      `${label} reaksiyasini tanlash — ${count} ta${active ? ", tanlangan" : ""}`,
    reactionError: "Reaksiya saqlanmadi. Qayta urinib ko‘ring.",
  },

  en: {
    eyebrow: "WHAT PARENTS SAY",
    headline: "What do you say about TALIMOON?",
    supporting:
      " — share your thoughts, impressions and suggestions with us.",
    brand: "TALIMOON",
    inputLabel: "Your thoughts about TALIMOON",
    inputPlaceholder: "Leave your feedback...",
    submit: "Send feedback",
    submitting: "Sending…",
    moderationNote: "Every comment is reviewed before it appears publicly.",
    submittedTitle: "Thank you.",
    submittedBody:
      "Your feedback has been received and will appear here after review.",
    fromParents: "FROM PARENTS",
    emptyState: "The first approved parent comments will appear here soon.",
    verifiedBadge: "VERIFIED TALIMOON FAMILY",
    prev: "Previous comment",
    next: "Next comment",
    carouselNav: "Feedback navigation",
    showFrom: (name) => `Show feedback from ${name}`,
    reactRowLabel: "React to this comment",
    reactionLabel: {
      smile: "Smile",
      love: "Love",
      moved: "Moved",
      applause: "Bravo",
      dislike: "Didn’t like",
    },
    reactionAria: (label, count, active) =>
      `React with ${label} — ${count}${active ? ", selected" : ""}`,
    reactionError: "Reaction wasn’t saved. Please try again.",
  },

  ru: {
    eyebrow: "МНЕНИЯ РОДИТЕЛЕЙ",
    headline: "Что вы скажете о TALIMOON?",
    supporting:
      " — поделитесь с нами своими мыслями, впечатлениями и предложениями.",
    brand: "TALIMOON",
    inputLabel: "Ваше мнение о TALIMOON",
    inputPlaceholder: "Оставьте свой отзыв...",
    submit: "Отправить отзыв",
    submitting: "Отправляется…",
    moderationNote: "Каждый отзыв проверяется перед публикацией.",
    submittedTitle: "Спасибо.",
    submittedBody: "Ваш отзыв получен и появится здесь после проверки.",
    fromParents: "ОТ РОДИТЕЛЕЙ",
    emptyState: "Первые одобренные отзывы родителей скоро появятся здесь.",
    verifiedBadge: "ПОДТВЕРЖДЁННАЯ СЕМЬЯ TALIMOON",
    prev: "Предыдущий отзыв",
    next: "Следующий отзыв",
    carouselNav: "Навигация по отзывам",
    showFrom: (name) => `Показать отзыв: ${name}`,
    reactRowLabel: "Отреагировать на этот отзыв",
    reactionLabel: {
      smile: "Улыбка",
      love: "Любовь",
      moved: "Тронут",
      applause: "Браво",
      dislike: "Не понравилось",
    },
    reactionAria: (label, count, active) =>
      `Реакция «${label}» — ${count}${active ? ", выбрано" : ""}`,
    reactionError: "Реакция не сохранена. Попробуйте ещё раз.",
  },

  ar: {
    eyebrow: "آراء الآباء والأمهات",
    headline: "ماذا تقولون عن TALIMOON؟",
    supporting: " — شاركونا أفكاركم وانطباعاتكم واقتراحاتكم.",
    brand: "TALIMOON",
    inputLabel: "رأيك حول TALIMOON",
    inputPlaceholder: "اكتب رأيك...",
    submit: "إرسال الرأي",
    submitting: "جارٍ الإرسال…",
    moderationNote: "تتم مراجعة كل رأي قبل عرضه للعامة.",
    submittedTitle: "شكرًا لك.",
    submittedBody: "تم استلام رأيك وسيظهر هنا بعد المراجعة.",
    fromParents: "من الآباء والأمهات",
    emptyState: "ستظهر هنا قريبًا أول آراء الآباء والأمهات المعتمدة.",
    verifiedBadge: "عائلة TALIMOON موثّقة",
    prev: "الرأي السابق",
    next: "الرأي التالي",
    carouselNav: "التنقل بين الآراء",
    showFrom: (name) => `عرض رأي ${name}`,
    reactRowLabel: "تفاعل مع هذا الرأي",
    reactionLabel: {
      smile: "ابتسامة",
      love: "حب",
      moved: "تأثّر",
      applause: "رائع",
      dislike: "لم يعجبني",
    },
    reactionAria: (label, count, active) =>
      `تفاعل ${label} — ${count}${active ? "، محدد" : ""}`,
    reactionError: "لم يتم حفظ التفاعل. حاول مرة أخرى.",
  },
};

/** The current locale's section copy, plus its RTL flag. */
export function useFeedbackCopy(): { copy: SectionCopy; locale: Locale; isRTL: boolean } {
  const { language } = useLanguage();
  const locale = toLocale(language);
  return { copy: COPY[locale] ?? COPY.en, locale, isRTL: locale === "ar" };
}
