import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSelect from "@/components/begin/ProductSelect";

export default function BeginPage() {
  return (
    <>
      <Navbar />
      {/* Navbar is `fixed`, so the first section on this route needs its
          own top clearance — 64px below `lg` (mobile bar height), 74px at
          `lg`+ (desktop bar height). Lives here rather than baked into
          ProductSelect/PersonalizedBookOrderForm's own padding, since one
          swaps for the other on this same page and both need identical
          clearance only because THIS route puts them directly under the
          navbar — a component embedded mid-page elsewhere (e.g.
          PricingSection on the product page) has no such need. */}
      <main className="pt-16 lg:pt-[74px]">
        <ProductSelect />
      </main>
      <Footer />
    </>
  );
}
