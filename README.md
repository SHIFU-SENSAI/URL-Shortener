# Shorten Anything — URL Shortener

A production-ready URL shortener built with **Next.js 15**, **PostgreSQL + Prisma**, **Upstash Redis**, and a **soft brutalist** design.

## Features

- ✂️ Shorten any valid URL instantly
- 🏷️ Optional custom alias
- 📅 Optional expiration date
- 📋 Copy to clipboard with visual feedback
- 📊 Per-link click analytics
- 🚦 Rate limiting (20 links/hour/IP via Redis)
- 🔄 Fast redirects (Redis cache → DB fallback)
- 📱 Fully responsive

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Prisma ORM |
| Cache / Rate Limit | Upstash Redis |
| Animations | Framer Motion |
| Deployment | Vercel + Neon/Supabase + Upstash |

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd url-shortener
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=postgresql://...         # Neon or Supabase connection string
REDIS_URL=https://...upstash.io       # Upstash Redis REST URL
REDIS_TOKEN=...                       # Upstash Redis REST token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Push the database schema

```bash
npx prisma db push
```

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Add environment variables in the Vercel dashboard.
4. Deploy — Vercel handles the rest.

After deployment, update `NEXT_PUBLIC_APP_URL` to your production URL (e.g., `https://shorten.yourdomain.com`).

## Project Structure

```
app/
├── layout.tsx              # Root layout + fonts + metadata
├── page.tsx                # Home page
├── globals.css             # Brutalist design system
├── not-found.tsx           # Custom 404
├── [shortCode]/
│   └── route.ts            # Redirect handler
├── api/
│   ├── shorten/route.ts    # POST — create short link
│   └── stats/[shortCode]/
│       └── route.ts        # GET — analytics
└── stats/[shortCode]/
    └── page.tsx            # Analytics page

components/
├── url-form.tsx            # Main form
├── result-card.tsx         # Success state
├── stats-card.tsx          # Analytics display
└── ui/                     # shadcn calendar + popover

lib/
├── prisma.ts               # DB client
├── redis.ts                # Cache helpers
├── rate-limit.ts           # Rate limiter
└── utils/url.ts            # Validators + code gen

prisma/
└── schema.prisma
```

## API Reference

### `POST /api/shorten`

```json
{
  "url": "https://example.com/long-url",
  "customAlias": "my-link",       // optional
  "expiresAt": "2026-12-31T00:00:00Z" // optional ISO string
}
```

Response `201`:
```json
{
  "shortUrl": "http://localhost:3000/my-link",
  "shortCode": "my-link",
  "expiresAt": "2026-12-31T00:00:00.000Z"
}
```

### `GET /api/stats/:shortCode`

Response `200`:
```json
{
  "shortCode": "my-link",
  "originalUrl": "https://example.com/long-url",
  "clicks": 42,
  "createdAt": "2026-05-11T00:00:00.000Z",
  "expiresAt": null
}
```

### `GET /:shortCode`

Redirects `307` to the original URL.
