"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { AdminShell, friendlyError } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/api";

type AdminUser = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  is_member: boolean;
  is_active: boolean;
};

export function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [form, setForm] = useState({
    email: "",
    display_name: "",
    password: "",
    role: "user",
    is_member: false,
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
      const data = await apiFetch<AdminUser[]>("/api/admin/users");
      setUsers(data);
      setError("");
    } catch (err) {
      setError(friendlyError(err, "用户列表加载失败"));
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
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: {
          email: form.email.trim(),
          display_name: form.display_name.trim(),
          password: form.password,
          role: form.role,
          is_member: form.is_member,
          is_active: true,
        },
      });
      showToast("ok", "用户已创建");
      setForm({
        email: "",
        display_name: "",
        password: "",
        role: "user",
        is_member: false,
      });
      await load();
    } catch (err) {
      const text = friendlyError(err, "创建用户失败");
      setError(text);
      showToast("err", text);
    } finally {
      setCreating(false);
    }
  };

  const patchUser = async (id: string, body: Partial<AdminUser>) => {
    setBusyId(id);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "PATCH", body });
      showToast("ok", "已更新用户");
      await load();
    } catch (err) {
      const text = friendlyError(err, "更新失败");
      setError(text);
      showToast("err", text);
    } finally {
      setBusyId(null);
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
            <h1>用户管理</h1>
            <p className="sub">添加账号，并设置会员、启用状态与角色。</p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>
            刷新
          </button>
        </header>

        <form className="admin-form admin-form-panel" onSubmit={onCreate}>
          <h2>添加用户</h2>
          <div className="form-grid mt-12">
            <div>
              <label htmlFor="newUserEmail">邮箱</label>
              <input
                id="newUserEmail"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="newUserName">昵称</label>
              <input
                id="newUserName"
                value={form.display_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, display_name: e.target.value }))
                }
                placeholder="可选，默认取邮箱前缀"
              />
            </div>
            <div>
              <label htmlFor="newUserPassword">初始密码</label>
              <input
                id="newUserPassword"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="至少 6 位"
                minLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="newUserRole">角色</label>
              <select
                id="newUserRole"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <label className="admin-check" htmlFor="newUserMember">
              <input
                id="newUserMember"
                type="checkbox"
                checked={form.is_member}
                onChange={(e) =>
                  setForm((f) => ({ ...f, is_member: e.target.checked }))
                }
              />
              <span>
                <strong>开通会员</strong>
                <small>勾选后可直接观看会员专享课程</small>
              </span>
            </label>
            <button type="submit" disabled={creating}>
              {creating ? "创建中…" : "创建用户"}
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

        {loading ? <p className="admin-status-inline">加载用户中…</p> : null}

        {!loading && users.length > 0 ? (
          <div className="admin-table-wrap mt-12">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>邮箱</th>
                  <th>昵称</th>
                  <th>角色</th>
                  <th>会员</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.display_name || "—"}</td>
                    <td>
                      <span
                        className={`admin-pill ${u.role === "admin" ? "is-accent" : ""}`}
                      >
                        {u.role === "admin" ? "管理员" : "用户"}
                      </span>
                    </td>
                    <td>{u.is_member ? "是" : "否"}</td>
                    <td>{u.is_active ? "启用" : "停用"}</td>
                    <td className="admin-actions">
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => void patchUser(u.id, { is_member: !u.is_member })}
                      >
                        {u.is_member ? "取消会员" : "开通会员"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === u.id}
                        onClick={() => void patchUser(u.id, { is_active: !u.is_active })}
                      >
                        {u.is_active ? "停用" : "启用"}
                      </button>
                      {u.role !== "admin" ? (
                        <button
                          type="button"
                          disabled={busyId === u.id}
                          onClick={() => void patchUser(u.id, { role: "admin" })}
                        >
                          设为管理员
                        </button>
                      ) : null}
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
