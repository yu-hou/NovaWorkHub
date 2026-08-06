"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ICON_MAP } from "@/components/home/home-icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SIDE_NAV } from "@/lib/home-content";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoggedIn, isAdmin, isMember, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [accountOpen]);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link
            className="sidebar-wordmark-link"
            href="/"
            title="返回官网"
            aria-label="Nova"
          >
            <span className="sidebar-brand-title">
              <span className="brand-wordmark-text">Nova</span>
            </span>
            <p>点亮 AI 实战</p>
          </Link>
          <ThemeToggle className="sidebar-theme-toggle" />
        </div>

        <nav className="side-nav" aria-label="主导航">
          {SIDE_NAV.map((item) => {
            const Icon = NAV_ICON_MAP[item.icon];
            if ("action" in item && item.action) {
              return (
                <button
                  key={item.label}
                  className="nav-item nav-action-item"
                  id="contributionEntryBtn"
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    window.alert("暂未开放，敬请期待。");
                  }}
                >
                  <span className="nav-icon">
                    <Icon />
                  </span>
                  {item.label}
                </button>
              );
            }
            const match = "match" in item ? item.match : item.href;
            const isActive =
              pathname === match ||
              (match !== "/home" && pathname.startsWith(`${match}/`));
            return (
              <a
                key={item.label}
                className={`nav-item${isActive ? " active" : ""}`}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="nav-icon">
                  <Icon />
                </span>
                {item.label}
              </a>
            );
          })}
          {isAdmin ? (
            <Link
              className={`nav-item${pathname.startsWith("/admin") ? " active" : ""}`}
              href="/admin"
            >
              <span className="nav-icon">
                <NAV_ICON_MAP.about />
              </span>
              管理后台
            </Link>
          ) : null}
        </nav>

        <div className="sidebar-footer">
          <div className="account-menu" id="accountMenu" ref={rootRef}>
            {isLoggedIn ? (
              <button
                className="account-trigger"
                type="button"
                aria-expanded={accountOpen}
                aria-controls="accountMenuPanel"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <span className="avatar">
                  {(user?.display_name || user?.email || "用").slice(0, 1)}
                </span>
                <span className="account-trigger-text">
                  <strong>{user?.display_name || user?.email}</strong>
                  <small>{isMember ? "会员已开通" : "普通用户"}</small>
                </span>
              </button>
            ) : (
              <Link className="account-trigger" href="/login">
                <span className="avatar">登</span>
                <span className="account-trigger-text">
                  <strong>登录 / 注册</strong>
                  <small>进入账号页面</small>
                </span>
              </Link>
            )}
            {isLoggedIn ? (
              <div
                className={`account-popover${accountOpen ? "" : " hidden"}`}
                id="accountMenuPanel"
              >
                <section className="account-menu-card" id="loginCard">
                  <div className="account-menu-profile">
                    <span className="avatar account-menu-avatar">
                      {(user?.display_name || user?.email || "用").slice(0, 1)}
                    </span>
                    <div>
                      <strong>{user?.display_name || "Nova 用户"}</strong>
                      <p>{user?.email}</p>
                    </div>
                  </div>

                  <div
                    className={`account-menu-summary${
                      isAdmin ? " is-admin" : isMember ? " is-active" : ""
                    }`}
                  >
                    <span className="account-menu-summary-icon" aria-hidden="true">
                      <svg className="account-menu-svg" viewBox="0 0 24 24">
                        <path d="M12 3 19 7v5c0 4.6-2.8 7.5-7 9-4.2-1.5-7-4.4-7-9V7l7-4Z" />
                        <path d="m9.3 12 1.8 1.8 3.8-4" />
                      </svg>
                    </span>
                    <span className="account-menu-summary-copy">
                      <strong>
                        {isAdmin ? "管理员账号" : isMember ? "Nova 会员" : "普通账号"}
                      </strong>
                      <small>
                        {isAdmin
                          ? "已拥有全部课程与后台管理权限"
                          : isMember
                            ? "全部会员课程已解锁"
                            : "会员课程尚未解锁"}
                      </small>
                    </span>
                  </div>

                  <div className="account-menu-list">
                    {isAdmin ? (
                      <Link
                        className="account-menu-item"
                        href="/admin"
                        onClick={() => setAccountOpen(false)}
                      >
                        <span className="account-menu-item-icon" aria-hidden="true">
                          <svg className="account-menu-svg" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                        </span>
                        <span>
                          <strong>管理后台</strong>
                          <small>管理用户、分类与课程</small>
                        </span>
                      </Link>
                    ) : null}
                    <Link
                      className="account-menu-item"
                      href="/account/security"
                      onClick={() => setAccountOpen(false)}
                    >
                      <span className="account-menu-item-icon" aria-hidden="true">
                        <svg className="account-menu-svg" viewBox="0 0 24 24">
                          <circle cx="8" cy="15" r="3" />
                          <path d="m10.5 13.5 7-7a2.1 2.1 0 0 1 3 3l-7 7" />
                          <path d="m15.5 8.5 2 2" />
                        </svg>
                      </span>
                      <span>
                        <strong>账户安全</strong>
                        <small>修改登录密码</small>
                      </span>
                    </Link>
                    <button
                      className="account-menu-item danger"
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                    >
                      <span className="account-menu-item-icon" aria-hidden="true">
                        <svg className="account-menu-svg" viewBox="0 0 24 24">
                          <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
                          <path d="m15 16 4-4-4-4" />
                          <path d="M19 12H9" />
                        </svg>
                      </span>
                      <span>
                        <strong>退出登录</strong>
                        <small>退出当前账号</small>
                      </span>
                    </button>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}
