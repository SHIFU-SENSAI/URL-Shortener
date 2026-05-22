import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expired Link — Shorten.it",
  description: "This short link has reached its expiration date and is no longer active.",
};

interface ExpiredPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function ExpiredPage({ searchParams }: ExpiredPageProps) {
  const { code } = await searchParams;

  return (
    <main className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Visual Badge */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
            Expired Link
          </p>
          <h1 className="text-7xl md:text-8xl font-bold text-[#1F1F1F] leading-none uppercase">
            EXPIRED.
          </h1>
        </div>

        {/* Separator */}
        <div className="border-t-[3px] border-[#2C2C2C]" />

        {/* Detail Card */}
        <div className="brutalist-card space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#B76E79]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#5A5A5A]">
              Link Inactive
            </span>
          </div>

          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            The short link <span className="font-mono font-bold text-[#1F1F1F] break-all bg-[#EFEBE5] px-1.5 py-0.5 border border-[#2C2C2C]">/{code ?? "unknown"}</span> has reached its specified expiration date and can no longer redirect to its original destination.
          </p>
        </div>

        {/* Back home action button */}
        <Link
          href="/"
          id="expired-home-btn"
          className="brutalist-btn inline-flex w-full justify-center py-4"
        >
          ← SHORTEN A NEW LINK
        </Link>
      </div>
    </main>
  );
}
