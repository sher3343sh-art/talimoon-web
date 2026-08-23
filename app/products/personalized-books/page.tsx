import Navbar from "@/components/products/personalized-books/layout/Navbar";
import Hero from "@/components/products/personalized-books/hero/hero";
import TrustStrip from "@/components/products/personalized-books/trust/TrustStrip";
import HowItWorks from "@/components/products/personalized-books/how-it-works/HowItWorks";
import BookShowcase from "@/components/products/personalized-books/showcase/BookShowcase";
import InsideBook from "@/components/products/personalized-books/inside-book/InsideBook";
import PricingSection from "@/components/products/personalized-books/pricing/PricingSection";
import EmotionalBanner from "@/components/products/personalized-books/emotional-banner/EmotionalBanner";
import Footer from "@/components/products/personalized-books/layout/Footer";

export default function PersonalizedBooksPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero imageSrc="/images/products/personalized-books/hero/hero-v13.png" />

        <TrustStrip />

        <HowItWorks />

        <BookShowcase />

        <InsideBook />

        <PricingSection />

        <EmotionalBanner />
      </main>

      <Footer />
    </>
  );
}
