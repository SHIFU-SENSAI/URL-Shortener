import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Link Not Found",
  description: "The short link you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">
            Error 404
          </p>
          <h1 className="text-8xl md:text-[10rem] font-bold text-[#1F1F1F] leading-none">
            404
          </h1>
        </div>

        <div className="border-t-[3px] border-[#2C2C2C]" />

        <div className="space-y-3">
          <p className="text-lg font-bold uppercase text-[#1F1F1F]">
            Link not found.
          </p>
          <p className="text-sm text-[#5A5A5A]">
            This short link doesn&apos;t exist or may have expired.
          </p>
        </div>

        <Link
          href="/"
          id="not-found-home-link"
          className="brutalist-btn inline-flex"
        >
          ← SHORTEN A NEW LINK
        </Link>
      </div>
    </main>
  );
}
