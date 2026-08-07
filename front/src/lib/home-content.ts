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
];

export const SIDE_NAV = [
  { label: "工作台", href: "/home", icon: "home", match: "/home" },
  { label: "课程舱", href: "/learning", icon: "course", match: "/learning" },
] as const;

export const BANNER_DURATION_MS = 5200;
