-- RollLerd POS & Business: owner-only Supabase setup
-- Run this entire file in Supabase SQL Editor. Safe to re-run.

create table if not exists public.owner_state (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.owner_state enable row level security;

-- Authenticated owner can read only their own row.
drop policy if exists "owner can read own state" on public.owner_state;
create policy "owner can read own state"
  on public.owner_state
  for select
  to authenticated
  using (auth.uid() = owner_id);

-- Browser clients cannot write directly to the table.
revoke all on public.owner_state from anon, authenticated;
grant select on public.owner_state to authenticated;

-- Writes go through this version-checked function.
-- SECURITY DEFINER allows this function to write despite the table having no
-- INSERT/UPDATE policy. The function always uses auth.uid() as owner_id.
create or replace function public.save_my_rolllerd_state(
  p_data jsonb,
  p_expected_version bigint
)
returns bigint
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  uid uuid := auth.uid();
  current_version bigint;
begin
  if uid is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if p_data is null then
    raise exception 'STATE_DATA_REQUIRED';
  end if;

  select s.version into current_version
  from public.owner_state as s
  where s.owner_id = uid
  for update;

  if not found then
    if coalesce(p_expected_version, -1) <> 0 then
      raise exception 'STATE_CONFLICT';
    end if;

    insert into public.owner_state(owner_id, data, version, updated_at)
    values (uid, p_data, 1, now());
    return 1;
  end if;

  if current_version <> p_expected_version then
    raise exception 'STATE_CONFLICT';
  end if;

  update public.owner_state
  set data = p_data,
      version = current_version + 1,
      updated_at = now()
  where owner_id = uid;

  return current_version + 1;
end;
$$;

revoke all on function public.save_my_rolllerd_state(jsonb, bigint) from public, anon;
grant execute on function public.save_my_rolllerd_state(jsonb, bigint) to authenticated;
