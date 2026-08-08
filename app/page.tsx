import Navbar from "@/components/layout/Navbar";
import { HeroSlider } from "@/components/hero/Hero";
import { BrandValues } from "@/components/values/BrandValues";
import { FourDoorsSection } from "@/components/our-products/FourDoorsSection";
import { StoryLibraryPreview } from "@/components/story-library-preview/StoryLibraryPreview";
import { RealTalimoonMoments } from "@/components/real-talimoon-moments/RealTalimoonMoments";
import { FamiliesWall } from "@/components/families-wall/FamiliesWall";
import { PartnersPreview } from "@/components/partners/PartnersPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSlider />
        <BrandValues />
        <FourDoorsSection />
        <StoryLibraryPreview />
        <RealTalimoonMoments />
        <FamiliesWall />
        <PartnersPreview />
      </main>

      <Footer showHowItWorksLink={false} />
    </>
  );
}