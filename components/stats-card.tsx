import { format } from "date-fns";
import Link from "next/link";

interface StatsData {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
}

interface StatsCardProps {
  data: StatsData;
  shortUrl: string;
}

export function StatsCard({ data, shortUrl }: StatsCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Click count — hero stat */}
      <div className="brutalist-card flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="brutalist-label">Total Clicks</span>
          <p
            className="text-8xl font-bold text-[#1F1F1F] leading-none mt-1"
            aria-label={`${data.clicks} total clicks`}
          >
            {data.clicks.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[#5A5A5A]">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              data.expiresAt && new Date(data.expiresAt) < new Date()
                ? "bg-[#B76E79]"
                : "bg-[#7A9E7E]"
            }`}
            aria-hidden="true"
          />
          <span className="text-xs font-bold uppercase tracking-widest">
            {data.expiresAt && new Date(data.expiresAt) < new Date()
              ? "EXPIRED"
              : "ACTIVE"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="brutalist-card space-y-5">
        <StatRow label="Short URL" value={shortUrl} mono link={shortUrl} />
        <div className="border-t-[3px] border-[#2C2C2C]" />
        <StatRow
          label="Destination"
          value={data.originalUrl}
          mono
          link={data.originalUrl}
          truncate
        />
        <div className="border-t-[3px] border-[#2C2C2C]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <StatRow
            label="Created"
            value={format(new Date(data.createdAt), "PPP")}
          />
          <StatRow
            label="Expires"
            value={
              data.expiresAt
                ? format(new Date(data.expiresAt), "PPP")
                : "Never"
            }
          />
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        id="back-home-link"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#5A5A5A] hover:text-[#1F1F1F] transition-colors group"
      >
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
          className="group-hover:-translate-x-1 transition-transform"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        SHORTEN ANOTHER
      </Link>
    </div>
  );
}

function StatRow({
  label,
  value,
  mono = false,
  link,
  truncate = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  link?: string;
  truncate?: boolean;
}) {
  return (
    <div className="space-y-1">
      <span className="brutalist-label">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-sm text-[#1F1F1F] hover:text-[#6B8F71] transition-colors break-all underline underline-offset-2 ${
            mono ? "font-mono" : ""
          } ${truncate ? "truncate" : ""}`}
        >
          {value}
        </a>
      ) : (
        <p
          className={`text-sm text-[#1F1F1F] ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
