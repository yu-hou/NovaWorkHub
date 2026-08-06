"use client";

import { PlatformShell } from "@/components/home/PlatformShell";

export function UnavailableView({ title = "暂未开放" }: { title?: string }) {
  return (
    <PlatformShell>
      <section className="view">
        <div className="login-card" style={{ maxWidth: 520, margin: "48px auto" }}>
          <h2>{title}</h2>
          <p className="sub">该模块暂未开放，敬请期待。当前可浏览首页与课程内容。</p>
          <div className="form-grid mt-12">
            <a href="/home">返回首页</a>
            <a href="/learning">去看课程</a>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
}
