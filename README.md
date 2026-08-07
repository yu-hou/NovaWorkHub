# Nova Academy

Nova AI 学习平台，使用 Cloudflare Pages + Supabase 部署。

## 目录

- `front/` — Next.js 静态前端
- `supabase/` — Postgres migrations、RLS、Storage 与 Edge Functions

FastAPI/MySQL/Redis 后端已移除，Supabase 是唯一的数据与认证来源。

## 部署

1. 将 `supabase/migrations` 推送到 Supabase 项目。
2. 部署 Edge Functions：`admin-users`、`course-access`、`feishu-doc-signature`。
3. 在 Supabase secrets 配置飞书开放平台凭证：
   - `FEISHU_APP_ID`
   - `FEISHU_APP_SECRET`
4. 在 `front/.env.local` 配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`。
5. 在 `front/` 运行 `npm run build`，将 `out/` 部署到 Cloudflare Pages。

### 飞书云文档站内阅读

课程详情默认用飞书「云文档组件」站内嵌入；失败时回退为打开外链。

需要：

1. 创建飞书企业自建应用，申请云文档相关权限（应用身份）。
2. 把应用加为每门课程飞书文档的协作者（只读即可）。
3. 文档分享设为「获得链接的人可阅读」。
4. 部署 `feishu-doc-signature` 并配置 `FEISHU_APP_ID` / `FEISHU_APP_SECRET`。
