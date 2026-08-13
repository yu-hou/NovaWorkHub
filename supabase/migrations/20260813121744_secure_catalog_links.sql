create table public.catalog_contents (
  catalog_item_id bigint primary key references public.catalog_items(id) on delete cascade,
  href text not null check (
    length(btrim(href)) between 8 and 2048
    and href ~ '^https://'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.catalog_contents (catalog_item_id, href)
select id, btrim(href)
from public.catalog_items
where href is not null and btrim(href) <> ''
on conflict (catalog_item_id) do update set href = excluded.href;

alter table public.catalog_items drop column href;

create trigger catalog_contents_set_updated_at
before update on public.catalog_contents
for each row execute function private.set_updated_at();

alter table public.catalog_contents enable row level security;

create policy catalog_contents_select_entitled
on public.catalog_contents for select
to authenticated
using (
  exists (
    select 1
    from public.catalog_items item
    join public.profiles profile on profile.id = (select auth.uid())
    where item.id = catalog_contents.catalog_item_id
      and profile.is_active
      and (item.is_published or profile.role = 'admin')
      and (not item.is_member_only or profile.is_member or profile.role = 'admin')
  )
);

create policy catalog_contents_insert_admin
on public.catalog_contents for insert
to authenticated
with check ((select private.is_admin()));

create policy catalog_contents_update_admin
on public.catalog_contents for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy catalog_contents_delete_admin
on public.catalog_contents for delete
to authenticated
using ((select private.is_admin()));

grant select, insert, update, delete on public.catalog_contents to authenticated;
grant all on public.catalog_contents to service_role;
