"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { ContentListView } from "@/components/home/ContentListView";
import { PlatformShell } from "@/components/home/PlatformShell";
import { ApiError, apiFetch } from "@/lib/api";
import type { ListPageContent } from "@/lib/platform-content";

export default function LearningPage() {
  const { isLoggedIn, isMember, isAdmin, loading: authLoading } = useAuth();
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
          <header className="nova-page-head">
            <div>
              <p className="nova-page-eyebrow">COURSE LIBRARY</p>
              <h1>课程</h1>
              <p>AI 课程与学习资料，覆盖工具、提示词、自动化工作流和项目交付。</p>
            </div>
            {isAdmin ? (
              <Link className="nova-course-upload" href="/admin/courses#course-editor">
                <span className="nova-course-upload-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></svg>
                </span>
                <span className="nova-course-upload-copy">
                  <strong>上传课程</strong>
                  <small>课程、封面与文档</small>
                </span>
                <span className="nova-course-upload-arrow" aria-hidden="true">↗</span>
              </Link>
            ) : null}
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
