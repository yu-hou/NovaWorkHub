export const EXT = "https://www.zhenganhuo.com";

export type BannerSlide = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
};

export type SideCard = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export type LearningCard = {
  title: string;
  category: string;
  summary: string;
  cover: string;
  learners: number;
  views: number;
};

export type BenefitCard = {
  title: string;
  category?: string;
  categoryTone?: "rose" | "gold";
  summary: string;
  priceLabel: string;
  priceUnit?: string;
  free?: boolean;
  stock: string;
  instructionsHref: string;
};

export const HOME_BANNERS: BannerSlide[] = [
  {
    title: "决战算力之巅！",
    description: "Token Rank 自动上报 Agent 实时消耗，比学赶帮超。",
    cta: "查看排名",
    href: "/token-rank",
    image: "/images/zhenganhuo/home/banner-1.jpg",
  },
  {
    title: "Codex 从小白到专家",
    description: "系统学习 Codex 使用基础与进阶案例演练",
    cta: "前往上课",
    href: `${EXT}/learning/course/6`,
    image: "/images/zhenganhuo/home/banner-2.png",
  },
  {
    title: "SKILLS 黑客松",
    description: "第一届社群竞赛精彩回看",
    cta: "点击前往",
    href: `${EXT}/reader/event/r39b97f11f91d`,
    image: "/images/zhenganhuo/home/banner-3.jpg",
  },
  {
    title: "小白 AI 入门",
    description: "零基础小白易懂的AI入门课，老奶奶也能听得懂",
    cta: "前往上课",
    href: `${EXT}/learning/course/1`,
    image: "/images/zhenganhuo/home/banner-4.jpg",
  },
];

export const HOME_SIDE_CARDS: SideCard[] = [
  {
    title: "系统课程",
    subtitle: "从 0 到 1 学习 Agent",
    href: "/learning",
    image: "/images/zhenganhuo/home/side-1.png",
  },
  {
    title: "Token Rank",
    subtitle: "Token 排行榜",
    href: "/token-rank",
    image: "/images/zhenganhuo/home/side-2.png",
  },
  {
    title: "会员权益",
    subtitle: "查看会员权益",
    href: "/#membership-benefits",
    image: "/images/zhenganhuo/home/side-3.png",
  },
];

export const HOME_LEARNING: LearningCard[] = [
  {
    title: "第 10 课 ｜我让 Codex 翻了 566 封 QQ 邮件，顺手把报销单也填了（08/05）",
    category: "codex系统课",
    summary:
      "以 566 封 QQ 邮件中的报销发票为实战，使用 email-triage Skill 通过 IMAP 只读检索邮件，解析并去重票据、填写现有 Excel 报销单，处理合计公式、长票号与版式验收，最后将报销单和附件统一归档交付。",
    cover: "/images/zhenganhuo/home/course-cover.png",
    learners: 11,
    views: 15,
  },
  {
    title: "第 9 课 ｜Codex数据分析实战",
    category: "codex系统课",
    summary:
      "以租车业务订单与用户画像数据为案例，从 Plan 明确分析目标、数据整理清洗、聚类建模与用户分群，到使用 ECharts 生成交互式 Dashboard、输出麦肯锡风格报告，完整掌握 Codex 数据分析工作流。",
    cover: "/images/zhenganhuo/home/course-cover.png",
    learners: 9,
    views: 11,
  },
  {
    title: "第 8 课 ｜ BOSS直聘解析简历 并 找到合适岗位自动打招呼",
    category: "codex系统课",
    summary:
      "以 BOSS 直聘求职为实战，安装并启动 boss-zhipin-scraper Skill，基于个人简历生成求职搜索确认卡，创建隔离浏览器 Profile 并登录，让 Codex 校准岗位匹配逻辑、自动向合适岗位打招呼，并配置每天定时执行。",
    cover: "/images/zhenganhuo/home/course-cover.png",
    learners: 16,
    views: 28,
  },
];

export const HOME_BENEFITS: BenefitCard[] = [
  {
    title: "全网最低的Codex购买渠道",
    summary:
      "官方正规GPT/Claude等代充稳定渠道，黄叔社群学员下单均可返利，联系微信tianyinhou加福利购买群。\n\n产品介绍链接到我店铺页面：https://pay.ldxp.cn/shop/FTIWLFHQ",
    priceLabel: "免费",
    free: true,
    stock: "库存不限",
    instructionsHref: "https://pay.ldxp.cn/shop/FTIWLFHQ",
  },
  {
    title: "Mole 75折优惠码",
    category: "实用工具",
    categoryTone: "rose",
    summary:
      "Mole是一款原生macOS系统工具，把缓存清理、App更新与卸载、系统维护、磁盘空间分析，以及CPU、内存、网络和风扇等实时状态整合在一个入口;清理前可逐项确认，数据不离开电脑，并提供菜单栏HUD，适合想用一款轻量工具统一维护Mac 的开发者与重度用户。",
    priceLabel: "10",
    priceUnit: "积分",
    stock: "库存 45",
    instructionsHref: `${EXT}/reader/other/rac587001cc78`,
  },
  {
    title: "flomoMax 30天会员激活码",
    category: "AI 产品",
    categoryTone: "gold",
    summary: "抢先体验 flomo AI 功能，支持微信接入flomo agent，通过 MCP 调用卡片笔记",
    priceLabel: "80",
    priceUnit: "积分",
    stock: "库存 28",
    instructionsHref: "https://help.flomoapp.com/membership/redeem.html",
  },
];

export const SIDE_NAV = [
  { label: "首页", href: "/home", icon: "home", match: "/home" },
  { label: "学习路径", href: "/learning-paths", icon: "path", match: "/learning-paths" },
  { label: "课程", href: "/learning", icon: "course", match: "/learning" },
  { label: "案例", href: "/cases", icon: "case", match: "/cases" },
  { label: "活动", href: "/events", icon: "event", match: "/events" },
  { label: "直播", href: "/replays", icon: "live", match: "/replays" },
  { label: "福利", href: "/benefits", icon: "gift", match: "/benefits" },
  { label: "Token Rank", href: "/token-rank", icon: "rank", match: "/token-rank" },
  { label: "我要投稿", href: "#contribution", icon: "submit", action: true },
  { label: "关于", href: "/about", icon: "about", match: "/about" },
] as const;

export const BANNER_DURATION_MS = 5200;
