"use client";

import { PlatformShell } from "@/components/home/PlatformShell";

export function UnavailableView({ title = "暂未开放" }: { title?: string }) {
  return (
    <PlatformShell>
      <section className="view">
        <div className="login-card" style={{ maxWidth: 520, margin: "48px auto" }}>
          <h2>{title}</h2>
          <p className="sub">该舱位暂未开放。可先回到工作台或进入课程舱。</p>
          <div className="form-grid mt-12">
            <a href="/home">返回工作台</a>
            <a href="/learning">打开课程舱</a>
          </div>
        </div>
      </section>
    </PlatformShell>
  );
}
