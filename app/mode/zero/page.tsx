import Link from "next/link";

export default function ModeZeroPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-brand-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a6 6 0 015.96 5.96z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h.01a1 1 0 11-1 1z" />
        </svg>
      </div>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-text mb-4">
        Starting from Zero
      </h1>
      <p className="text-md text-[#1C1917]/60 max-w-md mb-8 leading-relaxed">
        We are building an AI brainstorming engine to help you discover trending topics and script outline frameworks. This feature is coming soon!
      </p>

      <Link 
        href="/"
        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border-2 border-brand-text font-semibold text-sm hover:bg-brand-text hover:text-white transition-all duration-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
