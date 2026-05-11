"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface ResultCardProps {
  shortUrl: string;
  shortCode: string;
  expiresAt: string | null;
}

export function ResultCard({ shortUrl, shortCode, expiresAt }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = shortUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="brutalist-card space-y-5" role="region" aria-label="Shortened URL result">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#7A9E7E]" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#5A5A5A]">
          Link Created
        </span>
      </div>

      {/* Short URL display */}
      <div className="space-y-2">
        <span className="brutalist-label">Your Short URL</span>
        <div className="flex items-center gap-0 border-[3px] border-[#2C2C2C]">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="short-url-display"
            className="flex-1 px-4 py-4 font-mono text-base text-[#1F1F1F] break-all hover:text-[#6B8F71] transition-colors bg-[#F7F5F2] truncate"
          >
            {shortUrl}
          </a>
          <button
            type="button"
            id="copy-btn"
            onClick={handleCopy}
            aria-label="Copy short URL to clipboard"
            className="px-5 py-4 bg-[#2C2C2C] text-[#F7F5F2] font-bold text-xs uppercase tracking-widest hover:bg-[#1F1F1F] transition-colors whitespace-nowrap flex items-center gap-2 border-l-[3px] border-[#2C2C2C]"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A9E7E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                COPIED
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="0" ry="0" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                COPY
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expiration badge */}
      {expiresAt && (
        <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-mono text-xs">
            Expires {format(new Date(expiresAt), "PPP")}
          </span>
        </div>
      )}

      {/* Stats link */}
      <div className="pt-2 border-t-[3px] border-[#2C2C2C]">
        <Link
          href={`/stats/${shortCode}`}
          id="view-stats-link"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#5A5A5A] hover:text-[#1F1F1F] transition-colors group"
        >
          VIEW ANALYTICS
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
