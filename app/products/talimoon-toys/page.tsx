import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";

export default function TalimoonToysPage() {
  return (
    <>
      <Navbar />
      <ComingSoon
        title="Talimoon Toys"
        message="Soft, tactile companions designed to complement the stories are on their way."
      />
      <Footer />
    </>
  );
}
