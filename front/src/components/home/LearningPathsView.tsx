"use client";

import { useState, type ReactNode } from "react";

import { LEARNING_PATHS } from "@/lib/platform-content";

const PATH_ICONS: Record<string, ReactNode> = {
  violet: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z" />
    </svg>
  ),
  cyan: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.2 2.8 5.8 13h5.4l-.4 8.2L18.2 11h-5.4z" />
    </svg>
  ),
  rose: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8z" />
      <path d="m13.8 7 3.2 3.2" />
      <path d="M14.8 4.2 16.5 2.5 21.5 7.5 19.8 9.2" />
    </svg>
  ),
  gold: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m17 2 3 3-3 3" />
      <path d="M4 11V9a4 4 0 0 1 4-4h12" />
      <path d="m7 22-3-3 3-3" />
      <path d="M20 13v2a4 4 0 0 1-4 4H4" />
    </svg>
  ),
  green: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m14 4-4 16" />
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <path d="M9 6h3a3 3 0 0 1 3 3v6" />
      <path d="m12.5 12.5 2.5 2.5 2.5-2.5" />
    </svg>
  ),
};

export function LearningPathsView() {
  const [activeId, setActiveId] = useState(LEARNING_PATHS[0]?.id ?? "");
  const active = LEARNING_PATHS.find((p) => p.id === activeId) ?? LEARNING_PATHS[0];

  return (
    <section className="view learning-paths-page" id="pageLearningPaths">
      <header className="nova-page-head learning-paths-header">
        <div>
          <p className="nova-page-eyebrow">GUIDED LEARNING</p>
          <h1>学习路径</h1>
          <p>第一次来不知道学什么？选一条路线，按顺序完成每一课。</p>
        </div>
        <span className="nova-preview-badge">路径预览 · 暂未开放</span>
      </header>

      <nav className="chip-strip learning-path-tabs" role="tablist" aria-label="学习路线">
        {LEARNING_PATHS.map((path) => {
          const selected = path.id === activeId;
          return (
            <button
              key={path.id}
              className={`chip-btn learning-path-tab learning-path-tone-${path.tone}${
                selected ? " active" : ""
              }`}
              id={`learningPathTab-${path.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`learningPathPanel-${path.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(path.id)}
            >
              <span className="learning-path-tab-icon">
                {PATH_ICONS[path.tone]}
              </span>
              <span>{path.label}</span>
            </button>
          );
        })}
      </nav>

      {LEARNING_PATHS.map((path) => {
        const hidden = path.id !== active?.id;
        return (
          <section
            key={path.id}
            className={`learning-path-panel learning-path-tone-${path.tone}`}
            id={`learningPathPanel-${path.id}`}
            role="tabpanel"
            aria-labelledby={`learningPathTab-${path.id}`}
            hidden={hidden}
          >
            <div className="learning-path-summary">
              <span className="learning-path-summary-icon" aria-hidden="true">
                {PATH_ICONS[path.tone]}
              </span>
              <div className="learning-path-summary-copy">
                <h3>{path.label}</h3>
                <p>{path.description}</p>
              </div>
              <span className="learning-path-count">{path.count}</span>
            </div>

            <div className="learning-path-sequence-head">
              <h3>学习顺序</h3>
              <p>按顺序学习 · 点击去学习打开课程阅读器</p>
            </div>

            <div className="lesson-list learning-path-lessons">
              {path.lessons.map((lesson) => (
                <article className="lesson-row learning-path-lesson" key={lesson.href + lesson.index}>
                  <div className="lesson-index">{lesson.index}</div>
                  <div className="lesson-main">
                    <div className="lesson-title-line">
                      <span
                        className={`category-badge small learning-path-course ${lesson.categoryClass}`}
                      >
                        {lesson.category}
                      </span>
                      <h3 title={lesson.title}>{lesson.title}</h3>
                    </div>
                  </div>
                  <div className="lesson-action">
                    <button
                      className="button-link learning-path-action"
                      type="button"
                      onClick={() => window.alert("学习路径将在后续版本开放，请先前往课程页学习。")}
                    >
                      去学习
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
