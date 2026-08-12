"use client";

import Link from "next/link";

const PREVIEW_BENEFITS = [
  { code: "80", unit: "积分", title: "flomoMax 30 天会员", meta: "AI 产品 · 库存 28" },
  { code: "10", unit: "积分", title: "Mole 75 折优惠码", meta: "实用工具 · 库存 45" },
  { code: "FREE", unit: "福利", title: "Codex 购买渠道", meta: "会员专属 · 库存不限" },
];

export function HomeBenefitsGrid() {
  return (
    <div className="section-row">
      <div className="section-title nova-section-title">
        <div>
          <h3>会员福利</h3>
          <p>登录后领取，当前为内容预览</p>
        </div>
        <Link href="/benefits">查看全部 <span aria-hidden="true">→</span></Link>
      </div>
      <div className="nova-voucher-grid">
        {PREVIEW_BENEFITS.map((item) => (
          <article key={item.title}>
            <span className="nova-voucher-notch" aria-hidden="true" />
            <div className="nova-voucher-value"><strong>{item.code}</strong><small>{item.unit}</small></div>
            <div><h4>{item.title}</h4><p>{item.meta}</p></div>
            <span className="nova-voucher-state">暂未开放</span>
          </article>
        ))}
      </div>
    </div>
  );
}
