# CareerDex

CareerDex is a Next.js + Supabase job application tracker. The app uses Supabase Auth for sessions and PostgreSQL Row Level Security for per-user records.

## Run locally

1. Create a Supabase project and apply the SQL files in `supabase/migrations` in order (or link the Supabase CLI and run `supabase db push`). The second migration adds indexes for faster application search.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally `NEXT_PUBLIC_SITE_URL` to your local or production origin.
3. In Supabase Auth, configure the site URL and allow the auth callback at `/auth/callback`.
4. Install packages with `npm install`, then run `npm run dev`.

## Current MVP foundation

- Email/password signup, login, logout, and password reset.
- Supabase-backed dashboard, application create/edit, detail, status updates, status history, archive, and card/table browsing.
- Search and status filtering in the application list.
- Per-user PostgreSQL RLS and private resume storage bucket policies.
- Account preferences for future application defaults and display choices.

The configured Supabase project is required for persistent use. No database service-role key is used in the browser. Configure Vercel environment variables with the same public project URL and anon key before deployment. Production hosting and Supabase availability depend on the selected plans; scheduled processing is not used by this MVP.

## Layout

- `src/app`: routes, auth, dashboard, application actions, and settings.
- `src/components`: shared navigation shell.
- `src/lib`: application domain helpers and Supabase clients.
- `supabase/migrations`: schema, constraints, indexes, and RLS.

