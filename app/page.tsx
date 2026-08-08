import Navbar from "@/components/layout/Navbar";
import { HeroSlider } from "@/components/hero/Hero";
import { BrandValues } from "@/components/values/BrandValues";
import { FourDoorsSection } from "@/components/our-products/FourDoorsSection";
import BookShowcase from "@/components/showcase/BookShowcase";
import InsideBook from "@/components/inside-book/InsideBook";
import EmotionalBanner from "@/components/emotional-banner/EmotionalBanner";
import Examples from "@/components/examples/Examples";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSlider />
        <BrandValues />
        <FourDoorsSection />
        <Examples />
        <BookShowcase />
        <InsideBook />
        <EmotionalBanner />
      </main>

      <Footer showHowItWorksLink={false} />
    </>
  );
}