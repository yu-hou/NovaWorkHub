"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useContentGate } from "@/components/auth/ContentGate";
import { LearnersIcon, ViewsIcon } from "@/components/ui/CourseMetricsIcons";
import { ApiError, apiFetch, mediaUrl } from "@/lib/api";
import {
  type ListPageContent,
  type PlatformCard,
} from "@/lib/platform-content";

type CourseAction = "up" | "down" | "delete";
type CatalogKind = "events" | "cases";
const COLLAPSED_CATEGORY_LIMIT = 4;

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
      className="event-card course-event-card rise-in"
      style={{ animationDelay: `${index * 40}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`${card.cta}：${card.title}`}
      onClick={() => onOpen(card)}
      onKeyDown={openFromKeyboard}
    >
      {isAdmin ? (
        <div className="course-card-actions course-card-actions-floating" ref={menuRef}>
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
      <div className="event-card-cover">
        {card.cover ? (
          <Image src={mediaUrl(card.cover)} alt={`${card.title} 课程封面`} fill sizes="(max-width: 760px) calc(100vw - 28px), (max-width: 980px) calc((100vw - 302px) / 2), 30vw" />
        ) : (
          <div className="course-card-cover-fallback">AW</div>
        )}
        <div className="event-card-tags" aria-label="课程标签">
          {card.category ? <span className="event-card-tag">{card.category}</span> : null}
          <span className="event-card-tag">课程</span>
          <span className="event-card-tag">{card.locked ? "会员专享" : "可学习"}</span>
          <span className="event-card-tag">{card.learners || "0"}人</span>
        </div>
      </div>
      <div className="event-card-body">
        <h4>{card.title}</h4>
        <div className="event-card-stats">
          <span className="event-card-stat" aria-label={`${card.learners || "0"} 人学过`}>
            <span className="event-card-stat-icon"><LearnersIcon className="event-card-stat-svg" /></span>
            <span>{card.learners || "0"}</span>
          </span>
          <span className="event-card-stat" aria-label={`${card.views || "0"} 次学习`}>
            <span className="event-card-stat-icon event-card-stat-icon-lg"><ViewsIcon className="event-card-stat-svg" /></span>
            <span>{card.views || "0"}</span>
          </span>
        </div>
        <p>{card.summary || "课程内容持续更新中。"}</p>
        <span className="event-card-action">{card.cta || "查看课程"}</span>
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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const nextContent = await apiFetch<ListPageContent>("/api/courses");
      setContent(nextContent);
      setError("");
    } catch (caught: unknown) {
      setContent(null);
      setError(
        caught instanceof ApiError
          ? caught.detail
          : caught instanceof Error
            ? caught.message
            : "课程加载失败",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void loadCourses();
  }, [authLoading, isLoggedIn, isMember, loadCourses]);

  useEffect(() => {
    if (!categoryMenuOpen) return;
    const close = (event: MouseEvent) => {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [categoryMenuOpen]);

  const categoryItems = useMemo(
    () => content?.categories ?? [],
    [content?.categories],
  );
  const collapsedCategories = useMemo(() => {
    const firstItems = categoryItems.slice(0, COLLAPSED_CATEGORY_LIMIT);
    if (!category || firstItems.some((item) => item.value === category)) {
      return firstItems;
    }
    const selected = categoryItems.find((item) => item.value === category);
    return selected
      ? [...firstItems.slice(0, COLLAPSED_CATEGORY_LIMIT - 1), selected]
      : firstItems;
  }, [category, categoryItems]);
  const hiddenCategories = categoryItems.filter(
    (item) => !collapsedCategories.some((visible) => visible.value === item.value),
  );

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
        await apiFetch("/api/admin/courses/reorder", {
          method: "POST",
          body: {
            first_course_id: Number(card.id),
            first_sort_order: adjacent.sortOrder ?? nextIndex + 1,
            second_course_id: Number(adjacent.id),
            second_sort_order: card.sortOrder ?? currentIndex + 1,
          },
        });
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
      <div className="page-head event-page-head">
        <h2>课程</h2>
        <p>AI 课程与学习资料，覆盖 AI 工具、提示词、自动化工作流和项目交付。</p>
      </div>
      <div className="course-toolbar event-toolbar course-list-toolbar">
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
        <div className="course-tools">
          <div className="course-chips" id="courseCategoryFilter" aria-label="课程分类筛选">
            {collapsedCategories.map((item) => (
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
          {categoryItems.length > COLLAPSED_CATEGORY_LIMIT ? (
            <div className="course-category-more" ref={categoryMenuRef}>
              <button
                type="button"
                className={`course-category-toggle${categoryMenuOpen ? " active" : ""}`}
                aria-expanded={categoryMenuOpen}
                aria-controls="courseCategoryOverflow"
                onClick={() => setCategoryMenuOpen((open) => !open)}
              >
                {categoryMenuOpen ? "收起" : `更多 +${hiddenCategories.length}`}
                <span aria-hidden="true">⌄</span>
              </button>
              {categoryMenuOpen ? (
                <div
                  className="course-category-overflow"
                  id="courseCategoryOverflow"
                  aria-label="更多课程分类"
                >
                  {hiddenCategories.map((item) => (
                    <button
                      type="button"
                      className={`course-chip${category === item.value ? " active" : ""}`}
                      key={item.value || "all-overflow"}
                      onClick={() => {
                        setCategory(item.value);
                        setCategoryMenuOpen(false);
                      }}
                    >
                      {item.label}<span className="dim">{item.count}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
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

function CatalogCard({
  card,
  index,
  kind,
  onOpen,
}: {
  card: PlatformCard;
  index: number;
  kind: CatalogKind;
  onOpen: (card: PlatformCard) => void;
}) {
  const label = kind === "events" ? "活动" : "案例";
  const openFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen(card);
  };

  return (
    <article
      className={`${kind === "cases" ? "case-card" : "event-card"} rise-in`}
      style={{ animationDelay: `${index * 40}ms` }}
      tabIndex={0}
      role="button"
      aria-label={`${card.cta || `查看${label}`}：${card.title}`}
      onClick={() => onOpen(card)}
      onKeyDown={openFromKeyboard}
    >
      <div className={kind === "cases" ? "case-card-cover" : "event-card-cover"}>
        {card.cover ? (
          <Image
            src={mediaUrl(card.cover)}
            alt={`${card.title} ${label}封面`}
            fill
            sizes="(max-width: 760px) calc(100vw - 28px), (max-width: 980px) calc((100vw - 302px) / 2), 30vw"
          />
        ) : (
          <div className="course-card-cover-fallback">AW</div>
        )}
        <div className={kind === "cases" ? "case-card-tags" : "event-card-tags"}>
          {(card.tags?.length ? card.tags : [card.category, label, card.locked ? "会员专享" : "公开"])
            .filter(Boolean)
            .slice(0, 4)
            .map((tag) => (
              <span
                className={kind === "cases" ? "case-card-tag" : "event-card-tag"}
                key={String(tag)}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
      <div className={kind === "cases" ? "case-card-content" : "event-card-body"}>
        <h4 className={kind === "cases" ? "case-card-title" : undefined}>{card.title}</h4>
        <div className={kind === "cases" ? "case-card-stats" : "event-card-stats"}>
          <span className={kind === "cases" ? "case-card-stat" : "event-card-stat"}>
            <span className={kind === "cases" ? "case-card-stat-icon" : "event-card-stat-icon"}>
              <LearnersIcon className={kind === "cases" ? "case-card-stat-svg" : "event-card-stat-svg"} />
            </span>
            <span>{card.learners || "0"}</span>
          </span>
          <span className={kind === "cases" ? "case-card-stat" : "event-card-stat"}>
            <span className={`${kind === "cases" ? "case-card-stat-icon case-card-stat-icon-lg" : "event-card-stat-icon event-card-stat-icon-lg"}`}>
              <ViewsIcon className={kind === "cases" ? "case-card-stat-svg" : "event-card-stat-svg"} />
            </span>
            <span>{card.views || "0"}</span>
          </span>
        </div>
        <p className={kind === "cases" ? "case-card-desc" : undefined}>{card.summary}</p>
        <span className={kind === "cases" ? "case-card-action" : "event-card-action"}>
          {card.href ? card.cta || `查看${label}` : "内容待配置"}
        </span>
      </div>
    </article>
  );
}

function CatalogView({ kind }: { kind: CatalogKind }) {
  const isEvents = kind === "events";
  const label = isEvents ? "活动" : "案例";
  const { loading: authLoading, isLoggedIn, isMember } = useAuth();
  const { openLogin, openMemberGate } = useContentGate();
  const [content, setContent] = useState<ListPageContent | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"latest" | "order">("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ListPageContent>(`/api/catalog/${kind}`);
      setContent(data);
      setError("");
    } catch (caught: unknown) {
      setContent(null);
      setError(caught instanceof ApiError ? caught.detail : caught instanceof Error ? caught.message : `${label}加载失败`);
    } finally {
      setLoading(false);
    }
  }, [kind, label]);

  useEffect(() => {
    if (authLoading) return;
    void load();
  }, [authLoading, load]);

  const visibleCards = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("zh-CN");
    const cards = (content?.cards ?? []).filter((card) => {
      if (category && card.category !== category) return false;
      if (!keyword) return true;
      return `${card.title} ${card.summary ?? ""} ${card.category ?? ""} ${(card.tags ?? []).join(" ")}`
        .toLocaleLowerCase("zh-CN")
        .includes(keyword);
    });
    return cards.slice().sort((a, b) => {
      if (sort === "order") return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return Number(b.id ?? 0) - Number(a.id ?? 0);
    });
  }, [category, content, query, sort]);

  const openCard = (card: PlatformCard) => {
    setNotice("");
    if (card.locked && !isLoggedIn) {
      openLogin(`登录后查看${label}`);
      return;
    }
    if (card.locked && !isMember) {
      openMemberGate();
      return;
    }
    if (!card.href) {
      setNotice(`“${card.title}”尚未配置内容地址，请联系管理员补充。`);
      return;
    }
    window.open(card.href, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="view"
      id={isEvents ? "pageEvents" : "pageCases"}
      data-dynamic-catalog={kind}
    >
      <div className="page-head event-page-head">
        <h2>{label}</h2>
        <p>{isEvents ? "社群活动、直播与回放，按最新整理，和课程页保持同一套阅读节奏。" : "真实成员案例，按最新整理，和活动页保持同一套卡片规范。"}</p>
      </div>
      <div className={`course-toolbar ${isEvents ? "event-toolbar" : "case-toolbar"}`}>
        <div className="course-search">
          <input
            type="search"
            placeholder={content?.searchPlaceholder || `搜索${label}`}
            aria-label={`搜索${label}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="course-tools">
          <div className="course-chips" aria-label={`${label}分类筛选`}>
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
          <div className="case-sort" aria-label={`${label}排序`}>
            <button type="button" className={`case-sort-button${sort === "latest" ? " active" : ""}`} onClick={() => setSort("latest")}>最新</button>
            <button type="button" className={`case-sort-button${sort === "order" ? " active" : ""}`} onClick={() => setSort("order")}>顺序</button>
          </div>
        </div>
      </div>
      {notice ? <div className="course-empty" role="status">{notice}</div> : null}
      <div className="course-grid" id={isEvents ? "eventsGrid" : "casesGrid"}>
        {visibleCards.map((card, index) => (
          <CatalogCard card={card} index={index} kind={kind} key={card.id || `${card.title}-${index}`} onOpen={openCard} />
        ))}
      </div>
      {loading ? <div className="course-empty">正在加载{label}…</div> : null}
      {!loading && error ? (
        <div className="course-empty" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void load()}>重新加载</button>
        </div>
      ) : null}
      {!loading && !error && visibleCards.length === 0 ? (
        <div className="course-empty">{content?.emptyText || `没有找到匹配的${label}。`}</div>
      ) : null}
    </section>
  );
}

export function EventsView() {
  return <CatalogView kind="events" />;
}

export function CasesView() {
  return <CatalogView kind="cases" />;
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
