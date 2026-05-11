"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ResultCard } from "@/components/result-card";

interface ShortenResult {
  shortUrl: string;
  shortCode: string;
  expiresAt: string | null;
}

export function UrlForm() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [calOpen, setCalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          customAlias: customAlias.trim() || undefined,
          expiresAt: expiresAt?.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
        setUrl("");
        setCustomAlias("");
        setExpiresAt(undefined);
        setShowOptions(false);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* URL Input */}
        <div>
          <label htmlFor="url-input" className="brutalist-label">
            Your Long URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/a-very-long-url..."
            className="brutalist-input"
            required
            disabled={loading}
            autoComplete="off"
            autoFocus
          />
        </div>

        {/* Toggle optional fields */}
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className="text-sm font-bold uppercase tracking-widest text-[#5A5A5A] hover:text-[#1F1F1F] transition-colors underline underline-offset-4"
        >
          {showOptions ? "− HIDE OPTIONS" : "+ CUSTOM ALIAS & EXPIRY"}
        </button>

        {/* Optional fields */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              key="options"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden space-y-4"
            >
              {/* Custom Alias */}
              <div>
                <label htmlFor="alias-input" className="brutalist-label">
                  Custom Alias (optional)
                </label>
                <div className="flex items-center">
                  <span
                    className="border-[3px] border-r-0 border-[#2C2C2C] bg-[#EFEBE5] px-3 py-[1.125rem] text-sm text-[#5A5A5A] font-mono whitespace-nowrap select-none"
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <input
                    id="alias-input"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-link"
                    className="brutalist-input flex-1"
                    disabled={loading}
                    maxLength={50}
                    pattern="[a-zA-Z0-9_\-]+"
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="brutalist-label">Expiration Date (optional)</label>
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                  <PopoverTrigger
                    id="expiry-picker"
                    disabled={loading}
                    className="brutalist-input text-left flex items-center justify-between group cursor-pointer"
                    render={
                      <button type="button" />
                    }
                  >
                    <span className={expiresAt ? "text-[#1F1F1F]" : "text-[#5A5A5A]"}>
                      {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#5A5A5A]"
                    >
                        <rect x="3" y="4" width="18" height="18" rx="0" ry="0" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-[3px] border-[#2C2C2C] rounded-none bg-[#F7F5F2] shadow-[4px_4px_0px_#2C2C2C]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={expiresAt}
                      onSelect={(day) => {
                        setExpiresAt(day);
                        setCalOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                    {expiresAt && (
                      <div className="border-t-[3px] border-[#2C2C2C] p-2">
                        <button
                          type="button"
                          onClick={() => setExpiresAt(undefined)}
                          className="w-full text-xs font-bold uppercase tracking-widest text-[#B76E79] hover:text-[#8a4a54] transition-colors py-1"
                        >
                          Clear Date
                        </button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              role="alert"
              className="border-[3px] border-[#B76E79] bg-[#B76E79]/10 px-5 py-3 text-[#B76E79] font-bold text-sm uppercase tracking-wide"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          id="shorten-btn"
          disabled={loading || !url.trim()}
          className="brutalist-btn w-full text-lg py-5"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              SHORTENING...
            </>
          ) : (
            "SHORTEN →"
          )}
        </button>
      </form>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ResultCard
              shortUrl={result.shortUrl}
              shortCode={result.shortCode}
              expiresAt={result.expiresAt}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
