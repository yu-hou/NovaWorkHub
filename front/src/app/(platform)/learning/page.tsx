"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { ApiError, apiFetch } from "@/lib/api";
import type { ListPageContent } from "@/lib/platform-content";

export default function LearningPage() {
  const { isLoggedIn, isMember, loading: authLoading } = useAuth();
  const [content, setContent] = useState<ListPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    // The session change starts a fresh database request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void apiFetch<ListPageContent>("/api/courses")
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof ApiError) setError(err.detail);
          else if (err instanceof TypeError) {
            setError("无法连接服务器，请确认后端已启动");
          } else {
            setError(err instanceof Error ? err.message : "加载课程失败");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, isMember]);

  return (
    <PlatformShell>
      {error ? (
        <div className="login-card" style={{ maxWidth: 480, margin: "32px auto" }}>
          <h2>课程加载失败</h2>
          <p className="sub">{error}</p>
          <div className="form-grid mt-12">
            <button type="button" onClick={() => window.location.reload()}>
              刷新重试
            </button>
          </div>
        </div>
      ) : null}
      {loading || authLoading ? <p className="empty-state">课程加载中…</p> : null}
      {!loading && !authLoading && content ? (
        <>
          <header className="wb-page-head">
            <p className="wb-desk-kicker">COURSE BAY</p>
            <h1>课程舱</h1>
            <p>搜索、筛选后打开课程。会员舱位需登录并开通席位。</p>
          </header>
          <ContentListView
            pageId="pageLearning"
            content={content}
            variant="course"
            filterLabel="筛选课程"
          />
        </>
      ) : null}
    </PlatformShell>
  );
}
