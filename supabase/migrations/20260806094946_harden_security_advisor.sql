-- Supabase's automatic-RLS event trigger invokes this function as its owner.
-- API roles never need to call it directly.
revoke all privileges on function public.rls_auto_enable() from public, anon, authenticated;
