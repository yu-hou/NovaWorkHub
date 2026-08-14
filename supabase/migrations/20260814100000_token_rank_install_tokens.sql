create table public.token_rank_install_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  device_id uuid references public.token_rank_devices(id) on delete set null,
  created_at timestamptz not null default now()
);

create index token_rank_install_tokens_user_id_idx on public.token_rank_install_tokens(user_id);
alter table public.token_rank_install_tokens enable row level security;
create policy token_rank_install_tokens_no_direct_access on public.token_rank_install_tokens for all to anon, authenticated using (false) with check (false);
grant all on public.token_rank_install_tokens to service_role;
