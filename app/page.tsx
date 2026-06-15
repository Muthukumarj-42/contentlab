import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-brand-bg transition-all duration-brand">
      
      {/* HERO SECTION */}
      <section className="w-full py-16 md:py-24 px-6 flex flex-col items-center text-center relative z-10">
        
        {/* Badge Pill */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-amber-soft border border-brand-accent-light text-[#92400E] text-[10px] font-extrabold uppercase tracking-widest mb-6 animate-fade-in-up">
          ✦ AI-Powered Creator Tool
        </span>

        {/* Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-brand-text-primary mb-6 leading-[1.2] max-w-3xl animate-fade-in-up">
          Your content. <br />
          <span className="text-brand-accent italic font-bold">
            Packaged perfectly.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-md sm:text-lg text-brand-text-secondary max-w-[560px] mx-auto leading-relaxed animate-fade-in-up">
          Tell us where you&apos;re stuck — we handle the rest. Go from a raw idea to fully packaged, high-performing social posts in seconds.
        </p>

        {/* Subtle Warm Divider */}
        <div className="w-full max-w-5xl h-px bg-brand-border mt-16 md:mt-24" />
      </section>

      {/* CHOOSE YOUR SITUATION SECTION */}
      <section className="w-full max-w-5xl px-6 pb-20 z-10">
        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-text-tertiary mb-6 text-center md:text-left">
          CHOOSE YOUR SITUATION
        </span>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Card 1 */}
          <Link 
            href="/mode/zero" 
            className="group relative bg-brand-surface border border-brand-border rounded-[20px] p-7 shadow-card hover:border-brand-accent hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-brand flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-brand-amber-soft flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-brand">
                {/* Rocket icon */}
                <svg className="w-6 h-6 text-brand-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a6 6 0 015.96 5.96z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h.01a1 1 0 11-1 1z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">Starting from zero</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Have no ideas yet? We will brainstorm, find trends, and draft original concepts tailored for your niche.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-brand-accent mt-6 transition-all">
              <span>Start</span>
              <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card 2 */}
          <Link 
            href="/mode/stuck" 
            className="group relative bg-brand-surface border border-brand-border rounded-[20px] p-7 shadow-card hover:border-brand-accent hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-brand flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-brand-amber-soft flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-brand">
                {/* Lightbulb icon */}
                <svg className="w-6 h-6 text-brand-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">Stuck with content ideas</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Have a general theme but need help mapping out specific video titles, formats, or angles for engagement.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-brand-accent mt-6 transition-all">
              <span>Start</span>
              <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Card 3 */}
          <Link 
            href="/mode/package" 
            className="group relative bg-brand-surface border border-brand-border rounded-[20px] p-7 shadow-card hover:border-brand-accent hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-brand flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-brand-amber-soft flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-brand">
                {/* Package icon */}
                <svg className="w-6 h-6 text-brand-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">Have content, need packaging</h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Provide a brief content idea and instantly generate viral hooks, optimized captions, hashtags, post times, and thumbnail briefs.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-brand-accent mt-6 transition-all">
              <span>Start</span>
              <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform duration-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="w-full bg-brand-surface border-y border-brand-border py-20 px-6 flex flex-col items-center text-center z-10">
        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-text-tertiary mb-3">
          HOW IT WORKS
        </span>
        <h2 className="font-heading text-3xl md:text-[36px] font-bold text-brand-text-primary mb-3">
          From idea to viral content in 3 steps
        </h2>
        <p className="text-sm md:text-md text-brand-text-secondary mb-16 max-w-md">
          No experience needed. Just describe where you are.
        </p>

        {/* Steps Container */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-6 relative">
          
          {/* Dashed Connector Lines (Desktop only) */}
          <div className="hidden md:block absolute top-5 left-[15%] right-[15%] h-px border-t border-dashed border-brand-accent/40 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 md:w-1/3">
            <div className="w-10 h-10 rounded-full border-2 border-brand-accent bg-brand-surface flex items-center justify-center mb-5">
              <span className="font-heading text-lg font-bold text-brand-accent">1</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
              Tell us your situation
            </h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed max-w-[240px]">
              Pick from 3 modes based on where you are as a creator right now.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 md:w-1/3">
            <div className="w-10 h-10 rounded-full border-2 border-brand-accent bg-brand-surface flex items-center justify-center mb-5">
              <span className="font-heading text-lg font-bold text-brand-accent">2</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
              AI analyzes your content
            </h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed max-w-[240px]">
              Our AI understands your niche, audience, and platform to craft the perfect strategy.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 md:w-1/3">
            <div className="w-10 h-10 rounded-full border-2 border-brand-accent bg-brand-surface flex items-center justify-center mb-5">
              <span className="font-heading text-lg font-bold text-brand-accent">3</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
              Get your content package
            </h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed max-w-[240px]">
              Hooks, captions, hashtags, timing, thumbnail briefs &mdash; all ready to use.
            </p>
          </div>

        </div>
      </section>

      {/* SOCIAL PROOF STRIP */}
      <section className="w-full bg-brand-bg py-12 px-6 flex flex-col items-center text-center z-10">
        <p className="text-sm font-medium text-brand-text-secondary mb-5">
          Used by creators across Tamil Nadu and beyond
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="px-4 py-2 bg-brand-amber-soft border border-brand-accent-light text-[#92400E] text-xs font-semibold rounded-full shadow-card">
            🪝 10,000+ Hooks Generated
          </span>
          <span className="px-4 py-2 bg-brand-amber-soft border border-brand-accent-light text-[#92400E] text-xs font-semibold rounded-full shadow-card">
            📱 3 Platforms Supported
          </span>
          <span className="px-4 py-2 bg-brand-amber-soft border border-brand-accent-light text-[#92400E] text-xs font-semibold rounded-full shadow-card">
            ⚡ Results in Seconds
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-brand-surface border-t border-brand-border py-6 px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
        <div className="font-heading text-lg font-bold text-brand-text-primary flex items-center">
          ContentLab
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent ml-0.5 inline-block" />
        </div>
        <p className="text-xs text-brand-text-tertiary">
          Built for creators. Powered by AI.
        </p>
      </footer>

    </div>
  );
}
