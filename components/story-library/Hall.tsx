/**
 * The Hall — Story Library landing.
 * ----------------------------------------------------------------
 * One curated entry, then the two worlds introduced editorially:
 *
 *   header  →  featured (editorial panel until a story is curated)
 *           →  World I: Family Stories (warm mantel cluster)
 *           →  World II: Yusuf & Yasmina (the numbered spine)
 *           →  "Most loved this month" (hidden until real engagement)
 *
 * Every band a different shape. Built to read as intentional
 * curation at 5 books and to scale to hundreds unchanged. Flows
 * straight into the site Footer — no CTA banner.
 */

import { getHallData } from '@/lib/story-library/content';
import { Band } from './shared';
import { LibraryHeader } from './LibraryHeader';
import { FeaturedIntro } from './FeaturedIntro';
import { FamilyStoriesWorld } from './FamilyStoriesWorld';
import { YusufYasminaSpine } from './YusufYasminaSpine';
import { MostLovedStrip } from './MostLovedStrip';

export function Hall() {
  const data = getHallData();

  return (
    <>
      <Band labelledBy="story-library-heading" className="pt-28 pb-14 md:pt-36 md:pb-16">
        <LibraryHeader />
        <div className="mt-12 md:mt-16">
          <FeaturedIntro featured={data.featured} />
        </div>
      </Band>

      <Band tone="raised" className="py-20 md:py-28">
        <FamilyStoriesWorld stories={data.family} />
      </Band>

      <Band className="py-20 md:py-28 lg:py-32">
        {data.series ? (
          <YusufYasminaSpine
            series={data.series.series}
            episodes={data.series.episodes}
          />
        ) : null}
      </Band>

      <MostLovedStrip stories={data.mostLoved} />
    </>
  );
}

export default Hall;
