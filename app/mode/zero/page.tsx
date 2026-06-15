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
    if (pot.includes('viral')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (pot.includes('high')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (pot.includes('medium')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-neutral-100 text-neutral-800 border-neutral-200';
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
            Let&apos;s find your content identity
          </h1>
          <p className="text-sm text-[#1C1917]/60 mt-1 max-w-md mx-auto">
            Answer a few questions &mdash; we&apos;ll build your creator roadmap.
          </p>
        </div>
      )}

      {/* Multi-step Form Container */}
      {!result && !loading && (
        <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 md:p-8 shadow-sm relative z-10 mb-10">
          {/* Progress Bar Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-brand-text/50 mb-2.5 uppercase tracking-wider">
              <span>Step {step} of 3</span>
              <span>
                {step === 1 && 'About You'}
                {step === 2 && 'Your Audience (Optional)'}
                {step === 3 && 'Your Availability (Optional)'}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-accent transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: About You */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Passion / Interests */}
                <div>
                  <label htmlFor="interests" className="block text-sm font-bold text-brand-text mb-1.5">
                    Your Interests / Passions <span className="text-red-500">*</span>
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
                    className="w-full p-3.5 rounded-xl border border-[#EADFC9] bg-[#FDF8F3]/40 text-brand-text text-sm outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                  />
                  <p className="text-xs text-[#1C1917]/50 mt-1.5">
                    List anything you enjoy &mdash; even random things.
                  </p>
                </div>

                {/* Content Style Pills */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Your Content Style <span className="text-red-500">*</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {stylesList.map((style) => (
                      <button
                        type="button"
                        key={style}
                        onClick={() => {
                          setContentStyle(style);
                          setValidationError(null);
                        }}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                          contentStyle === style
                            ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                            : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Platform Pills */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Target Platform <span className="text-red-500">*</span>
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

                {/* Next Button */}
                <div className="pt-4 border-t border-[#EADFC9]/30 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="py-3 px-6 rounded-xl bg-brand-accent text-white font-bold text-sm hover:bg-brand-accent/90 transition-all flex items-center gap-1 shadow-sm"
                  >
                    Next Step
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Audience (Optional) */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Target Audience Age */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Target Audience Age <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {ageGroupsList.map((age) => (
                      <button
                        type="button"
                        key={age}
                        onClick={() => setAudienceAge(audienceAge === age ? '' : age)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                          audienceAge === age
                            ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                            : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-bold text-brand-text mb-1.5">
                    Target Location <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g. Tamil Nadu, India / Pan India / Global"
                    className="w-full p-3.5 rounded-xl border border-[#EADFC9] bg-[#FDF8F3]/40 text-brand-text text-sm outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                  />
                </div>

                {/* Audience Language */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Audience Language <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
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

                {/* Nav Buttons */}
                <div className="pt-4 border-t border-[#EADFC9]/30 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 px-5 rounded-xl border border-[#EADFC9] text-[#1C1917]/70 font-bold text-sm hover:bg-neutral-50 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSkipStep2}
                      className="py-3 px-5 rounded-xl text-[#1C1917]/50 font-bold text-sm hover:text-brand-accent transition-all"
                    >
                      Skip Step
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="py-3 px-6 rounded-xl bg-brand-accent text-white font-bold text-sm hover:bg-brand-accent/90 transition-all flex items-center gap-1 shadow-sm"
                    >
                      Next Step
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Availability (Optional) */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Time Available Per Week */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Time Available Per Week <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {timeAvailableList.map((time) => (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setTimePerWeek(timePerWeek === time ? '' : time)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                          timePerWeek === time
                            ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                            : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Goal */}
                <div>
                  <span className="block text-sm font-bold text-brand-text mb-2.5">
                    Posts Per Week Goal <span className="text-xs text-[#1C1917]/40 font-normal ml-1">(Optional)</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {postsGoalList.map((goal) => (
                      <button
                        type="button"
                        key={goal}
                        onClick={() => setPostsPerWeek(postsPerWeek === goal ? '' : goal)}
                        className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                          postsPerWeek === goal
                            ? 'bg-brand-accent text-white border-brand-accent shadow-sm'
                            : 'border-[#EADFC9] bg-white text-brand-text hover:bg-brand-accent/5'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit / Nav Buttons */}
                <div className="pt-4 border-t border-[#EADFC9]/30 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="py-3 px-5 rounded-xl border border-[#EADFC9] text-[#1C1917]/70 font-bold text-sm hover:bg-neutral-50 transition-all flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="py-3.5 px-8 rounded-xl bg-brand-accent text-white font-bold text-sm hover:bg-brand-accent/90 transition-all shadow-md active:scale-[0.99] flex items-center gap-1.5"
                    >
                      Find My Niche &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Validation Warnings */}
          {validationError && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{validationError}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-[#EADFC9]/30 rounded-2xl shadow-sm relative z-10 animate-pulse">
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="font-heading text-lg font-bold text-brand-text">
            Building your creator identity...
          </p>
          <p className="text-xs text-[#1C1917]/50 mt-1.5 max-w-xs px-4">
            Analyzing your passions, creating content pillars, outlining roadmaps, and scheduling your calendar.
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

      {/* MODE 1 RESULTS OUTPUT */}
      {result && (
        <div className="space-y-8 animate-fade-in relative z-10 pb-16">
          {/* Header Actions */}
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
              {platform} Identity
            </span>
          </div>

          <hr className="border-[#EADFC9]/50" />

          {/* 1. Niche Section */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 md:p-8 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-md mb-3 inline-block">
              Your Primary Target Niche
            </span>
            <h2 className="font-heading text-3xl font-bold text-brand-text mb-3">
              🎯 {result.niche}
            </h2>
            <p className="text-md text-[#1C1917]/80 leading-relaxed mb-6 font-medium">
              {result.nicheDescription}
            </p>
            <div className="bg-[#FDF8F3] border border-[#EADFC9]/50 p-4 rounded-xl">
              <p className="text-sm text-[#1C1917]/70 leading-relaxed">
                <span className="font-bold text-brand-text">Why this suits you:</span> {result.nicheReason}
              </p>
            </div>
          </div>

          {/* 2. Content Pillars */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-text">
              🏛️ Content Pillars
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.contentPillars.map((pillar, index) => (
                <div key={index} className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="font-heading text-sm font-bold text-brand-accent block mb-2 uppercase tracking-wider">
                      Pillar {index + 1}
                    </span>
                    <h4 className="font-heading text-lg font-bold text-brand-text mb-2">
                      {pillar.name}
                    </h4>
                    <p className="text-xs text-[#1C1917]/65 leading-normal mb-5">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="border-t border-[#EADFC9]/30 pt-4 mt-auto">
                    <span className="block text-[10px] font-bold text-brand-text/50 uppercase mb-2 tracking-wider">
                      Concepts to post:
                    </span>
                    <ul className="space-y-1.5">
                      {pillar.examples.map((ex, i) => (
                        <li key={i} className="text-xs text-brand-text font-medium flex items-start gap-1.5">
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
            <h3 className="font-heading text-xl font-bold text-brand-text">
              💡 Your First 7 Post Ideas
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {result.firstSevenPosts.map((post, index) => (
                <div key={index} className="bg-white border border-[#EADFC9]/50 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-brand-accent/10 text-brand-accent border-brand-accent/20">
                        {post.format}
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getEngagementBadgeColor(post.engagementPotential)}`}>
                        {post.engagementPotential} Potential
                      </span>
                    </div>
                    <h4 className="font-heading text-md font-bold text-brand-text leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-xs text-[#1C1917]/70 leading-relaxed font-medium">
                      {post.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. First Hook */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                🪝 Your First Hook
              </h3>
              <p className="text-sm text-[#1C1917]/85 font-semibold italic">
                &ldquo;{result.firstHook}&rdquo;
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(result.firstHook, 'firstHook')}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/15 hover:border-brand-accent transition-all duration-200 shrink-0 self-end sm:self-center"
            >
              {copiedStates['firstHook'] ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-[#1C1917]/75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copy Hook</span>
                </>
              )}
            </button>
          </div>

          {/* 5. Posting Schedule */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm">
            <h3 className="font-heading text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
              📅 Recommended Posting Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
              <div className="p-4 bg-[#FDF8F3] rounded-xl border border-[#EADFC9]/40 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-[#1C1917]/40 tracking-wider mb-1">
                  Frequency
                </span>
                <span className="text-md font-bold text-brand-text">
                  {result.postingSchedule.frequency}
                </span>
              </div>
              <div className="p-4 bg-[#FDF8F3] rounded-xl border border-[#EADFC9]/40 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-[#1C1917]/40 tracking-wider mb-1">
                  Best Days
                </span>
                <span className="text-md font-bold text-brand-text">
                  {result.postingSchedule.bestDays.join(', ')}
                </span>
              </div>
              <div className="p-4 bg-[#FDF8F3] rounded-xl border border-[#EADFC9]/40 text-center">
                <span className="block text-[10px] font-extrabold uppercase text-[#1C1917]/40 tracking-wider mb-1">
                  Best Time
                </span>
                <span className="text-md font-bold text-brand-text">
                  {result.postingSchedule.bestTime}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#1C1917]/70 leading-relaxed italic bg-neutral-50 p-3 rounded-lg border border-neutral-100 font-medium">
              <span className="font-bold text-brand-text not-italic">Strategy:</span> {result.postingSchedule.reason}
            </p>
          </div>

          {/* 6. Roadmap */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-text">
              🚀 Your Creator Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm border-l-4 border-l-brand-accent">
                <span className="text-xs font-bold text-brand-accent block mb-2 uppercase tracking-wider">
                  Phase 1: Week 1-2
                </span>
                <h4 className="font-heading text-md font-bold text-brand-text mb-3">
                  Setup &amp; Foundations
                </h4>
                <p className="text-xs text-[#1C1917]/75 leading-relaxed font-medium">
                  {result.creatorRoadmap.week1to2}
                </p>
              </div>
              <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm border-l-4 border-l-brand-accent">
                <span className="text-xs font-bold text-brand-accent block mb-2 uppercase tracking-wider">
                  Phase 2: Week 3-4
                </span>
                <h4 className="font-heading text-md font-bold text-brand-text mb-3">
                  Establish Consistency
                </h4>
                <p className="text-xs text-[#1C1917]/75 leading-relaxed font-medium">
                  {result.creatorRoadmap.week3to4}
                </p>
              </div>
              <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm border-l-4 border-l-brand-accent">
                <span className="text-xs font-bold text-brand-accent block mb-2 uppercase tracking-wider">
                  Phase 3: Month 2+
                </span>
                <h4 className="font-heading text-md font-bold text-brand-text mb-3">
                  Growth &amp; Optimization
                </h4>
                <p className="text-xs text-[#1C1917]/75 leading-relaxed font-medium">
                  {result.creatorRoadmap.month2}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
