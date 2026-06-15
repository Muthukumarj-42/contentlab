'use client';

import { useState, useEffect } from 'react';
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

const compositeImage = (
  baseImageUrl: string, 
  hookText: string, 
  platform: string,
  width: number, 
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error("Could not get 2D context"));
      return;
    }
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw base image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Dark gradient overlay at top for text readability
      const topGradient = ctx.createLinearGradient(0, 0, 0, height * 0.45);
      topGradient.addColorStop(0, 'rgba(0,0,0,0.72)');
      topGradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, width, height * 0.45);
      
      // Bottom gradient for branding zone
      const bottomGradient = ctx.createLinearGradient(0, height * 0.75, 0, height);
      bottomGradient.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGradient.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      // MAIN HEADLINE TEXT (top zone)
      const fontSize = Math.floor(width * 0.072);
      ctx.font = `800 ${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // Text shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Word wrap the hook text to 2 lines max
      const words = hookText.split(' ');
      const maxWidth = width * 0.85;
      let lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine.trim());
      lines = lines.slice(0, 2); // max 2 lines
      
      const lineHeight = fontSize * 1.25;
      const startY = height * 0.06;
      
      lines.forEach((line, i) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(line, width / 2, startY + i * lineHeight);
      });
      
      // ContentLab branding bottom right
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      const brandSize = Math.floor(width * 0.028);
      ctx.font = `600 ${brandSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(
        'ContentLab', 
        width - width * 0.04, 
        height - height * 0.025
      );
      
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = baseImageUrl;
  });
};

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
  const [baseThumbUrl, setBaseThumbUrl] = useState<string | null>(null);
  const [compositedThumbUrl, setCompositedThumbUrl] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);
  const [resolvedRatio, setResolvedRatio] = useState('');
  const [resolvedDimensions, setResolvedDimensions] = useState('');

  const platformsList = ['Instagram Reels', 'YouTube Shorts', 'YouTube', 'LinkedIn', 'Twitter/X', 'TikTok'];
  const tonesList = ['Funny', 'Inspirational', 'Educational', 'Emotional', 'Controversial'];

  // Synchronize aspect ratio/dimension badges when platform or aspect ratio change
  useEffect(() => {
    const plat = platform.toLowerCase();
    let defaultRatio = "16:9";
    let defaultDim = "1280×720";
    if (plat.includes("reels") || plat.includes("shorts") || plat.includes("tiktok")) {
      defaultRatio = "9:16";
      defaultDim = "1080×1920";
    } else if (plat.includes("linkedin")) {
      defaultRatio = "1:1";
      defaultDim = "1080×1080";
    } else if (plat.includes("twitter") || plat.includes("x")) {
      defaultRatio = "16:9";
      defaultDim = "1200×675";
    }
    
    if (aspectRatio && aspectRatio !== "Auto") {
      if (aspectRatio.includes("9:16")) {
        defaultRatio = "9:16";
        defaultDim = "1080×1920";
      } else if (aspectRatio.includes("16:9")) {
        defaultRatio = "16:9";
        defaultDim = "1280×720";
      } else if (aspectRatio.includes("1:1")) {
        defaultRatio = "1:1";
        defaultDim = "1080×1080";
      } else if (aspectRatio.includes("4:5")) {
        defaultRatio = "4:5";
        defaultDim = "1080×1350";
      }
    }
    setResolvedRatio(defaultRatio);
    setResolvedDimensions(defaultDim);
  }, [platform, aspectRatio]);

  // Synchronize canvas composite image when base image or hook selection changes
  useEffect(() => {
    if (!baseThumbUrl) return;
    
    let isMounted = true;
    const runComposite = async () => {
      try {
        let w = 1280;
        let h = 720;
        if (resolvedDimensions) {
          const parts = resolvedDimensions.split('×');
          if (parts.length === 2) {
            w = parseInt(parts[0]) || 1280;
            h = parseInt(parts[1]) || 720;
          }
        }
        const selectedHook = result?.hooks?.[selectedHookIndex] || 'ContentLab';
        const compImg = await compositeImage(baseThumbUrl, selectedHook, platform, w, h);
        if (isMounted) {
          setCompositedThumbUrl(compImg);
          setThumbLoading(false); // Stop loading after composite is ready
        }
      } catch (err) {
        console.error("Effect composite error:", err);
        if (isMounted) {
          setThumbLoading(false);
        }
      }
    };
    
    runComposite();
    return () => {
      isMounted = false;
    };
  }, [baseThumbUrl, selectedHookIndex, platform, resolvedDimensions, result]);

  const generateThumbnail = async () => {
    setThumbLoading(true);
    setThumbError(null);
    setBaseThumbUrl(null);
    setCompositedThumbUrl(null);
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
      setResolvedRatio(data.resolvedRatio);
      setResolvedDimensions(data.dimensions);
      setSelectedHookIndex(0);
      setShowOverlay(true);
      setBaseThumbUrl(data.image); // Triggers useEffect to composite
    } catch (err: unknown) {
      setThumbError(err instanceof Error ? err.message : 'Failed to generate thumbnail. Try again.');
      setThumbLoading(false);
    }
  };

  const handleHookSelect = (index: number) => {
    setSelectedHookIndex(index);
    setShowOverlay(true);
  };

  const downloadThumbnail = () => {
    const downloadUrl = compositedThumbUrl || baseThumbUrl;
    if (!downloadUrl) return;
    
    setCopiedStates((prev) => ({ ...prev, download: true }));
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `contentlab-thumbnail.jpg`;
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
      setBaseThumbUrl(null);
      setCompositedThumbUrl(null);
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
          <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'YouTube Shorts':
        return (
          <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'LinkedIn':
        return (
          <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
          </svg>
        );
      case 'Twitter/X':
        return (
          <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.07-2.88-.5-4.13-1.25-.49-.3-1-.67-1.4-1.12v7.1c.02 2.08-.66 4.16-2.06 5.67-1.5 1.62-3.8 2.56-6.02 2.47-2.67-.1-5.18-1.74-6.38-4.12C1.1 16.2 1.37 13 3.1 10.97c1.5-1.8 3.96-2.73 6.27-2.43v4.18c-1.32-.23-2.75.14-3.6 1.15-.82.97-.93 2.44-.27 3.49.77 1.23 2.31 1.83 3.7 1.54 1.34-.28 2.33-1.42 2.33-2.8V.02h1z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
    }
  };

  const getHookBadgeStyle = (index: number) => {
    const styles = [
      { bg: 'bg-[#FEF3C7] text-[#92400E] border-brand-accent/25', label: 'Curiosity Hook' },
      { bg: 'bg-[#FEF3C7] text-[#92400E] border-brand-accent/25', label: 'Emotional Hook' },
      { bg: 'bg-[#FEF3C7] text-[#92400E] border-brand-accent/25', label: 'Contrarian Hook' },
      { bg: 'bg-[#FEF3C7] text-[#92400E] border-brand-accent/25', label: 'Storytelling Hook' },
      { bg: 'bg-[#FEF3C7] text-[#92400E] border-brand-accent/25', label: 'Authority Hook' },
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 relative pb-24 md:pb-8 pt-6">
      {/* Two-Column Grid (Form on Left, Output on Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* Left Column - Form Card (40% width / 5 Cols) */}
        <div className="md:col-span-5 md:sticky md:top-[80px] space-y-6">
          <div className="bg-brand-surface border border-brand-border rounded-[20px] p-5 md:p-8 shadow-card transition-all duration-brand">
            
            {/* Page Heading breadcrumb */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-1 text-[13px] font-sans text-brand-text-tertiary hover:text-brand-accent transition-colors mb-3">
                ← Back to Home
              </Link>
              <h1 className="font-heading text-[28px] font-bold text-brand-text-primary leading-tight">
                Package your content
              </h1>
              <p className="text-sm text-brand-text-secondary mt-1">
                Convert your draft content ideas into ready-to-post packages optimized for engagement.
              </p>
            </div>

            <form id="package-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Content Idea Area */}
              <div>
                <label htmlFor="contentIdea" className="block text-[13px] font-medium text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                  Describe your content idea <span className="text-brand-accent">*</span>
                </label>
                <textarea
                  id="contentIdea"
                  rows={4}
                  value={contentIdea}
                  onChange={handleInputChange}
                  placeholder="E.g. Making a reel about college exam panic. Tamil comedy. 30 seconds."
                  className={`w-full p-3.5 rounded-[12px] border ${
                    validationError ? 'border-brand-error ring-1 ring-brand-error/20' : 'border-brand-border focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/12'
                  } bg-brand-bg text-brand-text-primary placeholder-brand-text-tertiary text-[15px] outline-none transition-all resize-y font-sans`}
                />
                {validationError && (
                  <p className="mt-1.5 text-xs font-semibold text-brand-error flex items-center gap-1 animate-fade-in-up">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {validationError}
                  </p>
                )}
              </div>

              {/* Platform Selector pills */}
              <div>
                <label className="block text-[13px] font-medium text-brand-text-secondary mb-2 uppercase tracking-wider">
                  Platform Target <span className="text-brand-accent">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {platformsList.map((p) => {
                    const isSelected = platform === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                          isSelected
                            ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                            : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Selector pills */}
              <div>
                <label className="block text-[13px] font-medium text-brand-text-secondary mb-2 uppercase tracking-wider">
                  Desired Tone <span className="text-brand-accent">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {tonesList.map((t) => {
                    const isSelected = tone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-brand ${
                          isSelected
                            ? 'bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-semibold'
                            : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:bg-brand-surface-elevated hover:border-brand-border-strong'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button (Desktop only) */}
              <button
                type="submit"
                disabled={loading}
                className="hidden md:flex w-full h-[52px] rounded-[14px] bg-brand-accent text-[#1C1008] font-semibold text-base hover:bg-brand-accent-dark hover:shadow-button active:scale-[0.99] transition-all duration-brand items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <span>Generate Package</span>
                )}
              </button>
            </form>
          </div>

          {/* Sticky Mobile Button (fixed above Tab Bar) */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 bg-brand-bg/95 backdrop-blur-md p-3 border-t border-brand-border z-40">
            <button
              type="submit"
              form="package-form"
              disabled={loading}
              className="w-full h-14 rounded-[14px] bg-brand-accent text-[#1C1008] font-semibold text-base hover:bg-brand-accent-dark hover:shadow-button active:scale-[0.99] transition-all duration-brand flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span>Generating...</span>
                </div>
              ) : (
                <span>Generate Package</span>
              )}
            </button>
          </div>

          {/* Local Error State */}
          {error && (
            <div className="p-4 rounded-[20px] bg-brand-error/10 border border-brand-error/20 text-brand-error flex flex-col gap-1.5 animate-fade-in-up shadow-card">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Generation failed.</span>
              </div>
              <p className="text-xs font-mono break-words bg-brand-surface p-2.5 rounded-xl border border-brand-border">
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
              <div className="h-7 w-48 rounded bg-brand-border animate-shimmer" />

              {/* Hook list Shimmer */}
              <div className="space-y-4">
                <div className="h-5 w-32 rounded bg-brand-border animate-shimmer" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-5 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="h-4 w-20 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />
                      <div className="h-4 w-3/4 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                    </div>
                    <div className="h-8 w-16 rounded-lg bg-brand-border animate-shimmer shrink-0" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                  </div>
                ))}
              </div>

              {/* Grid cards Shimmer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 h-48 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-5 w-24 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100}ms` }} />
                      <div className="h-3.5 w-full rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                      <div className="h-3.5 w-5/6 rounded bg-brand-border animate-shimmer" style={{ animationDelay: `${i * 100 + 100}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Empty State Placeholder */}
          {!loading && !result && (
            <div className="bg-brand-surface border border-brand-border border-dashed rounded-[20px] p-8 text-center flex flex-col items-center justify-center min-h-[400px] group hover:border-brand-accent/30 transition-all duration-brand shadow-card">
              <div className="w-16 h-16 rounded-full bg-brand-amber-soft flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-brand">
                <svg className="w-8 h-8 text-brand-text-tertiary group-hover:text-brand-accent transition-colors duration-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
                <h2 className="font-heading text-xl font-bold text-brand-text-primary">
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
                  <span className="text-[10px] text-brand-text-tertiary font-medium uppercase tracking-widest">Swipe to view</span>
                </div>
                
                {/* Scroll-Snap Carousel */}
                <div className="flex overflow-x-auto scroll-snap-x no-scrollbar md:grid md:grid-cols-1 gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                  {result.hooks.map((hook, index) => {
                    const badge = getHookBadgeStyle(index);
                    const key = `hook-${index}`;
                    return (
                      <div 
                        key={index} 
                        className="scroll-snap-align-start w-[80vw] shrink-0 md:w-full bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-5 hover:border-brand-accent/40 shadow-card transition-all duration-brand flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-[8px] text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <p className="font-mono text-sm leading-relaxed text-brand-text-primary">
                            &ldquo;{hook}&rdquo;
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => copyToClipboard(hook, key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                              copiedStates[key]
                                ? "bg-brand-success/10 border-brand-success text-brand-success"
                                : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent"
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
                <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading text-md font-bold text-brand-text-primary flex items-center gap-2">
                        ✍️ Captions &amp; CTA
                      </h3>
                      <button
                        onClick={() => copyToClipboard(result.caption, 'caption')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                          copiedStates['caption']
                            ? "bg-brand-success/10 border-brand-success text-brand-success"
                            : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-accent"
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
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-sm leading-[1.8] text-brand-text-primary whitespace-pre-line">
                      {result.caption}
                    </p>
                  </div>
                </div>

                {/* Hashtags Card */}
                <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-heading text-md font-bold text-brand-text-primary flex items-center gap-2">
                        🏷️ Hashtags (20)
                      </h3>
                      <button
                        onClick={copyAllHashtags}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-[96ms] active:scale-95 ${
                          copiedStates['hashtags']
                            ? "bg-brand-success/10 border-brand-success text-brand-success"
                            : "border-brand-accent text-brand-accent bg-transparent hover:bg-brand-accent/10"
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
                            <span>Copy All</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-brand-amber-soft text-[#92400E] font-medium border border-brand-accent-light px-3 py-1 rounded-full text-xs"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Best Time to Post Card */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card">
                <h3 className="font-heading text-md font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                  ⏰ Best Time to Post
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 flex flex-col justify-center">
                    <span className="font-heading text-2xl font-bold text-brand-accent">
                      {result.bestTimeToPost.time}
                    </span>
                  </div>
                  <div className="sm:col-span-8">
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                      {result.bestTimeToPost.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Generator Card */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    🎨 Thumbnail
                  </h3>
                  {resolvedRatio && resolvedDimensions && (
                    <span className="text-xs font-bold text-[#92400E] bg-brand-amber-soft px-3 py-1 rounded-full border border-brand-accent-light">
                      {resolvedRatio} • {resolvedDimensions}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Aspect Ratio selector pills */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-2 uppercase tracking-wider">
                      Aspect Ratio Override
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Auto', '9:16 Vertical', '16:9 Horizontal', '1:1 Square', '4:5 Portrait'].map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-brand ${
                            aspectRatio === ratio
                              ? "bg-brand-amber-soft text-[#92400E] border-[1.5px] border-brand-accent font-bold"
                              : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editable textarea brief */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      Thumbnail Design Concept
                    </label>
                    <textarea
                      value={editedBrief}
                      onChange={(e) => setEditedBrief(e.target.value)}
                      className="w-full text-sm text-brand-text-primary leading-relaxed bg-brand-bg border border-brand-border rounded-[12px] p-3.5 outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/12 resize-y font-mono"
                      rows={3}
                      placeholder="Prompt for thumbnail generation..."
                    />
                  </div>

                  {/* Generate Button */}
                  <button 
                    type="button"
                    onClick={generateThumbnail}
                    disabled={thumbLoading || !editedBrief.trim()}
                    className="w-full h-[52px] rounded-[14px] bg-brand-accent text-[#1C1008] font-semibold text-sm hover:bg-brand-accent-dark hover:shadow-button active:scale-[0.99] transition-all duration-brand flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {thumbLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C1008] animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span>Generating your thumbnail...</span>
                      </div>
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
                  <div className="p-4 rounded-[14px] bg-brand-error/10 border border-brand-error/20 text-brand-error flex items-center gap-3 animate-fade-in-up">
                    <svg className="w-5 h-5 text-brand-error shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-sm">Failed to generate: {thumbError}</span>
                  </div>
                )}

                {/* Shimmer loading for thumbnail */}
                {thumbLoading && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="w-full h-64 bg-brand-border rounded-[12px] animate-shimmer" />
                    <p className="text-center font-sans text-sm text-brand-text-tertiary">
                      Building your content<span className="animate-pulse">...</span>
                    </p>
                  </div>
                )}

                {/* Render Generated Image */}
                {baseThumbUrl && !thumbLoading && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">
                        Generated Preview
                      </span>
                      
                      {/* Toggle overlay switcher */}
                      <div className="flex bg-brand-bg border border-brand-border rounded-full p-0.5">
                        <button
                          type="button"
                          onClick={() => setShowOverlay(false)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-brand ${
                            !showOverlay 
                              ? "bg-brand-amber-soft text-[#92400E] shadow-sm"
                              : "text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                        >
                          Preview clean
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowOverlay(true)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-brand ${
                            showOverlay 
                              ? "bg-brand-amber-soft text-[#92400E] shadow-sm"
                              : "text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                        >
                          Preview with text
                        </button>
                      </div>
                    </div>

                    {/* Image Box */}
                    <div className="relative border border-brand-border bg-brand-surface rounded-[12px] overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={showOverlay ? (compositedThumbUrl || '') : baseThumbUrl} 
                        alt="FLUX Generated Thumbnail Preview"
                        className="w-full rounded-[12px] object-contain max-h-[500px] mx-auto shadow-inner"
                      />
                    </div>

                    {/* Hook Selection Pills */}
                    {result && result.hooks && result.hooks.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
                          Hook Text Overlay Variant
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {result.hooks.slice(0, 5).map((h, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleHookSelect(i)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-brand ${
                                selectedHookIndex === i
                                  ? "bg-brand-amber-soft border-[1.5px] border-brand-accent text-[#92400E] font-bold"
                                  : "border-brand-border bg-brand-surface-elevated text-brand-text-secondary hover:text-brand-text-primary"
                              }`}
                            >
                              Hook {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Triggers */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={downloadThumbnail}
                        className={`py-3 px-4 rounded-[14px] bg-brand-accent text-[#1C1008] font-bold text-sm hover:bg-brand-accent-dark hover:shadow-button transition-all duration-[96ms] active:scale-[0.99] flex items-center justify-center gap-1.5`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>{copiedStates['download'] ? 'Downloading...' : 'Download'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={generateThumbnail}
                        className="py-3 px-4 rounded-[14px] border border-brand-accent hover:bg-brand-amber-soft/40 text-brand-accent hover:text-brand-accent-dark font-bold text-sm flex items-center justify-center gap-1.5 transition-all duration-brand active:scale-[0.99]"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.21" />
                        </svg>
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Projected Engagement Card */}
              <div className="bg-brand-surface border border-brand-border border-l-[3px] border-l-brand-accent rounded-[20px] p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-brand-text-primary flex items-center gap-2">
                    🔥 Projected Engagement
                  </h3>
                  <div className="flex items-baseline">
                    <span className="font-heading text-[48px] font-bold text-brand-accent">
                      {result.engagementScore}
                    </span>
                    <span className="text-sm font-medium text-brand-text-tertiary">/100</span>
                  </div>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent rounded-full transition-all duration-[1200ms] ease-out"
                    style={{ width: `${result.engagementScore}%` }}
                  />
                </div>
                <p className="text-sm text-brand-text-secondary leading-relaxed">
                  <span className="font-bold text-brand-text-primary font-sans">Engagement Assessment:</span> {result.engagementReason}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
