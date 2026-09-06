import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Aloqa — TALIMOON",
  description: "TALIMOON bilan Qatar, O‘zbekiston, WhatsApp, Telegram, Instagram yoki email orqali bog‘laning.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactPageContent />
      <Footer showTopCta={false} showHowItWorksLink={false} />
    </>
  );
}
