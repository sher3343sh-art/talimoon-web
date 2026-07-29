import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import TrustStrip from "@/components/trust/TrustStrip";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import BookShowcase from "@/components/showcase/BookShowcase";
import InsideBook from "@/components/inside-book/InsideBook";
import EmotionalBanner from "@/components/emotional-banner/EmotionalBanner";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero imageSrc="/images/hero/hero-v13.png" />
        <TrustStrip />
        <HowItWorks />
        <BookShowcase />
        <InsideBook />
        <EmotionalBanner />
      </main>
    </>
  );
}
