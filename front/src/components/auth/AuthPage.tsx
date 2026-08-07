"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoginForm } from "@/components/home/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";

type AuthPageProps = {
  action: "login" | "register";
};

export function AuthPage({ action }: AuthPageProps) {
  const router = useRouter();
  const { isLoggedIn, loading, user } = useAuth();
  const isRegister = action === "register";

  useEffect(() => {
    document.body.classList.add("home-app", "auth-app", "workbench-app");
    return () => {
      document.body.classList.remove("home-app", "auth-app", "workbench-app");
    };
  }, []);

  const continueAfterLogin = () => {
    const params = new URLSearchParams(window.location.search);
    const requestedPath = params.get("next");
    const safePath =
      requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/home";
    router.replace(safePath);
  };

  return (
    <main className="auth-page">
      <div className="bg-cosmos" aria-hidden="true" />
      <header className="auth-page-header">
        <Link className="auth-brand" href="/home" aria-label="返回 Nova 工作台">
          <span className="brand-wordmark-text">Nova</span>
          <small>工作台</small>
        </Link>
        <ThemeToggle />
      </header>

      <section className="auth-page-shell">
        <div className="auth-story-panel">
          <span className="auth-kicker">NOVA WORKBENCH</span>
          <h1>{isRegister ? "创建工作台账号" : "欢迎回到工作台"}</h1>
          <p>
            {isRegister
              ? "一个账号连接课程舱、路径轨与席位权益，从今天开始推进你的 AI 任务。"
              : "继续课程与实战进度，把每一次打开都变成可落地的成果。"}
          </p>
          <div className="auth-story-points" aria-label="工作台特点">
            <span>课程舱</span>
            <span>案例库</span>
            <span>席位权益</span>
          </div>
        </div>

        <div className="auth-form-panel">
          {loading ? (
            <p className="auth-status">正在检查登录状态…</p>
          ) : isLoggedIn ? (
            <section className="login-card auth-logged-card">
              <span className="auth-kicker">已登录</span>
              <h2>欢迎回来</h2>
              <p className="sub">{user?.email}</p>
              <div className="form-grid mt-12">
                <Link className="button-link" href="/home">
                  进入工作台
                </Link>
              </div>
            </section>
          ) : (
            <>
              <LoginForm
                title={isRegister ? "注册账号" : "登录账号"}
                subtitle={
                  isRegister
                    ? "使用常用邮箱注册，并设置你的登录密码。"
                    : "默认使用邮箱密码登录，也可以使用邮箱验证码。"
                }
                defaultAction={action}
                allowRegistration={false}
                onSuccess={continueAfterLogin}
              />
              <p className="auth-switch-copy">
                {isRegister ? "已有账号？" : "还没有账号？"}
                <Link href={isRegister ? "/login" : "/register"}>
                  {isRegister ? "去登录" : "免费注册"}
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
