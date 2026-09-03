import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PersonalizedBookFormRoute from "./PersonalizedBookFormRoute";

/**
 * `/begin/personalized-book/form` — the actual Personalized Book order
 * form. This is the ONLY route that renders the questionnaire.
 *
 * Renders the EXISTING `PersonalizedBookOrderForm` (via a thin client
 * wrapper for its `onBack`) — no duplicate form. Navbar/Footer + top
 * clearance mirror `/begin` and `/begin/personalized-book/price`.
 */
export default function PersonalizedBookFormPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-[74px]">
        <PersonalizedBookFormRoute />
      </main>
      <Footer />
    </>
  );
}
