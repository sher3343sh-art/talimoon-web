import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LegalDocument, type LegalCopy } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service — TALIMOON",
  description:
    "The terms that apply to the TALIMOON website and to orders for personalized children's books and related products.",
};

/**
 * /terms — public, no login. Server component (so it can carry
 * `metadata`); the bilingual body renders through the shared
 * client-side <LegalDocument>. Footer mirrors the About page:
 * no commercial pre-footer CTA, and no #how-it-works anchor exists
 * on this route.
 */

const EN: LegalCopy = {
  title: "Terms of Service",
  effectiveLabel: "Effective date",
  effectiveDate: "4 September 2026",
  intro: [
    "These Terms of Service ('Terms') apply to your use of the TALIMOON website and to orders you place with us for personalized books and related products.",
    "Please read them together with our Privacy Policy.",
  ],
  sections: [
    {
      heading: "Acceptance of these terms",
      blocks: [
        {
          kind: "p",
          text: "By using our website or placing an order with us, you agree to these Terms. If you do not agree, please do not place an order. If you are ordering on behalf of another person or a household, you confirm that you are authorized to do so and to accept these Terms for them.",
        },
      ],
    },
    {
      heading: "What TALIMOON offers",
      blocks: [
        {
          kind: "p",
          text: "TALIMOON creates personalized children's books, storytelling and educational content, and related products and services in which a child is placed at the centre of the story. The exact products, options, and formats available may change over time.",
        },
      ],
    },
    {
      heading: "Information you give us",
      blocks: [
        { kind: "p", text: "When you place an order, you confirm that:" },
        {
          kind: "list",
          items: [
            "the information you provide is accurate and complete enough for us to create your order;",
            "you are authorized to share the names, details, and photographs of the child and of any additional people included in the order;",
            "the materials you submit do not, to your knowledge, infringe anyone else's rights or break any applicable law.",
          ],
        },
        {
          kind: "p",
          text: "We rely on what you tell us. We are not responsible for errors that result from inaccurate or incomplete information provided to us.",
        },
      ],
    },
    {
      heading: "Personalized content",
      blocks: [
        {
          kind: "p",
          text: "Personalized books are custom-created from the information you provide. Producing them involves creative work: illustration style, composition, wording, and story details are prepared by our team and may involve reasonable artistic interpretation. Illustrations are artistic representations and are not exact photographic reproductions of any person, unless a specific product clearly states otherwise.",
        },
      ],
    },
    {
      heading: "Order and production process",
      blocks: [
        {
          kind: "p",
          text: "After you place an order, we prepare your personalized content and move it through our production process. The specific steps, any review opportunities, and the timelines are those shown to you during ordering and in the communications we send about your order. We may contact you if we need clarification or better source material.",
        },
      ],
    },
    {
      heading: "Pricing and payment",
      blocks: [
        {
          kind: "p",
          text: "The price that applies to your order is the price shown to you during the ordering process at the time you order. Payment is due as described during ordering. Depending on your location and delivery choices, taxes, shipping, or other charges may apply and, where they do, will be shown to you before you complete the order.",
        },
      ],
    },
    {
      heading: "Delivery",
      blocks: [
        {
          kind: "p",
          text: "Any delivery date or timeframe we give is an estimate. Actual delivery depends on production, the delivery address, the carrier, and factors outside our control. We are not liable for delays caused by carriers or by circumstances we cannot reasonably control, but we will help you follow up on a delayed order.",
        },
      ],
    },
    {
      heading: "Photographs and content you provide",
      blocks: [
        {
          kind: "p",
          text: "You keep all rights you have in the photographs, text, and other materials you submit. You grant TALIMOON a limited, non-exclusive permission to use, store, reproduce, and adapt those materials only as needed to create, produce, deliver, and support the order you placed.",
        },
        {
          kind: "p",
          text: "This permission ends when it is no longer needed for those purposes, except for copies we must keep as ordinary business or legal records. We do not use your materials for advertising or public promotion without your separate permission.",
        },
      ],
    },
    {
      heading: "TALIMOON's intellectual property",
      blocks: [
        {
          kind: "p",
          text: "The TALIMOON name, logo, website, story templates, original stories and characters, illustrations we create, layouts, designs, and the systems behind our service belong to TALIMOON or its licensors and are protected by law.",
        },
        {
          kind: "p",
          text: "Your order gives you a personal copy of the finished product for your own family use. It does not transfer ownership of the underlying templates, illustration style, or original TALIMOON content, and it does not allow resale or commercial reproduction. This does not affect the rights you keep in your own submitted photographs and details.",
        },
      ],
    },
    {
      heading: "Cancellation and refunds for custom products",
      blocks: [
        {
          kind: "p",
          text: "Because our products are personalized and made for you, cancellation and refund options are limited once production has begun. Before production starts, you may contact us to change or cancel an order. After production has begun, changes or refunds may not be possible, or may be partial, depending on the stage of the work and the circumstances of the order.",
        },
        {
          kind: "p",
          text: "Nothing in this section limits rights you may have under applicable consumer-protection law. If something is wrong with your order — for example a production defect or an error on our side — contact us and we will work with you to put it right.",
        },
      ],
    },
    {
      heading: "Acceptable use",
      blocks: [
        {
          kind: "p",
          text: "When using our website and service, you agree not to:",
        },
        {
          kind: "list",
          items: [
            "submit content that is unlawful, infringing, or that you are not authorized to share;",
            "upload photographs of a child without the authority to do so;",
            "attempt to disrupt, damage, or gain unauthorized access to our website or systems;",
            "use our content, stories, or designs for resale or commercial reproduction without our written permission.",
          ],
        },
        {
          kind: "p",
          text: "We may decline or cancel an order that would require us to break the law or these Terms.",
        },
      ],
    },
    {
      heading: "Availability and changes to the service",
      blocks: [
        {
          kind: "p",
          text: "We may update, change, or discontinue parts of our website or product range, and we may correct errors in pricing or descriptions. We try to keep the website available but cannot guarantee uninterrupted access.",
        },
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        {
          kind: "p",
          text: "We provide our website and products with reasonable care and skill. To the extent permitted by applicable law, TALIMOON is not liable for indirect or unforeseeable losses, and our total liability connected with an order is limited to the amount you paid for that order. Nothing in these Terms limits liability that cannot be limited by law.",
        },
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        {
          kind: "p",
          text: "These Terms are interpreted and applied subject to applicable law. Nothing in these Terms removes mandatory legal protections available to you where you live.",
        },
      ],
    },
    {
      heading: "Changes to these terms",
      blocks: [
        {
          kind: "p",
          text: "We may update these Terms from time to time. The version that applies to your order is the one published on this page when you place the order. We will update the effective date above when we make changes.",
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [
        {
          kind: "p",
          text: "For any question about these Terms, or about an order, contact us at talimoon.production@gmail.com.",
        },
      ],
    },
  ],
};

const UZ: LegalCopy = {
  title: "Foydalanish shartlari",
  effectiveLabel: "Kuchga kirgan sana",
  effectiveDate: "2026-yil 4-sentabr",
  intro: [
    "Ushbu Foydalanish shartlari ('Shartlar') TALIMOON veb-saytidan foydalanishingizga hamda shaxsiylashtirilgan kitoblar va u bilan bog'liq mahsulotlar uchun beradigan buyurtmalaringizga tatbiq etiladi.",
    "Iltimos, ularni Maxfiylik siyosati bilan birga o'qing.",
  ],
  sections: [
    {
      heading: "Shartlarni qabul qilish",
      blocks: [
        {
          kind: "p",
          text: "Veb-saytimizdan foydalanish yoki bizga buyurtma berish orqali siz ushbu Shartlarga rozilik bildirasiz. Rozi bo'lmasangiz, iltimos, buyurtma bermang. Agar boshqa shaxs yoki oila nomidan buyurtma berayotgan bo'lsangiz, buni qilishga va ushbu Shartlarni ular nomidan qabul qilishga vakolatingiz borligini tasdiqlaysiz.",
        },
      ],
    },
    {
      heading: "TALIMOON nimani taklif qiladi",
      blocks: [
        {
          kind: "p",
          text: "TALIMOON bola hikoya markazida bo'lgan shaxsiylashtirilgan bolalar kitoblari, hikoya va ta'limiy kontent hamda u bilan bog'liq mahsulot va xizmatlarni yaratadi. Mavjud mahsulotlar, variantlar va formatlar vaqt o'tishi bilan o'zgarishi mumkin.",
        },
      ],
    },
    {
      heading: "Siz bizga beradigan ma'lumotlar",
      blocks: [
        { kind: "p", text: "Buyurtma berganingizda siz quyidagilarni tasdiqlaysiz:" },
        {
          kind: "list",
          items: [
            "taqdim etgan ma'lumotlaringiz buyurtmangizni yaratishimiz uchun aniq va yetarlicha to'liq;",
            "bola va buyurtmaga kiritilgan boshqa shaxslarning ismlari, ma'lumotlari va fotosuratlarini ulashishga vakolatingiz bor;",
            "yuborayotgan materiallaringiz, sizga ma'lum bo'lganicha, birovning huquqlarini buzmaydi va amaldagi qonunlarga zid emas.",
          ],
        },
        {
          kind: "p",
          text: "Biz siz aytgan ma'lumotlarga tayanamiz. Bizga taqdim etilgan noto'g'ri yoki chala ma'lumot tufayli yuzaga kelgan xatolar uchun javobgar emasmiz.",
        },
      ],
    },
    {
      heading: "Shaxsiylashtirilgan kontent",
      blocks: [
        {
          kind: "p",
          text: "Shaxsiylashtirilgan kitoblar siz taqdim etgan ma'lumotlar asosida maxsus yaratiladi. Ularni tayyorlash ijodiy mehnatni talab qiladi: rasm uslubi, kompozitsiya, so'zlar va hikoya tafsilotlari jamoamiz tomonidan tayyorlanadi va asosli badiiy talqinni o'z ichiga olishi mumkin. Rasmlar — badiiy tasvir bo'lib, biror mahsulotda aniq boshqacha ko'rsatilmagan bo'lsa, ular hech kimning aniq fotosurat nusxasi emas.",
        },
      ],
    },
    {
      heading: "Buyurtma va ishlab chiqarish jarayoni",
      blocks: [
        {
          kind: "p",
          text: "Buyurtma berganingizdan so'ng biz shaxsiylashtirilgan kontentingizni tayyorlaymiz va uni ishlab chiqarish jarayonidan o'tkazamiz. Aniq bosqichlar, ko'rib chiqish imkoniyatlari va muddatlar buyurtma paytida sizga ko'rsatilgan hamda buyurtmangiz yuzasidan yuboradigan xabarlarimizda bildirilganidek bo'ladi. Aniqlik yoki sifatliroq manba materiali kerak bo'lsa, siz bilan bog'lanishimiz mumkin.",
        },
      ],
    },
    {
      heading: "Narx va to'lov",
      blocks: [
        {
          kind: "p",
          text: "Buyurtmangizga buyurtma berish jarayonida, buyurtma bergan paytingizda sizga ko'rsatilgan narx tatbiq etiladi. To'lov buyurtma paytida tavsiflanganidek amalga oshiriladi. Joylashuvingiz va yetkazib berish tanlovlaringizga qarab soliqlar, yetkazib berish yoki boshqa to'lovlar qo'llanilishi mumkin va bunday hollarda ular buyurtmani yakunlashdan oldin sizga ko'rsatiladi.",
        },
      ],
    },
    {
      heading: "Yetkazib berish",
      blocks: [
        {
          kind: "p",
          text: "Biz beradigan har qanday yetkazib berish sanasi yoki muddati — taxminiy. Haqiqiy yetkazib berish ishlab chiqarish, yetkazib berish manzili, tashuvchi va biz nazorat qila olmaydigan omillarga bog'liq. Biz tashuvchilar yoki asosli nazoratimizdan tashqaridagi holatlar tufayli yuzaga kelgan kechikishlar uchun javobgar emasmiz, biroq kechikkan buyurtmani kuzatishda sizga yordam beramiz.",
        },
      ],
    },
    {
      heading: "Siz taqdim etadigan fotosuratlar va kontent",
      blocks: [
        {
          kind: "p",
          text: "Siz yuboradigan fotosuratlar, matn va boshqa materiallardagi barcha huquqlaringiz o'zingizda qoladi. Siz TALIMOONga bu materiallardan faqat siz bergan buyurtmani yaratish, ishlab chiqarish, yetkazib berish va qo'llab-quvvatlash uchun zarur bo'lganicha foydalanish, saqlash, ko'paytirish va moslashtirishga cheklangan, noeksklyuziv ruxsat berasiz.",
        },
        {
          kind: "p",
          text: "Bu ruxsat o'sha maqsadlar uchun kerak bo'lmay qolganda tugaydi — odatdagi biznes yoki qonuniy yozuv sifatida saqlashimiz shart bo'lgan nusxalar bundan mustasno. Biz materiallaringizdan alohida ruxsatingizsiz reklama yoki ommaviy targ'ib uchun foydalanmaymiz.",
        },
      ],
    },
    {
      heading: "TALIMOON intellektual mulki",
      blocks: [
        {
          kind: "p",
          text: "TALIMOON nomi, logotipi, veb-sayti, hikoya shablonlari, original hikoya va qahramonlari, biz yaratgan rasmlar, sahifa dizaynlari va xizmatimiz asosidagi tizimlar TALIMOONga yoki uning litsenziarlariga tegishli hamda qonun bilan himoyalangan.",
        },
        {
          kind: "p",
          text: "Buyurtmangiz sizga tayyor mahsulotning oilangiz uchun mo'ljallangan shaxsiy nusxasini beradi. U asosdagi shablonlar, rasm uslubi yoki original TALIMOON kontentiga egalik huquqini o'tkazmaydi hamda qayta sotish yoki tijoriy ko'paytirishga ruxsat bermaydi. Bu siz yuborgan fotosuratlar va ma'lumotlardagi o'z huquqlaringizga ta'sir qilmaydi.",
        },
      ],
    },
    {
      heading: "Shaxsiy mahsulotlar uchun bekor qilish va pul qaytarish",
      blocks: [
        {
          kind: "p",
          text: "Mahsulotlarimiz shaxsiylashtirilgan va siz uchun tayyorlangani sababli, ishlab chiqarish boshlangandan so'ng bekor qilish va pul qaytarish imkoniyatlari cheklangan. Ishlab chiqarish boshlanishidan oldin buyurtmani o'zgartirish yoki bekor qilish uchun biz bilan bog'lanishingiz mumkin. Ishlab chiqarish boshlangandan keyin o'zgartirish yoki pul qaytarish imkonsiz bo'lishi yoki ishning bosqichi va buyurtma holatiga qarab qisman bo'lishi mumkin.",
        },
        {
          kind: "p",
          text: "Ushbu bo'limdagi hech narsa amaldagi iste'molchilar huquqlarini himoya qilish qonunchiligiga ko'ra sizda bo'lishi mumkin bo'lgan huquqlarni cheklamaydi. Agar buyurtmangizda biror nuqson bo'lsa — masalan, ishlab chiqarish nuqsoni yoki bizning tomonimizdagi xato — biz bilan bog'laning, biz uni tuzatish ustida siz bilan ishlaymiz.",
        },
      ],
    },
    {
      heading: "Taqiqlangan foydalanish",
      blocks: [
        {
          kind: "p",
          text: "Veb-saytimiz va xizmatimizdan foydalanganingizda siz quyidagilarga rozilik bildirasiz:",
        },
        {
          kind: "list",
          items: [
            "noqonuniy, birovning huquqlarini buzuvchi yoki ulashishga vakolatingiz bo'lmagan kontentni yubormaslik;",
            "bola fotosuratlarini bunga vakolatsiz yuklamaslik;",
            "veb-saytimiz yoki tizimlarimiz ishini buzish, zarar yetkazish yoki ularga ruxsatsiz kirishga urinmaslik;",
            "kontentimiz, hikoyalarimiz yoki dizaynlarimizdan yozma ruxsatimizsiz qayta sotish yoki tijoriy ko'paytirish uchun foydalanmaslik.",
          ],
        },
        {
          kind: "p",
          text: "Bizni qonunni yoki ushbu Shartlarni buzishga majbur qiladigan buyurtmani rad etishimiz yoki bekor qilishimiz mumkin.",
        },
      ],
    },
    {
      heading: "Xizmatning mavjudligi va o'zgarishlar",
      blocks: [
        {
          kind: "p",
          text: "Biz veb-saytimiz yoki mahsulot turkumining ba'zi qismlarini yangilashimiz, o'zgartirishimiz yoki to'xtatishimiz, shuningdek narx yoki tavsiflardagi xatolarni tuzatishimiz mumkin. Biz veb-saytni ishlab turgan holatda saqlashga harakat qilamiz, biroq uzluksiz kirishni kafolatlay olmaymiz.",
        },
      ],
    },
    {
      heading: "Javobgarlik cheklovi",
      blocks: [
        {
          kind: "p",
          text: "Biz veb-saytimiz va mahsulotlarimizni asosli g'amxo'rlik va mahorat bilan taqdim etamiz. Amaldagi qonun ruxsat bergan darajada TALIMOON bilvosita yoki oldindan ko'rib bo'lmaydigan zararlar uchun javobgar emas va buyurtma bilan bog'liq umumiy javobgarligimiz siz o'sha buyurtma uchun to'lagan summa bilan cheklanadi. Ushbu Shartlardagi hech narsa qonun bo'yicha cheklab bo'lmaydigan javobgarlikni cheklamaydi.",
        },
      ],
    },
    {
      heading: "Amaldagi qonun",
      blocks: [
        {
          kind: "p",
          text: "Ushbu Shartlar amaldagi qonunga muvofiq talqin qilinadi va qo'llaniladi. Ushbu Shartlardagi hech narsa siz yashaydigan joyda mavjud majburiy huquqiy himoyalarni bekor qilmaydi.",
        },
      ],
    },
    {
      heading: "Shartlarga o'zgartirishlar",
      blocks: [
        {
          kind: "p",
          text: "Biz ushbu Shartlarni vaqti-vaqti bilan yangilashimiz mumkin. Buyurtmangizga bu sahifada buyurtma bergan paytingizda e'lon qilingan versiya tatbiq etiladi. O'zgartirishlar kiritganimizda yuqoridagi kuchga kirish sanasini yangilaymiz.",
        },
      ],
    },
    {
      heading: "Bog'lanish",
      blocks: [
        {
          kind: "p",
          text: "Ushbu Shartlar yoki buyurtma bo'yicha har qanday savol uchun biz bilan talimoon.production@gmail.com orqali bog'laning.",
        },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <LegalDocument en={EN} uz={UZ} />
      </main>
      <Footer showTopCta={false} showHowItWorksLink={false} />
    </>
  );
}
