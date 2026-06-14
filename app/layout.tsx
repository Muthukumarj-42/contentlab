import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContentLab | AI-Powered Content Assistant for Creators",
  description: "Package your social media content perfectly. Generate high-converting hooks, captions, hashtags, posting times, and briefs powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-text min-h-screen flex flex-col antialiased">
        <header className="border-b border-[#EADFC9]/40 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight hover:opacity-85 transition-opacity">
              Content<span className="text-brand-accent">Lab</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/mode/zero" className="hover:text-brand-accent transition-colors">Starting from Zero</Link>
              <Link href="/mode/stuck" className="hover:text-brand-accent transition-colors">Content Ideas</Link>
              <Link href="/mode/package" className="hover:text-brand-accent transition-colors text-brand-accent font-semibold">Package Content</Link>
            </nav>
            <div className="md:hidden">
              <Link href="/mode/package" className="bg-brand-accent text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-brand-accent/90 transition-colors">
                Try Builder
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 md:py-12">
          {children}
        </main>
        <footer className="border-t border-[#EADFC9]/30 py-8 bg-brand-bg">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-[#1C1917]/50">
            &copy; {new Date().getFullYear()} ContentLab. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
