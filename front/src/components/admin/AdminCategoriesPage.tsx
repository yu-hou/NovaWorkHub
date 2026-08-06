"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { AdminShell, friendlyError } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/api";

export const COLOR_OPTIONS = [
  { value: "category-gold", label: "金色" },
  { value: "category-rose", label: "玫红" },
  { value: "category-violet", label: "紫色" },
  { value: "category-cyan", label: "青色" },
  { value: "category-green", label: "绿色" },
  { value: "category-slate", label: "灰色" },
];

export type AdminCategory = {
  id: number;
  name: string;
  color_class: string;
  sort_order: number;
  is_active: boolean;
  course_count: number;
};

export function AdminCategoriesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [form, setForm] = useState({
    name: "",
    color_class: "category-gold",
  });

  const showToast = (type: "ok" | "err", text: string) => {
    setToast({ type, text });
    window.setTimeout(() => setToast(null), 3600);
  };

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<AdminCategory[]>("/api/admin/categories");
      setCategories(data);
      setError("");
    } catch (err) {
      setError(friendlyError(err, "分类加载失败"));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    try {
      await apiFetch("/api/admin/categories", {
        method: "POST",
        body: {
          name: form.name.trim(),
          color_class: form.color_class,
          sort_order:
            categories.reduce((max, category) => Math.max(max, category.sort_order), 0) +
            10,
          is_active: true,
        },
      });
      showToast("ok", "分类已创建");
      setForm({ name: "", color_class: "category-gold" });
      await load();
    } catch (err) {
      const text = friendlyError(err, "创建分类失败");
      setError(text);
      showToast("err", text);
    } finally {
      setCreating(false);
    }
  };

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    setCategories(reordered);
    try {
      await Promise.all(
        reordered.map((category, position) =>
          apiFetch(`/api/admin/categories/${category.id}`, {
            method: "PATCH",
            body: { sort_order: (position + 1) * 10 },
          }),
        ),
      );
      showToast("ok", "显示顺序已更新");
      await load();
    } catch (err) {
      const text = friendlyError(err, "调整顺序失败");
      showToast("err", text);
      await load();
    }
  };

  const patchCategory = async (id: number, body: Partial<AdminCategory>) => {
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: "PATCH", body });
      showToast("ok", "分类已更新");
      await load();
    } catch (err) {
      const text = friendlyError(err, "更新失败");
      setError(text);
      showToast("err", text);
    }
  };

  const onDelete = async (cat: AdminCategory) => {
    if (cat.course_count > 0) {
      showToast("err", `仍有 ${cat.course_count} 门课程使用该分类，无法删除`);
      return;
    }
    if (!window.confirm(`确认删除分类「${cat.name}」？`)) return;
    try {
      await apiFetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
      showToast("ok", "分类已删除");
      await load();
    } catch (err) {
      const text = friendlyError(err, "删除失败");
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
            <h1>分类管理</h1>
            <p className="sub">
              管理课程分类名称、颜色与显示顺序；列表越靠上，在课程筛选中越先展示。
            </p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>
            刷新
          </button>
        </header>

        <form className="admin-form admin-form-panel" onSubmit={onCreate}>
          <h2>新增分类</h2>
          <p className="sub">新分类会自动排在末尾，创建后可在下方使用“上移 / 下移”调整。</p>
          <div className="form-grid mt-12">
            <div>
              <label htmlFor="catName">名称</label>
              <input
                id="catName"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="例如：进阶课"
                required
              />
            </div>
            <div>
              <label htmlFor="catColor">颜色</label>
              <select
                id="catColor"
                value={form.color_class}
                onChange={(e) =>
                  setForm((f) => ({ ...f, color_class: e.target.value }))
                }
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className={`category-badge ${form.color_class}`}>
                {form.name || "预览"}
              </span>
            </div>
            <button type="submit" disabled={creating}>
              {creating ? "创建中…" : "创建分类"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="admin-flash is-err mt-12" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => void load()}>
              重试
            </button>
          </div>
        ) : null}

        {loading ? <p className="admin-status-inline">加载分类中…</p> : null}

        {!loading && categories.length > 0 ? (
          <div className="admin-table-wrap mt-12">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名称</th>
                  <th>颜色</th>
                  <th>显示顺序</th>
                  <th>课程数</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, index) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      <span className={`category-badge ${c.color_class}`}>{c.name}</span>
                    </td>
                    <td>
                      <select
                        value={c.color_class}
                        onChange={(e) =>
                          void patchCategory(c.id, { color_class: e.target.value })
                        }
                      >
                        {COLOR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="admin-order-control">
                        <span>第 {index + 1} 位</span>
                        <button
                          type="button"
                          disabled={index === 0}
                          aria-label={`上移分类 ${c.name}`}
                          onClick={() => void moveCategory(index, -1)}
                        >
                          ↑ 上移
                        </button>
                        <button
                          type="button"
                          disabled={index === categories.length - 1}
                          aria-label={`下移分类 ${c.name}`}
                          onClick={() => void moveCategory(index, 1)}
                        >
                          ↓ 下移
                        </button>
                      </div>
                    </td>
                    <td>{c.course_count}</td>
                    <td>{c.is_active ? "启用" : "停用"}</td>
                    <td className="admin-actions">
                      <button
                        type="button"
                        onClick={() =>
                          void patchCategory(c.id, { is_active: !c.is_active })
                        }
                      >
                        {c.is_active ? "停用" : "启用"}
                      </button>
                      <button type="button" onClick={() => void onDelete(c)}>
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
