/**
 * TALIMOON HAYOT (Journey) — content source.
 * ----------------------------------------------------------------
 * `PRODUCTION_ENTRIES` / `PRODUCTION_PULSE` are the real public
 * dataset. They are intentionally EMPTY until real photos, video
 * and text are supplied — HAYOT shows elegant, intentional empty
 * states, never invented volume, never a fabricated event, story,
 * date, family, statistic, partnership or achievement.
 *
 * Adding the first real entry is a single object appended to
 * `PRODUCTION_ENTRIES` — see `dev-fixtures.ts` for the exact shape
 * of every format (photo reportage, video, thought, moment, update,
 * campaign) and every block type. No component changes.
 *
 * Development fixtures (`dev-fixtures.ts`) are opt-in and merged only
 * when `NEXT_PUBLIC_JOURNEY_FIXTURES=1` in development. Real content is
 * therefore the default locally as well as in production.
 *
 * These accessors are pure functions over local data with no
 * server-only imports, so they are safe to call from Server and
 * Client Components alike.
 */

import {
  directionFor,
  type Direction,
  type EntryContent,
  type JourneyEntry,
  type JourneyWorld,
  type Locale,
  type PulseItem,
  type PulseSeed,
} from './types';

// ── Dataset ────────────────────────────────────────────────────────
/**
 * The real public dataset. EMPTY until real content is supplied.
 * Append a `JourneyEntry` here to publish it — the page composes
 * itself. `featured: true` pins one entry to THE OPENING.
 */
const PRODUCTION_ENTRIES: readonly JourneyEntry[] = [
  {
    id: 'talimoon-diary-01',
    slug: 'talimoon-goyalari-qayerdan-tugiladi',
    world: 'talimoon-life',
    format: 'reportage',
    weight: 'lead',
    status: 'published',
    featured: true,
    publishedAtISO: '2026-09-05T09:00:00.000Z',
    tags: ['talimoon-kundaligi', 'doha', 'qatar-national-library', 'ilk-kunlar'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    relatedSlugs: ['hali-kichkina-keyin-organadi'],
    translations: {
      uz: {
        kicker: { label: 'TALIMOON KUNDALIGI · 01', dateLabel: '5 SENTABR, 2026' },
        title: 'TALIMOON g‘oyalari qayerdan tug‘iladi?',
        standfirst:
          'TALIMOON’ning ilk kunlari. Bir tomonda minglab kitoblar, ikkinchi tomonda esa hali qurilayotgan yangi platforma. Bu safar ish stolimiz Qatar National Library’da.',
        author: 'Qatar National Library · Doha, Qatar',
        blocks: [
          {
            t: 'videoPlaceholder',
            label: 'TALIMOON MINI-FILMI',
            title: 'G‘oyalar tug‘iladigan joy',
            note: '60–70 soniyalik hujjatli video shu yerda joylanadi.',
          },
          { t: 'paragraph', text: 'Bugun TALIMOON ustidagi ish Qatar National Library’da davom etmoqda.' },
          { t: 'paragraph', text: 'Atrofda minglab kitoblar. Turli tillar, turli hikoyalar, turli avlodlar uchun yaratilgan bilimlar. Stol ustida esa ikki kompyuter va ularda asta-sekin o‘z shaklini topayotgan TALIMOON.' },
          { t: 'paragraph', text: 'Bu TALIMOON’ning hali ilk kunlari.' },
          { t: 'paragraph', text: 'Hozir biz ko‘rayotgan har bir sahifa, sinab ko‘rayotgan har bir yechim va qayta ko‘rib chiqayotgan har bir detal kelajakda bolaning qo‘liga yetib boradigan tajribaning bir qismiga aylanishi mumkin.' },
          { t: 'heading', level: 2, text: 'Ilhom — shunchaki yangi g‘oya emas' },
          { t: 'paragraph', text: 'Biz kitoblarni ko‘ramiz. Hikoyalar qanday taqdim etilganini kuzatamiz. Bolalar uchun yaratilgan muhitlarni o‘rganamiz. Yaxshi tajriba ortidagi kichik detallarni izlaymiz.' },
          { t: 'paragraph', text: 'Va doim bir savolga qaytamiz:' },
          { t: 'quote', text: 'Farzand uchun bundan ham mazmunliroq tajribani qanday yarata olamiz?' },
          { t: 'paragraph', text: 'TALIMOON’da biz kitobni shunchaki o‘qiladigan mahsulot sifatida tasavvur qilmaymiz. Hikoya bolaning o‘zini unda ko‘rishiga, yangi narsani kashf etishiga, savol berishiga va o‘rganganini uzoq vaqt eslab qolishiga sabab bo‘lishini istaymiz.' },
          { t: 'heading', level: 2, text: 'G‘oyalar bir joyda tug‘ilmaydi' },
          { t: 'paragraph', text: 'Shu sabab TALIMOON bir joyda yaratilmaydi.' },
          { t: 'paragraph', text: 'Ba’zan g‘oya kitob sahifasidan keladi. Ba’zan bir bolaning qiziqishidan. Ba’zan suhbatdan, kuzatuvdan yoki javobini hali topmagan savoldan.' },
          { t: 'paragraph', text: 'Bugun esa bu izlanish Doha shahrida, Qatar National Library’dagi minglab kitoblar orasida davom etmoqda.' },
          { t: 'quote', text: 'Bir tomonda o‘tmishdan bizgacha yetib kelgan bilimlar. Ikkinchi tomonda esa hali yozilmagan hikoyalar. O‘rtada TALIMOON.' },
          { t: 'paragraph', text: 'Hali oldinda qilinadigan ishlar ko‘p. Yuzlab hikoyalar, yangi kitoblar, yangi tajribalar va bugun biz hali tasavvur qilayotgan bolalar olami bor.' },
          { t: 'paragraph', text: 'Lekin katta yo‘llarning ham birinchi sahifasi bo‘ladi.' },
          { t: 'paragraph', text: 'Bu — biznikining ilk sahifalaridan biri.' },
          { t: 'note', text: 'Qatar National Library · Doha, Qatar · 5-sentabr, 2026 · TALIMOON kundaligi · 01' },
        ],
      },
    },
  },
  {
    id: 'parents-early-learning-01',
    slug: 'hali-kichkina-keyin-organadi',
    world: 'parents',
    format: 'book-insight',
    weight: 'feature',
    status: 'published',
    featured: false,
    parentFeature: true,
    publishedAtISO: '2026-09-05T08:30:00.000Z',
    tags: ['ota-onalar-uchun', 'erta-talim', 'kitobdan-xulosa', 'masaru-ibuka'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    cover: {
      id: 'parents-early-learning-cover-v2',
      src: '/images/journey/parents-early-learning-cover-v2.png',
      width: 1536,
      height: 1024,
      credit: 'TALIMOON vizualizatsiyasi',
    },
    references: [
      {
        kind: 'book',
        author: 'Masaru Ibuka',
        title: 'Uchdan keyin kech',
        pages: '7, 17–18-betlar',
      },
    ],
    relatedSlugs: [
      'qobiliyati-otasiga-tortgan-rostdan-ham-shundaymi',
      'talimoon-goyalari-qayerdan-tugiladi',
    ],
    translations: {
      uz: {
        kicker: { label: 'KITOBDAN XULOSA', dateLabel: 'OTA-ONALAR UCHUN' },
        title: '“Hali kichkina, keyin o‘rganadi...” Rostdan ham shundaymi?',
        standfirst:
          'Bola o‘rganishni bog‘cha yoki maktabdan boshlamaydi. Uning qiziqishini “hali erta” deb keyinga qoldirmaslik nega muhim?',
        coverAlt:
          'Ona ikki yoshli farzandi bilan rasmlarga boy kitobni birga tomosha qilmoqda.',
        author: 'TALIMOON tahririyati',
        keyIdea:
          'Maqsad bolani boshqalardan oldinga chiqarish emas — o‘rganishga tayyor paytida uning qiziqishini qo‘llab-quvvatlash.',
        blocks: [
          { t: 'paragraph', text: 'Farzandingiz hali ikki yoshda. Balki siz ham: “Hali kichkina, kattaroq bo‘lsa o‘rgatamiz”, deb o‘ylarsiz.' },
          { t: 'paragraph', text: 'Ammo bola o‘rganishni bog‘cha yoki maktabdan boshlamaydi. U hozirdanoq sizning gaplaringizni eshitadi, atrofini kuzatadi, ko‘rganlarini eslab qoladi va har kuni yangi narsalarni o‘zlashtiradi.' },
          { t: 'paragraph', text: 'Masaru Ibuka buni juda muhim davr deb hisoblaydi:' },
          { t: 'quote', text: 'Asosiysi, hamma tajriba va ta’lim usullarini “o‘z vaqtida” joriy etishdir.', attribution: 'Masaru Ibuka', role: '“Uchdan keyin kech”' },
          { t: 'paragraph', text: 'Bu bolani ikki yoshida o‘qishga, yozishga yoki hisoblashga majburlash kerak degani emas.' },
          { t: 'heading', level: 2, text: 'Imkoniyat yarating, bosim emas' },
          { t: 'paragraph', text: 'Aksincha, unga o‘rganish uchun imkoniyat yaratish kerak.' },
          { t: 'paragraph', text: 'U bilan kattalardek suhbatlashing. Birga kitob varaqlang. Rasmlardagi narsalarni nomlang. Savol bersa, imkon qadar javobsiz qoldirmang. Biror hayvon, mashina, rang yoki tabiat hodisasiga qiziqsa, shu qiziqishini yangi so‘z, kitob yoki tajriba bilan davom ettiring.' },
          { t: 'paragraph', text: 'Ibukaning yana bir muhim fikri bor:' },
          { t: 'quote', text: 'Erta ta’lim buyuk daholarni tarbiyalab yetishtirishni maqsad qilmaydi.', attribution: 'Masaru Ibuka', role: '“Uchdan keyin kech”' },
          { t: 'paragraph', text: 'Demak, maqsad farzandingizni boshqalardan oldinga chiqarish emas.' },
          { t: 'heading', level: 2, text: 'Qiziqishni keyinga qoldirmang' },
          { t: 'paragraph', text: 'Maqsad — u o‘rganishga tayyor bo‘lgan paytda “hali erta” deb uning qiziqishini keyinga qoldirmaslik.' },
        ],
      },
    },
  },
  {
    id: 'parents-ability-environment-02',
    slug: 'qobiliyati-otasiga-tortgan-rostdan-ham-shundaymi',
    world: 'parents',
    format: 'book-insight',
    weight: 'feature',
    status: 'published',
    featured: false,
    publishedAtISO: '2026-09-05T08:00:00.000Z',
    tags: ['ota-onalar-uchun', 'qobiliyat', 'muhit', 'kitobdan-xulosa', 'masaru-ibuka'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    cover: {
      id: 'parents-ability-environment-cover-v1',
      src: '/images/journey/parents-ability-environment-cover-v1.png',
      width: 1536,
      height: 1024,
      credit: 'TALIMOON vizualizatsiyasi',
    },
    references: [
      {
        kind: 'book',
        author: 'Masaru Ibuka',
        title: 'Uchdan keyin kech',
        note: 'Bolaning qobiliyati, ta’lim va tashqi muhitning ta’siri haqidagi qismlar.',
      },
    ],
    relatedSlugs: [
      'mening-bolamning-bunga-qobiliyati-yoq',
      'hali-kichkina-keyin-organadi',
      'talimoon-goyalari-qayerdan-tugiladi',
    ],
    translations: {
      uz: {
        kicker: { label: 'KITOBDAN XULOSA', dateLabel: 'OTA-ONALAR UCHUN' },
        title: '“Qobiliyati otasiga tortgan...” Rostdan ham shundaymi?',
        standfirst:
          'Bolaning qobiliyati faqat nasl bilan belgilanadimi? Balki bugun ko‘rinmayotgan iste’dod o‘zini namoyon qilish uchun imkoniyat kutayotgandir.',
        coverAlt:
          'Ota qizining yog‘och shakllardan mustaqil yangi tuzilma yasashini kuzatmoqda.',
        author: 'TALIMOON tahririyati',
        keyIdea:
          'Bolaning qobiliyatini faqat izlamang — uning rivojlanishi uchun muhit ham yarating.',
        blocks: [
          { t: 'paragraph', text: '“Otasi matematikaga kuchli edi, bolasi ham shunga tortibdi.”' },
          { t: 'paragraph', text: '“Onasi tillarni tez o‘rganadi, qiziga ham o‘tgan.”' },
          { t: 'paragraph', text: 'Bunday gaplarni ko‘p eshitamiz. Bola biror narsani yaxshi bajarsa, buni ko‘pincha tug‘ma qobiliyat bilan tushuntiramiz.' },
          { t: 'paragraph', text: 'Ammo Masaru Ibuka bunga boshqa tomondan qaraydi.' },
          { t: 'paragraph', text: 'Uning fikricha, bolaning qanday qobiliyatlari rivojlanishida nasldan tashqari uning qanday muhitda ulg‘ayayotgani va dastlabki yillarda qanday tajribalar olayotgani ham katta rol o‘ynaydi.' },
          { t: 'quote', text: 'Ta’lim va tashqi muhit bola qobiliyatini rivojlantiruvchi asosiy omillardir.', attribution: 'Masaru Ibuka', role: '“Uchdan keyin kech”' },
          { t: 'heading', level: 2, text: 'Xulosa chiqarishga shoshilmang' },
          { t: 'paragraph', text: 'Bu fikr ota-ona uchun juda muhim.' },
          { t: 'paragraph', text: 'Chunki “Unda bu qobiliyat tug‘ma yo‘q” deb o‘ylasak, bolaga o‘sha qobiliyatini kashf qilish imkoniyatini bermasdan turib xulosa chiqarib qo‘yishimiz mumkin.' },
          { t: 'paragraph', text: 'Shuning uchun farzandingizni faqat bugun nimaga qodir ekaniga qarab baholamang.' },
          { t: 'heading', level: 2, text: 'Qobiliyatga imkoniyat kerak' },
          { t: 'paragraph', text: 'Turli kitoblarni ko‘rsating. Yangi narsalarni sinab ko‘rishiga imkon bering. Savollariga javob bering. Nimaga ko‘proq qiziqayotganini kuzating. Biror ishni sekin o‘rgansa, darrov undan voz kechmang.' },
          { t: 'quote', text: 'Bolaning qobiliyatini faqat izlamang — uning rivojlanishi uchun muhit ham yarating.' },
          { t: 'paragraph', text: 'Chunki bugun hali ko‘rinmayotgan qobiliyat, balki o‘zini namoyon qilish uchun imkoniyat kutayotgandir.' },
        ],
      },
    },
  },
  {
    id: 'parents-method-matters-03',
    slug: 'mening-bolamning-bunga-qobiliyati-yoq',
    world: 'parents',
    format: 'book-insight',
    weight: 'feature',
    status: 'published',
    featured: false,
    publishedAtISO: '2026-09-05T07:30:00.000Z',
    tags: ['ota-onalar-uchun', 'qobiliyat', 'orgatish-usuli', 'kitobdan-xulosa', 'masaru-ibuka'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    cover: {
      id: 'parents-method-matters-cover-v3',
      src: '/images/journey/parents-method-matters-cover-v3.png',
      width: 1536,
      height: 1024,
      credit: 'TALIMOON vizualizatsiyasi',
    },
    references: [
      {
        kind: 'book',
        author: 'Masaru Ibuka',
        title: 'Uchdan keyin kech',
        note: 'Shinichi Suzuki tajribasi va o‘qitish usulining ahamiyati haqidagi qism.',
      },
    ],
    relatedSlugs: [
      'qobiliyati-otasiga-tortgan-rostdan-ham-shundaymi',
      'hali-kichkina-keyin-organadi',
    ],
    translations: {
      uz: {
        kicker: { label: 'KITOBDAN XULOSA', dateLabel: 'OTA-ONALAR UCHUN' },
        title: '“Bunga qobiliyati yo‘q...” Balki mos yo‘l hali topilmagandir?',
        standfirst:
          'Bola bugun uddalay olmayotgan narsa uning imkoniyati chegarasi emas. Ba’zan undan ko‘proq harakatni emas, bizdan boshqa usulni talab qiladi.',
        coverAlt:
          'Ona o‘g‘liga rangli shakllardan tuzilgan vazifani kichik bosqichlarda bajarishga yordam bermoqda.',
        author: 'TALIMOON tahririyati',
        keyIdea:
          'Ba’zan bolaga yetishmayotgan narsa qobiliyat emas — shunchaki unga mos yo‘l hali topilmagan bo‘lishi mumkin.',
        blocks: [
          { t: 'paragraph', text: 'Farzandingiz biror narsani boshqalarga qaraganda sekinroq o‘rgansa, xayolingizdan: “Shekilli, bunga qobiliyati yo‘q...” degan fikr o‘tishi mumkin.' },
          { t: 'paragraph', text: 'Lekin bola bugun uddalay olmayotgan narsa uning imkoniyati chegarasi degani emas.' },
          { t: 'paragraph', text: 'Masaru Ibuka kitobida Shinichi Suzukining bolalarni o‘qitish tajribasini keltirib, juda keskin bir fikrni beradi:' },
          { t: 'quote', text: 'Qoloq bolalar yo‘q. Barchasi o‘qitish usuliga bog‘liq.', attribution: 'Masaru Ibuka', role: '“Uchdan keyin kech”' },
          { t: 'heading', level: 2, text: 'Bola emas, usul o‘zgarishi mumkin' },
          { t: 'paragraph', text: 'Demak, bola tushunmayotganida faqat undan ko‘proq harakat qilishni talab qilish emas, biz ham usulimizni o‘zgartirib ko‘rishimiz kerak.' },
          { t: 'paragraph', text: 'Bir tushuntirish ishlamadimi — boshqacha tushuntiring. Qiyin bo‘ldimi — kichik qismlarga ajrating. Ko‘rsatib bering, keyin birga bajaring. Xato qildimi — yana urinishi uchun vaqt bering.' },
          { t: 'heading', level: 2, text: 'Hukm bolaning ichki ovoziga aylanmasin' },
          { t: 'paragraph', text: 'Eng muhimi, bolaning oldida “Sen buni eplay olmaysan” yoki “Senda bunga qobiliyat yo‘q” degan hukmni aytishga shoshilmang.' },
          { t: 'paragraph', text: 'Chunki bola sizning u haqidagi fikringizni asta-sekin o‘zi haqidagi fikrga aylantirishi mumkin.' },
          { t: 'paragraph', text: 'Shuning uchun “Nega eplay olmayapti?” degan savol o‘rniga, avval boshqacha savol bering:' },
          { t: 'quote', text: 'Buni unga yana qanday yo‘l bilan tushuntirib ko‘rsam bo‘ladi?' },
          { t: 'paragraph', text: 'Ba’zan bolaga yetishmayotgan narsa qobiliyat emas.' },
          { t: 'paragraph', text: 'Shunchaki unga mos yo‘l hali topilmagan bo‘lishi mumkin.' },
        ],
      },
    },
  },
  {
    id: 'habits-handwashing-01',
    slug: 'qolimni-yuvdim-rostdan-ham-yuvdimi',
    world: 'wisdom-science',
    format: 'research-explainer',
    weight: 'feature',
    status: 'published',
    featured: false,
    publishedAtISO: '2026-09-05T19:00:00.000Z',
    tags: ['odatlar-va-ilm', 'salomatlik', 'qol-yuvish', 'bolalar', 'tadqiqot'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    cover: {
      id: 'habits-handwashing-cover-v2',
      src: '/images/journey/habits-handwashing-cover-v2.png',
      width: 1672,
      height: 941,
      credit: 'TALIMOON vizualizatsiyasi',
    },
    references: [
      {
        kind: 'organization',
        title: 'CDC — Handwashing Facts',
        url: 'https://www.cdc.gov/clean-hands/data-research/facts-stats/',
        note: 'Qo‘lning barcha yuzalarini sovunlab, kamida 20 soniya ishqalash bo‘yicha tavsiyalar.',
      },
      {
        kind: 'research',
        author: 'Nuhu Amin va hammualliflar',
        title: 'Microbiological Evaluation of the Efficacy of Soapy Water to Clean Hands: A Randomized, Non-Inferiority Field Trial',
        publisher: 'American Journal of Tropical Medicine and Hygiene',
        year: 2014,
        doi: '10.4269/ajtmh.13-0475',
      },
    ],
    relatedSlugs: [
      'hali-kichkina-keyin-organadi',
      'qobiliyati-otasiga-tortgan-rostdan-ham-shundaymi',
    ],
    translations: {
      uz: {
        kicker: { label: 'KUNDALIK ODAT · ILMIY IZOH', dateLabel: 'SALOMATLIK' },
        title: '“Qo‘limni yuvdim!” — Rostdan ham yuvdimi?',
        standfirst:
          'Qo‘lning ho‘l bo‘lishi uning toza bo‘lganini anglatmaydi. Bir oddiy savol bolaning kundalik odatini butunlay o‘zgartirishi mumkin.',
        coverAlt:
          'Besh yoshli bola onasi yonida qo‘llarini sovunlab, barmoqlari orasini yaxshilab yuvmoqda.',
        author: 'TALIMOON tahririyati',
        keyIdea:
          '“Qo‘lingni yuvdingmi?” deb so‘rashdan ham muhimroq savol bor: “Qo‘lingni qanday yuvding?”',
        blocks: [
          { t: 'paragraph', text: 'Bola tashqaridan keldi. Siz: “Qo‘lingni yuvdingmi?” deb so‘radingiz. “Ha!” degan javob tez keldi.' },
          { t: 'paragraph', text: 'Lekin ba’zan bu “yuvish” atigi bir necha soniya davom etadi: qo‘l suvga tutiladi, ikki kaft bir-biriga ishqalanadi — tamom.' },
          { t: 'quote', text: 'Muammo shundaki, qo‘lning ho‘l bo‘lishi uning toza bo‘lganini anglatmaydi.' },
          { t: 'heading', level: 2, text: 'Ko‘zga ko‘rinmaydigan joylar' },
          { t: 'paragraph', text: 'CDC ma’lumotlariga ko‘ra, mikroblar qo‘lning barcha yuzalarida bo‘lishi mumkin. Shuning uchun faqat kaft bilan cheklanmay, qo‘l usti, barmoqlar oralari va tirnoq atroflarini ham yaxshilab sovunlab ishqalash kerak.' },
          { t: 'fact', value: '3× / 20s', label: 'Har bir harakatni 3 marta takrorlang yoki butun jarayonni kamida 20 soniya davom ettiring.', note: 'Muhimi faqat vaqt emas — kaft, qo‘l usti, barmoqlar oralari va tirnoq atrofini qoldirmaslik.' },
          { t: 'heading', level: 2, text: 'Dhakadagi tajriba nimani ko‘rsatdi?' },
          { t: 'paragraph', text: 'Bangladeshning Dhaka shahrida onalar ishtirokida o‘tkazilgan randomizatsiyalangan dala tadqiqotida olimlar qo‘llardagi bakteriyalarni yuvishdan oldin va keyin tekshirdi.' },
          { t: 'paragraph', text: 'Hatto 15 soniya suv bilan ishqalashning o‘zi ham ayrim bakteriyalar miqdorini kamaytirdi. Ammo sovunli suv va oddiy sovun samaraliroq bo‘ldi. Bu bitta muhim farqni ko‘rsatadi: suv qo‘lni ho‘llaydi, sovun va ishqalanish esa kir hamda mikroblarni teridan ajratishga yordam beradi.' },
          { t: 'heading', level: 2, text: 'Bolaga “yuv” demang — jarayonni o‘rgating' },
          { t: 'paragraph', text: 'Bolaga uzoq ko‘rsatma berish shart emas. Har safar bir xil ketma-ketlikni qo‘llang: har bir harakatni 3 marta takrorlang yoki butun yuvish jarayonini kamida 20 soniya davom ettiring.' },
          {
            t: 'steps',
            label: 'TALIMOONNING 3 BOSQICHLI QOIDASI',
            items: [
              { title: 'Kaftlar', text: 'Ikki kaftni bir-biriga 3 marta yaxshilab ishqalang.' },
              { title: 'Qo‘l usti', text: 'Har ikki qo‘lning ustini navbat bilan 3 martadan tozalang.' },
              { title: 'Oralar va tirnoqlar', text: 'Barmoqlarni chalishtirib, oralarini hamda tirnoq atrofini 3 marta ishqalang.' },
            ],
          },
          { t: 'paragraph', text: 'So‘ng qo‘llarni toza oqar suvda yaxshilab chaying va quriting. Ayniqsa hojatxonadan keyin, ovqatdan oldin va tashqaridan kelganda bu ketma-ketlikni birgalikda takrorlang.' },
          { t: 'quote', text: '“Qo‘lingni yuvdingmi?” emas — “Qo‘lingni qanday yuvding?”' },
          { t: 'note', text: 'Bu maqola umumiy ma’rifiy maqsadda tayyorlangan. Dalillar va tavsiyalarning to‘liq matni quyidagi manbalarda keltirilgan.' },
        ],
      },
    },
  },
  {
    id: 'habits-hot-food-wait-02',
    slug: 'issiq-ovqatni-puflab-sovutish-oddiy-odatmi',
    world: 'wisdom-science',
    format: 'research-explainer',
    weight: 'feature',
    status: 'published',
    featured: false,
    publishedAtISO: '2026-09-05T19:30:00.000Z',
    tags: ['odatlar-va-ilm', 'ovqatlanish', 'gigiyena', 'bolalar', 'tadqiqot'],
    defaultLocale: 'uz',
    indexable: true,
    media: { consent: 'not-applicable' },
    cover: {
      id: 'habits-hot-food-wait-cover-v1',
      src: '/images/journey/habits-hot-food-wait-cover-v1.png',
      width: 1672,
      height: 941,
      credit: 'TALIMOON vizualizatsiyasi',
    },
    references: [
      {
        kind: 'research',
        author: 'Fathimah Fathimah, Lia Mustika va Inma Yunita Setyorini',
        title: 'Blowing on the Hot Food Increasing Bacteria Contamination',
        publisher: 'Darussalam Nutrition Journal',
        year: 2021,
        url: 'https://ejournal.unida.gontor.ac.id/index.php/nutrition/article/view/6539/9659',
      },
      {
        kind: 'research',
        author: 'Paul Dawson va hammualliflar',
        title: 'Bacterial Transfer Associated with Blowing Out Candles on a Birthday Cake',
        publisher: 'Journal of Food Research',
        year: 2017,
        doi: '10.5539/jfr.v6n4p1',
      },
    ],
    relatedSlugs: [
      'qolimni-yuvdim-rostdan-ham-yuvdimi',
      'hali-kichkina-keyin-organadi',
    ],
    translations: {
      uz: {
        kicker: { label: 'KUNDALIK ODAT · ILMIY IZOH', dateLabel: 'OVQATLANISH' },
        title: 'Issiq ovqatni puflab sovutish — oddiy odatmi?',
        standfirst:
          'Puflaganimizda ovqatga faqat havo bormaydi. Bir necha daqiqa kutish nega yaxshiroq odat ekanini ikki kichik tajriba orqali ko‘ramiz.',
        coverAlt:
          'Ona issiq ovqat oldida kutish ishorasini ko‘rsatmoqda; yuqori burchakdagi kichik kadr choyni puflamaslikni anglatadi.',
        author: 'TALIMOON tahririyati',
        keyIdea:
          'Puflamaymiz. Biroz kutamiz — sovisin.',
        blocks: [
          { t: 'paragraph', text: 'Issiq choy yoki ovqatni puflab sovutamiz. Ba’zan esa ota-ona bolaning qoshig‘idagi ovqatni puflab, keyin unga beradi.' },
          { t: 'quote', text: 'Ammo puflaganimizda ovqatga faqat havo bormaydi.' },
          { t: 'heading', level: 2, text: 'Muammo nimada?' },
          { t: 'paragraph', text: 'Nafas chiqarayotgan havoda karbonat angidrid, suv bug‘i va og‘iz hamda nafas yo‘llaridan chiqadigan mayda biologik zarrachalar mavjud. Ular bilan birga mikroorganizmlar ham oziq-ovqat yuzasiga ko‘chishi mumkin.' },
          { t: 'heading', level: 2, text: 'Olimlar nimani aniqlagan?' },
          { t: 'paragraph', text: 'Indoneziyada, University of Darussalam Gontor tadqiqotchilari aynan issiq ovqatning puflangan va puflanmagan namunalarini laboratoriyada solishtirishdi.' },
          { t: 'paragraph', text: '12 soatdan keyin puflangan namunada 1.3 × 10³ CFU/ml, puflanmagan namunada esa 1.3 × 10² CFU/ml bakteriya koloniyasi aniqlangan — taxminan 10 baravar farq. Farq statistik jihatdan ham ahamiyatli bo‘lgan (p=0.001).' },
          { t: 'fact', value: '10×', label: 'Puflangan namunada bakteriya koloniyalari ko‘proq aniqlandi.', note: 'University of Darussalam Gontor laboratoriya tadqiqoti · p=0.001' },
          { t: 'paragraph', text: 'AQShdagi Clemson University tajribasida esa odamlar tortdagi shamlarni puflagach, oziq-ovqat yuzasidagi bakteriyalar nazorat namunasiga nisbatan o‘rtacha 1 400% ga ko‘paygan. Tadqiqot puflash orqali og‘izdagi bioaerozollar oziq-ovqatga ko‘chishi mumkinligini ko‘rsatgan.' },
          { t: 'heading', level: 2, text: 'Nega bolalarda ehtiyot bo‘lish muhim?' },
          { t: 'paragraph', text: 'Kichik bolalarning immun tizimi hali rivojlanib boradi. Agar kasallik qo‘zg‘atuvchi mikroorganizm ovqatga ko‘chsa, ayrim oziq-ovqat infeksiyalari qusish, ich ketishi, qorin og‘rig‘i, isitma va suvsizlanishga olib kelishi mumkin.' },
          { t: 'paragraph', text: 'Bu har bir puflangan ovqat kasallik keltirib chiqaradi degani emas. Ammo keraksiz mikrobiologik ifloslanish xavfini oshirishning hojati ham yo‘q.' },
          { t: 'heading', level: 2, text: 'Yechim juda oddiy' },
          { t: 'paragraph', text: 'Farzandingizga uch narsani odat qildiring:' },
          {
            t: 'steps',
            label: 'UCHTA SODDA ODAT',
            items: [
              { title: 'O‘zi puflamasin', text: 'Issiq bo‘lsa, shoshilmasdan sovishini kutsin.' },
              { title: 'Boshqalarga puflatmasin', text: 'O‘z ovqatini boshqa odamga ham puflatmasin.' },
              { title: 'Puflanganini yemaslik', text: 'Puflangan ovqatni yemaslikni o‘rgansin.' },
            ],
          },
          { t: 'quote', text: 'Puflamaymiz. Biroz kutamiz — sovisin.' },
          { t: 'paragraph', text: 'Bir necha daqiqa kutish qiyin emas. Sog‘lom odatlar esa aynan shunday kichik qarorlardan boshlanadi.' },
        ],
      },
    },
  },
];

/**
 * Real YAQIN KUNLAR pulse items not (yet) backed by a full entry.
 * EMPTY until there is something genuinely upcoming — never a
 * fabricated date.
 */
const PRODUCTION_PULSE: readonly PulseSeed[] = [];

/**
 * Fixtures are deliberately opt-in. This keeps placeholder cards out
 * of the real editorial pages during normal local review.
 */
const DEV = (() => {
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.NEXT_PUBLIC_JOURNEY_FIXTURES !== '1'
  ) {
    return { entries: [] as JourneyEntry[], pulse: [] as PulseSeed[] };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const f = require('./dev-fixtures') as typeof import('./dev-fixtures');
  return { entries: [...f.DEV_FIXTURE_ENTRIES], pulse: [...f.DEV_FIXTURE_PULSE] };
})();

const ENTRIES: readonly JourneyEntry[] = [
  ...PRODUCTION_ENTRIES,
  ...DEV.entries,
];

const PULSE: readonly PulseSeed[] = [...PRODUCTION_PULSE, ...DEV.pulse];

// ── Config ─────────────────────────────────────────────────────────
/**
 * A `featured` entry older than this many days is still returned, but
 * flagged `source: 'featured-stale'` so THE OPENING can reframe it
 * ("Yaqinda…") or the caller can fall back to the newest entry. A
 * stale "NOW" is worse than an honest "recently".
 */
export const FEATURED_MAX_AGE_DAYS = 35;

/** How many stream entries the page renders before "Ko'proq ko'rish". */
export const STREAM_PAGE_SIZE = 8;

/** Pulse items more than this many days in the past are dropped. */
const PULSE_PAST_GRACE_DAYS = 2;

// ── Small helpers ──────────────────────────────────────────────────
const DAY_MS = 86_400_000;

function ageInDays(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / DAY_MS;
}

function byNewest(a: JourneyEntry, b: JourneyEntry): number {
  return (
    new Date(b.publishedAtISO).getTime() - new Date(a.publishedAtISO).getTime()
  );
}

/** Live on the site: real to visitors now, or kept as history. */
function isPublic(entry: JourneyEntry): boolean {
  return entry.status === 'published' || entry.status === 'archived';
}

/** In the active reverse-chronological stream (history is not). */
function isInStream(entry: JourneyEntry): boolean {
  return entry.status === 'published';
}

// ── Content resolution (multilingual + RTL ready) ──────────────────
export interface ResolvedContent {
  content: EntryContent;
  /** The locale actually used (may differ from the one requested). */
  locale: Locale;
  /** True when the requested locale was missing and we fell back. */
  isFallback: boolean;
  direction: Direction;
}

/**
 * The entry's content for a locale, falling back to its
 * `defaultLocale`, then to any translation that exists, then to an
 * empty body. Never throws — a live page must render something.
 */
export function resolveEntryContent(
  entry: JourneyEntry,
  locale: Locale,
): ResolvedContent {
  const exact = entry.translations[locale];
  if (exact) {
    return { content: exact, locale, isFallback: false, direction: directionFor(locale) };
  }
  const fallbackLocale = entry.defaultLocale;
  const fallback =
    entry.translations[fallbackLocale] ??
    Object.values(entry.translations)[0];
  if (fallback) {
    return {
      content: fallback,
      locale: fallbackLocale,
      isFallback: true,
      direction: directionFor(fallbackLocale),
    };
  }
  return {
    content: { blocks: [] },
    locale: entry.defaultLocale,
    isFallback: true,
    direction: directionFor(entry.defaultLocale),
  };
}

// ── Accessors — THE CMS SEAM ───────────────────────────────────────

/** Every public entry (published + archived), newest first. */
export function getJourneyIndex(): JourneyEntry[] {
  return ENTRIES.filter(isPublic).slice().sort(byNewest);
}

export interface StreamPage {
  entries: JourneyEntry[];
  total: number;
  hasMore: boolean;
}

/**
 * A window into the active stream (published only, newest first).
 * By default it MIXES all three worlds and excludes the current
 * OPENING + PARENT FEATURE entries so nothing shows twice. Pass
 * `world` to scope it (used by the `/journey/<world>` landings) —
 * scoped views do NOT exclude the opening/feature.
 */
export function getStreamEntries(
  opts: {
    offset?: number;
    limit?: number;
    world?: JourneyWorld;
    excludePromoted?: boolean;
  } = {},
): StreamPage {
  const offset = Math.max(0, opts.offset ?? 0);
  const limit = Math.max(0, opts.limit ?? STREAM_PAGE_SIZE);

  let all = ENTRIES.filter(isInStream);

  if (opts.world) {
    all = all.filter((e) => e.world === opts.world);
  } else if (opts.excludePromoted !== false) {
    const excluded = new Set<string>();
    const f = getFeaturedEntry()?.entry.id;
    if (f) excluded.add(f);
    const p = getParentFeature()?.id;
    if (p) excluded.add(p);
    all = all.filter((e) => !excluded.has(e.id));
  }

  all = all.slice().sort(byNewest);

  return {
    entries: all.slice(offset, offset + limit),
    total: all.length,
    hasMore: offset + limit < all.length,
  };
}

/**
 * The one `parents` entry for the landing's PARENT FEATURE slot.
 * Editorial pin (`parentFeature: true`) wins, else the newest
 * `parents` entry. `null` when there is no parents content yet.
 */
export function getParentFeature(now: Date = new Date()): JourneyEntry | null {
  const parents = ENTRIES.filter(
    (e) => isInStream(e) && e.world === 'parents',
  ).sort(byNewest);
  if (parents.length === 0) return null;
  void now;
  return parents.find((e) => e.parentFeature) ?? parents[0];
}

/** Entries for one world (public: published + archived), newest first. */
export function getWorldEntries(world: JourneyWorld): JourneyEntry[] {
  return ENTRIES.filter((e) => isPublic(e) && e.world === world).sort(byNewest);
}

/** Per-world count of public entries — for the editorial gateways. */
export function getWorldCounts(): Record<JourneyWorld, number> {
  return {
    'talimoon-life': getWorldEntries('talimoon-life').length,
    parents: getWorldEntries('parents').length,
    'wisdom-science': getWorldEntries('wisdom-science').length,
  };
}

/**
 * Everything the landing's THREE WORLDS portal needs for one world,
 * in one call. `primary` is the newest public entry (fills the main
 * media + latest-headline slots); `secondary` is the next one (fills
 * the small overlapping media / fragment slot). Both are `null` until
 * real content exists — the portal then renders its prepared
 * empty-state frames, never invented volume.
 */
export interface WorldPreview {
  world: JourneyWorld;
  count: number;
  primary: JourneyEntry | null;
  secondary: JourneyEntry | null;
}

export function getWorldPreview(world: JourneyWorld): WorldPreview {
  const all = getWorldEntries(world);
  return {
    world,
    count: all.length,
    primary: all[0] ?? null,
    secondary: all[1] ?? null,
  };
}

export function getWorldPreviews(): Record<JourneyWorld, WorldPreview> {
  return {
    'talimoon-life': getWorldPreview('talimoon-life'),
    parents: getWorldPreview('parents'),
    'wisdom-science': getWorldPreview('wisdom-science'),
  };
}

export type FeaturedSource = 'featured' | 'featured-stale' | 'newest';

export interface FeaturedResult {
  entry: JourneyEntry;
  source: FeaturedSource;
}

/**
 * THE OPENING entry. An editorial `featured` pin wins; if that pin
 * is older than `FEATURED_MAX_AGE_DAYS` it is still returned but
 * flagged `featured-stale`. With no pin at all, the newest published
 * entry stands in. `null` only when nothing is published.
 */
export function getFeaturedEntry(now: Date = new Date()): FeaturedResult | null {
  const published = ENTRIES.filter(isInStream).sort(byNewest);
  if (published.length === 0) return null;

  const pinned = published.filter((e) => e.featured);
  if (pinned.length > 0) {
    const entry = pinned[0];
    const stale = ageInDays(entry.publishedAtISO, now) > FEATURED_MAX_AGE_DAYS;
    return { entry, source: stale ? 'featured-stale' : 'featured' };
  }
  return { entry: published[0], source: 'newest' };
}

/** One entry by slug — public or not (route guards decide visibility). */
export function getEntryBySlug(slug: string): JourneyEntry | undefined {
  return ENTRIES.find((e) => e.slug === slug);
}

/**
 * Slugs that get a stable detail page — published and archived only
 * (`generateStaticParams`). Draft / scheduled entries have no route.
 */
export function publishedJourneySlugs(): string[] {
  return ENTRIES.filter(isPublic).map((e) => e.slug);
}

/**
 * "HAYOT DAVOM ETADI" — genuinely related entries for the end of a
 * detail page. Editorial `relatedSlugs` first (still-public only),
 * then entries sharing a tag, then most-recent; never the entry
 * itself, capped at `limit`.
 */
export function getRelatedEntries(
  entry: JourneyEntry,
  limit = 3,
): JourneyEntry[] {
  const pool = getJourneyIndex().filter((e) => e.id !== entry.id);
  const picked: JourneyEntry[] = [];
  const take = (e: JourneyEntry) => {
    if (picked.length < limit && !picked.some((p) => p.id === e.id)) picked.push(e);
  };

  for (const slug of entry.relatedSlugs ?? []) {
    const match = pool.find((e) => e.slug === slug);
    if (match) take(match);
  }
  if (picked.length < limit) {
    for (const e of pool) {
      if (e.tags.some((t) => entry.tags.includes(t))) take(e);
    }
  }
  if (picked.length < limit) {
    for (const e of pool) take(e);
  }
  return picked;
}

export type CampaignState = 'upcoming' | 'active' | 'ended';

/**
 * A campaign's state, derived from its window vs. now — never
 * stored, so an ended campaign can't keep claiming to be open.
 * `null` for entries that are not campaigns.
 */
export function campaignState(
  entry: JourneyEntry,
  now: Date = new Date(),
): CampaignState | null {
  const c = entry.campaign;
  if (!c) return null;
  const t = now.getTime();
  if (t < new Date(c.startISO).getTime()) return 'upcoming';
  if (t > new Date(c.endISO).getTime()) return 'ended';
  return 'active';
}

// ── YAQIN KUNLAR ───────────────────────────────────────────────────
function pulseText(
  map: Partial<Record<Locale, string>>,
  locale: Locale,
): string {
  return map[locale] ?? map.uz ?? map.en ?? Object.values(map)[0] ?? '';
}

/**
 * The forward pulse for a locale: upcoming + today items, plus any
 * item from the last couple of days for context, oldest→newest.
 * Returns `[]` when there is nothing meaningful ahead — the YAQIN
 * KUNLAR band renders nothing in that case (never a placeholder).
 */
export function getPulse(
  locale: Locale = 'uz',
  now: Date = new Date(),
): PulseItem[] {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return PULSE.map((seed) => {
    const when = new Date(seed.dateISO);
    const daysFromToday = (when.getTime() - startOfToday.getTime()) / DAY_MS;
    const state: PulseItem['state'] =
      daysFromToday >= 1 ? 'upcoming' : daysFromToday > -1 ? 'today' : 'past';
    return {
      id: seed.id,
      dateISO: seed.dateISO,
      strand: seed.strand,
      label: pulseText(seed.label, locale),
      title: pulseText(seed.title, locale),
      href: seed.href,
      state,
    };
  })
    .filter(
      (item) =>
        item.state !== 'past' ||
        ageInDays(item.dateISO, now) <= PULSE_PAST_GRACE_DAYS,
    )
    .sort(
      (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime(),
    );
}

// ── Privacy policy helper ──────────────────────────────────────────
/**
 * What a renderer may do with this entry's media.
 *
 *  • `showMedia`  — may the `cover` / gallery images be rendered at
 *    all? `false` for `consent: 'none'` (people present, no consent):
 *    the renderer must fall back to a non-photographic treatment.
 *  • `showPeople` — may recognisable faces be shown? Only ever `true`
 *    for `consent: 'granted'`. For `'not-applicable'` (no people in
 *    the frame) the media is shown but this stays `false` because
 *    there is nothing to permit.
 *
 * Consult this before rendering any photograph in HAYOT. Do not
 * weaken it for visual polish.
 */
export function mediaPolicy(entry: JourneyEntry): {
  showMedia: boolean;
  showPeople: boolean;
} {
  switch (entry.media.consent) {
    case 'granted':
      return { showMedia: true, showPeople: true };
    case 'not-applicable':
      return { showMedia: true, showPeople: false };
    case 'none':
    default:
      return { showMedia: false, showPeople: false };
  }
}

/**
 * Whether HAYOT currently has ANY public content (entries or pulse).
 * The page still renders its full structure when this is false — the
 * movements show intentional empty states, not a broken page.
 */
export function hasJourneyContent(): boolean {
  return getJourneyIndex().length > 0 || getPulse().length > 0;
}

/* The exact shape of every format and block type is in
 * `dev-fixtures.ts` — use it as the reference when adding real
 * entries to `PRODUCTION_ENTRIES`. */
