# Nova Website

Nova 官网与学习平台前端：Next.js 16 / React 19 / TypeScript / Supabase。

## 本地配置

复制 `.env.example` 为 `.env.local`：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

```bash
npm install
npm run dev
```

## 检查与构建

```bash
npm run check
```

静态产物输出到 `out/`。动态课程使用 `/learning/course?id=<id>`，因此后台新增课程不需要重新生成动态路径。

## Cloudflare Pages

```bash
npm run pages:deploy
```

Pages 项目名：`nova-academy`。生产构建变量必须配置：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 已实现

- Supabase 邮箱 OTP / 密码登录
- 公开与会员课程权限
- 用户、分类、课程管理
- 课程封面压缩与 Supabase Storage 上传
- Cloudflare Pages 静态部署
