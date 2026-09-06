'use client';

import { useEffect, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'talimoon-pwa-prompt-dismissed';
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

function isStandalone() {
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || iosNavigator.standalone === true;
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isIOSSafari = isIOS
    && /safari/i.test(navigator.userAgent)
    && !/crios|fxios|edgios|opios|yabrowser/i.test(navigator.userAgent);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    if (isStandalone()) return;

    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (Date.now() - dismissedAt < TWO_WEEKS) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const reveal = window.setTimeout(() => { if (ios) setVisible(true); }, 7000);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => { window.clearTimeout(reveal); window.removeEventListener('beforeinstallprompt', onPrompt); };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setVisible(false);
    setInstallEvent(null);
  };

  const copyForSafari = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Havolani nusxalang va Safari’da oching:', window.location.href);
    }
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-[1000] mx-auto max-w-md overflow-hidden rounded-[24px] border border-[#D6B770]/45 bg-[#101A29]/95 p-4 text-[#F7F3EC] shadow-[0_24px_80px_rgba(5,13,25,.42)] backdrop-blur-xl" aria-label="TALIMOON ilovasini o‘rnatish">
      <button type="button" onClick={dismiss} aria-label="Yopish" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-xl text-white/55 hover:bg-white/10 hover:text-white">×</button>
      <div className="flex gap-3 pr-8">
        <img src="/pwa/prompt-logo-v4.png" alt="TALIMOON" width={56} height={56} className="h-14 w-14 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,.55)]" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B770]">TALIMOON ILOVASI</p>
          <h2 className="mt-1 text-lg font-semibold">TALIMOON’ni qurilmangizga saqlang</h2>
        </div>
      </div>
      {isIOSSafari ? (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-white/[.07] px-3 py-3 text-white/75">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[.18em] text-[#D6B770]">1-qadam</span>
            Pastdagi <strong className="text-white">Ulashish ⎋</strong> tugmasini bosing
          </div>
          <div className="rounded-2xl bg-white/[.07] px-3 py-3 text-white/75">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[.18em] text-[#D6B770]">2-qadam</span>
            <strong className="text-white">Bosh ekranga qo‘shish ＋</strong>ni tanlang
          </div>
        </div>
      ) : isIOS ? (
        <div className="mt-3">
          <p className="text-sm leading-6 text-white/70">Havolani nusxalang, <strong className="text-white">Safari</strong>da oching va Ulashish → <strong className="text-white">Bosh ekranga qo‘shish</strong>ni tanlang.</p>
          <button type="button" onClick={copyForSafari} className="mt-3 w-full rounded-full bg-[#D6B770] px-5 py-3 text-sm font-bold text-[#101A29] shadow-lg">
            {copied ? 'Nusxalandi — Safari’da oching' : 'Havolani nusxalash'}
          </button>
        </div>
      ) : (
        <button type="button" onClick={install} className="mt-4 w-full rounded-full bg-[#D6B770] px-5 py-3 text-sm font-bold text-[#101A29] shadow-lg">Ilovani o‘rnatish</button>
      )}
    </aside>
  );
}
