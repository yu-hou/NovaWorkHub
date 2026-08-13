"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ContentGateProvider } from "@/components/auth/ContentGate";
import { ThemeToggle } from "@/components/ThemeToggle";

export type FrontDesignPage =
  | "home"
  | "paths"
  | "learning"
  | "cases"
  | "events"
  | "replays"
  | "benefits"
  | "about";

type FrontDesignShellProps = {
  page: FrontDesignPage;
  children: ReactNode;
};

export default function FrontDesignShell({
  page,
  children,
}: FrontDesignShellProps) {
  const pathname = usePathname();
  const { user, loading, isAdmin, isMember, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("front-design-app");
    document.body.dataset.page = page;

    return () => {
      document.body.classList.remove("front-design-app");
      delete document.body.dataset.page;
    };
  }, [page]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("front-design:navigate"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page, pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [accountOpen]);

  const accountName = user?.display_name || user?.email || "登录 / 注册";
  const accountInitial = loading ? "…" : user ? accountName.slice(0, 1).toUpperCase() : "登";
  const accountStatus = loading
    ? "正在同步账号状态"
    : isAdmin
      ? "管理员账号"
      : isMember
        ? "会员账号"
        : user
          ? "普通账号"
          : "使用真实账号登录";

  return (
    <ContentGateProvider>
      <div className="front-design-root" data-front-design-page={page}>
        <div className="app-shell">
          <aside className="sidebar">
            <a className="sidebar-brand" href="/home">
              <span className="brand-mark">AW</span>
              <span>
                <span className="sidebar-brand-title">AgentWork</span>
                <p>让AI真正干活</p>
              </span>
            </a>

            <nav className="side-nav" aria-label="主导航" id="sideNav" />

            <div className="sidebar-footer">
              <div className="front-theme-row">
                <span>外观模式</span>
                <ThemeToggle className="front-theme-toggle" />
              </div>
              <div className="account-menu" ref={accountMenuRef}>
                <button
                  className="account-trigger"
                  id="accountTrigger"
                  type="button"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className="avatar">{accountInitial}</span>
                  <span className="account-trigger-text">
                    <strong>{loading ? "账号状态同步中" : accountName}</strong>
                    <small>{accountStatus}</small>
                  </span>
                </button>
                <div
                  className={`account-popover${accountOpen ? " open" : ""}`}
                  id="accountPopover"
                >
                  <div className="login-card">
                    {user ? (
                      <>
                        <h2>{accountName}</h2>
                        <p className="sub">
                          {user.email}<br />{accountStatus}，当前登录状态已与课程权限同步。
                        </p>
                        <div className="form-grid">
                          {isAdmin ? (
                            <Link className="btn-primary" href="/admin" onClick={() => setAccountOpen(false)}>
                              管理后台
                            </Link>
                          ) : null}
                          <Link className="btn-outline" href="/account/security" onClick={() => setAccountOpen(false)}>
                            账户安全
                          </Link>
                          <button
                            type="button"
                            className="btn-outline"
                            onClick={() => {
                              setAccountOpen(false);
                              logout();
                            }}
                          >
                            退出登录
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2>{loading ? "正在同步账号" : "登录 AgentWork"}</h2>
                        <p className="sub">登录后可打开课程、激活权益和领取福利。</p>
                        <div className="form-grid">
                          <Link
                            className="btn-primary"
                            href={`/login?next=${encodeURIComponent(pathname)}`}
                            onClick={() => setAccountOpen(false)}
                          >
                            登录 / 注册
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="main-panel">{children}</main>
        </div>

        <div className="mobile-more-backdrop" id="moreBackdrop" />
        <nav className="mobile-more-sheet" id="moreSheet">
          <h3>全部入口</h3>
          <div className="mobile-more-grid" id="moreGrid" />
        </nav>
        <nav className="mobile-bottom-nav" id="bottomNav" />
      </div>

      <Script
        src="/front-design-runtime.js"
        strategy="afterInteractive"
        onReady={() => {
          window.dispatchEvent(new Event("front-design:navigate"));
        }}
      />
    </ContentGateProvider>
  );
}
