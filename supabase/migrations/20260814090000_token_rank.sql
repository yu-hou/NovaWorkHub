create table public.token_rank_members (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  handle text not null check (char_length(btrim(handle)) between 2 and 40),
  city text not null default '' check (char_length(city) <= 80),
  join_board boolean not null default true,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index token_rank_members_handle_lower_key
  on public.token_rank_members (lower(handle));

create table public.token_rank_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  label text not null default '本机客户端' check (char_length(btrim(label)) between 1 and 80),
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index token_rank_devices_user_id_idx on public.token_rank_devices(user_id);

create table public.token_rank_usage (
  device_id uuid not null references public.token_rank_devices(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null,
  tool text not null check (char_length(btrim(tool)) between 1 and 48),
  model text not null default 'unknown' check (char_length(btrim(model)) between 1 and 160),
  input_tokens bigint not null default 0 check (input_tokens >= 0),
  output_tokens bigint not null default 0 check (output_tokens >= 0),
  cache_read_tokens bigint not null default 0 check (cache_read_tokens >= 0),
  cache_write_tokens bigint not null default 0 check (cache_write_tokens >= 0),
  updated_at timestamptz not null default now(),
  primary key (device_id, usage_date, tool, model)
);

create index token_rank_usage_user_date_idx on public.token_rank_usage(user_id, usage_date desc);
create index token_rank_usage_date_idx on public.token_rank_usage(usage_date desc);

create trigger token_rank_members_set_updated_at
before update on public.token_rank_members
for each row execute function private.set_updated_at();

alter table public.token_rank_members enable row level security;
alter table public.token_rank_devices enable row level security;
alter table public.token_rank_usage enable row level security;

-- 浏览器不直接读写 Token Rank 表；统一经过 Edge Function 校验身份和设备密钥。
create policy token_rank_members_no_direct_access
on public.token_rank_members
for all to anon, authenticated
using (false)
with check (false);

create policy token_rank_devices_no_direct_access
on public.token_rank_devices
for all to anon, authenticated
using (false)
with check (false);

create policy token_rank_usage_no_direct_access
on public.token_rank_usage
for all to anon, authenticated
using (false)
with check (false);

grant all on public.token_rank_members, public.token_rank_devices, public.token_rank_usage to service_role;

create or replace function public.token_rank_leaderboard_internal(window_days integer default 7)
returns table (
  rank bigint,
  user_id uuid,
  handle text,
  city text,
  total_tokens bigint,
  fresh_tokens bigint,
  input_tokens bigint,
  output_tokens bigint,
  cache_read_tokens bigint,
  cache_write_tokens bigint,
  by_tool jsonb
)
language sql
security invoker
set search_path = ''
as $$
  with ranked_usage as (
    select
      usage.user_id,
      usage.tool,
      sum(usage.input_tokens + usage.output_tokens + usage.cache_read_tokens + usage.cache_write_tokens)::bigint as total_tokens,
      sum(usage.input_tokens + usage.output_tokens)::bigint as fresh_tokens,
      sum(usage.input_tokens)::bigint as input_tokens,
      sum(usage.output_tokens)::bigint as output_tokens,
      sum(usage.cache_read_tokens)::bigint as cache_read_tokens,
      sum(usage.cache_write_tokens)::bigint as cache_write_tokens
    from public.token_rank_usage usage
    where usage.usage_date >= current_date - greatest(window_days - 1, 0)
    group by usage.user_id, usage.tool
  ), per_user as (
    select
      member.user_id,
      member.handle,
      member.city,
      sum(usage.total_tokens)::bigint as total_tokens,
      sum(usage.fresh_tokens)::bigint as fresh_tokens,
      sum(usage.input_tokens)::bigint as input_tokens,
      sum(usage.output_tokens)::bigint as output_tokens,
      sum(usage.cache_read_tokens)::bigint as cache_read_tokens,
      sum(usage.cache_write_tokens)::bigint as cache_write_tokens,
      jsonb_object_agg(usage.tool, usage.total_tokens) as by_tool
    from public.token_rank_members member
    join ranked_usage usage on usage.user_id = member.user_id
    where member.join_board and member.is_public
    group by member.user_id, member.handle, member.city
  )
  select
    row_number() over (order by total_tokens desc, handle collate "C") as rank,
    user_id, handle, city, total_tokens, fresh_tokens,
    input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, by_tool
  from per_user
  where total_tokens > 0
  order by rank;
$$;

revoke all on function public.token_rank_leaderboard_internal(integer) from public, anon, authenticated;
grant execute on function public.token_rank_leaderboard_internal(integer) to service_role;
