"use client";

import { LearnersIcon, ViewsIcon } from "@/components/home/home-icons";
import { HOME_LEARNING } from "@/lib/home-content";

export function HomeLearningGrid() {
  return (
    <div className="section-row">
      <div className="section-title">
        <h3>最新学习内容</h3>
        <a className="text-button" href="/learning">
          查看全部
        </a>
      </div>
      <div className="card-grid compact-grid" id="homeContentList">
        {HOME_LEARNING.map((card) => (
          <article className="content-card" key={card.title}>
            <div className="card-cover">
              <img src={card.cover} alt="" />
            </div>
            <div className="card-body">
              <div className="item-title">
                <h3>{card.title}</h3>
                <div className="category-badges">
                  <span className="category-badge category-green">{card.category}</span>
                </div>
              </div>
              <p className="summary">{card.summary}</p>
              <div className="course-card-footer">
                <div className="learning-stats learning-stats-compact" aria-label="学习统计">
                  <span className="learning-stat">
                    <LearnersIcon />
                    <span>{card.learners}</span>
                  </span>
                  <span className="learning-stat">
                    <ViewsIcon />
                    <span>{card.views}</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="locked-action"
                  onClick={() => {
                    window.alert("演示环境：会员专享内容需登录后查看。");
                  }}
                >
                  会员专享
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
