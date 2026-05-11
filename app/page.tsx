import type { Metadata } from "next";
import { UrlForm } from "@/components/url-form";

export const metadata: Metadata = {
  title: "Shorten Anything — Fast, Clean URL Shortener",
  description:
    "Paste a long URL and get a clean short link in seconds. Add a custom alias and expiry date.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F5F2] flex flex-col">
      {/* Header bar */}
      <header className="border-b-[3px] border-[#2C2C2C] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-sm uppercase tracking-[0.2em] text-[#1F1F1F]">
            SHORTEN.IT
          </span>
          <span className="text-xs font-mono text-[#5A5A5A]">v1.0</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto space-y-12">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-7xl md:text-[9rem] font-bold uppercase leading-none tracking-tight text-[#1F1F1F]">
              SHORTEN
              <br />
              <span className="text-[#6B8F71]">ANYTHING.</span>
            </h1>
            <p className="text-base md:text-lg text-[#5A5A5A] max-w-lg font-medium">
              Paste a long URL. Get a clean short link. Optionally add a custom
              alias and expiration date.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t-[3px] border-[#2C2C2C]" />

          {/* Form */}
          <UrlForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#2C2C2C] px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#5A5A5A]">
          <span>20 free links / hour · No sign-up required</span>
          <span className="uppercase tracking-widest font-bold">
            BUILT WITH NEXT.JS
          </span>
        </div>
      </footer>
    </main>
  );
}
