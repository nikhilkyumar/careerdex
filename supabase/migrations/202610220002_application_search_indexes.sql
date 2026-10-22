-- Accelerate application search for the contains/ILIKE filters used by the list.
create extension if not exists pg_trgm;

create index if not exists applications_company_search_idx on public.applications using gin (company_name gin_trgm_ops) where archived_at is null;
create index if not exists applications_title_search_idx on public.applications using gin (job_title gin_trgm_ops) where archived_at is null;
create index if not exists applications_location_search_idx on public.applications using gin (location gin_trgm_ops) where archived_at is null;
create index if not exists applications_description_search_idx on public.applications using gin (description gin_trgm_ops) where archived_at is null;
create index if not exists applications_notes_search_idx on public.applications using gin (notes gin_trgm_ops) where archived_at is null;
create index if not exists applications_job_url_search_idx on public.applications using gin (job_url gin_trgm_ops) where archived_at is null;
create index if not exists applications_recruiter_search_idx on public.applications using gin (recruiter_name gin_trgm_ops) where archived_at is null;
