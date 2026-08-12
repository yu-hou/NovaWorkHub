"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { NAV_ICON_MAP } from "@/components/home/home-icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SIDE_NAV } from "@/lib/home-content";

function GuestSeatArt() {
  return (
    <svg
      className="wb-seat-art"
      viewBox="0 0 72 72"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="72" height="72" rx="16" fill="currentColor" className="wb-seat-art-bg" />
      <rect x="14" y="18" width="44" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="2" className="wb-seat-art-frame" />
      <circle cx="36" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="2" className="wb-seat-art-frame" />
      <path
        d="M22 48c2.8-6 8-9 14-9s11.2 3 14 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="wb-seat-art-frame"
      />
      <circle cx="54" cy="22" r="8" className="wb-seat-art-badge" />
      <path
        d="M54 18.5v7M50.5 22h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="wb-seat-art-plus"
      />
    </svg>
  );
}

function UserSeatArt({ initial }: { initial: string }) {
  return (
    <span className="wb-seat-user-art" aria-hidden="true">
      <span className="wb-seat-user-initial">{initial}</span>
    </span>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const currentPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
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

  const displayInitial = (user?.display_name || user?.email || "用").slice(0, 1);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link
            className="sidebar-wordmark-link"
            href="/"
            title="返回官网"
            aria-label="Nova，让 AI 真正干活"
          >
            <span className="brand-mark" aria-hidden="true">N</span>
            <span className="sidebar-brand-copy">
              <span className="sidebar-brand-title">Nova</span>
              <p>让 AI 真正干活</p>
            </span>
          </Link>
          <ThemeToggle className="sidebar-theme-toggle" />
        </div>

        <nav className="side-nav" aria-label="主导航">
          {["quick", "主要", "社群", "其他"].map((group) => {
            const items = SIDE_NAV.filter((item) => item.group === group);
            if (items.length === 0) return null;
            return (
              <div className={`side-nav-section side-nav-section-${group}`} key={group}>
                {group !== "quick" ? <p className="side-nav-label">{group}</p> : null}
                <div className="side-nav-group">
                  {items.map((item) => {
                    const Icon = NAV_ICON_MAP[item.icon];
                    const isActive =
                      currentPath === item.match ||
                      (item.match !== "/home" && currentPath.startsWith(`${item.match}/`));
                    return (
                      <Link
                        key={item.label}
                        className={`nav-item${isActive ? " active" : ""}`}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="nav-icon"><Icon /></span>
                        <span className="nav-label">{item.label}</span>
                        {item.href !== "/home" && item.href !== "/learning" ? (
                          <span className="nav-preview-dot" title="预览内容" aria-label="预览内容" />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer wb-seat-dock" ref={rootRef}>
          {isLoggedIn ? (
            <div className="wb-seat-card is-user" id="accountMenu">
              <button
                className="wb-seat-profile"
                type="button"
                aria-expanded={accountOpen}
                aria-controls="accountMenuPanel"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <UserSeatArt initial={displayInitial} />
                <span className="wb-seat-copy">
                  <strong>{user?.display_name || user?.email}</strong>
                  <small>{isMember ? "会员席位已开通" : "普通席位"}</small>
                </span>
                <span className={`wb-seat-chevron${accountOpen ? " is-open" : ""}`} aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M4 6.5 8 10.5 12 6.5" />
                  </svg>
                </span>
              </button>

              <div
                className={`account-popover wb-seat-popover${accountOpen ? "" : " hidden"}`}
                id="accountMenuPanel"
              >
                <section className="account-menu-card" id="loginCard">
                  <div className="account-menu-profile">
                    <UserSeatArt initial={displayInitial} />
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
            </div>
          ) : (
            <div className="wb-seat-card is-guest">
              <div className="wb-seat-visual">
                <GuestSeatArt />
              </div>
              <div className="wb-seat-copy">
                <strong>进入工作台席位</strong>
                <small>登录后同步课程进度与权限</small>
              </div>
              <div className="wb-seat-actions">
                <Link className="wb-seat-btn primary" href="/login">
                  登录
                </Link>
                <Link className="wb-seat-btn ghost" href="/register">
                  注册
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
