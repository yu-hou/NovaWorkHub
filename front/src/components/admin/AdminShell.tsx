"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/home/LoginForm";
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
  { href: "/admin", label: "概览", match: (p: string) => p === "/admin" },
  {
    href: "/admin/users",
    label: "用户管理",
    match: (p: string) => p.startsWith("/admin/users"),
  },
  {
    href: "/admin/categories",
    label: "分类管理",
    match: (p: string) => p.startsWith("/admin/categories"),
  },
  {
    href: "/admin/courses",
    label: "课程管理",
    match: (p: string) => p.startsWith("/admin/courses"),
  },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    document.body.classList.add("home-app", "admin-app");
    return () => {
      document.body.classList.remove("home-app", "admin-app");
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
                <span className="brand-wordmark-text">Nova</span>
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
                <Link href="/home">返回学习平台</Link>
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
              <Link href="/home">← 返回学习平台</Link>
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
              <span className="brand-wordmark-text">Nova</span>
              <small>Admin</small>
            </Link>
            <ThemeToggle className="sidebar-theme-toggle" />
          </div>

          <nav className="admin-side-nav">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-side-link${item.match(pathname) ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="admin-side-foot">
            <Link href="/home" className="admin-side-link admin-side-link-muted">
              返回前台
            </Link>
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
