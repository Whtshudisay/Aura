# AURA

Guided breathwork web app — zen, dark, mobile-responsive visual timers for patterns like Box Breathing (4-4-4-4).

## Tech stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4** + Framer Motion
- **Supabase** — Auth + Postgres (profiles & practice sessions)
- **Vercel** — recommended host for Next.js

## Local setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the contents of `supabase/schema.sql`.
3. In **Authentication → Providers → Email**, you can turn off **Confirm email** for instant local sign-up (optional).
4. Copy API keys from **Project Settings → API**:

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Guests can use the library immediately; sign-in is optional to save streaks.

### PWA / offline

Production builds (`npm run build`) generate a service worker via `@ducanh2912/next-pwa`. Install from mobile browser (“Add to Home Screen”). Ambient loops live in `public/audio/` (`rain.mp3`, `meditation.mp3`).

## Deploy to Vercel + Supabase

### 1. Supabase

1. Create a Supabase project (or reuse your local one).
2. Run `supabase/schema.sql` in the SQL Editor.
3. Auth → URL Configuration: add your Vercel URL to **Site URL** and **Redirect URLs**  
   (e.g. `https://your-app.vercel.app` and `https://your-app.vercel.app/**`).
4. Optional: disable **Confirm email** under Auth → Providers → Email for simpler onboarding.

### 2. Push the repo to GitHub

```bash
git init   # if needed
git add .
git commit -m "Prepare Aura for Vercel + Supabase"
git remote add origin https://github.com/YOUR_USER/aura.git
git push -u origin main
```

### 3. Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (same as `.env.local`):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/public key |

4. Deploy. After the first deploy, confirm the production URL is listed in Supabase Auth redirect URLs.

### 4. Smoke test

- Open the Vercel URL → create an account → start a short session → finish it  
- Home **Weekly Progress** should show the saved minutes

## Project structure

```
app/                  # Routes + server actions
components/           # UI (orb, cards, auth form)
data/patterns.ts      # Breathing pattern catalog
hooks/useBreathingTimer.ts
lib/auth.ts           # Session helpers (Supabase)
lib/progress.ts       # Weekly progress queries
lib/supabase/         # Browser / server / middleware clients
supabase/schema.sql   # Tables, RLS, profile trigger
middleware.ts         # Auth gate + session refresh
```

## Add a breathing pattern

Edit `data/patterns.ts` and append an object (`id`, `phases`, `phaseLabels`, etc.). Home, library, and `/session/[id]` pick it up automatically.
