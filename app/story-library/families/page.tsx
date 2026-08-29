import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FamilyCollection } from '@/components/story-library/FamilyCollection';
import { getFamilyStories } from '@/lib/story-library/content';

export const metadata: Metadata = {
  title: 'Family Stories — TALIMOON Story Library',
  description:
    'Real personalized TALIMOON books that families have chosen to share — with each family’s permission.',
};

export default function FamilyStoriesPage() {
  const stories = getFamilyStories();
  return (
    <>
      <Navbar />
      <main>
        <FamilyCollection stories={stories} />
      </main>
      <Footer />
    </>
  );
}
