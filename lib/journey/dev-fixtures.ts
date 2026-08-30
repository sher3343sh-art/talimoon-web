/**
 * TALIMOON HAYOT (Journey V2) — DEVELOPMENT FIXTURES.
 * ================================================================
 * These entries are NEVER part of the public dataset and NEVER
 * render in production. `content.ts` pulls them in via a
 * `require()` gated on `process.env.NODE_ENV === 'development'`,
 * which is dead-code-eliminated from a production build.
 *
 * They exercise every editorial WORLD, FORMAT, WEIGHT, block type
 * and the sources/references system so the Journey engine can be
 * regression-checked without real content. Every string is
 * obviously placeholder ("FIXTURE"); media points at
 * `/journey/fixtures/*` (on-brand grey placeholders, no people);
 * references are illustrative and clearly fake ("FIXTURE Press").
 * Nothing here is a claim about a real child, family, visit, event,
 * partnership, achievement, statistic, expert or study.
 *
 * Real content goes into `PRODUCTION_ENTRIES` in `content.ts`.
 */

import type { JourneyEntry, PulseSeed } from './types';

const F = '/journey/fixtures';

const img = (id: string, file: string, w: number, h: number, credit?: string) => ({
  id,
  src: `${F}/${file}`,
  width: w,
  height: h,
  ...(credit ? { credit } : {}),
});

// ── 01 · TALIMOON HAYOTI ───────────────────────────────────────────

// PHOTO STORY (reportage) — the featured opening + full block canvas
const FIX_REPORTAGE: JourneyEntry = {
  id: 'fix_reportage',
  slug: 'fixture-photo-story',
  world: 'talimoon-life',
  format: 'reportage',
  weight: 'lead',
  status: 'published',
  featured: true,
  publishedAtISO: '2026-08-28T09:00:00.000Z',
  updatedAtISO: '2026-08-28T09:00:00.000Z',
  tags: ['fixture', 'tashrif'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  cover: img('fix_rep_cover', 'cover-landscape.svg', 1600, 1000, 'Foto: FIXTURE'),
  relatedSlugs: ['fixture-video-story', 'fixture-guide'],
  translations: {
    uz: {
      kicker: { label: 'TASHRIF', dateLabel: '28 AVGUST' },
      title: 'FIXTURE — fotoreportaj sarlavhasi shu yerda turadi',
      standfirst:
        'FIXTURE standfirst: qisqa, ikki gaplik muharrirlik kirishi. Bu matn haqiqiy emas — faqat tartibni sinash uchun.',
      coverAlt: 'Placeholder — dev fixture cover image.',
      credit: 'Foto: FIXTURE / dev',
      author: 'TALIMOON tahririyati',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: birinchi abzas hikoyaga olib kiradi. Uzunligi haqiqiy reportajga yaqin bo‘lishi uchun bir necha jumla.' },
        { t: 'image', asset: img('fix_rep_p1', 'wide.svg', 1600, 900, 'Foto: FIXTURE'), alt: 'Placeholder inline image.', caption: 'FIXTURE sarlavha: rasm ostidagi izoh.', full: true },
        { t: 'paragraph', text: 'FIXTURE paragraf: ikkinchi abzas. Bu yerda hikoya davom etadi va keyingi rasmga o‘tishga tayyorlaydi.' },
        { t: 'heading', level: 2, text: 'FIXTURE ichki sarlavha' },
        { t: 'paragraph', text: 'FIXTURE paragraf: ichki sarlavhadan keyingi matn.' },
        { t: 'imagePair', a: img('fix_rep_pa', 'pair-a.svg', 1200, 1500), b: img('fix_rep_pb', 'pair-b.svg', 1200, 1500), altA: 'Placeholder A.', altB: 'Placeholder B.', caption: 'FIXTURE: juft rasm izohi.' },
        { t: 'quote', text: 'FIXTURE iqtibos: qahramonning gapi shu yerda keltiriladi.', attribution: 'FIXTURE ism', role: 'murabbiy' },
        { t: 'paragraph', text: 'FIXTURE paragraf: iqtibosdan keyingi matn.' },
        { t: 'gallery', items: [
          { asset: img('fix_g1', 'gallery-1.svg', 1200, 900), alt: 'Placeholder gallery 1.' },
          { asset: img('fix_g2', 'gallery-2.svg', 1200, 900), alt: 'Placeholder gallery 2.' },
          { asset: img('fix_g3', 'gallery-3.svg', 1200, 900), alt: 'Placeholder gallery 3.' },
        ] },
        { t: 'note', text: 'FIXTURE eslatma: kichik, ikkilamchi kontekst matni.' },
        { t: 'cta', label: 'FIXTURE havola', href: '/story-library' },
      ],
    },
    en: {
      kicker: { label: 'A VISIT', dateLabel: 'AUGUST 28' },
      title: 'FIXTURE — the photo-reportage headline sits here',
      standfirst:
        'FIXTURE standfirst: a short, two-sentence editorial intro. This text is not real — it only tests the layout.',
      coverAlt: 'Placeholder — dev fixture cover image.',
      credit: 'Photo: FIXTURE / dev',
      author: 'TALIMOON editorial',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: the first paragraph draws the reader in. A few sentences so the length is close to a real reportage.' },
        { t: 'image', asset: img('fix_rep_p1', 'wide.svg', 1600, 900), alt: 'Placeholder inline image.', caption: 'FIXTURE caption: a line under the image.', full: true },
        { t: 'paragraph', text: 'FIXTURE paragraph: the second paragraph. The story continues and sets up the next image.' },
        { t: 'heading', level: 2, text: 'FIXTURE section heading' },
        { t: 'paragraph', text: 'FIXTURE paragraph: text after the section heading.' },
        { t: 'imagePair', a: img('fix_rep_pa', 'pair-a.svg', 1200, 1500), b: img('fix_rep_pb', 'pair-b.svg', 1200, 1500), altA: 'Placeholder A.', altB: 'Placeholder B.', caption: 'FIXTURE: image-pair caption.' },
        { t: 'quote', text: 'FIXTURE quote: a line spoken by someone in the story.', attribution: 'FIXTURE name', role: 'educator' },
        { t: 'paragraph', text: 'FIXTURE paragraph: text after the quote.' },
        { t: 'gallery', items: [
          { asset: img('fix_g1', 'gallery-1.svg', 1200, 900), alt: 'Placeholder gallery 1.' },
          { asset: img('fix_g2', 'gallery-2.svg', 1200, 900), alt: 'Placeholder gallery 2.' },
          { asset: img('fix_g3', 'gallery-3.svg', 1200, 900), alt: 'Placeholder gallery 3.' },
        ] },
        { t: 'note', text: 'FIXTURE note: small, secondary context.' },
        { t: 'cta', label: 'FIXTURE link', href: '/story-library' },
      ],
    },
  },
};

// VIDEO STORY
const FIX_VIDEO: JourneyEntry = {
  id: 'fix_video',
  slug: 'fixture-video-story',
  world: 'talimoon-life',
  format: 'video',
  weight: 'feature',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-24T09:00:00.000Z',
  tags: ['fixture', 'video'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  cover: img('fix_vid_cover', 'video-poster.svg', 1600, 900),
  video: {
    poster: img('fix_vid_poster', 'video-poster.svg', 1600, 900),
    provider: 'file',
    src: `${F}/placeholder.mp4`,
    durationSec: 154,
    transcript:
      'FIXTURE transcript: the full text alternative for the video would appear here, so the story is readable without sound or motion.',
    credit: 'Video: FIXTURE / dev',
  },
  relatedSlugs: ['fixture-photo-story'],
  translations: {
    uz: {
      kicker: { label: 'VIDEO', dateLabel: '24 AVGUST' },
      title: 'FIXTURE — video hikoya sarlavhasi',
      standfirst: 'FIXTURE standfirst: video nima haqida ekanini ikki jumlada aytadi.',
      coverAlt: 'Placeholder video poster.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: videodan oldingi yoki keyingi qo‘shimcha matn.' },
        { t: 'quote', text: 'FIXTURE iqtibos: videodagi gap.', attribution: 'FIXTURE ism' },
        { t: 'image', asset: img('fix_vid_still', 'wide.svg', 1600, 900), alt: 'Placeholder still.', caption: 'FIXTURE: a still from the film.' },
      ],
    },
    en: {
      kicker: { label: 'VIDEO', dateLabel: 'AUGUST 24' },
      title: 'FIXTURE — the video story headline',
      standfirst: 'FIXTURE standfirst: two sentences on what the film is about.',
      coverAlt: 'Placeholder video poster.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: supporting text before or after the film.' },
        { t: 'quote', text: 'FIXTURE quote: a line from the film.', attribution: 'FIXTURE name' },
        { t: 'image', asset: img('fix_vid_still', 'wide.svg', 1600, 900), alt: 'Placeholder still.', caption: 'FIXTURE: a still from the film.' },
      ],
    },
  },
};

// NEWS — compact reported item
const FIX_NEWS: JourneyEntry = {
  id: 'fix_news',
  slug: 'fixture-news',
  world: 'talimoon-life',
  format: 'news',
  weight: 'quiet',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-15T09:00:00.000Z',
  tags: ['fixture', 'yangilik'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: 'YANGILIK', dateLabel: '15 AVGUST' },
      title: 'FIXTURE — qisqa yangilik bir qatorda',
      standfirst: 'FIXTURE: ixtiyoriy bir qatorlik izoh.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: yangilik matni.' }],
    },
    en: {
      kicker: { label: 'NEWS', dateLabel: 'AUGUST 15' },
      title: 'FIXTURE — a short news item on one line',
      standfirst: 'FIXTURE: an optional one-line note.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: news text.' }],
    },
  },
};

// MOMENT
const FIX_MOMENT: JourneyEntry = {
  id: 'fix_moment',
  slug: 'fixture-moment',
  world: 'talimoon-life',
  format: 'moment',
  weight: 'quiet',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-18T09:00:00.000Z',
  tags: ['fixture', 'lahza'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  cover: img('fix_moment_img', 'wide.svg', 1600, 900),
  translations: {
    uz: {
      kicker: { label: 'BUGUNDAN BIR LAHZA' },
      standfirst: 'FIXTURE: bir foto va yigirmaga yaqin so‘z. Kichik, samimiy lahza.',
      coverAlt: 'Placeholder moment image.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: lahza uchun to‘liq matn shart emas.' }],
    },
    en: {
      kicker: { label: 'A MOMENT FROM TODAY' },
      standfirst: 'FIXTURE: one photo and about twenty words. A small, honest moment.',
      coverAlt: 'Placeholder moment image.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: a moment needs no full body text.' }],
    },
  },
};

// CAMPAIGN (state derived)
const FIX_CAMPAIGN: JourneyEntry = {
  id: 'fix_campaign',
  slug: 'fixture-campaign',
  world: 'talimoon-life',
  format: 'campaign',
  weight: 'standard',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-10T09:00:00.000Z',
  tags: ['fixture', 'tanlov'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  campaign: {
    startISO: '2026-08-01T00:00:00.000Z',
    endISO: '2026-09-15T00:00:00.000Z',
    participateHref: '/story-library',
  },
  translations: {
    uz: {
      kicker: { label: 'TANLOV', dateLabel: '01–15 SENTABR' },
      title: 'FIXTURE — tanlov sarlavhasi',
      standfirst: 'FIXTURE: tanlov nima haqidaligi bir jumlada.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: tanlov shartlari matni.' }],
    },
    en: {
      kicker: { label: 'COMPETITION', dateLabel: 'SEP 1–15' },
      title: 'FIXTURE — the competition headline',
      standfirst: 'FIXTURE: one sentence on what the competition is about.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: competition details text.' }],
    },
  },
};

// ── 02 · OTA-ONALAR UCHUN ──────────────────────────────────────────

// GUIDE — the PARENT FEATURE. question → key idea → explanation →
// takeaway → source.
const FIX_GUIDE: JourneyEntry = {
  id: 'fix_guide',
  slug: 'fixture-guide',
  world: 'parents',
  format: 'guide',
  weight: 'feature',
  status: 'published',
  featured: false,
  parentFeature: true,
  publishedAtISO: '2026-08-22T09:00:00.000Z',
  tags: ['fixture', 'tarbiya', 'hissiyot'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  cover: img('fix_guide_cover', 'cover-landscape.svg', 1600, 1000),
  references: [
    {
      kind: 'book',
      author: 'FIXTURE, A.',
      title: 'FIXTURE: the book title',
      edition: '1st ed.',
      pages: 'pp. 40–42',
      publisher: 'FIXTURE Press',
      year: 2019,
      note: 'FIXTURE: one line on what this source contributes.',
    },
    {
      kind: 'expert',
      author: 'FIXTURE, B.',
      role: 'child psychologist (FIXTURE)',
      note: 'FIXTURE: paraphrased idea, attributed.',
    },
  ],
  translations: {
    uz: {
      kicker: { label: 'HISSIYOT' },
      title: 'FIXTURE — bola jahli chiqqanda nima yordam beradi?',
      standfirst:
        'FIXTURE standfirst: muammo va uning nega muhimligi bir-ikki jumlada.',
      keyIdea:
        'FIXTURE asosiy g‘oya: bitta qisqa, amaliy jumla — maqolaning yuragi.',
      author: 'TALIMOON tahririyati',
      coverAlt: 'Placeholder.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: qisqa kirish — bu holat ko‘p oilalarga tanish.' },
        { t: 'heading', level: 3, text: 'FIXTURE: asosiy g‘oya' },
        { t: 'paragraph', text: 'FIXTURE paragraf: g‘oyaning qisqa, ishonchli tushuntirishi.' },
        { t: 'heading', level: 3, text: 'FIXTURE: amalda' },
        { t: 'paragraph', text: 'FIXTURE paragraf: bitta amaliy qadam.' },
        { t: 'note', text: 'FIXTURE amaliy xulosa: bitta jumlalik takeaway.' },
      ],
    },
    en: {
      kicker: { label: 'EMOTIONS' },
      title: 'FIXTURE — what actually helps when a child is angry?',
      standfirst:
        'FIXTURE standfirst: the problem and why it matters, in one or two sentences.',
      keyIdea:
        'FIXTURE key idea: one short, practical sentence — the heart of the piece.',
      author: 'TALIMOON editorial',
      coverAlt: 'Placeholder.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: a short opening — this situation is familiar to many families.' },
        { t: 'heading', level: 3, text: 'FIXTURE: the key idea' },
        { t: 'paragraph', text: 'FIXTURE paragraph: a short, trustworthy explanation of the idea.' },
        { t: 'heading', level: 3, text: 'FIXTURE: in practice' },
        { t: 'paragraph', text: 'FIXTURE paragraph: one practical step.' },
        { t: 'note', text: 'FIXTURE takeaway: a one-sentence practical takeaway.' },
      ],
    },
  },
};

// BOOK-INSIGHT
const FIX_BOOK: JourneyEntry = {
  id: 'fix_book',
  slug: 'fixture-book-insight',
  world: 'parents',
  format: 'book-insight',
  weight: 'standard',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-12T09:00:00.000Z',
  tags: ['fixture', 'kitob', 'oqish'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  references: [
    {
      kind: 'book',
      author: 'FIXTURE, C.',
      title: 'FIXTURE: another book title',
      pages: 'ch. 3',
      publisher: 'FIXTURE Books',
      year: 2021,
    },
  ],
  translations: {
    uz: {
      kicker: { label: 'KITOBDAN' },
      title: 'FIXTURE — bir kitobdan olingan bitta foydali g‘oya',
      standfirst: 'FIXTURE: TALIMOON sintezi, qisqa iqtibos bilan.',
      keyIdea: 'FIXTURE: kitobning asosiy g‘oyasi bir jumlada.',
      author: 'TALIMOON tahririyati',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: g‘oyaning TALIMOON tilida qisqa bayoni.' },
        { t: 'quote', text: 'FIXTURE: qisqa, atributsiyalangan iqtibos.', attribution: 'FIXTURE, C.', role: 'FIXTURE kitobi' },
        { t: 'paragraph', text: 'FIXTURE paragraf: bu g‘oyani kundalik hayotda qanday qo‘llash mumkin.' },
      ],
    },
    en: {
      kicker: { label: 'FROM A BOOK' },
      title: 'FIXTURE — one useful idea taken from a book',
      standfirst: 'FIXTURE: a TALIMOON synthesis, with a short attributed quotation.',
      keyIdea: 'FIXTURE: the book’s core idea, in one sentence.',
      author: 'TALIMOON editorial',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: the idea, restated in TALIMOON’s own words.' },
        { t: 'quote', text: 'FIXTURE: a short, attributed quotation.', attribution: 'FIXTURE, C.', role: 'FIXTURE (book)' },
        { t: 'paragraph', text: 'FIXTURE paragraph: how to apply this idea in everyday life.' },
      ],
    },
  },
};

// ── 03 · HIKMAT ORTIDAGI ILM ───────────────────────────────────────

// RESEARCH-EXPLAINER — EVIDENCE FIRST, conclusion second. The public
// article begins from the question/evidence, not from a conclusion.
const FIX_RESEARCH: JourneyEntry = {
  id: 'fix_research',
  slug: 'fixture-research-explainer',
  world: 'wisdom-science',
  format: 'research-explainer',
  weight: 'standard',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-19T09:00:00.000Z',
  tags: ['fixture', 'odat', 'salomatlik'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  references: [
    {
      kind: 'research',
      title: 'FIXTURE: study title (not a real study)',
      publisher: 'FIXTURE Journal',
      year: 2018,
      url: 'https://example.org/fixture',
    },
    {
      kind: 'organization',
      title: 'FIXTURE Health Organisation',
      url: 'https://example.org/fixture-org',
      note: 'FIXTURE: general guidance, paraphrased.',
    },
  ],
  translations: {
    uz: {
      kicker: { label: 'SALOMATLIK' },
      title: 'FIXTURE — qo‘lni puxta yuvish nega ahamiyatli?',
      standfirst:
        'FIXTURE standfirst: savol va dalil nima ekanini qisqa aytadi. Xulosa keyin keladi.',
      keyIdea: 'FIXTURE: dalildan kelib chiqadigan bitta xulosa.',
      author: 'TALIMOON tahririyati',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: avval savol va mavjud dalil bayon qilinadi.' },
        { t: 'heading', level: 3, text: 'FIXTURE: dalil nima deydi' },
        { t: 'paragraph', text: 'FIXTURE paragraf: tadqiqot/manba nimani ko‘rsatadi — ortiqcha da’vosiz.' },
        { t: 'heading', level: 3, text: 'FIXTURE: kundalik xulosa' },
        { t: 'paragraph', text: 'FIXTURE paragraf: shundan kelib chiqadigan oddiy amaliy odat.' },
        { t: 'note', text: 'FIXTURE: manbalar quyida. Dalil o‘zi ko‘rsatmagan narsani da’vo qilmaymiz.' },
      ],
    },
    en: {
      kicker: { label: 'HEALTH' },
      title: 'FIXTURE — why does thorough hand-washing matter?',
      standfirst:
        'FIXTURE standfirst: states the question and the evidence first. The conclusion comes after.',
      keyIdea: 'FIXTURE: a single conclusion that follows from the evidence.',
      author: 'TALIMOON editorial',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: the question and the available evidence are laid out first.' },
        { t: 'heading', level: 3, text: 'FIXTURE: what the evidence says' },
        { t: 'paragraph', text: 'FIXTURE paragraph: what the study / source shows — without over-claiming.' },
        { t: 'heading', level: 3, text: 'FIXTURE: the everyday conclusion' },
        { t: 'paragraph', text: 'FIXTURE paragraph: the simple habit that follows from it.' },
        { t: 'note', text: 'FIXTURE: sources below. We do not claim anything the evidence itself does not support.' },
      ],
    },
  },
};

export const DEV_FIXTURE_ENTRIES: readonly JourneyEntry[] = [
  FIX_REPORTAGE,
  FIX_VIDEO,
  FIX_NEWS,
  FIX_MOMENT,
  FIX_CAMPAIGN,
  FIX_GUIDE,
  FIX_BOOK,
  FIX_RESEARCH,
];

// Dev pulse items (TALIMOON HAYOTI). Dev only, never shipped.
export const DEV_FIXTURE_PULSE: readonly PulseSeed[] = [
  { id: 'fixp1', dateISO: '2026-08-30T00:00:00.000Z', strand: 'story', label: { uz: 'Yangi hikoya', en: 'New story' }, title: { uz: 'FIXTURE — bugungi voqea', en: 'FIXTURE — today' } },
  { id: 'fixp2', dateISO: '2026-09-03T00:00:00.000Z', strand: 'episode', label: { uz: 'Yangi qism', en: 'New part' }, title: { uz: 'FIXTURE — keyingi qism', en: 'FIXTURE — next part' } },
  { id: 'fixp3', dateISO: '2026-09-08T00:00:00.000Z', strand: 'visit', label: { uz: 'Tashrif', en: 'A visit' }, title: { uz: 'FIXTURE — rejalashtirilgan tashrif', en: 'FIXTURE — a planned visit' } },
];
