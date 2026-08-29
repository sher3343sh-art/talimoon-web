import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { JourneyFoundation } from '@/components/journey/JourneyFoundation';

export const metadata: Metadata = {
  title: 'Hayot — TALIMOON',
  description:
    "TALIMOON's living journal — what we are creating, the moments along the way, and what comes next.",
};

/**
 * HAYOT (Journey) — /journey.
 * ----------------------------------------------------------------
 * Increment 1 (foundation): route + data layer are in place;
 * `JourneyFoundation` renders HAYOT's honest empty state. The
 * opening experience, the YAQIN KUNLAR pulse and the HAYOTDAN
 * stream replace it in later increments. The route stays `/journey`
 * across locales; the nav label is "Hayot" (UZ) / "Journey" (EN).
 */
export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <JourneyFoundation />
      </main>
      <Footer />
    </>
  );
}
