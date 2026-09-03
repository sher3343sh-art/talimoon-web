import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/products/personalized-books/pricing/PricingSection";

/**
 * `/begin/personalized-book/price` — the Personalized Book pricing /
 * package-selection step of the order journey.
 *
 * Reuses the EXISTING `PricingSection` verbatim (same component the
 * product page renders at `#pricing`) — one pricing source of truth, no
 * duplicated values/calculations/market logic. Its "Choose …" buttons
 * navigate on to `/begin/personalized-book/form`, which is the only
 * place the actual order form lives.
 *
 * Navbar/Footer + top clearance mirror `/begin` so the two steps sit
 * under the fixed navbar identically.
 */
export default function PersonalizedBookPricePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[74px]">
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
