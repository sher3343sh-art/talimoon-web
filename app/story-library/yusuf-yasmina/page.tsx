import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SeriesHub } from '@/components/story-library/SeriesHub';
import { getSeries, getSeriesEpisodes } from '@/lib/story-library/content';

export const metadata: Metadata = {
  title: 'Yusuf & Yasmina — TALIMOON Story Library',
  description:
    'One continuing story, told part by part — Yusuf & Yasmina discovering kindness, friendship and courage.',
};

export default function YusufYasminaPage() {
  const series = getSeries('yusuf-yasmina');
  if (!series) notFound();
  const episodes = getSeriesEpisodes(series.id);

  return (
    <>
      <Navbar />
      <main>
        <SeriesHub series={series} episodes={episodes} />
      </main>
      <Footer />
    </>
  );
}
