// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

function jsonError(detail: string, status: number) {
  return Response.json({ detail }, { status });
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (!ctx.userClaims?.id) return jsonError("请先登录后查看课程详情", 401);
    const { course_id: rawCourseId } = (await req.json()) as { course_id?: number };
    const courseId = Number(rawCourseId);
    if (!Number.isInteger(courseId) || courseId <= 0) return jsonError("无效课程", 400);

    const { data: course, error: courseError } = await ctx.supabase
      .from("courses")
      .select("id,title,summary,cover,learners,views,is_member_only,is_published,categories!inner(name,color_class)")
      .eq("id", courseId)
      .maybeSingle();
    if (courseError) return jsonError(courseError.message, 400);
    if (!course) return jsonError("课程不存在", 404);

    const { data: content, error: contentError } = await ctx.supabase
      .from("course_contents")
      .select("feishu_doc_url")
      .eq("course_id", courseId)
      .maybeSingle();
    if (contentError) return jsonError(contentError.message, 400);
    if (!content) return jsonError("该内容为会员专享，请开通会员后查看", 403);

    const { data: nextViews } = await ctx.supabaseAdmin.rpc(
      "increment_course_views_internal",
      { target_course_id: courseId },
    );
    const category = Array.isArray(course.categories)
      ? course.categories[0]
      : course.categories;

    return Response.json({
      id: course.id,
      title: course.title,
      category: category?.name ?? "",
      category_class: category?.color_class ?? "category-gold",
      summary: course.summary,
      cover: course.cover,
      learners: course.learners,
      views: typeof nextViews === "number" ? nextViews : course.views,
      is_member_only: course.is_member_only,
      feishu_doc_url: content.feishu_doc_url,
      can_access: true,
    });
  }),
};
