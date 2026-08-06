import type {
  BenefitRow,
  FeedbackItem,
  Founder,
  LoopStep,
  Partner,
  SupportItem,
} from "@/types/landing";

export const LOOP_STEPS: LoopStep[] = [
  {
    index: "01",
    title: "系统课程",
    description:
      "从 AI 工具、提示词、自动化工作流到项目交付，按路径沉淀可复学的课程内容。",
    icon: "course",
  },
  {
    index: "02",
    title: "直播共学",
    description:
      "围绕热点工具、实操案例和成员问题做直播讲解，保留回放方便复盘。",
    icon: "live",
  },
  {
    index: "03",
    title: "实战比赛",
    description:
      "通过挑战赛、作品共创和交付任务，把学习目标变成可展示的成果。",
    icon: "trophy",
  },
];

export const SUPPORT_ITEMS: SupportItem[] = [
  {
    label: "快速反馈",
    title: "交流群",
    description:
      "成员在群内提问、分享工具、同步进展，遇到具体问题时能快速获得反馈。",
    icon: "chat",
  },
  {
    label: "积分兑换",
    title: "资源权益",
    description:
      "AI 产品优惠、内测资格、激活码和周边礼品等成员专属福利，可通过社群贡献积分免费兑换。",
    icon: "folder",
    featured: true,
  },
  {
    label: "不定期组局",
    title: "线下活动",
    description:
      "不定期举办 Coffee Chat、线下组局、主题分享和成员交流，让成员在真实场景里建立连接。",
    icon: "pin",
  },
];

export const FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    quote:
      "以前只是收藏工具和看演示，现在会先拆场景、搭流程，再用 AI 做交付。最明显的是方案写得更快，也更像能落地的东西。",
    author: "运营负责人 · 工作流搭建",
  },
  {
    quote:
      "课程案例不是只讲概念，能直接拿来改成自己的选题和生产 SOP。内容从偶尔爆发，变成每周都有稳定产出。",
    author: "内容创作者 · 选题与生产",
  },
  {
    quote:
      "以前判断 AI 项目主要看演示效果，现在会看数据来源、流程边界和交付成本。对客户提案时心里更有底。",
    author: "企业服务顾问 · 项目提案",
  },
];

export const BENEFIT_ROWS: BenefitRow[] = [
  { kind: "group", label: "内容与学习" },
  { kind: "row", feature: "公开课", free: "全部开放", annual: "全部开放" },
  {
    kind: "row",
    feature: "系统课程学习",
    free: "不可观看",
    annual: "会员期内内容，长期可回看",
  },
  {
    kind: "row",
    feature: "直播与回放",
    free: "部分公益回放",
    annual: "直播回看长期有效",
  },
  {
    kind: "row",
    feature: "专题进阶课程",
    free: "全额报名",
    annual: "优惠报名",
  },
  { kind: "group", label: "社群与活动" },
  {
    kind: "row",
    feature: "交流群",
    free: "不可参加",
    annual: "长期有效，群内交流",
  },
  {
    kind: "row",
    feature: "资源与福利",
    free: "不享有",
    annual: "社群贡献积分免费兑换",
  },
  {
    kind: "row",
    feature: "线下活动",
    free: "公开报名",
    annual: "优先报名",
  },
  {
    kind: "row",
    feature: "实战比赛",
    free: "不可参加",
    annual: "社群内部报名参加",
  },
  {
    kind: "row",
    feature: "Token-Rank",
    free: "可使用",
    annual: "可使用",
  },
];

export const FOUNDERS: Founder[] = [
  {
    name: "Nova Lin",
    photo: "/images/nova/placeholder.svg",
    photoAlt: "Nova Lin 头像",
    tone: "blue",
    roles: ["Nova 产品主理人", "AI Agent 实战教练", "自动化工作流顾问"],
  },
  {
    name: "Nova Chen",
    photo: "/images/nova/placeholder.svg",
    photoAlt: "Nova Chen 头像",
    tone: "orange",
    roles: [
      "Nova 技术主理人",
      "智能体落地顾问",
      "AI 编程与交付培训讲师",
    ],
  },
];

export const PARTNERS: Partner[] = [
  { name: "MiniMax", logo: "/images/nova/placeholder.svg" },
  { name: "Flomo", logo: "/images/nova/placeholder.svg" },
];

export const TICKER_TEXT =
  "课程体系 ✦ 交流群 ✦ 线下活动 ✦ 资源福利 ✦ 直播共学 ✦ 实战比赛 ✦ ";

export const LEARNING_PLATFORM_HREF = "/home";
