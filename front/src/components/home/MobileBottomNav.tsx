"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import {
  NAV_ICON_MAP,
  NavCourseIcon,
  NavGiftIcon,
  NavHomeIcon,
  NavMoreIcon,
  NavPathIcon,
} from "@/components/home/home-icons";
import { SIDE_NAV } from "@/lib/home-content";

const BASE_ITEMS = [
  { href: "/home", label: "首页", match: "/home", Icon: NavHomeIcon },
  {
    href: "/learning-paths",
    label: "路线",
    match: "/learning-paths",
    Icon: NavPathIcon,
  },
  { href: "/learning", label: "课程", match: "/learning", Icon: NavCourseIcon },
  { href: "/benefits", label: "福利", match: "/benefits", Icon: NavGiftIcon },
] as const;

const MORE_NAV = SIDE_NAV.filter(
  (item) =>
    !("action" in item && item.action) &&
    !BASE_ITEMS.some((base) => base.href === item.href),
);

function AdminNavIcon() {
  return (
    <svg className="nav-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SecurityNavIcon() {
  return (
    <svg className="account-menu-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="8" cy="15" r="3" />
      <path d="m10.5 13.5 7-7a2.1 2.1 0 0 1 3 3l-7 7" />
      <path d="m15.5 8.5 2 2" />
    </svg>
  );
}

function LogoutNavIcon() {
  return (
    <svg className="account-menu-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
      <path d="m15 16 4-4-4-4" />
      <path d="M19 12H9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isLoggedIn, isAdmin, isMember, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const sheetId = useId();

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    document.body.classList.add("mobile-more-open", "mobile-sheet-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("mobile-more-open", "mobile-sheet-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const moreActive =
    moreOpen ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    MORE_NAV.some(
      (item) =>
        "match" in item &&
        (pathname === item.match || pathname.startsWith(`${item.match}/`)),
    );

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="移动端主导航">
        {BASE_ITEMS.map((item) => {
          const active =
            pathname === item.match ||
            (item.match !== "/home" && pathname.startsWith(`${item.match}/`));
          const Icon = item.Icon;
          return (
            <a
              key={item.href}
              className={`mobile-bottom-item${active ? " active" : ""}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              <span className="mobile-bottom-icon">
                <Icon />
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
        <button
          type="button"
          className={`mobile-bottom-item mobile-bottom-more${moreActive ? " active" : ""}`}
          aria-expanded={moreOpen}
          aria-controls={sheetId}
          onClick={() => setMoreOpen((open) => !open)}
        >
          <span className="mobile-bottom-icon">
            <NavMoreIcon />
          </span>
          <span>更多</span>
        </button>
      </nav>

      <button
        type="button"
        className="mobile-more-backdrop"
        aria-label="关闭更多菜单"
        tabIndex={moreOpen ? 0 : -1}
        onClick={() => setMoreOpen(false)}
      />

      <div
        className="mobile-more-sheet"
        id={sheetId}
        role="dialog"
        aria-modal="true"
        aria-hidden={!moreOpen}
        aria-label="更多菜单"
      >
        <div className="mobile-more-handle" aria-hidden="true" />
        <div className="mobile-more-head">
          <div>
            <h2>更多</h2>
            <p>{isLoggedIn ? "账号、管理与更多栏目" : "登录后同步学习进度"}</p>
          </div>
          <button
            type="button"
            className="mobile-more-close"
            aria-label="关闭"
            onClick={() => setMoreOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="mobile-more-account" aria-label="当前账号">
            <span className="mobile-more-account-avatar">
              {(user?.display_name || user?.email || "用").slice(0, 1)}
            </span>
            <span className="mobile-more-account-copy">
              <strong>{user?.display_name || user?.email}</strong>
              <small>
                {isAdmin ? "管理员账号" : isMember ? "会员已开通" : "普通用户"}
              </small>
            </span>
          </div>
        ) : (
          <Link
            className="mobile-more-account"
            href="/login"
            onClick={() => setMoreOpen(false)}
          >
            <span className="mobile-more-account-avatar">登</span>
            <span className="mobile-more-account-copy">
              <strong>登录 / 注册</strong>
              <small>进入账号页面</small>
            </span>
          </Link>
        )}

        {MORE_NAV.length > 0 ? (
          <section className="mobile-more-section">
            <h3>栏目</h3>
            <div className="mobile-more-grid">
              {MORE_NAV.map((item) => {
                const Icon = NAV_ICON_MAP[item.icon];
                const match = "match" in item ? item.match : item.href;
                const active =
                  pathname === match || pathname.startsWith(`${match}/`);
                return (
                  <a
                    key={item.label}
                    className={`mobile-more-item${active ? " active" : ""}`}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                  >
                    <span className="mobile-more-item-icon">
                      <Icon />
                    </span>
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mobile-more-section">
          <h3>账号</h3>
          <div className="mobile-more-grid">
            {isAdmin ? (
              <Link
                className={`mobile-more-item mobile-more-item-wide${
                  pathname.startsWith("/admin") ? " active" : ""
                }`}
                href="/admin"
                onClick={() => setMoreOpen(false)}
              >
                <span className="mobile-more-item-icon">
                  <AdminNavIcon />
                </span>
                <span>管理后台</span>
              </Link>
            ) : null}
            {isLoggedIn ? (
              <>
                <Link
                  className={`mobile-more-item${
                    pathname.startsWith("/account/security") ? " active" : ""
                  }`}
                  href="/account/security"
                  onClick={() => setMoreOpen(false)}
                >
                  <span className="mobile-more-item-icon">
                    <SecurityNavIcon />
                  </span>
                  <span>账户安全</span>
                </Link>
                <button
                  type="button"
                  className="mobile-more-item mobile-more-item-danger"
                  onClick={() => {
                    logout();
                    setMoreOpen(false);
                  }}
                >
                  <span className="mobile-more-item-icon">
                    <LogoutNavIcon />
                  </span>
                  <span>退出登录</span>
                </button>
              </>
            ) : (
              <Link
                className="mobile-more-item mobile-more-item-wide"
                href="/login"
                onClick={() => setMoreOpen(false)}
              >
                <span className="mobile-more-item-icon">
                  <NAV_ICON_MAP.about />
                </span>
                <span>去登录</span>
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
