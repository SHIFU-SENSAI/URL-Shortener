import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatsCard } from "@/components/stats-card";

interface PageProps {
  params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shortCode } = await params;
  return {
    title: `Stats for /${shortCode}`,
    description: `Click analytics for short link /${shortCode}.`,
  };
}

async function fetchStats(shortCode: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/stats/${shortCode}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatsPage({ params }: PageProps) {
  const { shortCode } = await params;
  const data = await fetchStats(shortCode);

  if (!data) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <main className="min-h-screen bg-[#F7F5F2] flex flex-col">
      {/* Header */}
      <header className="border-b-[3px] border-[#2C2C2C] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a
            href="/"
            className="font-bold text-sm uppercase tracking-[0.2em] text-[#1F1F1F] hover:text-[#6B8F71] transition-colors"
          >
            SHORTEN.IT
          </a>
          <span className="text-xs font-mono text-[#5A5A5A] uppercase tracking-widest">
            Analytics
          </span>
        </div>
      </header>

      {/* Content */}
      <section className="flex-1 flex flex-col items-center px-6 py-16 md:py-24">
        <div className="w-full max-w-5xl mx-auto space-y-10">
          {/* Page heading */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A5A5A]">
              Link Analytics
            </p>
            <h1 className="text-5xl md:text-7xl font-bold uppercase text-[#1F1F1F] leading-none">
              /{shortCode}
            </h1>
          </div>

          <div className="border-t-[3px] border-[#2C2C2C]" />

          <StatsCard data={data} shortUrl={`${appUrl}/${shortCode}`} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#2C2C2C] px-6 py-5">
        <div className="max-w-5xl mx-auto text-xs font-mono text-[#5A5A5A]">
          Data refreshes on every visit.
        </div>
      </footer>
    </main>
  );
}
