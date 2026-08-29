import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { EntryDetail } from '@/components/journey/EntryDetail';
import {
  getEntryBySlug,
  publishedJourneySlugs,
  resolveEntryContent,
} from '@/lib/journey/content';

/**
 * Stable detail pages for published + archived entries. Draft and
 * scheduled entries have no route. The V1 seed is empty, so this
 * yields no params today — the route stands ready for the first
 * published entry.
 */
export function generateStaticParams() {
  return publishedJourneySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

/**
 * A single HAYOT entry — the flexible editorial block canvas
 * (`EntryDetail`), ending with "HAYOT DAVOM ETADI" + related entries.
 */
export default async function JourneyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
      <Footer />
    </>
  );
}
