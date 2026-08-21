-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  weekly_goal_min integer not null default 60,
  created_at timestamptz not null default now()
);

-- Completed breathing sessions
create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pattern_id text not null,
  pattern_name text not null,
  duration_min integer not null check (duration_min > 0),
  accent text not null,
  mood text,
  completed_at timestamptz not null default now()
);

create index if not exists practice_sessions_user_completed_idx
  on public.practice_sessions (user_id, completed_at desc);

alter table public.practice_sessions add column if not exists mood text;

alter table public.profiles enable row level security;
alter table public.practice_sessions enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Practice session policies
drop policy if exists "sessions_select_own" on public.practice_sessions;
create policy "sessions_select_own"
  on public.practice_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "sessions_insert_own" on public.practice_sessions;
create policy "sessions_insert_own"
  on public.practice_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "sessions_delete_own" on public.practice_sessions;
create policy "sessions_delete_own"
  on public.practice_sessions for delete
  using (auth.uid() = user_id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'friend'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
