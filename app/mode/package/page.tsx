'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContentPackageResult {
  hooks: string[];
  caption: string;
  hashtags: string[];
  bestTimeToPost: {
    time: string;
    reason: string;
  };
  thumbnailBrief: string;
  engagementScore: number;
  engagementReason: string;
}

export default function PackageModePage() {
  const [contentIdea, setContentIdea] = useState('');
  const [platform, setPlatform] = useState('Instagram Reels');
  const [tone, setTone] = useState('Funny');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentPackageResult | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const [editedBrief, setEditedBrief] = useState('');
  const [aspectRatio, setAspectRatio] = useState('Auto');
  const [thumbLoading, setThumbLoading] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [resolvedRatio, setResolvedRatio] = useState('');
  const [resolvedDimensions, setResolvedDimensions] = useState('');

  const generateThumbnail = async () => {
    setThumbLoading(true);
    setThumbError(null);
    try {
      const response = await fetch('/api/thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thumbnailBrief: editedBrief,
          platform,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        let errMsg = 'Failed to generate thumbnail. Try again.';
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
      setThumbUrl(data.image);
      setResolvedRatio(data.resolvedRatio);
      setResolvedDimensions(data.dimensions);
    } catch (err: unknown) {
      setThumbError(err instanceof Error ? err.message : 'Failed to generate thumbnail. Try again.');
    } finally {
      setThumbLoading(false);
    }
  };

  const downloadImage = (base64Url: string) => {
    setCopiedStates((prev) => ({ ...prev, download: true }));
    const a = document.createElement('a');
    a.href = base64Url;
    a.download = `contentlab-thumbnail.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, download: false }));
    }, 2000);
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

  const copyAllHashtags = () => {
    if (result?.hashtags) {
      copyToClipboard(result.hashtags.join(' '), 'hashtags');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentIdea(e.target.value);
    if (e.target.value.trim().length > 0) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validation check
    if (!contentIdea.trim()) {
      setValidationError('Please describe your content idea to generate a package.');
      return;
    }

    setValidationError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentIdea: contentIdea.trim(),
          platform,
          tone,
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
      setEditedBrief(data.thumbnailBrief);
      setThumbUrl(null);
      setThumbError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Instagram Reels':
        return (
          <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'YouTube Shorts':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
          </svg>
        );
      case 'Twitter/X':
        return (
          <svg className="w-5 h-5 text-brand-text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg className="w-5 h-5 text-brand-text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.5-4.13-1.25-.49-.3-1-.67-1.4-1.12v7.1c.02 2.08-.66 4.16-2.06 5.67-1.5 1.62-3.8 2.56-6.02 2.47-2.67-.1-5.18-1.74-6.38-4.12C1.1 16.2 1.37 13 3.1 10.97c1.5-1.8 3.96-2.73 6.27-2.43v4.18c-1.32-.23-2.75.14-3.6 1.15-.82.97-.93 2.44-.27 3.49.77 1.23 2.31 1.83 3.7 1.54 1.34-.28 2.33-1.42 2.33-2.8V.02h1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getHookBadgeStyle = (index: number) => {
    const styles = [
      { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Curiosity Hook' },
      { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Emotional Hook' },
      { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Contrarian Hook' },
      { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Storytelling Hook' },
      { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Authority Hook' },
    ];
    return styles[index % styles.length];
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
          Package your content
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1 max-w-md">
          Convert your draft content ideas into ready-to-post packages optimized for engagement.
        </p>
      </div>

      {/* Two-Column Grid (Form on Left, Output on Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* Left Column - Form Card (40% width / 5 Cols) */}
        <div className="md:col-span-5 md:sticky md:top-24 space-y-6">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-md">
            <form id="package-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Content Idea Area */}
              <div>
                <label htmlFor="contentIdea" className="block text-sm font-bold text-brand-text-primary mb-2">
                  Describe your content idea <span className="text-brand-error">*</span>
                </label>
                <textarea
                  id="contentIdea"
                  rows={5}
                  value={contentIdea}
                  onChange={handleInputChange}
                  placeholder="E.g. Making a reel about college exam panic. Tamil comedy. 30 seconds."
                  className={`w-full p-4 rounded-xl border ${
                    validationError ? 'border-brand-error ring-1 ring-brand-error/30' : 'border-brand-border focus:border-brand-accent'
                  } bg-brand-surface-elevated text-brand-text-primary placeholder-brand-text-tertiary text-sm outline-none transition-all resize-y`}
                />
                {validationError && (
                  <p className="mt-2 text-xs font-semibold text-brand-error flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {validationError}
                  </p>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label htmlFor="platform" className="block text-sm font-bold text-brand-text-primary mb-2">
                  Platform Target
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-surface-elevated text-brand-text-primary text-sm outline-none focus:border-brand-accent transition-all cursor-pointer"
                >
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="YouTube">YouTube</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              {/* Tone Selector */}
              <div>
                <label htmlFor="tone" className="block text-sm font-bold text-brand-text-primary mb-2">
                  Desired Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-surface-elevated text-brand-text-primary text-sm outline-none focus:border-brand-accent transition-all cursor-pointer"
                >
                  <option value="Funny">Funny</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Educational">Educational</option>
                  <option value="Emotional">Emotional</option>
                  <option value="Controversial">Controversial</option>
                </select>
              </div>

              {/* Submit Button (Hidden on Mobile, visible on desktop) */}
              <button
                type="submit"
                disabled={loading}
                className="hidden md:flex w-full py-4 rounded-xl bg-brand-accent text-brand-bg font-bold text-md hover:bg-brand-accent/90 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>Generate Package</span>
                )}
              </button>
            </form>
          </div>

          {/* Sticky Mobile Button (fixed above Tab Bar) */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-brand-bg/90 backdrop-blur-md p-4 border-t border-brand-border z-40">
            <button
              type="submit"
              form="package-form"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-accent text-brand-bg font-bold text-sm hover:bg-brand-accent/90 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 text-brand-bg animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Generate Package</span>
              )}
            </button>
          </div>

          {/* Local Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20 text-brand-text-primary flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Generation failed.</span>
              </div>
              <p className="text-xs text-brand-error/90 font-mono break-words leading-normal bg-brand-bg/40 p-2.5 rounded-lg border border-brand-border">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Output & Shimmers (60% width / 7 Cols) */}
        <div className="md:col-span-7 space-y-8 min-h-[400px]">
          
          {/* 1. Loading Shimmers */}
          {loading && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Header Shimmer */}
              <div className="h-8 w-48 rounded bg-brand-surface animate-shimmer" />

              {/* Hook list Shimmer */}
              <div className="space-y-4">
                <div className="h-6 w-32 rounded bg-brand-surface animate-shimmer" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="h-4 w-16 rounded bg-brand-surface-elevated animate-shimmer" />
                      <div className="h-4 w-3/4 rounded bg-brand-surface-elevated animate-shimmer" />
                    </div>
                    <div className="h-8 w-16 rounded-lg bg-brand-surface-elevated animate-shimmer shrink-0" />
                  </div>
                ))}
              </div>

              {/* Grid cards Shimmer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-6 h-48 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-5 w-24 rounded bg-brand-surface-elevated animate-shimmer" />
                      <div className="h-3 w-full rounded bg-brand-surface-elevated animate-shimmer" />
                      <div className="h-3 w-5/6 rounded bg-brand-surface-elevated animate-shimmer" />
                    </div>
                    <div className="h-8 w-24 rounded-lg bg-brand-surface-elevated animate-shimmer self-end" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Empty State Placeholder */}
          {!loading && !result && (
            <div className="bg-brand-surface border border-brand-border border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] group hover:border-brand-accent/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-brand-surface-elevated border border-brand-border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-text-tertiary group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-2">
                Your content package will appear here
              </h3>
              <p className="text-xs text-brand-text-secondary max-w-sm leading-relaxed">
                Fill out the details in the form on the left and click &ldquo;Generate Package&rdquo; to build hooks, captions, and templates.
              </p>
            </div>
          )}

          {/* 3. Output Content */}
          {result && !loading && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Output Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-brand-text-primary">
                  📦 Your Content Package
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-text-secondary bg-brand-surface border border-brand-border px-3 py-1.5 rounded-full">
                  <span>Platform:</span>
                  <span className="text-brand-text-primary font-bold flex items-center gap-1.5">
                    {getPlatformIcon(platform)} {platform}
                  </span>
                </div>
              </div>

              {/* Hooks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    🪝 Hook Variations
                  </h3>
                  <span className="text-[10px] text-brand-text-secondary font-medium uppercase tracking-wider">Tap to copy hook variation</span>
                </div>
                
                {/* Mobile Scroll-Snap Carousel vs Desktop Grid Stack */}
                <div className="flex overflow-x-auto scroll-snap-x no-scrollbar md:grid md:grid-cols-1 gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                  {result.hooks.map((hook, index) => {
                    const badge = getHookBadgeStyle(index);
                    const key = `hook-${index}`;
                    return (
                      <div 
                        key={index} 
                        className="scroll-snap-align-start w-[88vw] shrink-0 md:w-full bg-brand-surface border border-brand-border rounded-xl p-5 hover:border-brand-accent/30 transition-all flex flex-col justify-between gap-4 shadow-sm"
                      >
                        <div className="space-y-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <p className="text-sm font-semibold text-brand-text-primary leading-relaxed">
                            &ldquo;{hook}&rdquo;
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => copyToClipboard(hook, key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                              copiedStates[key]
                                ? "bg-brand-success/10 border-brand-success text-brand-success"
                                : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                            }`}
                          >
                            {copiedStates[key] ? (
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
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Caption & Hashtags Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Caption Card */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-md font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                      ✍️ Captions &amp; CTA
                    </h3>
                    <p className="text-sm text-brand-text-secondary whitespace-pre-line leading-relaxed">
                      {result.caption}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-brand-border flex justify-end">
                    <button
                      onClick={() => copyToClipboard(result.caption, 'caption')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                        copiedStates['caption']
                          ? "bg-brand-success/10 border-brand-success text-brand-success"
                          : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                      }`}
                    >
                      {copiedStates['caption'] ? (
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
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hashtags Card */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-md font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                      🏷️ Hashtags (Tamil/Tanglish)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-brand-accent/5 text-brand-accent font-semibold border border-brand-accent/15 px-2.5 py-1 rounded-full text-xs"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-brand-border flex justify-end">
                    <button
                      onClick={copyAllHashtags}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                        copiedStates['hashtags']
                          ? "bg-brand-success/10 border-brand-success text-brand-success"
                          : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent/50"
                      }`}
                    >
                      {copiedStates['hashtags'] ? (
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
                          <span>Copy Hashtags</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Best Time to Post Card */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-md font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                  ⏰ Best Time to Post
                </h3>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-accent/5 rounded-xl mt-0.5 shrink-0 border border-brand-accent/15">
                    {getPlatformIcon(platform)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-accent text-md mb-1">{result.bestTimeToPost.time}</p>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">{result.bestTimeToPost.reason}</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Generator Card */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary mb-1 flex items-center gap-2">
                    🎨 Thumbnail Design Studio
                  </h3>
                  <p className="text-xs text-brand-text-secondary">
                    Review and modify the prompt concept below, override aspect ratios, and generate using Hugging Face FLUX Schnell.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Editable textarea brief */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      Design Prompt / Brief
                    </label>
                    <textarea
                      value={editedBrief}
                      onChange={(e) => setEditedBrief(e.target.value)}
                      className="w-full text-sm text-brand-text-primary leading-relaxed bg-brand-surface-elevated border border-brand-border rounded-xl p-3 outline-none focus:border-brand-accent/60 resize-y font-mono"
                      rows={3}
                      placeholder="Prompt for thumbnail generation..."
                    />
                  </div>

                  {/* Aspect Ratio selector pills */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-2 uppercase tracking-wider">
                      Aspect Ratio Override
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Auto', '9:16', '16:9', '1:1', '4:5'].map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            aspectRatio === ratio
                              ? "bg-brand-accent/10 text-brand-accent border-brand-accent/30 shadow-sm"
                              : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                        >
                          {ratio === 'Auto' ? 'Auto (Platform)' : ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button 
                    type="button"
                    onClick={generateThumbnail}
                    disabled={thumbLoading || !editedBrief.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-brand-accent text-brand-bg font-bold text-sm hover:bg-brand-accent/90 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  >
                    {thumbLoading ? (
                      <>
                        <svg className="w-4 h-4 text-brand-bg animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Generating your thumbnail...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Generate Thumbnail</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Thumbnail Error */}
                {thumbError && (
                  <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/20 text-brand-error flex items-center gap-3">
                    <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-sm">Failed to generate: {thumbError}</span>
                  </div>
                )}

                {/* Shimmer loading for thumbnail */}
                {thumbLoading && (
                  <div className="bg-brand-surface-elevated border border-brand-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="h-12 w-12 rounded-full border-4 border-brand-accent/20 border-t-brand-accent animate-spin" />
                    <p className="font-heading text-md font-bold text-brand-text-primary">
                      Drawing your image...
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      FLUX Schnell is running inference steps...
                    </p>
                  </div>
                )}

                {/* Render Generated Image */}
                {thumbUrl && !thumbLoading && (
                  <div className="bg-brand-surface-elevated border border-brand-border rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">
                        Generated Preview
                      </span>
                      <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                        {resolvedRatio} • {resolvedDimensions}
                      </span>
                    </div>

                    {/* Image Box */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={thumbUrl} 
                      alt="FLUX Generated Thumbnail"
                      className="w-full rounded-lg object-contain border border-brand-border bg-brand-surface max-h-[480px] mx-auto shadow-inner"
                    />

                    {/* Action Triggers */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => downloadImage(thumbUrl)}
                        className={`flex-1 py-2 px-3 rounded-lg border transition-all duration-[96ms] active:scale-95 text-xs font-bold flex items-center justify-center gap-1.5 ${
                          copiedStates['download']
                            ? "bg-brand-success/10 border-brand-success text-brand-success"
                            : "border-brand-border bg-brand-surface hover:bg-brand-surface-elevated text-brand-text-primary hover:border-brand-accent/30"
                        }`}
                      >
                        {copiedStates['download'] ? (
                          <span>Downloading...</span>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download PNG</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={generateThumbnail}
                        className="py-2 px-3 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-surface-elevated text-xs font-bold text-brand-text-secondary hover:text-brand-text-primary flex items-center justify-center gap-1.5 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.21" />
                        </svg>
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Projected Engagement Card */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    🔥 Projected Engagement
                  </h3>
                  <span className="font-heading text-2xl font-bold text-brand-accent">
                    {result.engagementScore}/100
                  </span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-3 bg-brand-accent/15 rounded-full overflow-hidden border border-brand-accent/5">
                  <div 
                    className="h-full bg-brand-accent rounded-full transition-all duration-[1200ms] ease-out shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    style={{ width: `${result.engagementScore}%` }}
                  />
                </div>
                <p className="text-sm text-brand-text-secondary leading-relaxed">
                  <span className="font-bold text-brand-text-primary">Engagement Assessment:</span> {result.engagementReason}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
