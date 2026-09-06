'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

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

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-[1000] mx-auto max-w-md overflow-hidden rounded-[24px] border border-[#D6B770]/45 bg-[#101A29]/95 p-4 text-[#F7F3EC] shadow-[0_24px_80px_rgba(5,13,25,.42)] backdrop-blur-xl" aria-label="TALIMOON ilovasini o‘rnatish">
      <button type="button" onClick={dismiss} aria-label="Yopish" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-xl text-white/55 hover:bg-white/10 hover:text-white">×</button>
      <div className="flex gap-3 pr-8">
        <Image src="/pwa/icon-transparent-192.png?v=2" alt="TALIMOON" width={56} height={56} className="h-14 w-14 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,.55)]" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B770]">TALIMOON ILOVASI</p>
          <h2 className="mt-1 text-lg font-semibold">Hikoyalarni to‘liq ekranda o‘qing</h2>
        </div>
      </div>
      {isIOS ? (
        <p className="mt-3 text-sm leading-6 text-white/70">Safari pastidagi <strong className="text-white">Ulashish</strong> belgisini bosing, so‘ng <strong className="text-white">“Bosh ekranga qo‘shish”</strong>ni tanlang.</p>
      ) : (
        <button type="button" onClick={install} className="mt-4 w-full rounded-full bg-[#D6B770] px-5 py-3 text-sm font-bold text-[#101A29] shadow-lg">Ilovani o‘rnatish</button>
      )}
    </aside>
  );
}
