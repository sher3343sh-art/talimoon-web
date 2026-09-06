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
  telegramWrite: "Write on Telegram",
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
  telegramWrite: "Telegram orqali yozish",
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
  telegramWrite: "Написать в Telegram",
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
    { name: t.qatar, number: CONTACT.qatarPhone.value, tel: CONTACT.qatarPhone.href, messageHref: `https://wa.me/97477472723?text=${whatsappMessage}`, messageLabel: t.whatsapp, messageIcon: MessageCircle },
    { name: t.uzbekistan, number: CONTACT.uzbekistanPhone.value, tel: CONTACT.uzbekistanPhone.href, messageHref: "https://t.me/Talimoon_DM", messageLabel: t.telegramWrite, messageIcon: Send },
  ];
  const channels = [
    { name: t.email, value: "hello@talimoon.com", href: "mailto:hello@talimoon.com", icon: Mail },
    { name: t.telegram, value: "@Talimoon_DM", href: "https://t.me/Talimoon_DM", icon: Send },
    { name: t.instagram, value: "@talimoon_ · DM", href: "https://ig.me/m/talimoon_", icon: MessageCircle },
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
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {regions.map((region) => {
              const MessageIcon = region.messageIcon;
              return (
                <article key={region.name} className="group relative min-h-[340px] overflow-hidden rounded-[30px] border border-[#D8B563]/45 bg-[#162338] p-[1px] shadow-[0_24px_70px_rgba(14,25,43,0.22)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_85px_rgba(14,25,43,0.3)]">
                  <div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#E6C875]/15 blur-3xl transition duration-700 group-hover:bg-[#E6C875]/25" />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(118deg,transparent_22%,rgba(255,236,177,0.08)_45%,transparent_64%)] opacity-60 transition-transform duration-1000 group-hover:translate-x-8" />
                  <div className="relative flex min-h-[338px] flex-col rounded-[29px] border border-white/[0.06] px-7 py-7 text-[#F8F5EF] md:px-9 md:py-8">
                    <div className="flex items-start justify-between gap-5">
                      <img src="/logo/talimoon-logo-gold.svg" alt="TALIMOON" className="h-8 w-auto max-w-[155px] opacity-95" />
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D8B563]/35 bg-[#D8B563]/[0.07] text-[#E2C36F]"><MapPin size={18} strokeWidth={1.6} /></span>
                    </div>

                    <div className="my-auto py-9">
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D8B563]/75">{t.regions}</p>
                      <h2 className="mt-3 font-serif text-[2.6rem] leading-none tracking-[-0.025em] md:text-5xl">{region.name}</h2>
                      <a href={region.tel} className="mt-4 inline-block font-sans text-lg tracking-[0.045em] text-white/72 transition-colors hover:text-[#E2C36F] md:text-xl">{region.number}</a>
                    </div>

                    <div className="border-t border-[#D8B563]/25 pt-5">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a href={region.tel} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-sans text-[13px] font-semibold text-white/85 transition hover:border-[#D8B563]/70 hover:bg-white/[0.04] hover:text-[#E2C36F]"><Phone size={15} strokeWidth={1.8} />{t.call}</a>
                        <a href={region.messageHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 flex-[1.25] items-center justify-center gap-2 rounded-full bg-[linear-gradient(105deg,#A87F34,#F1D98A,#B48A3D)] px-4 py-2.5 font-sans text-[13px] font-bold text-[#172439] shadow-[0_8px_24px_rgba(216,181,99,0.18)] transition hover:brightness-110"><MessageIcon size={15} strokeWidth={1.9} />{region.messageLabel}</a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
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
