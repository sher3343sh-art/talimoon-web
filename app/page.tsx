import Navbar from "@/components/layout/Navbar";
import { HeroSlider } from "@/components/hero/Hero";
import { BrandValues } from "@/components/values/BrandValues";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import BookShowcase from "@/components/showcase/BookShowcase";
import InsideBook from "@/components/inside-book/InsideBook";
import EmotionalBanner from "@/components/emotional-banner/EmotionalBanner";
import Examples from "@/components/examples/Examples";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSlider />
        <BrandValues />
        <HowItWorks />
        <Examples />
        <BookShowcase />
        <InsideBook />
        <EmotionalBanner />
      </main>
    </>
  );
}