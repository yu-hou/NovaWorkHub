"use client";

import { useEffect, useState } from "react";

import {
  BANNER_DURATION_MS,
  DESK_MODULES,
  HOME_BANNERS,
} from "@/lib/home-content";

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
    <div className="wb-desk-home">
      <header className="wb-desk-welcome">
        <div>
          <p className="wb-desk-kicker">NOVA WORKBENCH</p>
          <h1>工作台</h1>
          <p className="wb-desk-lead">
            今天的任务从这里开始。课程、路径与案例都在侧栏，推荐课在下方。
          </p>
        </div>
        <div
          className="wb-desk-spotlight"
          style={{ ["--home-banner-duration" as string]: `${BANNER_DURATION_MS}ms` }}
        >
          <div className="wb-desk-spotlight-media" aria-hidden="true">
            <img src={slide.image} alt="" />
          </div>
          <div className="wb-desk-spotlight-copy">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <a href={slide.href}>{slide.cta}</a>
          </div>
          <div className="wb-desk-spotlight-rail" aria-hidden="true">
            {HOME_BANNERS.map((item, i) => {
              let state = "";
              if (i < index) state = "complete";
              if (i === index) state = "active";
              return (
                <span key={item.title} className={`wb-desk-progress ${state}`.trim()}>
                  <span />
                </span>
              );
            })}
          </div>
        </div>
      </header>

      <nav className="wb-desk-modules" aria-label="工作台模块">
        {DESK_MODULES.map((mod) => (
          <a className="wb-desk-module" href={mod.href} key={mod.code}>
            <span>{mod.code}</span>
            <strong>{mod.title}</strong>
            <small>{mod.subtitle}</small>
          </a>
        ))}
      </nav>
    </div>
  );
}
