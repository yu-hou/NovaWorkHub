"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useContentGate } from "@/components/auth/ContentGate";
import { FeishuDocsViewer } from "@/components/home/FeishuDocsViewer";
import { PlatformShell } from "@/components/home/PlatformShell";
import { ApiError, apiFetch } from "@/lib/api";

type CourseDetail = {
  id: number;
  title: string;
  category: string;
  category_class: string;
  summary: string;
  cover: string;
  learners: number;
  views: number;
  is_member_only: boolean;
  feishu_doc_url: string;
  can_access: boolean;
};

function CourseDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, isMember, loading: authLoading } = useAuth();
  const { openLogin, openMemberGate } = useContentGate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState("");
  const [errorKind, setErrorKind] = useState<"auth" | "member" | "other" | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const id = searchParams.get("id");
    if (!id) return;

    let cancelled = false;
    // Loading state intentionally resets when the requested course or entitlement changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    setErrorKind("");
    setCourse(null);

    void apiFetch<CourseDetail>(`/api/courses/${id}`)
      .then((data) => {
        if (cancelled) return;
        setCourse(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setErrorKind("auth");
            setError(err.detail || "登录状态已失效，请重新登录后查看课程");
            return;
          }
          if (err.status === 403) {
            setErrorKind("member");
            setError("该内容为会员专享，请开通会员后查看");
            return;
          }
          setErrorKind("other");
          setError(err.detail);
          return;
        }
        setErrorKind("other");
        setError(
          err instanceof TypeError
            ? "无法连接服务器，请确认后端已启动"
            : err instanceof Error
              ? err.message
              : "加载失败",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, authLoading, isLoggedIn, isMember]);

  return (
    <section className="view course-detail-view">
      <div className="section-title">
        <div>
          <button
            type="button"
            className="text-button"
            onClick={() => router.push("/learning")}
          >
            ← 返回课程列表
          </button>
          <h2 style={{ marginTop: 12 }}>{course?.title || "课程详情"}</h2>
          {course ? (
            <p className="sub">
              <span className={`category-badge ${course.category_class}`}>
                {course.category}
              </span>
              {course.is_member_only ? " · 会员专享" : " · 公开课程"}
              {" · 飞书文档"}
            </p>
          ) : null}
        </div>
      </div>

      {loading ? <p className="empty-state">加载中…</p> : null}

      {error ? (
        <div className="login-card" style={{ maxWidth: 560 }}>
          <h2>无法打开课程</h2>
          <p className="sub">{error}</p>
          <div className="form-grid mt-12">
            {errorKind === "auth" ? (
              <button
                type="button"
                onClick={() => openLogin("登录后查看课程详情")}
              >
                登录本站账号
              </button>
            ) : null}
            {errorKind === "member" ? (
              <>
                <button type="button" onClick={() => openMemberGate()}>
                  了解会员权益
                </button>
                <Link href="/home">返回工作台</Link>
              </>
            ) : null}
            <Link href="/learning">返回课程</Link>
          </div>
        </div>
      ) : null}

      {course && !error ? (
        <div className="course-detail-body">
          {course.summary ? <p className="summary">{course.summary}</p> : null}
          <FeishuDocsViewer
            src={course.feishu_doc_url}
            title={course.title}
          />
        </div>
      ) : null}
    </section>
  );
}

export default function CourseDetailPage() {
  return (
    <PlatformShell>
      <Suspense fallback={<p className="empty-state">课程加载中…</p>}>
        <CourseDetailInner />
      </Suspense>
    </PlatformShell>
  );
}
