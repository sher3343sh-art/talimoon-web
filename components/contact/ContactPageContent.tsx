"use client";

import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageContext";
import { CONTACT } from "@/lib/site/social";

const EN = {
  eyebrow: "CONTACT TALIMOON",
  title: "We are close, wherever you are.",
  intro: "Questions about an order, a book, or delivery? Choose the most convenient way to reach our team.",
  regions: "REGIONAL CONTACTS",
  qatar: "Qatar",
  uzbekistan: "Uzbekistan",
  call: "Call",
  whatsapp: "Write on WhatsApp",
  online: "WRITE TO US",
  onlineTitle: "Prefer to write?",
  onlineIntro: "Send us a message. We will respond through the channel you choose.",
  email: "Email",
  telegram: "Telegram",
  instagram: "Instagram",
  note: "For faster help, include your name and order number if you already have one.",
};

const UZ: typeof EN = {
  eyebrow: "TALIMOON BILAN ALOQA",
  title: "Qayerda bo‘lsangiz ham, biz yaqindamiz.",
  intro: "Buyurtma, kitob yoki yetkazib berish bo‘yicha savolingiz bormi? Sizga qulay aloqa usulini tanlang.",
  regions: "HUDUDIY ALOQA MANZILLARI",
  qatar: "Qatar",
  uzbekistan: "O‘zbekiston",
  call: "Qo‘ng‘iroq qilish",
  whatsapp: "WhatsApp orqali yozish",
  online: "BIZGA YOZING",
  onlineTitle: "Yozish qulayroqmi?",
  onlineIntro: "Xabaringizni yuboring. Siz tanlagan aloqa kanali orqali javob beramiz.",
  email: "Email",
  telegram: "Telegram",
  instagram: "Instagram",
  note: "Tezroq yordam olish uchun, mavjud bo‘lsa, ismingiz va buyurtma raqamingizni yozing.",
};

const RU: typeof EN = {
  eyebrow: "СВЯЗАТЬСЯ С TALIMOON",
  title: "Мы рядом, где бы вы ни находились.",
  intro: "Есть вопрос о заказе, книге или доставке? Выберите удобный способ связи с нашей командой.",
  regions: "КОНТАКТЫ ПО РЕГИОНАМ",
  qatar: "Катар",
  uzbekistan: "Узбекистан",
  call: "Позвонить",
  whatsapp: "Написать в WhatsApp",
  online: "НАПИШИТЕ НАМ",
  onlineTitle: "Удобнее написать?",
  onlineIntro: "Отправьте сообщение — мы ответим через выбранный вами канал.",
  email: "Email",
  telegram: "Telegram",
  instagram: "Instagram",
  note: "Чтобы мы помогли быстрее, укажите имя и номер заказа, если он уже есть.",
};

const whatsappMessage = encodeURIComponent("Assalomu alaykum, TALIMOON kitoblari haqida ma’lumot olmoqchiman.");

export function ContactPageContent() {
  const t = useT(EN, UZ, RU);
  const regions = [
    { name: t.qatar, number: CONTACT.qatarPhone.value, tel: CONTACT.qatarPhone.href, wa: `https://wa.me/97477472723?text=${whatsappMessage}` },
    { name: t.uzbekistan, number: CONTACT.uzbekistanPhone.value, tel: CONTACT.uzbekistanPhone.href, wa: `https://wa.me/998972560020?text=${whatsappMessage}` },
  ];
  const channels = [
    { name: t.email, value: CONTACT.email.value, href: CONTACT.email.href, icon: Mail },
    { name: t.telegram, value: CONTACT.telegram.value, href: CONTACT.telegram.href, icon: Send },
    { name: t.instagram, value: CONTACT.instagramDM.value, href: CONTACT.instagramDM.href, icon: MessageCircle },
  ];

  return (
    <main className="overflow-hidden bg-[#F8F5EF] text-[#172439]">
      <section className="relative border-b border-[#B8935B]/20 px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div aria-hidden="true" className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#D8B563]/10 blur-3xl" />
        <div className="relative mx-auto max-w-[1180px]">
          <p className="font-sans text-xs font-semibold tracking-[0.24em] text-[#A77E38]">{t.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(2.8rem,6vw,5.8rem)] leading-[0.98] tracking-[-0.035em]">{t.title}</h1>
          <p className="mt-7 max-w-2xl font-sans text-lg leading-8 text-[#5F6875] md:text-xl">{t.intro}</p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1180px]">
          <p className="font-sans text-xs font-semibold tracking-[0.22em] text-[#A77E38]">{t.regions}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {regions.map((region, index) => (
              <article key={region.name} className="group relative overflow-hidden rounded-[28px] border border-[#B8935B]/25 bg-white p-7 shadow-[0_18px_60px_rgba(23,36,57,0.08)] md:p-9">
                <span aria-hidden="true" className="absolute right-6 top-4 font-serif text-7xl text-[#B8935B]/10">0{index + 1}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#172439] text-[#D8B563]"><MapPin size={20} strokeWidth={1.7} /></div>
                <h2 className="mt-8 font-serif text-4xl">{region.name}</h2>
                <a href={region.tel} className="mt-3 inline-block font-sans text-xl text-[#3E4857] transition-colors hover:text-[#A77E38]">{region.number}</a>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={region.tel} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#172439]/15 px-5 py-3 font-sans text-sm font-semibold transition hover:border-[#B8935B] hover:text-[#A77E38]"><Phone size={16} />{t.call}</a>
                  <a href={region.wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172439] px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-[#263A54]"><MessageCircle size={16} className="text-[#D8B563]" />{t.whatsapp}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#172439] px-5 py-16 text-[#F8F5EF] md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.22em] text-[#D8B563]">{t.online}</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{t.onlineTitle}</h2>
            <p className="mt-5 max-w-md font-sans text-base leading-7 text-white/65">{t.onlineIntro}</p>
          </div>
          <div className="grid gap-3">
            {channels.map(({ name, value, href, icon: Icon }) => (
              <a key={name} href={href} target={href.startsWith("https") ? "_blank" : undefined} rel={href.startsWith("https") ? "noopener noreferrer" : undefined} className="group flex items-center gap-4 rounded-2xl border border-white/12 px-5 py-4 transition hover:border-[#D8B563]/60 hover:bg-white/[0.04]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8B563]/35 text-[#D8B563]"><Icon size={18} strokeWidth={1.7} /></span>
                <span><span className="block font-sans text-xs uppercase tracking-[0.16em] text-white/45">{name}</span><span className="mt-1 block font-sans text-base text-white">{value}</span></span>
                <span aria-hidden="true" className="ml-auto text-[#D8B563] transition-transform group-hover:translate-x-1">→</span>
              </a>
            ))}
            <p className="pt-3 font-sans text-sm leading-6 text-white/45">{t.note}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
