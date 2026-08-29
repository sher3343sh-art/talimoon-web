import type { Metadata } from 'next';

/**
 * The Reader route renders no site chrome — no Navbar, no Footer, no
 * marketing. The <Reader> component covers the viewport (fixed
 * inset-0). This layout just carries that intent and keeps the route
 * out of search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
