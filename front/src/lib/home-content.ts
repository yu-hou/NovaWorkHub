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

export const HOME_BANNERS: BannerSlide[] = [
  {
    title: "用 Agent 真正做出结果",
    description: "系统课程 + 飞书文档实战，带你从 0 到 1 跑通 AI 工作流。",
    cta: "浏览课程",
    href: "/learning",
    image: "/images/nova/home/banner-ai-learn.png",
  },
  {
    title: "Codex 从小白到专家",
    description: "基础操作到进阶案例，一步步掌握 AI 编程协作。",
    cta: "去学习",
    href: "/learning",
    image: "/images/nova/home/banner-ai-code.png",
  },
  {
    title: "社群共学，持续进步",
    description: "推荐课程持续更新，跟着节奏学完一课就多一项可落地能力。",
    cta: "进入平台",
    href: "/home",
    image: "/images/nova/home/banner-community.png",
  },
];

export const HOME_SIDE_CARDS: SideCard[] = [
  {
    title: "推荐课程",
    subtitle: "精选入门与系统课",
    href: "/learning",
    image: "/images/nova/home/side-courses.jpg",
  },
  {
    title: "学习路径",
    subtitle: "按阶段规划进度",
    href: "/learning-paths",
    image: "/images/nova/home/side-paths.jpg",
  },
  {
    title: "会员权益",
    subtitle: "解锁会员专享内容",
    href: "/#membership-benefits",
    image: "/images/nova/home/side-member.jpg",
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
  { label: "我要投稿", href: "#contribution", icon: "submit", action: true },
  { label: "关于", href: "/about", icon: "about", match: "/about" },
] as const;

export const BANNER_DURATION_MS = 5200;
