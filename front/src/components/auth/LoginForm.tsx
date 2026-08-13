"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

type LoginFormProps = {
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
  defaultMode?: "code" | "password";
  defaultEmail?: string;
  allowRegistration?: boolean;
  defaultAction?: "login" | "register";
};

export function LoginForm({
  onSuccess,
  title = "邮箱登录",
  subtitle = "登录后可打开课程、激活权益和领取福利。",
  defaultMode = "password",
  defaultEmail = "",
  allowRegistration = true,
  defaultAction = "login",
}: LoginFormProps) {
  const { sendCode, loginWithCode, loginWithPassword, registerWithPassword } = useAuth();
  const [action, setAction] = useState<"login" | "register">(defaultAction);
  const [mode, setMode] = useState<"code" | "password">(defaultMode);
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSendCode = async () => {
    setError("");
    setHint("");
    if (!email.trim()) {
      setError("请输入邮箱");
      return;
    }
    setBusy(true);
    try {
      const message = await sendCode(email.trim());
      setHint(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setHint("");
    setBusy(true);
    try {
      if (action === "register") {
        if (password.length < 6) throw new Error("密码至少需要 6 位");
        if (password !== passwordConfirmation) throw new Error("两次输入的密码不一致");
        const result = await registerWithPassword(email.trim(), password);
        setHint(result.message);
        if (result.signedIn) {
          onSuccess?.();
        } else {
          setConfirmationEmail(email.trim());
          setPassword("");
          setPasswordConfirmation("");
        }
      } else if (mode === "code") {
        await loginWithCode(email.trim(), code.trim());
        onSuccess?.();
      } else {
        await loginWithPassword(email.trim(), password);
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="login-card">
      <h2>{title}</h2>
      <p className="sub">{subtitle}</p>
      {confirmationEmail ? (
        <div className="auth-email-confirmation" role="status" aria-live="polite">
          <span className="auth-email-confirmation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m5 8 7 5 7-5" />
              <path d="m16.5 17 1.5 1.5 3-3" />
            </svg>
          </span>
          <div className="auth-email-confirmation-copy">
            <span className="auth-email-confirmation-badge">注册成功</span>
            <h3>验证邮件已发送</h3>
            <p>
              我们已向 <strong>{confirmationEmail}</strong> 发送验证邮件，请点击邮件中的链接完成账号激活。
            </p>
          </div>
          <div className="auth-email-confirmation-tip">
            <strong>下一步</strong>
            <span>打开邮箱并完成验证，然后返回登录页使用密码登录。</span>
            <small>没有收到？请检查垃圾邮件或稍等 1 分钟后再试。</small>
          </div>
          <button
            type="button"
            className="auth-email-change-button"
            onClick={() => {
              setConfirmationEmail("");
              setHint("");
              setError("");
            }}
          >
            更换邮箱重新注册
          </button>
        </div>
      ) : (
        <>
      {allowRegistration ? (
        <div className="segmented tiny mt-12" aria-label="账户操作">
          <button
            type="button"
            className={action === "login" ? "active" : ""}
            onClick={() => {
              setAction("login");
              setError("");
              setHint("");
            }}
          >
            登录
          </button>
          <button
            type="button"
            className={action === "register" ? "active" : ""}
            onClick={() => {
              setAction("register");
              setMode("password");
              setError("");
              setHint("");
            }}
          >
            注册
          </button>
        </div>
      ) : null}
      {action === "login" ? (
        <div className="segmented tiny mt-12" aria-label="登录方式">
        <button
          type="button"
          className={mode === "password" ? "active" : ""}
          onClick={() => setMode("password")}
        >
          密码
        </button>
        <button
          type="button"
          className={mode === "code" ? "active" : ""}
          onClick={() => setMode("code")}
        >
          验证码
        </button>
        </div>
      ) : null}
      <form className="form-grid mt-12" onSubmit={onSubmit}>
        <div>
          <label htmlFor="loginEmailInput">邮箱地址</label>
          <input
            id="loginEmailInput"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {action === "login" && mode === "code" ? (
          <>
            <div>
              <label htmlFor="loginCodeInput">验证码</label>
              <input
                id="loginCodeInput"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="8 位验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="button" disabled={busy} onClick={() => void onSendCode()}>
              发送验证码
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="loginPasswordInput">密码</label>
              <input
                id="loginPasswordInput"
                type="password"
                autoComplete={action === "register" ? "new-password" : "current-password"}
                minLength={action === "register" ? 6 : undefined}
                placeholder={action === "register" ? "至少 6 位密码" : "请输入密码"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {action === "register" ? (
              <div>
                <label htmlFor="registerPasswordConfirmationInput">确认密码</label>
                <input
                  id="registerPasswordConfirmationInput"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="再次输入密码"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            ) : null}
          </>
        )}
        <button type="submit" disabled={busy}>
          {busy ? (action === "register" ? "注册中…" : "登录中…") : action === "register" ? "注册" : "登录"}
        </button>
      </form>
      {hint ? <p className="sub mt-12">{hint}</p> : null}
      {error ? (
        <div className="auth-form-error mt-12" role="alert">
          <span className="auth-form-error-icon" aria-hidden="true">!</span>
          <p>{error}</p>
        </div>
      ) : null}
        </>
      )}
    </section>
  );
}
