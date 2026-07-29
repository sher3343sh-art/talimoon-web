import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MaskDefs } from "@/components/ui/MaskDefs";


const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TALIMOON | Personalized Children's Books",
  description:
    "Personalized storybooks that place your child at the heart of every adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
  className={`${fraunces.variable} ${plusJakartaSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col`}
>
  <MaskDefs />
  {children}
</body>
    </html>
  );
}
