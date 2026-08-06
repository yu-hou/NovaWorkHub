"use client";

import { useEffect, useState } from "react";

import {
  BANNER_DURATION_MS,
  HOME_BANNERS,
  HOME_SIDE_CARDS,
} from "@/lib/home-content";

export function HomeBannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HOME_BANNERS.length);
    }, BANNER_DURATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="home-hero">
      <div
        className="home-carousel"
        id="homeBannerCarousel"
        aria-label="首页跑马灯"
      >
        <div className="home-banner-stage" id="homeBannerStage">
          {HOME_BANNERS.map((slide, i) => (
            <article
              key={slide.title}
              className={`home-banner-slide${i === index ? " active" : ""}`}
              aria-hidden={i !== index}
            >
              <div className="home-banner-image">
                <img src={slide.image} alt="" />
              </div>
              <div className="home-banner-copy">
                <span className="eyebrow">Nova</span>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <a
                  className="home-banner-link"
                  href={slide.href}
                  tabIndex={i === index ? 0 : -1}
                >
                  {slide.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
        <div
          className="home-banner-rail"
          id="homeBannerRail"
          style={{ ["--home-banner-duration" as string]: `${BANNER_DURATION_MS}ms` }}
        >
          {HOME_BANNERS.map((slide, i) => {
            let state = "";
            if (i < index) state = "complete";
            if (i === index) state = "active";
            return (
              <span
                key={slide.title}
                className={`home-banner-progress ${state}`.trim()}
                aria-hidden="true"
              >
                <span />
              </span>
            );
          })}
        </div>
      </div>

      <div className="home-side-cards" id="homeSideCards" aria-label="首页右侧展示区">
        {HOME_SIDE_CARDS.map((card) => (
          <a
            key={card.title}
            className="home-side-card has-image"
            href={card.href}
            style={{
              ["--home-side-card-bg" as string]: `url('${card.image}')`,
            }}
          >
            <div className="home-side-card-copy">
              <strong>{card.title}</strong>
              <p>{card.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
