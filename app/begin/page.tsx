import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSelect from "@/components/begin/ProductSelect";

export default function BeginPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductSelect />
      </main>
      <Footer />
    </>
  );
}
