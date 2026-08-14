create policy catalog_contents_select_public
on public.catalog_contents for select
to anon
using (
  exists (
    select 1
    from public.catalog_items item
    where item.id = catalog_contents.catalog_item_id
      and item.is_published
      and not item.is_member_only
  )
);

grant select on public.catalog_contents to anon;
