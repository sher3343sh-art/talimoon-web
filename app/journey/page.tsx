import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TheOpening } from '@/components/journey/TheOpening';
import { EditorialWorlds } from '@/components/journey/EditorialWorlds';
import { YaqinKunlar } from '@/components/journey/YaqinKunlar';
import { ParentFeature } from '@/components/journey/ParentFeature';
import { Hayotdan } from '@/components/journey/Hayotdan';
import { HayotEnding } from '@/components/journey/HayotEnding';

export const metadata: Metadata = {
  title: 'Hayot — TALIMOON',
  description:
    "TALIMOON's living editorial and knowledge space for parents — what TALIMOON is doing, and useful, evidence-based ideas for family life.",
};

/**
 * HAYOT (Journey) V2 — /journey.
 * ----------------------------------------------------------------
 * TALIMOON's living editorial + knowledge space, in three worlds
 * (TALIMOON HAYOTI · OTA-ONALAR UCHUN · ODATLAR VA ILM). One
 * shared editorial engine; the landing sequence:
 *
 *   A  THE OPENING        — the current editorial story (any world),
 *                           or the refined identity state.
 *   B  THREE WORLDS        — the editorial gateways (a contents page,
 *                           not cards).
 *   C  YAQIN KUNLAR        — TALIMOON HAYOTI's forward pulse
 *                           (quiet intentional state when empty).
 *   D  PARENT FEATURE      — one selected OTA-ONALAR UCHUN piece
 *                           (restrained state when empty).
 *   E  HAYOTDAN            — one mixed stream across all worlds;
 *                           each item world-labelled; choreography
 *                           by editorial weight, never equal cards.
 *   F  HAYOT DAVOM ETADI   — the quiet ending, then the site Footer.
 *
 * Route stays `/journey` across locales; nav label "Hayot" (UZ) /
 * "Journey" (EN). All content is data-driven via lib/journey.
 */
export default function JourneyPage() {
  return (
    <>
      <Navbar />
      <main>
        <TheOpening />
        <EditorialWorlds />
        <YaqinKunlar />
        <ParentFeature />
        <Hayotdan />
        <HayotEnding />
      </main>
      <Footer showTopCta={false} />
    </>
  );
}
