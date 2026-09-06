'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useT } from '@/lib/i18n/LanguageContext';
import { BODY, DISPLAY } from './shared';

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  position: string;
};

const EN: HeroSlide[] = [
  {
    id: 'personalized-books',
    eyebrow: 'Story Library',
    title: 'Every book opens a world of its own.',
    description: 'Personalized stories, created for one child and gathered with care in one timeless library.',
    image: '/images/story-library/hero/personalized-library-v1.png',
    alt: 'A premium collection of personalized books beside an open illustrated story',
    position: '100% center',
  },
  {
    id: 'yusuf-yasmina',
    eyebrow: 'Yusuf & Yasmina',
    title: 'The adventure continues, page by page.',
    description: 'A continuing world where two young heroes discover kindness, friendship and courage.',
    image: '/images/story-library/hero/yusuf-yasmina-world-v1.png',
    alt: 'Two elegant storybooks opening onto a magical adventure landscape',
    position: '100% center',
  },
  {
    id: 'audio-library',
    eyebrow: 'Audio stories',
    title: 'Read it. Hear it. Feel it together.',
    description: 'Books and audio experiences meet in one warm, growing world of stories.',
    image: '/images/story-library/hero/audio-library-v1.png',
    alt: 'An open book, headphones and digital audiobook library in a warm reading room',
    position: '100% center',
  },
];

const UZ: HeroSlide[] = [
  {
    id: 'personalized-books',
    eyebrow: 'Hikoyalar kutubxonasi',
    title: 'Har bir kitob — o‘ziga xos bir olam.',
    description: 'Bir bola uchun yaratilgan shaxsiy hikoyalar mehr bilan yagona kutubxonada jamlanadi.',
    image: '/images/story-library/hero/personalized-library-v1.png',
    alt: 'Ochiq suratli kitob yonidagi premium shaxsiylashtirilgan kitoblar to‘plami',
    position: '100% center',
  },
  {
    id: 'yusuf-yasmina',
    eyebrow: 'Yusuf va Yasmina',
    title: 'Sarguzasht sahifadan sahifaga davom etadi.',
    description: 'Mehr, do‘stlik va jasoratni kashf etayotgan ikki qahramonning davomli hikoya olami.',
    image: '/images/story-library/hero/yusuf-yasmina-world-v1.png',
    alt: 'Sehrli sarguzasht manzarasiga ochilayotgan ikki nafis hikoya kitobi',
    position: '100% center',
  },
  {
    id: 'audio-library',
    eyebrow: 'Audio hikoyalar',
    title: 'O‘qing. Tinglang. Birga his qiling.',
    description: 'Kitob va audio taassurotlar hikoyalarga boyib borayotgan bir olamda uchrashadi.',
    image: '/images/story-library/hero/audio-library-v1.png',
    alt: 'Iliq kutubxonadagi ochiq kitob, quloqchin va raqamli audio hikoyalar',
    position: '100% center',
  },
];

const RU: HeroSlide[] = [
  {
    id: 'personalized-books',
    eyebrow: 'Библиотека историй',
    title: 'Каждая книга открывает свой собственный мир.',
    description: 'Именные истории, созданные для одного ребёнка и бережно собранные в одной вечной библиотеке.',
    image: '/images/story-library/hero/personalized-library-v1.png',
    alt: 'Коллекция премиальных именных книг рядом с открытой иллюстрированной историей',
    position: '100% center',
  },
  {
    id: 'yusuf-yasmina',
    eyebrow: 'Юсуф и Ясмина',
    title: 'Приключение продолжается, страница за страницей.',
    description: 'Мир, который продолжает расти: здесь двое юных героев открывают доброту, дружбу и смелость.',
    image: '/images/story-library/hero/yusuf-yasmina-world-v1.png',
    alt: 'Две изящные книги-истории, открывающиеся в волшебный мир приключений',
    position: '100% center',
  },
  {
    id: 'audio-library',
    eyebrow: 'Аудиоистории',
    title: 'Читайте. Слушайте. Проживайте вместе.',
    description: 'Книги и аудиоформат встречаются в одном тёплом и постоянно растущем мире историй.',
    image: '/images/story-library/hero/audio-library-v1.png',
    alt: 'Открытая книга, наушники и цифровая аудиобиблиотека в уютной комнате для чтения',
    position: '100% center',
  },
];

const UI_EN = {
  label: 'Story Library highlights',
  pause: 'Pause highlights',
  play: 'Play highlights',
};

const UI_UZ: typeof UI_EN = {
  label: 'Hikoyalar kutubxonasi yangiliklari',
  pause: 'Almashishni to‘xtatish',
  play: 'Almashishni davom ettirish',
};

const UI_RU: typeof UI_EN = {
  label: 'Главные истории библиотеки',
  pause: 'Приостановить смену слайдов',
  play: 'Возобновить смену слайдов',
};

export function StoryLibraryHero() {
  const slides = useT(EN, UZ, RU);
  const ui = useT(UI_EN, UI_UZ, UI_RU);
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const paused = manuallyPaused || interacting;
  const slide = slides[active];

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      8000,
    );
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ui.label}
      className="relative overflow-hidden bg-[#F7F3EC] pt-[64px] lg:pt-[80px]"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      <div className="mx-auto grid min-h-[480px] max-w-[1680px] lg:grid-cols-[44%_56%]">
        <div className="relative z-20 order-2 flex min-h-[300px] flex-col justify-center overflow-hidden bg-[linear-gradient(118deg,#101B2A_0%,#142236_55%,#17263A_100%)] px-6 pb-14 pt-8 sm:min-h-[315px] sm:px-10 sm:pb-16 lg:order-1 lg:min-h-[480px] lg:justify-start lg:px-14 lg:pb-16 lg:pt-[62px] xl:px-24 xl:pt-[68px]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(184,147,91,0.16),transparent_44%)]" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${slide.id}-copy`}
              className="relative max-w-[570px]"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.23em] text-[#D2AF68] sm:text-[12px]"
                style={{ fontFamily: BODY }}
              >
                {slide.eyebrow}
                <span aria-hidden="true" className="h-px w-12 bg-[#B8935B]/65" />
              </p>
              <h1
                id="story-library-heading"
                className="mt-4 max-w-[620px] text-balance text-[34px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#F7F1E7] sm:text-[42px] lg:text-[46px] xl:text-[50px]"
                style={{ fontFamily: DISPLAY }}
              >
                {slide.title}
              </h1>
              <p
                className="mt-5 max-w-[48ch] text-[14px] leading-[1.7] text-[#F7F1E7]/68 sm:text-[15px]"
                style={{ fontFamily: BODY }}
              >
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative mt-7 flex items-center gap-3" role="tablist" aria-label={ui.label}>
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-label={`${index + 1}. ${item.eyebrow}`}
                onClick={() => setActive(index)}
                className="group flex h-8 items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D2AF68]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#17263A]"
              >
                <span
                  className={`block h-px transition-all duration-500 ${active === index ? 'w-12 bg-[#D2AF68]' : 'w-6 bg-white/22 group-hover:bg-white/50'}`}
                />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setManuallyPaused((value) => !value)}
              aria-label={manuallyPaused ? ui.play : ui.pause}
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-white/58 shadow-[0_4px_14px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-all hover:border-[#D2AF68]/70 hover:bg-white/10 hover:text-[#D2AF68] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D2AF68]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#17263A]"
            >
              {manuallyPaused ? <Play aria-hidden="true" size={13} strokeWidth={1.6} className="ml-0.5" /> : <Pause aria-hidden="true" size={13} strokeWidth={1.6} />}
            </button>
          </div>
        </div>

        <div className="relative order-1 min-h-[255px] overflow-hidden sm:min-h-[330px] lg:order-2 lg:-ml-24 lg:min-h-[480px] lg:w-[calc(100%+6rem)]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 57vw, 100vw"
                className="object-cover"
                style={{ objectPosition: slide.position }}
              />
            </motion.div>
          </AnimatePresence>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(23,38,58,0.72)_100%)] lg:bg-[linear-gradient(90deg,#17263A_0%,#17263A_12%,rgba(23,38,58,0.78)_19%,rgba(23,38,58,0.28)_31%,transparent_47%)]" />
          <span
            className="absolute bottom-7 right-8 z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60"
            style={{ fontFamily: BODY }}
          >
            0{active + 1} / 0{slides.length}
          </span>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[40px] sm:h-[52px] lg:h-[68px]">
        <svg viewBox="0 0 1600 150" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0 44C150 118 310 81 465 109C625 139 720 157 887 132C1048 105 1134 54 1289 66C1422 76 1515 79 1600 39V150H0Z"
            fill="#FDFBF7"
          />
          <path
            d="M0 44C150 118 310 81 465 109C625 139 720 157 887 132C1048 105 1134 54 1289 66C1422 76 1515 79 1600 39"
            fill="none"
            stroke="#B8935B"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}

export default StoryLibraryHero;
