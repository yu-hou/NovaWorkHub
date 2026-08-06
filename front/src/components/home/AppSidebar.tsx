"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NAV_ICON_MAP } from "@/components/home/home-icons";
import { LoginModal } from "@/components/home/LoginModal";
import { SIDE_NAV } from "@/lib/home-content";

export function AppSidebar() {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTitle, setLoginModalTitle] = useState("登录后投稿");
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
          <a
            className="sidebar-wordmark-link"
            href="/"
            title="返回官网"
            aria-label="AgentWork"
          >
            <span className="sidebar-brand-title">
              <img
                className="brand-wordmark"
                src="/images/zhenganhuo/logo2.png"
                alt="AgentWork"
              />
            </span>
            <p>让AI真正干活</p>
          </a>
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
                    setLoginModalTitle("登录后投稿");
                    setLoginModalOpen(true);
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
        </nav>

        <div className="sidebar-footer">
          <div className="account-menu" id="accountMenu" ref={rootRef}>
            <button
              className="account-trigger"
              type="button"
              aria-expanded={accountOpen}
              aria-controls="accountMenuPanel"
              onClick={() => setAccountOpen((v) => !v)}
            >
              <span className="avatar">登</span>
              <span className="account-trigger-text">
                <strong>登录 / 注册</strong>
                <small>邮箱验证码登录</small>
              </span>
            </button>

            <div
              className={`account-popover${accountOpen ? "" : " hidden"}`}
              id="accountMenuPanel"
            >
              <section className="login-card" id="loginCard">
                <h2>邮箱登录</h2>
                <p className="sub">登录后可打开课程、激活权益和领取福利。</p>
                <div className="form-grid mt-12">
                  <div>
                    <label htmlFor="loginEmail">邮箱地址</label>
                    <input
                      id="loginEmail"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.alert("演示环境：验证码未发送。");
                    }}
                  >
                    发送验证码
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </aside>

      <LoginModal
        open={loginModalOpen}
        title={loginModalTitle}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
