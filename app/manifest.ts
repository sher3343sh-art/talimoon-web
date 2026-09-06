import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TALIMOON — Hikoyalar olami',
    short_name: 'TALIMOON',
    description: 'Farzandingiz uchun shaxsiy va ovozli hikoyalar kutubxonasi.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#101A29',
    theme_color: '#101A29',
    orientation: 'any',
    categories: ['books', 'education', 'entertainment'],
    icons: [
      { src: '/pwa/app-icon-v4-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa/app-icon-v4-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa/app-icon-v4-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
