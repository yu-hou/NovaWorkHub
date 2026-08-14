"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ContentGateProvider } from "@/components/auth/ContentGate";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountPopoverRef = useRef<HTMLDivElement>(null);
  const [accountPopoverStyle, setAccountPopoverStyle] = useState<CSSProperties>();

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
      const target = event.target as Node;
      if (
        !accountMenuRef.current?.contains(target) &&
        !accountPopoverRef.current?.contains(target)
      ) {
        setAccountOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        accountTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  useEffect(() => {
    if (!accountOpen) return;

    const updatePopoverPosition = () => {
      const trigger = accountTriggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const viewportPadding = 16;
      const popoverWidth = Math.min(304, window.innerWidth - viewportPadding * 2);
      const left = Math.min(
        Math.max(viewportPadding, rect.left),
        window.innerWidth - popoverWidth - viewportPadding,
      );

      setAccountPopoverStyle({
        left,
        bottom: window.innerHeight - rect.top + 10,
        width: popoverWidth,
        maxHeight: Math.max(180, rect.top - viewportPadding - 10),
      });
    };

    updatePopoverPosition();
    window.addEventListener("resize", updatePopoverPosition);
    document.addEventListener("scroll", updatePopoverPosition, true);
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      document.removeEventListener("scroll", updatePopoverPosition, true);
    };
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
      <div ref={setPortalRoot} className="front-design-root" data-front-design-page={page}>
        <div className={`app-shell${sidebarCollapsed ? " is-sidebar-collapsed" : ""}`}>
          <aside className="sidebar">
            <div className="sidebar-brand">
              <Link className="sidebar-brand-link" href="/home" aria-label="返回 NovaWorkHub 工作台">
                <span className="brand-mark brand-mark-image" aria-hidden="true" />
                <div className="sidebar-brand-copy">
                  <span className="sidebar-brand-title">NovaWorkHub</span>
                  <span className="sidebar-brand-subtitle">让AI真正干活</span>
                </div>
              </Link>
              <button
                className="sidebar-collapse"
                type="button"
                aria-label={sidebarCollapsed ? "展开导航栏" : "收起导航栏"}
                aria-pressed={sidebarCollapsed}
                onClick={() => {
                  setAccountOpen(false);
                  setSidebarCollapsed((collapsed) => !collapsed);
                }}
              >
                <span />
                <span />
              </button>
            </div>

            <nav className="side-nav" aria-label="主导航" id="sideNav" />

            <div className="sidebar-footer">
              <div className="account-menu" ref={accountMenuRef}>
                <button
                  ref={accountTriggerRef}
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
              </div>
            </div>
          </aside>

          <main className="main-panel">{children}</main>
        </div>

        {accountOpen && portalRoot
          ? createPortal(
            <div
              ref={accountPopoverRef}
              className="account-popover account-popover-floating open"
              id="accountPopover"
              style={accountPopoverStyle}
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
            ,
            portalRoot,
          )
          : null}

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
