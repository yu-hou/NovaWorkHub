"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { COLOR_OPTIONS } from "@/components/admin/AdminCategoriesPage";
import { AdminShell, friendlyError } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/api";

type CatalogPage = "events" | "cases";

type AdminCatalogItem = {
  id: number;
  page: CatalogPage;
  title: string;
  summary: string;
  category: string;
  category_class: string;
  tags: string[];
  cover: string;
  learners: number;
  views: number;
  cta: string;
  is_member_only: boolean;
  is_published: boolean;
  sort_order: number;
  href: string;
};

const emptyForm = (page: CatalogPage) => ({
  page,
  title: "",
  summary: "",
  category: "",
  category_class: "category-gold",
  tags: "",
  cover: "",
  learners: 0,
  views: 0,
  cta: page === "events" ? "查看详情" : "查看案例",
  is_member_only: true,
  is_published: true,
  sort_order: 0,
  href: "",
});

export function AdminCatalogPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [page, setPage] = useState<CatalogPage>("events");
  const [items, setItems] = useState<AdminCatalogItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm("events"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const label = page === "events" ? "活动" : "案例";

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<AdminCatalogItem[]>(`/api/admin/catalog/${page}`);
      setItems(data);
      setError("");
    } catch (caught: unknown) {
      setError(friendlyError(caught, `${label}内容加载失败`));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, label, page]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  const switchPage = (nextPage: CatalogPage) => {
    setPage(nextPage);
    setEditingId(null);
    setForm(emptyForm(nextPage));
    setMessage("");
    setError("");
  };

  const startEdit = (item: AdminCatalogItem) => {
    setEditingId(item.id);
    setForm({
      ...item,
      tags: item.tags.join(", "),
      href: item.href || "",
    });
    document.getElementById("catalog-editor")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm(page));
  };

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const body = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      category: form.category.trim(),
      cover: form.cover.trim(),
      href: form.href.trim(),
      cta: form.cta.trim(),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    try {
      await apiFetch(
        editingId ? `/api/admin/catalog/${page}/${editingId}` : `/api/admin/catalog/${page}`,
        { method: editingId ? "PATCH" : "POST", body },
      );
      setMessage(editingId ? `${label}已更新` : `${label}已创建`);
      resetForm();
      await load();
    } catch (caught: unknown) {
      setError(friendlyError(caught, `${label}保存失败`));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item: AdminCatalogItem) => {
    if (!window.confirm(`确认删除“${item.title}”？此操作不可撤销。`)) return;
    try {
      await apiFetch(`/api/admin/catalog/${page}/${item.id}`, { method: "DELETE" });
      setMessage(`${label}已删除`);
      if (editingId === item.id) resetForm();
      await load();
    } catch (caught: unknown) {
      setError(friendlyError(caught, `${label}删除失败`));
    }
  };

  return (
    <AdminShell>
      <section className="view admin-page">
        <header className="admin-page-header">
          <div>
            <h1>内容管理</h1>
            <p className="sub">管理活动与案例卡片。内容地址填写后，前台通过登录和会员校验后打开。</p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>刷新</button>
        </header>

        <div className="segmented tiny mt-12" aria-label="内容类型">
          <button type="button" className={page === "events" ? "active" : ""} onClick={() => switchPage("events")}>活动</button>
          <button type="button" className={page === "cases" ? "active" : ""} onClick={() => switchPage("cases")}>案例</button>
        </div>

        <form className="admin-form admin-form-panel mt-12" id="catalog-editor" tabIndex={-1} onSubmit={onSave}>
          <div className="admin-editor-head">
            <div>
              <span className="admin-editor-kicker">{editingId ? `EDITING #${editingId}` : `NEW ${page.toUpperCase()}`}</span>
              <h2>{editingId ? `修改${label}` : `新增${label}`}</h2>
              <p>沿用当前前台卡片样式；最多展示 4 个标签。</p>
            </div>
            {editingId ? <button type="button" className="admin-editor-cancel" onClick={resetForm}>取消修改</button> : null}
          </div>
          <div className="admin-course-fields mt-12">
            <div className="admin-field admin-field-wide">
              <label htmlFor="catalogTitle"><span>标题</span><small>必填</small></label>
              <input id="catalogTitle" value={form.title} maxLength={255} required onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="catalogCategory"><span>分类</span><small>必填</small></label>
              <input id="catalogCategory" value={form.category} required onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="catalogColor"><span>分类颜色</span></label>
              <select id="catalogColor" value={form.category_class} onChange={(event) => setForm((current) => ({ ...current, category_class: event.target.value }))}>
                {COLOR_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="admin-field admin-field-wide">
              <label htmlFor="catalogSummary"><span>简介</span></label>
              <textarea id="catalogSummary" rows={3} value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
            </div>
            <div className="admin-field admin-field-wide">
              <label htmlFor="catalogHref"><span>内容地址</span><small>建议填写</small></label>
              <input id="catalogHref" type="url" placeholder="https://..." value={form.href} onChange={(event) => setForm((current) => ({ ...current, href: event.target.value }))} />
              <p className="admin-field-help">未填写时前台会显示“内容待配置”，不会跳转到空页面。</p>
            </div>
            <div className="admin-field admin-field-wide">
              <label htmlFor="catalogCover"><span>封面地址</span></label>
              <input id="catalogCover" type="url" placeholder="https://..." value={form.cover} onChange={(event) => setForm((current) => ({ ...current, cover: event.target.value }))} />
            </div>
            <div className="admin-field admin-field-wide">
              <label htmlFor="catalogTags"><span>标签</span><small>逗号分隔，最多 4 个</small></label>
              <input id="catalogTags" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="catalogCta"><span>按钮文字</span></label>
              <input id="catalogCta" value={form.cta} onChange={(event) => setForm((current) => ({ ...current, cta: event.target.value }))} />
            </div>
            <div className="admin-field">
              <label htmlFor="catalogSort"><span>显示顺序</span></label>
              <input id="catalogSort" type="number" min={0} value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))} />
            </div>
            <div className="admin-field admin-toggle-grid admin-field-wide">
              <label className="admin-switch-card"><input type="checkbox" checked={form.is_member_only} onChange={(event) => setForm((current) => ({ ...current, is_member_only: event.target.checked }))} /><span className="admin-switch" aria-hidden="true" /><span><strong>会员专享</strong><small>非会员只能看到卡片</small></span></label>
              <label className="admin-switch-card"><input type="checkbox" checked={form.is_published} onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))} /><span className="admin-switch" aria-hidden="true" /><span><strong>立即发布</strong><small>关闭后仅后台可见</small></span></label>
            </div>
          </div>
          <div className="admin-editor-actions">
            <div><strong>{editingId ? `正在修改${label}` : `准备创建${label}`}</strong><small>保存后前台数据会立即更新。</small></div>
            <button type="submit" className="admin-editor-submit" disabled={saving}>{saving ? "保存中…" : editingId ? "保存修改" : `创建${label}`}</button>
          </div>
        </form>

        {message ? <p className="admin-flash is-ok mt-12" role="status">{message}</p> : null}
        {error ? <div className="admin-flash is-err mt-12" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>重试</button></div> : null}
        {loading ? <p className="admin-status-inline">加载{label}中…</p> : null}
        {!loading && !error && items.length === 0 ? <p className="admin-empty">还没有{label}内容。</p> : null}
        {!loading && items.length > 0 ? (
          <div className="admin-table-wrap mt-12">
            <table className="admin-table">
              <thead><tr><th>顺序</th><th>标题</th><th>分类</th><th>权限</th><th>内容地址</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.sort_order}</td>
                    <td><strong>{item.title}</strong></td>
                    <td><span className={`category-badge ${item.category_class}`}>{item.category}</span></td>
                    <td>{item.is_member_only ? "会员" : "公开"}</td>
                    <td>{item.href ? <a href={item.href} target="_blank" rel="noreferrer">打开 ↗</a> : "待配置"}</td>
                    <td>{item.is_published ? "已发布" : "草稿"}</td>
                    <td><div className="admin-actions"><button type="button" onClick={() => startEdit(item)}>编辑</button><button type="button" className="is-danger" onClick={() => void onDelete(item)}>删除</button></div></td>
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
