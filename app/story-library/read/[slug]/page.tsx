import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Reader } from '@/components/story-library/reader/Reader';
import {
  getEdition,
  getStoryBySlug,
  readableStorySlugs,
} from '@/lib/story-library/content';
import { canRead } from '@/lib/story-library/access';

export function generateStaticParams() {
  return readableStorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  const ed = story ? getEdition(story, story.defaultLocale) : undefined;
  return {
    title: ed?.title ? `${ed.title} — TALIMOON` : 'Reading — TALIMOON',
    robots: { index: false, follow: false },
  };
}

/**
 * The immersive Story Reader. Access is decided here by `canRead()`
 * and nowhere else; everything published is readable in V1, and a
 * future premium tier slots into that one function.
 */
export default async function ReaderRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story || !canRead(story).allowed) notFound();

  return <Reader slug={slug} />;
}
