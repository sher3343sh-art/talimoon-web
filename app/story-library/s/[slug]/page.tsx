import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { StoryAntechamber } from '@/components/story-library/StoryAntechamber';
import {
  allStorySlugs,
  getEdition,
  getStoryBySlug,
} from '@/lib/story-library/content';

export function generateStaticParams() {
  return allStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: 'Story — TALIMOON' };

  const ed = getEdition(story, story.defaultLocale);
  const published = story.publicationState === 'published';
  const label =
    story.kind === 'series-episode' && story.episodeOrder
      ? `${String(story.episodeOrder).padStart(2, '0')}-QISM · Yusuf & Yasmina`
      : story.dedication;
  const title = published && ed?.title ? ed.title : label || 'Story';

  return {
    title: `${title} — TALIMOON Story Library`,
    description: published ? ed?.description : undefined,
    // Consent-scoped for family stories; editorial for series. A
    // not-yet-published story is never indexed.
    robots: published && story.indexable ? undefined : { index: false, follow: true },
  };
}

/**
 * A single story's page — the calm antechamber before the Reader.
 * Community (views / loved / comments) is added below in a later
 * increment. The Reader route (/story-library/read/[slug]) is next.
 */
export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  // Withdrawn or draft stories must not be reachable.
  if (
    !story ||
    story.publicationState === 'draft' ||
    story.publicationState === 'withdrawn'
  ) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <StoryAntechamber story={story} />
      </main>
      <Footer />
    </>
  );
}
