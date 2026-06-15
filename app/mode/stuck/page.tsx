'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TrendingAngle {
  angleName: string;
  whyItWorks: string;
  examplePost: string;
  hook: string;
}

interface ContentMixItem {
  type: string;
  percentage: number;
  reason: string;
}

interface StuckIdeasResult {
  diagnosis: string;
  trendingAngles: TrendingAngle[];
  fullScript: {
    hook: string;
    middle: string;
    cta: string;
  };
  contentMix: ContentMixItem[];
  quickWin: {
    format: string;
    hook: string;
    caption: string;
    hashtags: string[];
  };
  sevenDayPlan: {
    day: number;
    postType: string;
    topic: string;
    format: string;
  }[];
}

export default function ModeStuckPage() {
  // Form states
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('');
  const [struggle, setStruggle] = useState('');
  
  // Optional states
  const [followerCount, setFollowerCount] = useState('');
  const [contentTried, setContentTried] = useState<string[]>([]);
  const [language, setLanguage] = useState('');

  // Flow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<StuckIdeasResult | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  
  // Accordion active day
  const [activeDay, setActiveDay] = useState<number | null>(1);

  // Options lists
  const platformsList = ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Twitter/X'];
  
  const strugglesList = [
    '💀 Running out of ideas',
    '📉 Reach and views dropping',
    '😐 Content feels boring / repetitive',
    '⏰ Consistency issues',
    '🤷 Don\'t know what\'s trending'
  ];

  const followersList = ['0–100', '100–1K', '1K–10K', '10K–100K', '100K+'];
  
  const contentTypesList = [
    'Memes',
    'Talking videos',
    'Reels / Shorts',
    'Carousels',
    'Stories',
    'Tutorials'
  ];

  const languagesList = ['Tamil', 'Tanglish', 'Hindi', 'English', 'Mixed'];

  const handleToggleContentTried = (type: string) => {
    setContentTried((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const executeSubmit = async (useOptionals = true) => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: niche.trim(),
          platform,
          struggle,
          followerCount: useOptionals ? (followerCount || undefined) : undefined,
          contentTried: useOptionals ? (contentTried.length > 0 ? contentTried : undefined) : undefined,
          language: useOptionals ? (language || undefined) : undefined,
        }),
      });

      if (!response.ok) {
        let errMsg = 'Something went wrong. Try again.';
        try {
          const errData = await response.json();
          if (errData.error) {
            errMsg = errData.error;
          }
        } catch {
          // ignore
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setActiveDay(1); // Reset accordion to day 1
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      setValidationError('Please share your content niche.');
      return;
    }
    if (!platform) {
      setValidationError('Please select a target platform.');
      return;
    }
    if (!struggle) {
      setValidationError('Please choose your biggest struggle.');
      return;
    }
    setValidationError(null);
    await executeSubmit(true);
  };

  const handleSkipAndSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      setValidationError('Please share your content niche before skipping.');
      return;
    }
    if (!platform) {
      setValidationError('Please select a platform before skipping.');
      return;
    }
    if (!struggle) {
      setValidationError('Please choose your biggest struggle before skipping.');
      return;
    }
    setValidationError(null);
    setFollowerCount('');
    setContentTried([]);
    setLanguage('');
    await executeSubmit(false);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const getDayLabel = (dayNum: number) => {
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    return days[(dayNum - 1) % 7];
  };

  const toggleAccordion = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 relative pb-24 md:pb-8">
      {/* Subtle Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-8 md:mb-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-brand-text-secondary hover:text-brand-accent transition-colors mb-3">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text-primary">
          Let&apos;s get your content flowing again
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1 max-w-md">
          Tell us where you are &mdash; we&apos;ll tell you what to post next.
        </p>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* Left Column - Form Card */}
        <div className="md:col-span-5 md:sticky md:top-24 space-y-6">
          {!result && (
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-md space-y-6">
              <form id="stuck-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION 1: Required Situation */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-1 border-b border-brand-border">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-accent">
                      Required Fields
                    </span>
                  </div>

                  {/* Niche Input */}
                  <div>
                    <label htmlFor="niche" className="block text-sm font-bold text-brand-text-primary mb-1.5">
                      Your Niche <span className="text-brand-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="niche"
                      value={niche}
                      onChange={(e) => {
                        setNiche(e.target.value);
                        if (e.target.value.trim()) setValidationError(null);
                      }}
                      placeholder="E.g. Tamil comedy, fitness, tech reviews..."
                      className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-surface-elevated text-brand-text-primary text-sm outline-none focus:border-brand-accent transition-all font-medium"
                    />
                  </div>

                  {/* Platform Selector pills */}
                  <div>
                    <span className="block text-sm font-bold text-brand-text-primary mb-2.5">
                      Platform Target <span className="text-brand-error">*</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {platformsList.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => {
                            setPlatform(p);
                            setValidationError(null);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            platform === p
                              ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm'
                              : 'border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Struggle Selector */}
                  <div>
                    <span className="block text-sm font-bold text-brand-text-primary mb-2.5">
                      Your Biggest Struggle <span className="text-brand-error">*</span>
                    </span>
                    <div className="flex flex-col gap-2">
                      {strugglesList.map((stg) => (
                        <button
                          type="button"
                          key={stg}
                          onClick={() => {
                            setStruggle(stg);
                            setValidationError(null);
                          }}
                          className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                            struggle === stg
                              ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm'
                              : 'border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary'
                          }`}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Optional Context */}
                <div className="space-y-5 pt-2 border-t border-brand-border">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-text-secondary">
                      Optional Context
                    </span>
                    <button
                      type="button"
                      onClick={handleSkipAndSubmit}
                      className="text-[10px] font-bold text-brand-accent hover:underline uppercase tracking-wide"
                    >
                      Skip &amp; Submit
                    </button>
                  </div>

                  {/* Follower Count */}
                  <div>
                    <span className="block text-xs font-bold text-brand-text-secondary mb-2 uppercase tracking-wider">
                      Follower Count
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {followersList.map((followers) => (
                        <button
                          type="button"
                          key={followers}
                          onClick={() => setFollowerCount(followerCount === followers ? '' : followers)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            followerCount === followers
                              ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm'
                              : 'border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary'
                          }`}
                        >
                          {followers}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Types of Content Tried */}
                  <div>
                    <span className="block text-xs font-bold text-brand-text-secondary mb-1 uppercase tracking-wider">
                      Content Formats Tried
                    </span>
                    <p className="text-[10px] text-brand-text-tertiary mb-2">Select all that apply</p>
                    <div className="flex flex-wrap gap-2">
                      {contentTypesList.map((type) => {
                        const isSelected = contentTried.includes(type);
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => handleToggleContentTried(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm'
                                : 'border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <span className="block text-xs font-bold text-brand-text-secondary mb-2 uppercase tracking-wider">
                      Language
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {languagesList.map((lang) => (
                        <button
                          type="button"
                          key={lang}
                          onClick={() => setLanguage(language === lang ? '' : lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            language === lang
                              ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm'
                              : 'border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop Submit Button */}
                <div className="pt-4 border-t border-brand-border hidden md:block">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-brand-accent text-brand-bg font-bold text-md hover:bg-brand-accent/90 transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-[0.99]"
                  >
                    Fix My Content &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Result view left-column actions */}
          {result && (
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-md space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/15">
                Audit Completed
              </span>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                Fix Plan Ready
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                Review your diagnosis, angles, templates, and the 7-day action plan on the right.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 rounded-xl bg-brand-surface border border-brand-border hover:bg-brand-surface-elevated text-xs font-bold text-brand-text-primary flex items-center justify-center gap-1.5 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.21" />
                </svg>
                <span>Edit parameters &amp; re-audit</span>
              </button>
            </div>
          )}

          {/* Sticky Mobile Button (fixed above Tab Bar) */}
          {!result && (
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-brand-bg/95 backdrop-blur-md p-4 border-t border-brand-border z-40 shadow-lg">
              <button
                type="submit"
                form="stuck-form"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-accent text-brand-bg font-bold text-sm hover:bg-brand-accent/90 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>Analyzing...</span>
                ) : (
                  <span>Fix My Content →</span>
                )}
              </button>
            </div>
          )}

          {/* Validation Error warning */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-brand-accent/5 border border-brand-accent/15 text-brand-accent text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}

          {/* Local Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20 text-brand-text-primary flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Audit failed.</span>
              </div>
              <p className="text-xs text-brand-error/90 font-mono break-words bg-brand-bg/45 p-2 rounded border border-brand-border">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Output / Placeholder */}
        <div className="md:col-span-7 space-y-8 min-h-[400px]">
          
          {/* Shimmer loading for diagnosis audit */}
          {loading && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Diagnosis shimmer */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 md:p-8 space-y-3">
                <div className="h-4 w-24 rounded bg-brand-surface-elevated animate-shimmer" />
                <div className="h-6 w-1/3 rounded bg-brand-surface-elevated animate-shimmer" />
                <div className="h-3.5 w-full rounded bg-brand-surface-elevated animate-shimmer" />
                <div className="h-3.5 w-4/5 rounded bg-brand-surface-elevated animate-shimmer" />
              </div>

              {/* Angles list shimmers */}
              <div className="space-y-4">
                <div className="h-6 w-32 rounded bg-brand-surface animate-shimmer" />
                {[1, 2].map((i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col gap-3">
                    <div className="h-4 w-20 rounded bg-brand-surface-elevated animate-shimmer" />
                    <div className="h-4 w-3/4 rounded bg-brand-surface-elevated animate-shimmer" />
                    <div className="h-3 w-1/2 rounded bg-brand-surface-elevated animate-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State placeholder */}
          {!loading && !result && (
            <div className="bg-brand-surface border border-brand-border border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] group hover:border-brand-accent/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-brand-surface-elevated border border-brand-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-text-tertiary group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
                Your content diagnosis will appear here
              </h3>
              <p className="text-xs text-brand-text-secondary max-w-sm leading-relaxed">
                Fill out the niche and struggle parameters on the left and click &ldquo;Fix My Content&rdquo; to analyze your engagement issues and generate a 7-day action plan.
              </p>
            </div>
          )}

          {/* Output Content */}
          {result && !loading && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-brand-text-primary">
                  🔍 Content Diagnosis &amp; Growth Kit
                </h2>
                <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-3 py-1.5 rounded-full border border-brand-accent/20 uppercase tracking-wider">
                  {platform} Audit
                </span>
              </div>

              {/* 1. Diagnosis Section */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-error bg-brand-error/10 px-2.5 py-0.5 rounded border border-brand-error/15">
                  Strategic Diagnosis
                </span>
                <h2 className="font-heading text-2xl font-bold text-brand-text-primary">
                  What&apos;s Actually Wrong
                </h2>
                <p className="text-sm text-brand-text-secondary leading-relaxed font-medium">
                  {result.diagnosis}
                </p>
              </div>

              {/* 2. 5 Trending Content Angles */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                  🔥 5 Trending Content Angles
                </h3>
                <div className="flex overflow-x-auto scroll-snap-x no-scrollbar md:grid md:grid-cols-1 gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                  {result.trendingAngles.map((angle, index) => {
                    const key = `angle-${index}`;
                    return (
                      <div 
                        key={index} 
                        className="scroll-snap-align-start w-[85vw] shrink-0 md:w-full bg-brand-surface border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5.5 h-5.5 rounded-full bg-brand-accent/15 border border-brand-accent/20 text-brand-accent flex items-center justify-center text-xs font-bold shrink-0">
                              {index + 1}
                            </span>
                            <h4 className="font-heading text-md font-bold text-brand-text-primary leading-snug">
                              {angle.angleName}
                            </h4>
                          </div>
                          <p className="text-xs text-brand-text-secondary italic">
                            Why it works: {angle.whyItWorks}
                          </p>
                          <p className="text-sm font-semibold text-brand-text-primary leading-relaxed bg-brand-surface-elevated/40 p-3 rounded-lg border border-brand-border">
                            Concept: {angle.examplePost}
                          </p>
                          <div className="bg-brand-accent/5 border border-brand-accent/15 p-3 rounded-lg mt-2 text-xs font-semibold text-brand-accent flex items-start gap-1">
                            <span className="font-bold shrink-0">Hook:</span>
                            <span>&ldquo;{angle.hook}&rdquo;</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end pt-1.5 border-t border-brand-border">
                          <button
                            onClick={() => copyToClipboard(angle.hook, key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                              copiedStates[key]
                                ? "bg-brand-success/10 border-brand-success text-brand-success"
                                : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                            }`}
                          >
                            {copiedStates[key] ? (
                              <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Copied ✓</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                <span>Copy Hook</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Full Script Card */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-brand-border">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    📝 Full Script Template
                  </h3>
                  
                  <button
                    onClick={() => {
                      const fullScriptText = `[HOOK]\n${result.fullScript.hook}\n\n[MIDDLE]\n${result.fullScript.middle}\n\n[CTA]\n${result.fullScript.cta}`;
                      copyToClipboard(fullScriptText, 'fullScript');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                      copiedStates['fullScript']
                        ? "bg-brand-success/10 border-brand-success text-brand-success"
                        : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                    }`}
                  >
                    {copiedStates['fullScript'] ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4 text-sm leading-relaxed">
                  <div className="p-3 bg-brand-accent/5 border border-brand-accent/15 rounded-xl">
                    <span className="block text-[9px] font-extrabold text-brand-accent uppercase tracking-wider mb-1">
                      1. Hook (Tanglish mix)
                    </span>
                    <p className="font-semibold text-brand-text-primary">&ldquo;{result.fullScript.hook}&rdquo;</p>
                  </div>
                  <div className="p-3 bg-brand-surface-elevated border border-brand-border rounded-xl">
                    <span className="block text-[9px] font-extrabold text-brand-text-secondary uppercase tracking-wider mb-1">
                      2. Middle Content
                    </span>
                    <p className="text-brand-text-secondary whitespace-pre-wrap">{result.fullScript.middle}</p>
                  </div>
                  <div className="p-3 bg-brand-accent/5 border border-brand-accent/15 rounded-xl">
                    <span className="block text-[9px] font-extrabold text-brand-accent uppercase tracking-wider mb-1">
                      3. Call to Action (CTA)
                    </span>
                    <p className="font-semibold text-brand-text-primary">&ldquo;{result.fullScript.cta}&rdquo;</p>
                  </div>
                </div>
              </div>

              {/* 4. Content Mix Recommendation */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                  📊 Strategic Content Mix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.contentMix.map((mix, index) => (
                    <div key={index} className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-heading text-2xl font-black text-brand-accent">
                            {mix.percentage}%
                          </span>
                          <span className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-wider">
                            {mix.type}
                          </span>
                        </div>
                        <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                          {mix.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Quick Win */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-brand-border">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    ⚡ Quick Win &mdash; Post This Today
                  </h3>
                  
                  <button
                    onClick={() => {
                      const quickWinText = `[FORMAT] ${result.quickWin.format}\n\n[HOOK]\n${result.quickWin.hook}\n\n[CAPTION]\n${result.quickWin.caption}\n\n[HASHTAGS]\n${result.quickWin.hashtags.join(' ')}`;
                      copyToClipboard(quickWinText, 'quickWin');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                      copiedStates['quickWin']
                        ? "bg-brand-success/10 border-brand-success text-brand-success"
                        : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                    }`}
                  >
                    {copiedStates['quickWin'] ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied ✓</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy Post</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-brand-surface-elevated border border-brand-border rounded-xl">
                      <span className="block text-[9px] font-extrabold uppercase text-brand-text-secondary tracking-wider">Format</span>
                      <span className="text-xs font-bold text-brand-text-primary">{result.quickWin.format}</span>
                    </div>
                    <div className="p-3 bg-brand-surface-elevated border border-brand-border rounded-xl">
                      <span className="block text-[9px] font-extrabold uppercase text-brand-text-secondary tracking-wider">Hook</span>
                      <span className="text-xs font-bold text-brand-text-primary truncate">&ldquo;{result.quickWin.hook}&rdquo;</span>
                    </div>
                  </div>
                  <div className="p-4 bg-brand-surface-elevated border border-brand-border rounded-xl">
                    <span className="block text-[9px] font-extrabold text-brand-text-secondary uppercase tracking-wider mb-1">
                      Caption
                    </span>
                    <p className="text-xs text-brand-text-secondary leading-relaxed whitespace-pre-wrap">{result.quickWin.caption}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.quickWin.hashtags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold text-brand-accent bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/15">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. 7-Day Content Plan Accordions */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                  📅 7-Day Action Content Plan
                </h3>
                
                <div className="space-y-2.5">
                  {result.sevenDayPlan.map((plan) => {
                    const isOpen = activeDay === plan.day;
                    return (
                      <div 
                        key={plan.day} 
                        className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-sm transition-all"
                      >
                        {/* Accordion Trigger Header */}
                        <button
                          type="button"
                          onClick={() => toggleAccordion(plan.day)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-brand-surface-elevated/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-heading text-sm font-extrabold text-brand-accent shrink-0">
                              {getDayLabel(plan.day)}
                            </span>
                            <div className="h-4 w-px bg-brand-border shrink-0" />
                            <span className="text-xs font-bold text-brand-text-primary truncate max-w-[150px] sm:max-w-xs">
                              {plan.postType}
                            </span>
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border bg-brand-surface-elevated text-brand-text-secondary border-brand-border">
                              {plan.format}
                            </span>
                          </div>
                          
                          {/* Chevron Icon */}
                          <svg 
                            className={`w-4 h-4 text-brand-text-secondary transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Accordion Expandable Body */}
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 border-t border-brand-border bg-brand-surface-elevated/20 animate-fade-in-up">
                            <div className="sm:hidden mb-2.5">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border bg-brand-surface-elevated text-brand-text-secondary border-brand-border">
                                Format: {plan.format}
                              </span>
                            </div>
                            <span className="block text-[9px] font-extrabold text-brand-text-tertiary uppercase tracking-wider mb-1">
                              Topic Strategy &amp; Idea
                            </span>
                            <p className="text-xs text-brand-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
                              {plan.topic}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
