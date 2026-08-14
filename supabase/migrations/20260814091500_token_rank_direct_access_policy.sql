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
