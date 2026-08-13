"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useContentGate } from "@/components/auth/ContentGate";
import { LearnersIcon, ViewsIcon } from "@/components/ui/CourseMetricsIcons";
import { ApiError, apiFetch, mediaUrl } from "@/lib/api";
import { LEARNING_PAGE, type ListPageContent, type PlatformCard } from "@/lib/platform-content";

type CourseAction = "up" | "down" | "delete";

function mockCourseContent(): ListPageContent {
  return {
    ...LEARNING_PAGE,
    categories: LEARNING_PAGE.categories.map((item) => ({ ...item })),
    cards: LEARNING_PAGE.cards.map((card) => ({
      ...card,
      href: `/learning/course/?id=${card.id}`,
      cta: "查看课程",
      locked: false,
    })),
  };
}

function CourseCard({ card, index, isAdmin, busy, canMoveUp, canMoveDown, onOpen, onAction }: {
  card: PlatformCard;
  index: number;
  isAdmin: boolean;
  busy: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onOpen: (card: PlatformCard) => void;
  onAction: (card: PlatformCard, action: CourseAction) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const openFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen(card);
  };

  return (
    <article
      className="course-card rise-in"
      style={{ animationDelay: `${index * 40}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`${card.cta}：${card.title}`}
      onClick={() => onOpen(card)}
      onKeyDown={openFromKeyboard}
    >
      <header className="course-card-header">
        <div className="course-card-avatar" data-course-id={card.id} aria-hidden="true" />
        <div className="course-card-identity">
          <strong>AgentWork</strong>
          <span>持续更新</span>
        </div>
        {isAdmin ? (
          <div className="course-card-actions" ref={menuRef}>
            <button
              type="button"
              className="course-card-menu"
              aria-label={`管理课程：${card.title}`}
              aria-expanded={menuOpen}
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((open) => !open);
              }}
            >•••</button>
            {menuOpen ? (
              <div className="course-card-action-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                <Link role="menuitem" href={`/admin/courses?edit=${card.id}#course-editor`}>编辑详情</Link>
                <button type="button" role="menuitem" disabled={!canMoveUp || busy} onClick={() => { setMenuOpen(false); onAction(card, "up"); }}>上移一位</button>
                <button type="button" role="menuitem" disabled={!canMoveDown || busy} onClick={() => { setMenuOpen(false); onAction(card, "down"); }}>下移一位</button>
                <button type="button" role="menuitem" className="is-danger" disabled={busy} onClick={() => { setMenuOpen(false); onAction(card, "delete"); }}>删除课程</button>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="course-card-media">
        {card.cover ? (
          <img src={mediaUrl(card.cover)} alt={`${card.title} 课程封面`} loading="lazy" />
        ) : (
          <div className="course-card-cover-fallback">AW</div>
        )}
      </div>
      <div className="course-card-body">
        <h4>{card.title}</h4>
        <div className="course-card-tags">
          {card.category ? <span className="course-card-tag">{card.category}</span> : null}
          <span className="course-card-tag">{card.cta}</span>
          <span className="course-card-tag">课程</span>
        </div>
        <p className="course-card-summary">{card.summary || "课程内容持续更新中。"}</p>
        <div className="course-card-facts">
          <div className="course-card-fact">
            <span className="course-card-fact-icon"><LearnersIcon className="course-fact-svg" /></span>
            <span>{card.learners || "0"} 人学过</span>
          </div>
          <div className="course-card-fact">
            <span className="course-card-fact-icon"><ViewsIcon className="course-fact-svg" /></span>
            <span>{card.views || "0"} 次学习</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CoursesView() {
  const { loading: authLoading, isLoggedIn, isMember, isAdmin } = useAuth();
  const { openLogin, openMemberGate } = useContentGate();
  const [content, setContent] = useState<ListPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const nextContent = await apiFetch<ListPageContent>("/api/courses");
      setContent(nextContent.cards.length > 0 ? nextContent : mockCourseContent());
      setError("");
    } catch (caught: unknown) {
      setContent(mockCourseContent());
      setError("");
      console.warn(
        "课程后端数据暂不可用，已使用本地模拟数据。",
        caught instanceof ApiError ? caught.detail : caught,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void loadCourses();
  }, [authLoading, isLoggedIn, isMember, loadCourses]);

  const visibleCards = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    return (content?.cards ?? []).filter((card) => {
      if (category && card.category !== category) return false;
      if (!keyword) return true;
      return `${card.title} ${card.summary ?? ""} ${card.category ?? ""}`
        .toLocaleLowerCase("zh-CN")
        .includes(keyword);
    });
  }, [category, content, query]);

  const openCourse = (card: PlatformCard) => {
    if (!isLoggedIn) {
      openLogin("登录后查看课程");
      return;
    }
    if (card.locked && !isMember) {
      openMemberGate();
      return;
    }
    const href = card.href || `/learning/course/?id=${card.id}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const manageCourse = async (card: PlatformCard, action: CourseAction) => {
    if (!isAdmin || !card.id || busyId) return;
    const cards = content?.cards ?? [];
    const currentIndex = cards.findIndex((item) => item.id === card.id);
    setBusyId(card.id);
    try {
      if (action === "delete") {
        if (!window.confirm(`确认删除课程“${card.title}”？此操作不可撤销。`)) return;
        await apiFetch(`/api/admin/courses/${card.id}`, { method: "DELETE" });
      } else {
        const nextIndex = action === "up" ? currentIndex - 1 : currentIndex + 1;
        const adjacent = cards[nextIndex];
        if (currentIndex < 0 || !adjacent?.id) return;
        await Promise.all([
          apiFetch(`/api/admin/courses/${card.id}`, { method: "PATCH", body: { sort_order: adjacent.sortOrder ?? nextIndex + 1 } }),
          apiFetch(`/api/admin/courses/${adjacent.id}`, { method: "PATCH", body: { sort_order: card.sortOrder ?? currentIndex + 1 } }),
        ]);
      }
      await loadCourses();
    } catch (caught: unknown) {
      setError(caught instanceof ApiError ? caught.detail : caught instanceof Error ? caught.message : "课程操作失败");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="view" id="pageLearning" data-dynamic-courses="true">
      <div className="page-head">
        <h2>课程</h2>
        <p>AI 课程与学习资料，覆盖 AI 工具、提示词、自动化工作流和项目交付。</p>
      </div>
      <div className="course-toolbar">
        <div className="course-search-actions">
          <div className="course-search">
            <input
              type="search"
              id="courseSearch"
              placeholder={content?.searchPlaceholder || "搜索课程"}
              aria-label="搜索课程"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {isAdmin ? (
            <Link className="course-admin-add" href="/admin/courses#course-editor">
              <span aria-hidden="true">＋</span>
              添加课程
            </Link>
          ) : null}
        </div>
        <div className="course-tools">
          <div className="course-chips" id="courseCategoryFilter" aria-label="课程分类筛选">
            {(content?.categories ?? []).map((item) => (
              <button
                type="button"
                className={`course-chip${category === item.value ? " active" : ""}`}
                key={item.value || "all"}
                onClick={() => setCategory(item.value)}
              >
                {item.label}<span className="dim">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="course-grid" id="courseGrid">
        {visibleCards.map((card, index) => (
          <CourseCard
            card={card}
            index={index}
            key={card.id || `${card.title}-${index}`}
            isAdmin={isAdmin}
            busy={busyId === card.id}
            canMoveUp={(content?.cards ?? []).findIndex((item) => item.id === card.id) > 0}
            canMoveDown={(content?.cards ?? []).findIndex((item) => item.id === card.id) < (content?.cards.length ?? 0) - 1}
            onOpen={openCourse}
            onAction={(target, action) => void manageCourse(target, action)}
          />
        ))}
      </div>
      {loading ? <div className="course-empty">正在加载课程…</div> : null}
      {!loading && error ? <div className="course-empty" role="alert">{error}</div> : null}
      {!loading && !error && visibleCards.length === 0 ? (
        <div className="course-empty" id="courseEmpty">{content?.emptyText || "没有找到匹配的课程。"}</div>
      ) : null}
    </section>
  );
}

export function EventsView() {
  return (
    <section className="view" id="pageEvents">
      <div className="page-head event-page-head">
        <h2>活动</h2>
        <p>社群活动、直播与回放，按最新整理，和课程页保持同一套阅读节奏。</p>
      </div>
      <div className="course-toolbar event-toolbar">
        <div className="course-search">
          <input
            type="search"
            id="eventSearch"
            placeholder="搜索活动"
            aria-label="搜索活动"
          />
        </div>
        <div className="course-tools">
          <div
            className="course-chips"
            id="eventCategoryFilter"
            aria-label="活动分类筛选"
          />
        </div>
      </div>
      <div className="course-grid" id="eventsGrid" />
      <div className="course-empty hidden" id="eventsEmpty">
        没有找到匹配的活动。
      </div>
    </section>
  );
}

export function CasesView() {
  return (
    <section className="view" id="pageCases">
      <div className="page-head event-page-head">
        <h2>案例</h2>
        <p>真实成员案例，按最新整理，和活动页保持同一套卡片规范。</p>
      </div>
      <div className="course-toolbar case-toolbar">
        <div className="course-search">
          <input
            type="search"
            id="caseSearch"
            placeholder="搜索案例"
            aria-label="搜索案例"
          />
        </div>
        <div className="course-tools">
          <div
            className="course-chips"
            id="caseCategoryFilter"
            aria-label="案例分类筛选"
          />
          <div className="case-sort" aria-label="案例排序">
            <button
              type="button"
              className="case-sort-button active"
              data-case-sort="latest"
            >
              最新
            </button>
            <button
              type="button"
              className="case-sort-button"
              data-case-sort="order"
            >
              顺序
            </button>
          </div>
        </div>
      </div>
      <div className="course-grid" id="casesGrid" />
      <div className="course-empty hidden" id="casesEmpty">
        没有找到匹配的案例。
      </div>
    </section>
  );
}

export function BenefitsView() {
  return (
    <section className="view" id="pageBenefits">
      <div className="page-head">
        <h2>福利</h2>
        <p>会员福利、兑换码与工具权益，和活动页保持同一套阅读节奏。</p>
      </div>
      <div className="course-toolbar">
        <div className="course-search">
          <input
            type="search"
            id="benefitSearch"
            placeholder="搜索福利"
            aria-label="搜索福利"
          />
        </div>
        <div className="course-tools">
          <div
            className="course-chips"
            id="benefitCategoryFilter"
            aria-label="福利分类筛选"
          />
          <div className="case-sort" aria-label="福利排序">
            <button
              type="button"
              className="case-sort-button active"
              data-benefit-sort="latest"
            >
              最新
            </button>
            <button
              type="button"
              className="case-sort-button"
              data-benefit-sort="order"
            >
              顺序
            </button>
          </div>
        </div>
      </div>
      <div className="course-grid" id="benefitActivityGrid" />
      <div className="course-empty hidden" id="benefitEmpty">
        没有找到匹配的福利。
      </div>
      <section
        className="section-row benefit-claims"
        aria-labelledby="benefitClaimsTitle"
      >
        <div className="section-title">
          <div>
            <h3 id="benefitClaimsTitle">我的领取记录</h3>
          </div>
        </div>
        <div className="benefit-claims-empty">暂无领取记录。</div>
      </section>
    </section>
  );
}

export function LiveView() {
  return (
    <section className="view live-replay-view" id="pageReplays">
      <div className="live-replay-page">
        <div className="live-toolbar">
          <div className="live-search">
            <input
              type="search"
              id="liveSearch"
              placeholder="搜索直播或回看"
              aria-label="搜索直播或回看"
            />
          </div>
          <div className="live-controls">
            <div className="live-category-filter" aria-label="直播分类筛选">
              <button
                type="button"
                className="live-filter-chip active"
                data-live-filter="all"
              >
                全部 <span className="count">0</span>
              </button>
            </div>
            <div className="live-sort" aria-label="直播排序">
              <button
                type="button"
                className="live-sort-button active"
                data-live-sort="latest"
              >
                最新
              </button>
              <button
                type="button"
                className="live-sort-button"
                data-live-sort="order"
              >
                顺序
              </button>
            </div>
          </div>
        </div>
        <div className="live-empty-stage" role="status" aria-live="polite">
          <div className="live-empty-message">暂无直播回看。</div>
        </div>
      </div>
    </section>
  );
}
