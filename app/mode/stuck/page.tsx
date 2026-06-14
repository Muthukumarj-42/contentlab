import Link from "next/link";

export default function ModeStuckPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />
      
      <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-brand-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-text mb-4">
        Stuck with Content Ideas
      </h1>
      <p className="text-md text-[#1C1917]/60 max-w-md mb-8 leading-relaxed">
        We are building an interactive prompt generator to guide you through formats, angles, and hook structures for your chosen topic. This feature is coming soon!
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
