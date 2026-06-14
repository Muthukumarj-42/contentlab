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
          <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'YouTube Shorts':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
          </svg>
        );
      case 'Twitter/X':
        return (
          <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg className="w-5 h-5 text-neutral-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.5-4.13-1.25-.49-.3-1-.67-1.4-1.12v7.1c.02 2.08-.66 4.16-2.06 5.67-1.5 1.62-3.8 2.56-6.02 2.47-2.67-.1-5.18-1.74-6.38-4.12C1.1 16.2 1.37 13 3.1 10.97c1.5-1.8 3.96-2.73 6.27-2.43v4.18c-1.32-.23-2.75.14-3.6 1.15-.82.97-.93 2.44-.27 3.49.77 1.23 2.31 1.83 3.7 1.54 1.34-.28 2.33-1.42 2.33-2.8V.02h1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getHookBadgeStyle = (index: number) => {
    const styles = [
      { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Curiosity' },
      { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Emotional' },
      { bg: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Contrarian' },
      { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Storytelling' },
      { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Authority' },
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-1 relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 text-center relative z-10">
        <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#1C1917]/50 hover:text-brand-accent transition-colors mb-3">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
          Package your content
        </h1>
        <p className="text-sm text-[#1C1917]/60 mt-1 max-w-md mx-auto">
          Convert your draft content ideas into ready-to-post packages optimized for engagement.
        </p>
      </div>

      {/* Main Form Section */}
      <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 md:p-8 shadow-sm relative z-10 mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Idea Area */}
          <div>
            <label htmlFor="contentIdea" className="block text-sm font-bold text-brand-text mb-2">
              Describe your content idea <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contentIdea"
              rows={4}
              value={contentIdea}
              onChange={handleInputChange}
              placeholder="E.g. Making a reel about college exam panic. Tamil comedy. 30 seconds."
              className={`w-full p-4 rounded-xl border ${
                validationError ? 'border-red-500 ring-2 ring-red-100' : 'border-[#EADFC9] focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10'
              } bg-[#FDF8F3]/40 text-brand-text placeholder-brand-text/40 text-sm outline-none transition-all resize-y`}
            />
            {validationError && (
              <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {validationError}
              </p>
            )}
          </div>

          {/* Grid for Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Selector */}
            <div>
              <label htmlFor="platform" className="block text-sm font-bold text-brand-text mb-2">
                Platform Target
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#EADFC9] bg-[#FDF8F3]/40 text-brand-text text-sm outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all cursor-pointer"
              >
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>

            {/* Tone Selector */}
            <div>
              <label htmlFor="tone" className="block text-sm font-bold text-brand-text mb-2">
                Desired Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#EADFC9] bg-[#FDF8F3]/40 text-brand-text text-sm outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all cursor-pointer"
              >
                <option value="Funny">Funny</option>
                <option value="Inspirational">Inspirational</option>
                <option value="Educational">Educational</option>
                <option value="Emotional">Emotional</option>
                <option value="Controversial">Controversial</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold text-md hover:bg-brand-accent/90 focus:ring-4 focus:ring-brand-accent/25 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Generate Package</span>
            )}
          </button>
        </form>

        {/* Local Error State */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-sm">Something went wrong. Try again.</span>
            </div>
            {error !== 'Something went wrong. Try again.' && (
              <p className="text-xs text-red-600/90 ml-8 font-mono break-words leading-normal bg-red-100/50 p-2.5 rounded-lg border border-red-200/50">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Loading Placeholder Component */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-[#EADFC9]/30 rounded-2xl shadow-sm relative z-10 animate-pulse">
          <div className="relative w-14 h-14 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-brand-accent/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="font-heading text-lg font-bold text-brand-text">
            ContentLab is packaging your content...
          </p>
          <p className="text-xs text-[#1C1917]/50 mt-1 max-w-xs px-4">
            Creating hooks, generating your social media caption, formatting hashtags, and computing optimization metrics.
          </p>
        </div>
      )}

      {/* Output Section (appears below form after generation) */}
      {result && (
        <div className="space-y-8 animate-fade-in relative z-10 pb-16">
          <hr className="border-[#EADFC9]/50 my-10" />
          
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-brand-text">
              📦 Your Content Package
            </h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]/60 bg-white border border-[#EADFC9]/40 px-3 py-1 rounded-full">
              <span>Platform:</span>
              <span className="text-brand-text font-bold flex items-center gap-1">
                {getPlatformIcon(platform)} {platform}
              </span>
            </div>
          </div>

          {/* Hooks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-brand-text flex items-center gap-2">
                🪝 Hook Variations
              </h3>
              <span className="text-xs text-[#1C1917]/50 font-medium">Select a hook styled for your audience</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {result.hooks.map((hook, index) => {
                const badge = getHookBadgeStyle(index);
                const key = `hook-${index}`;
                return (
                  <div key={index} className="bg-white border border-[#EADFC9]/50 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <p className="text-sm font-semibold text-brand-text leading-relaxed">
                        &ldquo;{hook}&rdquo;
                      </p>
                    </div>
                    <div className="shrink-0 flex items-start justify-end">
                      <button
                        onClick={() => copyToClipboard(hook, key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/10 hover:border-brand-accent transition-all duration-200"
                      >
                        {copiedStates[key] ? (
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
                            <span>Copy</span>
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
            <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                    ✍️ Captions & CTA
                  </h3>
                  <button
                    onClick={() => copyToClipboard(result.caption, 'caption')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/10 hover:border-brand-accent transition-all duration-200"
                  >
                    {copiedStates['caption'] ? (
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
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-[#1C1917]/80 whitespace-pre-line leading-relaxed">
                  {result.caption}
                </p>
              </div>
            </div>

            {/* Hashtags Card */}
            <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                    🏷️ Hashtags (20)
                  </h3>
                  <button
                    onClick={copyAllHashtags}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#EADFC9] bg-[#FDF8F3] hover:bg-brand-accent/10 hover:border-brand-accent transition-all duration-200"
                  >
                    {copiedStates['hashtags'] ? (
                      <>
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-emerald-600 font-bold">Copied All!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 text-[#1C1917]/75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy All Tags</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-brand-accent/10 text-brand-accent font-semibold border border-brand-accent/20 px-2.5 py-1 rounded-full text-xs hover:bg-brand-accent/15 transition-colors duration-150 cursor-default"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posting Time & Thumbnail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Time to Post */}
            <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
              <h3 className="font-heading text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
                ⏰ Best Time to Post
              </h3>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-accent/10 rounded-xl mt-0.5 shrink-0">
                  {getPlatformIcon(platform)}
                </div>
                <div>
                  <p className="font-bold text-brand-text text-md mb-1">{result.bestTimeToPost.time}</p>
                  <p className="text-sm text-[#1C1917]/70 leading-relaxed">{result.bestTimeToPost.reason}</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Brief */}
            <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-brand-text mb-3 flex items-center gap-2">
                  🎨 Thumbnail Design Concept
                </h3>
                <p className="text-sm text-[#1C1917]/70 leading-relaxed mb-6 italic">
                  &ldquo;{result.thumbnailBrief}&rdquo;
                </p>
              </div>
              <button 
                disabled 
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 text-neutral-400 font-semibold text-xs cursor-not-allowed border border-neutral-200 flex items-center justify-center gap-2 hover:bg-neutral-150 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Generate Thumbnail (Coming soon)</span>
              </button>
            </div>
          </div>

          {/* Engagement Score Section */}
          <div className="bg-white border border-[#EADFC9]/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                🔥 Projected Engagement
              </h3>
              <span className="font-heading text-2xl font-bold text-brand-accent">{result.engagementScore}/100</span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-3.5 bg-brand-accent/15 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-brand-accent rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${result.engagementScore}%` }}
              />
            </div>
            <p className="text-sm text-[#1C1917]/80 leading-relaxed">
              <span className="font-bold text-brand-text">AI Score Rationale:</span> {result.engagementReason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
