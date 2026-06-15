'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-[#0A0A0F]/80 backdrop-blur-xl h-[52px] md:h-[60px] flex items-center transition-all">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between relative">
        {/* Mobile Back Arrow (Only on inner pages, on left) */}
        {!isHome && (
          <button
            onClick={() => router.push("/")}
            className="md:hidden absolute left-4 p-1.5 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated transition-colors"
            aria-label="Go Back"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Logo container: Centered on mobile inner pages, left-aligned on desktop */}
        <div className={`flex items-center w-full md:w-auto ${!isHome ? 'justify-center md:justify-start' : 'justify-between md:justify-start'}`}>
          <Link href="/" className="font-heading text-xl md:text-2xl font-bold tracking-tight text-brand-text-primary hover:opacity-85 transition-opacity">
            ContentLab<span className="text-brand-accent">.</span>
          </Link>
        </div>

        {/* Desktop Mode Switcher (Pills on right) */}
        <nav className="hidden md:flex items-center gap-1 bg-brand-surface p-1 rounded-full border border-brand-border">
          <Link
            href="/mode/zero"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              pathname === "/mode/zero"
                ? "bg-brand-accent/10 text-brand-accent border-brand-accent/25"
                : "text-brand-text-secondary hover:text-brand-text-primary border-transparent"
            }`}
          >
            Zero
          </Link>
          <Link
            href="/mode/stuck"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              pathname === "/mode/stuck"
                ? "bg-brand-accent/10 text-brand-accent border-brand-accent/25"
                : "text-brand-text-secondary hover:text-brand-text-primary border-transparent"
            }`}
          >
            Stuck
          </Link>
          <Link
            href="/mode/package"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
              pathname === "/mode/package"
                ? "bg-brand-accent/10 text-brand-accent border-brand-accent/25"
                : "text-brand-text-secondary hover:text-brand-text-primary border-transparent"
            }`}
          >
            Package
          </Link>
        </nav>
      </div>
    </header>
  );
}
