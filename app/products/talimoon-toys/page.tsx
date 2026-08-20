"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";
import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  title: "Talimoon Toys",
  message: "Soft, tactile companions designed to complement the stories are on their way.",
};

const COPY_UZ: typeof COPY_EN = {
  title: "Talimoon o'yinchoqlari",
  message: "Hikoyalarimizni to'ldiruvchi yumshoq va sezgir o'yinchoq-hamrohlar tez orada yo'lga chiqadi.",
};

export default function TalimoonToysPage() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <>
      <Navbar />
      <ComingSoon title={t.title} message={t.message} />
      <Footer />
    </>
  );
}
