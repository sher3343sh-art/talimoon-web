/**
 * Pricing — TALIMOON
 * ----------------------------------------------------------------
 * Server component: no "use client", no state, no motion.
 * Container, spacing, and color tokens match Hero / TrustStrip /
 * HowItWorks / BookShowcase / InsideBook / EmotionalBanner / Footer.
 *
 * Single editorial card rather than a multi-tier SaaS table —
 * there is only one product.
 */

const FEATURES = [
  "Personalized story",
  "Premium illustrations",
  "Hardcover book",
  "Child's name throughout",
  "Personal dedication",
  "Gift-ready presentation",
];

export function Pricing() {
  return (
    <section
      aria-labelledby="pricing-heading"
      className="w-full bg-[var(--surface-base,#F7F3EC)] py-16 md:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="pricing-heading"
            className="font-serif text-[2.25rem] font-medium leading-[1.15] tracking-[-0.01em] text-[var(--text-primary,#2A241D)]"
          >
            Pricing
          </h2>
          <p className="mt-5 font-sans text-[1.125rem] leading-[1.65] text-[var(--text-secondary,#49433C)]">
            A personalized keepsake created with care, designed to be
            treasured for years.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <div className="rounded-sm border border-[var(--border-default,rgba(42,36,29,0.18))] px-8 py-12 sm:px-12 sm:py-14">
            <h3 className="font-serif text-[1.5rem] font-medium leading-[1.3] text-[var(--text-primary,#2A241D)]">
              Personalized Storybook
            </h3>

            <ul className="mt-8 space-y-4">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-baseline gap-3 font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 translate-y-[-2px] rounded-full bg-[var(--accent-primary,#B8935B)]"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] pt-8">
              <p className="font-serif text-[2rem] font-medium tracking-[-0.01em] text-[var(--text-primary,#2A241D)]">
                500,000 UZS
              </p>
            </div>

            <a
              href="#begin"
              className="mt-8 inline-flex h-14 w-full items-center justify-center rounded px-8 bg-[var(--accent-primary,#B8935B)] text-[15px] font-medium tracking-[0.02em] text-white hover:bg-[var(--accent-primary-hover,#9C7A47)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary,#B8935B)]"
            >
              Create Your Story
            </a>
          </div>

          <dl className="mt-10 space-y-4 border-t border-[var(--border-subtle,rgba(42,36,29,0.12))] pt-10">
            <div className="flex items-baseline justify-between gap-4 font-sans text-[0.9375rem] leading-[1.6]">
              <dt className="text-[var(--text-tertiary,#726C65)]">Delivery</dt>
              <dd className="text-[var(--text-secondary,#49433C)]">
                5–7 business days
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 font-sans text-[0.9375rem] leading-[1.6]">
              <dt className="text-[var(--text-tertiary,#726C65)]">
                Additional copies
              </dt>
              <dd className="text-[var(--text-secondary,#49433C)]">
                Each additional copy — 300,000 UZS
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
