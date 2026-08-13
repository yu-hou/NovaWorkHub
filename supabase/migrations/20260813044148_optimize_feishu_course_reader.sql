alter table public.course_contents
  add column if not exists embed_src text,
  add column if not exists embed_src_source_url text,
  add column if not exists embed_src_updated_at timestamptz;

comment on column public.course_contents.embed_src is
  'Canonical Feishu component URL resolved from feishu_doc_url.';

create table if not exists public.feishu_runtime_cache (
  cache_key text primary key,
  cache_value text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

comment on table public.feishu_runtime_cache is
  'Server-only short-lived cache for Feishu app tokens and JSAPI tickets.';

alter table public.feishu_runtime_cache enable row level security;
revoke all on table public.feishu_runtime_cache from anon, authenticated;
grant select, insert, update, delete on table public.feishu_runtime_cache to service_role;

drop policy if exists "Service role manages Feishu runtime cache"
  on public.feishu_runtime_cache;

create policy "Service role manages Feishu runtime cache"
  on public.feishu_runtime_cache
  for all
  to service_role
  using (true)
  with check (true);
