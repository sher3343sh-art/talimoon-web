import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Hall } from '@/components/story-library/Hall';

export const metadata: Metadata = {
  title: 'Story Library — TALIMOON',
  description:
    'Real TALIMOON family stories, shared with permission, alongside the continuing world of Yusuf & Yasmina.',
};

/**
 * TALIMOON Story Library.
 * V1 increment 1: the Hall (landing). The Reader, the Story page and
 * the community layer arrive in later increments. Navbar + Footer are
 * the site's own; the immersive Reader route renders neither.
 */
export default function StoryLibraryPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hall />
      </main>
      <Footer />
    </>
  );
}
