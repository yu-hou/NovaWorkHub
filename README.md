# Nova Academy

Nova AI 学习平台，使用 Cloudflare Pages + Supabase 部署。

## 目录

- `front/` — Next.js 静态前端
- `supabase/` — Postgres migrations、RLS、Storage 与 Edge Functions

FastAPI/MySQL/Redis 后端已移除，Supabase 是唯一的数据与认证来源。

## 部署

1. 将 `supabase/migrations` 推送到 Supabase 项目。
2. 部署 `admin-users` 与 `course-access` Edge Functions。
3. 在 `front/.env.local` 配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。
4. 在 `front/` 运行 `npm run build`，将 `out/` 部署到 Cloudflare Pages。
