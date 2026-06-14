import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center py-10 md:py-16 overflow-hidden">
      {/* Soft background glow decoration */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 md:w-[500px] md:h-[500px] bg-brand-accent/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl z-10 mb-14 md:mb-20 px-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-6">
          ✨ AI-Powered Social Strategy
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-text mb-6 leading-[1.15]">
          Your content. <br />
          <span className="text-brand-accent italic">Packaged perfectly.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#1C1917]/70 font-medium max-w-xl mx-auto leading-relaxed">
          {"Tell us where you're stuck — we handle the rest. Go from a raw idea to fully packaged, high-performing social posts in seconds."}
        </p>
      </div>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10 px-4">
        {/* Mode 1 */}
        <Link 
          href="/mode/zero" 
          className="group relative bg-white border border-[#EADFC9]/50 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {/* Rocket icon */}
              <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a6 6 0 015.96 5.96z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h.01a1 1 0 11-1 1z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-text mb-2">Starting from zero</h3>
            <p className="text-sm text-[#1C1917]/60 leading-relaxed mb-6">
              Have no ideas yet? We will brainstorm, find trends, and draft original concepts tailored for your niche.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-brand-accent group-hover:gap-1.5 transition-all">
            <span>Get Started</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Mode 2 */}
        <Link 
          href="/mode/stuck" 
          className="group relative bg-white border border-[#EADFC9]/50 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {/* Lightbulb icon */}
              <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-text mb-2">Stuck with content ideas</h3>
            <p className="text-sm text-[#1C1917]/60 leading-relaxed mb-6">
              Have a general theme but need help mapping out specific video titles, formats, or angles for engagement.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-brand-accent group-hover:gap-1.5 transition-all">
            <span>Get Started</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Mode 3 */}
        <Link 
          href="/mode/package" 
          className="group relative bg-white border-2 border-brand-accent/50 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between ring-4 ring-brand-accent/5"
        >
          <div className="absolute -top-3.5 right-6 bg-brand-accent text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow-md">
            Active Builder
          </div>
          <div>
            <div className="w-12 h-12 rounded-xl bg-brand-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {/* Package icon */}
              <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-text mb-2">Have content, need packaging</h3>
            <p className="text-sm text-[#1C1917]/60 leading-relaxed mb-6">
              Provide a brief content idea and instantly generate viral hooks, optimized captions, hashtags, post times, and thumbnail briefs.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-brand-accent group-hover:gap-1.5 transition-all">
            <span>Launch Builder</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
