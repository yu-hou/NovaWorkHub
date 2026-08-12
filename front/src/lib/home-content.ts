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

export type DeskModule = {
  code: string;
  title: string;
  subtitle: string;
  href: string;
};

export const HOME_BANNERS: BannerSlide[] = [
  {
    title: "今天从工作台开始",
    description: "把课程、路径与案例收进同一桌面，按任务打开，而不是按目录迷路。",
    cta: "打开课程舱",
    href: "/learning",
    image: "/images/nova/home/banner-ai-learn.png",
  },
  {
    title: "用 Agent 把任务做完",
    description: "从公开课到会员舱，权限清晰；学完一课就能改自己的流程。",
    cta: "进入学习",
    href: "/learning",
    image: "/images/nova/home/banner-ai-code.png",
  },
  {
    title: "进度留在桌面",
    description: "推荐课与权益入口常驻工作台，回来就能接着推进。",
    cta: "回到首页",
    href: "/home",
    image: "/images/nova/home/banner-community.png",
  },
];

export const HOME_SIDE_CARDS: SideCard[] = [
  {
    title: "课程舱",
    subtitle: "公开课与系统课",
    href: "/learning",
    image: "/images/nova/home/side-courses.jpg",
  },
  {
    title: "路径轨",
    subtitle: "按阶段推进",
    href: "/learning-paths",
    image: "/images/nova/home/side-paths.jpg",
  },
  {
    title: "会员席位",
    subtitle: "解锁专享舱位",
    href: "/home",
    image: "/images/nova/home/side-member.jpg",
  },
];

export const DESK_MODULES: DeskModule[] = [
  {
    code: "01",
    title: "课程舱",
    subtitle: "打开可学内容",
    href: "/learning",
  },
  {
    code: "02",
    title: "学习路径",
    subtitle: "按路线逐步推进",
    href: "/learning-paths",
  },
  {
    code: "03",
    title: "案例库",
    subtitle: "查看成员实战",
    href: "/cases",
  },
];

export const SIDE_NAV = [
  { label: "首页", href: "/home", icon: "home", match: "/home", group: "quick" },
  { label: "学习路径", href: "/learning-paths", icon: "path", match: "/learning-paths", group: "主要" },
  { label: "课程", href: "/learning", icon: "course", match: "/learning", group: "主要" },
  { label: "案例", href: "/cases", icon: "case", match: "/cases", group: "主要" },
  { label: "活动", href: "/events", icon: "event", match: "/events", group: "主要" },
  { label: "直播", href: "/replays", icon: "live", match: "/replays", group: "主要" },
  { label: "福利", href: "/benefits", icon: "gift", match: "/benefits", group: "社群" },
  { label: "关于", href: "/about", icon: "about", match: "/about", group: "其他" },
] as const;

export const BANNER_DURATION_MS = 5200;
