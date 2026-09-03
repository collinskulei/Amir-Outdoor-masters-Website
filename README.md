# Amir Outdoor Masters

Landscaping & outdoor living marketing site, rebuilt from WordPress into
Next.js 16, with a full Supabase-backed admin dashboard.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- **shadcn/ui** (`base-nova` preset, built on Base UI) for primitives
- **Framer Motion** for scroll-triggered and zoom-in animations
- **Supabase** — Postgres, Auth, and Storage for the admin dashboard
- **Vercel** as the deployment target

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public site renders
fully with placeholder content even before Supabase is connected — services,
testimonials, and hero sections fall back to sensible defaults (see
`src/lib/placeholder-content.ts`).

## Connecting Supabase (required for the admin dashboard)

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase SQL Editor, run the contents of `supabase/schema.sql`.
   This creates every table, Row Level Security policy, and the public
   `media` storage bucket used for uploads.
3. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from
     Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY` — same page (keep this secret; it's never
     sent to the browser).
4. Create your admin login in Supabase: **Authentication → Users → Add
   user**. There's no public sign-up — admin accounts are provisioned this
   way on purpose.
5. Restart the dev server. `/admin` now requires sign-in, and every
   dashboard page (Services, Categories, Portfolio, Testimonials, Leads,
   Bookings, Settings) becomes fully functional.

## What the admin dashboard manages

- **Services & Categories** — everything on the public Services pages.
- **Portfolio** — the project gallery, grouped by category/service.
- **Testimonials** — client quotes, with a publish/unpublish toggle.
- **Leads** — contact form submissions, with a status pipeline.
- **Bookings** — quote/site-visit requests from the `/quote` page.
- **Settings** — logo, favicon, homepage hero backgrounds (separate
  desktop/mobile images), contact info, business hours, and social links.

Until a logo or hero image is uploaded, the site shows a designed
placeholder (a branded gradient for the hero, a colored icon tile for
service/portfolio photos) rather than a broken image — upload real photos
any time from **Admin → Settings** / the relevant content page.

## Content still needed from you

- **Service & portfolio photos** — categorize and upload via the admin
  dashboard once ready.
- **Hero background images** — a wide desktop image and a tall mobile
  image, uploaded from **Admin → Settings**.
- **Logo** — uploaded from **Admin → Settings**; until then, a text
  lockup echoing the brand mark is shown.

## Deploying

Deploy to [Vercel](https://vercel.com/new), adding the same environment
variables from `.env.local` in the project's settings.
