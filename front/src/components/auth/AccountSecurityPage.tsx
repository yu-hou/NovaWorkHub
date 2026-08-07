"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AccountSecurityPage() {
  const { changePassword, isLoggedIn, isAdmin, loading, logout, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.body.classList.add("home-app", "auth-app");
    return () => {
      document.body.classList.remove("home-app", "auth-app");
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPassword.length < 6) {
      setError("新密码至少需要 6 位");
      return;
    }
    if (newPassword !== confirmation) {
      setError("两次输入的新密码不一致");
      return;
    }
    if (currentPassword === newPassword) {
      setError("新密码不能与当前密码相同");
      return;
    }

    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setMessage("密码修改成功，下次登录请使用新密码");
    } catch (err) {
      setError(err instanceof Error ? err.message : "密码修改失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page account-security-page">
      <div className="bg-cosmos" aria-hidden="true" />
      <header className="auth-page-header">
        <Link className="auth-brand" href="/home" aria-label="返回 Nova 首页">
          <span className="brand-wordmark-text">Nova</span>
          <small>账户安全</small>
        </Link>
        <ThemeToggle />
      </header>

      <section className="auth-page-shell">
        <div className="auth-story-panel account-security-story">
          <span className="auth-kicker">ACCOUNT SECURITY</span>
          <h1>保护你的学习账号</h1>
          <p>定期更新密码，不要与其他网站共用密码，并妥善保管你的登录信息。</p>
          <div className="auth-story-points" aria-label="安全建议">
            <span>验证当前密码</span>
            <span>至少 6 位</span>
            <span>立即生效</span>
          </div>
        </div>

        <div className="auth-form-panel">
          {loading ? (
            <p className="auth-status">正在检查登录状态…</p>
          ) : !isLoggedIn ? (
            <section className="login-card auth-logged-card">
              <h2>请先登录</h2>
              <p className="sub">登录后才能修改账号密码。</p>
              <div className="form-grid mt-12">
                <Link className="button-link" href="/login?next=/account/security">
                  前往登录
                </Link>
              </div>
            </section>
          ) : (
            <section className="login-card auth-logged-card">
              <span className="auth-kicker">{user?.email}</span>
              <h2>修改密码</h2>
              <p className="sub">输入当前密码，并设置一个新的登录密码。</p>
              {isAdmin ? (
                <div className="form-grid mt-12 account-security-admin-entry">
                  <Link className="button-link" href="/admin">
                    进入管理后台
                  </Link>
                </div>
              ) : null}
              <form className="form-grid mt-12" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="securityCurrentPassword">当前密码</label>
                  <input
                    id="securityCurrentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityNewPassword">新密码</label>
                  <input
                    id="securityNewPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="至少 6 位密码"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityPasswordConfirmation">确认新密码</label>
                  <input
                    id="securityPasswordConfirmation"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    placeholder="再次输入新密码"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={busy}>
                  {busy ? "保存中…" : "保存新密码"}
                </button>
              </form>
              {message ? <p className="form-note account-security-success">{message}</p> : null}
              {error ? <p className="form-note account-security-error">{error}</p> : null}
              <p className="auth-switch-copy">
                <Link href="/home">← 返回学习平台</Link>
                {" · "}
                <button type="button" className="auth-text-button" onClick={logout}>
                  退出登录
                </button>
              </p>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
