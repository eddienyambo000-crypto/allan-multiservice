# CLAUDE.md — Allan Multiservice Group

## Project
Premium **two-sided marketplace** for **property (sale), houses (rent), land, and cars** in Kigali, Rwanda.
Built to rank #1 on local search and convert both **buyers** (browse → WhatsApp/inquire) and
**sellers** (`/sell` funnel → "List with Allan"). Positioned Hormozi-style: category creation
("Rwanda's first verified marketplace"), risk reversal, and an irresistible seller offer.

## Stack
- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** (inline `@theme` tokens)
- **Supabase** (Postgres + Auth + Storage) — `src/lib/supabase.ts`
- Deploys on **Vercel**. Server-rendered/SSG pages = the SEO engine.

## Brand (locked — see `brand_assets/brand-guidelines.md`)
- Sky `#0C8CE0` · Pink `#FF4D8D` · White · Ink `#0B1B2B`
- Fonts: Space Grotesk (display) · Inter (body) · JetBrains Mono (labels)
- Premium minimalism. SVG icons only (no emoji). No `transition-all`. Layered tinted shadows.

## Data
- One `listings` table (4 verticals via `vertical` enum + nullable per-vertical columns).
- `inquiries` (buyer leads) + `seller_leads` (sell-with-us). RLS in `supabase-schema.sql`.
- **Graceful fallback:** with no Supabase env, the site renders from `src/lib/seed.ts`. Add env → live DB.

## Key paths
- `src/lib/site.ts` — verticals, contact, areas, WhatsApp helper (single source of truth)
- `src/lib/listings.ts` — queries with seed fallback · `src/lib/leads.ts` — lead inserts
- `src/lib/schema.ts` — JSON-LD · `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/components/` — Nav, Footer, ListingCard, FilterBar (URL-synced), Gallery, *Form, ListingsIndex, ListingDetail, LocationLanding
- `src/app/admin/page.tsx` — owner dashboard (Supabase Auth + CRUD + image upload + leads inbox)
- Routes: `/`, `/{properties,rentals,land,cars}` + `/[slug]`, `/{properties,rentals}/kigali/[area]` (SEO), `/sell`, `/about`, `/contact`, `/admin`

## Local dev
```
npm run dev      # http://localhost:3000
npm run build    # verify before deploy
```
Screenshots: use the ai7 project's `node screenshot.mjs <url> <label> [width]`.

## Go-live checklist
1. Create Supabase project → run `supabase-schema.sql` → create public Storage bucket `listings`.
2. Add owner user in Supabase Auth (for `/admin`).
3. Copy `.env.local.example` → `.env.local`, fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
4. Deploy to Vercel; set the same env vars there.
5. Replace seed photos with Allan's real inventory via `/admin`. Swap text logo for `brand_assets/logo.png` when supplied.

## Hard rules
- Do not push to GitHub until Eddie says so.
- Test on localhost before any deploy. Mobile-first; verify 375/768/1024/1440.
