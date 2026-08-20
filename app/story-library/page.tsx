"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";
import { useT } from "@/lib/i18n/LanguageContext";

const COPY_EN = {
  title: "Story Library",
  message: "An ever-growing library of stories for every curious mind is on its way.",
};

const COPY_UZ: typeof COPY_EN = {
  title: "Hikoyalar kutubxonasi",
  message: "Har bir qiziquvchan aql uchun tobora boyib boruvchi hikoyalar kutubxonasi tez orada tayyor bo'ladi.",
};

export default function StoryLibraryPage() {
  const t = useT(COPY_EN, COPY_UZ);

  return (
    <>
      <Navbar />
      <ComingSoon title={t.title} message={t.message} />
      <Footer />
    </>
  );
}
