import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TheOpening } from '@/components/journey/TheOpening';
import { YaqinKunlar } from '@/components/journey/YaqinKunlar';
import { Hayotdan } from '@/components/journey/Hayotdan';

export const metadata: Metadata = {
  title: 'Hayot — TALIMOON',
  description:
    "TALIMOON's living journal — what we are creating, the moments along the way, and what comes next.",
};

/**
 * HAYOT (Journey) — /journey.
 * ----------------------------------------------------------------
 * The living-memory page. Three movements + the site footer:
 *   THE OPENING   — the featured entry introduces the page
 *                   (`TheOpening`; falls back to the honest empty
 *                   state when nothing is published).
 *   YAQIN KUNLAR  — the forward pulse; renders nothing when there
 *                   is nothing meaningful ahead.
 *   HAYOTDAN      — the mixed-weight editorial stream; renders
 *                   nothing when the stream is empty.
 * Route stays `/journey` across locales; nav label is "Hayot" (UZ)
 * / "Journey" (EN). All content is data-driven via lib/journey.
 */
export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <TheOpening />
        <YaqinKunlar />
        <Hayotdan />
      </main>
      <Footer />
    </>
  );
}
