'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContentPillar {
  name: string;
  description: string;
  examples: string[];
}

interface PostIdea {
  title: string;
  format: string;
  description: string;
  engagementPotential: string;
}

interface NicheRoadmapResult {
  niche: string;
  nicheDescription: string;
  nicheReason: string;
  contentPillars: ContentPillar[];
  firstSevenPosts: PostIdea[];
  firstHook: string;
  postingSchedule: {
    frequency: string;
    bestDays: string[];
    bestTime: string;
    reason: string;
  };
  creatorRoadmap: {
    week1to2: string;
    week3to4: string;
    month2: string;
  };
}

export default function ModeZeroPage() {
  // Form step
  const [step, setStep] = useState(1);

  // Form inputs
  const [interests, setInterests] = useState('');
  const [contentStyle, setContentStyle] = useState('');
  const [platform, setPlatform] = useState('');
  
  // Optional Step 2
  const [audienceAge, setAudienceAge] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  
  // Optional Step 3
  const [timePerWeek, setTimePerWeek] = useState('');
  const [postsPerWeek, setPostsPerWeek] = useState('');

  // Flow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<NicheRoadmapResult | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Options lists
  const stylesList = [
    '😂 Funny & Relatable',
    '🎓 Educational',
    '💪 Motivational',
    '🎭 Storytelling',
    '😱 Controversial / Bold',
    '🎨 Creative / Aesthetic'
  ];

  const platformsList = ['Instagram', 'YouTube', 'LinkedIn', 'TikTok', 'Twitter/X'];
  const ageGroupsList = ['13–17', '18–24', '25–34', '35+'];
  const languagesList = ['Tamil', 'Tanglish', 'Hindi', 'English', 'Mixed'];
  const timeAvailableList = ['1–2 hrs', '3–5 hrs', '5–10 hrs', '10+ hrs'];
  const postsGoalList = ['1', '2–3', '4–5', 'Daily'];

  const handleNextStep1 = () => {
    if (!interests.trim()) {
      setValidationError('Please share your interests or passions.');
      return;
    }
    if (!contentStyle) {
      setValidationError('Please select a content style.');
      return;
    }
    if (!platform) {
      setValidationError('Please select a target platform.');
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleSkipStep2 = () => {
    setAudienceAge('');
    setLocation('');
    setLanguage('');
    setStep(3);
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setStep((prev) => prev - 1);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-niche', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests: interests.trim(),
          contentStyle,
          platform,
          audienceAge: audienceAge || undefined,
          location: location.trim() || undefined,
          language: language || undefined,
          timePerWeek: timePerWeek || undefined,
          postsPerWeek: postsPerWeek || undefined,
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

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStep(1);
  };

  const getEngagementBadgeColor = (potential: string) => {
    const pot = potential.toLowerCase();
    if (pot.includes('viral')) return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
    if (pot.includes('high')) return 'bg-brand-accent/10 text-brand-accent-dark border-brand-accent/20';
    if (pot.includes('medium')) return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    return 'bg-brand-surface-elevated text-brand-text-secondary border-brand-border';
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 relative pb-24 md:pb-8 pt-6">
      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* Left Column - Form Card */}
        <div className="md:col-span-5 md:sticky md:top-[80px] space-y-6">
          {!result && (
            <div className="bg-brand-surface border border-brand-border rounded-[20px] p-5 md:p-8 shadow-card transition-all duration-brand">
              
              {/* Progress indicator */}
              <div className="mb-6">
                <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[12px] text-brand-text-tertiary mt-2">
                  <span>Step {step} of 3</span>
                  <span className="text-brand-accent font-semibold">
                    {step === 1 && 'About You'}
                    {step === 2 && 'Audience'}
                    {step === 3 && 'Availability'}
                  </span>
                </div>
              </div>

              {/* Page Heading breadcrumb */}
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-sans text-brand-text-tertiary hover:text-brand-accent transition-colors mb-3">
                  ← Back to Home
                </Link>
                <h1 className="font-heading text-[28px] font-bold text-brand-text-primary leading-tight">
                  Find your identity
                </h1>
                <p className="text-sm text-brand-text-secondary mt-1">
                  Answer a few questions &mdash; we&apos;ll build your creator roadmap.
                </p>
              </div>

              <form id="niche-form" onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: About You */}
                {step === 1 && (
                  <div className="space-y-6">
                    {/* Passion / Interests */}
                    <div>
                      <label htmlFor="interests" className="block text-[13px] font-medium text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                        Your Interests / Passions <span className="text-brand-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="interests"
                        value={interests}
                        onChange={(e) => {
                          setInterests(e.target.value);
                          if (e.target.value.trim()) setValidationError(null);
                        }}
                        placeholder="E.g. football, cooking, tech, comedy, fitness..."
                        className="w-full p-3.5 rounded-[12px] border border-brand-border bg-brand-bg text-brand-text-primary placeholder-brand-text-tertiary text-[15px] outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/12 transition-all font-sans"
                      />
                      <p className="text-xs text-brand-text-secondary mt-1.5">
                        List anything you enjoy &mdash; even random things.
                      </p>
                    </div>

                    {/* Content Style Pills */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Your Content Style <span className="text-brand-accent">*</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {stylesList.map((style) => (
                          <button
                            type="button"
                            key={style}
                            onClick={() => {
                              setContentStyle(style);
                              setValidationError(null);
                            }}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              contentStyle === style
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Platform Pills */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Target Platform <span className="text-brand-accent">*</span>
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
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              platform === p
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Next Button */}
                    <div className="pt-4 border-t border-brand-border hidden md:flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep1}
                        className="py-2.5 px-5 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-sm hover:bg-brand-accent-dark hover:shadow-button transition-all duration-brand flex items-center gap-1"
                      >
                        Next Step
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Audience */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Audience Age */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Target Audience Age <span className="text-xs text-brand-text-tertiary font-normal italic lowercase ml-1">(Optional)</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ageGroupsList.map((age) => (
                          <button
                            type="button"
                            key={age}
                            onClick={() => setAudienceAge(audienceAge === age ? '' : age)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              audienceAge === age
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-[13px] font-medium text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                        Target Location <span className="text-xs text-brand-text-tertiary font-normal italic lowercase ml-1">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="E.g. Tamil Nadu, India / Pan India"
                        className="w-full p-3.5 rounded-[12px] border border-brand-border bg-brand-bg text-brand-text-primary placeholder-brand-text-tertiary text-[15px] outline-none focus:border-brand-accent transition-all font-sans"
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Audience Language <span className="text-xs text-brand-text-tertiary font-normal italic lowercase ml-1">(Optional)</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {languagesList.map((lang) => (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => setLanguage(language === lang ? '' : lang)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              language === lang
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Nav Buttons */}
                    <div className="pt-4 border-t border-brand-border hidden md:flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2 px-4 rounded-[14px] border border-brand-border text-brand-text-secondary font-bold text-xs hover:text-brand-text-primary transition-all duration-brand flex items-center gap-1"
                      >
                        Back
                      </button>
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={handleSkipStep2}
                          className="py-2 px-4 rounded-[14px] text-brand-text-secondary hover:text-brand-accent text-xs font-bold transition-all duration-brand"
                        >
                          Skip
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep2}
                          className="py-2.5 px-5 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-xs hover:bg-brand-accent-dark hover:shadow-button transition-all duration-brand flex items-center gap-1 shadow-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Availability */}
                {step === 3 && (
                  <div className="space-y-6">
                    {/* Time Available */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Time Available Per Week <span className="text-xs text-brand-text-tertiary font-normal italic lowercase ml-1">(Optional)</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {timeAvailableList.map((time) => (
                          <button
                            type="button"
                            key={time}
                            onClick={() => setTimePerWeek(timePerWeek === time ? '' : time)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              timePerWeek === time
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Posts Goal */}
                    <div>
                      <span className="block text-[13px] font-medium text-brand-text-secondary mb-2.5 uppercase tracking-wider">
                        Posts Per Week Goal <span className="text-xs text-brand-text-tertiary font-normal italic lowercase ml-1">(Optional)</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {postsGoalList.map((goal) => (
                          <button
                            type="button"
                            key={goal}
                            onClick={() => setPostsPerWeek(postsPerWeek === goal ? '' : goal)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                              postsPerWeek === goal
                                ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                                : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Submit / Nav Buttons */}
                    <div className="pt-4 border-t border-brand-border hidden md:flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2 px-4 rounded-[14px] border border-brand-border text-brand-text-secondary font-bold text-xs hover:text-brand-text-primary transition-all duration-brand flex items-center gap-1"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="py-3 px-6 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-xs hover:bg-brand-accent-dark hover:shadow-button transition-all duration-brand flex items-center gap-1 shadow-md"
                      >
                        Find My Niche →
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Result view left-column action card */}
          {result && (
            <div className="bg-brand-surface border border-brand-border rounded-[20px] p-6 shadow-card space-y-4 transition-all duration-brand">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#92400E] bg-brand-amber-soft px-2.5 py-0.5 rounded border border-brand-accent-light">
                Setup Complete
              </span>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                Your Niche &amp; Roadmap
              </h3>
              <p className="text-xs text-brand-text-secondary leading-relaxed">
                We generated a full creator strategy based on your interest: &ldquo;{interests}&rdquo; and styling choice.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 px-4 rounded-[14px] bg-brand-surface border border-brand-border hover:bg-brand-surface-elevated text-xs font-bold text-brand-text-primary flex items-center justify-center gap-1.5 transition-all duration-brand"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.21" />
                </svg>
                <span>Edit inputs &amp; start over</span>
              </button>
            </div>
          )}

          {/* Local validation warning */}
          {validationError && (
            <div className="p-3.5 rounded-[12px] bg-brand-accent/5 border border-brand-accent/15 text-brand-accent text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}

          {/* Local Error State */}
          {error && (
            <div className="p-4 rounded-[20px] bg-brand-error/10 border border-brand-error/20 text-brand-text-primary flex flex-col gap-1.5 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Failed to generate identity.</span>
              </div>
              <p className="text-xs font-mono break-words bg-brand-surface p-2 rounded border border-brand-border">
                {error}
              </p>
            </div>
          )}

          {/* Mobile Sticky Navigation (fixed above Tab Bar) */}
          {!result && (
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-brand-bg/95 backdrop-blur-md p-3 border-t border-brand-border z-40 flex gap-3 shadow-elevated">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 rounded-[14px] border border-brand-border bg-brand-surface text-brand-text-primary text-xs font-bold active:scale-[0.99]"
                >
                  Back
                </button>
              )}
              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="flex-1 py-3 px-6 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-sm hover:bg-brand-accent-dark hover:shadow-button transition-all active:scale-[0.99] shadow-sm"
                >
                  Next Step
                </button>
              )}
              {step === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handleSkipStep2}
                    className="px-4 rounded-[14px] border border-brand-border text-brand-text-secondary text-xs font-bold active:scale-[0.99]"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="flex-1 py-3 px-6 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-sm hover:bg-brand-accent-dark hover:shadow-button transition-all active:scale-[0.99] shadow-sm"
                  >
                    Next Step
                  </button>
                </>
              )}
              {step === 3 && (
                <button
                  type="submit"
                  form="niche-form"
                  disabled={loading}
                  className="flex-1 h-14 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-sm hover:bg-brand-accent-dark hover:shadow-button transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <span>Find My Niche →</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Output / Placeholder */}
        <div className="md:col-span-7 space-y-8 min-h-[400px]">
          
          {/* Shimmer loading for identity roadmap */}
          {loading && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Primary target niche shimmer */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 md:p-8 space-y-3 shadow-card">
                <div className="h-4 w-24 rounded bg-brand-border animate-shimmer" />
                <div className="h-6 w-1/2 rounded bg-brand-border animate-shimmer" style={{ animationDelay: '100ms' }} />
                <div className="h-4 w-full rounded bg-brand-border animate-shimmer" style={{ animationDelay: '200ms' }} />
                <div className="h-4 w-5/6 rounded bg-brand-border animate-shimmer" style={{ animationDelay: '300ms' }} />
              </div>

              {/* Pillars shimmers */}
              <div className="space-y-4">
                <div className="h-6 w-28 rounded bg-brand-border animate-shimmer" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 h-48 flex flex-col justify-between shadow-card">
                      <div className="space-y-2">
                        <div className="h-4 w-12 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />
                        <div className="h-4 w-20 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                        <div className="h-3 w-full rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State placeholder */}
          {!loading && !result && (
            <div className="bg-brand-surface border border-brand-border border-dashed rounded-[20px] p-8 text-center flex flex-col items-center justify-center min-h-[400px] group hover:border-brand-accent/30 transition-all duration-brand shadow-card">
              <div className="w-16 h-16 rounded-full bg-brand-amber-soft flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-brand">
                <svg className="w-8 h-8 text-brand-text-tertiary group-hover:text-brand-accent transition-colors duration-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a6 6 0 015.96 5.96z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
                Your creator identity will appear here
              </h3>
              <p className="text-xs text-brand-text-secondary max-w-sm leading-relaxed">
                Complete the 3 setup steps on the left and click &ldquo;Find My Niche&rdquo; to build your personalized creator roadmap and initial content plan.
              </p>
            </div>
          )}

          {/* Results Output */}
          {result && !loading && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Output Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-brand-text-primary">
                  🎯 Creator Strategy Roadmap
                </h2>
                <span className="text-[10px] font-bold text-brand-accent bg-brand-amber-soft px-3 py-1 rounded-full border border-brand-accent-light uppercase tracking-wider">
                  {platform} Identity
                </span>
              </div>

              {/* 1. Primary Niche Card */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 md:p-8 shadow-card space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-text-tertiary">
                    Your Primary Target Niche
                  </span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-text-primary">
                  {result.niche}
                </h2>
                <p className="text-sm text-brand-text-secondary leading-relaxed font-medium">
                  {result.nicheDescription}
                </p>
                <div className="bg-brand-surface-elevated border border-brand-border p-4 rounded-xl">
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    <span className="font-bold text-brand-text-primary">Niche Rationale:</span> {result.nicheReason}
                  </p>
                </div>
              </div>

              {/* 2. Content Pillars */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                    Core Content Pillars
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {result.contentPillars.map((pillar, index) => (
                    <div key={index} className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card flex flex-col justify-between">
                      <div>
                        <span className="font-heading text-[10px] font-bold text-brand-accent block mb-1 uppercase tracking-wider">
                          Pillar {index + 1}
                        </span>
                        <h4 className="font-heading text-md font-bold text-brand-text-primary mb-2">
                          {pillar.name}
                        </h4>
                        <p className="text-xs text-brand-text-secondary leading-normal mb-5">
                          {pillar.description}
                        </p>
                      </div>
                      <div className="border-t border-brand-border pt-4 mt-auto">
                        <span className="block text-[9px] font-bold text-brand-text-secondary uppercase mb-2 tracking-wider">
                          Pillar Concepts:
                        </span>
                        <ul className="space-y-1.5">
                          {pillar.examples.map((ex, i) => (
                            <li key={i} className="text-xs text-brand-text-primary font-medium flex items-start gap-1.5">
                              <span className="text-brand-accent shrink-0 font-bold">&bull;</span>
                              <span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. First 7 Post Ideas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                    Your Initial 7-Post Kickstart
                  </h3>
                </div>
                
                {/* Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="flex overflow-x-auto scroll-snap-x no-scrollbar md:grid md:grid-cols-1 gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                  {result.firstSevenPosts.map((post, index) => (
                    <div 
                      key={index} 
                      className="scroll-snap-align-start w-[80vw] shrink-0 md:w-full bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-5 shadow-card flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5.5 h-5.5 rounded-full bg-brand-accent/15 border border-brand-accent/20 text-brand-accent flex items-center justify-center text-xs font-bold shrink-0">
                            {index + 1}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-[8px] text-[9px] font-extrabold uppercase tracking-wider border bg-brand-surface-elevated text-brand-text-primary border-brand-border">
                            {post.format}
                          </span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-[8px] text-[9px] font-extrabold uppercase tracking-wider border ${getEngagementBadgeColor(post.engagementPotential)}`}>
                            {post.engagementPotential}
                          </span>
                        </div>
                        <h4 className="font-heading text-md font-bold text-brand-text-primary leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                          {post.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. First Hook Card */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-text-tertiary">First Post Hook Concept (Tanglish Mix)</span>
                  </div>
                  <p className="font-mono text-sm text-brand-text-primary font-semibold italic">
                    &ldquo;{result.firstHook}&rdquo;
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(result.firstHook, 'firstHook')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 shrink-0 self-end sm:self-center ${
                    copiedStates['firstHook']
                      ? "bg-brand-success/10 border-brand-success text-brand-success"
                      : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent"
                  }`}
                >
                  {copiedStates['firstHook'] ? (
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
                      <span>Copy Hook</span>
                    </>
                  )}
                </button>
              </div>

              {/* 5. Recommended Posting Schedule */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card">
                <h3 className="font-heading text-md font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                  📅 Recommended Posting Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                  <div className="p-4 bg-brand-surface-elevated rounded-xl border border-brand-border text-center">
                    <span className="block text-[9px] font-extrabold uppercase text-brand-text-secondary tracking-wider mb-1">
                      Frequency
                    </span>
                    <span className="text-md font-bold text-brand-accent">
                      {result.postingSchedule.frequency}
                    </span>
                  </div>
                  <div className="p-4 bg-brand-surface-elevated rounded-xl border border-brand-border text-center">
                    <span className="block text-[9px] font-extrabold uppercase text-brand-text-secondary tracking-wider mb-1">
                      Best Days
                    </span>
                    <span className="text-md font-bold text-brand-text-primary">
                      {result.postingSchedule.bestDays.join(', ')}
                    </span>
                  </div>
                  <div className="p-4 bg-brand-surface-elevated rounded-xl border border-brand-border text-center">
                    <span className="block text-[9px] font-extrabold uppercase text-brand-text-secondary tracking-wider mb-1">
                      Best Time
                    </span>
                    <span className="text-md font-bold text-brand-text-primary">
                      {result.postingSchedule.bestTime}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-brand-text-secondary leading-relaxed italic bg-brand-surface-elevated p-3 rounded-lg border border-brand-border font-medium">
                  <span className="font-bold text-brand-text-primary not-italic">Strategy:</span> {result.postingSchedule.reason}
                </p>
              </div>

              {/* 6. Roadmap */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-brand-text-primary">
                  🚀 Your Creator Roadmap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-brand-surface border border-brand-border rounded-[20px] p-6 shadow-card border-l-[3px] border-l-brand-accent">
                    <span className="text-[10px] font-bold text-brand-accent block mb-1.5 uppercase tracking-wider">
                      Phase 1: Week 1-2
                    </span>
                    <h4 className="font-heading text-sm font-bold text-brand-text-primary mb-3">
                      Setup &amp; Foundations
                    </h4>
                    <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                      {result.creatorRoadmap.week1to2}
                    </p>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-[20px] p-6 shadow-card border-l-[3px] border-l-brand-accent">
                    <span className="text-[10px] font-bold text-brand-accent block mb-1.5 uppercase tracking-wider">
                      Phase 2: Week 3-4
                    </span>
                    <h4 className="font-heading text-sm font-bold text-brand-text-primary mb-3">
                      Establish Consistency
                    </h4>
                    <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                      {result.creatorRoadmap.week3to4}
                    </p>
                  </div>
                  <div className="bg-brand-surface border border-brand-border rounded-[20px] p-6 shadow-card border-l-[3px] border-l-brand-accent">
                    <span className="text-[10px] font-bold text-brand-accent block mb-1.5 uppercase tracking-wider">
                      Phase 3: Month 2+
                    </span>
                    <h4 className="font-heading text-sm font-bold text-brand-text-primary mb-3">
                      Growth &amp; Optimization
                    </h4>
                    <p className="text-xs text-brand-text-secondary leading-relaxed font-medium">
                      {result.creatorRoadmap.month2}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
