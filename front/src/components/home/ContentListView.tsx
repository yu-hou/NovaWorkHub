"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useContentGate } from "@/components/auth/ContentGate";
import { LearnersIcon, ViewsIcon } from "@/components/home/home-icons";
import { mediaUrl } from "@/lib/api";
import type { ListPageContent, PlatformCard } from "@/lib/platform-content";

type ContentListViewProps = {
  pageId: string;
  content: ListPageContent;
  variant?: "course" | "content" | "benefit";
  filterLabel?: string;
  unavailable?: boolean;
};

function matchesSearch(card: PlatformCard, q: string) {
  if (!q) return true;
  const hay = `${card.title} ${card.summary ?? ""} ${card.category ?? ""}`.toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function ContentListView({
  pageId,
  content,
  variant = "content",
  filterLabel = "筛选",
  unavailable = false,
}: ContentListViewProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState(content.defaultSort);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = content.cards.filter(
      (card) =>
        matchesSearch(card, query) &&
        (!category || card.category === category),
    );
    if (sort === "newest") {
      list = [...list].reverse();
    }
    return list;
  }, [content.cards, query, category, sort]);

  const categoryCounts = useMemo(() => {
    const base = content.cards.filter((card) => matchesSearch(card, query));
    return content.categories.map((chip) => ({
      ...chip,
      count: chip.value
        ? base.filter((c) => c.category === chip.value).length
        : base.length,
    }));
  }, [content.cards, content.categories, query]);

  const activeChipLabel =
    categoryCounts.find((c) => c.value === category)?.label ?? "全部";

  if (unavailable) {
    return (
      <section className="view" id={pageId}>
        <p className="empty-state">暂未开放，敬请期待。</p>
      </section>
    );
  }

  return (
    <section className="view" id={pageId}>
      <div className="list-toolbar" data-list-controls={pageId}>
        <div className="list-search">
          <input
            type="search"
            placeholder={content.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div
          className={`list-tools${filterOpen ? " is-open" : ""}`}
          tabIndex={-1}
        >
          <div className="mobile-list-filter-head">
            <strong>{filterLabel}</strong>
          </div>
          <div className="chip-strip" aria-label="分类">
            {categoryCounts.map((chip) => (
              <button
                key={chip.value || "all"}
                type="button"
                className={`chip-btn${chip.value ? ` category-chip ${chip.categoryClass ?? ""}` : ""}${
                  category === chip.value ? " active" : ""
                }`}
                aria-pressed={category === chip.value}
                onClick={() => setCategory(chip.value)}
              >
                <span>{chip.label}</span>
                <span className="chip-count">{chip.count}</span>
              </button>
            ))}
          </div>
          <div className="segmented tiny" aria-label="排序">
            <button
              type="button"
              className={sort === "newest" ? "active" : ""}
              aria-pressed={sort === "newest"}
              onClick={() => setSort("newest")}
            >
              最新
            </button>
            <button
              type="button"
              className={sort === "sequence" ? "active" : ""}
              aria-pressed={sort === "sequence"}
              onClick={() => setSort("sequence")}
            >
              顺序
            </button>
          </div>
        </div>
        <button
          className="mobile-filter-trigger"
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <span>筛选</span>
          <small>{activeChipLabel}</small>
        </button>
      </div>

      <div
        className={`card-grid${variant === "benefit" ? " benefit-grid" : ""}`}
      >
        {filtered.map((card) =>
          variant === "benefit" ? (
            <BenefitCardItem key={card.title} card={card} />
          ) : (
            <ContentCardItem
              key={card.title + (card.id ?? "")}
              card={card}
              variant={variant}
            />
          ),
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">{content.emptyText}</p>
      ) : null}
    </section>
  );
}

function ContentCardItem({
  card,
  variant,
}: {
  card: PlatformCard;
  variant: "course" | "content";
}) {
  const router = useRouter();
  const { isLoggedIn, isMember } = useAuth();
  const { openLogin, openMemberGate } = useContentGate();

  const onAction = () => {
    if (variant !== "course") {
      window.alert("暂未开放，敬请期待。");
      return;
    }

    if (!isLoggedIn) {
      openLogin("登录后查看课程详情");
      return;
    }

    if (card.cta === "会员专享" || (card.locked && !isMember)) {
      openMemberGate();
      return;
    }

    const href = card.href || (card.id ? `/learning/course?id=${card.id}` : null);
    if (href) {
      router.push(href);
      return;
    }
    window.alert("课程详情暂不可用。");
  };

  return (
    <article
      className={`content-card${variant === "course" ? " course-card" : ""}`}
    >
      <div className="card-cover">
        {card.cover ? <img src={mediaUrl(card.cover)} alt="" /> : null}
      </div>
      <div className="card-body">
        <div className="item-title">
          <h3>{card.title}</h3>
          {card.category ? (
            <div className="category-badges">
              <span
                className={`category-badge ${card.categoryClass ?? ""}`.trim()}
              >
                {card.category}
              </span>
            </div>
          ) : null}
        </div>
        {card.summary ? <p className="summary">{card.summary}</p> : null}
        <div className="course-card-footer">
          <div
            className="learning-stats learning-stats-compact"
            aria-label="学习统计"
          >
            {card.learners != null ? (
              <span className="learning-stat">
                <LearnersIcon />
                <span>{card.learners}</span>
              </span>
            ) : null}
            {card.views != null ? (
              <span className="learning-stat">
                <ViewsIcon />
                <span>{card.views}</span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            className={card.locked ? "locked-action" : undefined}
            onClick={onAction}
          >
            {card.cta}
          </button>
        </div>
      </div>
    </article>
  );
}

function BenefitCardItem({ card }: { card: PlatformCard }) {
  return (
    <article className="content-card benefit-card">
      <div className="card-cover">
        {card.cover ? <img src={mediaUrl(card.cover)} alt="" /> : null}
      </div>
      <div className="card-body">
        <div className="item-title">
          <h3>{card.title}</h3>
          {card.category && card.categoryClass ? (
            <div className="category-badges">
              <span
                className={`category-badge small ${card.categoryClass}`.trim()}
              >
                {card.category}
              </span>
            </div>
          ) : null}
        </div>
        {card.summary ? <p className="summary">{card.summary}</p> : null}
        <div className="benefit-card-footer">
          <div className="benefit-meta">
            <span className={`benefit-price${card.free ? " is-free" : ""}`}>
              {card.free ? (
                "免费"
              ) : (
                <>
                  <strong>{card.priceLabel}</strong>
                  {card.priceUnit ? <small>{card.priceUnit}</small> : null}
                </>
              )}
            </span>
            {card.stock ? <span className="benefit-stock">{card.stock}</span> : null}
          </div>
          <div className="benefit-actions">
            <button
              type="button"
              onClick={() => {
                window.alert("暂未开放，敬请期待。");
              }}
            >
              {card.cta}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
