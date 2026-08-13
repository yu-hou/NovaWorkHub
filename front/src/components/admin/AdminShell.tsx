"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ApiError } from "@/lib/api";

export function friendlyError(err: unknown, fallback = "操作失败") {
  if (err instanceof ApiError) return err.detail;
  if (err instanceof TypeError) return "无法连接服务器，请确认后端已启动";
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (
      msg.includes("failed to fetch") ||
      msg.includes("load failed") ||
      msg.includes("network")
    ) {
      return "无法连接服务器，请确认后端已启动";
    }
    return err.message || fallback;
  }
  return fallback;
}

const ADMIN_NAV = [
  { href: "/admin", label: "概览", icon: "overview", match: (p: string) => p === "/admin" },
  {
    href: "/admin/users",
    label: "用户管理",
    icon: "users",
    match: (p: string) => p.startsWith("/admin/users"),
  },
  {
    href: "/admin/categories",
    label: "分类管理",
    icon: "categories",
    match: (p: string) => p.startsWith("/admin/categories"),
  },
  {
    href: "/admin/courses",
    label: "课程管理",
    icon: "courses",
    match: (p: string) => p.startsWith("/admin/courses"),
  },
] as const;

function AdminNavIcon({ name }: { name: (typeof ADMIN_NAV)[number]["icon"] }) {
  if (name === "users") {
    return <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5.8M17.5 15a5 5 0 0 1 4 5" /></svg>;
  }
  if (name === "categories") {
    return <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>;
  }
  if (name === "courses") {
    return <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H21v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 5.5v16M8 7h9M8 11h7" /></svg>;
  }
  return <svg viewBox="0 0 24 24"><path d="M4 13h6V4H4zM14 20h6V11h-6zM4 20h6v-3H4zM14 7h6V4h-6z" /></svg>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    document.body.classList.add("home-app", "admin-app", "workbench-app");
    return () => {
      document.body.classList.remove("home-app", "admin-app", "workbench-app");
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-root">
        <div className="bg-cosmos" aria-hidden="true" />
        <div className="admin-login-wrap">
          <div className="admin-status-card">
            <p>正在验证登录状态…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-root">
        <div className="bg-cosmos" aria-hidden="true" />
        <div className="admin-login-wrap">
          <div className="admin-login-panel">
            <div className="admin-login-brand">
              <div>
                <span className="admin-brand-mark">AW</span>
                <span className="admin-brand-name">AgentWork</span>
                <p>管理后台</p>
              </div>
              <ThemeToggle className="sidebar-theme-toggle" />
            </div>
            <h1>管理员登录</h1>
            <p className="sub">
              {user
                ? `当前账号 ${user.email} 不是管理员，请退出后使用管理员账号登录。`
                : "使用管理员账号进入用户与课程管理。"}
            </p>
            {user ? (
              <div className="form-grid mt-12">
                <button type="button" onClick={logout}>
                  退出当前账号
                </button>
                <a href="/home">返回工作台</a>
              </div>
            ) : (
              <LoginForm
                title="邮箱密码登录"
                subtitle="使用已在 Supabase 中设为管理员的账号密码登录"
                defaultMode="password"
                allowRegistration={false}
              />
            )}
            <p className="sub admin-login-foot">
              <a href="/home">← 返回工作台</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="bg-cosmos" aria-hidden="true" />
      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label="管理导航">
          <div className="admin-side-brand">
            <Link href="/admin" className="admin-side-brand-link">
              <span className="admin-brand-mark">AW</span>
              <span className="admin-brand-copy">
                <strong>AgentWork</strong>
                <small>管理后台</small>
              </span>
            </Link>
            <ThemeToggle className="sidebar-theme-toggle" />
          </div>

          <nav className="admin-side-nav">
            <span className="admin-side-label">工作区</span>
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-side-link${item.match(pathname) ? " is-active" : ""}`}
              >
                <span className="admin-side-link-icon"><AdminNavIcon name={item.icon} /></span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="admin-side-foot">
            <a href="/home" className="admin-side-link admin-side-link-muted">
              <span className="admin-side-link-icon" aria-hidden="true">↗</span>
              <span>返回前台</span>
            </a>
            <div className="admin-side-user">
              <div>
                <strong>{user?.display_name || "管理员"}</strong>
                <small>{user?.email}</small>
              </div>
              <button type="button" className="admin-side-logout" onClick={logout}>
                退出
              </button>
            </div>
          </div>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
