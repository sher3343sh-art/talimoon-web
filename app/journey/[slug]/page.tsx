import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { EntryDetail } from '@/components/journey/EntryDetail';
import { WorldLanding } from '@/components/journey/WorldLanding';
import {
  getEntryBySlug,
  publishedJourneySlugs,
  resolveEntryContent,
} from '@/lib/journey/content';
import {
  WORLD_BY_SLUG,
  WORLD_SLUG,
  WORLD_NAME_KEYS,
} from '@/lib/journey/types';

/**
 * `/journey/<x>` is either one of the three editorial world
 * landings (`/journey/talimoon`, `/journey/parents`,
 * `/journey/wisdom`) or an entry detail page. The world slugs win;
 * everything else falls through to `getEntryBySlug`.
 */
export function generateStaticParams() {
  const worldSlugs = Object.values(WORLD_SLUG).map((slug) => ({ slug }));
  const entrySlugs = publishedJourneySlugs().map((slug) => ({ slug }));
  return [...worldSlugs, ...entrySlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const world = WORLD_BY_SLUG[slug];
  if (world) {
    return {
      title: `${WORLD_NAME_KEYS[world].en} — TALIMOON`,
      description: WORLD_NAME_KEYS[world].blurbEn,
    };
  }

  const entry = getEntryBySlug(slug);
  if (!entry) return { title: 'Hayot — TALIMOON' };

  const { content } = resolveEntryContent(entry, entry.defaultLocale);
  const title = content.title ? `${content.title} — TALIMOON` : 'Hayot — TALIMOON';

  // Consent-scoped for entries with people, editorial otherwise. Not
  // indexable ⇒ still followable, never hard-blocked.
  const publiclyIndexable =
    entry.status === 'published' &&
    entry.indexable &&
    entry.media.consent !== 'none';

  return {
    title,
    description: content.standfirst,
    robots: publiclyIndexable ? undefined : { index: false, follow: true },
  };
}

export default async function JourneyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const world = WORLD_BY_SLUG[slug];
  if (world) {
    return (
      <>
        <Navbar />
        <main>
          <WorldLanding world={world} />
        </main>
        <Footer showTopCta={false} />
      </>
    );
  }

  const entry = getEntryBySlug(slug);

  // Draft and scheduled entries must not be reachable; published and
  // archived (history) are.
  if (!entry || entry.status === 'draft' || entry.status === 'scheduled') {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <EntryDetail entry={entry} />
      </main>
      <Footer showTopCta={false} />
    </>
  );
}
