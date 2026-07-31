import { MaskedImage } from "@/components/ui/MaskedImage";

interface Step {
  title: string;
  sentence: string;
  alt: string;
  /** Populate once the photography is ready; MaskedImage renders its placeholder until then. */
  image?: string;
}

const STEPS: Step[] = [
  {
    title: "Tell Us About Your Child",
    sentence: "Share their name, personality, dreams and photos.",
    alt: "A parent filling in details and photos about their child",
    image: "/images/how-it-works/step-1-family-details.svg",
  },
  {
    title: "We Create Their Story",
    sentence:
      "Our writers and illustrators craft a unique personalized adventure.",
    alt: "An illustrator sketching a page of a personalized storybook",
    image: "/images/how-it-works/step-2-create-story.svg",
  },
  {
    title: "Printed With Care",
    sentence: "Every book is beautifully produced using premium materials.",
    alt: "A finished storybook being printed on premium paper",
    image: "/images/how-it-works/step-3-printed-with-care.svg",
  },
  {
    title: "Delivered To Your Family",
    sentence: "A timeless keepsake arrives ready to be treasured.",
    alt: "A child holding their personalized storybook at home",
    image: "/images/how-it-works/step-4-delivered-to-your-family.svg",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="w-full bg-[var(--surface-warm-100,#F7F2EA)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary,#726C65)]">
            The Process
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-serif text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] text-[var(--text-primary,#2A241D)] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[2.75rem]"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-6 max-w-[42ch] font-sans text-[1.0625rem] leading-[1.65] text-[var(--text-secondary,#49433C)] md:text-[1.125rem]">
            From a few details about your child to a keepsake in their hands —
            here is the entire journey.
          </p>
        </div>

        <div className="relative mt-10 md:mt-12 lg:mt-16">
          {/* Atmosphere, not decoration: a single hairline, barely
              there, felt more than seen. Positioned in the gap below
              the illustrations (lg:h-[216px] tall) rather than
              crossing through them — it reads as continuity between
              the photos, never as a mark on top of one. Confined to
              lg: where the row is a single line and a connector reads
              correctly; on narrower layouts the stacked cards already
              imply sequence on their own. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[172px] hidden h-px bg-[var(--text-primary,#2A241D)]/[0.06] lg:block"
          />

          <ol className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-x-10">
            {STEPS.map((step, idx) => (
              <li
                key={step.title}
                className="flex flex-col items-center text-center"
              >
                <span className="sr-only">
                  Step {idx + 1} of {STEPS.length}:{" "}
                </span>

                <MaskedImage
                  src={step.image}
                  alt={step.alt}
                  sizes="(min-width: 1024px) 216px, (min-width: 768px) 192px, 168px"
                  className="h-[118px] w-[168px] md:h-[136px] md:w-[192px] lg:h-[152px] lg:w-[216px]"
                />

                <h3 className="mt-8 font-serif text-[1.375rem] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--text-primary,#2A241D)] md:mt-9 lg:mt-10">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-[26ch] font-sans text-[0.9375rem] leading-[1.6] text-[var(--text-secondary,#49433C)]">
                  {step.sentence}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
