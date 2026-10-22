create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  timezone text not null default 'Asia/Kolkata',
  date_format text not null default 'DD MMM YYYY',
  currency text not null default 'INR',
  theme text not null default 'system',
  preferences jsonb not null default '{"default_status":"Applied","default_opportunity_type":"Off-campus","default_employment_type":"Full-time","default_work_mode":"Not specified","default_source":"Company Website","default_location":"","follow_up_interval_days":7,"default_view":"cards","default_sort":"newest","analytics_range":"30d"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  job_title text not null,
  job_url text,
  careers_url text,
  description text,
  location text,
  work_mode text not null default 'Not specified' check (work_mode in ('On-site','Hybrid','Remote','Not specified')),
  employment_type text not null default 'Full-time' check (employment_type in ('Full-time','Internship','Part-time','Contract','Other')),
  category text,
  requirements text,
  application_date date not null default current_date,
  status text not null default 'Applied' check (status in ('Applied','Assessment','Interview','Offer','Rejected','Withdrawn','On Hold')),
  source text,
  opportunity_type text,
  applicant_portal_url text,
  resume_version text,
  salary_min numeric,
  salary_max numeric,
  salary_period text,
  salary_currency text not null default 'INR',
  recruiter_name text,
  recruiter_contact text,
  expected_response_date date,
  follow_up_date date,
  notes text,
  last_response_at timestamptz,
  last_status_changed_at timestamptz not null default now(),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_salary_range check (salary_min is null or salary_max is null or salary_min <= salary_max)
);

create table if not exists public.application_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  event_type text not null,
  previous_status text,
  new_status text,
  note text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.application_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  body text not null,
  note_type text not null default 'note',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  title text not null,
  due_at timestamptz,
  task_type text not null default 'follow_up',
  completed_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_filters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists applications_owner_date_idx on public.applications(user_id, application_date desc);
create index if not exists applications_owner_status_idx on public.applications(user_id, status);
create index if not exists applications_owner_company_idx on public.applications(user_id, company_name);
create index if not exists applications_owner_follow_up_idx on public.applications(user_id, follow_up_date) where archived_at is null;
create index if not exists application_events_owner_app_idx on public.application_events(user_id, application_id, occurred_at);
create index if not exists tasks_owner_due_idx on public.tasks(user_id, due_at) where completed_at is null and dismissed_at is null;

create or replace function public.handle_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.profiles(id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name'); return new; end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

do $$ declare t text; begin
  foreach t in array array['profiles','applications','application_events','application_notes','tasks','resumes','saved_filters'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists owner_all on public.%I', t);
    execute format('create policy owner_all on public.%I for all using (id = auth.uid()) with check (id = auth.uid())', t);
  end loop;
end $$;
-- Per-record tables use user_id ownership; profiles use id.
drop policy if exists owner_all on public.applications;
create policy owner_all on public.applications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists owner_all on public.application_events;
create policy owner_all on public.application_events for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists owner_all on public.application_notes;
create policy owner_all on public.application_notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists owner_all on public.tasks;
create policy owner_all on public.tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists owner_all on public.resumes;
create policy owner_all on public.resumes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists owner_all on public.saved_filters;
create policy owner_all on public.saved_filters for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) on conflict (id) do nothing;
create policy "Users can access own resumes" on storage.objects for all using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

do $$ declare t text; begin
  foreach t in array array['profiles','applications','tasks'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.handle_updated_at()', t);
  end loop;
end $$;
