# AURA — Project Context

Copy this into a new chat when continuing work on the Aura guided breathwork app.

## What it is

**AURA** is a dark, zen-style guided breathing web app. Users pick a technique (e.g. Box Breathing 4-4-4-4), start a timed session with a visual “breathing orb,” and (if signed in) save progress for weekly minutes and streaks.

- Live / deploy target: **Vercel**
- Auth + Postgres: **Supabase**
- Repo: GitHub (`Whtshudisay/Aura`)
- Production URL example: `https://aura-ecru-psi.vercel.app/`

## Exact tech stack

| Layer | Choice |
|--------|--------|
| Framework | **Next.js 15** (App Router) + **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`), design tokens in `app/globals.css` |
| Motion | **Framer Motion** (orb + login ambient UI) |
| Auth / DB | **Supabase Auth** (email/password) + **Postgres** via `@supabase/ssr` + `@supabase/supabase-js` |
| Analytics | **`@vercel/analytics`** |
| PWA | **`@ducanh2912/next-pwa`**, `public/manifest.webmanifest`, icons under `public/icons/` |
| Ambient audio | Local files in `public/audio/` (`rain.mp3`, `meditation.mp3`), native `Audio` API via `hooks/useAmbientAudio.ts` |
| Haptics | `navigator.vibrate()` via `hooks/useHaptics.ts` |
| Hosting | **Vercel**; env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` only (anon key is public-by-design; RLS protects data) |

**Not used anymore:** SQLite / `better-sqlite3` / custom JWT auth (migrated to Supabase).

## Architecture (high level)

```
Browser
  ├─ App Router pages (RSC + client islands)
  ├─ middleware.ts → refreshes Supabase session (does NOT force login)
  └─ Client hooks: timer, haptics, ambient audio, localStorage prefs

Server
  ├─ Server Actions: login/register/logout, saveCompletedSession
  ├─ lib/auth.ts → getSessionUser() (React cache)
  └─ lib/progress.ts → weekly totals / streak / recent sessions

Supabase
  ├─ auth.users
  ├─ profiles (trigger on signup)
  └─ practice_sessions (RLS: own rows only)

Vercel
  └─ Production deploy on push/merge to main; PWA SW generated on production build
```

### Guest vs signed-in

- **Guests** can use the home/library/session UI without auth.
- Guests may **only** start **Box Breathing** (`lib/guestAccess.ts`). Other techniques show “Sign up to unlock”; direct `/session/[id]` redirects to register if locked.
- **Signed-in** users unlock all techniques; completed sessions write to `practice_sessions` and power weekly progress / streak.

### Session flow

1. Pick technique (+ duration chips on featured card).
2. `/session/[id]?duration=N` → `SessionView` + `useBreathingTimer` (rAF-based phases/sets).
3. User must press **Start**; Pause / Restart available.
4. Optional: haptics on phase change; ambient loop while running.
5. On complete: `saveCompletedSession` (no-op message path for guests).

## Folder structure

```
app/
  layout.tsx              # Root layout, PWA metadata, Analytics, ethereum guard, hydration suppress
  (main)/                 # Shared chrome: SiteHeader, GuestBanner, mobile nav
    layout.tsx
    loading.tsx
    page.tsx              # Home / library dashboard
    library/page.tsx
    profile/page.tsx
  login/page.tsx          # → LoginExperience (animated)
  session/[id]/page.tsx   # Full-screen session (auth gate for non-guest patterns)
  session/[id]/loading.tsx
  offline/page.tsx        # PWA offline fallback
  actions/auth.ts
  actions/progress.ts
  globals.css             # Design tokens (dark zen)

components/               # UI: orb, cards, session controls/extras, auth, header, banner
hooks/
  useBreathingTimer.ts
  useHaptics.ts
  useAmbientAudio.ts
lib/
  auth.ts, progress.ts, guestAccess.ts, preferences.ts, types.ts, utils.ts
  supabase/{client,server,middleware}.ts
data/patterns.ts          # Modular catalog of ~10 techniques — add patterns here
middleware.ts
next.config.ts            # PWA wrapper + security headers (CSP, etc.) + staleTimes
public/
  audio/{rain,meditation}.mp3
  icons/
  manifest.webmanifest
supabase/schema.sql       # profiles + practice_sessions + RLS + signup trigger
```

## Features built so far

1. **Breathing library & session UX** — featured Box Breathing, technique grid, orb UI, Start/Pause/Restart, sets counter.
2. **Modular patterns** — `data/patterns.ts` (Box, 4-7-8, Equal, Resonance, Alternate Nostril, stubs, etc.).
3. **Supabase auth** — register / login / logout; profiles auto-created; progress persisted when signed in.
4. **Weekly progress sidebar** — minutes vs goal, streak, recent sessions (empty for guests).
5. **Guest mode** — no forced login; soft “Save progress” banner; Box Breathing only for guests.
6. **Haptics** — vibrate on phase change; On/Off in session extras (localStorage).
7. **Ambient audio** — Rain / Meditation loops, volume slider, sync with run/pause (localStorage).
8. **PWA** — installable, offline page, service worker via next-pwa (prod builds).
9. **Login motion** — Headspace-like ambient blobs / cycling phrases (mount-safe for hydration).
10. **Perf** — shared `(main)` layout, React `cache()` for auth/progress, client `staleTimes`, loading skeletons.
11. **Security headers** — CSP, `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, HSTS; `poweredByHeader: false`.
12. **Vercel Analytics** wired in root layout.
13. **Mobile Brave fixes** — ethereum stub + hydration-safe login/forms.

## Env & deploy notes

```bash
# .env.local / Vercel
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # public anon key only — never service_role as NEXT_PUBLIC_
```

- Run `supabase/schema.sql` once in Supabase SQL Editor.
- Auth URL config: set Site URL + redirect URLs to the Vercel domain.
- Optional: disable “Confirm email” for easier testing.
- **Deploy:** merge/push to `main` → Vercel auto-deploys. Supabase does not redeploy app code; only re-run SQL if schema changes.
- PWA/SW fully active on **production HTTPS**, not `next dev`.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Conventions for future work

- Prefer editing **CSS variables** in `globals.css` over hardcoding colors (Stitch/zen dark theme).
- Add techniques only in `data/patterns.ts` (+ icon in `PatternIcon` if needed).
- Keep guest allowlist in `lib/guestAccess.ts`.
- Client prefs keys live in `lib/preferences.ts`.
- Do not introduce `NEXT_PUBLIC_` for secrets.
