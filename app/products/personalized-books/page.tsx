import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/products/personalized-books/hero/hero";
import Recognition from "@/components/products/personalized-books/acts/Recognition";
import Method from "@/components/products/personalized-books/acts/Method";
import Exclusivity from "@/components/products/personalized-books/acts/Exclusivity";
import ProcessPrice from "@/components/products/personalized-books/acts/ProcessPrice";
import Close from "@/components/products/personalized-books/acts/Close";
import Footer from "@/components/layout/Footer";

/**
 * Personalized Books — SALES V3.
 * ----------------------------------------------------------------
 * One scrolling story in SIX acts, each with its own visual rhythm.
 * Shorter than V2: repeated benefit grids ("personalized", "beautiful
 * illustration", "child is hero", "premium artwork") are gone; every
 * act now earns its place.
 *
 *   01 Hero .......... WONDER      "this isn't just a book with a name"
 *   02 Recognition ... TENSION     "necha marta?" — familiar phrases,
 *                                   resolving into "boshqacha yetkazish"
 *   03 Method ........ RELEASE     the mechanism, shown not explained
 *                                   (deep-navy beat, #method)
 *   04 Exclusivity ... DESIRE      "do'kondan topolmaysiz" + product
 *   05 ProcessPrice .. CONFIDENCE  3 steps + the real PricingSection
 *                                   (#pricing — market + order form)
 *   06 Close ......... WARMTH      the quiet ask + a compact FAQ
 *
 * Every order CTA resolves to #pricing, where choosing a plan opens
 * the shared PersonalizedBookOrderForm in the visitor's market —
 * no separate checkout, market context preserved.
 */
export default function PersonalizedBooksPage() {
  return (
    <>
      <Navbar ctaHref="#pricing" />

      <main>
        {/* Act 01 — copy lives in the Hero's own EN/UZ dictionary. */}
        <Hero
          imageSrc="/images/products/personalized-books/hero/hero-v13.png"
          secondaryCtaHref="#method"
        />

        <Recognition />

        <Method />

        <Exclusivity />

        <ProcessPrice />

        <Close />
      </main>

      <Footer ctaHref="#pricing" />
    </>
  );
}
