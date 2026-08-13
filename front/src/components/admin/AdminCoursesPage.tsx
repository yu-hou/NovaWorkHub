"use client";

import Link from "next/link";
import { DragEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { type AdminCategory } from "@/components/admin/AdminCategoriesPage";
import { AdminShell, friendlyError } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch, apiUpload, mediaUrl } from "@/lib/api";

type AdminCourse = {
  id: number;
  title: string;
  category: string;
  category_class: string;
  summary: string;
  cover: string;
  learners: number;
  views: number;
  is_member_only: boolean;
  is_published: boolean;
  sort_order: number;
  feishu_doc_url: string;
};

type CourseForm = {
  title: string;
  category: string;
  category_class: string;
  summary: string;
  cover: string;
  is_member_only: boolean;
  is_published: boolean;
  feishu_doc_url: string;
};

const EMPTY_FORM: CourseForm = {
  title: "",
  category: "",
  category_class: "category-gold",
  summary: "",
  cover: "",
  is_member_only: false,
  is_published: true,
  feishu_doc_url: "",
};

export function AdminCoursesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deepLinkHandledRef = useRef(false);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 5200);
  };

  const activeCategories = categories.filter((c) => c.is_active);

  const resetForm = useCallback((categoryList = categories) => {
    const first = categoryList.find((c) => c.is_active);
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      category: first?.name || "",
      category_class: first?.color_class || "category-gold",
    });
    setMessage("");
    setError("");
  }, [categories]);

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [courseData, categoryData] = await Promise.all([
        apiFetch<AdminCourse[]>("/api/admin/courses"),
        apiFetch<AdminCategory[]>("/api/admin/categories"),
      ]);
      setCourses(courseData);
      setCategories(categoryData);
      setError("");
      setForm((f) => {
        if (f.category) return f;
        const first = categoryData.find((c) => c.is_active);
        if (!first) return f;
        return {
          ...f,
          category: first.name,
          category_class: first.color_class,
        };
      });
    } catch (err) {
      setError(friendlyError(err, "课程列表加载失败"));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  useEffect(() => {
    if (deepLinkHandledRef.current || courses.length === 0) return;
    const id = Number(new URLSearchParams(window.location.search).get("edit"));
    if (!Number.isInteger(id) || id <= 0) return;
    const course = courses.find((item) => item.id === id);
    if (!course) return;
    deepLinkHandledRef.current = true;
    setEditingId(course.id);
    setForm({
      title: course.title,
      category: course.category,
      category_class: course.category_class,
      summary: course.summary,
      cover: course.cover,
      is_member_only: course.is_member_only,
      is_published: course.is_published,
      feishu_doc_url: course.feishu_doc_url,
    });
    window.requestAnimationFrame(() => {
      document.getElementById("course-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("courseTitle")?.focus();
    });
  }, [courses]);

  const onCoverFile = async (file: File | null) => {
    if (!file) return;
    setMessage("");
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      const text = "封面图片不能超过 4MB";
      setError(text);
      showToast("err", text);
      return;
    }
    if (!file.type.startsWith("image/")) {
      const text = "请选择图片文件（JPG / PNG / WEBP / GIF）";
      setError(text);
      showToast("err", text);
      return;
    }
    setUploading(true);
    try {
      const res = await apiUpload<{ url: string; bytes: number }>(
        "/api/admin/uploads/cover",
        file,
      );
      setForm((f) => ({ ...f, cover: res.url }));
      const text = `封面上传成功（约 ${Math.round(res.bytes / 1024)}KB）`;
      setMessage(text);
      showToast("ok", text);
    } catch (err) {
      const text = friendlyError(err, "封面上传失败");
      setError(text);
      showToast("err", text);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!form.title.trim()) {
      const text = "请填写课程标题";
      setError(text);
      showToast("err", text);
      return;
    }
    if (!form.category) {
      const text = "请先在「分类管理」中创建分类，再选择分类";
      setError(text);
      showToast("err", text);
      return;
    }
    if (!form.feishu_doc_url.trim()) {
      const text = "请填写飞书文档链接";
      setError(text);
      showToast("err", text);
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(
        editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses",
        { method: editingId ? "PATCH" : "POST", body: form },
      );
      const text = editingId ? "课程修改已保存" : "课程创建成功";
      resetForm(activeCategories);
      setMessage(text);
      showToast("ok", text);
      await load();
    } catch (err) {
      const text = friendlyError(err, editingId ? "修改失败" : "创建失败");
      setError(text);
      showToast("err", text);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (course: AdminCourse) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      category: course.category,
      category_class: course.category_class,
      summary: course.summary,
      cover: course.cover,
      is_member_only: course.is_member_only,
      is_published: course.is_published,
      feishu_doc_url: course.feishu_doc_url,
    });
    setMessage("");
    setError("");
    window.requestAnimationFrame(() => {
      document.getElementById("course-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("courseTitle")?.focus();
    });
  };

  const onCoverDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (uploading || submitting) return;
    void onCoverFile(event.dataTransfer.files?.[0] ?? null);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("确认删除该课程？")) return;
    try {
      await apiFetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      showToast("ok", "课程已删除");
      await load();
    } catch (err) {
      const text = friendlyError(err, "删除失败");
      setError(text);
      showToast("err", text);
    }
  };

  const toggleMemberOnly = async (course: AdminCourse) => {
    try {
      await apiFetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        body: { is_member_only: !course.is_member_only },
      });
      showToast(
        "ok",
        course.is_member_only ? "已改为公开课程" : "已设为会员专享",
      );
      await load();
    } catch (err) {
      const text = friendlyError(err, "更新失败");
      setError(text);
      showToast("err", text);
    }
  };

  const moveCourse = async (course: AdminCourse, direction: "up" | "down") => {
    const currentIndex = courses.findIndex((item) => item.id === course.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= courses.length || reorderingId !== null) return;

    const reordered = [...courses];
    [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
    const normalized = reordered.map((item, index) => ({ ...item, sort_order: index + 1 }));
    setCourses(normalized);
    setReorderingId(course.id);
    setError("");
    try {
      await Promise.all(
        normalized.map((item) =>
          apiFetch(`/api/admin/courses/${item.id}`, {
            method: "PATCH",
            body: { sort_order: item.sort_order },
          }),
        ),
      );
      showToast("ok", direction === "up" ? "课程已上移" : "课程已下移");
      await load();
    } catch (err) {
      const text = friendlyError(err, "课程顺序更新失败");
      setError(text);
      showToast("err", text);
      await load();
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <AdminShell>
      <section className="view admin-page">
        {toast ? (
          <div className={`admin-toast ${toast.type === "ok" ? "is-ok" : "is-err"}`}>
            {toast.text}
          </div>
        ) : null}

        <header className="admin-page-header">
          <div>
            <h1>课程管理</h1>
            <p className="sub">
              绑定飞书文档或知识库链接。站内会优先嵌入；wiki 会自动解析为云文档。请开通 wiki:wiki:readonly（若用知识库），并把应用加为协作者。
            </p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>
            刷新
          </button>
        </header>

        <form
          className={`admin-form admin-form-panel admin-course-editor${editingId ? " is-editing" : ""}`}
          id="course-editor"
          onSubmit={onSave}
        >
          <div className="admin-editor-head">
            <div>
              <span className="admin-editor-kicker">{editingId ? `EDITING #${editingId}` : "NEW COURSE"}</span>
              <h2>{editingId ? "修改课程" : "上传新课程"}</h2>
              <p>填写展示信息、上传封面并绑定课程文档，保存后立即同步到课程页。</p>
            </div>
            {editingId ? (
              <button type="button" className="admin-editor-cancel" onClick={() => resetForm()}>
                取消修改
              </button>
            ) : null}
          </div>

          <div className="admin-course-editor-grid">
            <div className="admin-course-fields">
              <div className="admin-field admin-field-wide">
                <label htmlFor="courseTitle"><span>课程标题</span><small>必填</small></label>
                <input
                  id="courseTitle"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="例如：用 Codex 搭建第一个自动化工作流"
                  maxLength={255}
                  required
                />
                <span className="admin-field-count">{form.title.length}/255</span>
              </div>

              <div className="admin-field">
                <label htmlFor="courseCategory"><span>课程分类</span><small>必填</small></label>
                {activeCategories.length === 0 ? (
                  <p className="sub">暂无可用分类，请先去 <Link href="/admin/categories">分类管理</Link> 创建。</p>
                ) : (
                  <select
                    id="courseCategory"
                    value={form.category}
                    onChange={(e) => {
                      const opt = activeCategories.find((c) => c.name === e.target.value);
                      setForm((f) => ({ ...f, category: e.target.value, category_class: opt?.color_class || "category-gold" }));
                    }}
                    required
                  >
                    {activeCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                )}
              </div>

              <div className="admin-field admin-field-wide">
                <label htmlFor="courseSummary"><span>课程简介</span><small>用于课程卡片</small></label>
                <textarea
                  id="courseSummary"
                  rows={4}
                  maxLength={500}
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  placeholder="用一两句话说明课程目标、适合人群和学习收获。"
                />
                <span className="admin-field-count">{form.summary.length}/500</span>
              </div>

              <div className="admin-field admin-field-wide">
                <label htmlFor="courseFeishu"><span>飞书课程文档</span><small>必填</small></label>
                <div className="admin-url-input">
                  <span aria-hidden="true">↗</span>
                  <input
                    id="courseFeishu"
                    type="url"
                    value={form.feishu_doc_url}
                    onChange={(e) => setForm((f) => ({ ...f, feishu_doc_url: e.target.value }))}
                    placeholder="https://xxx.feishu.cn/docx/..."
                    required
                  />
                </div>
                <p className="admin-field-help">文档需设为“获得链接的人可阅读”，并将飞书应用添加为只读协作者。</p>
              </div>

              <div className="admin-field admin-field-wide admin-toggle-grid">
                <label className="admin-switch-card" htmlFor="courseMemberOnly">
                  <input
                    id="courseMemberOnly"
                    type="checkbox"
                    checked={form.is_member_only}
                    onChange={(e) => setForm((f) => ({ ...f, is_member_only: e.target.checked }))}
                  />
                  <span className="admin-switch" aria-hidden="true" />
                  <span><strong>会员专享</strong><small>仅会员和管理员可以打开课程内容</small></span>
                </label>
                <label className="admin-switch-card" htmlFor="coursePublished">
                  <input
                    id="coursePublished"
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                  />
                  <span className="admin-switch" aria-hidden="true" />
                  <span><strong>立即发布</strong><small>关闭后仅管理员可以看到该课程</small></span>
                </label>
              </div>
            </div>

            <aside className="admin-cover-studio">
              <div className="admin-cover-studio-head">
                <div><span>课程封面</span><small>推荐 16:9</small></div>
                {form.cover ? <button type="button" onClick={() => setForm((f) => ({ ...f, cover: "" }))}>移除</button> : null}
              </div>
              <div
                className={`admin-cover-dropzone${dragActive ? " is-dragging" : ""}${uploading ? " is-uploading" : ""}`}
                role="button"
                tabIndex={0}
                aria-label="选择或拖放课程封面"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setDragActive(false)}
                onDrop={onCoverDrop}
              >
                <input
                  ref={fileInputRef}
                  id="courseCoverFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploading || submitting}
                  onChange={(e) => { void onCoverFile(e.target.files?.[0] ?? null); e.target.value = ""; }}
                />
                {form.cover ? (
                  <img src={mediaUrl(form.cover)} alt="课程封面预览" />
                ) : (
                  <div className="admin-cover-empty">
                    <span className="admin-cover-upload-icon" aria-hidden="true">↑</span>
                    <strong>拖放封面到这里</strong>
                    <p>或点击选择图片</p>
                    <small>JPG、PNG、WEBP、GIF · 最大 4MB</small>
                  </div>
                )}
                {uploading ? <div className="admin-cover-progress"><span /><strong>正在压缩并上传…</strong></div> : null}
              </div>

              <div className="admin-card-live-preview">
                <span className="admin-card-preview-label">CARD PREVIEW</span>
                <div className="admin-card-preview-cover">
                  {form.cover ? <img src={mediaUrl(form.cover)} alt="" /> : <span>NOVA</span>}
                </div>
                <div className="admin-card-preview-copy">
                  <span className={`category-badge ${form.category_class}`}>{form.category || "未分类"}</span>
                  <h3>{form.title || "课程标题将在这里显示"}</h3>
                  <p>{form.summary || "补充简洁的课程介绍，帮助学习者快速了解内容。"}</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="admin-editor-actions">
            <div><strong>{editingId ? "正在修改已有课程" : "准备发布一门新课程"}</strong><small>封面会转为 WEBP 并上传至课程专用存储桶。</small></div>
            <button type="submit" className="admin-editor-submit" disabled={submitting || uploading || activeCategories.length === 0}>
              {submitting ? "保存中…" : editingId ? "保存修改" : "创建并上传课程"}
            </button>
          </div>
        </form>

        {message ? (
          <p className="admin-flash is-ok mt-12" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <div className="admin-flash is-err mt-12" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => void load()}>
              重试
            </button>
          </div>
        ) : null}

        {loading ? <p className="admin-status-inline">加载课程中…</p> : null}

        {!loading && courses.length === 0 && !error ? (
          <p className="admin-empty">还没有课程，先在上方创建一个吧。</p>
        ) : null}

        {!loading && courses.length > 0 ? (
          <section className="admin-course-library mt-12" aria-labelledby="course-library-title">
            <header className="admin-course-library-head">
              <div>
                <span className="admin-editor-kicker">COURSE LIBRARY</span>
                <h2 id="course-library-title">已创建课程</h2>
                <p>共 {courses.length} 门。使用卡片右侧按钮调整前台展示顺序，排在上方的课程会优先展示。</p>
              </div>
              <span className="admin-course-count">{courses.length} COURSES</span>
            </header>

            <div className="admin-course-admin-list">
              {courses.map((c, index) => (
                <article className="admin-course-manage-card" key={c.id}>
                  <div className="admin-course-manage-cover">
                    {c.cover ? <img src={mediaUrl(c.cover)} alt={`${c.title}封面`} /> : <span>NOVA</span>}
                    <b>#{String(index + 1).padStart(2, "0")}</b>
                  </div>

                  <div className="admin-course-manage-copy">
                    <div className="admin-course-manage-tags">
                      <span className={`category-badge ${c.category_class}`}>{c.category}</span>
                      <span className={`admin-pill${c.is_published ? " is-accent" : ""}`}>{c.is_published ? "已发布" : "草稿"}</span>
                      {c.is_member_only ? <span className="admin-pill is-member">会员专享</span> : <span className="admin-pill">公开课程</span>}
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.summary || "暂未填写课程简介。"}</p>
                    <div className="admin-course-manage-meta">
                      <span>课程 ID · {c.id}</span>
                      <span>{c.learners.toLocaleString()} 人学习</span>
                      <span>{c.views.toLocaleString()} 次浏览</span>
                      <a href={c.feishu_doc_url} target="_blank" rel="noreferrer">打开飞书文档 ↗</a>
                    </div>
                  </div>

                  <div className="admin-course-manage-controls">
                    <div className="admin-course-order-control" aria-label={`${c.title}展示顺序`}>
                      <span><small>前台顺序</small><strong>{String(index + 1).padStart(2, "0")}</strong></span>
                      <div>
                        <button type="button" disabled={index === 0 || reorderingId !== null} onClick={() => void moveCourse(c, "up")} aria-label={`上移${c.title}`}>↑<small>上移</small></button>
                        <button type="button" disabled={index === courses.length - 1 || reorderingId !== null} onClick={() => void moveCourse(c, "down")} aria-label={`下移${c.title}`}>↓<small>下移</small></button>
                      </div>
                    </div>
                    <div className="admin-course-manage-actions">
                      <button type="button" className="admin-action-primary" onClick={() => startEdit(c)}>修改详情</button>
                      <button type="button" onClick={() => void toggleMemberOnly(c)}>{c.is_member_only ? "改为公开" : "设为会员"}</button>
                      <Link href={`/learning/course?id=${c.id}`}>前台预览</Link>
                      <button type="button" className="is-danger" onClick={() => void onDelete(c.id)}>删除</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </AdminShell>
  );
}
