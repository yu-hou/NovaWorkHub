"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { FeishuDocsViewer } from "@/components/home/FeishuDocsViewer";
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

type ErrorKind = "auth" | "member" | "other" | "";

function CourseReaderStatus({ children }: { children: React.ReactNode }) {
  return (
    <main className="course-reader-shell">
      <section className="course-reader-status">{children}</section>
    </main>
  );
}

function CourseDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, isMember, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState("");
  const [errorKind, setErrorKind] = useState<ErrorKind>("");
  const [loading, setLoading] = useState(true);
  const courseId = searchParams.get("id");
  const validCourseId = courseId && /^\d+$/.test(courseId) ? courseId : null;

  useEffect(() => {
    document.body.classList.add("course-reader-app");
    return () => document.body.classList.remove("course-reader-app");
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = course?.title ? `${course.title}｜Nova` : "课程阅读｜Nova";
    return () => {
      document.title = previousTitle;
    };
  }, [course?.title]);

  useEffect(() => {
    if (authLoading) return;
    if (!validCourseId) return;

    let cancelled = false;
    // Loading state intentionally resets when the requested course or entitlement changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    setErrorKind("");
    setCourse(null);

    void apiFetch<CourseDetail>(`/api/courses/${validCourseId}`)
      .then((data) => {
        if (!cancelled) setCourse(data);
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
  }, [validCourseId, authLoading, isLoggedIn, isMember]);

  if (!validCourseId && !authLoading) {
    return (
      <CourseReaderStatus>
        <p className="course-reader-eyebrow">NOVA 课程舱</p>
        <h1>课程地址无效</h1>
        <p>请返回课程舱重新选择课程。</p>
        <div className="course-reader-actions">
          <Link href="/learning/">返回课程舱</Link>
        </div>
      </CourseReaderStatus>
    );
  }

  if (loading || authLoading) {
    return (
      <CourseReaderStatus>
        <span className="course-reader-spinner" aria-hidden="true" />
        <p>正在打开课程文档…</p>
      </CourseReaderStatus>
    );
  }

  if (error || !course) {
    const nextUrl = validCourseId
      ? `/learning/course/?id=${encodeURIComponent(validCourseId)}`
      : "/learning/";
    return (
      <CourseReaderStatus>
        <p className="course-reader-eyebrow">NOVA 课程舱</p>
        <h1>无法打开课程</h1>
        <p>{error || "课程不存在或暂不可用。"}</p>
        <div className="course-reader-actions">
          {errorKind === "auth" ? (
            <button
              type="button"
              onClick={() =>
                router.push(`/login?next=${encodeURIComponent(nextUrl)}`)
              }
            >
              登录本站账号
            </button>
          ) : null}
          {errorKind === "member" ? <Link href="/home/">了解会员权益</Link> : null}
          <Link href="/learning/">返回课程舱</Link>
        </div>
      </CourseReaderStatus>
    );
  }

  return (
    <main className="course-reader-shell" aria-label={course.title}>
      <FeishuDocsViewer
        courseId={course.id}
        src={course.feishu_doc_url}
        title={course.title}
        fullScreen
      />
    </main>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense
      fallback={
        <CourseReaderStatus>
          <span className="course-reader-spinner" aria-hidden="true" />
          <p>正在打开课程文档…</p>
        </CourseReaderStatus>
      }
    >
      <CourseDetailInner />
    </Suspense>
  );
}
