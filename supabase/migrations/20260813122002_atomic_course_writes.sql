create or replace function public.admin_create_course(
  input_category_id bigint,
  input_title text,
  input_summary text,
  input_cover text,
  input_learners integer,
  input_views bigint,
  input_member_only boolean,
  input_published boolean,
  input_sort_order integer,
  input_feishu_doc_url text
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_course_id bigint;
begin
  insert into public.courses (
    category_id, title, summary, cover, learners, views,
    is_member_only, is_published, sort_order
  ) values (
    input_category_id, input_title, input_summary, input_cover,
    input_learners, input_views, input_member_only, input_published,
    input_sort_order
  )
  returning id into new_course_id;

  insert into public.course_contents (course_id, feishu_doc_url)
  values (new_course_id, input_feishu_doc_url);

  return new_course_id;
end;
$$;

revoke all on function public.admin_create_course(
  bigint, text, text, text, integer, bigint, boolean, boolean, integer, text
) from public, anon;
grant execute on function public.admin_create_course(
  bigint, text, text, text, integer, bigint, boolean, boolean, integer, text
) to authenticated;

create or replace function public.admin_swap_course_order(
  first_course_id bigint,
  first_sort_order integer,
  second_course_id bigint,
  second_sort_order integer
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  updated_count integer;
begin
  update public.courses
  set sort_order = case id
    when first_course_id then first_sort_order
    when second_course_id then second_sort_order
  end
  where id in (first_course_id, second_course_id);

  get diagnostics updated_count = row_count;
  if updated_count <> 2 then
    raise exception '课程不存在或排序目标重复';
  end if;
end;
$$;

revoke all on function public.admin_swap_course_order(
  bigint, integer, bigint, integer
) from public, anon;
grant execute on function public.admin_swap_course_order(
  bigint, integer, bigint, integer
) to authenticated;
