"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useContentGate } from "@/components/auth/ContentGate";
import { LearnersIcon, ViewsIcon } from "@/components/home/home-icons";
import { apiFetch, mediaUrl } from "@/lib/api";
import type { ListPageContent, PlatformCard } from "@/lib/platform-content";

export function HomeRecommendedCourses() {
  const router = useRouter();
  const { isLoggedIn, isMember, loading: authLoading } = useAuth();
  const { openLogin, openMemberGate } = useContentGate();
  const [cards, setCards] = useState<PlatformCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    // The session change starts a fresh recommendation request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void apiFetch<ListPageContent>("/api/courses")
      .then((data) => {
        if (cancelled) return;
        // 推荐：优先公开课，再补会员课，最多 6 门
        const free = data.cards.filter((c) => c.cta !== "会员专享");
        const member = data.cards.filter((c) => c.cta === "会员专享");
        setCards([...free, ...member].slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setCards([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, isMember]);

  const onOpen = (card: PlatformCard) => {
    if (!isLoggedIn) {
      openLogin("登录后查看课程详情");
      return;
    }
    if (card.cta === "会员专享" || (card.locked && !isMember)) {
      openMemberGate();
      return;
    }
    const href = card.href || (card.id ? `/learning/course?id=${card.id}` : null);
    if (href) router.push(href);
  };

  return (
    <div className="section-row">
      <div className="section-title wb-section-title">
        <div>
          <p className="wb-desk-kicker">RECOMMENDED</p>
          <h3>推荐课程舱</h3>
        </div>
        <a className="text-button" href="/learning">
          打开全部
        </a>
      </div>

      {loading ? <p className="empty-state">推荐课程加载中…</p> : null}

      {!loading && cards.length === 0 ? (
        <p className="empty-state">暂无推荐课程。</p>
      ) : null}

      {!loading && cards.length > 0 ? (
        <div className="card-grid compact-grid" id="homeRecommendedCourses">
          {cards.map((card) => (
            <article
              className="content-card course-card"
              key={card.id ?? card.title}
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
                    onClick={() => onOpen(card)}
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
