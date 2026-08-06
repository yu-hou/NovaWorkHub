/* Auto-generated from docs/research/zhenganhuo.com/platform/content-bundle.json */

export type CategoryChip = {
  value: string;
  label: string;
  count: string | number;
  categoryClass?: string | null;
  className?: string;
};

export type PlatformCard = {
  id?: string;
  title: string;
  category?: string | null;
  categoryClass?: string | null;
  summary?: string | null;
  cover?: string | null;
  learners?: string | null;
  views?: string | null;
  cta: string;
  locked?: boolean;
  contentId?: string | null;
  href?: string | null;
  free?: boolean;
  priceLabel?: string;
  priceUnit?: string;
  stock?: string | null;
  instructionsHref?: string | null;
  claimId?: string | null;
};

export type ListPageContent = {
  searchPlaceholder: string;
  defaultSort: "newest" | "sequence" | string;
  emptyText: string;
  categories: CategoryChip[];
  cards: PlatformCard[];
};

export type LearningPathLesson = {
  index: string;
  category: string;
  categoryClass: string;
  title: string;
  href: string;
};

export type LearningPath = {
  id: string;
  tone: string;
  label: string;
  description: string;
  count: string;
  lessons: LearningPathLesson[];
};

export type TokenRankRow = {
  rank: number;
  name: string;
  tokens: string;
  avatar: string | null;
  avatarInitial: string | null;
  isMember: boolean;
  tools: { tool: string; tokens: string; color: string }[];
};

export const LEARNING_PAGE: ListPageContent = {
  "searchPlaceholder": "搜索课程",
  "defaultSort": "sequence",
  "emptyText": "暂无课程。",
  "categories": [
    {
      "value": "",
      "label": "全部",
      "count": "6"
    },
    {
      "value": "基础课",
      "label": "基础课",
      "count": "2",
      "categoryClass": "category-gold"
    },
    {
      "value": "系统课",
      "label": "系统课",
      "count": "2",
      "categoryClass": "category-rose"
    },
    {
      "value": "AI Coding",
      "label": "AI Coding",
      "count": "1",
      "categoryClass": "category-gold"
    },
    {
      "value": "AI Agent",
      "label": "AI Agent",
      "count": "1",
      "categoryClass": "category-violet"
    }
  ],
  "cards": [
    {
      "id": "5",
      "title": "社群使用说明书",
      "category": "基础课",
      "categoryClass": "category-gold",
      "summary": "进入社群后需要做些什么，社群课程内容如何学习，福利、权益如何领取",
      "cover": "/images/zhenganhuo/platform/courses/20260704011901-e1f8c89b3c37a12d.png",
      "learners": "143",
      "views": "512",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    },
    {
      "id": "1",
      "title": "小白 AI 通识",
      "category": "基础课",
      "categoryClass": "category-gold",
      "summary": "AI 基础知识通识",
      "cover": "/images/zhenganhuo/platform/courses/20260702021804-23eff75c1282352a.jpg",
      "learners": "101",
      "views": "1,080",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    },
    {
      "id": "6",
      "title": "Codex从小白到专家",
      "category": "系统课",
      "categoryClass": "category-rose",
      "summary": "从零开始，系统学习Codex",
      "cover": "/images/zhenganhuo/platform/courses/20260709182916-9aef42664d538784.png",
      "learners": "130",
      "views": "1,195",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    },
    {
      "id": "4",
      "title": "AI 智能体串讲",
      "category": "系统课",
      "categoryClass": "category-rose",
      "summary": "从 0 到 1 入门 AI Agent 智能体，文档课程，建议快速通读了解即可，walkflow的部分可以跳过。",
      "cover": "/images/zhenganhuo/platform/courses/20260702024718-0c62fad9ef1e8817.jpg",
      "learners": "61",
      "views": "616",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    },
    {
      "id": "2",
      "title": "AI 编程",
      "category": "AI Coding",
      "categoryClass": "category-gold",
      "summary": "黄叔讲解 AI 编程的课程，后续会进行重构拆解",
      "cover": "/images/zhenganhuo/platform/courses/20260702024125-6afb170b465be54d.jpg",
      "learners": "44",
      "views": "367",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    },
    {
      "id": "3",
      "title": "AI Skills",
      "category": "AI Agent",
      "categoryClass": "category-violet",
      "summary": "AI skills系统课程，后期拆解重构",
      "cover": "/images/zhenganhuo/platform/courses/20260702024259-0507cce3ca683f52.jpg",
      "learners": "83",
      "views": "730",
      "href": "#",
      "cta": "查看课程",
      "locked": false
    }
  ]
};

export const EVENTS_PAGE: ListPageContent = {
  "searchPlaceholder": "搜索活动",
  "defaultSort": "newest",
  "emptyText": "暂无活动内容。",
  "categories": [
    {
      "value": "",
      "label": "全部",
      "count": 4,
      "categoryClass": null
    },
    {
      "value": "黑客松",
      "label": "黑客松",
      "count": 4,
      "categoryClass": "category-green"
    }
  ],
  "cards": [
    {
      "title": "第一届Skills 黑客松（上）",
      "category": "黑客松",
      "categoryClass": "category-green",
      "summary": "第一届社群黑客松活动，第一天",
      "cover": "/images/zhenganhuo/platform/content/20260702034107-2852d92664558bb3.jpg",
      "learners": "38",
      "views": "77",
      "cta": "会员专享",
      "locked": true,
      "contentId": "1"
    },
    {
      "title": "第一届 Skills 黑客松（下）",
      "category": "黑客松",
      "categoryClass": "category-green",
      "summary": "第二天",
      "cover": "/images/zhenganhuo/platform/content/20260704002453-e6fe99f42d9dbcbb.jpg",
      "learners": "6",
      "views": "16",
      "cta": "会员专享",
      "locked": true,
      "contentId": "12"
    },
    {
      "title": "第二届 Skills 黑客松（上）",
      "category": "黑客松",
      "categoryClass": "category-green",
      "summary": "第二届社群 Skills 大赛",
      "cover": "/images/zhenganhuo/platform/content/20260707154304-440b284fd8334354.jpg",
      "learners": "8",
      "views": "18",
      "cta": "会员专享",
      "locked": true,
      "contentId": "29"
    },
    {
      "title": "第二届 Skills 黑客松（下）",
      "category": "黑客松",
      "categoryClass": "category-green",
      "summary": "第二天",
      "cover": "/images/zhenganhuo/platform/content/20260707155545-47f69ac35752c5bc.jpg",
      "learners": "16",
      "views": "34",
      "cta": "会员专享",
      "locked": true,
      "contentId": "30"
    }
  ]
};

export const CASES_PAGE: ListPageContent = {
  "searchPlaceholder": "搜索案例",
  "defaultSort": "newest",
  "emptyText": "暂无案例内容。",
  "categories": [
    {
      "value": "",
      "label": "全部",
      "count": 1,
      "categoryClass": null
    },
    {
      "value": "商业化",
      "label": "商业化",
      "count": 1,
      "categoryClass": "category-rose"
    }
  ],
  "cards": [
    {
      "title": "电商运营，独立开发商品图生成工具",
      "category": "商业化",
      "categoryClass": "category-rose",
      "summary": "38岁非技术的前电商运营人，靠vibe coding，从月入3千到变现10W+只用了四个月",
      "cover": "/images/zhenganhuo/platform/content/20260708002659-a70d7abfbed3fcfa.jpg",
      "learners": "60",
      "views": "135",
      "cta": "会员专享",
      "locked": true,
      "contentId": "31"
    }
  ]
};

export const REPLAYS_PAGE: ListPageContent = {
  "searchPlaceholder": "搜索直播或回看",
  "defaultSort": "newest",
  "emptyText": "暂无直播回看。",
  "categories": [
    {
      "value": "",
      "label": "全部",
      "count": 0,
      "categoryClass": null
    }
  ],
  "cards": []
};

export const BENEFITS_PAGE: ListPageContent = {
  "searchPlaceholder": "搜索福利",
  "defaultSort": "newest",
  "emptyText": "暂无已上架福利。",
  "categories": [
    {
      "value": "",
      "label": "全部",
      "count": 3,
      "categoryClass": null
    },
    {
      "value": "码",
      "label": "码",
      "count": 1,
      "categoryClass": "category-violet"
    },
    {
      "value": "实用工具",
      "label": "实用工具",
      "count": 1,
      "categoryClass": "category-rose"
    },
    {
      "value": "AI 产品",
      "label": "AI 产品",
      "count": 1,
      "categoryClass": "category-gold"
    }
  ],
  "cards": [
    {
      "title": "flomoMax 30天会员激活码",
      "category": "AI 产品",
      "categoryClass": "category-gold",
      "summary": "抢先体验 flomo AI 功能，支持微信接入flomo agent，通过 MCP 调用卡片笔记",
      "cover": "/images/zhenganhuo/platform/benefits/20260721020618-2305617ac398dec1.jpg",
      "learners": null,
      "views": null,
      "cta": "登录后领取",
      "locked": false,
      "contentId": null,
      "free": false,
      "priceLabel": "80",
      "priceUnit": "积分",
      "stock": "库存 28",
      "instructionsHref": "https://help.flomoapp.com/membership/redeem.html",
      "claimId": "2"
    },
    {
      "title": "Mole 75折优惠码",
      "category": "实用工具",
      "categoryClass": "category-rose",
      "summary": "Mole是一款原生macOS系统工具，把缓存清理、App更新与卸载、系统维护、磁盘空间分析，以及CPU、内存、网络和风扇等实时状态整合在一个入口;清理前可逐项确认，数据不离开电脑，并提供菜单栏HUD，适合想用一款轻量工具统一维护Mac 的开发者与重度用户。",
      "cover": "/images/zhenganhuo/platform/benefits/20260722111630-2ccd25b929f8bea9.png",
      "learners": null,
      "views": null,
      "cta": "登录后领取",
      "locked": false,
      "contentId": null,
      "free": false,
      "priceLabel": "10",
      "priceUnit": "积分",
      "stock": "库存 45",
      "instructionsHref": "#",
      "claimId": "3"
    },
    {
      "title": "全网最低的Codex购买渠道",
      "category": "码",
      "categoryClass": null,
      "summary": "官方正规GPT/Claude等代充稳定渠道，黄叔社群学员下单均可返利，联系微信tianyinhou加福利购买群。 产品介绍链接到我店铺页面：https://pay.ldxp.cn/shop/FTIWLFHQ",
      "cover": "/images/zhenganhuo/platform/benefits/20260802130740-42741c02c06cc1e3.png",
      "learners": null,
      "views": null,
      "cta": "登录后领取",
      "locked": false,
      "contentId": null,
      "free": true,
      "priceLabel": "免费",
      "priceUnit": "",
      "stock": "库存不限",
      "instructionsHref": "https://pay.ldxp.cn/shop/FTIWLFHQ",
      "claimId": "5"
    }
  ]
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    "id": "ai-beginner",
    "tone": "violet",
    "label": "AI 小白入门",
    "description": "从认识社群与 AI 开始，逐步理解提示词、大模型和常见智能体。",
    "count": "共 8 课",
    "lessons": [
      {
        "index": "01",
        "category": "社群使用说明书",
        "categoryClass": "category-cyan",
        "title": "登录、激活与接入社群 Token Rank",
        "href": "#"
      },
      {
        "index": "02",
        "category": "社群使用说明书",
        "categoryClass": "category-cyan",
        "title": "认识 Nova",
        "href": "#"
      },
      {
        "index": "03",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "小白如何开始使用 AI",
        "href": "#"
      },
      {
        "index": "04",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "提示词的本质",
        "href": "#"
      },
      {
        "index": "05",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "大模型的优势与缺陷",
        "href": "#"
      },
      {
        "index": "06",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "AI 产品的本质",
        "href": "#"
      },
      {
        "index": "07",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "什么是 AI 智能体",
        "href": "#"
      },
      {
        "index": "08",
        "category": "小白 AI 通识",
        "categoryClass": "category-gold",
        "title": "最常见的 AI 智能体：联网搜索",
        "href": "#"
      }
    ]
  },
  {
    "id": "agent-productivity",
    "tone": "cyan",
    "label": "Agent 办公提效",
    "description": "适合希望马上用 Agent 提高日常工作效率的人。",
    "count": "共 4 课",
    "lessons": [
      {
        "index": "01",
        "category": "Codex 从小白到专家",
        "categoryClass": "category-violet",
        "title": "你已经在用 Agent 了",
        "href": "#"
      },
      {
        "index": "02",
        "category": "Codex 从小白到专家",
        "categoryClass": "category-violet",
        "title": "桌面端 App 入门教程",
        "href": "#"
      },
      {
        "index": "03",
        "category": "Codex 从小白到专家",
        "categoryClass": "category-violet",
        "title": "Codex 入门：整理电脑",
        "href": "#"
      },
      {
        "index": "04",
        "category": "Codex 从小白到专家",
        "categoryClass": "category-violet",
        "title": "Agent First：重新设计工作流",
        "href": "#"
      }
    ]
  },
  {
    "id": "content-creation",
    "tone": "rose",
    "label": "内容创作快线",
    "description": "适合希望快速做出文章、图文或视频内容的人。",
    "count": "共 8 课",
    "lessons": [
      {
        "index": "01",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "YouMind 入门教程",
        "href": "#"
      },
      {
        "index": "02",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "使用 YouMind + Skill 高效创造内容",
        "href": "#"
      },
      {
        "index": "03",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "Claude Code 极简入门三部曲",
        "href": "#"
      },
      {
        "index": "04",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "Claude Agent Skills 原理入门",
        "href": "#"
      },
      {
        "index": "05",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "一个提示词，生成你的专属 Skill",
        "href": "#"
      },
      {
        "index": "06",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "生成匹配你文风的三篇短文",
        "href": "#"
      },
      {
        "index": "07",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "基于内容选题产出口播稿",
        "href": "#"
      },
      {
        "index": "08",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "基于口播稿完成视频创作",
        "href": "#"
      }
    ]
  },
  {
    "id": "content-automation",
    "tone": "gold",
    "label": "内容自动化",
    "description": "适合希望把选题、抓取、改写和发布串成固定流程的人。",
    "count": "共 7 课",
    "lessons": [
      {
        "index": "01",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "结构化提示词 1：生成社群周报",
        "href": "#"
      },
      {
        "index": "02",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "结构化提示词 2：提取并改写文案",
        "href": "#"
      },
      {
        "index": "03",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "n8n 自动抓取指定公众号内容（上）",
        "href": "#"
      },
      {
        "index": "04",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "n8n 自动改写并发布（下）",
        "href": "#"
      },
      {
        "index": "05",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "内容选题：抓取微信公众号文章",
        "href": "#"
      },
      {
        "index": "06",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "基于内容选题产出口播稿",
        "href": "#"
      },
      {
        "index": "07",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "OpenClaw + Skill 直出公众号文章",
        "href": "#"
      }
    ]
  },
  {
    "id": "ai-product-building",
    "tone": "green",
    "label": "AI 编程做产品",
    "description": "适合希望做出网站或可上线产品的人。",
    "count": "共 4 课",
    "lessons": [
      {
        "index": "01",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "四件套入门 + 上线第一个网站",
        "href": "#"
      },
      {
        "index": "02",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "一套提示词覆盖大部分 Vibe Coding 场景",
        "href": "#"
      },
      {
        "index": "03",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "用 SeeDream 4.0 做小红书图片生成网站",
        "href": "#"
      },
      {
        "index": "04",
        "category": "AI 编程",
        "categoryClass": "category-green",
        "title": "接入 Supabase，完成登录注册 + 积分",
        "href": "#"
      }
    ]
  },
  {
    "id": "sop-to-agent",
    "tone": "blue",
    "label": "业务 SOP 变 Agent / Skill",
    "description": "适合已经有固定工作流程，希望把它封装成 Agent 或 Skill 的人。",
    "count": "共 7 课",
    "lessons": [
      {
        "index": "01",
        "category": "Codex 从小白到专家",
        "categoryClass": "category-violet",
        "title": "你已经在用 Agent 了",
        "href": "#"
      },
      {
        "index": "02",
        "category": "AI 智能体串讲",
        "categoryClass": "category-cyan",
        "title": "Agent 智能体简要介绍",
        "href": "#"
      },
      {
        "index": "03",
        "category": "AI 智能体串讲",
        "categoryClass": "category-cyan",
        "title": "Agent Skills 介绍",
        "href": "#"
      },
      {
        "index": "04",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "一个提示词，生成你的专属 Skill",
        "href": "#"
      },
      {
        "index": "05",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "使用 Claude Code 分析微信聊天记录",
        "href": "#"
      },
      {
        "index": "06",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "本地定时运行 Skills",
        "href": "#"
      },
      {
        "index": "07",
        "category": "AI Skills",
        "categoryClass": "category-rose",
        "title": "Agent Team 多 Agent 工作 + 自进化",
        "href": "#"
      }
    ]
  }
];

export const TOKEN_RANK = {
  "summaryLabel": "今天全员累计消耗 · 全部",
  "totalTokens": "60.71亿",
  "participants": "总计 74 人参与排名",
  "rows": [
    {
      "rank": 1,
      "name": "shenzzhuang",
      "tokens": "5.72亿",
      "avatar": null,
      "avatarInitial": "S",
      "isMember": false,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "4.22亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Claude Code",
          "tokens": "1.39亿",
          "color": "#77d76b"
        },
        {
          "tool": "WorkBuddy",
          "tokens": "1109.91万",
          "color": "#f59e0b"
        }
      ]
    },
    {
      "rank": 2,
      "name": "林",
      "tokens": "5.42亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260724144607-d5729262231c13bd.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "3.12亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Claude Code",
          "tokens": "2.29亿",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 3,
      "name": "十七°",
      "tokens": "5.19亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260801001922-4cae0bc9dd3ce87f.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "5.19亿",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 4,
      "name": "L",
      "tokens": "4.80亿",
      "avatar": null,
      "avatarInitial": "L",
      "isMember": true,
      "tools": [
        {
          "tool": "Z Code",
          "tokens": "3.11亿",
          "color": "#38bdf8"
        },
        {
          "tool": "Codex",
          "tokens": "1.68亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "WorkBuddy",
          "tokens": "70.70万",
          "color": "#f59e0b"
        }
      ]
    },
    {
      "rank": 5,
      "name": "白雪亮Chad",
      "tokens": "3.14亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260804120903-8c2176694b670ec6.png",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Claude Code",
          "tokens": "2.61亿",
          "color": "#77d76b"
        },
        {
          "tool": "Codex",
          "tokens": "5274.93万",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 6,
      "name": "成峰",
      "tokens": "3.00亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260720195110-70d4b76e8d593fa9.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "2.94亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Claude Code",
          "tokens": "556.24万",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 7,
      "name": "唯庸",
      "tokens": "2.96亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260625031533-a24095caadd061cd.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "2.84亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Claude Code",
          "tokens": "981.43万",
          "color": "#77d76b"
        },
        {
          "tool": "WorkBuddy",
          "tokens": "160.98万",
          "color": "#f59e0b"
        }
      ]
    },
    {
      "rank": 8,
      "name": "小付同学",
      "tokens": "2.85亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260731101212-0104125ef183c12f.png",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "2.85亿",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 9,
      "name": "Vic",
      "tokens": "2.79亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260724145701-9bfe9025b2997847.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Claude Code",
          "tokens": "2.54亿",
          "color": "#77d76b"
        },
        {
          "tool": "Codex",
          "tokens": "2444.88万",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 10,
      "name": "chieven",
      "tokens": "2.35亿",
      "avatar": null,
      "avatarInitial": "C",
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "2.34亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Hermes",
          "tokens": "77.55万",
          "color": "#b79cff"
        },
        {
          "tool": "Claude Code",
          "tokens": "2.61万",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 11,
      "name": "兆霖",
      "tokens": "1.98亿",
      "avatar": null,
      "avatarInitial": "兆",
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "1.63亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Hermes",
          "tokens": "3199.78万",
          "color": "#b79cff"
        },
        {
          "tool": "Cursor",
          "tokens": "275.22万",
          "color": "#14b8a6"
        }
      ]
    },
    {
      "rank": 12,
      "name": "梦醒时分",
      "tokens": "1.83亿",
      "avatar": null,
      "avatarInitial": "梦",
      "isMember": false,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "1.83亿",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 13,
      "name": "twc1992",
      "tokens": "1.64亿",
      "avatar": null,
      "avatarInitial": "T",
      "isMember": false,
      "tools": [
        {
          "tool": "Claude Code",
          "tokens": "1.16亿",
          "color": "#77d76b"
        },
        {
          "tool": "Codex",
          "tokens": "4823.43万",
          "color": "#8fb3ff"
        },
        {
          "tool": "Hermes",
          "tokens": "0.43万",
          "color": "#b79cff"
        }
      ]
    },
    {
      "rank": 14,
      "name": "如蓝（lairulan）",
      "tokens": "1.56亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260724155218-eae55b1fb9e78ad2.png",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "1.56亿",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 15,
      "name": "susanwululu",
      "tokens": "1.33亿",
      "avatar": null,
      "avatarInitial": "S",
      "isMember": true,
      "tools": [
        {
          "tool": "Claude Code",
          "tokens": "1.33亿",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 16,
      "name": "意疏",
      "tokens": "1.30亿",
      "avatar": "/images/zhenganhuo/platform/avatars/20260703122640-ac4e89b34469f432.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "1.22亿",
          "color": "#8fb3ff"
        },
        {
          "tool": "Claude Code",
          "tokens": "867.80万",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 17,
      "name": "大成",
      "tokens": "9642.88万",
      "avatar": "/images/zhenganhuo/platform/avatars/20260717211714-13084ff22cdabd86.png",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "9642.88万",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 18,
      "name": "qqzwind",
      "tokens": "9574.59万",
      "avatar": null,
      "avatarInitial": "Q",
      "isMember": true,
      "tools": [
        {
          "tool": "Claude Code",
          "tokens": "9574.59万",
          "color": "#77d76b"
        }
      ]
    },
    {
      "rank": 19,
      "name": "清章",
      "tokens": "9410.67万",
      "avatar": "/images/zhenganhuo/platform/avatars/20260630142553-0b6e795f08f6ce86.jpg",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "9410.67万",
          "color": "#8fb3ff"
        }
      ]
    },
    {
      "rank": 20,
      "name": "松洋",
      "tokens": "7541.64万",
      "avatar": "/images/zhenganhuo/platform/avatars/20260801180436-e67e52408f5c9bfa.png",
      "avatarInitial": null,
      "isMember": true,
      "tools": [
        {
          "tool": "Codex",
          "tokens": "7541.64万",
          "color": "#8fb3ff"
        }
      ]
    }
  ]
};

export const ABOUT_CARDS = [
  {
    title: "关于 Nova",
    titleTag: "h1" as const,
    body: "Nova 面向 AI 工具、自动化工作流和实战项目学习。课程内容、案例复盘、活动回放和会员福利会逐步沉淀在这个系统里。",
  },
  {
    title: "访问规则",
    titleTag: "h3" as const,
    body: "所有内容登录后可访问。具体付费内容或有权限要求的内容，需在左下角下拉菜单中使用权益激活码进行激活。",
  },
  {
    title: "问题反馈",
    titleTag: "h3" as const,
    body: "系统使用遇到问题，可以联系 Nova 支持团队反馈。",
  },
] as const;
