import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutOrigin } from '@/components/about/AboutOrigin';
import { AboutUniverse } from '@/components/about/AboutUniverse';
import { AboutChildPerspective } from '@/components/about/AboutChildPerspective';
import { AboutCreativeBelief } from '@/components/about/AboutCreativeBelief';
import { AboutParentChild } from '@/components/about/AboutParentChild';
import { AboutPeople } from '@/components/about/AboutPeople';
import { AboutHowWeCreate } from '@/components/about/AboutHowWeCreate';
import { AboutFuture } from '@/components/about/AboutFuture';
import { AboutQuietEnding } from '@/components/about/AboutQuietEnding';

export const metadata: Metadata = {
  title: 'About — TALIMOON',
  description:
    'A whole world lives inside every child. Why TALIMOON exists, how we see childhood, what we believe about creation, and where the TALIMOON world is going.',
};

/**
 * ABOUT / BIZ HAQIMIZDA — one continuous editorial story, not a
 * corporate About page.
 *
 * Narrative arc (curiosity → human connection → discovery → emotional
 * proof → expansion → belief → trust → meet the people → capability →
 * ambition → quiet confidence — never labelled in the UI):
 *
 *   Hero        — curiosity, restrained
 *   Origin      — WHY TALIMOON exists (three moments: distance, the
 *                 first story, the response) + the TALIMOON name
 *   Universe    — placed right after Origin on purpose: the visitor
 *                 has just understood WHY; now sees WHAT it's becoming
 *   Child persp.— HOW TALIMOON looks at childhood (not a repeat of Origin)
 *   Creative belief — the PRINCIPLES behind what gets made
 *   Parent+child— the family the brand is actually for
 *   People      — who is building it, in their own weight
 *   How we create — the PROCESS that makes it (not the same as belief)
 *   Future      — direction, not hype
 *   Quiet ending— confidence, then the Footer (no commercial pre-footer
 *                 CTA — the nav already gives access to ordering)
 *
 * Each section owns a different visual rhythm; the global design
 * system (nav, footer, type, colour, spacing) is reused, never
 * redesigned.
 */
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutOrigin />
        <AboutUniverse />
        <AboutChildPerspective />
        <AboutCreativeBelief />
        <AboutParentChild />
        <AboutPeople />
        <AboutHowWeCreate />
        <AboutFuture />
        <AboutQuietEnding />
      </main>
      {/* No commercial pre-footer CTA on About — the emotional brand
          story should end quietly; ordering is already one nav click
          away. showHowItWorksLink is false because About has no
          #how-it-works anchor (mirrors the Home page's own override). */}
      <Footer showTopCta={false} showHowItWorksLink={false} />
    </>
  );
}
