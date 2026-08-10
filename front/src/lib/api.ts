import { getSupabase } from "@/lib/supabase";

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

type CategoryRow = {
  id: number;
  name: string;
  color_class: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

type CourseRow = {
  id: number;
  category_id: number;
  title: string;
  summary: string;
  cover: string;
  learners: number;
  views: number;
  is_member_only: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  categories?: CategoryRow | CategoryRow[];
  course_contents?: { feishu_doc_url: string } | { feishu_doc_url: string }[];
};

function fail(error: { message?: string; code?: string } | null, fallback: string): never {
  let detail = error?.message || fallback;
  if (error?.code === "23505") detail = "记录已存在，请勿重复创建";
  if (error?.code === "23503") detail = "该记录仍被其他数据使用，暂时不能删除";
  if (error?.code === "42501") detail = "权限不足，请确认当前账号是管理员";
  throw new ApiError(400, detail);
}

function one<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

async function invoke<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const supabase = getSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session?.access_token) {
    throw new ApiError(401, "登录状态已失效，请重新登录");
  }
  const call = (accessToken: string) =>
    supabase.functions.invoke(name, {
      body,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

  let result = await call(sessionData.session.access_token);
  const firstContext = result.error && "context" in result.error ? result.error.context : null;
  if (firstContext instanceof Response && firstContext.status === 401) {
    const { data: refreshedData, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError || !refreshedData.session?.access_token) {
      throw new ApiError(401, "登录状态已失效，请重新登录");
    }
    result = await call(refreshedData.session.access_token);
  }

  const { data, error } = result;
  if (!error) return data as T;

  const context = "context" in error ? error.context : null;
  if (context instanceof Response) {
    const status = context.status;
    try {
      const payload = (await context.json()) as { detail?: string; message?: string };
      throw new ApiError(status, payload.detail || payload.message || error.message);
    } catch (parseError) {
      if (parseError instanceof ApiError) throw parseError;
      throw new ApiError(status, error.message);
    }
  }
  const message = error.message || "请求失败";
  if (/Failed to send a request to the Edge Function/i.test(message)) {
    throw new ApiError(
      502,
      `无法调用云函数 ${name}。请确认该 Edge Function 已部署到当前 Supabase 项目`,
    );
  }
  throw new ApiError(400, message);
}

async function currentAccess() {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  if (!data.session) return { loggedIn: false, member: false };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role,is_member,is_active")
    .eq("id", data.session.user.id)
    .maybeSingle();
  return {
    loggedIn: Boolean(profile?.is_active),
    member: Boolean(profile?.is_active && (profile.is_member || profile.role === "admin")),
  };
}

function courseAdminOut(row: CourseRow) {
  const category = one(row.categories);
  const content = one(row.course_contents);
  return {
    id: row.id,
    title: row.title,
    category: category?.name ?? "",
    category_class: category?.color_class ?? "category-gold",
    summary: row.summary,
    cover: row.cover,
    learners: row.learners,
    views: row.views,
    is_member_only: row.is_member_only,
    is_published: row.is_published,
    sort_order: row.sort_order,
    feishu_doc_url: content?.feishu_doc_url ?? "",
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const supabase = getSupabase();
  const method = (options.method || "GET").toUpperCase();
  const body = (options.body ?? {}) as Record<string, unknown>;

  if (path === "/api/courses" && method === "GET") {
    const [{ data: categories, error: categoryError }, { data: courses, error: courseError }, access] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order").order("id"),
        supabase
          .from("courses")
          .select("*,categories!inner(*)")
          .eq("is_published", true)
          .order("sort_order")
          .order("id"),
        currentAccess(),
      ]);
    if (categoryError) fail(categoryError, "分类加载失败");
    if (courseError) fail(courseError, "课程加载失败");
    const courseRows = (courses ?? []) as unknown as CourseRow[];
    const categoryRows = (categories ?? []) as CategoryRow[];
    const counts = new Map<number, number>();
    for (const course of courseRows) {
      counts.set(course.category_id, (counts.get(course.category_id) ?? 0) + 1);
    }
    return {
      searchPlaceholder: "搜索课程",
      defaultSort: "sequence",
      emptyText: "暂无课程。",
      categories: [
        { value: "", label: "全部", count: courseRows.length },
        ...categoryRows.map((category) => ({
          value: category.name,
          label: category.name,
          count: counts.get(category.id) ?? 0,
          categoryClass: category.color_class,
        })),
      ],
      cards: courseRows.map((course) => {
        const category = one(course.categories);
        const locked = !access.loggedIn || (course.is_member_only && !access.member);
        const cta = !access.loggedIn
          ? "登录后查看"
          : course.is_member_only && !access.member
            ? "会员专享"
            : "查看课程";
        return {
          id: String(course.id),
          title: course.title,
          category: category?.name,
          categoryClass: category?.color_class,
          summary: course.summary,
          cover: course.cover || null,
          learners: course.learners.toLocaleString("en-US"),
          views: course.views.toLocaleString("en-US"),
          cta,
          locked,
          href: `/learning/course/?id=${course.id}`,
        };
      }),
    } as T;
  }

  const courseDetail = path.match(/^\/api\/courses\/(\d+)$/);
  if (courseDetail && method === "GET") {
    return invoke<T>("course-access", { course_id: Number(courseDetail[1]) });
  }

  if (path === "/api/feishu/doc-signature" && method === "POST") {
    return invoke<T>("feishu-doc-signature", body as Record<string, unknown>);
  }

  if (path === "/api/admin/users" && method === "GET") {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) fail(error, "用户列表加载失败");
    return (data ?? []) as T;
  }
  if (path === "/api/admin/users" && method === "POST") {
    return invoke<T>("admin-users", { action: "create", body });
  }
  const userPatch = path.match(/^\/api\/admin\/users\/([0-9a-f-]+)$/i);
  if (userPatch && method === "PATCH") {
    return invoke<T>("admin-users", { action: "update", id: userPatch[1], body });
  }

  if (path === "/api/admin/categories" && method === "GET") {
    const [{ data: categories, error }, { data: courses, error: courseError }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order").order("id"),
      supabase.from("courses").select("category_id"),
    ]);
    if (error) fail(error, "分类列表加载失败");
    if (courseError) fail(courseError, "课程统计加载失败");
    const counts = new Map<number, number>();
    for (const row of courses ?? []) counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
    return (categories ?? []).map((category) => ({
      ...category,
      course_count: counts.get(category.id) ?? 0,
    })) as T;
  }
  if (path === "/api/admin/categories" && method === "POST") {
    const { data, error } = await supabase.from("categories").insert(body).select().single();
    if (error) fail(error, "创建分类失败");
    return data as T;
  }
  const categoryId = path.match(/^\/api\/admin\/categories\/(\d+)$/);
  if (categoryId && method === "PATCH") {
    const { data, error } = await supabase
      .from("categories")
      .update(body)
      .eq("id", Number(categoryId[1]))
      .select()
      .single();
    if (error) fail(error, "更新分类失败");
    return data as T;
  }
  if (categoryId && method === "DELETE") {
    const { error } = await supabase.from("categories").delete().eq("id", Number(categoryId[1]));
    if (error) fail(error, "删除分类失败");
    return { message: "分类已删除" } as T;
  }

  if (path === "/api/admin/courses" && method === "GET") {
    const { data, error } = await supabase
      .from("courses")
      .select("*,categories!inner(*),course_contents(*)")
      .order("sort_order")
      .order("id", { ascending: false });
    if (error) fail(error, "课程列表加载失败");
    return ((data ?? []) as unknown as CourseRow[]).map(courseAdminOut) as T;
  }
  if (path === "/api/admin/courses" && method === "POST") {
    const categoryName = String(body.category ?? "");
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", categoryName)
      .single();
    if (categoryError) fail(categoryError, "课程分类不存在");
    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        category_id: category.id,
        title: body.title,
        summary: body.summary ?? "",
        cover: body.cover ?? "",
        learners: body.learners ?? 0,
        views: body.views ?? 0,
        is_member_only: body.is_member_only ?? false,
        is_published: body.is_published ?? true,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();
    if (error) fail(error, "创建课程失败");
    const { error: contentError } = await supabase.from("course_contents").insert({
      course_id: course.id,
      feishu_doc_url: body.feishu_doc_url,
    });
    if (contentError) {
      await supabase.from("courses").delete().eq("id", course.id);
      fail(contentError, "保存课程内容失败");
    }
    return course as T;
  }
  const adminCourseId = path.match(/^\/api\/admin\/courses\/(\d+)$/);
  if (adminCourseId && method === "PATCH") {
    const id = Number(adminCourseId[1]);
    const coursePatch = { ...body };
    delete coursePatch.category;
    delete coursePatch.category_class;
    delete coursePatch.feishu_doc_url;
    if (body.category) {
      const { data: category, error } = await supabase
        .from("categories")
        .select("id")
        .eq("name", String(body.category))
        .single();
      if (error) fail(error, "课程分类不存在");
      coursePatch.category_id = category.id;
    }
    if (Object.keys(coursePatch).length) {
      const { error } = await supabase.from("courses").update(coursePatch).eq("id", id);
      if (error) fail(error, "更新课程失败");
    }
    if (body.feishu_doc_url !== undefined) {
      const { error } = await supabase
        .from("course_contents")
        .update({ feishu_doc_url: body.feishu_doc_url })
        .eq("course_id", id);
      if (error) fail(error, "更新课程内容失败");
    }
    return { id } as T;
  }
  if (adminCourseId && method === "DELETE") {
    const { error } = await supabase.from("courses").delete().eq("id", Number(adminCourseId[1]));
    if (error) fail(error, "删除课程失败");
    return { message: "课程已删除" } as T;
  }

  throw new ApiError(404, `未实现的数据操作：${method} ${path}`);
}

async function optimizeCover(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ApiError(400, "浏览器无法处理该图片");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("图片压缩失败"))), "image/webp", 0.82);
  });
  return { blob, width, height };
}

export async function apiUpload<T>(path: string, file: File): Promise<T> {
  if (path !== "/api/admin/uploads/cover") throw new ApiError(404, "未知上传路径");
  if (file.size > 4 * 1024 * 1024) throw new ApiError(400, "图片不能超过 4MB");
  const { blob, width, height } = await optimizeCover(file);
  const objectPath = `covers/${crypto.randomUUID()}.webp`;
  const supabase = getSupabase();
  const { error } = await supabase.storage.from("course-covers").upload(objectPath, blob, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) fail(error, "封面上传失败");
  const { data } = supabase.storage.from("course-covers").getPublicUrl(objectPath);
  return { url: data.publicUrl, width, height, bytes: blob.size } as T;
}

export function mediaUrl(path: string | null | undefined): string {
  return path ?? "";
}
