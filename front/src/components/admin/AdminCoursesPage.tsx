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

type CourseActionKind = "delete" | "access" | "publish";

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

function courseToForm(course: AdminCourse): CourseForm {
  return {
    title: course.title,
    category: course.category,
    category_class: course.category_class,
    summary: course.summary,
    cover: course.cover,
    is_member_only: course.is_member_only,
    is_published: course.is_published,
    feishu_doc_url: course.feishu_doc_url,
  };
}

export function AdminCoursesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [pendingCourseActions, setPendingCourseActions] = useState<Record<number, CourseActionKind>>({});
  const [courseToDelete, setCourseToDelete] = useState<AdminCourse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const deepLinkHandledRef = useRef(false);
  const loadSequenceRef = useRef(0);
  const toastTimerRef = useRef<number | null>(null);
  const [form, setForm] = useState<CourseForm>(EMPTY_FORM);
  const [formBaseline, setFormBaseline] = useState<CourseForm>(EMPTY_FORM);
  const hasUnsavedChanges = JSON.stringify(form) !== JSON.stringify(formBaseline);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((type: "ok" | "err", text: string) => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToast({ type, text });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, type === "ok" ? 3000 : 5200);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
  }, []);

  const activeCategories = categories.filter((c) => c.is_active);

  const resetForm = useCallback((categoryList = categories) => {
    const first = categoryList.find((c) => c.is_active);
    const nextForm = {
      ...EMPTY_FORM,
      category: first?.name || "",
      category_class: first?.color_class || "category-gold",
    };
    setEditingId(null);
    setForm(nextForm);
    setFormBaseline(nextForm);
    setFormError("");
  }, [categories]);

  const load = useCallback(async ({ background = false }: { background?: boolean } = {}) => {
    if (!isAdmin) {
      setLoading(false);
      return false;
    }
    const requestId = ++loadSequenceRef.current;
    if (background) setRefreshing(true);
    else setLoading(true);
    try {
      const [courseData, categoryData] = await Promise.all([
        apiFetch<AdminCourse[]>("/api/admin/courses"),
        apiFetch<AdminCategory[]>("/api/admin/categories"),
      ]);
      if (requestId !== loadSequenceRef.current) return false;
      setCourses(courseData);
      setCategories(categoryData);
      setLoadError("");
      const first = categoryData.find((c) => c.is_active);
      const initialForm = {
        ...EMPTY_FORM,
        category: first?.name || "",
        category_class: first?.color_class || "category-gold",
      };
      setForm((f) => {
        if (f.category) return f;
        return initialForm;
      });
      setFormBaseline((baseline) => baseline.category ? baseline : initialForm);
      return true;
    } catch (err) {
      if (requestId === loadSequenceRef.current) {
        setLoadError(friendlyError(err, "课程列表加载失败"));
      }
      return false;
    } finally {
      if (requestId === loadSequenceRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [isAdmin]);

  const refreshCourses = useCallback(async () => {
    const refreshed = await load({ background: true });
    if (refreshed) showToast("ok", "课程列表已刷新");
  }, [load, showToast]);

  const focusCourseEditor = useCallback(() => {
    window.requestAnimationFrame(() => {
      const editor = document.getElementById("course-editor");
      if (editor) {
        const top = window.scrollY + editor.getBoundingClientRect().top - 24;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
      document.getElementById("courseTitle")?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const confirmInternalNavigation = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.href === window.location.href) return;
      if (!window.confirm("课程内容尚未保存，确认离开当前页面吗？")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", confirmInternalNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", confirmInternalNavigation, true);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!courseToDelete) return;
    deleteCancelRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pendingCourseActions[courseToDelete.id]) {
        setCourseToDelete(null);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [courseToDelete, pendingCourseActions]);

  useEffect(() => {
    if (deepLinkHandledRef.current || courses.length === 0) return;
    const id = Number(new URLSearchParams(window.location.search).get("edit"));
    if (!Number.isInteger(id) || id <= 0) return;
    const course = courses.find((item) => item.id === id);
    if (!course) return;
    deepLinkHandledRef.current = true;
    const nextForm = courseToForm(course);
    setEditingId(course.id);
    setForm(nextForm);
    setFormBaseline(nextForm);
    focusCourseEditor();
  }, [courses, focusCourseEditor]);

  const onCoverFile = async (file: File | null) => {
    if (!file) return;
    setFormError("");
    if (file.size > 4 * 1024 * 1024) {
      const text = "封面图片不能超过 4MB";
      setFormError(text);
      showToast("err", text);
      return;
    }
    if (!file.type.startsWith("image/")) {
      const text = "请选择图片文件（JPG / PNG / WEBP / GIF）";
      setFormError(text);
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
      showToast("ok", text);
    } catch (err) {
      const text = friendlyError(err, "封面上传失败");
      setFormError(text);
      showToast("err", text);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      const text = "请填写课程标题";
      setFormError(text);
      showToast("err", text);
      return;
    }
    if (!form.category) {
      const text = "请先在「分类管理」中创建分类，再选择分类";
      setFormError(text);
      showToast("err", text);
      return;
    }
    if (!form.feishu_doc_url.trim()) {
      const text = "请填写飞书文档链接";
      setFormError(text);
      showToast("err", text);
      return;
    }
    setSubmitting(true);
    const courseTitle = form.title.trim();
    const isEditing = editingId !== null;
    try {
      await apiFetch(
        editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses",
        { method: editingId ? "PATCH" : "POST", body: form },
      );
      const text = isEditing
        ? `课程「${courseTitle}」修改已保存`
        : `课程「${courseTitle}」创建成功`;
      resetForm(activeCategories);
      showToast("ok", text);
      await load({ background: true });
    } catch (err) {
      const text = friendlyError(err, editingId ? "修改失败" : "创建失败");
      setFormError(text);
      showToast("err", text);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (course: AdminCourse) => {
    if (hasUnsavedChanges && !window.confirm("当前课程内容尚未保存，确认切换到另一门课程吗？")) return;
    const nextForm = courseToForm(course);
    setEditingId(course.id);
    setForm(nextForm);
    setFormBaseline(nextForm);
    setFormError("");
    focusCourseEditor();
  };

  const cancelEdit = () => {
    if (hasUnsavedChanges && !window.confirm("修改尚未保存，确认放弃这些更改吗？")) return;
    resetForm();
  };

  const onCoverDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (uploading || submitting) return;
    void onCoverFile(event.dataTransfer.files?.[0] ?? null);
  };

  const beginCourseAction = (courseId: number, kind: CourseActionKind) => {
    setPendingCourseActions((current) => ({ ...current, [courseId]: kind }));
  };

  const endCourseAction = (courseId: number) => {
    setPendingCourseActions((current) => {
      const next = { ...current };
      delete next[courseId];
      return next;
    });
  };

  const confirmDelete = async (course: AdminCourse) => {
    beginCourseAction(course.id, "delete");
    try {
      await apiFetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
      showToast("ok", `课程「${course.title}」已删除`);
      setCourseToDelete(null);
      if (editingId === course.id) resetForm(activeCategories);
      await load({ background: true });
    } catch (err) {
      const text = friendlyError(err, "删除失败");
      showToast("err", text);
    } finally {
      endCourseAction(course.id);
    }
  };

  const toggleMemberOnly = async (course: AdminCourse) => {
    beginCourseAction(course.id, "access");
    try {
      await apiFetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        body: { is_member_only: !course.is_member_only },
      });
      showToast(
        "ok",
        course.is_member_only
          ? `课程「${course.title}」已改为公开课程`
          : `课程「${course.title}」已设为会员专享`,
      );
      if (editingId === course.id) {
        setForm((current) => ({ ...current, is_member_only: !course.is_member_only }));
        setFormBaseline((current) => ({ ...current, is_member_only: !course.is_member_only }));
      }
      await load({ background: true });
    } catch (err) {
      const text = friendlyError(err, "更新失败");
      showToast("err", text);
    } finally {
      endCourseAction(course.id);
    }
  };

  const togglePublished = async (course: AdminCourse) => {
    beginCourseAction(course.id, "publish");
    try {
      await apiFetch(`/api/admin/courses/${course.id}`, {
        method: "PATCH",
        body: { is_published: !course.is_published },
      });
      showToast(
        "ok",
        course.is_published
          ? `课程「${course.title}」已下架并转为草稿`
          : `课程「${course.title}」已发布`,
      );
      if (editingId === course.id) {
        setForm((current) => ({ ...current, is_published: !course.is_published }));
        setFormBaseline((current) => ({ ...current, is_published: !course.is_published }));
      }
      await load({ background: true });
    } catch (err) {
      showToast("err", friendlyError(err, course.is_published ? "下架失败" : "发布失败"));
    } finally {
      endCourseAction(course.id);
    }
  };

  const moveCourse = async (course: AdminCourse, direction: "up" | "down") => {
    const currentIndex = courses.findIndex((item) => item.id === course.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= courses.length || reorderingId !== null) return;

    const reordered = [...courses];
    [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
    const normalized = reordered.map((item, index) => ({ ...item, sort_order: index + 1 }));
    const adjacent = courses[nextIndex];
    setCourses(normalized);
    setReorderingId(course.id);
    try {
      await apiFetch("/api/admin/courses/reorder", {
        method: "POST",
        body: {
          first_course_id: course.id,
          first_sort_order: adjacent.sort_order,
          second_course_id: adjacent.id,
          second_sort_order: course.sort_order,
        },
      });
      showToast(
        "ok",
        `课程「${course.title}」已${direction === "up" ? "上移" : "下移"}至第 ${nextIndex + 1} 位`,
      );
      await load({ background: true });
    } catch (err) {
      const text = friendlyError(err, "课程顺序更新失败");
      setCourses(courses);
      showToast("err", text);
      await load({ background: true });
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <AdminShell>
      <section className="view admin-page">
        {courseToDelete ? (
          <div
            className="admin-confirm-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !pendingCourseActions[courseToDelete.id]) {
                setCourseToDelete(null);
              }
            }}
          >
            <section
              className="admin-confirm-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-course-title"
              aria-describedby="delete-course-description"
            >
              <span className="admin-confirm-kicker">DELETE COURSE</span>
              <h2 id="delete-course-title">确认删除这门课程？</h2>
              <p id="delete-course-description">
                「{courseToDelete.title}」及其课程地址将被永久删除，此操作无法撤销。
              </p>
              <div className="admin-confirm-actions">
                <button
                  ref={deleteCancelRef}
                  type="button"
                  disabled={Boolean(pendingCourseActions[courseToDelete.id])}
                  onClick={() => setCourseToDelete(null)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="is-danger"
                  disabled={Boolean(pendingCourseActions[courseToDelete.id])}
                  onClick={() => void confirmDelete(courseToDelete)}
                >
                  {pendingCourseActions[courseToDelete.id] === "delete" ? "删除中…" : "确认删除"}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {toast ? (
          <div
            className={`admin-toast admin-course-toast ${toast.type === "ok" ? "is-ok" : "is-err"}`}
            role={toast.type === "ok" ? "status" : "alert"}
            aria-live={toast.type === "ok" ? "polite" : "assertive"}
            aria-atomic="true"
          >
            <span className="admin-course-toast-icon" aria-hidden="true">
              {toast.type === "ok" ? "✓" : "!"}
            </span>
            <span className="admin-course-toast-copy">
              <strong>{toast.type === "ok" ? "操作成功" : "操作未完成"}</strong>
              <span>{toast.text}</span>
            </span>
            <button type="button" onClick={dismissToast} aria-label="关闭提示">×</button>
          </div>
        ) : null}

        <header className="admin-page-header">
          <div>
            <h1>课程管理</h1>
            <p className="sub">
              绑定飞书文档或知识库链接。站内会优先嵌入；wiki 会自动解析为云文档。请开通 wiki:wiki:readonly（若用知识库），并把应用加为协作者。
            </p>
          </div>
          <button type="button" className="admin-ghost-btn" disabled={loading || refreshing} onClick={() => void refreshCourses()}>
            {loading || refreshing ? "刷新中…" : "刷新"}
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
              <button type="button" className="admin-editor-cancel" onClick={cancelEdit}>
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
            <div>
              <strong>{editingId ? "正在修改已有课程" : "准备发布一门新课程"}</strong>
              <small>
                {hasUnsavedChanges ? <span className="admin-unsaved-state">存在未保存更改</span> : "所有更改均已保存"}
                {" · 封面会转为 WEBP 并上传至课程专用存储桶。"}
              </small>
            </div>
            <button type="submit" className="admin-editor-submit" disabled={submitting || uploading || activeCategories.length === 0}>
              {submitting ? "保存中…" : editingId ? "保存修改" : "创建并上传课程"}
            </button>
          </div>
        </form>

        {formError ? (
          <div className="admin-flash is-err mt-12" role="alert">
            <span>{formError}</span>
          </div>
        ) : null}

        {loadError ? (
          <div className="admin-flash is-err mt-12" role="alert">
            <span>{loadError}</span>
            <button type="button" disabled={refreshing} onClick={() => void refreshCourses()}>
              {refreshing ? "重试中…" : "重新加载"}
            </button>
          </div>
        ) : null}

        {loading ? <p className="admin-status-inline">加载课程中…</p> : null}

        {!loading && courses.length === 0 && !loadError ? (
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
                      <button type="button" className="admin-action-primary" disabled={Boolean(pendingCourseActions[c.id])} onClick={() => startEdit(c)}>修改详情</button>
                      <button type="button" disabled={Boolean(pendingCourseActions[c.id])} onClick={() => void toggleMemberOnly(c)}>
                        {pendingCourseActions[c.id] === "access"
                          ? "更新中…"
                          : c.is_member_only ? "改为公开" : "设为会员"}
                      </button>
                      <button type="button" disabled={Boolean(pendingCourseActions[c.id])} onClick={() => void togglePublished(c)}>
                        {pendingCourseActions[c.id] === "publish" ? "处理中…" : c.is_published ? "下架" : "发布"}
                      </button>
                      <Link href={`/learning/course?id=${c.id}`} target="_blank" rel="noopener noreferrer">前台预览 ↗</Link>
                      <div className="admin-course-danger-zone">
                        <button type="button" className="is-danger" disabled={Boolean(pendingCourseActions[c.id])} onClick={() => setCourseToDelete(c)}>
                          删除课程
                        </button>
                      </div>
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
