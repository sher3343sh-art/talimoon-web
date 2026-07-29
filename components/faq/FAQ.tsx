/**
 * FAQ — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 * Container, spacing, and color tokens match Hero / TrustStrip /
 * HowItWorks / BookShowcase / InsideBook / EmotionalBanner / Footer /
 * Pricing.
 *
 * Plain editorial list — every question is permanently visible
 * with its answer beneath it, no accordion, no JS.
 */

const FAQS = [
  {
    question: "How long does it take?",
    answer: "Most books are completed within 5–7 business days.",
  },
  {
    question: "Can I personalize the story?",
    answer:
      "Yes. Every story is created around your child's name, personality, dreams and details you provide.",
  },
  {
    question: "What age is the book suitable for?",
    answer:
      "Our stories are designed primarily for children between 3 and 10 years old.",
  },
  {
    question: "Can I order more than one copy?",
    answer: "Yes. Additional copies can be ordered at a reduced price.",
  },
  {
    question: "Is every story unique?",
    answer: "Yes. Every child receives a story written specifically for them.",
  },
];

export function FAQ() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="w-full bg-[var(--surface-base,#F7F3EC)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="faq-heading"
            className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-5 font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            Everything parents usually ask before creating a personalized
            story.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl divide-y divide-[var(--border-subtle,rgba(42,36,29,0.12))] border-t border-[var(--border-subtle,rgba(42,36,29,0.12))]">
          {FAQS.map((item) => (
            <div key={item.question} className="py-8">
              <h3 className="font-serif text-[1.125rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
                {item.question}
              </h3>
              <p className="mt-3 font-sans text-[0.9375rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
