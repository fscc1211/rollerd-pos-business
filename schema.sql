-- RollLerd POS & Business: Supabase foundation
-- Run in Supabase SQL Editor. Never put the service_role key in browser code.
create extension if not exists pgcrypto;

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'โรลเลิศ โรลดี',
  currency text not null default 'THB',
  created_at timestamptz not null default now()
);

create table if not exists public.shop_members (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (shop_id, user_id)
);

-- Single-owner phase: all shop data is accessible only to the authenticated owner.
-- Keep personal/private finance in its own table.
create table if not exists public.shop_state (
  shop_id uuid primary key references public.shops(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Owner-only private finance data is physically separated from shared shop data.
create table if not exists public.owner_private_finance (
  shop_id uuid primary key references public.shops(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  shop_id uuid not null references public.shops(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.current_shop_role(p_shop_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.shop_members
    where shop_id = p_shop_id and user_id = auth.uid() and active = true and role = 'owner');
$$;

create or replace function public.create_rolllerd_shop(p_shop_name text default 'โรลเลิศ โรลดี', p_initial_data jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public
as $$
declare v_shop_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if exists (select 1 from public.shop_members where user_id = auth.uid() and active = true) then
    raise exception 'This account already has a shop';
  end if;
  insert into public.shops(name) values (coalesce(nullif(trim(p_shop_name),''),'โรลเลิศ โรลดี')) returning id into v_shop_id;
  insert into public.shop_members(shop_id,user_id,role) values (v_shop_id,auth.uid(),'owner');
  insert into public.shop_state(shop_id,data,updated_by) values (v_shop_id,coalesce(p_initial_data,'{}'::jsonb),auth.uid());
  insert into public.audit_logs(shop_id,actor_id,action,entity,details)
  values (v_shop_id,auth.uid(),'shop_created','shop',jsonb_build_object('name',p_shop_name));
  return v_shop_id;
end;
$$;

create or replace function public.save_rolllerd_state(p_shop_id uuid, p_data jsonb, p_expected_version bigint default null)
returns bigint language plpgsql security definer set search_path = public
as $$
declare v_is_owner boolean; v_version bigint;
begin
  v_is_owner := public.current_shop_role(p_shop_id);
  if not coalesce(v_is_owner,false) then raise exception 'Owner access required'; end if;
  if jsonb_typeof(p_data) <> 'object' then raise exception 'State must be a JSON object'; end if;
  -- Prevent accidental overwrites when two devices save at the same time.
  select version into v_version from public.shop_state where shop_id = p_shop_id for update;
  if v_version is null then raise exception 'Shop state not initialized'; end if;
  if p_expected_version is not null and p_expected_version <> v_version then
    raise exception 'VERSION_CONFLICT: expected %, current %', p_expected_version, v_version;
  end if;
  update public.shop_state
    set data = p_data, version = version + 1, updated_at = now(), updated_by = auth.uid()
    where shop_id = p_shop_id returning version into v_version;
  insert into public.audit_logs(shop_id,actor_id,action,entity,details)
    values (p_shop_id,auth.uid(),'state_saved','shop_state',jsonb_build_object('version',v_version));
  return v_version;
end;
$$;

alter table public.shops enable row level security;
alter table public.shop_members enable row level security;
alter table public.shop_state enable row level security;
alter table public.owner_private_finance enable row level security;
alter table public.audit_logs enable row level security;

create policy "members can read their shop" on public.shops for select
  using (exists (select 1 from public.shop_members m where m.shop_id=id and m.user_id=auth.uid() and m.active));
create policy "members can read shop membership" on public.shop_members for select
  using (user_id=auth.uid() or public.current_shop_role(shop_id)='owner');
create policy "members can read shared state" on public.shop_state for select
  using (public.current_shop_role(shop_id));
create policy "owner can read private finance" on public.owner_private_finance for select
  using (public.current_shop_role(shop_id));
create policy "owner can write private finance" on public.owner_private_finance for all
  using (public.current_shop_role(shop_id)) with check (public.current_shop_role(shop_id));
create policy "members can read audit log" on public.audit_logs for select
  using (public.current_shop_role(shop_id));

revoke all on public.shops, public.shop_members, public.shop_state, public.owner_private_finance, public.audit_logs from anon;
grant select on public.shops, public.shop_members, public.shop_state, public.audit_logs to authenticated;
grant select, insert, update, delete on public.owner_private_finance to authenticated;
grant execute on function public.create_rolllerd_shop(text,jsonb) to authenticated;
grant execute on function public.save_rolllerd_state(uuid,jsonb,bigint) to authenticated;
grant execute on function public.current_shop_role(uuid) to authenticated;
