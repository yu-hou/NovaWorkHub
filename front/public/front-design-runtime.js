/* ---------------------------------------------------------------------
   模拟数据层：以下所有内容（导航之外）均为虚构样例，不代表真实课程/案例/福利
   --------------------------------------------------------------------- */
const ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
  paths: '<circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle>',
  learning: '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  cases: '<path d="M12 17V7"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect>',
  events: '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>',
  replays: '<rect x="4" y="5" width="16" height="11" rx="2"></rect><path d="m10.2 8.6 4.6 2.4-4.6 2.4V8.6ZM9 20h6M12 16v4"></path>',
  benefits: '<path d="M12 7v14"></path><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"></path><rect x="3" y="7" width="18" height="4" rx="1"></rect>',
  token: '<path d="M12 17V7"></path><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"></path><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"></path>',
  submit: '<path d="m4 12 16-8-5 16-3-7z"></path><path d="m12 13 8-9"></path>',
  about: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>',
  more: '<circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle>',
  chevron: '<path d="m9 6 6 6-6 6"></path>',
  receipt: '<path d="M12 17V7"></path><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"></path><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"></path>',
  pathBeginner: '<circle cx="12" cy="12" r="8.5"></circle><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z"></path>',
  pathBolt: '<path d="M13.2 2.8 5.8 13h5.4l-.4 8.2L18.2 11h-5.4z"></path>',
  pathPen: '<path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8z"></path><path d="m13.8 7 3.2 3.2"></path><path d="M14.8 4.2 16.5 2.5 21.5 7.5 19.8 9.2"></path>',
  pathFlow: '<path d="m17 2 3 3-3 3"></path><path d="M4 11V9a4 4 0 0 1 4-4h12"></path><path d="m7 22-3-3 3-3"></path><path d="M20 13v2a4 4 0 0 1-4 4H4"></path>',
  pathCode: '<path d="m8 7-5 5 5 5"></path><path d="m16 7 5 5-5 5"></path><path d="m14 4-4 16"></path>',
  pathLink: '<rect x="3" y="3" width="6" height="6" rx="1.5"></rect><rect x="15" y="15" width="6" height="6" rx="1.5"></rect><path d="M9 6h3a3 3 0 0 1 3 3v6"></path><path d="m12.5 12.5 2.5 2.5 2.5-2.5"></path>',
  statUsers: '<circle cx="12" cy="8" r="4"></circle><path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6"></path>',
  statViews: '<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"></path><circle cx="12" cy="12" r="3"></circle>',
  courseBook: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H21v16H6.5A2.5 2.5 0 0 0 4 21.5z"></path><path d="M4 5.5v16"></path><path d="M8 7h9"></path><path d="M8 11h7"></path>',
  courseSpark: '<path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9z"></path><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"></path>',
  moreDots: '<circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle>',
};

/* 学习路径真实课程数据（同步自 learning-paths.html，6 条路线 / 38 节课，标题与课程链接均为真实内容） */
const LEARNING_PATHS = [
  {
    key: 'ai-beginner', label: 'AI 小白入门', icon: 'pathBeginner',
    desc: '从认识社群与 AI 开始，逐步理解提示词、大模型和常见智能体。',
    lessons: [
      { cat: '社群使用说明书', title: '登录、激活与接入社群 Token Rank', href: 'https://zhenganhuo.com/reader/course/rbb7d06273d34' },
      { cat: '社群使用说明书', title: '认识 AgentWork', href: 'https://zhenganhuo.com/reader/course/r406184de9dc0' },
      { cat: '小白 AI 通识', title: '小白如何开始使用 AI', href: 'https://zhenganhuo.com/reader/course/r500bc716f9ec' },
      { cat: '小白 AI 通识', title: '提示词的本质', href: 'https://zhenganhuo.com/reader/course/r68e57883a829' },
      { cat: '小白 AI 通识', title: '大模型的优势与缺陷', href: 'https://zhenganhuo.com/reader/course/r8afa431b2ee6' },
      { cat: '小白 AI 通识', title: 'AI 产品的本质', href: 'https://zhenganhuo.com/reader/course/ra46aacf320ab' },
      { cat: '小白 AI 通识', title: '什么是 AI 智能体', href: 'https://zhenganhuo.com/reader/course/r50a088e8084f' },
      { cat: '小白 AI 通识', title: '最常见的 AI 智能体：联网搜索', href: 'https://zhenganhuo.com/reader/course/ra98db9dfcd36' },
    ],
  },
  {
    key: 'agent-productivity', label: 'Agent 办公提效', icon: 'pathBolt',
    desc: '适合希望马上用 Agent 提高日常工作效率的人。',
    lessons: [
      { cat: 'Codex 从小白到专家', title: '你已经在用 Agent 了', href: 'https://zhenganhuo.com/reader/course/redc4d09930fe' },
      { cat: 'Codex 从小白到专家', title: '桌面端 App 入门教程', href: 'https://zhenganhuo.com/reader/course/rf33dc018da53' },
      { cat: 'Codex 从小白到专家', title: 'Codex 入门：整理电脑', href: 'https://zhenganhuo.com/reader/course/rb7a642518b41' },
      { cat: 'Codex 从小白到专家', title: 'Agent First：重新设计工作流', href: 'https://zhenganhuo.com/reader/course/r433c7de70c63' },
    ],
  },
  {
    key: 'content-creation', label: '内容创作快线', icon: 'pathPen',
    desc: '适合希望快速做出文章、图文或视频内容的人。',
    lessons: [
      { cat: 'AI Skills', title: 'YouMind 入门教程', href: 'https://zhenganhuo.com/reader/course/ree1985e82381' },
      { cat: 'AI Skills', title: '使用 YouMind + Skill 高效创造内容', href: 'https://zhenganhuo.com/reader/course/rb939728739aa' },
      { cat: 'AI Skills', title: 'Claude Code 极简入门三部曲', href: 'https://zhenganhuo.com/reader/course/ra0b7ef169ddf' },
      { cat: 'AI Skills', title: 'Claude Agent Skills 原理入门', href: 'https://zhenganhuo.com/reader/course/r16ed3daad111' },
      { cat: 'AI Skills', title: '一个提示词，生成你的专属 Skill', href: 'https://zhenganhuo.com/reader/course/r0bd808753fc5' },
      { cat: 'AI Skills', title: '生成匹配你文风的三篇短文', href: 'https://zhenganhuo.com/reader/course/rf5b42244459f' },
      { cat: 'AI Skills', title: '基于内容选题产出口播稿', href: 'https://zhenganhuo.com/reader/course/rc01909bdbb4e' },
      { cat: 'AI Skills', title: '基于口播稿完成视频创作', href: 'https://zhenganhuo.com/reader/course/r67ca0ee73749' },
    ],
  },
  {
    key: 'content-automation', label: '内容自动化', icon: 'pathFlow',
    desc: '适合希望把选题、抓取、改写和发布串成固定流程的人。',
    lessons: [
      { cat: 'AI 编程', title: '结构化提示词 1：生成社群周报', href: 'https://zhenganhuo.com/reader/course/r46d27d2abc83' },
      { cat: 'AI 编程', title: '结构化提示词 2：提取并改写文案', href: 'https://zhenganhuo.com/reader/course/re80ee7cae68b' },
      { cat: 'AI 编程', title: 'n8n 自动抓取指定公众号内容（上）', href: 'https://zhenganhuo.com/reader/course/rc9fe6e25a96a' },
      { cat: 'AI 编程', title: 'n8n 自动改写并发布（下）', href: 'https://zhenganhuo.com/reader/course/rb3895d6208fd' },
      { cat: 'AI Skills', title: '内容选题：抓取微信公众号文章', href: 'https://zhenganhuo.com/reader/course/r9117e3bd0767' },
      { cat: 'AI Skills', title: '基于内容选题产出口播稿', href: 'https://zhenganhuo.com/reader/course/rc01909bdbb4e' },
      { cat: 'AI Skills', title: 'OpenClaw + Skill 直出公众号文章', href: 'https://zhenganhuo.com/reader/course/rd333b63fcfb7' },
    ],
  },
  {
    key: 'ai-product-building', label: 'AI 编程做产品', icon: 'pathCode',
    desc: '适合希望做出网站或可上线产品的人。',
    lessons: [
      { cat: 'AI 编程', title: '四件套入门 + 上线第一个网站', href: 'https://zhenganhuo.com/reader/course/r7dd1f9b096a9' },
      { cat: 'AI 编程', title: '一套提示词覆盖大部分 Vibe Coding 场景', href: 'https://zhenganhuo.com/reader/course/rc343606f9953' },
      { cat: 'AI 编程', title: '用 SeeDream 4.0 做小红书图片生成网站', href: 'https://zhenganhuo.com/reader/course/r94f74e8bb37f' },
      { cat: 'AI 编程', title: '接入 Supabase，完成登录注册 + 积分', href: 'https://zhenganhuo.com/reader/course/racd5fb720051' },
    ],
  },
  {
    key: 'sop-to-agent', label: '业务 SOP 变 Agent / Skill', icon: 'pathLink',
    desc: '适合已经有固定工作流程，希望把它封装成 Agent 或 Skill 的人。',
    lessons: [
      { cat: 'Codex 从小白到专家', title: '你已经在用 Agent 了', href: 'https://zhenganhuo.com/reader/course/redc4d09930fe' },
      { cat: 'AI 智能体串讲', title: 'Agent 智能体简要介绍', href: 'https://zhenganhuo.com/reader/course/r500f5ae7fbc6' },
      { cat: 'AI 智能体串讲', title: 'Agent Skills 介绍', href: 'https://zhenganhuo.com/reader/course/r29529dde6cbf' },
      { cat: 'AI Skills', title: '一个提示词，生成你的专属 Skill', href: 'https://zhenganhuo.com/reader/course/r0bd808753fc5' },
      { cat: 'AI Skills', title: '使用 Claude Code 分析微信聊天记录', href: 'https://zhenganhuo.com/reader/course/r97eadc98712c' },
      { cat: 'AI Skills', title: '本地定时运行 Skills', href: 'https://zhenganhuo.com/reader/course/r1abd07f0f86b' },
      { cat: 'AI Skills', title: 'Agent Team 多 Agent 工作 + 自进化', href: 'https://zhenganhuo.com/reader/course/r62aa845a8112' },
    ],
  },
];

/* 课程页真实课程数据（同步自 zhenganhuo.com/learning 的 /api/courses/list.php，6 门课，
   标题、分类、讲数、封面图与学习/浏览人数均为真实内容；summary 为卡片副标题展示文案；
   sortOrder 对应原站默认排序） */
const COURSES = [
  { id: 5, title: '社群使用说明书', summary: '快速了解社群入门、课程学习、福利领取与权益使用。', category: '基础课', lessonCount: 3, viewCount: 623, learnerCount: 180, sortOrder: 1, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260704011901-e1f8c89b3c37a12d.png' },
  { id: 6, title: 'Codex 从小白到专家', summary: '从基础操作到专家工作流，系统掌握 Codex 实战方法。', category: '系统课', lessonCount: 18, viewCount: 1783, learnerCount: 169, sortOrder: 100, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260709182916-9aef42664d538784.png' },
  { id: 1, title: '小白 AI 通识', summary: '面向零基础学习者，建立 AI 概念、工具与应用认知。', category: '基础课', lessonCount: 12, viewCount: 1229, learnerCount: 119, sortOrder: 100, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702021804-23eff75c1282352a.jpg' },
  { id: 4, title: 'AI 智能体串讲', summary: '从 0 到 1 梳理 AI Agent 原理、能力边界与典型场景。', category: '系统课', lessonCount: 11, viewCount: 693, learnerCount: 69, sortOrder: 152, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702024718-0c62fad9ef1e8817.jpg' },
  { id: 2, title: 'AI 编程', summary: '围绕 AI 编程工具、提示词和项目交付拆解完整流程。', category: 'AI Coding', lessonCount: 19, viewCount: 432, learnerCount: 56, sortOrder: 200, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702024125-6afb170b465be54d.jpg' },
  { id: 3, title: 'AI Skills', summary: '系统学习 AI Skills 的创建、运行、编排与实战应用。', category: 'AI Agent', lessonCount: 27, viewCount: 894, learnerCount: 93, sortOrder: 300, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702024259-0507cce3ca683f52.jpg' },
];
let courseFilter = { q: '', category: '' };

/* 左侧导航信息架构：参考「快捷区 + 分组 + 可展开子项 + 底部工具区」的结构
   （Tasks/Activities 快捷行 → 主要 → RECORDS → 底部 Settings/Support），
   按 AgentWork 自身内容映射：首页/Token Rank 为高频快捷入口，
   学习内容归入「主要」，社群互动（福利可展开出领取记录）归入「社群」，
   关于 固定在最底部，与账号入口相邻。 */
const NAV_GROUPS = [
  {
    quick: true,
    items: [
      { key: 'home', label: '首页', icon: 'home', active: true },
      { key: 'token', label: 'Token Rank', icon: 'token' },
    ],
  },
  {
    label: '主要',
    items: [
      { key: 'paths', label: '学习路径', icon: 'paths' },
      { key: 'learning', label: '课程', icon: 'learning' },
      { key: 'cases', label: '案例', icon: 'cases' },
      { key: 'events', label: '活动', icon: 'events' },
      { key: 'replays', label: '直播', icon: 'replays' },
    ],
  },
  {
    label: '社群',
    items: [
      {
        key: 'benefits', label: '福利', icon: 'benefits', expandable: true,
        children: [{ key: 'claims', label: '我的领取记录', icon: 'receipt' }],
      },
      { key: 'submit', label: '我要投稿', icon: 'submit', action: true },
    ],
  },
];
const UTILITY_ITEMS = [
  { key: 'about', label: '关于', icon: 'about' },
];
const TOP_LEVEL_ITEMS = NAV_GROUPS.flatMap(g => g.items).concat(UTILITY_ITEMS);
const BOTTOM_KEYS = ['home', 'paths', 'learning', 'token'];
const PAGE_LINKS = {
  home: '/home',
  paths: '/learning-paths',
  learning: '/learning',
  cases: '/cases',
  events: '/events',
  replays: '/replays',
  benefits: '/benefits',
  claims: '/benefits#claims',
  token: '/token-rank',
  submit: '#',
  about: '/about',
};


/* 三张 banner 只切换品牌辉光位置（zap-glow-a/b/c），不引入新色相；image 为模拟背景图占位 seed */
const BANNERS = [
  { glow: 'zap-glow-a', image: 'agentwork-banner-live', live: true, tag: '直播预告', title: '本周四直播：3 个 Agent 自动化实战翻车复盘', desc: '真实项目里踩过的坑，以及后来怎么补救的完整过程，连麦答疑。', cta: '预约直播' },
  { glow: 'zap-glow-b', image: 'agentwork-banner-paths', live: false, tag: 'NEW · 学习路径', title: '第一次来？6 条路线带你从入门到做出第一个 Agent 产品', desc: '按顺序完成每一课，不用自己摸索方向。', cta: '查看学习路径' },
  { glow: 'zap-glow-c', image: 'agentwork-banner-benefits', live: false, tag: '会员福利', title: 'Claude Code 官方额度券限量放出', desc: '登录后前 50 名可直接领取，先到先得。', cta: '去查看福利' },
];

const STATUS_FEED = [
  {
    kind: 'RANK', title: 'Token Rank 本周登顶', meta: '长程任务占比 62%',
    value: '128.4w', unit: 'tokens', bars: [26, 38, 34, 58, 46, 74, 89], lead: true,
  },
  {
    kind: 'CALL', title: '投稿有奖：分享你的 Agent 实战', meta: '被收录最高送 500 积分',
    value: '500', unit: '积分', bars: [22, 29, 44, 38, 55, 48, 67],
  },
  {
    kind: 'GUIDE', title: '关于 AgentWork', meta: '工具与实战项目学习',
    value: 'NEW', unit: '指南', bars: [18, 27, 25, 41, 39, 53, 49],
  },
];

/* CONTENT[0] 作为首屏精选卡（时效性最强的内容），其余进入紧凑列表 */
const CONTENT = [
  { type: '直播预告', live: true, mark: 'LIVE', title: '本周四直播：3 个 Agent 自动化实战翻车复盘', summary: '真实项目里踩过的坑，以及后来怎么补救的完整过程，连麦答疑。', meta: '8 月 14 日 20:00 · 限额 200 人', dim: '限额 200', cover: 'https://picsum.photos/seed/agentwork-live/860/440' },
  { type: '课程', mark: 'CC', title: 'Claude Code 极简上手：从安装到第一个自动化任务', dim: '12 讲', cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260709182916-9aef42664d538784.png' },
  { type: '案例', mark: 'CASE', title: '用 Agent 把杂乱的产品反馈自动整理成周报', dim: '6 分钟', cover: 'https://picsum.photos/seed/agentwork-feedback-report/300/220' },
  { type: '直播回看', mark: 'REPLAY', title: 'n8n 自动抓取 + 改写公众号内容（完整回放）', dim: '46 分钟', cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702024125-6afb170b465be54d.jpg' },
  { type: '课程', mark: 'AI', title: '一套提示词覆盖 80% 的 Vibe Coding 场景', dim: '8 讲', cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/products/202607/20260702024259-0507cce3ca683f52.jpg' },
  { type: '案例', mark: 'SOP', title: '业务 SOP 变 Skill：把审批流程交给 Agent 跑', dim: '9 分钟', cover: 'https://picsum.photos/seed/agentwork-sop-skill/300/220' },
];

/* 参考图案例页信息：1 个商业化案例，卡片结构沿用活动页。 */
const CASES = [
  {
    title: '电商运营，独立开发商品图生成工具',
    category: '商业化',
    desc: '38岁非技术的前电商运营人，靠vibe coding，从月入3千到变现10W+只用了四个月',
    members: 71,
    views: 154,
    access: '会员专享',
    cover: '/images/front-design/case-commerce-cover.png',
    sortOrder: 1,
  },
];
let caseFilter = { q: '', category: '', sort: 'latest' };

/* 参考图福利数据：同一批数据同时用于首页福利卡和独立福利页。 */
const BENEFITS = [
  {
    id: 'codex-channel', category: '码', tone: 'code', title: '全网最低的Codex购买渠道',
    desc: '官方正规GPT/Claude等代充稳定渠道，黄叔社群学员下单均可返利，联系微信tianyinzhou加福利购...',
    price: '免费', isFree: true, stock: '库存不限', stockValue: 999, points: 0, unit: '', action: '登录后领取', visual: 'gufa', seed: 'agentwork-benefit-codex',
  },
  {
    id: 'mole-discount', category: '实用工具', tone: 'tool', title: 'Mole 75折优惠码',
    desc: 'Mole是一款原生macOS系统工具，把缓存清理、App更新与卸载、系统维护、磁盘空间分析，以及...',
    price: '10', isFree: false, stock: '库存 41', stockValue: 41, points: 10, unit: '积分', action: '登录后领取', visual: 'mole', seed: 'agentwork-benefit-mole',
  },
  {
    id: 'flomo-max', category: 'AI 产品', tone: 'ai', title: 'flomoMax 30天会员激活码',
    desc: '抢先体验 flomo AI 功能，支持微信接入flomo agent，通过 MCP 调用卡片笔记',
    price: '80', isFree: false, stock: '库存 28', stockValue: 28, points: 80, unit: '积分', action: '登录后领取', visual: 'flomo', seed: 'agentwork-benefit-flomo',
  },
];
let benefitFilter = { q: '', category: '', sort: 'latest' };

/* 与原活动页同一批公开展示数据；交互和登录仅为本地前端演示。 */
const EVENTS = [
  { title: '第二届 Skills 黑客松（下）', category: '黑客松', desc: '第二届 · 下半场', focus: '第 2 天 · 作品提交与复盘答疑', members: 21, views: 39, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/content/202607/20260707155545-47f69ac35752c5bc.jpg' },
  { title: '第二届 Skills 黑客松（上）', category: '黑客松', desc: '第二届 · 上半场', focus: '第 1 天 · 赛题发布与 Skill 搭建', members: 8, views: 18, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/content/202607/20260707154304-440b284fd8334354.jpg' },
  { title: '第一届 Skills 黑客松（下）', category: '黑客松', desc: '第一届 · 下半场', focus: '第 2 天 · 成果演示与经验复盘', members: 7, views: 17, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/content/202607/20260704002453-e6fe99f42d9dbcbb.jpg' },
  { title: '第一届Skills 黑客松（上）', category: '黑客松', desc: '第一届 · 上半场', focus: '第 1 天 · 组队开题与实战启动', members: 41, views: 98, cover: 'https://agentwork.oss-cn-beijing.aliyuncs.com/agentworks/covers/content/202607/20260702034107-2852d92664558bb3.jpg' },
];
let eventFilter = { q: '', category: '' };

function iconSvg(key, cls) {
  return '<svg class="' + (cls || 'nav-svg') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[key] + '</svg>';
}
const CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>';

function currentPageKey() {
  if (document.body.dataset.page === 'benefits' && location.hash === '#claims') return 'claims';
  return document.querySelector('[data-front-design-page]')?.dataset.frontDesignPage || document.body.dataset.page || 'replays';
}

function pageHref(key) {
  return PAGE_LINKS[key] || '#';
}

function isCurrentNavKey(key) {
  const page = currentPageKey();
  return key === page || (key === 'benefits' && page === 'claims');
}

function navItemHtml(item, quick) {
  const cls = ['nav-item'];
  if (isCurrentNavKey(item.key)) cls.push('active');
  if (item.expandable && isCurrentNavKey(item.key)) cls.push('expanded');
  if (quick) cls.push('quick-item');
  let trailing = '';
  if (item.badge) trailing = '<span class="nav-badge">' + item.badge + '</span>';
  else if (item.expandable) trailing = '<span class="nav-chevron">' + iconSvg('chevron', 'chev-svg') + '</span>';
  let block = '<a href="' + pageHref(item.key) + '" class="' + cls.join(' ') + '" data-key="' + item.key + '">' +
    '<span class="nav-icon">' + iconSvg(item.icon) + '</span><span class="nav-label">' + item.label + '</span>' + trailing + '</a>';
  if (item.children) {
    block += '<div class="nav-subitems' + (isCurrentNavKey(item.key) ? ' open' : '') + '" id="subitems-' + item.key + '">' +
      item.children.map(c => '<a href="' + pageHref(c.key) + '" class="nav-subitem' + (currentPageKey() === c.key ? ' active' : '') + '" data-key="' + c.key + '">' + iconSvg(c.icon) + c.label + '</a>').join('') +
      '</div>';
  }
  return block;
}

function renderNav() {
  const nav = document.getElementById('sideNav');
  const bottom = document.getElementById('bottomNav');
  const moreGrid = document.getElementById('moreGrid');
  if (!nav || !bottom || !moreGrid) return;
  let html = '';
  NAV_GROUPS.forEach(group => {
    if (group.quick) {
      html += '<div class="side-nav-quick">' + group.items.map(it => navItemHtml(it, true)).join('') + '</div>';
    } else {
      html += '<div class="side-nav-label">' + group.label + '</div>';
      html += '<div class="side-nav-group">' + group.items.map(it => navItemHtml(it, false)).join('') + '</div>';
    }
  });
  html += '<div class="side-nav-utility">' + UTILITY_ITEMS.map(it => navItemHtml(it, false)).join('') + '</div>';
  nav.innerHTML = html;

  let bhtml = BOTTOM_KEYS.map(key => {
    const item = TOP_LEVEL_ITEMS.find(i => i.key === key);
    const cls = 'mobile-bottom-item' + (isCurrentNavKey(item.key) ? ' active' : '');
    return '<a class="' + cls + '" href="' + pageHref(item.key) + '" data-key="' + item.key + '">' + iconSvg(item.icon) + '<span>' + item.label + '</span></a>';
  }).join('');
  bhtml += '<button type="button" class="mobile-bottom-item" id="moreToggle">' + iconSvg('more') + '<span>更多</span></button>';
  bottom.innerHTML = bhtml;

  moreGrid.innerHTML = TOP_LEVEL_ITEMS.map(item => {
    const cls = 'mobile-more-item' + (isCurrentNavKey(item.key) ? ' active' : '');
    return '<a class="' + cls + '" href="' + pageHref(item.key) + '" data-key="' + item.key + '">' + iconSvg(item.icon) + '<span>' + item.label + '</span></a>';
  }).join('');

  document.querySelectorAll('[data-key]').forEach(el => {
    el.addEventListener('click', (e) => {
      const key = el.dataset.key;
      const href = pageHref(key);
      if (!href || href === '#') {
        e.preventDefault();
        const labelEl = el.querySelector('.nav-label');
        const label = labelEl ? labelEl.textContent.trim() : el.textContent.trim();
        toast('该入口暂未开放（' + label + '）');
      }
    });
  });

  document.getElementById('moreToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('moreSheet').classList.add('show');
    document.getElementById('moreBackdrop').classList.add('show');
  });
  document.getElementById('moreBackdrop').onclick = () => {
    document.getElementById('moreSheet').classList.remove('show');
    document.getElementById('moreBackdrop').classList.remove('show');
  };
}

/* ---- Toast ---- */
let toastTimer = null;
function toast(msg) {
  let el = document.getElementById('mockToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mockToast';
    el.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translateX(-50%);z-index:200;' +
      'background:#201515;color:#fffefb;padding:10px 16px;border-radius:12px;font-size:13px;' +
      'box-shadow:0 10px 30px rgba(32,21,21,.3);opacity:0;transition:opacity .2s ease;pointer-events:none;white-space:nowrap;max-width:86vw;overflow:hidden;text-overflow:ellipsis;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 1800);
}

/* ---- 首页轮播 ---- */
let bannerIndex = 0, bannerTimer = null;
function renderBanners() {
  const stage = document.getElementById('bannerStage');
  stage.innerHTML = BANNERS.map((b, i) => {
    const tagHtml = b.live
      ? '<span class="type-tag live">' + b.tag + '</span>'
      : '<span class="type-tag">' + b.tag + '</span>';
    return '<a href="#" class="home-banner-slide' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" onclick="return false;">' +
      '<div class="home-banner-image ' + b.glow + '"><img src="https://picsum.photos/seed/' + b.image + '/1200/620" alt="" loading="lazy"></div>' +
      '<div class="home-banner-copy">' + tagHtml +
        '<h2>' + b.title + '</h2>' +
        '<p>' + b.desc + '</p>' +
        '<span class="home-banner-cta">' + b.cta + '</span>' +
      '</div>' +
    '</a>';
  }).join('');

  const rail = document.getElementById('bannerRail');
  rail.innerHTML = BANNERS.map((_, i) =>
    '<span class="home-banner-progress" data-i="' + i + '"><span></span></span>').join('');
  rail.querySelectorAll('.home-banner-progress').forEach(seg => {
    seg.addEventListener('click', () => goToBanner(parseInt(seg.dataset.i, 10)));
  });
  updateBannerUI();
  startBannerTimer();
}

function updateBannerUI() {
  document.querySelectorAll('.home-banner-slide').forEach((el, i) => el.classList.toggle('active', i === bannerIndex));
  document.querySelectorAll('.home-banner-progress').forEach((el, i) => {
    el.classList.toggle('active', i === bannerIndex);
    el.classList.toggle('complete', i < bannerIndex);
  });
}

function goToBanner(i) {
  bannerIndex = (i + BANNERS.length) % BANNERS.length;
  updateBannerUI();
  startBannerTimer();
}
function nextBanner() { goToBanner(bannerIndex + 1); }
function startBannerTimer() {
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(nextBanner, 5200);
}

document.getElementById('homeCarousel')?.addEventListener('mouseenter', () => clearTimeout(bannerTimer));
document.getElementById('homeCarousel')?.addEventListener('mouseleave', () => startBannerTimer());

/* ---- 右侧「本周动态」清单 ---- */
function renderStatusFeed() {
  document.getElementById('statusFeed').innerHTML = STATUS_FEED.map((s, i) =>
    '<a href="#" class="system-row' + (s.lead ? ' system-row--lead' : '') + ' rise-in" style="animation-delay:' + (i * 55) + 'ms" onclick="return false;">' +
      '<span class="system-row-index"><strong>' + String(i + 1).padStart(2, '0') + '</strong><small>' + s.kind + '</small></span>' +
      '<span class="system-row-body"><strong>' + s.title + '</strong><span class="system-row-meta"><span class="system-row-category">' + s.kind + '</span><p>' + s.meta + '</p></span></span>' +
      '<span class="system-row-stat"><strong>' + s.value + '</strong><span>' + s.unit + '</span><span class="system-row-spark" aria-hidden="true">' +
        s.bars.map(bar => '<i style="--bar:' + bar + '"></i>').join('') +
      '</span></span>' +
    '</a>').join('');
}

/* ---- 内容：首个为精选大卡，其余为紧凑列表 ---- */
function renderContent() {
  const [featured, ...rest] = CONTENT;

  /* 注意：这层最外容器不能再用 <a>——里面还嵌着「预约提醒」这个独立可点击的 <a>，
     <a> 套 <a> 是非法 HTML，浏览器会把外层 <a> 提前截断，导致封面和内容裂成两块
     （这正是要修的那个 bug）。整卡点击改用 <div onclick>，内部保留一个真正的 <a>。 */
  document.getElementById('featuredSlot').innerHTML =
    '<div class="featured-card rise-in" onclick="toast(\'演示卡片：查看详情\')">' +
      '<div class="featured-media"><img src="' + featured.cover + '" alt="" loading="lazy"></div>' +
      '<div class="featured-content">' +
        '<div class="featured-meta-line">' + featured.type + ' · ' + featured.meta.split(' · ')[0] + '</div>' +
        '<h3>' + featured.title + '</h3>' +
        '<p class="summary">' + featured.summary + '</p>' +
        '<div class="featured-foot"><span class="featured-meta">' + featured.meta.split(' · ')[1] + '</span>' +
          '<a class="link-arrow" href="#" onclick="event.preventDefault();event.stopPropagation();toast(\'演示按钮：预约提醒\')">预约提醒' + CHEVRON + '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById('rowList').innerHTML = rest.map((c, i) =>
    '<a href="#" class="row-item rise-in" style="animation-delay:' + (i * 40) + 'ms" onclick="event.preventDefault();toast(\'演示卡片：查看详情\')">' +
      '<span class="row-thumb"><img src="' + c.cover + '" alt="" loading="lazy"><span class="cover-mark">' + c.mark + '</span></span>' +
      '<span class="row-body"><h4>' + c.title + '</h4>' +
        '<span class="row-meta"><span class="type-tag">' + c.type + '</span><span class="dim">' + c.dim + '</span></span>' +
      '</span>' +
      '<span class="row-chevron">' + CHEVRON + '</span>' +
    '</a>').join('');
}

/* ---- 福利：Insights Card 派生卡片（design.md） ---- */
function renderBenefits() {
  document.getElementById('voucherList').innerHTML = BENEFITS.map((b, i) => {
    const priceHtml = b.isFree
      ? '<span class="voucher-price free"><strong>免费</strong></span>'
      : '<span class="voucher-price"><strong>' + b.price + '</strong>' + (b.unit ? '<small>' + b.unit + '</small>' : '') + '</span>';
    return '<a href="#" class="voucher-card rise-in" style="animation-delay:' + (i * 40) + 'ms" onclick="event.preventDefault();toast(\'演示按钮：' + b.action + '\')">' +
      '<div class="voucher-media"><img src="https://picsum.photos/seed/' + b.seed + '/640/373" alt="" loading="lazy"></div>' +
      '<div class="voucher-content">' +
        '<div class="voucher-meta">' + b.category + ' · ' + b.stock + '</div>' +
        '<h4>' + b.title + '</h4>' +
        '<div class="voucher-foot">' + priceHtml + '<span class="voucher-claim">' + b.action + '</span></div>' +
      '</div>' +
    '</a>';
  }).join('');
}

/* ---- 福利页：参考图信息复刻 + 搜索 / 分类 / 排序 ---- */
function benefitCategories() {
  return [...new Set(BENEFITS.map(benefit => benefit.category))];
}

function filteredBenefitItems() {
  const q = benefitFilter.q.trim().toLowerCase();
  return BENEFITS
    .filter(benefit => {
      if (benefitFilter.category && benefit.category !== benefitFilter.category) return false;
      if (!q) return true;
      return (benefit.title + benefit.category + benefit.desc + benefit.stock).toLowerCase().includes(q);
    })
    .slice()
    .sort((a, b) => {
      if (benefitFilter.sort === 'order') return BENEFITS.indexOf(a) - BENEFITS.indexOf(b);
      return b.stockValue - a.stockValue;
    });
}

function benefitVisualHtml(benefit) {
  if (benefit.visual === 'gufa') {
    return '<div class="course-card-media benefit-card-visual gufa">' +
      '<div class="benefit-brand-gufa"><span class="gufa-mark"><span></span><span></span><span></span><span></span><i></i></span><span>古法手搓 <small>PLUS</small></span></div>' +
    '</div>';
  }
  if (benefit.visual === 'mole') {
    return '<div class="course-card-media benefit-card-visual mole">' +
      '<div class="mole-browser">' +
        '<div class="mole-bar"><strong>Mole</strong><span>概览</span><span>功能</span><span>口碑</span><span>定价</span><span>常见问题</span><span>博客</span></div>' +
        '<div class="mole-hero"><div class="mole-title">Mole <span>鼹</span></div><p class="mole-sub">清理缓存、管理 App、运行维护、分析磁盘、查看实时状态。</p><p class="mole-meta">$19 一次购买 · 免费试用 · 永久更新 · macOS 14+</p></div>' +
      '</div>' +
    '</div>';
  }
  return '<div class="course-card-media benefit-card-visual flomo">' +
    '<div class="flomo-logo"><span class="flomo-mark"></span><span>flomo</span></div>' +
  '</div>';
}

function renderBenefitFilter() {
  const filters = [{ key: '', label: '全部', count: BENEFITS.length, tone: '' }]
    .concat(benefitCategories().map(category => {
      const sample = BENEFITS.find(benefit => benefit.category === category);
      return { key: category, label: category, count: BENEFITS.filter(benefit => benefit.category === category).length, tone: sample ? sample.tone : '' };
    }));
  document.getElementById('benefitCategoryFilter').innerHTML = filters.map(filter =>
    '<button type="button" class="course-chip benefit-filter-chip' + (benefitFilter.category === filter.key ? ' active' : '') + '" data-benefit-category="' + filter.key + '">' +
      filter.label + '<span class="dim benefit-filter-count">' + filter.count + '</span></button>'
  ).join('');
  document.querySelectorAll('[data-benefit-category]').forEach(button => {
    button.addEventListener('click', () => {
      benefitFilter.category = button.dataset.benefitCategory;
      renderBenefitFilter();
      renderBenefitActivityGrid();
    });
  });
}

function renderBenefitActivityGrid() {
  const list = filteredBenefitItems();
  const grid = document.getElementById('benefitActivityGrid');
  document.getElementById('benefitEmpty').classList.toggle('hidden', list.length > 0);
  grid.innerHTML = list.map((benefit, i) => {
    const priceLabel = benefit.isFree ? '免费' : benefit.price + ' ' + benefit.unit;
    return '<article class="course-card event-card benefit-card rise-in" style="animation-delay:' + (i * 40) + 'ms" tabindex="0" role="button" aria-label="查看福利：' + benefit.title + '" onclick="toast(\'演示福利：' + benefit.title + '\')">' +
      '<header class="course-card-header">' +
        '<div class="course-card-avatar" aria-hidden="true"></div>' +
        '<div class="course-card-identity"><strong>AgentWork</strong><span>会员福利</span></div>' +
        '<button type="button" class="course-card-menu" aria-label="更多福利操作：' + benefit.title + '" onclick="event.stopPropagation();toast(\'演示按钮：更多福利操作\')">' + iconSvg('moreDots', 'course-menu-svg') + '</button>' +
      '</header>' +
      benefitVisualHtml(benefit) +
      '<div class="course-card-body">' +
        '<h4>' + benefit.title + '</h4>' +
        '<div class="course-card-tags">' +
          '<span class="course-card-tag">' + benefit.category + '</span>' +
          '<span class="course-card-tag">' + priceLabel + '</span>' +
          '<span class="course-card-tag">' + benefit.stock + '</span>' +
        '</div>' +
        '<p class="course-card-summary">' + benefit.desc + '</p>' +
        '<div class="course-card-facts">' +
          '<div class="course-card-fact"><span class="course-card-fact-icon">' + iconSvg('token', 'course-fact-svg') + '</span><span>' + priceLabel + '</span></div>' +
          '<div class="course-card-fact"><span class="course-card-fact-icon">' + iconSvg('benefits', 'course-fact-svg') + '</span><span>' + benefit.stock + '</span></div>' +
        '</div>' +
        '<div class="benefit-card-actions">' +
          '<button type="button" class="course-card-cta" onclick="event.stopPropagation();toast(\'演示按钮：兑换说明\')">兑换说明</button>' +
          '<button type="button" class="course-card-cta" onclick="event.stopPropagation();toast(\'演示按钮：登录后领取\')">登录后领取</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');
  grid.querySelectorAll('.benefit-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toast('演示福利：查看详情');
    });
  });
}

function renderBenefitActivity() {
  renderBenefitFilter();
  renderBenefitActivityGrid();
  document.getElementById('benefitSearch').addEventListener('input', event => {
    benefitFilter.q = event.target.value;
    renderBenefitActivityGrid();
  });
  document.querySelectorAll('[data-benefit-sort]').forEach(button => {
    button.addEventListener('click', () => {
      benefitFilter.sort = button.dataset.benefitSort;
      document.querySelectorAll('[data-benefit-sort]').forEach(sortButton => {
        sortButton.classList.toggle('active', sortButton.dataset.benefitSort === benefitFilter.sort);
      });
      renderBenefitActivityGrid();
    });
  });
}

/* ---- 学习路径：真实课程数据渲染 + tab 切换 ---- */
function renderLearningPaths() {
  const tabsEl = document.getElementById('pathTabs');
  const panelsEl = document.getElementById('pathPanels');

  tabsEl.innerHTML = LEARNING_PATHS.map((p, i) =>
    '<button type="button" class="path-tab' + (i === 0 ? ' active' : '') + '" data-path="' + p.key + '" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
      '<span class="path-tab-icon">' + iconSvg(p.icon, 'path-tab-svg') + '</span><span>' + p.label + '</span>' +
    '</button>').join('');

  panelsEl.innerHTML = LEARNING_PATHS.map((p, i) =>
    '<div class="path-panel' + (i === 0 ? ' active' : '') + '" data-path-panel="' + p.key + '">' +
      '<div class="path-summary">' +
        '<span class="path-summary-icon">' + iconSvg(p.icon) + '</span>' +
        '<div class="path-summary-copy"><h3>' + p.label + '</h3><p>' + p.desc + '</p></div>' +
        '<span class="path-count">共 ' + p.lessons.length + ' 课</span>' +
      '</div>' +
      '<div class="path-sequence-head"><h4>学习顺序</h4><span>按顺序学习 · 点击去学习打开课程阅读器</span></div>' +
      '<div class="path-lesson-list">' +
        p.lessons.map((l, li) =>
          '<div class="path-lesson">' +
            '<span class="path-lesson-index">' + String(li + 1).padStart(2, '0') + '</span>' +
            '<span class="path-lesson-body"><span class="path-lesson-eyebrow">' + l.cat + '</span><span class="path-lesson-title" title="' + l.title + '">' + l.title + '</span></span>' +
            '<a class="path-lesson-cta" href="' + l.href + '" target="_blank" rel="noopener noreferrer">去学习</a>' +
          '</div>').join('') +
      '</div>' +
    '</div>').join('');

  tabsEl.querySelectorAll('.path-tab').forEach(tab => {
    tab.addEventListener('click', () => activatePath(tab.dataset.path));
  });
}

function activatePath(key) {
  document.querySelectorAll('.path-tab').forEach(t => {
    const active = t.dataset.path === key;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.path-panel').forEach(p => {
    p.classList.toggle('active', p.dataset.pathPanel === key);
  });
}

/* ---- 课程：真实课程数据渲染 + 搜索/分类筛选（复刻 zhenganhuo.com/learning 的 list-toolbar + card-grid 结构） ---- */
function courseCategories() {
  const seen = [];
  COURSES.forEach(c => { if (!seen.includes(c.category)) seen.push(c.category); });
  return seen;
}

function filteredCourses() {
  const q = courseFilter.q.trim().toLowerCase();
  return COURSES
    .filter(c => {
      if (courseFilter.category && c.category !== courseFilter.category) return false;
      if (q && !(c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q))) return false;
      return true;
    })
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

function renderCourseFilter() {
  const cats = courseCategories();
  const chips = [{ key: '', label: '全部', count: COURSES.length }]
    .concat(cats.map(cat => ({ key: cat, label: cat, count: COURSES.filter(c => c.category === cat).length })));
  document.getElementById('courseCategoryFilter').innerHTML = chips.map(chip =>
    '<button type="button" class="course-chip' + (courseFilter.category === chip.key ? ' active' : '') + '" data-course-cat="' + chip.key + '">' +
      chip.label + '<span class="dim">' + chip.count + '</span>' +
    '</button>').join('');
  document.querySelectorAll('[data-course-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      courseFilter.category = btn.dataset.courseCat;
      renderCourseFilter();
      renderCourseGrid();
    });
  });
}

function renderCourseGrid() {
  const list = filteredCourses();
  const grid = document.getElementById('courseGrid');
  const empty = document.getElementById('courseEmpty');
  empty.classList.toggle('hidden', list.length > 0);
  grid.innerHTML = list.map((c, i) =>
    '<article class="course-card rise-in" style="animation-delay:' + (i * 40) + 'ms" tabindex="0" role="button" aria-label="查看课程：' + c.title + '" onclick="toast(\'演示卡片：查看课程详情\')">' +
      '<header class="course-card-header">' +
        '<div class="course-card-avatar" data-course-id="' + c.id + '" aria-hidden="true"></div>' +
        '<div class="course-card-identity"><strong>AgentWork</strong><span>Updated Jul, 2026</span></div>' +
        '<button type="button" class="course-card-menu" aria-label="更多课程操作：' + c.title + '" onclick="event.stopPropagation();toast(\'演示按钮：更多课程操作\')">' + iconSvg('moreDots', 'course-menu-svg') + '</button>' +
      '</header>' +
      '<div class="course-card-media"><img src="' + c.cover + '" alt="' + c.title + ' 课程封面" loading="lazy"></div>' +
      '<div class="course-card-body">' +
        '<h4>' + c.title + '</h4>' +
        '<div class="course-card-tags">' +
          '<span class="course-card-tag">' + c.category + '</span>' +
          '<span class="course-card-tag">' + c.lessonCount + ' 讲</span>' +
          '<span class="course-card-tag">课程</span>' +
        '</div>' +
        '<p class="course-card-summary">' + c.summary + '</p>' +
        '<div class="course-card-facts">' +
          '<div class="course-card-fact"><span class="course-card-fact-icon">' + iconSvg('statUsers', 'course-fact-svg') + '</span><span>' + c.learnerCount + ' 人学过</span></div>' +
          '<div class="course-card-fact"><span class="course-card-fact-icon">' + iconSvg('statViews', 'course-fact-svg') + '</span><span>' + c.viewCount + ' 次学习</span></div>' +
        '</div>' +
      '</div>' +
    '</article>').join('');
  grid.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toast('演示卡片：查看课程详情');
    });
  });
}

function renderCourses() {
  renderCourseFilter();
  renderCourseGrid();
  document.getElementById('courseSearch').addEventListener('input', (e) => {
    courseFilter.q = e.target.value;
    renderCourseGrid();
  });
}

/* ---- 案例：参考图信息 + 活动页同款卡片 ---- */
function caseCategories() {
  return [...new Set(CASES.map(item => item.category))];
}

function filteredCases() {
  const q = caseFilter.q.trim().toLowerCase();
  return CASES
    .filter(item => {
      if (caseFilter.category && item.category !== caseFilter.category) return false;
      return !q || (item.title + item.category + item.desc + item.access).toLowerCase().includes(q);
    })
    .slice()
    .sort((a, b) => {
      if (caseFilter.sort === 'order') return a.sortOrder - b.sortOrder;
      return CASES.indexOf(a) - CASES.indexOf(b);
    });
}

function renderCaseFilter() {
  const filters = [{ key: '', label: '全部', count: CASES.length }]
    .concat(caseCategories().map(category => ({ key: category, label: category, count: CASES.filter(item => item.category === category).length })));
  document.getElementById('caseCategoryFilter').innerHTML = filters.map(filter =>
    '<button type="button" class="course-chip case-filter-chip' + (caseFilter.category === filter.key ? ' active' : '') + '" data-case-category="' + filter.key + '">' +
      filter.label + '<span class="dim case-filter-count">' + filter.count + '</span></button>'
  ).join('');
  document.querySelectorAll('[data-case-category]').forEach(button => {
    button.addEventListener('click', () => {
      caseFilter.category = button.dataset.caseCategory;
      renderCaseFilter();
      renderCasesGrid();
    });
  });
}

function renderCasesGrid() {
  const cases = filteredCases();
  const grid = document.getElementById('casesGrid');
  document.getElementById('casesEmpty').classList.toggle('hidden', cases.length > 0);
  grid.innerHTML = cases.map((item, i) =>
    '<article class="case-card rise-in" style="animation-delay:' + (i * 40) + 'ms" tabindex="0" role="button" aria-label="查看案例：' + item.title + '" onclick="toast(\'演示页面：案例详情\')">' +
      '<div class="case-card-cover">' +
        '<img src="' + item.cover + '" alt="' + item.title + ' 案例封面" loading="lazy">' +
        '<div class="case-card-tags" aria-label="案例标签">' +
          '<span class="case-card-tag">' + item.category + '</span>' +
          '<span class="case-card-tag">AI</span>' +
          '<span class="case-card-tag">案例</span>' +
          '<span class="case-card-tag">' + item.access + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="case-card-content">' +
        '<h4 class="case-card-title">' + item.title + '</h4>' +
        '<div class="case-card-stats">' +
          '<span class="case-card-stat" aria-label="' + item.members + ' 人参与"><span class="case-card-stat-icon">' + iconSvg('statUsers', 'case-card-stat-svg') + '</span><span>' + item.members + '</span></span>' +
          '<span class="case-card-stat" aria-label="' + item.views + ' 次浏览"><span class="case-card-stat-icon case-card-stat-icon-lg">' + iconSvg('statViews', 'case-card-stat-svg') + '</span><span>' + item.views + '</span></span>' +
        '</div>' +
        '<p class="case-card-desc">' + item.desc + '</p>' +
        '<span class="case-card-action">查看案例</span>' +
      '</div>' +
    '</article>'
  ).join('');
  grid.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toast('演示页面：案例详情');
    });
  });
}

function renderCases() {
  renderCaseFilter();
  renderCasesGrid();
  document.getElementById('caseSearch').addEventListener('input', event => {
    caseFilter.q = event.target.value;
    renderCasesGrid();
  });
  document.querySelectorAll('[data-case-sort]').forEach(button => {
    button.addEventListener('click', () => {
      caseFilter.sort = button.dataset.caseSort;
      document.querySelectorAll('[data-case-sort]').forEach(sortButton => {
        sortButton.classList.toggle('active', sortButton.dataset.caseSort === caseFilter.sort);
      });
      renderCasesGrid();
    });
  });
}

/* ---- 活动：复刻 /events 的搜索、类别筛选和参考卡片 ---- */
function eventCategories() {
  return [...new Set(EVENTS.map(event => event.category))];
}

function filteredEvents() {
  const q = eventFilter.q.trim().toLowerCase();
  return EVENTS.filter(event => {
    if (eventFilter.category && event.category !== eventFilter.category) return false;
    return !q || (event.title + event.category + event.desc + event.focus).toLowerCase().includes(q);
  });
}

function renderEventFilter() {
  const filters = [{ key: '', label: '全部', count: EVENTS.length }]
    .concat(eventCategories().map(category => ({ key: category, label: category, count: EVENTS.filter(event => event.category === category).length })));
  document.getElementById('eventCategoryFilter').innerHTML = filters.map(filter =>
    '<button type="button" class="course-chip event-filter-chip' + (eventFilter.category === filter.key ? ' active' : '') + '" data-event-category="' + filter.key + '">' +
      filter.label + '<span class="dim event-filter-count">' + filter.count + '</span></button>'
  ).join('');
  document.querySelectorAll('[data-event-category]').forEach(button => {
    button.addEventListener('click', () => {
      eventFilter.category = button.dataset.eventCategory;
      renderEventFilter();
      renderEventsGrid();
    });
  });
}

function renderEventsGrid() {
  const events = filteredEvents();
  const grid = document.getElementById('eventsGrid');
  document.getElementById('eventsEmpty').classList.toggle('hidden', events.length > 0);
  grid.innerHTML = events.map((event, i) =>
    '<article class="event-card rise-in" style="animation-delay:' + (i * 40) + 'ms" tabindex="0" role="button" aria-label="查看活动：' + event.title + '" onclick="toast(\'演示页面：活动详情\')">' +
      '<div class="event-card-cover">' +
        '<img src="' + event.cover + '" alt="' + event.title + ' 活动封面" loading="lazy">' +
        '<div class="event-card-tags" aria-label="活动标签">' +
          '<span class="event-card-tag">' + event.category + '</span>' +
          '<span class="event-card-tag">活动</span>' +
          '<span class="event-card-tag">会员专享</span>' +
          '<span class="event-card-tag">' + event.members + '人</span>' +
        '</div>' +
      '</div>' +
      '<div class="event-card-body">' +
        '<h4>' + event.title + '</h4>' +
        '<div class="event-card-stats">' +
          '<span class="event-card-stat" aria-label="' + event.members + ' 人参与"><span class="event-card-stat-icon">' + iconSvg('statUsers', 'event-card-stat-svg') + '</span><span>' + event.members + '</span></span>' +
          '<span class="event-card-stat" aria-label="' + event.views + ' 次浏览"><span class="event-card-stat-icon event-card-stat-icon-lg">' + iconSvg('statViews', 'event-card-stat-svg') + '</span><span>' + event.views + '</span></span>' +
        '</div>' +
        '<p>' + event.desc + ' · ' + event.focus + '</p>' +
        '<span class="event-card-action">查看详情</span>' +
      '</div>' +
    '</article>'
  ).join('');
  grid.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toast('演示页面：活动详情');
    });
  });
}

function renderEvents() {
  renderEventFilter();
  renderEventsGrid();
  document.getElementById('eventSearch').addEventListener('input', event => {
    eventFilter.q = event.target.value;
    renderEventsGrid();
  });
}

/* ---- 直播：空状态工具栏演示 ---- */
function setupLiveReplayEmpty() {
  document.querySelectorAll('[data-live-sort]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-live-sort]').forEach(sortButton => {
        sortButton.classList.toggle('active', sortButton === button);
      });
    });
  });
}

function initPage() {
  renderNav();
  const page = currentPageKey();
  if (page === 'home') {
    renderBanners();
    renderStatusFeed();
    renderContent();
    renderBenefits();
  } else if (page === 'paths') {
    renderLearningPaths();
  } else if (page === 'learning') {
    if (!document.querySelector('[data-dynamic-courses]')) renderCourses();
  } else if (page === 'cases') {
    if (!document.querySelector('[data-dynamic-catalog="cases"]')) renderCases();
  } else if (page === 'events') {
    if (!document.querySelector('[data-dynamic-catalog="events"]')) renderEvents();
  } else if (page === 'replays') {
    setupLiveReplayEmpty();
  } else if (page === 'benefits') {
    renderBenefitActivity();
    if (location.hash === '#claims') {
      requestAnimationFrame(() => {
        document.getElementById('benefitClaimsTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
}

if (window.__frontDesignNavigateHandler) {
  window.removeEventListener('front-design:navigate', window.__frontDesignNavigateHandler);
}
window.__frontDesignNavigateHandler = initPage;
window.addEventListener('front-design:navigate', window.__frontDesignNavigateHandler);
initPage();
