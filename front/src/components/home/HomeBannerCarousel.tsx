"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  BANNER_DURATION_MS,
  HOME_BANNERS,
} from "@/lib/home-content";

const SIGNALS = [
  { code: "PATH", title: "6 条学习路径已就绪", meta: "从小白入门到业务 Agent", value: "38", unit: "节" },
  { code: "COURSE", title: "课程库持续更新", meta: "真实课程与会员权限", value: "06", unit: "门" },
  { code: "BUILD", title: "本周开始一个实战", meta: "学一课，改一个工作流", value: "NEW", unit: "行动" },
];

export function HomeBannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HOME_BANNERS.length);
    }, BANNER_DURATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  const slide = HOME_BANNERS[index];

  return (
    <div className="nova-home-hero">
      <section className="nova-carousel" aria-label="推荐内容">
        <div
          className="nova-banner-stage"
          style={{ ["--home-banner-duration" as string]: `${BANNER_DURATION_MS}ms` }}
        >
          <div className="nova-banner-media" aria-hidden="true">
            <img src={slide.image} alt="" />
            <span className="nova-banner-scrim" />
          </div>
          <div className="nova-banner-copy">
            <span className="nova-banner-tag">NOVA · 今日推荐</span>
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <Link href={slide.href}>{slide.cta}<span aria-hidden="true">→</span></Link>
          </div>
          <div className="nova-banner-progress" aria-hidden="true">
            {HOME_BANNERS.map((item, i) => {
              let state = "";
              if (i < index) state = "complete";
              if (i === index) state = "active";
              return (
                <span key={item.title} className={`nova-progress ${state}`.trim()}>
                  <span />
                </span>
              );
            })}
          </div>
        </div>
        <div className="nova-banner-rail" role="tablist" aria-label="切换推荐内容">
          {HOME_BANNERS.map((item, i) => (
            <button
              key={item.title}
              type="button"
              className={i === index ? "active" : ""}
              aria-label={`显示第 ${i + 1} 条推荐`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </section>

      <aside className="nova-system-panel">
        <header>
          <div><h2>本周动态</h2><p>从课程到行动的社区信号</p></div>
          <strong>03 <small>条</small></strong>
        </header>
        <div className="nova-system-rows">
          {SIGNALS.map((item, i) => (
            <article key={item.code}>
              <span className="nova-signal-index">{String(i + 1).padStart(2, "0")}</span>
              <div><small>{item.code}</small><h3>{item.title}</h3><p>{item.meta}</p></div>
              <strong>{item.value}<small>{item.unit}</small></strong>
            </article>
          ))}
        </div>
        <Link href="/learning">进入课程库 <span aria-hidden="true">→</span></Link>
      </aside>
    </div>
  );
}
