/**
 * TALIMOON HAYOT — DEVELOPMENT FIXTURES.
 * ================================================================
 * These entries are NEVER part of the public dataset and NEVER
 * render in production. `content.ts` merges them in only when
 * `process.env.NODE_ENV === 'development'`.
 *
 * Their sole purpose is to exercise every editorial format, weight
 * and block type so the HAYOT system can be regression-checked
 * without waiting for real photos, video and text. Every string is
 * obviously placeholder ("FIXTURE"), the media points at
 * `/journey/fixtures/*` (on-brand grey placeholders, no people),
 * and nothing here is a claim about a real child, family, visit,
 * event, partnership, achievement or statistic.
 *
 * When real content is supplied it goes into `PRODUCTION_ENTRIES`
 * in `content.ts`; this file can then shrink or stay as a test bed.
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

// ── 1 · PHOTO STORY (reportage) — the featured opening + full canvas ──
const FIX_REPORTAGE: JourneyEntry = {
  id: 'fix_reportage',
  slug: 'fixture-photo-story',
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
  relatedSlugs: ['fixture-video-story', 'fixture-thought'],
  translations: {
    uz: {
      kicker: { label: 'TASHRIF', dateLabel: '28 AVGUST' },
      title: 'FIXTURE — fotoreportaj sarlavhasi shu yerda turadi',
      standfirst:
        'FIXTURE standfirst: qisqa, ikki gaplik muharrirlik kirishi. Bu matn haqiqiy emas — faqat tartibni sinash uchun.',
      coverAlt: 'Placeholder — dev fixture cover image.',
      credit: 'Foto: FIXTURE / dev',
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

// ── 2 · VIDEO STORY ─────────────────────────────────────────────────
const FIX_VIDEO: JourneyEntry = {
  id: 'fix_video',
  slug: 'fixture-video-story',
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
      standfirst:
        'FIXTURE standfirst: video nima haqida ekanini ikki jumlada aytadi.',
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

// ── 3 · THOUGHT (bir fikr) ──────────────────────────────────────────
const FIX_THOUGHT: JourneyEntry = {
  id: 'fix_thought',
  slug: 'fixture-thought',
  format: 'thought',
  weight: 'standard',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-20T09:00:00.000Z',
  tags: ['fixture', 'bir-fikr'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: 'BIR FIKR' },
      title: 'FIXTURE — bir fikr sarlavhasi savol shaklida',
      standfirst: 'FIXTURE: fikrning yumshoq, qo‘llab-quvvatlovchi ikkinchi qatori.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraf: bir fikr matni — rasm talab qilmaydi, tipografiya yetakchi.' },
        { t: 'paragraph', text: 'FIXTURE paragraf: ikkinchi abzas.' },
      ],
    },
    en: {
      kicker: { label: 'A THOUGHT' },
      title: 'FIXTURE — a thought headline, phrased as a question',
      standfirst: 'FIXTURE: the thought’s soft, supporting second line.',
      blocks: [
        { t: 'paragraph', text: 'FIXTURE paragraph: a thought is type-led and needs no image.' },
        { t: 'paragraph', text: 'FIXTURE paragraph: a second paragraph.' },
      ],
    },
  },
};

// ── 4 · MOMENT ─────────────────────────────────────────────────────
const FIX_MOMENT: JourneyEntry = {
  id: 'fix_moment',
  slug: 'fixture-moment',
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

// ── 5 · UPDATE ─────────────────────────────────────────────────────
const FIX_UPDATE: JourneyEntry = {
  id: 'fix_update',
  slug: 'fixture-update',
  format: 'update',
  weight: 'quiet',
  status: 'published',
  featured: false,
  publishedAtISO: '2026-08-15T09:00:00.000Z',
  tags: ['fixture', 'elon'],
  defaultLocale: 'uz',
  indexable: true,
  media: { consent: 'not-applicable' },
  translations: {
    uz: {
      kicker: { label: "E'LON", dateLabel: '15 AVGUST' },
      title: 'FIXTURE — qisqa e‘lon bir qatorda',
      standfirst: 'FIXTURE: ixtiyoriy bir qatorlik izoh.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: e‘lon matni.' }],
    },
    en: {
      kicker: { label: 'UPDATE', dateLabel: 'AUGUST 15' },
      title: 'FIXTURE — a short update on one line',
      standfirst: 'FIXTURE: an optional one-line note.',
      blocks: [{ t: 'paragraph', text: 'FIXTURE: update text.' }],
    },
  },
};

// ── 6 · CAMPAIGN (state derived) ───────────────────────────────────
const FIX_CAMPAIGN: JourneyEntry = {
  id: 'fix_campaign',
  slug: 'fixture-campaign',
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

export const DEV_FIXTURE_ENTRIES: readonly JourneyEntry[] = [
  FIX_REPORTAGE,
  FIX_VIDEO,
  FIX_THOUGHT,
  FIX_MOMENT,
  FIX_UPDATE,
  FIX_CAMPAIGN,
];

// Dev pulse items — dates are relative-ish to a late-Aug 2026 "now";
// dev only, never shipped.
export const DEV_FIXTURE_PULSE: readonly PulseSeed[] = [
  { id: 'fixp1', dateISO: '2026-08-30T00:00:00.000Z', strand: 'story', label: { uz: 'Yangi hikoya', en: 'New story' }, title: { uz: 'FIXTURE — bugungi voqea', en: 'FIXTURE — today' } },
  { id: 'fixp2', dateISO: '2026-09-03T00:00:00.000Z', strand: 'episode', label: { uz: 'Yangi qism', en: 'New part' }, title: { uz: 'FIXTURE — keyingi qism', en: 'FIXTURE — next part' } },
  { id: 'fixp3', dateISO: '2026-09-08T00:00:00.000Z', strand: 'visit', label: { uz: 'Tashrif', en: 'A visit' }, title: { uz: 'FIXTURE — rejalashtirilgan tashrif', en: 'FIXTURE — a planned visit' } },
];
