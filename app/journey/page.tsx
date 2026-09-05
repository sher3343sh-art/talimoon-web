import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { JourneyPremiere } from '@/components/journey/JourneyPremiere';
import { EditorialWorlds } from '@/components/journey/EditorialWorlds';
import { Hayotdan } from '@/components/journey/Hayotdan';
import { HayotEnding } from '@/components/journey/HayotEnding';

export const metadata: Metadata = {
  title: 'Hayot — TALIMOON',
  description:
    "TALIMOON's living editorial and knowledge space for parents — what TALIMOON is doing, and useful, evidence-based ideas for family life.",
};

/**
 * HAYOT (Journey) V3 — /journey.
 * ----------------------------------------------------------------
 * TALIMOON's living editorial + knowledge space, in three worlds
 * (TALIMOON HAYOTI · OTA-ONALAR UCHUN · ODATLAR VA ILM). One
 * shared editorial engine; the landing sequence:
 *
 *   A  PREMIERE            — one live slide per world, automatically
 *                           fed by that world's newest published entry.
 *   B  THREE WORLDS        — editorial gateways and latest previews.
 *   C  JOURNEY JOURNAL     — the complete mixed stream with a simple
 *                           world filter and editorial choreography.
 *   D  HAYOT DAVOM ETADI   — the quiet ending, then the site Footer.
 *
 * Route stays `/journey` across locales; nav label "Hayot" (UZ) /
 * "Journey" (EN). All content is data-driven via lib/journey.
 */
export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <JourneyPremiere />
        <EditorialWorlds />
        <Hayotdan />
        <HayotEnding />
      </main>
      <Footer showTopCta={false} />
    </>
  );
}
