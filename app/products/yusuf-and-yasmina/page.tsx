"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";
import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  title: "Yusuf & Yasmina",
  message: "This world is still being written. Soon, you'll meet the family behind the stories.",
};

const COPY_UZ: typeof COPY_EN = {
  title: "Yusuf va Yasmina",
  message: "Bu dunyo hali yozilmoqda. Tez orada hikoyalar ortidagi oila bilan tanishasiz.",
};

export default function YusufAndYasminaPage() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <>
      <Navbar />
      <ComingSoon title={t.title} message={t.message} />
      <Footer />
    </>
  );
}
