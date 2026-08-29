import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutOrigin } from '@/components/about/AboutOrigin';
import { AboutChildPerspective } from '@/components/about/AboutChildPerspective';
import { AboutCreativeBelief } from '@/components/about/AboutCreativeBelief';
import { AboutUniverse } from '@/components/about/AboutUniverse';
import { AboutParentChild } from '@/components/about/AboutParentChild';
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
 * corporate About page. Story arc: child → why → the child's view →
 * our creative belief → one TALIMOON universe → parent + child → how
 * we actually create → the future → a quiet ending. Each section owns
 * a different visual rhythm; the global design system (nav, footer,
 * type, colour, spacing) is reused, never redesigned.
 */
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <AboutOrigin />
        <AboutChildPerspective />
        <AboutCreativeBelief />
        <AboutUniverse />
        <AboutParentChild />
        <AboutHowWeCreate />
        <AboutFuture />
        <AboutQuietEnding />
      </main>
      <Footer />
    </>
  );
}
