# AgentWork Website

AgentWork 官网与学习平台前端，基于 Next.js App Router。

## 技术栈

- Next.js 16（App Router）+ React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Lucide React

## 本地运行

```bash
npm install
npm run dev
```

默认访问 [http://localhost:3000](http://localhost:3000)。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 检查 |
| `npm run check` | lint + typecheck + build |

## 主要路由

| 路径 | 说明 |
| --- | --- |
| `/` | 官网落地页 |
| `/home` | 学习平台首页 |
| `/learning-paths` | 学习路径 |
| `/learning` | 课程列表 |
| `/events` | 活动 |
| `/cases` | 案例 |
| `/replays` | 直播回放 |
| `/benefits` | 会员福利 |
| `/token-rank` | Token 排行榜 |
| `/about` | 关于 |

## 目录结构

```
src/
  app/           # 路由与全局样式
  components/    # 页面组件
  lib/           # 内容数据与工具
public/
  images/        # 静态图片
  seo/           # Favicon 等
```
