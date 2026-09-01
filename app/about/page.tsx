import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutOrigin } from '@/components/about/AboutOrigin';
import { AboutChildPerspective } from '@/components/about/AboutChildPerspective';
import { AboutCreativeBelief } from '@/components/about/AboutCreativeBelief';
import { AboutParentChild } from '@/components/about/AboutParentChild';
import { AboutUniverse } from '@/components/about/AboutUniverse';
import { AboutPeople } from '@/components/about/AboutPeople';
import { AboutHowWeCreate } from '@/components/about/AboutHowWeCreate';
import { AboutFuture } from '@/components/about/AboutFuture';
import { AboutQuietEnding } from '@/components/about/AboutQuietEnding';
import { AboutChapterNav } from '@/components/about/AboutChapterNav';

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
 * proof → belief → the family → what it became → the people → the
 * process → ambition → quiet confidence):
 *
 *   Hero        — curiosity, restrained
 *   Origin      — WHY TALIMOON exists (three moments: distance, the
 *                 first story, the response) + the TALIMOON name
 *   Child persp.— HOW TALIMOON looks at childhood (not a repeat of Origin)
 *   Creative belief — the PRINCIPLES behind what gets made
 *   Parent+child— the family the brand is actually for
 *   Universe    — WHAT the belief is becoming: one philosophy, five
 *                 worlds (the child-facing four + HAYOT for parents)
 *   People      — who is building it, in their own weight
 *   How we create — the PROCESS that makes it (not the same as belief)
 *   Future      — direction, not hype
 *   Quiet ending— confidence, then the Footer (no commercial pre-footer
 *                 CTA — the nav already gives access to ordering)
 *
 * The four chapter wrappers (#ch-*) group the sections into the four
 * chapters AboutChapterNav orients by — kept in the DOM order the rail
 * scrolls through. Quiet Ending sits outside the navigation. Each
 * section owns a different visual rhythm; the global design system is
 * reused, never redesigned.
 */
const CHAPTER = 'scroll-mt-[124px] xl:scroll-mt-[96px]';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />

        <div id="ch-how-it-began" className={CHAPTER}>
          <AboutOrigin />
        </div>

        <div id="ch-what-we-believe" className={CHAPTER}>
          <AboutChildPerspective />
          <AboutCreativeBelief />
          <AboutParentChild />
        </div>

        <div id="ch-what-we-create" className={CHAPTER}>
          <AboutUniverse />
        </div>

        <div id="ch-people" className={CHAPTER}>
          <AboutPeople />
          <AboutHowWeCreate />
        </div>

        <AboutFuture />
        <AboutQuietEnding />

        <AboutChapterNav />
      </main>
      {/* No commercial pre-footer CTA on About — the emotional brand
          story should end quietly; ordering is already one nav click
          away. showHowItWorksLink is false because About has no
          #how-it-works anchor (mirrors the Home page's own override). */}
      <Footer showTopCta={false} showHowItWorksLink={false} />
    </>
  );
}
