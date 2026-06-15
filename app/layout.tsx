import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import MobileTabBar from "@/components/MobileTabBar";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-text-primary min-h-screen flex flex-col antialiased">
        <Header />
        
        {/* pb-24 on mobile ensures main content is not hidden by the sticky MobileTabBar */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
          {children}
        </main>

        <footer className="hidden md:block border-t border-brand-border py-8 bg-brand-bg">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-brand-text-secondary">
            &copy; {new Date().getFullYear()} ContentLab. All rights reserved.
          </div>
        </footer>

        <MobileTabBar />
      </body>
    </html>
  );
}
