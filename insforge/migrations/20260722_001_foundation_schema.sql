create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  phone text,
  location text,
  current_title text,
  experience_level text,
  years_experience integer,
  skills text[] not null default '{}',
  industries text[] not null default '{}',
  work_experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '{}'::jsonb,
  job_titles_seeking text[] not null default '{}',
  remote_preference text,
  preferred_locations text[] not null default '{}',
  salary_expectation text,
  cover_letter_tone text,
  linkedin_url text,
  portfolio_url text,
  work_authorization text,
  resume_pdf_url text,
  is_complete boolean not null default false,
  completion_percentage integer not null default 0,
  missing_fields text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_experience_level_check
    check (experience_level is null or experience_level in ('junior', 'mid', 'senior', 'lead')),
  constraint profiles_years_experience_check
    check (years_experience is null or years_experience >= 0),
  constraint profiles_remote_preference_check
    check (remote_preference is null or remote_preference in ('remote', 'onsite', 'hybrid', 'any')),
  constraint profiles_cover_letter_tone_check
    check (cover_letter_tone is null or cover_letter_tone in ('formal', 'casual', 'enthusiastic')),
  constraint profiles_work_authorization_check
    check (work_authorization is null or work_authorization in ('citizen', 'permanent_resident', 'visa_required')),
  constraint profiles_completion_percentage_check
    check (completion_percentage between 0 and 100),
  constraint profiles_work_experience_array_check
    check (jsonb_typeof(work_experience) = 'array'),
  constraint profiles_work_experience_limit_check
    check (jsonb_array_length(work_experience) <= 3),
  constraint profiles_education_object_check
    check (jsonb_typeof(education) = 'object')
);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'running',
  job_title_searched text not null,
  location_searched text,
  jobs_found integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint agent_runs_id_user_id_unique unique (id, user_id),
  constraint agent_runs_status_check check (status in ('running', 'completed', 'failed')),
  constraint agent_runs_jobs_found_check check (jobs_found >= 0),
  constraint agent_runs_completed_at_check
    check (completed_at is null or completed_at >= started_at)
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid,
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null,
  source_url text not null,
  external_apply_url text not null,
  title text not null,
  company text not null,
  location text,
  salary text,
  job_type text,
  about_role text,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  nice_to_have text[] not null default '{}',
  benefits text[] not null default '{}',
  about_company text,
  match_score integer not null,
  match_reason text not null,
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  company_research jsonb,
  found_at timestamptz not null default now(),
  constraint jobs_id_user_id_unique unique (id, user_id),
  constraint jobs_run_owner_fkey
    foreign key (run_id, user_id)
    references public.agent_runs(id, user_id)
    on delete cascade,
  constraint jobs_source_check check (source in ('search', 'url')),
  constraint jobs_search_run_check check (source <> 'search' or run_id is not null),
  constraint jobs_job_type_check
    check (job_type is null or job_type in ('fulltime', 'parttime', 'contract')),
  constraint jobs_match_score_check check (match_score between 0 and 100),
  constraint jobs_company_research_object_check
    check (company_research is null or jsonb_typeof(company_research) = 'object')
);

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  level text not null default 'info',
  job_id uuid,
  created_at timestamptz not null default now(),
  constraint agent_logs_run_owner_fkey
    foreign key (run_id, user_id)
    references public.agent_runs(id, user_id)
    on delete cascade,
  constraint agent_logs_job_owner_fkey
    foreign key (job_id, user_id)
    references public.jobs(id, user_id)
    on delete set null (job_id),
  constraint agent_logs_level_check
    check (level in ('info', 'success', 'warning', 'error'))
);

create index if not exists agent_runs_user_started_idx
  on public.agent_runs (user_id, started_at desc);
create index if not exists jobs_user_found_idx
  on public.jobs (user_id, found_at desc);
create index if not exists jobs_user_match_idx
  on public.jobs (user_id, match_score desc);
create index if not exists jobs_run_idx
  on public.jobs (run_id);
create index if not exists jobs_user_researched_idx
  on public.jobs (user_id, found_at desc)
  where company_research is not null;
create index if not exists agent_logs_run_created_idx
  on public.agent_logs (run_id, created_at);
create index if not exists agent_logs_user_created_idx
  on public.agent_logs (user_id, created_at desc);
create index if not exists agent_logs_job_idx
  on public.agent_logs (job_id)
  where job_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.profile ->> 'full_name', new.profile ->> 'name')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_trigger
    where tgname = 'auth_user_create_profile'
      and tgrelid = 'auth.users'::regclass
      and not tgisinternal
  ) then
    create trigger auth_user_create_profile
    after insert or update of email, profile on auth.users
    for each row execute function public.create_profile_for_auth_user();
  end if;
end;
$$;

insert into public.profiles (id, email, full_name)
select
  users.id,
  users.email,
  coalesce(users.profile ->> 'full_name', users.profile ->> 'name')
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name);

alter table public.profiles enable row level security;
alter table public.agent_runs enable row level security;
alter table public.jobs enable row level security;
alter table public.agent_logs enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own on public.profiles
  for delete to authenticated
  using (id = auth.uid());

drop policy if exists agent_runs_select_own on public.agent_runs;
create policy agent_runs_select_own on public.agent_runs
  for select to authenticated
  using (user_id = auth.uid());
drop policy if exists agent_runs_insert_own on public.agent_runs;
create policy agent_runs_insert_own on public.agent_runs
  for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists agent_runs_update_own on public.agent_runs;
create policy agent_runs_update_own on public.agent_runs
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists agent_runs_delete_own on public.agent_runs;
create policy agent_runs_delete_own on public.agent_runs
  for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists jobs_select_own on public.jobs;
create policy jobs_select_own on public.jobs
  for select to authenticated
  using (user_id = auth.uid());
drop policy if exists jobs_insert_own on public.jobs;
create policy jobs_insert_own on public.jobs
  for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists jobs_update_own on public.jobs;
create policy jobs_update_own on public.jobs
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists jobs_delete_own on public.jobs;
create policy jobs_delete_own on public.jobs
  for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists agent_logs_select_own on public.agent_logs;
create policy agent_logs_select_own on public.agent_logs
  for select to authenticated
  using (user_id = auth.uid());
drop policy if exists agent_logs_insert_own on public.agent_logs;
create policy agent_logs_insert_own on public.agent_logs
  for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists agent_logs_update_own on public.agent_logs;
create policy agent_logs_update_own on public.agent_logs
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
drop policy if exists agent_logs_delete_own on public.agent_logs;
create policy agent_logs_delete_own on public.agent_logs
  for delete to authenticated
  using (user_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.agent_runs to authenticated;
grant select, insert, update, delete on public.jobs to authenticated;
grant select, insert, update, delete on public.agent_logs to authenticated;
