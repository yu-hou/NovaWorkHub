"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AdminShell, friendlyError } from "@/components/admin/AdminShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { apiFetch } from "@/lib/api";

type AdminUser = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  is_member: boolean;
  is_active: boolean;
};

type AdminCourse = {
  id: number;
};

export function AdminHome() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setError("");
    try {
      const [users, courses] = await Promise.all([
        apiFetch<AdminUser[]>("/api/admin/users"),
        apiFetch<AdminCourse[]>("/api/admin/courses"),
      ]);
      setUserCount(users.length);
      setCourseCount(courses.length);
      setMemberCount(users.filter((u) => u.is_member).length);
    } catch (err) {
      setError(friendlyError(err, "概览加载失败"));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (authLoading) return;
    // Load is the external database synchronization for this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [authLoading, load]);

  return (
    <AdminShell>
      <section className="view admin-page">
        <header className="admin-page-header">
          <div>
            <h1>管理概览</h1>
            <p className="sub">查看平台概况，进入用户、分类与课程管理。</p>
          </div>
          <button type="button" className="admin-ghost-btn" onClick={() => void load()}>
            刷新
          </button>
        </header>

        {error ? (
          <div className="admin-flash is-err" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => void load()}>
              重试
            </button>
          </div>
        ) : null}

        <div className="admin-stat-grid">
          <div className="admin-stat-card is-static">
            <span>用户总数</span>
            <strong>{userCount ?? "—"}</strong>
          </div>
          <div className="admin-stat-card is-static">
            <span>会员数</span>
            <strong>{memberCount ?? "—"}</strong>
          </div>
          <div className="admin-stat-card is-static">
            <span>课程数</span>
            <strong>{courseCount ?? "—"}</strong>
          </div>
        </div>

        <div className="admin-stat-grid">
          <Link className="admin-stat-card" href="/admin/users">
            <strong>用户管理</strong>
            <span>添加用户、开通会员、调整角色</span>
          </Link>
          <Link className="admin-stat-card" href="/admin/categories">
            <strong>分类管理</strong>
            <span>维护课程分类与展示颜色</span>
          </Link>
          <Link className="admin-stat-card" href="/admin/courses">
            <strong>课程管理</strong>
            <span>上传封面、绑定飞书文档、设置会员专享</span>
          </Link>
        </div>
      </section>
    </AdminShell>
  );
}
