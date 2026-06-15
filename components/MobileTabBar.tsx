'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileTabBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const showComingSoon = (feature: string) => {
    alert(`${feature} feature is coming soon!`);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111118] border-t border-brand-border z-50 flex justify-around items-center px-6 shadow-lg">
      {/* Home Tab */}
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
          isHome ? "text-brand-accent" : "text-brand-text-secondary hover:text-brand-text-primary"
        }`}
      >
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wide uppercase">Home</span>
      </Link>

      {/* History Tab */}
      <button 
        onClick={() => showComingSoon("History")}
        className="flex flex-col items-center justify-center gap-1 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
      >
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wide uppercase">History</span>
      </button>

      {/* Settings Tab */}
      <button 
        onClick={() => showComingSoon("Settings")}
        className="flex flex-col items-center justify-center gap-1 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
      >
        <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wide uppercase">Settings</span>
      </button>
    </div>
  );
}
