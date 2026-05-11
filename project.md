Build a production-ready URL shortener web application with a brutalist minimalism design aesthetic using a soft, eye-friendly monochrome color palette.

## Core Goal
Users can paste a long URL and instantly receive a short URL. They can optionally specify a custom alias and expiration date. The application should be fast, simple, and visually striking.

---

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui only when necessary
- Framer Motion for subtle animations

### Backend
- Next.js Route Handlers

### Database
- PostgreSQL
- Prisma ORM

### Cache
- Redis for alias lookup and rate limiting

### Deployment
- Frontend + API: Vercel
- PostgreSQL: Neon or Supabase
- Redis: Upstash

---

## Features

### Public Features
1. Create a short URL from a long URL.
2. Optional custom alias.
3. Optional expiration date.
4. Copy short URL to clipboard.
5. Redirect when visiting the short URL.
6. Show validation errors.
7. Rate limit to 20 URL creations per hour per IP using Redis.

### Analytics
- Total clicks
- Creation date
- Expiration date
- Destination URL

---

## Database Schema

### URL Table
- id (UUID)
- originalUrl (TEXT)
- shortCode (VARCHAR, unique)
- customAlias (VARCHAR, nullable, unique)
- clicks (INTEGER, default 0)
- expiresAt (TIMESTAMP, nullable)
- createdAt (TIMESTAMP, default now)

### Click Event Table (Optional)
- id (UUID)
- urlId (foreign key)
- createdAt (TIMESTAMP)

---

## Redis Usage

### Caching
- Cache shortCode -> originalUrl
- Set TTL to match expiration date when provided

### Rate Limiting
- Track requests by IP
- Allow 20 URL creations per hour

---

## API Routes

### POST /api/shorten
Creates a short URL.

### GET /api/stats/[shortCode]
Returns analytics.

### GET /[shortCode]
Redirects to the original URL.

---

## Validation Rules
- URL must be valid and include protocol.
- Custom alias may contain letters, numbers, hyphens, and underscores.
- Alias must be unique.
- Expiration date must be in the future.

---

## Short Code Generation
- Generate a random 6-character alphanumeric code if no custom alias is provided.
- Retry on collisions.

---

## Frontend Pages

### Home Page
- Hero heading: "Shorten Anything."
- URL input
- Optional custom alias input
- Optional expiration date picker
- Submit button
- Result card with generated short URL and copy button

### Stats Page
- Displays click analytics

---

## Design System: Soft Brutalist Minimalism

### Color Palette (Eye-Friendly)

#### Background
- Main background: #F7F5F2 (warm off-white)
- Secondary surfaces: #EFEBE5 (soft beige)

#### Text
- Primary text: #1F1F1F (soft charcoal)
- Secondary text: #5A5A5A (muted gray)

#### Borders
- Border color: #2C2C2C

#### Accent
- Primary accent: #6B8F71 (muted sage green)

#### Accent Hover
- Hover accent: #58765E (deeper sage)

#### Success
- #7A9E7E

#### Error
- #B76E79 (muted dusty rose)

### Visual Style
- No gradients
- No heavy shadows
- Thick 3px to 4px borders
- Sharp corners (rounded-none)
- Oversized typography
- High contrast without harsh pure black and pure white
- Monospace font for URLs

### Typography
- Headings: bold uppercase, text-7xl md:text-9xl
- Body: text-base md:text-lg
- URLs: monospace
- Buttons and labels: uppercase and bold

### Components
- Inputs: bg-[#F7F5F2] border-4 border-[#2C2C2C] px-6 py-5 rounded-none
- Buttons: bg-[#6B8F71] text-[#F7F5F2] border-4 border-[#2C2C2C]
- Buttons on hover: bg-[#58765E]
- Cards: bg-[#EFEBE5] border-4 border-[#2C2C2C] p-8 rounded-none

### Layout
- Max width: 5xl
- Centered content
- Generous whitespace
- Strong grid alignment

### Design Inspiration
- Neo-brutalism
- Swiss editorial design
- Calm, readable interfaces

---

## UX Requirements
- Fully responsive
- Keyboard accessible
- Loading states
- Error states
- Success states
- Copy-to-clipboard feedback
- Fast interactions

---

## Security
- Validate and sanitize all inputs
- Use Prisma to prevent SQL injection
- Rate limiting with Redis
- Handle expired links gracefully

---

## SEO
- Metadata
- Open Graph tags
- robots.txt
- sitemap.xml

---

## Project Structure
- Modular architecture
- Reusable components
- Utility functions for:
  - URL validation
  - Short code generation
  - Redis cache helpers
  - Rate limiting

---

## Environment Variables
DATABASE_URL=
REDIS_URL=
REDIS_TOKEN=
NEXT_PUBLIC_APP_URL=

---

## Deliverables
1. Complete Next.js application
2. Prisma schema
3. API routes
4. Brutalist UI components
5. README with setup instructions

---

## Code Quality Requirements
- Type-safe TypeScript
- Clean folder structure
- Minimal comments
- Production-ready implementation
- Avoid unnecessary complexity

---

## Implementation Priority
1. Prisma schema
2. URL shortening API
3. Redirect route
4. Redis cache
5. Rate limiting
6. Frontend UI
7. Analytics page
8. README

Generate the complete project with all required files and production-ready code.