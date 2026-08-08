import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";

export default function StoryLibraryPage() {
  return (
    <>
      <Navbar />
      <ComingSoon
        title="Story Library"
        message="An ever-growing library of stories for every curious mind is on its way."
      />
      <Footer />
    </>
  );
}
