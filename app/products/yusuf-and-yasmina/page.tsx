import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";

export default function YusufAndYasminaPage() {
  return (
    <>
      <Navbar />
      <ComingSoon
        title="Yusuf & Yasmina"
        message="This world is still being written. Soon, you'll meet the family behind the stories."
      />
      <Footer />
    </>
  );
}
