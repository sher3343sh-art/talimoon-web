import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TheOpening } from '@/components/journey/TheOpening';

export const metadata: Metadata = {
  title: 'Hayot — TALIMOON',
  description:
    "TALIMOON's living journal — what we are creating, the moments along the way, and what comes next.",
};

/**
 * HAYOT (Journey) — /journey.
 * ----------------------------------------------------------------
 * Increment 2: THE OPENING — the featured entry introduces the
 * page. `TheOpening` reads `getFeaturedEntry()` and falls back to
 * the honest empty state when nothing is published. The YAQIN
 * KUNLAR pulse and the HAYOTDAN stream are added below it in later
 * increments. Route stays `/journey` across locales; nav label is
 * "Hayot" (UZ) / "Journey" (EN).
 */
export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <TheOpening />
      </main>
      <Footer />
    </>
  );
}
