"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";

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
  const [form, setForm] = useState({
    title: "",
    category: "",
    category_class: "category-gold",
    summary: "",
    cover: "",
    is_member_only: false,
    feishu_doc_url: "",
    sort_order: 0,
  });

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 5200);
  };

  const activeCategories = categories.filter((c) => c.is_active);

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

  const onCreate = async (event: FormEvent) => {
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
      await apiFetch("/api/admin/courses", { method: "POST", body: form });
      const text = "课程创建成功";
      setMessage(text);
      showToast("ok", text);
      const first = activeCategories[0];
      setForm({
        title: "",
        category: first?.name || "",
        category_class: first?.color_class || "category-gold",
        summary: "",
        cover: "",
        is_member_only: false,
        feishu_doc_url: "",
        sort_order: 0,
      });
      await load();
    } catch (err) {
      const text = friendlyError(err, "创建失败");
      setError(text);
      showToast("err", text);
    } finally {
      setSubmitting(false);
    }
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
              绑定飞书文档分享链接。学员在站内通过飞书云文档组件阅读；嵌入失败时回退为打开外链。请把开放平台应用加为文档协作者（只读），并将分享设为「获得链接的人可阅读」。
            </p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>
            刷新
          </button>
        </header>

        <form className="admin-form admin-form-panel" onSubmit={onCreate}>
          <h2>新增课程</h2>
          <div className="form-grid mt-12">
            <div>
              <label htmlFor="courseTitle">标题</label>
              <input
                id="courseTitle"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="courseCategory">分类</label>
              {activeCategories.length === 0 ? (
                <p className="sub">
                  暂无可用分类，请先去 <Link href="/admin/categories">分类管理</Link>{" "}
                  创建。
                </p>
              ) : (
                <select
                  id="courseCategory"
                  value={form.category}
                  onChange={(e) => {
                    const opt = activeCategories.find((c) => c.name === e.target.value);
                    setForm((f) => ({
                      ...f,
                      category: e.target.value,
                      category_class: opt?.color_class || "category-gold",
                    }));
                  }}
                  required
                >
                  {activeCategories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="courseSummary">简介</label>
              <textarea
                id="courseSummary"
                rows={3}
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              />
            </div>

            <div className="admin-cover-field">
              <label htmlFor="courseCoverFile">课程封面（可选）</label>
              <p className="sub">
                支持 JPG / PNG / WEBP / GIF，最大 4MB；上传后会自动压缩优化。
              </p>
              <div className="admin-cover-row">
                <input
                  id="courseCoverFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploading || submitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    void onCoverFile(file);
                    e.target.value = "";
                  }}
                />
                {form.cover ? (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setForm((f) => ({ ...f, cover: "" }))}
                  >
                    清除封面
                  </button>
                ) : null}
              </div>
              {uploading ? <p className="sub">封面上传并优化中…</p> : null}
              {form.cover ? (
                <div className="admin-cover-preview">
                  <img src={mediaUrl(form.cover)} alt="封面预览" />
                  <small>{form.cover}</small>
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="courseFeishu">飞书文档链接（必填）</label>
              <input
                id="courseFeishu"
                value={form.feishu_doc_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, feishu_doc_url: e.target.value }))
                }
                placeholder="https://xxx.feishu.cn/docx/..."
                required
              />
              <p className="sub">
                权限请设为「获得链接的人可阅读」，并把飞书开放平台应用加为该文档协作者（只读），否则站内嵌入会失败并回退外链。
              </p>
            </div>

            <div className="admin-toggle-card">
              <label className="admin-check" htmlFor="courseMemberOnly">
                <input
                  id="courseMemberOnly"
                  type="checkbox"
                  checked={form.is_member_only}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_member_only: e.target.checked }))
                  }
                />
                <span>
                  <strong>会员专享课程</strong>
                  <small>
                    勾选后仅会员可看详情；不勾选则为公开课（登录即可看）。
                  </small>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || uploading || activeCategories.length === 0}
            >
              {submitting ? "创建中…" : "创建课程"}
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
          <div className="admin-table-wrap mt-12">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>封面</th>
                  <th>标题</th>
                  <th>分类</th>
                  <th>会员</th>
                  <th>飞书链接</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      {c.cover ? (
                        <img
                          className="admin-table-thumb"
                          src={mediaUrl(c.cover)}
                          alt=""
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{c.title}</td>
                    <td>
                      <span className={`category-badge ${c.category_class}`}>
                        {c.category}
                      </span>
                    </td>
                    <td>{c.is_member_only ? "是" : "否"}</td>
                    <td className="admin-url-cell">
                      <a href={c.feishu_doc_url} target="_blank" rel="noreferrer">
                        {c.feishu_doc_url}
                      </a>
                    </td>
                    <td className="admin-actions">
                      <button type="button" onClick={() => void toggleMemberOnly(c)}>
                        {c.is_member_only ? "改为公开" : "设为会员"}
                      </button>
                      <Link href={`/learning/course?id=${c.id}`}>预览</Link>
                      <button type="button" onClick={() => void onDelete(c.id)}>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
