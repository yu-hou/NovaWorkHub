"use client";

import { useMemo, useState } from "react";

import { LearnersIcon, ViewsIcon } from "@/components/home/home-icons";
import type { ListPageContent, PlatformCard } from "@/lib/platform-content";

type ContentListViewProps = {
  pageId: string;
  content: ListPageContent;
  variant?: "course" | "content" | "benefit";
  filterLabel?: string;
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
  const onAction = () => {
    if (card.href && !card.locked) {
      window.open(card.href, "_blank", "noopener,noreferrer");
      return;
    }
    window.alert(
      card.locked
        ? "演示环境：会员专享内容需登录后查看。"
        : "演示环境：请登录后查看课程详情。",
    );
  };

  return (
    <article
      className={`content-card${variant === "course" ? " course-card" : ""}`}
    >
      <div className="card-cover">
        {card.cover ? <img src={card.cover} alt="" /> : null}
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
        {card.cover ? <img src={card.cover} alt="" /> : null}
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
            {card.instructionsHref ? (
              <a
                className="text-button"
                href={card.instructionsHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                兑换说明
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => {
                window.alert("演示环境：领取福利需登录后使用。");
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
