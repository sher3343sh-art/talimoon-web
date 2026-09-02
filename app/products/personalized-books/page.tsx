import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/products/personalized-books/hero/hero";
import ParentRecognition from "@/components/products/personalized-books/recognition/ParentRecognition";
import StorySolution from "@/components/products/personalized-books/story-solution/StorySolution";
import HowItWorks from "@/components/products/personalized-books/how-it-works/HowItWorks";
import TransformationProof from "@/components/products/personalized-books/proof/TransformationProof";
import PersonalizePreview from "@/components/products/personalized-books/personalize/PersonalizePreview";
import PhysicalProduct from "@/components/products/personalized-books/product/PhysicalProduct";
import PricingSection from "@/components/products/personalized-books/pricing/PricingSection";
import Objections from "@/components/products/personalized-books/objections/Objections";
import EmotionalBanner from "@/components/products/personalized-books/emotional-banner/EmotionalBanner";
import Footer from "@/components/layout/Footer";

/**
 * Personalized Books — SALES V2.
 * ----------------------------------------------------------------
 * One continuous buying experience, not a stack of feature sections.
 * Each chapter answers a different question:
 *   01 Hero .............. desire — "this book is about my child"
 *   02 ParentRecognition . "ha, bizda ham aynan shunday" (real daily
 *                          situations, never a label on the child)
 *   03 StorySolution ..... the mechanism — "Nasihatni hikoyaga
 *                          aylantiramiz" + one interactive micro-story
 *   04 HowItWorks ........ "how can a book be specific to MY child?"
 *   05 TransformationProof  proof: photo → character → cover → page
 *   06 PersonalizePreview  imagine it for YOUR child (no data kept)
 *   07 PhysicalProduct ... what you actually receive
 *   08 PricingSection .... value → price (no fake anchor), order entry
 *   09 Objections ....... the 5 real questions that stop a buyer
 *   10 EmotionalBanner .. the quiet close + final CTA
 *
 * Every order CTA resolves to #pricing, where choosing a plan opens
 * the shared PersonalizedBookOrderForm in the market the visitor
 * selected — no separate checkout, market context preserved.
 */
export default function PersonalizedBooksPage() {
  return (
    <>
      <Navbar ctaHref="#pricing" />

      <main>
        <Hero imageSrc="/images/products/personalized-books/hero/hero-v13.png" />

        <ParentRecognition />

        <StorySolution />

        <HowItWorks />

        <TransformationProof />

        <PersonalizePreview />

        <PhysicalProduct />

        <PricingSection />

        <Objections />

        <EmotionalBanner />
      </main>

      <Footer ctaHref="#pricing" />
    </>
  );
}
