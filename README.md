# CareerDex

CareerDex is a Next.js + Supabase job application tracker. The app uses Supabase Auth for sessions and PostgreSQL Row Level Security for per-user records.

## Run locally

1. Create a Supabase project and apply the SQL files in `supabase/migrations` in order (or link the Supabase CLI and run `supabase db push`). The second migration adds indexes for faster application search.
2. Copy `.env.example` to `.env.local` and set the Supabase URL and anon key, the site origin, and any contact details you want shown on the Contact page.
3. In Supabase Auth URL Configuration, set the site URL and allow app callbacks such as `http://localhost:3000/auth/callback` and `https://careerdex.vercel.app/auth/callback` (use your deployed origin if it differs).
4. To enable Google sign-in, create a Web OAuth client in Google Cloud. Register Supabase’s callback URL, `https://<project-ref>.supabase.co/auth/v1/callback`, in Google Cloud. Then enable Google under Supabase Auth providers and enter the client ID and secret there. Keep the Google client secret in Supabase; it is not needed in this app’s env file.
5. Install packages with `npm install`, then run `npm run dev`.

## Current MVP foundation

- Email/password and Google signup/login, logout, and password reset.
- Supabase-backed dashboard, application create/edit, detail, status updates, status history, archive, and card/table browsing.
- Search and status filtering in the application list.
- Per-user PostgreSQL RLS and private resume storage bucket policies.
- Account preferences for future application defaults and display choices.

The configured Supabase project is required for persistent use. Do not put a Supabase service-role key in this app; the browser uses only the anon key and database row-level security. Configure the same environment variables in your hosting provider before deployment. Production hosting and Supabase availability depend on the selected plans; scheduled processing is not used by this MVP.

## Layout

- `src/app`: routes, auth, dashboard, application actions, and settings.
- `src/components`: shared navigation shell.
- `src/lib`: application domain helpers and Supabase clients.
- `supabase/migrations`: schema, constraints, indexes, and RLS.

