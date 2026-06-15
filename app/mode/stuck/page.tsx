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

  return (
    <div className="w-full max-w-4xl mx-auto px-1 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Page Header */}
      {!result && (
        <div className="mb-8 text-center relative z-10">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#1C1917]/50 hover:text-brand-accent transition-colors mb-3">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
            Let&apos;s get your content flowing again
          </h1>
          <p className="text-sm text-[#1C1917]/60 mt-1 max-w-md mx-auto">
            Tell us where you are &mdash; we&apos;ll tell you what to post next.
          </p>
        </div>
      )}

      {/* Form Section */}
      {!result && !loading && (
        <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 md:p-8 shadow-sm relative z-10 mb-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: Your Current Situation */}
            <div className="space-y-6">
              <h2 className="text-md font-bold text-brand-text/50 uppercase tracking-wider pb-2 border-b border-[#EADFC9]/30">
                Section 1 &mdash; Your Current Situation (Required)
              </h2>

              {/* Niche Input */}
              <div>
                <label htmlFor="niche" className="block text-sm font-bold text-brand-text mb-1.5">
                  Your Niche <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="niche"
                  value={niche}
                  onChange={(e) => {
                    setNiche(e.target.value);
                    if (e.target.value.trim()) setValidationError(null);
                  }}
                  placeholder="E.g. Tamil comedy, fitness, student life, tech reviews..."
                  className="w-full p-3.5 rounded-xl border border-[#EADFC9] bg-[#FDF8F3]/40 text-brand-text text-sm outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                />
              </div>

              {/* Platform Selector */}
              <div>
                <span className="block text-sm font-bold text-brand-text mb-2.5">
                  Platform Target <span className="text-red-500">*</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {platformsList.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => {
                        setPlatform(p);
                        setValidationError(null);
                      }}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                        platform === p
                          ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                          : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Struggle Selector */}
              <div>
                <span className="block text-sm font-bold text-brand-text mb-2.5">
                  Your Biggest Struggle <span className="text-red-500">*</span>
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
                          ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/40 shadow-xs'
                          : 'border-[#EADFC9]/60 bg-white text-brand-text hover:bg-brand-accent/5'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: More About You */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-[#EADFC9]/30 pb-2">
                <h2 className="text-md font-bold text-brand-text/50 uppercase tracking-wider">
                  Section 2 &mdash; More About You (Optional)
                </h2>
                <button
                  type="button"
                  onClick={handleSkipAndSubmit}
                  className="text-xs font-bold text-brand-accent hover:underline"
                >
                  Skip this section &amp; submit
                </button>
              </div>

              {/* Follower Count */}
              <div>
                <span className="block text-sm font-bold text-brand-text mb-2.5">
                  Current Follower Count <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {followersList.map((followers) => (
                    <button
                      type="button"
                      key={followers}
                      onClick={() => setFollowerCount(followerCount === followers ? '' : followers)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                        followerCount === followers
                          ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                          : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                      }`}
                    >
                      {followers}
                    </button>
                  ))}
                </div>
              </div>

              {/* Types of Content Tried */}
              <div>
                <span className="block text-sm font-bold text-brand-text mb-1">
                  Types of Content You&apos;ve Tried <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional &mdash; Multi-select)</span>
                </span>
                <p className="text-[11px] text-[#1C1917]/50 mb-2.5">Select all that apply to you</p>
                <div className="flex flex-wrap gap-2.5">
                  {contentTypesList.map((type) => {
                    const isSelected = contentTried.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => handleToggleContentTried(type)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                            : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Language */}
              <div>
                <span className="block text-sm font-bold text-brand-text mb-2.5">
                  Content Language <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {languagesList.map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => setLanguage(language === lang ? '' : lang)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                        language === lang
                          ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                          : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-[#EADFC9]/30">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold text-md hover:bg-brand-accent/90 transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                Fix My Content &rarr;
              </button>
            </div>
          </form>

          {/* Validation Warning */}
          {validationError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading Block */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#EADFC9]/30 rounded-2xl shadow-sm relative z-10 animate-pulse">
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="font-heading text-lg font-bold text-brand-text">
            Analyzing your content situation...
          </p>
          <p className="text-xs text-[#1C1917]/50 mt-1.5 max-w-xs px-4">
            Reviewing your struggle indicators, diagnostic trends, drafting post scripts, and preparing quick wins.
          </p>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col gap-1.5 relative z-10">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-sm">Something went wrong. Try again.</span>
          </div>
          <p className="text-xs text-red-600/90 ml-8 font-mono bg-red-100/50 p-2 rounded-lg border border-red-200/50">
            {error}
          </p>
          <button 
            onClick={() => setError(null)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold"
          >
            Clear
          </button>
        </div>
      )}

      {/* MODE 2 RESULTS OUTPUT */}
      {result && (
        <div className="space-y-8 animate-fade-in relative z-10 pb-16">
          
          {/* Header Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="inline-flex items-center text-xs font-semibold text-[#1C1917]/60 bg-white border border-[#EADFC9]/40 hover:text-brand-accent hover:border-brand-accent px-4 py-2 rounded-full transition-all shadow-xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Edit Inputs &amp; Re-generate
            </button>
            <span className="text-xs font-bold text-brand-accent/80 bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/20 uppercase tracking-wider">
              {platform} Audit
            </span>
          </div>

          <hr className="border-[#EADFC9]/50" />

          {/* 1. Niche & Diagnosis Section */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md mb-3 inline-block">
              Strategic Diagnosis
            </span>
            <h2 className="font-heading text-2xl font-bold text-brand-text mb-3">
              🔍 What&apos;s Actually Wrong
            </h2>
            <p className="text-sm md:text-md text-[#1C1917]/85 leading-relaxed font-medium">
              {result.diagnosis}
            </p>
          </div>

          {/* 2. 5 Trending Content Angles */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-text">
              🔥 5 Trending Content Angles
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {result.trendingAngles.map((angle, index) => {
                const key = `angle-${index}`;
                return (
                  <div key={index} className="bg-white border border-[#EADFC9]/50 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center text-[10px] font-extrabold shrink-0">
                          {index + 1}
                        </span>
                        <h4 className="font-heading text-md font-bold text-brand-text leading-snug">
                          {angle.angleName}
                        </h4>
                      </div>
                      <p className="text-xs text-[#1C1917]/50 italic">
                        Why it works: {angle.whyItWorks}
                      </p>
                      <p className="text-sm font-semibold text-brand-text leading-relaxed">
                        Concept: {angle.examplePost}
                      </p>
                      <div className="bg-[#FDF8F3] border border-[#EADFC9]/40 p-3 rounded-lg mt-2 text-xs font-semibold text-brand-accent flex items-start gap-1">
                        <span className="font-bold shrink-0">Hook:</span>
                        <span>&ldquo;{angle.hook}&rdquo;</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-1 border-t border-[#EADFC9]/20">
                      <button
                        onClick={() => copyToClipboard(angle.hook, key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/10 hover:border-brand-accent transition-all duration-200"
                      >
                        {copiedStates[key] ? (
                          <>
                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-emerald-600 font-bold">Copied Hook!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-[#1C1917]/75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

          {/* 3. Full Script */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADFC9]/30">
              <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                📝 Full Script for 1 Post
              </h3>
              
              {/* Copy Script trigger */}
              <button
                onClick={() => {
                  const fullScriptText = `[HOOK]\n${result.fullScript.hook}\n\n[MIDDLE]\n${result.fullScript.middle}\n\n[CTA]\n${result.fullScript.cta}`;
                  copyToClipboard(fullScriptText, 'fullScript');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/15 hover:border-brand-accent transition-all duration-200"
              >
                {copiedStates['fullScript'] ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-600 font-bold">Copied Script!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-[#1C1917]/75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy Full Script</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-3 bg-[#FDF8F3] border border-[#EADFC9]/30 rounded-xl">
                <span className="block text-[10px] font-extrabold text-brand-accent uppercase tracking-wider mb-1">
                  1. Hook
                </span>
                <p className="font-semibold text-brand-text">&ldquo;{result.fullScript.hook}&rdquo;</p>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl">
                <span className="block text-[10px] font-extrabold text-brand-text/50 uppercase tracking-wider mb-1">
                  2. Middle
                </span>
                <p className="text-brand-text/80 whitespace-pre-wrap">{result.fullScript.middle}</p>
              </div>
              <div className="p-3 bg-[#FDF8F3] border border-[#EADFC9]/30 rounded-xl">
                <span className="block text-[10px] font-extrabold text-brand-accent uppercase tracking-wider mb-1">
                  3. CTA
                </span>
                <p className="font-semibold text-brand-text">&ldquo;{result.fullScript.cta}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* 4. Content Mix Recommendation */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-text">
              📊 Content Mix Recommendation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.contentMix.map((mix, index) => (
                <div key={index} className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-heading text-2xl font-black text-brand-accent">
                        {mix.percentage}%
                      </span>
                      <span className="text-[10px] font-bold text-brand-text/40 uppercase tracking-wider">
                        {mix.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#1C1917]/70 leading-relaxed font-medium">
                      {mix.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Quick Win */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADFC9]/30">
              <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                ⚡ Quick Win &mdash; Post This Today
              </h3>
              
              {/* Copy all quick win trigger */}
              <button
                onClick={() => {
                  const quickWinText = `[FORMAT] ${result.quickWin.format}\n\n[HOOK]\n${result.quickWin.hook}\n\n[CAPTION]\n${result.quickWin.caption}\n\n[HASHTAGS]\n${result.quickWin.hashtags.join(' ')}`;
                  copyToClipboard(quickWinText, 'quickWin');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/15 hover:border-brand-accent transition-all duration-200"
              >
                {copiedStates['quickWin'] ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-emerald-600 font-bold">Copied Post!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-[#1C1917]/75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy All</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#FDF8F3]/50 border border-[#EADFC9]/30 rounded-xl">
                  <span className="block text-[10px] font-extrabold uppercase text-[#1C1917]/40 tracking-wider">Format</span>
                  <span className="text-xs font-bold text-brand-text">{result.quickWin.format}</span>
                </div>
                <div className="p-3 bg-[#FDF8F3]/50 border border-[#EADFC9]/30 rounded-xl">
                  <span className="block text-[10px] font-extrabold uppercase text-[#1C1917]/40 tracking-wider">Hook</span>
                  <span className="text-xs font-bold text-brand-text truncate">&ldquo;{result.quickWin.hook}&rdquo;</span>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-xl">
                <span className="block text-[10px] font-extrabold text-brand-text/50 uppercase tracking-wider mb-1">
                  Caption
                </span>
                <p className="text-xs text-brand-text/85 leading-relaxed whitespace-pre-wrap">{result.quickWin.caption}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.quickWin.hashtags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-semibold text-brand-accent bg-brand-accent/5 px-2 py-0.5 rounded border border-brand-accent/10">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 6. 7-Day Content Plan */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-text">
              📅 7-Day Content Plan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
              {result.sevenDayPlan.map((plan) => (
                <div key={plan.day} className="bg-white border border-[#EADFC9]/50 rounded-xl p-4 shadow-xs flex flex-col justify-between border-t-4 border-t-brand-accent">
                  <div>
                    <span className="font-heading text-xs font-extrabold text-brand-accent block mb-2 tracking-wider">
                      {getDayLabel(plan.day)}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border bg-neutral-50 text-brand-text/70 border-neutral-200 mb-2">
                      {plan.format}
                    </span>
                    <h5 className="font-heading text-xs font-bold text-brand-text mb-1 leading-snug">
                      {plan.postType}
                    </h5>
                    <p className="text-[10px] text-[#1C1917]/65 leading-relaxed font-medium">
                      {plan.topic}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
